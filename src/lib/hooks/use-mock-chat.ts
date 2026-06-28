"use client";

import { useCallback, useRef, useState } from "react";
import type { ChatMessage, ThreadKind } from "@/lib/types";
import { pickResponse, seedMessages } from "@/lib/mock/chat-responses";

interface UseMockChatOptions {
  thread: ThreadKind;
  propertyId?: string;
  propertyIds?: string[];
  seed?: boolean;
}

interface UseMockChatResult {
  messages: ChatMessage[];
  input: string;
  setInput: (v: string) => void;
  isStreaming: boolean;
  append: (content: string) => Promise<void>;
  stop: () => void;
  reset: () => void;
}

const STREAM_TOKEN_DELAY_MS = 18;

function tokenize(text: string): string[] {
  return text.match(/(\s+|\S+)/g) ?? [];
}

export function useMockChat(options: UseMockChatOptions): UseMockChatResult {
  const { thread, propertyId, propertyIds, seed = true } = options;
  const [messages, setMessages] = useState<ChatMessage[]>(seed ? seedMessages(thread) : []);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const cancelledRef = useRef(false);

  const append = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        content: trimmed,
        createdAt: Date.now(),
      };
      const assistantId = `a-${Date.now()}`;
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: Date.now() + 1,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);
      cancelledRef.current = false;

      const response = pickResponse(trimmed, { propertyId, propertyIds, thread });
      const tokens = tokenize(response.content);
      let accumulated = "";

      // Brief "thinking" pause for realism.
      await new Promise((r) => setTimeout(r, 320));

      for (const token of tokens) {
        if (cancelledRef.current) break;
        accumulated += token;
        const snapshot = accumulated;
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: snapshot } : m)),
        );
        await new Promise((r) => setTimeout(r, STREAM_TOKEN_DELAY_MS));
      }

      if (response.citations && !cancelledRef.current) {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, citations: response.citations } : m)),
        );
      }

      setIsStreaming(false);
    },
    [thread, propertyId, propertyIds],
  );

  const stop = useCallback(() => {
    cancelledRef.current = true;
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    cancelledRef.current = true;
    setMessages(seed ? seedMessages(thread) : []);
    setIsStreaming(false);
  }, [thread, seed]);

  return { messages, input, setInput, isStreaming, append, stop, reset };
}
