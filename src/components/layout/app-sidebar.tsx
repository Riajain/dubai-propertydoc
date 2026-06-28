"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  GitCompareArrows,
  ShieldAlert,
  Upload,
  Library,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { properties } from "@/lib/mock/properties";

const nav = [
  { href: "/library", label: "Library", icon: Library },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/workflows/onboard", label: "Onboard property", icon: Upload },
  { href: "/workflows/spa-audit", label: "SPA audit", icon: ShieldAlert },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
      <Link href="/" className="flex items-center gap-2 px-5 py-4 hover:opacity-80 transition-opacity">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">Dubai PropertyDoc</span>
          <span className="text-[11px] text-muted-foreground">Research assistant</span>
        </div>
      </Link>

      <nav className="flex flex-col gap-0.5 px-2 pb-3">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                active ? "bg-accent text-accent-foreground" : "text-foreground/80 hover:bg-accent/50 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-3 border-t px-5 py-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Properties
        </div>
      </div>
      <div className="flex-1 overflow-auto px-2 pb-4">
        {properties.map((p) => {
          const href = `/doc/${p.documents[0]?.id ?? ""}` as const;
          const active = pathname.startsWith(`/doc/`) && pathname.includes(p.documents[0]?.id ?? "");
          return (
            <Link
              key={p.id}
              href={href}
              className={cn(
                "group flex items-start gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active ? "bg-accent text-accent-foreground" : "text-foreground/80 hover:bg-accent/50",
              )}
            >
              <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-[13px] leading-tight">{p.name}</span>
                <span className="truncate text-[11px] text-muted-foreground">{p.community}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
