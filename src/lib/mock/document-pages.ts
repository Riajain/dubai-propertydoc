import type { DocumentRef } from "@/lib/types";
import { getProperty } from "@/lib/mock/properties";

interface PageBlock {
  heading?: string;
  body: string;
}

export interface MockPage {
  pageNumber: number;
  blocks: PageBlock[];
}

function brochurePages(propertyId: string): MockPage[] {
  const p = getProperty(propertyId);
  if (!p) return [];
  return [
    {
      pageNumber: 1,
      blocks: [
        { heading: p.name.toUpperCase(), body: `${p.developer} — ${p.community}` },
        { body: p.summary },
      ],
    },
    {
      pageNumber: 2,
      blocks: [
        { heading: "Project at a glance", body: `Status: ${p.status}\nType: ${p.type}\nBedrooms: ${p.bedrooms}  Bathrooms: ${p.bathrooms}\nBUA: ${p.bua.toLocaleString()} sqft  SAA: ${p.saa?.toLocaleString() ?? "—"} sqft\nHandover: ${p.handoverDate ?? "—"}` },
        { heading: "Headline price", body: `AED ${p.price.toLocaleString()} (AED ${p.pricePerSqft.toLocaleString()}/sqft)` },
      ],
    },
    {
      pageNumber: 3,
      blocks: [
        { heading: "Amenities", body: p.amenities.map((a) => `• ${a}`).join("\n") },
      ],
    },
    {
      pageNumber: 4,
      blocks: [
        { heading: "Payment plan", body: p.paymentPlan.map((m) => `${m.label} — ${m.percent}% — ${new Date(m.due).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`).join("\n") },
      ],
    },
    {
      pageNumber: 8,
      blocks: [
        { heading: "Market context", body: `Comparable 2BR units in ${p.community} traded between AED ${(p.pricePerSqft - 200).toLocaleString()}–${(p.pricePerSqft + 200).toLocaleString()}/sqft in the last 90 days. Inventory turnover ~62 days. Q2 absorption rate 78% of available units.` },
      ],
    },
    {
      pageNumber: 12,
      blocks: [
        { heading: "Service charges", body: `Service Charge: AED ${p.serviceCharge.toFixed(1)} per sqft of BUA, payable annually. Includes maintenance of common areas, security, landscaping, pool, gym, and ${p.serviceCharge > 15 ? "chilled-water infrastructure (district cooling charged separately by Empower)" : "basic facilities"}.` },
        { body: "Service charges are reviewed annually by the Owners Association and approved by RERA. Owners should budget a 5–10% escalation in years 2–3 once warranty periods end." },
      ],
    },
  ];
}

