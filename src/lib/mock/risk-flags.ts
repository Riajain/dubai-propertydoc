import type { RiskFlag } from "@/lib/types";

export const sampleRiskFlags: RiskFlag[] = [
  {
    id: "rf-1",
    title: "Construction delay penalty caps developer liability at 5%",
    severity: "high",
    clause:
      "In the event of delay in handover beyond twelve (12) calendar months from the Anticipated Completion Date, the Developer's total liability shall not exceed five percent (5%) of the Purchase Price.",
    page: 12,
    rationale:
      "Common in Dubai SPAs but uncommonly buyer-unfriendly. 5% is below the market norm of 10% and leaves you under-compensated for delays >18 months.",
    recommendation: "Negotiate this cap up to 10–15% or remove the 12-month grace period. Reference Law 13 of 2008 for force majeure scope.",
  },
  {
    id: "rf-2",
    title: "Oqood registration fee shifted to buyer",
    severity: "medium",
    clause:
      "The Purchaser shall bear all DLD registration fees including but not limited to the four percent (4%) Oqood fee and AED 3,000 administrative fee.",
    page: 18,
    rationale:
      "Standard practice in some developers' SPAs but worth confirming. Some master developers (Emaar, Dubai Properties) absorb part of this in promotional periods.",
    recommendation: "Verify against the agent's offer letter and any promotional waiver. If a fee-waiver was discussed, get it in writing on Schedule C.",
  },
  {
    id: "rf-3",
    title: "Force majeure clause extends to 'market conditions'",
    severity: "high",
    clause:
      "Force Majeure shall include, without limitation, acts of God, war, pandemic, regulatory changes, and adverse market or economic conditions affecting the Developer.",
    page: 21,
    rationale:
      "Including 'market conditions' is non-standard and lets the developer suspend delivery for commercial reasons. Courts may not enforce, but it muddies dispute proceedings.",
    recommendation: "Strike 'adverse market or economic conditions' from the definition. Anchor force majeure to events outside the developer's reasonable control.",
  },
  {
    id: "rf-4",
    title: "Service-charge escalation uncapped",
    severity: "medium",
    clause:
      "The Service Charge is subject to annual revision by the Owners Association in line with RERA-approved budgets.",
    page: 27,
    rationale:
      "RERA does approve service charges, but new buildings frequently see 15–30% increases in years 2–3 once warranty periods end.",
    recommendation: "Request a 3-year service-charge cap (CPI + 5%) from the developer in writing. Verify against the latest RERA Mollak filing if available.",
  },
  {
    id: "rf-5",
    title: "No exit clause for buyer if handover slips >24 months",
    severity: "high",
    clause:
      "The Purchaser shall not be entitled to terminate this Agreement on grounds of delay so long as the Developer continues to perform.",
    page: 30,
    rationale:
      "Removes the buyer's right to rescind even for extreme delays. Article 11 of Law 13 of 2008 actually permits rescission in defined cases — this clause attempts to waive that protection.",
    recommendation: "Insist on a mutual rescission right after a 24-month delay with full refund + 6% interest per RERA precedent.",
  },
  {
    id: "rf-6",
    title: "Snagging period limited to 30 days post-handover",
    severity: "medium",
    clause:
      "The Purchaser shall have thirty (30) days from the Handover Date to submit any snagging items in writing.",
    page: 33,
    rationale:
      "Short window. UAE Civil Code grants a 10-year decennial liability for structural defects regardless of contractual snagging period, but cosmetic items revert to the buyer after 30 days.",
    recommendation: "Negotiate 90 days. Engage an independent snagging company within the first 14 days to maximize coverage.",
  },
  {
    id: "rf-7",
    title: "Escrow account compliant with Law 8 of 2007",
    severity: "info",
    clause:
      "All Purchase Price payments shall be deposited into the Project Escrow Account held with [Bank], registered with the Dubai Land Department under escrow account reference [#####].",
    page: 6,
    rationale:
      "This is the protective clause working in your favour — confirms RERA escrow compliance.",
    recommendation: "Verify the escrow account reference number on the DLD project information page before transferring any funds.",
  },
  {
    id: "rf-8",
    title: "Assignment / resale before handover restricted",
    severity: "low",
    clause:
      "Assignment of this Agreement to a third party shall require the Developer's prior written consent and payment of an Assignment Fee of two percent (2%) of the Purchase Price.",
    page: 35,
    rationale:
      "Common across Dubai off-plan. 2% is on the high end (1–1.5% is typical).",
    recommendation: "If you anticipate flipping pre-handover, negotiate fee down to 1% or seek a fee waiver after 50% paid.",
  },
];
