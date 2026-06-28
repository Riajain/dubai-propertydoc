"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import type { DocumentRef } from "@/lib/types";
import { getMockPages } from "@/lib/mock/document-pages";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface PdfViewerHandle {
  scrollToPage: (page: number) => void;
}

interface PdfViewerProps {
  doc: DocumentRef;
  highlightPage?: number;
}

export const PdfViewer = forwardRef<PdfViewerHandle, PdfViewerProps>(function PdfViewer(
  { doc, highlightPage },
  ref,
) {
  const scrollViewportRef = useRef<HTMLDivElement | null>(null);
  const pages = getMockPages(doc);

  useImperativeHandle(ref, () => ({
    scrollToPage(page: number) {
      const el = document.getElementById(`page-${doc.id}-${page}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
  }));

  return (
    <ScrollArea className="h-full w-full bg-muted/40">
      <div ref={scrollViewportRef} className="mx-auto flex flex-col items-center gap-6 px-4 py-6">
        {pages.length === 0 ? (
          <div className="rounded-md border bg-card px-6 py-12 text-sm text-muted-foreground">
            This document hasn&apos;t been parsed yet.
          </div>
        ) : (
          pages.map((page) => (
            <article
              key={page.pageNumber}
              id={`page-${doc.id}-${page.pageNumber}`}
              className={cn(
                "w-full max-w-2xl rounded-md border bg-card shadow-sm transition-all",
                highlightPage === page.pageNumber && "ring-2 ring-primary/60 ring-offset-2 ring-offset-background",
              )}
            >
              <div className="flex items-center justify-between border-b px-6 py-2.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                <span>{doc.title}</span>
                <span>Page {page.pageNumber}</span>
              </div>
              <div className="space-y-4 px-8 py-7 text-sm leading-relaxed">
                {page.blocks.map((block, i) => (
                  <div key={i}>
                    {block.heading && (
                      <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-foreground/80">
                        {block.heading}
                      </h3>
                    )}
                    <p className="whitespace-pre-wrap text-foreground/90">{block.body}</p>
                  </div>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </ScrollArea>
  );
});
