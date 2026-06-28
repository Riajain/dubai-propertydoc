# Dubai PropertyDoc

A "chat with your property documents" prototype for Dubai real estate — brochures, SPAs, market reports.

**Live demo:** https://researchassistant-zeta.vercel.app

## What's in here

A Next.js 16 / React 19 UI with four workflows:

- **Library** — properties you're researching, in one place
- **Document workspace** — PDF viewer + threaded chat (General / Financial / Legal / Location) with page-level citations
- **Compare** — side-by-side metrics including net yield after service charges
- **Property onboarding** — drop a brochure + SPA, get a structured profile
- **SPA audit** — flag risky clauses with severity + negotiation recommendations

Everything is mocked client-side — no real LLM, no document parsing, no uploads.
Swap points for a real backend are isolated:

- `src/lib/hooks/use-mock-chat.ts` — chat streaming simulator
- `src/lib/mock/*` — properties, chat responses, risk flags, document pages, glossary

## Local development

Requires Node `>=20.9.0` (Next.js 16 requirement).

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Deploy

Connected to Vercel — push to `main` deploys automatically.
