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
  {
    match: /developer|track record|reputation|reliable|trust/i,
    buildResponse: ({ propertyId }) => {
      const p = propertyId ? getProperty(propertyId) : undefined;
      if (!p) {
        return {
          content:
            "The Dubai market is highly developer-dependent. Tier-1 names with strong delivery records: **Emaar, Sobha, Damac, Meraas, Nakheel**. Tier-2 with mixed records: **Azizi, Danube, Tiger**. Look for: delivery on-time rate, hand-over quality (snagging issues), service-charge stability post-handover, and whether they hold escrow at one of the RERA-approved banks.",
        };
      }
      const profiles: Record<string, { stars: string; bullets: string[] }> = {
        "Sobha Realty": {
          stars: "Tier-1, strong reputation for build quality and on-time delivery.",
          bullets: [
            "Average delivery slippage: ~3 months — among the best in Dubai.",
            "Backwards-integrated construction (own contracting arm) → fewer quality compromises.",
            "Service charges historically stable post-handover; minimal escalation surprises.",
            "Snagging is taken seriously; 6–12 month defect liability period honored.",
          ],
        },
        "Emaar Properties": {
          stars: "Tier-1, master developer with the deepest delivery record in Dubai.",
          bullets: [
            "Delivers on or slightly ahead of schedule in 80%+ of recent projects.",
            "Strong resale liquidity for Emaar-branded inventory (Downtown, Marina, Beach, Hills).",
            "Service charges trend higher than average due to amenity-heavy masterplans.",
            "Buyer protections honored — Emaar rarely pushes the SPA boundaries.",
          ],
        },
      };
      const profile = profiles[p.developer];
      if (profile) {
        return {
          content: `**${p.developer}** — ${profile.stars}\n\n${profile.bullets.map((b) => `- ${b}`).join("\n")}\n\nFor ${p.name} specifically, the ${p.developer === "Sobha Realty" ? "Sobha" : p.developer.split(" ")[0]} delivery pattern means the published ${new Date(p.handoverDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })} handover is credible — budget for a 3–6 month buffer at most.`,
        };
      }
      return {
        content: `**${p.developer}** — I don't have a deep profile on this developer in my mock dataset. General diligence steps for any Dubai developer:\n\n- Pull the developer's RERA registration and project history at dubailand.gov.ae.\n- Check on-time delivery rate across their last 5 projects.\n- Ask current owners in their finished communities about snagging response, service-charge stability, and amenity upkeep.\n- Verify the escrow account is at an RERA-approved bank and that funds are actually held there (not commingled).`,
      };
    },
  },
  {
    match: /amenit|facilit|pool|gym|club|what's included/i,
    buildResponse: ({ propertyId }) => {
      const p = propertyId ? getProperty(propertyId) : undefined;
      if (!p || !p.amenities || p.amenities.length === 0) {
        return {
          content:
            "Dubai amenity packages vary wildly by tier. Standard inventory includes pool, gym, BBQ area. Premium adds: clubhouse, kids' play, padel/tennis, residents' lounge, co-working, retail concierge. Watch for amenities that are 'planned' but not contractually committed — they materially affect long-term yield and resale.",
        };
      }
      const lines = p.amenities.map((a) => `- ${a}`).join("\n");
      return {
        content: `**${p.name}** advertises the following amenities:\n\n${lines}\n\nA few things to verify before banking on these:\n\n- Which amenities are **contracted in the SPA** vs. **shown in brochures** — anything in marketing materials is non-binding.\n- Whether amenities are exclusive to your tower/cluster or shared across the masterplan (affects crowding).\n- Operating cost — premium amenities (concierge, padel courts, beach club) drive service charges up.`,
        citations: [
          { docId: p.documents[0]?.id ?? "", docTitle: p.documents[0]?.title ?? "Brochure", page: 7, excerpt: `Amenities: ${p.amenities.slice(0, 3).join(", ")}…` },
        ],
      };
    },
  },
  {
    match: /short[- ]term|airbnb|holiday home|vacation rental|nightly/i,
    buildResponse: ({ propertyId }) => {
      const p = propertyId ? getProperty(propertyId) : undefined;
      const intro = "Short-term rental in Dubai requires a **DTCM holiday-home permit** (~AED 1,500 per unit annually) plus tourism dirham (10–15 AED/night) and Tourism & Culture Authority compliance.";
      if (!p) {
        return {
          content: `${intro}\n\nUplift over long-term rental varies sharply by location:\n\n- **Marina, JBR, Downtown** — 1.8–2.5x long-term yield gross; 1.4–1.7x net of management fees and vacancy.\n- **Business Bay, Palm, Bluewaters** — 1.5–2.0x.\n- **Suburban masterplans (JVC, The Valley, Town Square)** — 1.1–1.3x; rarely worth the effort.\n\nManagement company takes 18–25% of gross. Plan for 60–75% occupancy in mature areas, 45–60% in newer ones.`,
        };
      }
      const tier: "high" | "mid" | "low" = ["Dubai Marina", "Downtown Dubai", "Dubai Harbour", "Palm Jumeirah", "Bluewaters"].includes(p.community)
        ? "high"
        : ["Business Bay", "JVC", "Sobha Hartland"].includes(p.community)
          ? "mid"
          : "low";
      const tierBlurb =
        tier === "high"
          ? `**${p.community}** is a prime short-term rental zone — expect 1.8–2.4x uplift gross. Budget 18–22% management fee, 65–75% occupancy.`
          : tier === "mid"
            ? `**${p.community}** has moderate short-term demand. Expect 1.4–1.7x uplift; works well if you can self-manage.`
            : `**${p.community}** is a thin short-term market. Don't expect more than 1.1–1.2x uplift; long-term rental is the realistic play.`;
      return {
        content: `${intro}\n\n${tierBlurb}\n\nFor **${p.name}** specifically, also check:\n\n- Whether the building's HOA permits short-term lets (many premium towers ban them).\n- DTCM zoning for ${p.community} — a small number of communities are restricted.\n- The breakeven night rate: at ${p.rentalYieldEstimate}% gross long-term yield, you'd need ~AED ${Math.round((p.price * 0.01 * p.rentalYieldEstimate) / 220).toLocaleString()}/night at 60% occupancy to match.`,
      };
    },
  },
  {
    match: /good (buy|investment|deal)|should i (buy|invest)|worth it|recommend/i,
    buildResponse: ({ propertyId }) => {
      const p = propertyId ? getProperty(propertyId) : undefined;
      if (!p) {
        return {
          content:
            "I won't recommend specific properties, but I'll frame the decision. A Dubai property is a good buy when **at least three of these hold**:\n\n- Net yield (after service charges) ≥ 5.5% at current rents\n- Developer in the tier-1 cohort with delivery proof\n- Community has a 3–5 year infrastructure runway (schools, retail, transit) that will lift rents\n- You're buying at or below the most recent secondary market comps per sqft\n- Payment plan matches your liquidity (don't get squeezed at handover)\n\nTell me which property you're considering and I'll walk it through this framework.",
        };
      }
      const annualRent = p.price * (p.rentalYieldEstimate / 100);
      const serviceChargeAnnual = p.serviceCharge * p.bua;
      const netYield = ((annualRent - serviceChargeAnnual) / p.price) * 100;
      const verdict = netYield >= 5.5 ? "looks promising" : netYield >= 4 ? "is borderline" : "is weak on yield";
      return {
        content: `Here's a quick framework on **${p.name}**:\n\n- **Net yield: ${netYield.toFixed(2)}%** — ${verdict}. The benchmark for a "good buy" on yield alone is 5.5% net.\n- **Developer: ${p.developer}** — ${p.developer === "Sobha Realty" || p.developer.startsWith("Emaar") ? "tier-1, low delivery risk" : "verify track record before committing"}.\n- **Community: ${p.community}** — assess the 3–5 year pipeline (schools, retail, transit) before deciding.\n- **Payment plan** — ${p.paymentPlan.find((m) => m.percent >= 50) ? "back-loaded with a large handover slug; ensure mortgage pre-approval is in hand" : "well-distributed; manageable cashflow"}.\n\n**Honest take:** ${verdict === "looks promising" ? "On the numbers, this works. The risk is execution — read the SPA carefully and budget for a 6-month handover slip." : verdict === "is borderline" ? "Numbers are okay, not great. Only proceed if you're buying for appreciation or end-use, not pure yield." : "Pure-yield investors should pass. Owner-occupiers or appreciation-bet buyers may still find it compelling."}`,
        citations: [
          { docId: p.documents[0]?.id ?? "", docTitle: p.documents[0]?.title ?? "Brochure", page: 1, excerpt: p.summary.slice(0, 140) + "..." },
        ],
      };
    },
  },
  {
    match: /summar|overview|tell me about|what is this|key (point|finding)/i,
    buildResponse: ({ propertyId }) => {
      const p = propertyId ? getProperty(propertyId) : undefined;
      if (!p) {
        return {
          content:
            "Point me at a specific property from the library and I'll give you a structured rundown — the key facts, the financial picture, the SPA hot-spots, and what the market thinks of the community.",
        };
      }
      return {
        content: `**${p.name}** at a glance:\n\n- **${p.bedrooms}BR ${p.type}**, ${p.bua.toLocaleString()} sqft BUA in **${p.community}**\n- Priced at ${formatAed(p.price)} (${formatAed(p.pricePerSqft)}/sqft)\n- Developer: **${p.developer}** · Handover: ${new Date(p.handoverDate).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}\n- Service charge: AED ${p.serviceCharge}/sqft · Indicative gross yield: ${p.rentalYieldEstimate}%\n\n${p.summary}\n\n**Key findings I've already extracted:**\n\n${p.keyFindings.map((f) => `- ${f}`).join("\n")}\n\nAsk me about the **payment plan**, **yield math**, **SPA risks**, or the **community** to go deeper.`,
        citations: [
          { docId: p.documents[0]?.id ?? "", docTitle: p.documents[0]?.title ?? "Brochure", page: 1, excerpt: p.summary.slice(0, 140) + "..." },
        ],
      };
    },
  },
];

