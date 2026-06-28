import type { ChatMessage, Citation, ThreadKind } from "@/lib/types";
import { getProperty } from "@/lib/mock/properties";
import { formatAed } from "@/lib/utils";

interface ResponseTemplate {
  match: RegExp;
  buildResponse: (ctx: ResponseContext) => { content: string; citations?: Citation[] };
}

interface ResponseContext {
  propertyId?: string;
  propertyIds?: string[];
  thread: ThreadKind;
}

const templates: ResponseTemplate[] = [
  {
    match: /service charge|maintenance fee|annual fee/i,
    buildResponse: ({ propertyId }) => {
      const p = propertyId ? getProperty(propertyId) : undefined;
      if (!p) {
        return {
          content:
            "Service charges in Dubai are billed annually per sqft of BUA and approved by RERA. Premium towers typically run AED 18–25/sqft; townhouse communities run AED 4–8/sqft. They materially reduce net yield, so always factor them in.",
        };
      }
      return {
        content: `For ${p.name}, the published service charge is **AED ${p.serviceCharge.toFixed(1)}/sqft** of BUA (${p.bua.toLocaleString()} sqft → roughly AED ${formatAed(p.serviceCharge * p.bua)} per year). For context, ${
          p.serviceCharge > 15 ? "this is on the high end and reflects premium amenities + district cooling infrastructure." : "this is competitive for the community."
        } These fees are RERA-approved annually and can adjust; budget for a 5–10% escalation in years 2–3.`,
        citations: [
          { docId: p.documents[0]?.id ?? "", docTitle: p.documents[0]?.title ?? "Brochure", page: 12, excerpt: `Service Charge: AED ${p.serviceCharge.toFixed(1)} per sqft of BUA, payable annually.` },
        ],
      };
    },
  },
  {
    match: /payment plan|payment schedule|installment|milestone/i,
    buildResponse: ({ propertyId }) => {
      const p = propertyId ? getProperty(propertyId) : undefined;
      if (!p) {
        return {
          content:
            "Off-plan payment plans in Dubai usually fall into 20/80, 40/60, or post-handover variants. The trend in 2025–2026 has been toward more buyer-friendly back-loaded plans (e.g. 60/40 with handover at 40%).",
        };
      }
      const total = p.paymentPlan.reduce((s, m) => s + m.percent, 0);
      const lines = p.paymentPlan
        .map((m) => `- **${m.label}** (${m.percent}%) — due ${new Date(m.due).toLocaleDateString("en-GB", { month: "short", year: "numeric" })} — ${m.status}`)
        .join("\n");
      return {
        content: `Here's the payment schedule for **${p.name}** (total ${total}%):\n\n${lines}\n\nThis is a ${total === 100 ? "fully-front-defined" : "partial"} plan. ${p.paymentPlan.find((m) => m.percent >= 50) ? "Note the large on-handover slug — make sure mortgage pre-approval is in place ~6 months before the handover window." : ""}`,
        citations: [
          { docId: p.documents.find((d) => d.kind === "payment-plan" || d.kind === "spa")?.id ?? p.documents[0]?.id ?? "", docTitle: "Payment Plan Schedule", page: 4, excerpt: "Payment milestones tied to construction completion certificates issued by Engineer." },
        ],
      };
    },
  },
  {
    match: /yield|rental|roi|return/i,
    buildResponse: ({ propertyId }) => {
      const p = propertyId ? getProperty(propertyId) : undefined;
      if (!p) {
        return {
          content:
            "Gross rental yields in Dubai range 5–9% depending on location and unit type. JVC, Dubai South, and The Valley deliver higher yields; Downtown and Beachfront deliver lower yields but stronger appreciation.",
        };
      }
      const annualRent = (p.price * (p.rentalYieldEstimate / 100));
      const serviceChargeAnnual = p.serviceCharge * p.bua;
      const netYield = ((annualRent - serviceChargeAnnual) / p.price) * 100;
      return {
        content: `Indicative yield for **${p.name}**:\n\n- Expected gross rental: **${formatAed(annualRent)}/yr** (~${p.rentalYieldEstimate}% gross)\n- Service charge drag: ${formatAed(serviceChargeAnnual)}/yr\n- **Net yield estimate: ${netYield.toFixed(2)}%**\n\nThis assumes long-term tenancy. Short-term rental (Airbnb-style) is feasible in this community with a holiday-home permit and typically uplifts gross yield by 1.5–2.5 percentage points.`,
        citations: [
          { docId: p.documents[p.documents.length - 1]?.id ?? "", docTitle: "Q2 Market Report", page: 8, excerpt: `Market rental comp for similar 2BR units in ${p.community}: AED 175–195k/yr.` },
        ],
      };
    },
  },
  {
    match: /risk|red flag|concern|delay penalty|default/i,
    buildResponse: ({ propertyId }) => {
      const p = propertyId ? getProperty(propertyId) : undefined;
      const intro = p
        ? `Top risks in the **${p.name}** SPA that you should review:`
        : "Common high-severity risks in Dubai off-plan SPAs include:";
      return {
        content: `${intro}\n\n1. **Construction-delay penalty cap (often 5%)** — frequently below the 10% market norm.\n2. **Buyer cannot rescind after 24-month delay** — attempts to waive Article 11 of Law 13 of 2008 protections.\n3. **Force majeure inclusive of 'market conditions'** — non-standard, gives the developer commercial cover.\n4. **Service-charge escalation uncapped** — common pattern is 15–30% jumps post-warranty.\n5. **Snagging window of only 30 days** — negotiate to 90 days; engage independent snaggers in first 14 days.`,
        citations: p
          ? [
              { docId: p.documents.find((d) => d.kind === "spa")?.id ?? "", docTitle: "SPA", page: 12, excerpt: "Developer liability for delay shall not exceed 5% of the Purchase Price." },
              { docId: p.documents.find((d) => d.kind === "spa")?.id ?? "", docTitle: "SPA", page: 21, excerpt: "Force Majeure shall include adverse market or economic conditions." },
            ]
          : undefined,
      };
    },
  },
  {
    match: /handover|delivery date|completion/i,
    buildResponse: ({ propertyId }) => {
      const p = propertyId ? getProperty(propertyId) : undefined;
      if (!p?.handoverDate) {
        return {
          content:
            "Anticipated Completion Date in Dubai SPAs is non-binding; the operative deadline is the SPA's Outside Date. Developer slippage of 6–18 months is normal; >24 months triggers buyer rescission rights under Law 13 of 2008.",
        };
      }
      return {
        content: `**${p.name}** is contracted for handover on **${new Date(p.handoverDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}**. ${p.developer === "Sobha Realty" ? "Sobha has a strong track record of delivering within ±3 months." : p.developer.startsWith("Emaar") ? "Emaar typically delivers on or slightly ahead of schedule." : ""} The SPA's binding Outside Date sits 12 months past this — past which delay-penalty clauses kick in.`,
        citations: [
          { docId: p.documents.find((d) => d.kind === "spa")?.id ?? p.documents[0]?.id ?? "", docTitle: "SPA", page: 4, excerpt: `Anticipated Completion Date: ${new Date(p.handoverDate).toLocaleDateString("en-GB")}` },
        ],
      };
    },
  },
  {
    match: /location|neighbou?rhood|community|nearby|school/i,
    buildResponse: ({ propertyId }) => {
      const p = propertyId ? getProperty(propertyId) : undefined;
      if (!p) {
        return { content: "Tell me which property you'd like me to assess the location for." };
      }
      const blurbs: Record<string, string> = {
        "Sobha Hartland": "Sobha Hartland sits along the Dubai Water Canal with direct access to Downtown (8 min) and DIFC (12 min). Two international schools on-community (Hartland International, North London Collegiate). Park-heavy masterplan, low traffic.",
        "Dubai Harbour": "Dubai Harbour combines marina/yacht infrastructure with private beach. Tram access into Marina, ~15 min to JBR. Premium positioning; limited school options inside the community.",
        "The Valley": "The Valley is an emerging Emaar masterplan along Al Ain Road, ~25 min to Downtown. Suburban family flavor with GEMS school committed, retail boulevard under construction. Long-term play.",
      };
      return {
        content: `**${p.community}** — ${blurbs[p.community] ?? "Emerging community; double-check school plans, retail timing, and connectivity to your daily commute."}`,
      };
    },
  },
  {
    match: /compare|versus|vs\.?|side by side/i,
    buildResponse: ({ propertyIds }) => {
      if (!propertyIds || propertyIds.length < 2) {
        return { content: "Pick at least two properties from the library to compare." };
      }
      const props = propertyIds.map((id) => getProperty(id)).filter(Boolean);
      const lines = props.map((p) =>
        `- **${p!.name}** (${p!.community}) — ${p!.bedrooms}BR ${p!.type}, ${p!.bua.toLocaleString()} sqft @ ${formatAed(p!.pricePerSqft)}/sqft → ${formatAed(p!.price)}. Service charge AED ${p!.serviceCharge}/sqft, ${p!.rentalYieldEstimate}% gross yield.`,
      );
      return {
        content: `Side-by-side comparison:\n\n${lines.join("\n")}\n\nThe key trade-off here is **price-per-sqft vs. yield drag from service charges**. Premium beachfront commands a sqft premium but a higher service charge eats net yield; the suburban townhouse has lower yield but much lower service-charge drag and stronger appreciation runway.`,
      };
    },
  },
  {
    match: /oqood|registration|dld fee|title deed/i,
    buildResponse: () => ({
      content:
        "Oqood is the interim DLD registration for off-plan properties — issued by the developer against your SPA. Fee is 4% of the property value plus admin (AED 3k). After handover, your Oqood converts to a full title deed at the trustee office. Watch for SPAs that shift the entire 4% to the buyer; some master developers absorb part of it during promotions.",
    }),
  },
  {
    match: /mortgage|financing|ltv|loan/i,
    buildResponse: ({ propertyId }) => {
      const p = propertyId ? getProperty(propertyId) : undefined;
      const intro = p?.status === "off-plan" ? "For off-plan, mortgages are restricted: most banks lend only after 50% construction (some after 30%). LTV caps at 50%." : "For ready properties, max LTV is 80% for first home up to AED 5M; 70% above AED 5M (UAE Central Bank).";
      return {
        content: `${intro}\n\nKey diligence before committing:\n\n- Get a Mortgage Pre-Approval (MPA) before signing the SPA — costs ~AED 1,050 and locks in your borrowing power.\n- Valuation fee: AED 3,000–3,500 per attempt; budget for two if the first comes in low.\n- Bank charges typically 0.5–1% arrangement fee. Watch for break-fees if you intend to refinance early.`,
      };
    },
  },
];

