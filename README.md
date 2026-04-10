# Aperintel
*AI-powered intelligence consulting platform for organizational maturity assessment*

**Status:** Live | **Completion:** 100% | **Last updated:** 2026-04-10

## About

Aperintel is a vertical SaaS platform that helps organizations assess and improve their intelligence capabilities through AI-powered tools. The platform features a senior intelligence advisor chatbot, maturity scoring system, and automated brief generation to guide strategic decision-making and organizational development.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript / JavaScript / Python |
| Framework | Next.js / React / Express |
| Styling | Tailwind CSS |
| Database | PostgreSQL / Supabase / MongoDB |
| AI | Anthropic Claude API |
| Infrastructure | Vercel / Railway / Render |

## Features

| Feature | Description | Status |
|---------|-------------|--------|
| Lumen Chat Assistant | Streaming AI chat assistant configured as senior intelligence advisor | ✅ Built |
| Intelligence Maturity Scoring | Evaluates organizations across four dimensions with 0-100 scoring system | ✅ Built |
| Intelligence Brief Generator | Generates structured briefs covering gaps, wins, and implementation pathways | ✅ Built |
| Project Scoping Workflow | Users describe needs, Claude generates project briefs, users can submit directly | ✅ Built |
| Staff Dashboard | Password-protected internal dashboard for reviewing and managing project briefs | ✅ Built |
| ⚠️ Extra: Static HTML Site | Multi-page static HTML website with no client-side framework | ✅ Built |
| ⚠️ Extra: Server-Sent Events Streaming | SSE implementation for real-time AI response streaming | ✅ Built |
| ⚠️ Extra: Vercel KV Storage | Data persistence for project briefs using Vercel KV (Redis) | ✅ Built |
| ⚠️ Extra: SessionStorage Context Flow | Data flow between tools via sessionStorage without backend sessions | ✅ Built |

**Completion:** 9/9 features built (100%)

## Getting Started

### Installation
```bash
npm install
# or
yarn install
```

### Environment Setup
```bash
cp .env.example .env.local
# Add your API keys and configuration
```

### Development
```bash
npm run dev
# or
yarn dev
```

### Build & Deploy
```bash
npm run build
npm start
```

## Roadmap

### Phase 1 — MVP
- Core intelligence assessment tools
- AI-powered chat assistant
- Basic project scoping workflow

### Phase 2 — Growth
- Enhanced analytics and reporting
- Team collaboration features
- Integration with popular business tools

### Phase 3 — Scale
- Enterprise-grade security and compliance
- Advanced AI models and customization
- White-label solutions for consultancies

---

**Osi Abu** — Full Stack AI Engineer | https://osiabu.vercel.app