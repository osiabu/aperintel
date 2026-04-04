# Aperintel

Aperintel is an intelligence infrastructure company building AI-native systems that structure and enhance intelligence across organisations, communities, and individuals.

This repository contains the official Aperintel website, deployed on Vercel with Lumen-powered AI features.

## Live Features

- **AI Chat Widget** — Streaming AI assistant (Lumen) with voice input. Knows every Aperintel product and acts as a consultative intelligence advisor.
- **Intelligence Score Assessment** — 5-question maturity quiz that generates a personalised 0 to 100 intelligence score with strengths, gaps, and product recommendations.
- **Intelligence Brief Generator** — Enter your sector, challenge, and scale to receive a live, structured intelligence brief (Executive Summary, Gaps, Quick Wins, Recommendations, Pathway).
- **Start a Project** — Describe what you need built. Lumen scopes a solution, generates a numbered project brief, and submits it to the Aperintel development team on approval.
- **Staff Dashboard** — Password-protected internal dashboard for the Aperintel team to view, filter, and update the status of all submitted project briefs.

## Structure

```
aperintel/
├── index.html                  — Main site (all pages, styles, scripts)
├── intelligence-score.html     — Intelligence Maturity Score standalone tool
├── intelligence-brief.html     — Intelligence Brief Generator standalone tool
├── solution-brief.html         — Start a Project flow (describe, scope, approve, submit)
├── dashboard.html              — Internal staff dashboard (password protected)
├── api/
│   ├── chat.js                 — Streaming chat API (Anthropic SDK, SSE)
│   ├── brief.js                — Intelligence Brief Generator API
│   ├── score.js                — Intelligence Score Assessment API
│   ├── solution.js             — Solution scoping and project brief generation API
│   ├── submit-brief.js         — Submits approved project briefs to Vercel KV
│   └── briefs.js               — Fetches and updates briefs for the staff dashboard
├── package.json                — Node.js dependencies
├── vercel.json                 — Vercel function configuration
└── README.md
```

## Pages

- Home (with three live intelligence tools)
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
3. Enable Vercel KV (Storage tab) and link it to the project
4. Add `ANTHROPIC_API_KEY` and `DASHBOARD_PASSWORD` under Settings, Environment Variables
5. Deploy. Vercel auto-detects the `/api` directory as serverless functions.

The site will be live at your Vercel deployment URL.

---

© 2026 Aperintel. All rights reserved.
