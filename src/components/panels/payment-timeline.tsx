import { Check, Clock, AlertCircle } from "lucide-react";
import type { PaymentMilestone } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PaymentTimelineProps {
  plan: PaymentMilestone[];
  totalPrice: number;
}

const statusMeta = {
  paid: { icon: Check, color: "text-[oklch(0.45_0.16_145)] bg-[oklch(0.65_0.18_145)]/15 border-[oklch(0.65_0.18_145)]/30" },
  upcoming: { icon: Clock, color: "text-muted-foreground bg-muted border-border" },
  overdue: { icon: AlertCircle, color: "text-destructive bg-destructive/15 border-destructive/30" },
} as const;

export function PaymentTimeline({ plan, totalPrice }: PaymentTimelineProps) {
  return (
    <ol className="space-y-3">
      {plan.map((m, i) => {
        const meta = statusMeta[m.status];
        const Icon = meta.icon;
        const amount = Math.round((totalPrice * m.percent) / 100);
        return (
          <li key={i} className="flex items-start gap-3">
            <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border", meta.color)}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{m.label}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(m.due).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {m.percent}% · AED {amount.toLocaleString()}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
