import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ToastType = "success" | "error" | "info" | "neutral";
type ToastItem = { id: string; type: ToastType; message: string; duration?: number };

interface ToastContextValue {
  toast: (options: { type: ToastType; message: string; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback(({ type, message, duration = 4000 }: { type: ToastType; message: string; duration?: number }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`pointer-events-auto bg-navy-800 border-l-4 px-4 py-3 text-white text-sm rounded-xl flex justify-between items-center min-w-[250px] shadow-lg ${
                t.type === "success" ? "border-green-400" :
                t.type === "error" ? "border-red-400" :
                t.type === "info" ? "border-gold-400" : "border-white/20"
              }`}
            >
              <span>{t.message}</span>
              <button onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))} className="ml-4 text-white/50 hover:text-white">
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
