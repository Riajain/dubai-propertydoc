"use client";

import { BookOpenText } from "lucide-react";
import type { ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getGlossaryTerm } from "@/lib/mock/glossary";
import { Badge } from "@/components/ui/badge";

interface ConceptPopoverProps {
  term: string;
  children: ReactNode;
}

export function ConceptPopover({ term, children }: ConceptPopoverProps) {
  const entry = getGlossaryTerm(term);
  if (!entry) return <>{children}</>;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="inline">
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex items-start gap-2">
          <BookOpenText className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold">{entry.term}</h4>
              {entry.source && <Badge variant="outline">{entry.source}</Badge>}
            </div>
            <p className="text-xs font-medium text-foreground/80">{entry.short}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{entry.long}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
