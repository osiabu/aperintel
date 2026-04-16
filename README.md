# Aperintel
*AI-powered intelligence advisory platform for organizational maturity assessment*

**Status:** Live | **Completion:** 100% | **Last updated:** 2026-04-13

## About

Aperintel is a vertical SaaS platform that helps organizations assess and improve their intelligence capabilities through AI-powered advisory tools. The platform features an intelligent chat assistant, maturity scoring systems, and automated brief generation to guide strategic intelligence decisions.

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

### Prerequisites
```bash
node >= 18.0.0
npm >= 8.0.0
```

### Installation
```bash
git clone https://github.com/osiabu/aperintel.git
cd aperintel
npm install
cp .env.example .env.local
# Configure your environment variables
```

### Development
```bash
npm run dev
# Open http://localhost:3000
```

### Production
```bash
npm run build
npm start
```

## Roadmap

### Phase 1 — MVP
- Core intelligence advisory tools
- AI-powered chat assistant
- Basic organizational assessment capabilities

### Phase 2 — Growth
- Advanced analytics and reporting
- Multi-organization support
- Integration with external intelligence platforms

### Phase 3 — Scale
- Enterprise-grade security and compliance
- White-label solutions for consultancies
- Advanced machine learning for predictive intelligence insights

---

**Osi Abu** — Full Stack AI Engineer | https://osiabu.vercel.app