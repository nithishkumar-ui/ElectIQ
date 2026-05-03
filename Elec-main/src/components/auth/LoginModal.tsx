import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAuthStore } from "../../store/authStore";
import { useToast } from "../../hooks/useToast";
import { Button } from "../ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";

export default function LoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoginModalOpen, closeLoginModal } = useAuthStore();

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast({ type: "success", message: "Successfully logged in!" });
      closeLoginModal();
    } catch (err: any) {
      toast({ type: "error", message: err });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full glass rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all placeholder:text-[#555]";

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
        onClick={closeLoginModal}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-md glass-strong rounded-2xl p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={closeLoginModal}
            className="absolute top-4 right-4 text-[#555] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
          
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl font-black uppercase tracking-tighter text-[#F5F5F5]">Welcome back</h2>
            <p className="text-[11px] uppercase tracking-widest text-[#666] mt-1">Sign in to sync your progress</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[#666] mb-2">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[#666] mb-2">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className={inputCls} placeholder="••••••••" />
            </div>

            <Button type="submit" variant="gradient" disabled={loading} className="w-full mt-2 rounded-lg">
              {loading ? "Signing in..." : "Sign In"} <ArrowRight size={14} />
            </Button>
          </form>

          <p className="mt-6 text-center text-[11px] uppercase tracking-widest text-[#666]">
            Don't have an account?{" "}
            <button 
              onClick={() => {
                closeLoginModal();
                navigate("/signup");
              }} 
              className="text-gold-400 hover:text-gold-300 font-bold"
            >
              Sign up
            </button>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
