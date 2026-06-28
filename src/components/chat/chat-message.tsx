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

type Block =
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "numbered"; items: string[] };

function parseBlocks(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];
  let currentList: { type: "bullets" | "numbered"; items: string[] } | null = null;
  let currentPara: string[] = [];

  function flushPara() {
    if (currentPara.length > 0) {
      blocks.push({ type: "paragraph", text: currentPara.join(" ") });
      currentPara = [];
    }
  }
  function flushList() {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  }

  for (const line of lines) {
    if (line.trim() === "") {
      flushPara();
      flushList();
      continue;
    }
    const bulletMatch = line.match(/^[-*]\s+(.*)/);
    const numMatch = line.match(/^\d+\.\s+(.*)/);
    if (bulletMatch) {
      flushPara();
      if (currentList?.type !== "bullets") {
        flushList();
        currentList = { type: "bullets", items: [] };
      }
      currentList.items.push(bulletMatch[1]);
    } else if (numMatch) {
      flushPara();
      if (currentList?.type !== "numbered") {
        flushList();
        currentList = { type: "numbered", items: [] };
      }
      currentList.items.push(numMatch[1]);
    } else {
      flushList();
      currentPara.push(line);
    }
  }
  flushPara();
  flushList();
  return blocks;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderInline(text: string, keyPrefix: string): React.ReactNode {
  if (!text) return null;
  const terms = glossary.map((g) => g.term).sort((a, b) => b.length - a.length);
  const termPattern = terms.length > 0
    ? new RegExp(`\\b(${terms.map(escapeRegex).join("|")})\\b`, "gi")
    : null;

  // First split by bold spans, then within each non-bold segment, match glossary terms.
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
  const out: React.ReactNode[] = [];
  let idx = 0;

  for (const part of boldParts) {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      out.push(<strong key={`${keyPrefix}-b-${idx++}`}>{part.slice(2, -2)}</strong>);
      continue;
    }
    if (!termPattern) {
      out.push(<span key={`${keyPrefix}-s-${idx++}`}>{part}</span>);
      continue;
    }
    let last = 0;
    let m: RegExpExecArray | null;
    termPattern.lastIndex = 0;
    while ((m = termPattern.exec(part)) !== null) {
      if (m.index > last) {
        out.push(
          <span key={`${keyPrefix}-t-${idx++}`}>{part.slice(last, m.index)}</span>,
        );
      }
      const matched = m[0];
      out.push(
        <ConceptPopover key={`${keyPrefix}-g-${idx++}`} term={matched}>
          <span className="cursor-help underline decoration-dotted decoration-muted-foreground/60 underline-offset-2">
            {matched}
          </span>
        </ConceptPopover>,
      );
      last = m.index + matched.length;
    }
    if (last < part.length) {
      out.push(<span key={`${keyPrefix}-r-${idx++}`}>{part.slice(last)}</span>);
    }
  }
  return out;
}

function renderBlocks(content: string): React.ReactNode {
  const blocks = parseBlocks(content);
  return blocks.map((block, i) => {
    if (block.type === "bullets") {
      return (
        <ul key={`ul-${i}`} className="list-disc space-y-1 pl-5 marker:text-muted-foreground/60">
          {block.items.map((item, j) => (
            <li key={`li-${i}-${j}`}>{renderInline(item, `${i}-${j}`)}</li>
          ))}
        </ul>
      );
    }
    if (block.type === "numbered") {
      return (
        <ol key={`ol-${i}`} className="list-decimal space-y-1 pl-5 marker:text-muted-foreground/60">
          {block.items.map((item, j) => (
            <li key={`li-${i}-${j}`}>{renderInline(item, `${i}-${j}`)}</li>
          ))}
        </ol>
      );
    }
    return <p key={`p-${i}`}>{renderInline(block.text, `${i}`)}</p>;
  });
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
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground"
              : "space-y-2.5 bg-card text-foreground border",
          )}
        >
          {message.content === "" ? (
            <span className="inline-flex gap-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:120ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:240ms]" />
            </span>
          ) : isUser ? (
            <span className="whitespace-pre-wrap">{message.content}</span>
          ) : (
            renderBlocks(message.content)
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
