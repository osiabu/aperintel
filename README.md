# Aperintel

Aperintel is an intelligence infrastructure company building AI-native systems that structure and enhance intelligence across organisations, communities, and individuals.

This repository contains the official Aperintel website, deployed on Vercel with Claude-powered AI features.

## Live Features

- **AI Chat Widget** — Streaming Claude-powered assistant with voice input. Knows every Aperintel product and acts as a consultative intelligence advisor.
- **Intelligence Score Assessment** — 5-question maturity quiz that generates a personalised 0–100 intelligence score with strengths, gaps, and product recommendations.
- **Intelligence Brief Generator** — Enter your sector, challenge, and scale to receive a live, structured intelligence brief (Executive Summary, Gaps, Quick Wins, Recommendations, Pathway).

## Structure

```
aperintel/
├── index.html        — Complete site (all pages, styles, scripts)
├── api/
│   ├── chat.js       — Streaming chat API (Anthropic SDK, SSE)
│   ├── brief.js      — Intelligence Brief Generator API
│   └── score.js      — Intelligence Score Assessment API
├── package.json      — Node.js dependencies (@anthropic-ai/sdk)
├── vercel.json       — Vercel function configuration
└── README.md
```

## Pages

- Home (with Intelligence Score + Brief Generator demos)
- About
- Platform
- Products (10 products: Enterprise Platform, Avant, Tipintel, Aoura, Aces, YoungTekkie, The Depression Project, Wingman, Orion, Titan OS)
- Contact / Request Access

## Stack

HTML · CSS · Vanilla JavaScript · Node.js (Vercel Serverless Functions) · Anthropic Claude API

No frontend framework. No build step.

## Environment Variables

Set the following in your Vercel project settings:

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |

## Deployment

1. Push this repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add `ANTHROPIC_API_KEY` under Settings → Environment Variables
4. Deploy — Vercel auto-detects the `/api` directory as serverless functions

The site will be live at your Vercel deployment URL.

---

© 2026 Aperintel. All rights reserved.
