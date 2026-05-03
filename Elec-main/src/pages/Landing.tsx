import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import ParticleField from "../components/timeline/ParticleField";
import { useAuthStore } from "../store/authStore";
import { ArrowRight, Globe, CheckCircle, Brain, Sparkles } from "lucide-react";

const stats = [
  { value: "3+", label: "Countries", icon: Globe },
  { value: "6", label: "Step Guide", icon: CheckCircle },
  { value: "AI", label: "Powered", icon: Brain },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy-900 overflow-x-hidden text-slate-100">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <ParticleField dim={0.4} />

        {/* Animated gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-purple/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: "-3s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent-cyan/3 rounded-full blur-[80px] animate-float" style={{ animationDelay: "-1.5s" }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-[11px] font-bold uppercase tracking-widest text-[#888]"
          >
            <Sparkles size={14} className="text-gold-400" />
            AI-Powered Civic Education
          </motion.div>

          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter italic text-[#F5F5F5] leading-[0.85] mb-6">
            {["Understand", "Every Vote.", "Every Step."].map((line, i) => (
              <motion.span
                key={i}
                className={`block ${i === 1 ? "text-gradient" : ""}`}
                initial={{ opacity: 0, y: 40, skewY: 4 }}
                animate={{ opacity: 1, y: 0, skewY: 0 }}
                transition={{ delay: 0.15 + i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="font-body text-lg leading-relaxed text-[#888] font-medium max-w-2xl mx-auto mb-10"
          >
            Your AI-powered civic education assistant for exploring global election timelines, checking voter eligibility, and testing your political knowledge.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              variant="gradient"
              className="rounded-lg uppercase tracking-widest text-[11px] font-black"
              onClick={() => navigate("/explore")}
            >
              Explore the Timeline
              <ArrowRight size={16} />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-lg uppercase tracking-widest text-[11px] font-black"
              onClick={() => navigate("/chat")}
            >
              Ask the Assistant
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="relative z-20 max-w-4xl mx-auto px-6 -mt-12 mb-12">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass rounded-xl p-5 text-center hover-lift cursor-default"
            >
              <s.icon size={18} className="mx-auto mb-2 text-gold-400" />
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-[#666] font-bold">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="relative z-20 max-w-6xl mx-auto px-6 mb-32">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-3">Core Features</h2>
          <p className="text-[#666] text-sm max-w-lg mx-auto">Everything you need to become a more informed and empowered citizen.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            title="Interactive Process"
            desc="Visualize the entire electoral journey from voter registration to inauguration."
            link="/process"
            icon="🏛️"
            index={0}
          />
          <FeatureCard
            title="Voting Guide"
            desc="A step-by-step checklist to ensure you're registered and ready to vote."
            link="/guide"
            icon="📋"
            index={1}
          />
          <FeatureCard
            title="Civic Quizzes"
            desc="Test your knowledge on voting rights, electoral systems, and history."
            link="/quiz"
            icon="🧠"
            index={2}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-navy-900">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <div>
              <p className="font-display text-2xl font-black text-white mb-2">
                ELECT<span className="text-gradient-gold">IQ</span>
              </p>
              <p className="text-sm text-[#666] max-w-xs">An AI-powered civic education assistant. Strictly non-partisan.</p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#444] mb-4">Explore</h4>
              <div className="space-y-2">
                {[{ l: "Election Timeline", p: "/explore" }, { l: "Voting Guide", p: "/guide" }, { l: "Quizzes", p: "/quiz" }, { l: "Process", p: "/process" }].map(x => (
                  <a key={x.p} href={x.p} className="block text-sm text-[#666] hover:text-white transition-colors">{x.l}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#444] mb-4">Resources</h4>
              <div className="space-y-2">
                {["Ask AI Assistant", "Dashboard", "About ElectIQ"].map(x => (
                  <a key={x} href="#" className="block text-sm text-[#666] hover:text-white transition-colors">{x}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#444]">© {new Date().getFullYear()} ElectIQ. Built with Gemini AI.</p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-[#444] hover:text-white transition-colors cursor-pointer">Privacy</span>
              <span className="text-xs text-[#444] hover:text-white transition-colors cursor-pointer">Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, link, icon, index }: { title: string; desc: string; link: string; icon: string; index: number }) {
  const navigate = useNavigate();
  const { isAuthenticated, openLoginModal } = useAuthStore();

  const handleClick = () => {
    if (!isAuthenticated) {
      openLoginModal();
    } else {
      navigate(link);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleClick}
      className="glass rounded-xl p-8 hover:border-gold-400/30 transition-all duration-300 cursor-pointer flex flex-col justify-between group hover-lift card-glow"
    >
      <div>
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold-400/10 to-accent-purple/10 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="font-display text-xl font-black uppercase tracking-tight text-[#F5F5F5] mb-2 group-hover:text-gradient-gold transition-all">{title}</h3>
        <p className="text-sm text-[#666] leading-relaxed">{desc}</p>
      </div>
      <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#444] group-hover:text-gold-400 transition-colors">
        Learn More
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
}
