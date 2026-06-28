import { notFound } from "next/navigation";
import { getDocument } from "@/lib/mock/properties";
import { DocWorkspace } from "@/components/document/doc-workspace";

interface DocPageProps {
  params: Promise<{ id: string }>;
}

export default async function DocPage({ params }: DocPageProps) {
  const { id } = await params;
  const found = getDocument(id);
  if (!found) notFound();
  return <DocWorkspace property={found.property} doc={found.doc} />;
}
