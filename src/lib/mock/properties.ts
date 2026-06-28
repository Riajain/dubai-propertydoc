import type { Property } from "@/lib/types";

export const properties: Property[] = [
  {
    id: "creek-vistas-grande",
    name: "Creek Vistas Grande",
    developer: "Sobha Realty",
    community: "Sobha Hartland",
    city: "Dubai",
    status: "off-plan",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    bua: 1180,
    saa: 1240,
    price: 2_650_000,
    pricePerSqft: 2245,
    handoverDate: "2026-12-31",
    serviceCharge: 18.5,
    rentalYieldEstimate: 6.4,
    amenities: [
      "Infinity pool",
      "Sky lounge",
      "Padel court",
      "24/7 concierge",
      "Smart-home wiring",
    ],
    paymentPlan: [
      { label: "Down payment", percent: 20, due: "2024-09-01", status: "paid" },
      { label: "Construction milestone 1", percent: 10, due: "2025-03-01", status: "paid" },
      { label: "Construction milestone 2", percent: 10, due: "2025-09-01", status: "upcoming" },
      { label: "Construction milestone 3", percent: 10, due: "2026-03-01", status: "upcoming" },
      { label: "On handover", percent: 50, due: "2026-12-31", status: "upcoming" },
    ],
    summary:
      "Premium 2-bedroom apartment in Sobha Hartland with creek and skyline views. Branded by Sobha, with elevated amenities and a 50/50 post-handover plan. Strong yield potential at handover.",
    keyFindings: [
      "Service charge AED 18.5/sqft is on the high end for the community.",
      "Payment plan front-loads 30% in year one, then back-loads 50% to handover.",
      "Sobha typically delivers within ±3 months of stated handover.",
      "Master community allows short-term rental with NOC.",
    ],
    documents: [
      {
        id: "creek-brochure",
        propertyId: "creek-vistas-grande",
        kind: "brochure",
        title: "Creek Vistas Grande — Brochure",
        pages: 24,
        url: "/samples/brochure.pdf",
        uploadedAt: "2026-05-10T09:00:00Z",
      },
      {
        id: "creek-spa",
        propertyId: "creek-vistas-grande",
        kind: "spa",
        title: "Sale & Purchase Agreement",
        pages: 38,
        url: "/samples/spa.pdf",
        uploadedAt: "2026-05-12T11:00:00Z",
      },
      {
        id: "creek-market",
        propertyId: "creek-vistas-grande",
        kind: "market-report",
        title: "Sobha Hartland Q2 Market Report",
        pages: 12,
        url: "/samples/market.pdf",
        uploadedAt: "2026-05-15T16:30:00Z",
      },
    ],
  },
  {
    id: "marina-vista-tower-2",
    name: "Marina Vista Tower 2",
    developer: "Emaar Beachfront",
    community: "Dubai Harbour",
    city: "Dubai",
    status: "ready",
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 3,
    bua: 1620,
    saa: 1710,
    price: 5_300_000,
    pricePerSqft: 3272,
    handoverDate: "2025-04-15",
    serviceCharge: 22.1,
    rentalYieldEstimate: 5.6,
    amenities: [
      "Private beach access",
      "Two pools",
      "Co-working lounge",
      "Yacht club membership",
      "Kids' play area",
    ],
    paymentPlan: [
      { label: "10% booking", percent: 10, due: "2022-06-01", status: "paid" },
      { label: "Construction draws", percent: 70, due: "2024-12-01", status: "paid" },
      { label: "On handover", percent: 20, due: "2025-04-15", status: "paid" },
    ],
    summary:
      "Ready 3-bedroom apartment in Emaar Beachfront with direct beach access. Already handed over and Oqood-registered. Suited to end-users or investors targeting short-term rentals.",
    keyFindings: [
      "Premium pricing at AED 3,272/sqft, in line with Beachfront comps.",
      "Service charge AED 22.1/sqft includes chiller and beach maintenance.",
      "Eligible for holiday-home permit; short-term yields ~7.5%.",
      "Mortgage-ready; valuation matches contracted price.",
    ],
    documents: [
      {
        id: "marina-brochure",
        propertyId: "marina-vista-tower-2",
        kind: "brochure",
        title: "Marina Vista — Brochure",
        pages: 18,
        url: "/samples/brochure.pdf",
        uploadedAt: "2026-04-22T08:00:00Z",
      },
      {
        id: "marina-spa",
        propertyId: "marina-vista-tower-2",
        kind: "spa",
        title: "SPA — Marina Vista Unit 1408",
        pages: 42,
        url: "/samples/spa.pdf",
        uploadedAt: "2026-04-25T10:30:00Z",
      },
    ],
  },
  {
    id: "the-valley-rivana",
    name: "Rivana at The Valley",
    developer: "Emaar Properties",
    community: "The Valley",
    city: "Dubai",
    status: "under-construction",
    type: "Townhouse",
    bedrooms: 4,
    bathrooms: 4,
    bua: 2410,
    saa: 2580,
    price: 3_180_000,
    pricePerSqft: 1320,
    handoverDate: "2027-06-30",
    serviceCharge: 4.2,
    rentalYieldEstimate: 5.1,
    amenities: [
      "Community pool",
      "Cycling track",
      "Pocket park",
      "Retail boulevard",
      "Family clubhouse",
    ],
    paymentPlan: [
      { label: "Booking", percent: 10, due: "2024-11-01", status: "paid" },
      { label: "8 construction milestones", percent: 70, due: "2027-03-01", status: "upcoming" },
      { label: "On handover", percent: 20, due: "2027-06-30", status: "upcoming" },
    ],
    summary:
      "4-bedroom townhouse in The Valley by Emaar. Family-oriented suburban community, anchored by retail and schools. Long handover horizon but attractive entry pricing.",
    keyFindings: [
      "Service charge AED 4.2/sqft is exceptionally low (townhouse community).",
      "Capital appreciation over construction expected at 18–24%.",
      "Lower rental yield offset by lower service-charge drag.",
      "Schools (Gems and Aldar) committed within 5km radius.",
    ],
    documents: [
      {
        id: "rivana-brochure",
        propertyId: "the-valley-rivana",
        kind: "brochure",
        title: "Rivana — Master Brochure",
        pages: 22,
        url: "/samples/brochure.pdf",
        uploadedAt: "2026-06-01T12:00:00Z",
      },
      {
        id: "rivana-payment",
        propertyId: "the-valley-rivana",
        kind: "payment-plan",
        title: "Payment Plan Schedule",
        pages: 4,
        url: "/samples/payment-plan.pdf",
        uploadedAt: "2026-06-01T12:05:00Z",
      },
    ],
  },
];

export function getProperty(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}

export function getDocument(docId: string): { property: Property; doc: Property["documents"][number] } | undefined {
  for (const property of properties) {
    const doc = property.documents.find((d) => d.id === docId);
    if (doc) return { property, doc };
  }
  return undefined;
}
