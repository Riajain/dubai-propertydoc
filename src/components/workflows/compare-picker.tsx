"use client";

import { Check } from "lucide-react";
import type { Property } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ComparePickerProps {
  properties: Property[];
  selected: string[];
  onToggle: (id: string) => void;
}

export function ComparePicker({ properties, selected, onToggle }: ComparePickerProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((p) => {
        const isSelected = selected.includes(p.id);
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onToggle(p.id)}
            className={cn(
              "flex items-start gap-3 rounded-lg border bg-card p-3 text-left transition-colors hover:border-primary/40",
              isSelected && "border-primary bg-accent/50",
            )}
          >
            <div
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                isSelected ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background",
              )}
            >
              {isSelected && <Check className="h-3.5 w-3.5" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{p.name}</div>
              <div className="truncate text-xs text-muted-foreground">
                {p.community} · AED {(p.price / 1_000_000).toFixed(2)}M
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
