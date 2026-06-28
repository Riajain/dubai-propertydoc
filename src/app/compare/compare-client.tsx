"use client";

import { useState } from "react";
import type { Property, Citation } from "@/lib/types";
import { ComparePicker } from "@/components/workflows/compare-picker";
import { ComparisonTable } from "@/components/panels/comparison-table";
import { ChatPanel } from "@/components/chat/chat-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CompareClientProps {
  properties: Property[];
}

export function CompareClient({ properties }: CompareClientProps) {
  const [selected, setSelected] = useState<string[]>(properties.slice(0, 2).map((p) => p.id));

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function handleCitation(_: Citation) {
    // No-op in compare view; the chat panel still emits citations but there's no PDF to scroll.
  }

  const selectedProps = selected
    .map((id) => properties.find((p) => p.id === id))
    .filter((p): p is Property => Boolean(p));

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="border-b bg-background px-6 py-5">
        <h1 className="text-2xl font-semibold tracking-tight">Compare properties</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick two or more properties and ask cross-document questions.
        </p>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_440px]">
        <div className="flex min-h-0 flex-col overflow-y-auto border-r">
          <div className="space-y-4 p-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Select properties</CardTitle>
              </CardHeader>
              <CardContent>
                <ComparePicker properties={properties} selected={selected} onToggle={toggle} />
              </CardContent>
            </Card>

            <ComparisonTable properties={selectedProps} />
          </div>
        </div>

        <aside className="flex min-h-0 flex-col bg-background">
          {selectedProps.length >= 2 ? (
            <ChatPanel
              propertyIds={selected}
              onCitation={handleCitation}
              defaultThread="financial"
              threads={["general", "financial", "legal"]}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-muted-foreground">
              Select at least 2 properties to start a cross-document chat.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
