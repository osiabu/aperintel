# Aperintel

The public website and intelligence demonstration platform for Aperintel, an intelligence infrastructure company building AI-native systems across enterprise, financial, community, and education domains.

## Problem Statement

Enterprise and individual decision-makers typically lack structured intelligence infrastructure: knowledge is fragmented, decisions are reactive, and the tools they use are disconnected. Aperintel's website serves two purposes simultaneously. It presents the company's product ecosystem and philosophy to prospective clients, and it demonstrates intelligence infrastructure in action through four live AI features: a conversational assistant (Lumen), an intelligence brief generator, an intelligence maturity scoring tool, and a solution scoping workflow that converts client descriptions into structured project briefs.

## Demo / Screenshot

**Live:** [https://www.aperintel.com](https://www.aperintel.com)

## Tech Stack

| Layer | Technologies |
|---|---|
| Language | JavaScript |
| Frontend | HTML, CSS (static, no framework, no build step) |
| Backend | Vercel Serverless Functions (Node.js) |
| AI and LLM | Claude API (claude-sonnet-4-6), streaming via Server-Sent Events |
| Database | Vercel KV (Upstash Redis) |
| Infrastructure | Vercel |

## Architecture Overview

The site is a static HTML application deployed on Vercel with no client-side JavaScript framework. Each page is a standalone HTML file. Six Vercel serverless functions in the `api/` directory handle all AI and data operations, with a maximum duration of 60 seconds configured in `vercel.json`. The chat and solution scoping endpoints stream responses over Server-Sent Events to avoid function timeouts during long-running Claude calls. The intelligence brief and score endpoints call Claude in non-streaming mode and return structured JSON. Approved project briefs are persisted to Vercel KV as both a keyed record and a list, enabling the password-protected staff dashboard to retrieve, filter, and update project status. Context flows between the Score, Brief, and Start a Project tools via `sessionStorage`, allowing pre-populated data to move across pages without a backend session layer.

## Key Features

- Lumen, a streaming AI chat assistant configured as a senior intelligence advisor. The system prompt defines Aperintel's four pillars (Intelligence, Automation, Infrastructure, Systems) and instructs the assistant to reason structurally and recommend products only where genuinely applicable.
- An intelligence maturity scoring tool that evaluates organisations across four dimensions: decision-making structure, data and knowledge use, workflow automation, and forward-looking orientation. Scores range from 0 to 100 across five maturity levels from Fragmented to Intelligent, with specific gap analysis and a recommended next step.
- An intelligence brief generator that accepts sector, scale, and primary challenge inputs, then returns a structured document covering intelligence gaps, quick wins, Aperintel product recommendations matched to the client's specific situation, and an implementation pathway.
- A project scoping workflow where users describe what they want built, Claude generates a numbered project brief via streaming, and the user can approve and submit it directly to the Aperintel team. Submitted briefs are stored in Vercel KV and visible to staff in the internal dashboard.
- A password-protected staff dashboard for reviewing, filtering, and updating the status of all submitted project briefs, with client contact links and per-project internal notes persisted to `localStorage`.

## How to Run Locally

### Prerequisites

- Node.js 18 or later.
- The Vercel CLI (`npm i -g vercel`), required to run serverless functions locally.
- An Anthropic API key with access to claude-sonnet-4-6.
- A Vercel account with Vercel KV enabled on the project (for brief submission and dashboard features).

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/abuj07/aperintel.git
cd aperintel

# 2. Install dependencies
npm install

# 3. Pull Vercel environment variables (if linked to a Vercel project)
vercel env pull .env.local

# Or create a .env file manually with the following:
# ANTHROPIC_API_KEY       — Anthropic API key for all AI features
# DASHBOARD_PASSWORD      — Password for the internal staff dashboard
# KV_URL                  — Vercel KV connection URL
# KV_REST_API_URL         — Vercel KV REST API URL
# KV_REST_API_TOKEN       — Vercel KV REST API token
# KV_REST_API_READ_ONLY_TOKEN — Vercel KV read-only token
```

### Run

```bash
vercel dev
# Visit http://localhost:3000
```

## AI Integration

All AI features use `claude-sonnet-4-6` via the Anthropic JavaScript SDK. The chat endpoint (`api/chat.js`) maintains a 20-message conversation window and returns incremental text deltas as JSON-encoded Server-Sent Events. The intelligence brief (`api/brief.js`) and score (`api/score.js`) endpoints instruct Claude to return only valid JSON matching a defined schema, with the serverless function extracting the JSON object via index-based string slicing before parsing and forwarding to the client. The solution scoping endpoint (`api/solution.js`) also uses streaming SSE for long-form project brief generation. All prompts include an explicit formatting rule prohibiting hyphens and dashes, ensuring output conforms to Aperintel's prose standards. This repository corresponds to the Aperintel product in Osi's portfolio.

## Status

🟢 **Live** — deployed and publicly accessible on Vercel.

## Author

**Osi Abu** — Full Stack AI Engineer and AI Builder, London.
🌐 [osiabu.dev](https://www.osiabu.dev)
💼 [LinkedIn](https://www.linkedin.com/in/osiabu)
🐙 [GitHub](https://www.github.com/abuj07)
