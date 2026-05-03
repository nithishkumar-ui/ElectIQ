import { useEffect, useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import { api } from "../lib/api";
import { useChat } from "../hooks/useChat";
import { MessageSquarePlus, Trash2, Send, Bot, User } from "lucide-react";
import { Button } from "../components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

function ChatMessageBubble({ role, content, isStreaming, index }: any) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
      className={`flex w-full mb-6 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-accent-purple flex items-center justify-center text-white text-xs font-black mr-3 mt-1 shrink-0">
          <Bot size={16} />
        </div>
      )}
      <div className={`px-5 py-4 max-w-[85%] text-sm font-medium leading-relaxed rounded-xl ${isUser ? "glass-strong text-white" : "bg-[#111] border border-white/5 text-[#ccc]"}`}>
        {content}
        {isStreaming && !isUser && <span className="animate-blink ml-1 text-[#4E88FF] font-black">▋</span>}
      </div>
      {isUser && (
        <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white text-xs font-black ml-3 mt-1 shrink-0">
          <User size={16} />
        </div>
      )}
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-accent-purple flex items-center justify-center text-white text-xs font-black shrink-0">
        <Bot size={16} />
      </div>
      <div className="bg-[#111] border border-white/5 rounded-xl px-5 py-4 flex gap-1.5">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-gold-400/60"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Chat() {
  const { user, isAuthenticated, logout } = useAuth();
  const { conversations, activeConversationId, setConversations, setActiveConversation } = useChatStore();
  const { messages, setMessages, send, isStreaming, clearChat } = useChat({ conversationId: activeConversationId });
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      api.chat.getConversations().then(setConversations).catch(console.error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeConversationId) {
      api.chat.getConversations().then(data => {
        setConversations(data);
        const conv = data.find(c => c.id === activeConversationId);
        if (conv) {
          setMessages(conv.messages || []);
        }
      }).catch(console.error);
    } else {
      clearChat();
    }
  }, [activeConversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleNewChat = async () => {
    if (!isAuthenticated) return clearChat();
    try {
      const newConv = await api.chat.createConversation();
      setConversations([newConv, ...conversations]);
      setActiveConversation(newConv.id);
      clearChat();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api.chat.deleteConversation(id);
      setConversations(conversations.filter(c => c.id !== id));
      if (activeConversationId === id) {
        setActiveConversation(null);
        clearChat();
      }
    } catch(err) { console.error(err); }
  }

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    send(input);
    setInput("");
  };

  return (
    <div className="flex h-screen pt-16 bg-[#050505] overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 glass-strong border-r border-white/5 flex flex-col shrink-0">
        <div className="p-5 border-b border-white/5">
          <Button className="w-full justify-center gap-2 h-11 text-[10px] uppercase tracking-widest font-black rounded-lg border border-white/10 bg-transparent text-[#F5F5F5] hover:border-gold-400/30 hover:bg-white/5" onClick={handleNewChat}>
            <MessageSquarePlus size={16} /> New Thread
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
          {!isAuthenticated && (
            <button
              onClick={(e) => { e.stopPropagation(); useAuthStore.getState().openLoginModal(); }}
              className="w-full p-4 text-[9px] uppercase tracking-widest font-bold text-[#666] text-center glass rounded-lg hover:text-white transition-colors"
            >
              Sign in to save
            </button>
          )}
          {conversations.map(c => (
            <div
              key={c.id}
              onClick={() => setActiveConversation(c.id)}
              className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${activeConversationId === c.id ? "bg-gold-400/10 border border-gold-400/20 text-white" : "border border-transparent text-[#888] hover:bg-white/5 hover:text-[#F5F5F5]"}`}
            >
              <span className="text-[11px] font-bold tracking-wider uppercase truncate pr-2">{c.title}</span>
              <button onClick={(e) => handleDelete(e, c.id)} className="text-[#666] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {isAuthenticated && (
          <div className="p-5 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-3 truncate">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400/20 to-accent-purple/20 border border-white/10 flex items-center justify-center text-white text-[10px] font-black shrink-0">{user.display_name.substring(0,2)}</div>
                <div className="truncate">
                  <p className="text-[11px] font-black uppercase tracking-widest text-white truncate">{user.display_name}</p>
                  <p className="text-[9px] font-bold tracking-widest text-[#666] truncate">{user.email}</p>
                </div>
             </div>
             <button onClick={logout} className="text-[9px] font-black tracking-widest uppercase text-red-500/70 hover:text-red-400 shrink-0 ml-2">Out</button>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-20 lg:px-40 xl:px-60">
           {messages.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400/10 to-accent-purple/10 border border-white/10 flex items-center justify-center mb-8">
                  <Bot size={28} className="text-gold-400" />
                </div>
                <h2 className="font-display text-4xl font-black uppercase tracking-tighter text-white mb-4">Awaiting Input</h2>
                <p className="text-[#666] font-medium mb-12 max-w-md">Query the system regarding electoral processes, voting requirements, or political structures.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                  {["How does the Electoral College work?", "What documents do I need to register?", "Explain ranked-choice voting", "When are the next local elections?"].map((q, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      onClick={() => send(q)}
                      className="p-5 glass rounded-xl text-[11px] uppercase tracking-widest font-bold text-[#888] text-left hover:text-white hover:border-gold-400/30 transition-all card-glow"
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
             </div>
           ) : (
             <div className="max-w-3xl mx-auto pb-10">
                {messages.map((m, i) => (
                  <ChatMessageBubble key={i} role={m.role} content={m.content} isStreaming={isStreaming && i === messages.length - 1} index={i} />
                ))}
                {isStreaming && messages[messages.length - 1]?.role === "user" && <TypingIndicator />}
                <div ref={bottomRef} />
             </div>
           )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:px-20 lg:px-40 xl:px-60 bg-[#050505]/80 backdrop-blur-xl border-t border-white/5">
          <div className="max-w-3xl mx-auto relative">
            <div className="relative flex items-end">
              <textarea
                 value={input}
                 onChange={e => setInput(e.target.value)}
                 onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                 placeholder="Ask about electoral processes..."
                 rows={1}
                 className="w-full glass rounded-xl pl-5 pr-14 py-4 text-sm font-medium text-[#FFF] placeholder-[#444] focus:outline-none focus:ring-1 focus:ring-gold-400/30 resize-none min-h-[52px] max-h-40 overflow-y-auto transition-all"
                 disabled={isStreaming}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className="absolute right-2 bottom-2 h-9 w-9 rounded-lg bg-gradient-to-r from-gold-400 to-accent-purple text-white flex items-center justify-center disabled:opacity-30 hover:shadow-glow transition-all"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-center mt-3 text-[9px] text-[#444] tracking-wide">Responses may be imprecise. Always verify important information.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
