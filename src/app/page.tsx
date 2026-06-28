import Link from "next/link";
import {
  Sparkles,
  Library as LibraryIcon,
  GitCompareArrows,
  Upload,
  ShieldAlert,
  ArrowRight,
  Building2,
  Briefcase,
  Scale,
  Wallet,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const workflows = [
  {
    icon: LibraryIcon,
    title: "Property library",
    href: "/library",
    body: "Every property you're researching in one place — developer, community, BUA, handover, estimated yield.",
  },
  {
    icon: GitCompareArrows,
    title: "Side-by-side compare",
    href: "/compare",
    body: "Net yield after service charges, price per sqft, handover date, payment plans. Best and worst values highlighted.",
  },
  {
    icon: Upload,
    title: "Property onboarding",
    href: "/workflows/onboard",
    body: "Drop a brochure and SPA. Get a structured profile — payment milestones, key terms, financial snapshot.",
  },
  {
    icon: ShieldAlert,
    title: "SPA audit",
    href: "/workflows/spa-audit",
    body: "Flag construction-delay penalty caps, uncapped service-charge escalation, force-majeure language. Each flag comes with a recommendation.",
  },
];

const audience = [
  {
    icon: Building2,
    title: "Off-plan investors",
    body: "Buying a unit before it's built. You need to read the SPA you're not going to read.",
  },
  {
    icon: Briefcase,
    title: "Buyer's agents & consultants",
    body: "Prep for client calls in minutes. Offer an SPA review as a value-add service.",
  },
  {
    icon: Wallet,
    title: "Family offices & landlords",
    body: "Compare candidates on net yield — not list price. Pick the unit that actually returns.",
  },
  {
    icon: Scale,
    title: "Real estate lawyers",
    body: "First-pass clause review. Surface the high-severity issues; spend your hours on those.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <section className="flex flex-col items-start gap-6">
        <Badge variant="outline" className="gap-1.5">
          <Sparkles className="h-3 w-3" />
          Dubai real estate · research assistant
        </Badge>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Chat with your Dubai property documents.
        </h1>
        <p className="max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
          Stop reading 60-page SPAs. Compare properties on the numbers that actually
          matter. Catch predatory clauses before you sign. Built for the people
          spending — and advising on — millions of dirhams.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <Link href="/library">
              Try the demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a
              href="https://github.com/Riajain/dubai-propertydoc"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="h-4 w-4" />
              Source on GitHub
            </a>
          </Button>
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight">What you can do</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Four workflows, each backed by chat that cites the exact page of the source document.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {workflows.map(({ icon: Icon, title, href, body }) => (
            <Link key={href} href={href} className="group">
              <Card className="h-full transition-colors group-hover:bg-accent/50">
                <CardHeader className="flex-row items-start gap-3 space-y-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription>{body}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Who it&apos;s for</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Anyone making a high-stakes decision based on documents they don&apos;t have time to read carefully.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audience.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-lg border bg-card px-4 py-4">
              <Icon className="h-5 w-5 text-primary" />
              <div className="mt-3 text-sm font-semibold">{title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-xl border bg-muted/50 px-6 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold">This is a working prototype.</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Chat, document parsing, and uploads are mocked client-side. The UX and
              workflows are real; the AI backend isn&apos;t wired up yet.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/library">
              Explore the demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
