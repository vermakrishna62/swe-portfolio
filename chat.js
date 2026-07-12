// Optional upgrade: real AI-powered answers via the Claude API.
//
// The site works with zero setup (rule-based fallback in index.html).
// Deploy this file too, on Vercel, and it upgrades the assistant to
// real Claude-generated answers automatically — index.html already
// calls POST /api/chat and falls back gracefully if this isn't present.
//
// SETUP (Vercel):
//   1. vercel env add ANTHROPIC_API_KEY   (paste your key from console.anthropic.com)
//   2. Deploy. That's it — this file is auto-detected as a serverless function.
//
// Never put your API key in index.html or any client-side file — it must
// only ever live in this server-side function's environment variable.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Use POST' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(501).json({ error: 'ANTHROPIC_API_KEY not configured' });
    return;
  }

  const { question, context } = req.body || {};
  if (!question) {
    res.status(400).json({ error: 'Missing "question" in request body' });
    return;
  }

  const systemPrompt = `You are a concise assistant embedded on Krishnakant Verma's portfolio site.
Answer recruiter/visitor questions about him using ONLY the résumé data below. Keep answers to
2-4 sentences, friendly but professional, no fluff. If asked something not covered by this data,
say you don't have that detail and suggest emailing him directly.

RÉSUMÉ DATA:
${JSON.stringify(context, null, 2)}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 400,
        system: systemPrompt,
        messages: [{ role: 'user', content: question }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(502).json({ error: 'Upstream error', detail: errText });
      return;
    }

    const data = await response.json();
    const answer = (data.content || [])
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n')
      .trim();

    res.status(200).json({ answer: answer || "I don't have a good answer for that — try emailing him directly." });
  } catch (err) {
    res.status(500).json({ error: 'Server error', detail: String(err) });
  }
}
