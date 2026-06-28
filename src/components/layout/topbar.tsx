"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const labelMap: Record<string, string> = {
  library: "Library",
  doc: "Document",
  compare: "Compare",
  workflows: "Workflows",
  onboard: "Onboard property",
  "spa-audit": "SPA audit",
};

function humanize(seg: string): string {
  return labelMap[seg] ?? seg.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

export function Topbar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-5">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/library" className="hover:text-foreground">
          Home
        </Link>
        {segments.map((seg, i) => {
          const href = "/" + segments.slice(0, i + 1).join("/");
          const last = i === segments.length - 1;
          return (
            <span key={href} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5" />
              <Link
                href={href}
                className={last ? "text-foreground font-medium" : "hover:text-foreground"}
              >
                {humanize(seg)}
              </Link>
            </span>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents…"
            className="w-64 pl-8 text-sm"
            disabled
          />
        </div>
        <Badge variant="outline" className="hidden sm:inline-flex">
          v1 prototype
        </Badge>
        <ThemeToggle />
      </div>
    </header>
  );
}
