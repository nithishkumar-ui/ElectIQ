import { useState, useCallback, useRef } from "react";
import { sendMessage } from "../lib/geminiChat";

export function useChat(options: any = {}) {
  const { country = "US", phaseContext = null, guideStepContext = null, conversationId = null } = options;
  const [messages, setMessages] = useState<any[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamBuffer = useRef("");

  const send = useCallback(async (content: string) => {
    if (!content.trim() || isStreaming) return;

    const userMsg = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsStreaming(true);
    setError(null);
    streamBuffer.current = "";

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    await sendMessage({
      messages: newMessages,
      country,
      phaseContext,
      guideStepContext,
      conversationId,
      onToken: (token) => {
        streamBuffer.current += token;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: streamBuffer.current,
          };
          return updated;
        });
      },
      onComplete: () => setIsStreaming(false),
      onError: (err) => {
        setError(err?.message || "Something went wrong");
        setIsStreaming(false);
      },
    });
  }, [messages, isStreaming, country, phaseContext, guideStepContext, conversationId]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, setMessages, send, isStreaming, error, clearChat };
}
