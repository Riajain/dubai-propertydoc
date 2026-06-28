export type DocumentKind = "brochure" | "spa" | "payment-plan" | "market-report" | "snagging" | "noc" | "other";

export interface DocumentRef {
  id: string;
  propertyId: string;
  kind: DocumentKind;
  title: string;
  pages: number;
  url: string;
  uploadedAt: string;
}

export interface PaymentMilestone {
  label: string;
  percent: number;
  due: string;
  status: "paid" | "upcoming" | "overdue";
}

export interface Property {
  id: string;
  name: string;
  developer: string;
  community: string;
  city: string;
  status: "off-plan" | "ready" | "under-construction";
  type: "Apartment" | "Villa" | "Townhouse" | "Penthouse";
  bedrooms: number;
  bathrooms: number;
  bua: number;
  saa?: number;
  price: number;
  pricePerSqft: number;
  handoverDate?: string;
  serviceCharge: number;
  rentalYieldEstimate: number;
  amenities: string[];
  paymentPlan: PaymentMilestone[];
  summary: string;
  keyFindings: string[];
  thumbnail?: string;
  documents: DocumentRef[];
}

export type ThreadKind = "general" | "financial" | "legal" | "location";

export interface Citation {
  docId: string;
  docTitle: string;
  page: number;
  excerpt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  createdAt: number;
}

export type RiskSeverity = "high" | "medium" | "low" | "info";

export interface RiskFlag {
  id: string;
  title: string;
  severity: RiskSeverity;
  clause: string;
  page: number;
  rationale: string;
  recommendation: string;
}

export interface GlossaryTerm {
  term: string;
  short: string;
  long: string;
  source?: string;
}
