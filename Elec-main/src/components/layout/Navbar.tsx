import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/Button";
import { User, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { user, isAuthenticated, openLoginModal } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Explore", path: "/explore" },
    { name: "Guide", path: "/guide" },
    { name: "Quizzes", path: "/quiz" },
    { name: "Process", path: "/process" },
  ];

  return (
    <nav className={`fixed top-0 z-[60] w-full h-16 transition-all duration-500 ${scrolled ? "glass-strong shadow-lg shadow-black/20" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-accent-purple flex items-center justify-center text-white font-black text-sm transition-transform duration-300 group-hover:scale-110 group-hover:shadow-glow">
            E
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#666] font-bold leading-tight">Powered by Gemini</span>
            <span className="font-display font-black tracking-tighter text-xl text-[#F5F5F5] leading-tight">ELECT<span className="text-gradient-gold">IQ</span></span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-1 items-center">
          {links.map(l => (
            <Link
              key={l.path}
              to={l.path}
              className="relative px-4 py-2 text-[11px] uppercase tracking-widest font-bold transition-colors rounded-lg hover:bg-white/5"
            >
              <span className={`${location.pathname.startsWith(l.path) ? "text-white" : "text-[#666] hover:text-white"}`}>
                {l.name}
              </span>
              {location.pathname.startsWith(l.path) && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-gold-400 to-accent-purple rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-all group">
              <span className="text-[11px] uppercase tracking-widest text-[#888] font-bold group-hover:text-white transition-colors">{user?.display_name}</span>
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400/20 to-accent-purple/20 border border-white/10 flex items-center justify-center text-white text-xs font-bold uppercase group-hover:border-gold-400/30 transition-colors">
                {user?.display_name?.substring(0, 2) || "U"}
              </div>
            </Link>
          ) : (
            <button
              onClick={openLoginModal}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-[11px] uppercase tracking-widest font-bold text-[#888] hover:text-white hover:border-gold-400/30 hover:bg-white/5 transition-all"
            >
              <User size={16} />
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white flex items-center gap-4" onClick={() => setMobileMenu(true)}>
          {!isAuthenticated && <User size={22} onClick={(e) => { e.stopPropagation(); openLoginModal(); }} className="hover:text-gold-400 transition-colors" />}
          <Menu size={22} />
        </button>
      </div>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] bg-navy-900/98 backdrop-blur-xl flex flex-col pt-20 px-8">
            <button className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors" onClick={() => setMobileMenu(false)}>
               <X size={24} />
            </button>
            <div className="space-y-2">
              {links.map((l, i) => (
                <motion.div
                  key={l.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                >
                  <Link
                    to={l.path}
                    onClick={() => setMobileMenu(false)}
                    className={`block font-display text-4xl font-black uppercase tracking-tighter py-3 transition-colors ${location.pathname.startsWith(l.path) ? "text-gold-400" : "text-white/60 hover:text-white"}`}
                  >
                    {l.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: links.length * 0.08, duration: 0.3 }}
              >
                {isAuthenticated ? (
                  <Link to="/dashboard" onClick={() => setMobileMenu(false)} className="block font-display text-4xl font-black uppercase tracking-tighter py-3 text-gold-400">Dashboard</Link>
                ) : (
                  <button
                    onClick={() => { setMobileMenu(false); openLoginModal(); }}
                    className="block font-display text-4xl font-black uppercase tracking-tighter py-3 text-gold-400 text-left"
                  >
                    Sign In
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
