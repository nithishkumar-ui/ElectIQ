import { useAuthStore } from "../store/authStore";

// @ts-ignore
const BASE = import.meta.env.VITE_API_URL || "";

type SendMessageProps = {
  messages: any[];
  country?: string;
  phaseContext?: string | null;
  guideStepContext?: string | null;
  conversationId?: string | null;
  onToken?: (token: string) => void;
  onComplete?: () => void;
  onError?: (err: any) => void;
};

export async function sendMessage({
  messages,
  country = "US",
  phaseContext = null,
  guideStepContext = null,
  conversationId = null,
  onToken,
  onComplete,
  onError,
}: SendMessageProps) {
  const token = useAuthStore.getState().token;

  try {
    const res = await fetch(`${BASE}/api/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        messages,
        country,
        phase_context: phaseContext,
        guide_step_context: guideStepContext,
        conversation_id: conversationId,
      }),
    });

    if (!res.ok) throw new Error(`API error ${res.status}`);

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      for (const line of chunk.split("\n")) {
        if (!line.startsWith("data: ")) continue;
        const raw = line.slice(6).trim();
        if (raw === "[DONE]") { onComplete?.(); return; }
        try {
          const parsed = JSON.parse(raw);
          if (parsed.token) onToken?.(parsed.token);
          if (parsed.error) throw new Error(parsed.error);
        } catch {}
      }
    }
    onComplete?.();
  } catch (err: any) {
    onError?.(err);
  }
}