function buildFallback(ctx: ResponseContext, userMessage: string): { content: string; citations?: Citation[] } {
  const p = ctx.propertyId ? getProperty(ctx.propertyId) : undefined;
  if (!p) {
    return {
      content: `Got it. I can help analyze Dubai property documents — SPAs, brochures, payment plans, market reports. Ask me about service charges, payment plans, yields, risks, the developer track record, the community, mortgage terms, or specific SPA clauses.`,
    };
  }
  return {
    content: `On **${p.name}**, you asked: "${userMessage}". I'd want to read the relevant section of the ${p.documents[0]?.title ?? "brochure"} or SPA to answer precisely. In the meantime, here's the high-level summary:\n\n${p.summary}\n\nKey findings I've already extracted:\n${p.keyFindings.map((f) => `- ${f}`).join("\n")}`,
    citations: [
      { docId: p.documents[0]?.id ?? "", docTitle: p.documents[0]?.title ?? "Brochure", page: 1, excerpt: p.summary.slice(0, 140) + "..." },
    ],
  };
}

export function pickResponse(userMessage: string, ctx: ResponseContext): { content: string; citations?: Citation[] } {
  for (const t of templates) {
    if (t.match.test(userMessage)) return t.buildResponse(ctx);
  }
  return buildFallback(ctx, userMessage);
}

export function seedMessages(thread: ThreadKind): ChatMessage[] {
  const greetings: Record<ThreadKind, string> = {
    general:
      "Hi — I've read this property's brochure, SPA, and market report. Ask me anything about the unit, the payment plan, the SPA risks, or comparable properties.",
    financial:
      "Financial thread. Ask me about the payment plan, yield, service charges, mortgage feasibility, or cash-on-cash returns.",
    legal:
      "Legal thread. Ask about specific SPA clauses, Oqood registration, escrow, force majeure, delay penalties, or buyer protections under Law 13 of 2008.",
    location:
      "Location thread. Ask about the community, nearby schools, commute times, planned infrastructure, or short-term rental viability.",
  };
  return [
    {
      id: `seed-${thread}`,
      role: "assistant",
      content: greetings[thread],
      createdAt: Date.now(),
    },
  ];
}
