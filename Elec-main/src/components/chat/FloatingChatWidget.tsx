import { useLocation } from "react-router-dom";
import { useChatStore } from "../../store/chatStore";
import { useAuthStore } from "../../store/authStore";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useChat } from "../../hooks/useChat";
import { cn } from "../ui/Button";

function MessageBubble({ role, content, isStreaming }: any) {
  const isUser = role === "user";
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
      className={cn("flex", isUser ? "justify-end" : "justify-start gap-2.5 w-full")}
    >
      {!isUser && (
         <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-gold-400 to-accent-purple flex items-center justify-center mt-0.5">
           <Sparkles size={12} className="text-white" />
         </div>
      )}
      <div className="max-w-[80%] flex flex-col">
        <div className={cn("px-3.5 py-2.5 text-[13px] leading-relaxed", isUser ? "bg-gradient-to-r from-gold-400 to-gold-300 text-navy-900 rounded-2xl rounded-tr-sm font-medium" : "glass rounded-2xl rounded-tl-sm text-white/90")}>
          {content}
          {!isUser && isStreaming && <span className="animate-blink ml-1 text-gold-400">▋</span>}
        </div>
        {!isUser && <p className="text-[9px] text-[#555] mt-1 ml-1 uppercase tracking-widest font-bold">Gemini</p>}
      </div>
    </motion.div>
  );
}

export default function FloatingChatWidget() {
  const location = useLocation();
  const { isWidgetOpen, widgetPrefill, closeWidget, toggleWidget } = useChatStore();
  const [input, setInput] = useState("");
  const { messages, send, isStreaming } = useChat({ phaseContext: widgetPrefill });
  const bottomRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, openLoginModal } = useAuthStore();

  useEffect(() => {
    if (isWidgetOpen && widgetPrefill && messages.length === 0) {
      send(widgetPrefill);
    }
  }, [isWidgetOpen, widgetPrefill]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleToggle = () => {
    if (!isAuthenticated && !isWidgetOpen) {
      openLoginModal();
    }
    toggleWidget();
  };

  if (location.pathname === "/chat") return null;

  return (
    <>
      <motion.button 
        onClick={handleToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-xl bg-gradient-to-br from-gold-400 to-accent-purple shadow-lg shadow-gold-400/20 flex items-center justify-center transition-colors"
      >
        <MessageSquare className="text-white w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isWidgetOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-[60] w-80 md:w-96 h-[500px] glass-strong rounded-2xl flex flex-col overflow-hidden"
          >
            <div className="px-4 py-3 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold-400 to-accent-purple flex items-center justify-center">
                  <Sparkles size={12} className="text-white" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-white uppercase tracking-widest block">ElectIQ</span>
                  <span className="text-[9px] text-[#666] uppercase tracking-widest font-bold">AI Assistant</span>
                </div>
              </div>
              <button onClick={closeWidget} className="text-[#555] hover:text-white transition-colors"><X size={16} /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.length === 0 && (
                 <div className="text-center mt-8">
                   <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400/10 to-accent-purple/10 border border-white/5 flex items-center justify-center mx-auto mb-3">
                     <Sparkles size={20} className="text-gold-400" />
                   </div>
                   <p className="text-[11px] text-[#666] uppercase tracking-widest font-bold">Ask me anything about elections!</p>
                 </div>
              )}
              {messages.map((m, i) => (
                <MessageBubble key={i} role={m.role} content={m.content} isStreaming={isStreaming && i === messages.length - 1} />
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="px-3 py-3 border-t border-white/5 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && input.trim()) { send(input); setInput(""); } }}
                placeholder="Message Gemini..."
                className="flex-1 glass text-[13px] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all placeholder:text-[#555]"
                disabled={isStreaming}
              />
              <button onClick={() => { if (input.trim()) { send(input); setInput(""); } }} disabled={!input.trim() || isStreaming} 
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-accent-purple text-white flex items-center justify-center disabled:opacity-30 transition-opacity">
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
