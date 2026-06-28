import type { GlossaryTerm } from "@/lib/types";

export const glossary: GlossaryTerm[] = [
  {
    term: "Oqood",
    short: "Off-plan registration with Dubai Land Department",
    long: "Oqood is the interim title registration certificate issued by the Dubai Land Department (DLD) for off-plan properties. It records the buyer's beneficial ownership before the property is handed over and the title deed is issued. The developer is typically responsible for Oqood registration; a 4% DLD fee applies.",
    source: "DLD",
  },
  {
    term: "BUA",
    short: "Built-Up Area — interior sqft of the unit",
    long: "Built-Up Area (BUA) is the total interior floor area of a unit, measured from the inside of exterior walls. It excludes balconies and terraces, which are counted in the Suite Area / Sellable Area (SAA). Most pricing comps and rental valuations use BUA.",
  },
  {
    term: "SAA",
    short: "Suite/Sellable Area — BUA plus balconies",
    long: "Suite Area or Sellable Area (SAA, sometimes called Net Sellable Area) is BUA plus balconies, terraces, and sometimes a share of common areas. Off-plan sales contracts often price against SAA; resale comps usually quote BUA. Always check which is used when comparing properties.",
  },
  {
    term: "RERA",
    short: "Real Estate Regulatory Agency",
    long: "RERA is the regulatory arm of the Dubai Land Department. It oversees developer licensing, escrow accounts (Trust Account Law 8 of 2007), broker registration, and dispute resolution. RERA-issued Form A/B/F/I govern listing, agency, sales, and tenancy.",
    source: "DLD/RERA",
  },
  {
    term: "DLD",
    short: "Dubai Land Department",
    long: "The Dubai Land Department (DLD) is the government authority responsible for land registration, transfer fees, escrow oversight, and title deeds in Dubai. Transfer fee is 4% of the property value, typically split between buyer and seller by convention (often buyer pays).",
  },
  {
    term: "NOC",
    short: "No Objection Certificate from developer",
    long: "An NOC is a developer-issued certificate confirming there are no outstanding dues or restrictions on transferring the property. Required for resale transfers at the DLD trustee office. NOC fees range AED 500–5,000 and turnaround is usually 5–14 working days.",
  },
  {
    term: "service charge",
    short: "Annual community fee per sqft",
    long: "Service charges fund the operation and maintenance of common areas: pools, gym, landscaping, security, chiller infrastructure. Charged annually per sqft of BUA and approved by RERA. Compare across buildings — high service charges materially reduce net yield.",
  },
  {
    term: "escrow",
    short: "RERA-mandated developer trust account",
    long: "By law (Trust Account Law 8 of 2007), all off-plan payments must be deposited into a RERA-approved escrow account held by an approved bank. Funds are released to the developer against verified construction progress, protecting buyers from misappropriation.",
  },
  {
    term: "title deed",
    short: "Final ownership certificate from DLD",
    long: "The title deed is the final, definitive ownership certificate issued by the DLD on handover (for off-plan) or transfer (for resale). It supersedes Oqood. Always verify the title deed matches the SPA: unit number, plot, BUA, and owner name.",
  },
  {
    term: "Ejari",
    short: "Tenancy registration system",
    long: "Ejari is the mandatory tenancy contract registration system administered by RERA. All residential rental contracts in Dubai must be registered with Ejari; required for DEWA connection, visa renewals, and dispute filings.",
  },
  {
    term: "DEWA",
    short: "Dubai Electricity & Water Authority",
    long: "DEWA provides electricity and water. Connection requires Ejari (for tenants) or title deed/Oqood (for owners). Cooling (chilled water) is provided by district cooling providers like Empower or Emicool, billed separately.",
  },
  {
    term: "freehold",
    short: "Full ownership in designated zones",
    long: "Freehold gives full, perpetual ownership in zones designated for foreign ownership (per Article 4 of Law 7 of 2006). Most of new Dubai (Marina, Downtown, JVC, Dubai Hills, Creek) is freehold; older areas (Deira, Bur Dubai) are leasehold.",
  },
];

export function findGlossaryMatches(text: string): GlossaryTerm[] {
  const lower = text.toLowerCase();
  return glossary.filter((g) => lower.includes(g.term.toLowerCase()));
}

export function getGlossaryTerm(term: string): GlossaryTerm | undefined {
  return glossary.find((g) => g.term.toLowerCase() === term.toLowerCase());
}
