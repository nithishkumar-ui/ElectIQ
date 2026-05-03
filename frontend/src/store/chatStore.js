import { create } from 'zustand';
import api from '../lib/api';

export const useChatStore = create((set, get) => ({
  messages: [],
  sessionId: null,
  isTyping: false,
  isOpen: false,
  
  toggleChat: () => set(state => ({ isOpen: !state.isOpen })),
  
  addMessage: (message) => set(state => ({ 
    messages: [...state.messages, message] 
  })),
  
  sendMessage: async (text, context = null) => {
    const { sessionId } = get();
    
    // Add user message optimistically
    const userMessage = { id: Date.now(), role: 'user', content: text };
    get().addMessage(userMessage);
    
    set({ isTyping: true });
    
    try {
      const response = await api.post('/chat/', {
        message: text,
        context: context,
        session_id: sessionId
      });
      
      const botMessage = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: response.data.response 
      };
      
      set({ 
        messages: [...get().messages, botMessage],
        sessionId: response.data.session_id,
        isTyping: false
      });
    } catch (error) {
      set({ isTyping: false });
      const errorMessage = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: "Sorry, I'm having trouble connecting to the server. Please try again." 
      };
      get().addMessage(errorMessage);
    }
  },
  
  clearChat: () => set({ messages: [], sessionId: null })
}));
