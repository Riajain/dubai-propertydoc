"use client";

import { useEffect, useRef } from "react";
import { Send, Square } from "lucide-react";
import type { Citation, ThreadKind } from "@/lib/types";
import { useMockChat } from "@/lib/hooks/use-mock-chat";
import { ChatMessage } from "@/components/chat/chat-message";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatThreadProps {
  thread: ThreadKind;
  propertyId?: string;
  propertyIds?: string[];
  onCitation: (c: Citation) => void;
  suggestions?: string[];
}

export function ChatThread({ thread, propertyId, propertyIds, onCitation, suggestions }: ChatThreadProps) {
  const { messages, input, setInput, isStreaming, append, stop } = useMockChat({
    thread,
    propertyId,
    propertyIds,
  });
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isStreaming) return;
    append(input);
    setInput("");
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-4 p-4">
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} onCitation={onCitation} />
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {suggestions && suggestions.length > 0 && messages.filter((m) => m.role === "user").length === 0 && (
        <div className="border-t bg-muted/30 px-4 py-3">
          <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Try asking
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => append(s)}
                disabled={isStreaming}
                className="rounded-full border bg-background px-3 py-1 text-xs text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t bg-background p-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          rows={1}
          placeholder="Ask anything about this document…"
          className="min-h-[40px] max-h-32 flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm leading-relaxed shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        {isStreaming ? (
          <Button type="button" size="icon" variant="outline" onClick={stop} aria-label="Stop streaming">
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" size="icon" disabled={!input.trim()} aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
        )}
      </form>
    </div>
  );
}
