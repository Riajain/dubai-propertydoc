"use client";

import { AlertTriangle, AlertCircle, Info, ShieldCheck } from "lucide-react";
import type { RiskFlag, RiskSeverity } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const meta: Record<RiskSeverity, { label: string; variant: "destructive" | "warning" | "secondary" | "success"; icon: React.ComponentType<{ className?: string }> }> = {
  high: { label: "High", variant: "destructive", icon: AlertTriangle },
  medium: { label: "Medium", variant: "warning", icon: AlertCircle },
  low: { label: "Low", variant: "secondary", icon: Info },
  info: { label: "OK", variant: "success", icon: ShieldCheck },
};

interface RiskFlagsPanelProps {
  flags: RiskFlag[];
  onFlagClick?: (flag: RiskFlag) => void;
}

export function RiskFlagsPanel({ flags, onFlagClick }: RiskFlagsPanelProps) {
  const counts = flags.reduce(
    (acc, f) => {
      acc[f.severity] = (acc[f.severity] ?? 0) + 1;
      return acc;
    },
    { high: 0, medium: 0, low: 0, info: 0 } as Record<RiskSeverity, number>,
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Risk flags</CardTitle>
          <div className="flex items-center gap-1.5">
            {(["high", "medium", "low", "info"] as RiskSeverity[]).map((sev) =>
              counts[sev] > 0 ? (
                <Badge key={sev} variant={meta[sev].variant}>
                  {counts[sev]} {meta[sev].label}
                </Badge>
              ) : null,
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {flags.map((f) => {
          const m = meta[f.severity];
          const Icon = m.icon;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onFlagClick?.(f)}
              className="block w-full rounded-lg border bg-background p-4 text-left transition-colors hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold leading-tight">{f.title}</h3>
                    <Badge variant={m.variant}>{m.label}</Badge>
                    <span className="text-[11px] text-muted-foreground">p.{f.page}</span>
                  </div>
                  <blockquote className="mt-2 border-l-2 border-muted-foreground/30 pl-3 text-xs italic text-foreground/75">
                    {f.clause}
                  </blockquote>
                  <p className="mt-2 text-xs text-foreground/80">{f.rationale}</p>
                  <p className="mt-1.5 text-xs">
                    <span className="font-medium text-primary">Recommend:</span>{" "}
                    <span className="text-foreground/85">{f.recommendation}</span>
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
