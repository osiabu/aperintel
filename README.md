# Aperintel

Aperintel is an intelligence infrastructure company building AI-native systems that structure and enhance intelligence across organisations, communities, and individuals.

This repository contains the official Aperintel website, deployed on Vercel with Lumen-powered AI features.

## Live Features

- **AI Chat Widget (Lumen)** — Streaming AI assistant with voice input. Knows every Aperintel product and acts as a consultative intelligence advisor. Branded as Lumen, Aperintel's intelligence layer.
- **Intelligence Score Assessment** — 5-question maturity quiz generating a personalised 0 to 100 score with strengths, gaps, and product recommendations. After results, nudges the user to start a project with pre-populated context.
- **Intelligence Brief Generator** — Enter sector, challenge, and scale to receive a live structured brief (Executive Summary, Gaps, Quick Wins, Recommended Systems, Implementation Pathway). Includes a branded PDF print layout with Aperintel logo. Nudges users to start a project with brief content pre-filled.
- **Start a Project** — Describe what you need built. Lumen scopes a solution via a streaming API, generates a numbered project brief, and submits it to the Aperintel team on approval. Accepts pre-populated context from the Score and Brief tools. Users can clear pre-filled content and start fresh.
- **Staff Dashboard** — Password-protected internal dashboard. Staff can view, filter, and update the status of all submitted project briefs, contact clients directly via email, and add internal notes per project (saved to localStorage).
- **Legal Pages** — Privacy Policy, Cookie Policy, and Terms of Service. UK GDPR aligned. All contact references point to the website form rather than placeholder emails.

## Structure

```
aperintel/
├── index.html                  — Main site (all pages, styles, scripts, Lumen chat widget)
├── intelligence-score.html     — Intelligence Maturity Score standalone tool
├── intelligence-brief.html     — Intelligence Brief Generator with PDF print layout
├── solution-brief.html         — Start a Project flow (describe, scope, approve, submit)
├── dashboard.html              — Internal staff dashboard (password protected)
├── privacy-policy.html         — Privacy Policy
├── cookie-policy.html          — Cookie Policy
├── terms-of-service.html       — Terms of Service
├── api/
│   ├── chat.js                 — Streaming SSE chat API (Lumen assistant)
│   ├── brief.js                — Intelligence Brief Generator API
│   ├── score.js                — Intelligence Score Assessment API
│   ├── solution.js             — Streaming SSE solution scoping and project brief API
│   ├── submit-brief.js         — Submits approved project briefs to Vercel KV
│   └── briefs.js               — Fetches and updates project briefs for the staff dashboard
├── package.json                — Node.js dependencies
├── vercel.json                 — Vercel function configuration (maxDuration: 60s)
└── README.md
```

## Pages

- Home (with three live intelligence tool cards and Lumen chat widget)
- About
- Platform
- Products (10 products: Enterprise Platform, Avant, Tipintel, Aoura, Aces, Tekkiestack, The Depression Project, Wingman, Orion, Titan OS)
- Contact / Request Access

## Product Ecosystem

| Product | Status | Description |
|---|---|---|
| Enterprise Platform | In Development | AI-native knowledge platform for organisations |
| Avant | In Development | AI-assisted software delivery operating system |
| Tipintel | Early Access | Financial market intelligence and decision support |
| Aoura | In Development | Private AI companion on zero-knowledge architecture |
| Aces | In Development | Community intelligence and ecosystem management |
| Tekkiestack | In Development | Learning platform for young people who want to code |
| Wingman | Live | AI trade analysis platform |
| Orion | Early Development | AI orchestration layer for existing operating systems |
| Titan OS | Concept | AI-native operating system |
| The Depression Project | Research | Mental health AI research initiative |
| Education Systems | In Development | Intelligent education and training platforms |

## Stack

HTML, CSS, Vanilla JavaScript, Node.js (Vercel Serverless Functions), Anthropic API, Vercel KV (Upstash Redis)

No frontend framework. No build step.

## Key Technical Notes

- All AI endpoints use `claude-sonnet-4-6` via the Anthropic SDK. Branded as Lumen on the frontend.
- `api/chat.js` and `api/solution.js` use Server-Sent Events (SSE) streaming to prevent Vercel function timeouts.
- Project briefs are stored in Vercel KV (Upstash Redis) as both a list (`project-briefs`) and individual keys (`brief:REF`).
- Pre-population between tools uses `sessionStorage`. Score and Brief tools write context; the Start a Project page reads and formats it on load.
- Staff notes in the dashboard are persisted to `localStorage` keyed by project reference.
- The Intelligence Brief PDF uses `@media print` CSS to inject the Aperintel logo, hide UI chrome, and produce a clean branded document.
- All serverless functions have `maxDuration: 60` in `vercel.json`.

## Environment Variables

Set the following in your Vercel project settings:

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `DASHBOARD_PASSWORD` | Password for the internal staff dashboard |
| `KV_URL` | Vercel KV connection URL (auto-injected when KV is enabled) |
| `KV_REST_API_URL` | Vercel KV REST API URL (auto-injected) |
| `KV_REST_API_TOKEN` | Vercel KV REST API token (auto-injected) |
| `KV_REST_API_READ_ONLY_TOKEN` | Vercel KV read-only token (auto-injected) |

## Deployment

1. Push this repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Enable Vercel KV under the Storage tab and link it to the project
4. Add `ANTHROPIC_API_KEY` and `DASHBOARD_PASSWORD` under Settings, Environment Variables
5. Deploy. Vercel auto-detects the `/api` directory as serverless functions.

The site will be live at your Vercel deployment URL.

---

© 2026 Aperintel. All rights reserved.