function spaPages(propertyId: string): MockPage[] {
  const p = getProperty(propertyId);
  if (!p) return [];
  return [
    {
      pageNumber: 1,
      blocks: [
        { heading: "SALE AND PURCHASE AGREEMENT", body: `Between ${p.developer} (the "Developer")\nand the Purchaser named in Schedule A\nin respect of unit at ${p.name}, ${p.community}, Dubai.` },
      ],
    },
    {
      pageNumber: 4,
      blocks: [
        { heading: "1. Purchase Price & Payment Plan", body: `Total Purchase Price: AED ${p.price.toLocaleString()}\n\nPayments per Schedule B: ${p.paymentPlan.map((m) => `${m.percent}% — ${m.label}`).join("; ")}. Each milestone is tied to a Construction Completion Certificate issued by the Project Engineer.` },
        { body: "The Purchaser shall make all payments into the Project Escrow Account designated in Schedule D." },
      ],
    },
    {
      pageNumber: 6,
      blocks: [
        { heading: "3. Escrow Account", body: "All Purchase Price payments shall be deposited into the Project Escrow Account held with [Bank], registered with the Dubai Land Department under escrow account reference [#####]." },
        { body: "Withdrawals from the escrow account shall be made by the Developer only against verified construction progress, per Trust Account Law 8 of 2007." },
      ],
    },
    {
      pageNumber: 12,
      blocks: [
        { heading: "7. Delay & Liquidated Damages", body: "In the event of delay in handover beyond twelve (12) calendar months from the Anticipated Completion Date, the Developer's total liability shall not exceed five percent (5%) of the Purchase Price." },
      ],
    },
    {
      pageNumber: 18,
      blocks: [
        { heading: "9. Fees & Costs", body: "The Purchaser shall bear all DLD registration fees including but not limited to the four percent (4%) Oqood fee and AED 3,000 administrative fee. The Purchaser is also responsible for trustee office fees on handover (approx. AED 4,200)." },
      ],
    },
    {
      pageNumber: 21,
      blocks: [
        { heading: "11. Force Majeure", body: "Force Majeure shall include, without limitation, acts of God, war, pandemic, regulatory changes, and adverse market or economic conditions affecting the Developer." },
      ],
    },
    {
      pageNumber: 27,
      blocks: [
        { heading: "14. Service Charges", body: "The Service Charge is subject to annual revision by the Owners Association in line with RERA-approved budgets." },
      ],
    },
    {
      pageNumber: 30,
      blocks: [
        { heading: "16. Termination & Remedies", body: "The Purchaser shall not be entitled to terminate this Agreement on grounds of delay so long as the Developer continues to perform." },
      ],
    },
    {
      pageNumber: 33,
      blocks: [
        { heading: "18. Snagging Period", body: "The Purchaser shall have thirty (30) days from the Handover Date to submit any snagging items in writing. Submissions outside this window shall be at the Developer's discretion." },
      ],
    },
    {
      pageNumber: 35,
      blocks: [
        { heading: "19. Assignment", body: "Assignment of this Agreement to a third party shall require the Developer's prior written consent and payment of an Assignment Fee of two percent (2%) of the Purchase Price." },
      ],
    },
  ];
}

function marketPages(propertyId: string): MockPage[] {
  const p = getProperty(propertyId);
  if (!p) return [];
  return [
    {
      pageNumber: 1,
      blocks: [
        { heading: `${p.community} — Quarterly Market Report`, body: `Coverage period: Q2 2026.\nPrepared by independent research. Sources: DLD, REIDIN, Property Monitor.` },
      ],
    },
    {
      pageNumber: 4,
      blocks: [
        { heading: "Transaction volume", body: `Off-plan transactions in ${p.community} grew 18% YoY in Q2 2026. Average ticket size AED ${(p.price / 1_000_000).toFixed(2)}M. Median time-to-sale 47 days.` },
      ],
    },
    {
      pageNumber: 8,
      blocks: [
        { heading: "Rental comps", body: `Long-term 2BR rentals in ${p.community}: AED 175,000–195,000/year. Short-term (holiday-home permit): AED 240,000–280,000/year effective, net of platform fees and operator commission.` },
      ],
    },
  ];
}

function paymentPlanPages(propertyId: string): MockPage[] {
  const p = getProperty(propertyId);
  if (!p) return [];
  return [
    {
      pageNumber: 1,
      blocks: [
        { heading: `Payment Plan — ${p.name}`, body: `Total Purchase Price: AED ${p.price.toLocaleString()}` },
      ],
    },
    {
      pageNumber: 2,
      blocks: [
        { heading: "Schedule", body: p.paymentPlan.map((m) => `• ${m.label}: ${m.percent}% — AED ${Math.round(p.price * m.percent / 100).toLocaleString()} — due ${new Date(m.due).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`).join("\n") },
      ],
    },
    {
      pageNumber: 4,
      blocks: [
        { heading: "Milestone definitions", body: "Each construction milestone is verified by the Project Engineer's Completion Certificate, countersigned by RERA. Payment is due within 14 calendar days of certificate issuance." },
      ],
    },
  ];
}

export function getMockPages(doc: DocumentRef): MockPage[] {
  switch (doc.kind) {
    case "brochure":
      return brochurePages(doc.propertyId);
    case "spa":
      return spaPages(doc.propertyId);
    case "market-report":
      return marketPages(doc.propertyId);
    case "payment-plan":
      return paymentPlanPages(doc.propertyId);
    default:
      return [
        {
          pageNumber: 1,
          blocks: [
            { heading: doc.title, body: "This document hasn't been parsed yet. In production, RAG would surface relevant sections here." },
          ],
        },
      ];
  }
}
