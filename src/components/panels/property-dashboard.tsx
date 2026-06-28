"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Coins, Calendar, Maximize2, Percent, Building2 } from "lucide-react";
import type { Property } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatAed, formatNumber } from "@/lib/utils";

interface PropertyDashboardProps {
  property: Property;
}

const statusVariant = {
  ready: "success",
  "off-plan": "warning",
  "under-construction": "outline",
} as const;

export function PropertyDashboard({ property }: PropertyDashboardProps) {
  const [open, setOpen] = useState(true);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <h2 className="truncate text-base font-semibold">{property.name}</h2>
              <Badge variant={statusVariant[property.status]}>{property.status}</Badge>
            </div>
            <div className="mt-0.5 truncate text-xs text-muted-foreground">
              {property.developer} · {property.community} · {property.bedrooms}BR {property.type}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen((o) => !o)} aria-label={open ? "Collapse" : "Expand"}>
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {open && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={Coins} label="Price" value={formatAed(property.price)} sub={`AED ${property.pricePerSqft.toLocaleString()}/sqft`} />
            <Stat icon={Maximize2} label="BUA" value={`${formatNumber(property.bua)} sqft`} sub={property.saa ? `SAA ${formatNumber(property.saa)} sqft` : undefined} />
            <Stat icon={Calendar} label="Handover" value={property.handoverDate ? new Date(property.handoverDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "—"} sub={property.status === "ready" ? "Delivered" : "Anticipated"} />
            <Stat icon={Percent} label="Est. yield" value={`${property.rentalYieldEstimate}% gross`} sub={`Service AED ${property.serviceCharge}/sqft`} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Summary
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-foreground/85">{property.summary}</p>
            </div>
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Key findings
              </h3>
              <ul className="mt-1 space-y-1 text-sm">
                {property.keyFindings.map((f, i) => (
                  <li key={i} className="flex gap-2 text-foreground/85">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold leading-tight">{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}