function buildFallback(ctx: ResponseContext): { content: string; citations?: Citation[] } {
  const p = ctx.propertyId ? getProperty(ctx.propertyId) : undefined;
  if (!p) {
    return {
      content: `I help analyze Dubai property documents — SPAs, brochures, payment plans, and market reports. To get a useful answer, pick a property from the library, or ask me about:\n\n- **Service charges, payment plans, or net yield** for a specific property\n- **SPA risks** — delay penalties, force-majeure clauses, Oqood registration, service-charge escalation\n- **Developer track records** and what slippage to budget for\n- **Community trade-offs** — schools, commute, short-term rental viability\n- **Mortgage feasibility** at current LTV caps\n\nPlain English works — I'll pull the relevant clauses with page citations.`,
    };
  }
  const annualRent = p.price * (p.rentalYieldEstimate / 100);
  const serviceChargeAnnual = p.serviceCharge * p.bua;
  const netYield = ((annualRent - serviceChargeAnnual) / p.price) * 100;
  return {
    content: `Here's what I know about **${p.name}** so far. Ask me anything more specific and I'll pull the supporting clause.\n\n**The basics**\n\n- ${p.bedrooms}BR ${p.type}, ${p.bua.toLocaleString()} sqft BUA in ${p.community}\n- ${formatAed(p.price)} total (${formatAed(p.pricePerSqft)}/sqft)\n- Developer: ${p.developer} · Handover ${new Date(p.handoverDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}\n\n**The numbers**\n\n- Gross yield: ${p.rentalYieldEstimate}% (~${formatAed(annualRent)}/yr at current market rents)\n- Service charge drag: ${formatAed(serviceChargeAnnual)}/yr at AED ${p.serviceCharge}/sqft\n- **Net yield: ${netYield.toFixed(2)}%**\n\n**What I'd flag**\n\n${p.keyFindings.map((f) => `- ${f}`).join("\n")}\n\nWhat angle do you want to dig into — financial, legal, or the area itself?`,
    citations: [
      { docId: p.documents[0]?.id ?? "", docTitle: p.documents[0]?.title ?? "Brochure", page: 1, excerpt: p.summary.slice(0, 140) + "..." },
    ],
  };
}

export function pickResponse(userMessage: string, ctx: ResponseContext): { content: string; citations?: Citation[] } {
  for (const t of templates) {
    if (t.match.test(userMessage)) return t.buildResponse(ctx);
  }
  return buildFallback(ctx);
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
