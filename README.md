# Dubai PropertyDoc

A "chat with your property documents" prototype specialised for Dubai real estate. Drop in brochures, Sale and Purchase Agreements (SPAs), and market reports; chat with them; compare properties on the numbers that actually matter; flag predatory clauses before signing.

**Live demo:** https://researchassistant-zeta.vercel.app

> **Status: working prototype.** The UI is real; the AI backend isn't wired up yet. Chat, document parsing, and file uploads are mocked client-side. The data model and component layout are designed so a real backend can be swapped in without rewriting the frontend.

---

## Who it's for

- **Off-plan investors** buying a unit before it's built and signing a 60-page SPA they're never going to read in full.
- **Buyer's agents and property consultants** prepping for client calls or offering an SPA review as a value-add service.
- **Buy-to-let investors and family offices** choosing between candidates on net yield after service charges, not list price.
- **Real estate lawyers** doing the first-pass clause review on a stack of SPAs.
- **Owner-occupiers** making a once-in-a-lifetime purchase who want a second opinion before signing.

---

## What you can do

### 1. Browse a property library

Landing inside the demo at `/library`, you see cards for every property you've onboarded — developer, community, bedrooms, list price. Click a card to open its document workspace.

### 2. Chat with a property's documents

The document workspace shows the PDF on the left and a chat sidebar on the right with four threads:

- **General** — overview questions, summaries, key risks
- **Financial** — payment plan, yield, service charges, mortgage feasibility
- **Legal** — SPA clauses, Oqood registration, force-majeure, delay penalties
- **Location** — community, schools, commute, short-term rental viability

Every assistant answer comes with **page-level citations** — click a citation chip and the PDF jumps to that page with the cited passage highlighted. Glossary terms (Oqood, BUA, RERA, NOC, etc.) get a dotted underline; hover them for an inline definition.

The chat panel has a **maximize/minimize toggle** next to the tab row — collapse it for a 480px sidebar, expand it for a 50/50 split with the PDF when you want room to read longer responses.

Sample questions that produce substantive responses:

- "What's the service charge and how does it affect my net yield?"
- "Walk me through the payment plan"
- "What are the top SPA risks?"
- "Tell me about the developer's track record"
- "Is this a good buy?"
- "Can I rent this short-term?"

### 3. Compare properties side by side

At `/compare`, tick two or more properties. You get a comparison table with developer, community, BUA, price, price/sqft, service charge, gross yield, **net yield after service charges**, and handover date. Best and worst values per metric are highlighted. The right-hand chat panel works the same way as in the document workspace but answers cross-property questions ("Which has better net yield?", "Why is Marina Vista more expensive?").

### 4. Onboard a new property

At `/workflows/onboard`, drop one or more PDFs (brochure, SPA, payment plan). The wizard simulates a four-stage extraction — reading the brochure, parsing the SPA, extracting the payment schedule, building the property profile — then shows the extracted fields for review. Edit anything that looks wrong, hit Save, and the property appears in your library.

> The extraction is mocked. Today it returns a fixed sample property regardless of what you upload — the demo shows the UX flow, not real extraction. The same wizard structure is the contract for a real parsing pipeline later.

### 5. Audit an SPA

At `/workflows/spa-audit`, drop a single SPA. The flow parses it (mocked) and produces a list of risk flags, each with:

- **Title and severity badge** (high / medium / low)
- **Clause excerpt** — the exact contract language
- **Page number** in the source document
- **Rationale** — why this is a risk
- **Recommendation** — how to negotiate around it

Typical flags: construction-delay penalty capped below the 10% market norm, Oqood/DLD registration fee shifted to buyer, force-majeure clause that includes adverse market conditions, uncapped service-charge escalation, snagging window of only 30 days, no buyer rescission right for delays under 24 months.

---

## Try it with the included sample document

Repo includes a fabricated SPA you can use to test the upload flow end-to-end. From a clone of this repo:

```bash
# Generate the sample (macOS — uses cupsfilter to convert text to PDF)
cupsfilter -i text/plain /tmp/sample-spa.txt 2>/dev/null > ~/Desktop/sample-spa.pdf
```

Or just use any PDF you have lying around — the upload is UI-only, so the file's contents don't affect the result. Drag the PDF into the dropzone at `/workflows/spa-audit` or `/workflows/onboard` and watch the mocked extraction run.

---

## How the demo is structured

