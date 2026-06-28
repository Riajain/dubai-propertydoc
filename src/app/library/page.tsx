import Link from "next/link";
import { Plus, Upload } from "lucide-react";
import { properties } from "@/lib/mock/properties";
import { DocumentCard } from "@/components/document/document-card";
import { Button } from "@/components/ui/button";

export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Property library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Documents you&apos;ve ingested. Click any property to open its document and chat with it.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/compare">
              <Plus className="h-4 w-4" />
              Compare properties
            </Link>
          </Button>
          <Button asChild>
            <Link href="/workflows/onboard">
              <Upload className="h-4 w-4" />
              Onboard property
            </Link>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p) => (
          <DocumentCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
}
