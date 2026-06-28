"use client";

import { FileText } from "lucide-react";
import type { Citation } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CitationChipProps {
  citation: Citation;
  onSelect: (citation: Citation) => void;
}

export function CitationChip({ citation, onSelect }: CitationChipProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(citation)}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-md border bg-background px-2 py-1 text-[11px] text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground",
      )}
      title={citation.excerpt}
    >
      <FileText className="h-3 w-3" />
      <span className="font-medium">{citation.docTitle}</span>
      <span className="text-muted-foreground">· p.{citation.page}</span>
    </button>
  );
}
