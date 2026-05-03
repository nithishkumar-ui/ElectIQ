import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("US");
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return toast({ type: "error", message: "Passwords do not match" });
    
    setLoading(true);
    try {
      await register(email, password, name, country);
      toast({ type: "success", message: "Account created successfully!" });
    } catch (err: any) {
      toast({ type: "error", message: err });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full glass rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all placeholder:text-[#555]";

  return (
    <div className="relative min-h-screen bg-[#050505] pt-24 pb-12 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none z-0 bg-grid opacity-40" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent-purple/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-gold-400/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-strong rounded-2xl p-8 relative z-10 m-6">
        <div className="text-center mb-6">
          <Link to="/" className="font-display font-black text-3xl inline-block mb-2 uppercase tracking-tighter">
            <span className="text-white">Elect</span><span className="text-gradient">IQ</span>
          </Link>
          <h2 className="font-display text-2xl font-black uppercase tracking-tighter text-[#F5F5F5]">Create an Account</h2>
          <p className="text-[11px] uppercase tracking-widest text-[#666] mt-1">Join the civic community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-[#666] mb-2">Display Name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className={inputCls} placeholder="Your name" />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-[#666] mb-2">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-[#666] mb-2">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className={inputCls} placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-[#666] mb-2">Confirm Password</label>
            <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} className={inputCls} placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-[#666] mb-2">Country</label>
            <select value={country} onChange={e => setCountry(e.target.value)} className={inputCls}>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="India">India</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
          </div>

          <Button type="submit" variant="gradient" disabled={loading} className="w-full mt-4 rounded-lg">
            {loading ? "Creating..." : "Create Account"} <ArrowRight size={14} />
          </Button>
        </form>

        <p className="mt-6 text-center text-[11px] uppercase tracking-widest text-[#666]">
          Already have an account? <Link to="/login" className="text-gold-400 hover:text-gold-300 font-bold">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
