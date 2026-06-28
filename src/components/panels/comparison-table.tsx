import type { Property } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { formatAed, formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ComparisonTableProps {
  properties: Property[];
}

interface Row {
  label: string;
  get: (p: Property) => string | number;
  highlight?: "max" | "min";
  format?: (v: string | number) => string;
}

const rows: Row[] = [
  { label: "Developer", get: (p) => p.developer },
  { label: "Community", get: (p) => p.community },
  { label: "Status", get: (p) => p.status },
  { label: "Type", get: (p) => `${p.bedrooms}BR ${p.type}` },
  { label: "BUA (sqft)", get: (p) => p.bua, highlight: "max", format: (v) => formatNumber(Number(v)) },
  { label: "Price", get: (p) => p.price, highlight: "min", format: (v) => formatAed(Number(v)) },
  { label: "Price / sqft", get: (p) => p.pricePerSqft, highlight: "min", format: (v) => `AED ${Number(v).toLocaleString()}` },
  { label: "Service charge / sqft", get: (p) => p.serviceCharge, highlight: "min", format: (v) => `AED ${Number(v).toFixed(1)}` },
  { label: "Est. gross yield", get: (p) => p.rentalYieldEstimate, highlight: "max", format: (v) => `${v}%` },
  {
    label: "Net yield (after SC)",
    get: (p) => {
      const annualRent = p.price * (p.rentalYieldEstimate / 100);
      const sc = p.serviceCharge * p.bua;
      return Number((((annualRent - sc) / p.price) * 100).toFixed(2));
    },
    highlight: "max",
    format: (v) => `${v}%`,
  },
  { label: "Handover", get: (p) => p.handoverDate ?? "—" },
];

export function ComparisonTable({ properties }: ComparisonTableProps) {
  if (properties.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
        Pick at least two properties from the picker to compare.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Metric</th>
            {properties.map((p) => (
              <th key={p.id} className="px-4 py-3 text-left font-semibold">
                <div className="truncate">{p.name}</div>
                <div className="mt-0.5 text-[11px] font-normal text-muted-foreground">{p.community}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const values = properties.map((p) => row.get(p));
            const numeric = values.every((v) => typeof v === "number");
            const best = numeric && row.highlight
              ? row.highlight === "max"
                ? Math.max(...(values as number[]))
                : Math.min(...(values as number[]))
              : undefined;
            return (
              <tr key={row.label} className={cn(ri % 2 ? "bg-muted/20" : "bg-background")}>
                <td className="px-4 py-2.5 font-medium text-muted-foreground">{row.label}</td>
                {properties.map((p, pi) => {
                  const v = values[pi];
                  const isBest = best !== undefined && v === best && properties.length > 1;
                  return (
                    <td key={p.id} className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span>{row.format ? row.format(v) : String(v)}</span>
                        {isBest && <Badge variant="success">Best</Badge>}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
