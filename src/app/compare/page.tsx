import { properties } from "@/lib/mock/properties";
import { CompareClient } from "@/app/compare/compare-client";

export default function ComparePage() {
  return <CompareClient properties={properties} />;
}
