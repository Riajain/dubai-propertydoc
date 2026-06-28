"use client";

import { Sparkles, User } from "lucide-react";
import type { ChatMessage as ChatMessageType, Citation } from "@/lib/types";
import { CitationChip } from "@/components/chat/citation-chip";
import { ConceptPopover } from "@/components/panels/concept-popover";
import { glossary } from "@/lib/mock/glossary";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
  onCitation: (c: Citation) => void;
}

function renderInlineContent(content: string): React.ReactNode {
  if (!content) return null;
  const terms = glossary.map((g) => g.term).sort((a, b) => b.length - a.length);
  if (terms.length === 0) return content;
  const pattern = new RegExp(`\\b(${terms.map(escapeRegex).join("|")})\\b`, "gi");
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = pattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(renderMarkdownish(content.slice(lastIndex, match.index), key++));
    }
    const matched = match[0];
    parts.push(
      <ConceptPopover key={`t-${key++}`} term={matched}>
        <span className="cursor-help underline decoration-dotted decoration-muted-foreground/60 underline-offset-2">
          {matched}
        </span>
      </ConceptPopover>,
    );
    lastIndex = match.index + matched.length;
  }
  if (lastIndex < content.length) {
    parts.push(renderMarkdownish(content.slice(lastIndex), key++));
  }
  return parts;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderMarkdownish(text: string, key: number): React.ReactNode {
  // Minimal: **bold** + preserve newlines. No headings/lists rendered structurally — they appear as plain lines.
  const segments: React.ReactNode[] = [];
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  parts.forEach((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      segments.push(<strong key={`b-${key}-${i}`}>{part.slice(2, -2)}</strong>);
    } else {
      segments.push(<span key={`s-${key}-${i}`}>{part}</span>);
    }
  });
  return <span key={`m-${key}`}>{segments}</span>;
}

export function ChatMessage({ message, onCitation }: ChatMessageProps) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground",
        )}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
      </div>
      <div className={cn("max-w-[85%] space-y-2", isUser && "items-end")}>
        <div
          className={cn(
            "whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-card text-foreground border",
          )}
        >
          {message.content === "" ? (
            <span className="inline-flex gap-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:120ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:240ms]" />
            </span>
          ) : (
            renderInlineContent(message.content)
          )}
        </div>
        {message.citations && message.citations.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {message.citations.map((c, i) => (
              <CitationChip key={i} citation={c} onSelect={onCitation} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
