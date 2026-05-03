import { create } from "zustand";

interface ChatState {
  conversations: any[];
  activeConversationId: string | null;
  isWidgetOpen: boolean;
  widgetPrefill: string | null;
  setConversations: (conversations: any[]) => void;
  setActiveConversation: (id: string | null) => void;
  openWidget: (prefill?: string | null) => void;
  closeWidget: () => void;
  toggleWidget: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  isWidgetOpen: false,
  widgetPrefill: null,

  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (id) => set({ activeConversationId: id }),
  openWidget: (prefill = null) => set({ isWidgetOpen: true, widgetPrefill: prefill }),
  closeWidget: () => set({ isWidgetOpen: false, widgetPrefill: null }),
  toggleWidget: () => set((s) => ({ isWidgetOpen: !s.isWidgetOpen })),
}));
