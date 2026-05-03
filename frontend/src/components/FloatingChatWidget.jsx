import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

export default function FloatingChatWidget() {
  const { messages, isTyping, isOpen, toggleChat, sendMessage } = useChatStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    
    sendMessage(input);
    setInput('');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 z-50 ${
          isOpen ? 'bg-red-500 hover:bg-red-600 rotate-90' : 'bg-primary-600 hover:bg-primary-500 hover:scale-110'
        }`}
      >
        {isOpen ? <X className="text-white w-6 h-6" /> : <MessageSquare className="text-white w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] glass-panel rounded-2xl flex flex-col overflow-hidden z-40 shadow-2xl border border-white/20 animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 text-white">
            <h3 className="font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              ElectIQ Assistant
            </h3>
            <p className="text-xs text-primary-100 mt-1">Ask me anything about elections!</p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-900/50">
            {messages.length === 0 && (
              <div className="text-center text-slate-400 mt-10 text-sm">
                👋 Hi! I can explain election processes, voting systems, and democratic principles. Try asking "How does the US Electoral College work?"
              </div>
            )}
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.role === 'user' 
                    ? 'bg-primary-600 text-white rounded-tr-sm' 
                    : 'bg-dark-800 text-slate-200 border border-slate-700 rounded-tl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-dark-800 border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 bg-dark-800 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 bg-dark-900 border border-slate-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary-500 text-slate-200"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2 bg-primary-600 hover:bg-primary-500 text-white rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-primary-600"
            >
              {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
