import Link from "next/link";
import { Building2, BedDouble, Bath, Maximize2 } from "lucide-react";
import type { Property } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatAed, formatNumber } from "@/lib/utils";

interface DocumentCardProps {
  property: Property;
}

const statusVariant: Record<Property["status"], "outline" | "success" | "warning"> = {
  ready: "success",
  "off-plan": "warning",
  "under-construction": "outline",
};

const statusLabel: Record<Property["status"], string> = {
  ready: "Ready",
  "off-plan": "Off-plan",
  "under-construction": "Under construction",
};

export function DocumentCard({ property }: DocumentCardProps) {
  const docHref = `/doc/${property.documents[0]?.id ?? ""}`;
  return (
    <Link href={docHref} className="group block focus:outline-none">
      <Card className="h-full overflow-hidden transition-colors group-hover:border-primary/40 group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <div className="flex h-32 items-center justify-center border-b bg-gradient-to-br from-accent/40 to-muted">
          <Building2 className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate font-semibold leading-tight">{property.name}</div>
              <div className="truncate text-xs text-muted-foreground">{property.developer} · {property.community}</div>
            </div>
            <Badge variant={statusVariant[property.status]} className="shrink-0">
              {statusLabel[property.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" />
              {property.bedrooms} BR
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
              {property.bathrooms}
            </span>
            <span className="flex items-center gap-1">
              <Maximize2 className="h-3.5 w-3.5" />
              {formatNumber(property.bua)} sqft
            </span>
          </div>
          <p className="mt-3 line-clamp-2 text-sm text-foreground/80">
            {property.summary}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div>
            <div className="text-base font-semibold leading-none">{formatAed(property.price)}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              AED {property.pricePerSqft.toLocaleString()}/sqft
            </div>
          </div>
          <Badge variant="outline">
            {property.documents.length} doc{property.documents.length === 1 ? "" : "s"}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
