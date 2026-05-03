import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast({ type: "success", message: "Successfully logged in!" });
    } catch (err: any) {
      toast({ type: "error", message: err });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full glass rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all placeholder:text-[#555]";

  return (
    <div className="relative min-h-screen bg-[#050505] pt-24 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none z-0 bg-grid opacity-40" />
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gold-400/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-purple/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-strong rounded-2xl p-10 relative z-10 m-6">
        <div className="text-center mb-8">
          <Link to="/" className="font-display font-black text-3xl inline-block mb-4 uppercase tracking-tighter">
            <span className="text-white">Elect</span><span className="text-gradient">IQ</span>
          </Link>
          <h2 className="font-display text-2xl font-black uppercase tracking-tighter text-[#F5F5F5]">Welcome back</h2>
          <p className="text-[11px] uppercase tracking-widest text-[#666] mt-1">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-[#666] mb-2">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[#666]">Password</label>
              <a href="#" className="text-[10px] text-gold-400 hover:text-gold-300 uppercase tracking-widest font-bold">Forgot?</a>
            </div>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className={inputCls} placeholder="••••••••" />
          </div>

          <Button type="submit" variant="gradient" disabled={loading} className="w-full mt-6 rounded-lg">
            {loading ? "Signing in..." : "Sign In"} <ArrowRight size={14} />
          </Button>
        </form>

        <div className="mt-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-white/5"></div>
          <span className="text-[9px] text-[#555] uppercase tracking-widest font-bold">or</span>
          <div className="flex-1 h-px bg-white/5"></div>
        </div>

        <p className="mt-6 text-center text-[11px] uppercase tracking-widest text-[#666]">
          Don't have an account? <Link to="/signup" className="text-gold-400 hover:text-gold-300 font-bold">Sign up</Link>
        </p>
        
        <div className="mt-4 text-center">
          <Link to="/" className="text-[10px] text-[#555] hover:text-white transition-colors uppercase tracking-widest font-bold">Continue as Guest →</Link>
        </div>
      </motion.div>
    </div>
  );
}
