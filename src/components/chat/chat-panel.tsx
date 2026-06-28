"use client";

import { useState } from "react";
import { Briefcase, MapPin, Scale, MessagesSquare, Maximize2, Minimize2 } from "lucide-react";
import type { Citation, ThreadKind } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatThread } from "@/components/chat/chat-thread";

interface ChatPanelProps {
  propertyId?: string;
  propertyIds?: string[];
  onCitation: (c: Citation) => void;
  defaultThread?: ThreadKind;
  threads?: ThreadKind[];
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

const threadMeta: Record<ThreadKind, { label: string; icon: React.ComponentType<{ className?: string }>; suggestions: string[] }> = {
  general: {
    label: "General",
    icon: MessagesSquare,
    suggestions: [
      "Summarize this document",
      "What are the top risks I should know?",
      "Compare against similar properties in the community",
    ],
  },
  financial: {
    label: "Financial",
    icon: Briefcase,
    suggestions: [
      "What's the payment plan?",
      "What's the expected rental yield?",
      "How do service charges affect my net yield?",
      "What mortgage LTV applies here?",
    ],
  },
  legal: {
    label: "Legal",
    icon: Scale,
    suggestions: [
      "What are the top SPA risks?",
      "Explain the force majeure clause",
      "Is Oqood registration the buyer's responsibility?",
      "What's the snagging window?",
    ],
  },
  location: {
    label: "Location",
    icon: MapPin,
    suggestions: [
      "Tell me about the community",
      "What schools are nearby?",
      "Is short-term rental allowed here?",
    ],
  },
};

export function ChatPanel({ propertyId, propertyIds, onCitation, defaultThread = "general", threads = ["general", "financial", "legal", "location"], isExpanded, onToggleExpanded }: ChatPanelProps) {
  const [active, setActive] = useState<ThreadKind>(defaultThread);

  return (
    <Tabs value={active} onValueChange={(v) => setActive(v as ThreadKind)} className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <TabsList className="grid flex-1" style={{ gridTemplateColumns: `repeat(${threads.length}, minmax(0, 1fr))` }}>
          {threads.map((t) => {
            const meta = threadMeta[t];
            const Icon = meta.icon;
            return (
              <TabsTrigger key={t} value={t} className="gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{meta.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        {onToggleExpanded && (
          <button
            type="button"
            onClick={onToggleExpanded}
            aria-label={isExpanded ? "Collapse chat" : "Expand chat"}
            title={isExpanded ? "Collapse chat" : "Expand chat"}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        )}
      </div>
      {threads.map((t) => (
        <TabsContent key={t} value={t} className="m-0 flex-1 min-h-0 data-[state=inactive]:hidden">
          <ChatThread
            thread={t}
            propertyId={propertyId}
            propertyIds={propertyIds}
            onCitation={onCitation}
            suggestions={threadMeta[t].suggestions}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
