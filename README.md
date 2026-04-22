# Aperintel: AI-Powered Intelligence Suite for Modern Enterprises

**Status:** `Live` | **Completion:** `100%` | **Last Updated:** `2026-04-22`

Aperintel is a vertical SaaS platform designed to elevate organizational intelligence capabilities. It provides a suite of AI-powered tools that enable enterprises to assess their intelligence maturity, generate structured analytical briefs, and scope strategic projects with expert assistance. This product solves the critical problem of disconnected and inefficient intelligence workflows by providing a unified, data-driven environment for strategic planning and decision-making.

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript / JavaScript / Python |
| Framework | Next.js / React / Express |
| Styling | Tailwind CSS |
| Database | PostgreSQL / Supabase / MongoDB |
| AI | Anthropic Claude API |
| Infrastructure | Vercel / Railway / Render |

## Features

| Feature | Description | Status |
|---|---|---|
| Lumen Chat Assistant | Streaming AI chat assistant configured as senior intelligence advisor | ✅ Built |
| Intelligence Maturity Scoring | Evaluates organizations across four dimensions with 0-100 scoring system | ✅ Built |
| Intelligence Brief Generator | Generates structured briefs covering gaps, wins, and implementation pathways | ✅ Built |
| Project Scoping Workflow | Users describe needs, Claude generates project briefs, users can submit directly | ✅ Built |
| Staff Dashboard | Password-protected internal dashboard for reviewing and managing project briefs | ✅ Built |
| ⚠️ Extra: Static HTML Site | Multi-page static HTML website with no client-side framework | ✅ Built |
| ⚠️ Extra: Server-Sent Events Streaming | SSE implementation for real-time AI response streaming | ✅ Built |
| ⚠️ Extra: Vercel KV Storage | Data persistence for project briefs using Vercel KV (Redis) | ✅ Built |
| ⚠️ Extra: SessionStorage Context Flow | Data flow between tools via sessionStorage without backend sessions | ✅ Built |

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js
- npm

### Installation & Setup

1.  Clone the repo
    ```sh
    git clone https://github.com/osiabu/aperintel.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Create a `.env.local` file and add your environment variables.
4.  Run the development server
    ```sh
    npm run dev
    ```

## Roadmap

### Phase 1 — MVP
-   Implement core features including the chat assistant and brief generator.
-   Establish secure data persistence for project briefs.
-   Deploy initial version to Vercel for live testing.

### Phase 2 — Growth
-   Integrate user authentication and multi-tenant organization support.
-   Expand AI capabilities with fine-tuned models.
-   Develop a comprehensive analytics dashboard for staff.

### Phase 3 — Scale
-   Introduce third-party API integrations for enhanced data enrichment.
-   Optimize for enterprise-grade performance and security standards.
-   Build out team collaboration and workflow management features.

---

Osi Abu – Full Stack AI Engineer | https://osiabu.vercel.app