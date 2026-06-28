"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { DocumentRef, Property, Citation } from "@/lib/types";
import { PdfViewer, type PdfViewerHandle } from "@/components/document/pdf-viewer";
import { PropertyDashboard } from "@/components/panels/property-dashboard";
import { PaymentTimeline } from "@/components/panels/payment-timeline";
import { ChatPanel } from "@/components/chat/chat-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DocWorkspaceProps {
  property: Property;
  doc: DocumentRef;
}

export function DocWorkspace({ property, doc }: DocWorkspaceProps) {
  const viewerRef = useRef<PdfViewerHandle | null>(null);
  const [highlightPage, setHighlightPage] = useState<number | undefined>(undefined);

  function handleCitation(c: Citation) {
    setHighlightPage(c.page);
    viewerRef.current?.scrollToPage(c.page);
    window.setTimeout(() => setHighlightPage((cur) => (cur === c.page ? undefined : cur)), 2500);
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="border-b bg-background px-5 py-3">
        <PropertyDashboard property={property} />
      </div>

      <div className="flex min-h-0 flex-1">
        <section className="flex min-h-0 flex-1 flex-col border-r">
          <DocSelector property={property} active={doc} />
          <div className="min-h-0 flex-1">
            <PdfViewer ref={viewerRef} doc={doc} highlightPage={highlightPage} />
          </div>
        </section>

        <aside className="flex min-h-0 w-full max-w-[480px] flex-col border-l bg-background">
          <ChatPanel propertyId={property.id} onCitation={handleCitation} />
        </aside>
      </div>

      {property.paymentPlan.length > 0 && doc.kind !== "market-report" && (
        <details className="border-t bg-background">
          <summary className="flex cursor-pointer items-center gap-1.5 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground">
            <ChevronDown className="h-3.5 w-3.5" /> Payment timeline
          </summary>
          <div className="px-5 pb-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Payment milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentTimeline plan={property.paymentPlan} totalPrice={property.price} />
              </CardContent>
            </Card>
          </div>
        </details>
      )}
    </div>
  );
}

function DocSelector({ property, active }: { property: Property; active: DocumentRef }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b bg-muted/30 px-3 py-2">
      {property.documents.map((d) => (
        <a
          key={d.id}
          href={`/doc/${d.id}`}
          className={
            "shrink-0 rounded-md border px-3 py-1 text-xs transition-colors " +
            (d.id === active.id
              ? "border-primary bg-background text-foreground"
              : "border-transparent bg-background/60 text-muted-foreground hover:text-foreground")
          }
        >
          {d.title}
          <span className="ml-1.5 text-[10px] text-muted-foreground">{d.pages}p</span>
        </a>
      ))}
    </div>
  );
}