```
src/
├── app/
│   ├── page.tsx                      Landing page
│   ├── library/page.tsx              Property grid
│   ├── doc/[id]/page.tsx             Document workspace (PDF + chat + dashboard)
│   ├── compare/                      Multi-select picker + comparison table + chat
│   └── workflows/
│       ├── onboard/                  3-step onboarding wizard
│       └── spa-audit/                SPA risk-flag flow
├── components/
│   ├── chat/                         Threaded chat, messages, citations
│   ├── document/                     PDF viewer, workspace shell, dropzone
│   ├── panels/                       Dashboard, comparison table, risk flags, payment timeline
│   ├── layout/                       Sidebar, topbar, theme toggle
│   ├── workflows/                    Onboarding wizard, SPA audit flow, compare picker
│   └── ui/                           Radix-based primitives (button, card, dialog, etc.)
└── lib/
    ├── hooks/use-mock-chat.ts        Streaming chat simulator (LLM swap point)
    ├── mock/
    │   ├── properties.ts             Hardcoded property dataset
    │   ├── chat-responses.ts         Regex-matched response templates
    │   ├── risk-flags.ts             SPA audit fixtures
    │   ├── document-pages.ts         Mock PDF page content
    │   └── glossary.ts               Dubai-real-estate term definitions
    ├── types.ts                      Domain model (Property, DocumentRef, ChatMessage, etc.)
    └── utils.ts                      Currency / date formatting, classname merging
```

---

## What's real vs. mocked

| Capability | Status |
|---|---|
| UI / component library | Real |
| Routing and navigation | Real |
| Property data model and types | Real |
| Chat streaming and citation handling | Real **mechanics** over **mocked** content |
| LLM responses | Regex-matched templates in `chat-responses.ts` |
| PDF viewer | Renders synthetic pages from `document-pages.ts`, not real PDF contents |
| File uploads | Dropzone records `{name, size}` only — file contents are never read |
| Property persistence | In-memory; refreshing the page resets the library |
| Onboarding extraction | Animated stub; returns a fixed sample property |
| SPA audit | Animated stub; returns the same risk-flag list every time |

### Where to wire in a real backend later

- **Chat** — replace `src/lib/hooks/use-mock-chat.ts` with a `useChat`-compatible client pointing at an `/api/chat` route. The components downstream don't change.
- **File upload** — add `/api/upload`, point it at Vercel Blob / S3, kick off async PDF parsing and embedding into a vector store.
- **Property persistence** — add a database (Vercel Postgres, Supabase) and an `/api/properties` route; replace the `properties` array import with a fetch.
- **SPA audit** — replace `src/lib/mock/risk-flags.ts` with a server-side RAG + structured-extraction pipeline that returns flags in the same shape.

---

## Local development

Requires **Node >= 20.9.0** (Next.js 16 requirement) and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm lint         # eslint
```

This repo's `AGENTS.md` reminds contributors that this is **not the Next.js you're used to** — Next.js 16 + React 19 are recent enough that older patterns don't apply. Look at `node_modules/next/dist/docs/` before guessing at an API.

---

## Tech stack

- **Next.js 16.2.9** App Router (no Pages Router) + **React 19.2.4**
- **TypeScript** strict, `@/*` path alias → `src/*`
- **Tailwind v4** with `@tailwindcss/postcss` (CSS-first config via `@theme inline` in `globals.css`)
- **Radix UI** primitives (dialog, popover, tabs, tooltip, scroll-area, separator, slot)
- **Lucide** icons, **CVA** + `clsx` + `tailwind-merge` for component variants
- **react-pdf 10 / pdfjs-dist 6** for the viewer shell
- **OKLch** color tokens, light/dark theming via CSS custom properties

---

## Deploy

The repo is connected to Vercel. Every push to `main` triggers an automatic production deploy at https://researchassistant-zeta.vercel.app. Preview deploys fire on any other branch or PR.

No environment variables are required for the mocked build — when real backend services are added, they'll show up in `.env.example`.

---

## Future workflows (not yet built)

- **Investment thesis builder** — turn a property into a memo with the yield math, comparable comps, and risk summary baked in.
- **Regulatory checklist** — NOC, Oqood, RERA permit, DLD title status, escrow verification.
- **Map view** — properties on a Dubai map with isochrones to DIFC / Downtown / DXB.
- **Yield calculator widget** — interactive net-yield model that lives inside chat answers.
