# Krishnakant Verma — Portfolio

A single-file, static portfolio site with a built-in AI assistant widget
("Ask AI about Krishnakant") that visitors can use to ask about experience,
stack, and availability.

## What's in here

```
portfolio/
├── index.html      ← the entire site (HTML + CSS + JS, no build step)
├── api/chat.js      ← optional serverless function for real Claude-powered chat
└── README.md
```

## Run it locally

Just open `index.html` in a browser — no server, no build step needed.

## Deploy it (pick one)

### Option A — Netlify (drag & drop, easiest)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `portfolio` folder in
3. Done — you get a live URL immediately

### Option B — Vercel (needed if you want the real AI backend)
1. Install the CLI: `npm i -g vercel`
2. From inside the `portfolio` folder: `vercel`
3. Follow the prompts — Vercel auto-detects `api/chat.js` as a serverless function

### Option C — GitHub Pages
1. Push this folder to a GitHub repo
2. Repo → Settings → Pages → set source to the branch/folder containing `index.html`
3. Note: GitHub Pages is static-only, so the AI widget will run in fallback mode (see below) — use Vercel if you want the live Claude backend

## About the AI assistant

The "Ask AI" widget works two ways, automatically:

1. **Out of the box (no setup):** it answers from a small built-in knowledge
   base of your résumé data using keyword matching. Works on any static host.
2. **Upgraded (Vercel only):** if you deploy `api/chat.js` and set an
   `ANTHROPIC_API_KEY` environment variable, the widget automatically starts
   sending questions to the real Claude API for natural-language answers.
   No code changes needed — `index.html` detects the backend and switches
   over on its own.

To enable the upgrade:
```bash
vercel env add ANTHROPIC_API_KEY
# paste your key from console.anthropic.com, then redeploy
vercel --prod
```

**Security note:** the API key only ever lives in the serverless function's
environment — never in `index.html` or any file sent to the browser.

## Editing content

Everything — the summary, experience bullets, skills, projects, and the
`KB` object that powers the fallback AI — lives in `index.html`. Résumé
facts are in the HTML body; the `KB` constant near the bottom `<script>`
tag is what the assistant reads from.

The three project cards marked **Concept** are proposed open-source builds
extending real patterns from your work (Outbox Pattern, CQRS, this AI
widget itself) — swap in real repo links once you publish them, or remove
the badge/note once they're shipped.
