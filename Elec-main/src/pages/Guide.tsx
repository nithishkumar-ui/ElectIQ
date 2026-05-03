import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";
import { useToast } from "../hooks/useToast";
import { GUIDE_STEPS } from "../data/guideSteps";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";
import { CheckCircle, MessageSquare, AlertTriangle, ArrowRight } from "lucide-react";

export default function Guide() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { openWidget } = useChatStore();
  const [progress, setProgress] = useState<any[]>([]);
  const [activeStep, setActiveStep] = useState(1);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      api.users.getGuideProgress().then(setProgress).catch(console.error);
    } else {
      const stored = localStorage.getItem("electiq-guest-progress");
      if (stored) setProgress(JSON.parse(stored));
    }
  }, [isAuthenticated]);

  const updateProgress = async (stepId: number, completed: boolean, checklistIndex: number, checked: boolean) => {
    const existing = progress.find(p => p.step_id === stepId) || { step_id: stepId, completed: false, checklist_state: {} };
    const newChecklist = { ...existing.checklist_state, [checklistIndex]: checked };
    const allChecked = GUIDE_STEPS.find(s => s.id === stepId)?.checklist.every((_, i) => newChecklist[i]) || false;
    const isCompleted = completed || allChecked;
    const newProgress = progress.filter(p => p.step_id !== stepId).concat([{ ...existing, completed: isCompleted, checklist_state: newChecklist }]);
    setProgress(newProgress);
    if (isAuthenticated) {
      try {
        await api.users.updateGuideProgress(stepId, isCompleted, newChecklist);
        if (isCompleted && !existing.completed) toast({ type: "success", message: "Step completed!" });
      } catch { toast({ type: "error", message: "Failed to save progress" }); }
    } else {
      localStorage.setItem("electiq-guest-progress", JSON.stringify(newProgress));
      if (isCompleted && !existing.completed) toast({ type: "success", message: "Step completed (Guest Mode)" });
    }
  };

  const completedCount = progress.filter(p => p.completed).length;
  const pct = Math.round((completedCount / 6) * 100);

  return (
    <div className="min-h-screen bg-[#050505] flex pt-16">
      {/* Sidebar */}
      <div className="hidden md:flex w-72 flex-col glass-strong border-r border-white/5 p-8 fixed h-[calc(100vh-4rem)] overflow-y-auto">
        <h2 className="font-display text-xl font-black uppercase tracking-tighter text-[#F5F5F5] mb-2">Your Journey</h2>
        <p className="text-[10px] uppercase font-bold tracking-widest text-[#666] mb-4">{completedCount} of 6 complete</p>

        {/* Progress Ring */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
            <motion.circle cx="40" cy="40" r="34" fill="none" stroke="url(#progress-grad)" strokeWidth="5" strokeLinecap="round"
              strokeDasharray={213.6} animate={{ strokeDashoffset: 213.6 - (213.6 * pct) / 100 }} transition={{ duration: 0.8 }} />
            <defs><linearGradient id="progress-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4E88FF" /><stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient></defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-black text-white">{pct}%</span>
          </div>
        </div>

        <div className="relative pl-4 border-l border-white/10 space-y-6">
          {GUIDE_STEPS.map((step) => {
            const isComplete = progress.find(p => p.step_id === step.id)?.completed;
            const isActive = activeStep === step.id;
            return (
              <div key={step.id} className="relative cursor-pointer group" onClick={() => { setActiveStep(step.id); stepRefs.current[step.id]?.scrollIntoView({ behavior: "smooth" }); }}>
                <div className={`absolute -left-[21px] w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  isComplete ? "bg-gradient-to-br from-gold-400 to-accent-purple" : isActive ? "bg-gold-400 shadow-glow" : "bg-[#050505] border border-white/10 group-hover:border-white/30"
                }`}>
                  {isComplete && <CheckCircle size={12} className="text-white" />}
                </div>
                <div className={`text-[10px] uppercase tracking-widest font-bold transition-colors pl-3 ${isActive ? "text-gold-400" : isComplete ? "text-[#F5F5F5]" : "text-[#555] group-hover:text-white"}`}>
                  {step.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-72 overflow-y-auto px-6 md:px-20 py-16 pb-32">
        <div className="max-w-3xl space-y-32">
          {GUIDE_STEPS.map((step) => {
            const stepProgress = progress.find(p => p.step_id === step.id) || { completed: false, checklist_state: {} };
            return (
              <motion.section key={step.id} ref={el => { if (el) stepRefs.current[step.id] = el; }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
                onViewportEnter={() => setActiveStep(step.id)} className="relative">
                <div className="absolute -top-12 -left-6 md:-left-12 text-[140px] font-black text-white/[0.03] select-none pointer-events-none font-display leading-none z-0">{step.id}</div>
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[10px] text-gold-400 font-bold uppercase tracking-widest mb-4">Step {step.id}</span>
                  <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#F5F5F5] leading-[0.9] mb-6">{step.title}</h2>
                  <p className="text-xl text-[#888] font-medium leading-snug mb-4">{step.summary}</p>
                  <p className="text-[#666] font-medium leading-relaxed mb-8">{step.body}</p>

                  <div className="glass rounded-xl p-8 mb-8">
                    <span className="text-[10px] text-gold-400 font-bold uppercase tracking-widest mb-6 block">Checklist</span>
                    <div className="space-y-4">
                      {step.checklist.map((item, i) => (
                        <label key={i} className="flex items-start gap-4 cursor-pointer group">
                          <div className="relative mt-0.5">
                            <input type="checkbox" checked={!!stepProgress.checklist_state[i]} onChange={e => updateProgress(step.id, false, i, e.target.checked)}
                              className="sr-only peer" />
                            <div className="w-5 h-5 rounded-md border border-white/15 bg-white/5 peer-checked:bg-gradient-to-br peer-checked:from-gold-400 peer-checked:to-accent-purple peer-checked:border-transparent flex items-center justify-center transition-all">
                              {stepProgress.checklist_state[i] && <CheckCircle size={12} className="text-white" />}
                            </div>
                          </div>
                          <span className={`text-sm font-bold tracking-wide transition-colors ${stepProgress.checklist_state[i] ? "text-[#555] line-through" : "text-[#F5F5F5] group-hover:text-white"}`}>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {step.id === 1 && (
                    <div className="glass rounded-xl border-accent-amber/20 bg-accent-amber/5 p-6 mb-8 flex flex-col md:flex-row gap-6 items-center">
                      <AlertTriangle size={20} className="text-accent-amber shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-accent-amber font-bold mb-1 uppercase tracking-wide text-xs">Local Requirements</h4>
                        <p className="text-sm font-medium text-[#ccc]">Voting eligibility has specific local requirements. Click to verify rules for your municipality.</p>
                      </div>
                      <Button className="whitespace-nowrap bg-accent-amber hover:bg-accent-amber/80 text-black border-none rounded-lg" onClick={() => openWidget(`Can you help me verify specific local requirements and disqualification rules for voting in my location?`)}>
                        Verify Rules
                      </Button>
                    </div>
                  )}

                  <div className="glass rounded-xl border-gold-400/10 p-6 mb-8 flex flex-col md:flex-row gap-6 items-center">
                    <MessageSquare size={20} className="text-gold-400 shrink-0" />
                    <p className="flex-1 text-sm italic font-medium text-[#ccc]">{step.callout}</p>
                    <Button variant="secondary" className="whitespace-nowrap rounded-lg" onClick={() => openWidget(`Help me with step ${step.id}: ${step.title}.`)}>
                      Ask AI <ArrowRight size={14} />
                    </Button>
                  </div>

                  {!stepProgress.completed && (
                    <Button variant="gradient" className="rounded-lg" onClick={() => updateProgress(step.id, true, -1, false)}>
                      <CheckCircle size={14} /> Mark Complete
                    </Button>
                  )}
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
