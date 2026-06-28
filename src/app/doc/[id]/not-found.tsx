import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <h1 className="text-xl font-semibold">Document not found</h1>
      <p className="text-sm text-muted-foreground">
        This document isn&apos;t in your library. It may have been removed, or you might have followed a stale link.
      </p>
      <Button asChild>
        <Link href="/library">Back to library</Link>
      </Button>
    </div>
  );
}
