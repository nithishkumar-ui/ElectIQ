import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuiz } from "../hooks/useQuiz";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";
import { TOPICS } from "../data/topics";
import { Button } from "../components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../hooks/useToast";
import { ArrowRight, RotateCcw, Trophy, CheckCircle, XCircle } from "lucide-react";

function Confetti() {
  const colors = ["#4E88FF", "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#F43F5E"];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: colors[i % colors.length], left: `${Math.random() * 100}%`, top: -10 }}
          animate={{ y: window.innerHeight + 20, x: (Math.random() - 0.5) * 200, rotate: Math.random() * 720, opacity: [1, 1, 0] }}
          transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export default function QuizSession() {
  const { topicId } = useParams();
  const [searchParams] = useSearchParams();
  const difficulty = searchParams.get("diff") || undefined;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const topic = TOPICS.find(t => t.id === topicId) || TOPICS[0];
  const { questions, currentIndex, score, answers, loading, error, isComplete, selectAnswer, nextQuestion } = useQuiz(topicId, difficulty);

  useEffect(() => {
    if (isComplete && isAuthenticated) {
      api.quiz.submitScore({ topic_id: topicId, score, total: questions.length }).catch(console.error);
    }
  }, [isComplete, isAuthenticated, topicId, score, questions.length]);

  if (loading) return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || questions.length === 0) return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center text-center px-4">
      <div className="text-5xl mb-6">⚠️</div>
      <h2 className="text-white text-xl mb-2 font-bold">Questions not available yet</h2>
      <p className="text-[#666] mb-6 text-sm">Try another topic or check back later.</p>
      <Button onClick={() => navigate("/quiz")}>Back to Topics</Button>
    </div>
  );

  if (isComplete) {
    const pct = Math.round((score / questions.length) * 100);
    const grade = pct >= 90 ? "A" : pct >= 75 ? "B" : pct >= 60 ? "C" : "F";
    const gradeColor = pct >= 90 ? "text-accent-emerald" : pct >= 75 ? "text-gold-400" : pct >= 60 ? "text-accent-amber" : "text-accent-rose";
    const showConfetti = pct >= 75;

    return (
      <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center text-center px-4 bg-grid">
        {showConfetti && <Confetti />}
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-2xl p-12 max-w-md w-full relative z-10 text-left">
          <div className="flex items-center gap-2 mb-6">
            <Trophy size={16} className="text-gold-400" />
            <span className="text-[10px] text-gold-400 font-bold uppercase tracking-widest">Session Complete</span>
          </div>
          <div className="flex items-baseline gap-3 mb-8">
            <span className={`font-display text-7xl font-black ${gradeColor}`}>{grade}</span>
            <span className="text-[#555] text-2xl font-black uppercase">Grade</span>
          </div>
          <div className="flex justify-between glass rounded-xl p-4 mb-8">
            <div>
              <span className="block text-[9px] text-[#666] uppercase tracking-widest mb-1">Score</span>
              <span className="text-xl font-black text-white">{score}/{questions.length}</span>
            </div>
            <div className="text-right">
              <span className="block text-[9px] text-[#666] uppercase tracking-widest mb-1">Percentage</span>
              <span className={`text-xl font-black ${gradeColor}`}>{pct}%</span>
            </div>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-8">
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-gold-400 to-accent-purple rounded-full" />
          </div>
          <div className="flex gap-3">
            <Button className="flex-1 rounded-lg" onClick={() => window.location.reload()}>
              <RotateCcw size={14} /> Retry
            </Button>
            <Button variant="secondary" className="flex-1 rounded-lg" onClick={() => navigate("/quiz")}>Exit</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentIndex];
  const answered = answers[q.id];

  return (
    <div className="min-h-screen bg-navy-900 pt-16 flex flex-col">
      <div className="sticky top-16 glass-strong border-b border-white/5 px-6 py-4 z-20 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-[#888]">
        <span>{topic.label}</span>
        <span>Q{currentIndex + 1} / {questions.length}</span>
      </div>
      <div className="w-full h-1 bg-white/5">
        <motion.div className="h-full bg-gradient-to-r from-gold-400 to-accent-purple" animate={{ width: `${((currentIndex + (answered ? 1 : 0)) / questions.length) * 100}%` }} transition={{ duration: 0.5 }} />
      </div>
      <div className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <div className="mb-12">
              <span className="text-[10px] text-gold-400 font-bold uppercase tracking-widest mb-4 block">Question {currentIndex + 1}</span>
              <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#F5F5F5] leading-tight">{q.question}</h2>
            </div>
            <div className="space-y-3">
              {q.options.map((opt: string, idx: number) => {
                let stateClass = "glass hover:border-white/20 text-white";
                let icon = null;
                if (answered) {
                  if (idx === q.correct) { stateClass = "border-accent-emerald/50 bg-accent-emerald/10 text-accent-emerald"; icon = <CheckCircle size={18} />; }
                  else if (idx === answered.selected) { stateClass = "border-accent-rose/50 bg-accent-rose/10 text-accent-rose"; icon = <XCircle size={18} />; }
                  else stateClass = "border-white/5 bg-white/2 text-[#444] pointer-events-none";
                }
                return (
                  <motion.button key={idx} onClick={() => selectAnswer(q.id, idx)} whileTap={!answered ? { scale: 0.98 } : undefined}
                    className={`w-full p-5 border rounded-xl text-left flex items-center justify-between transition-all ${stateClass}`}>
                    <span className="font-bold text-sm tracking-wide">{opt}</span>
                    {icon}
                  </motion.button>
                );
              })}
            </div>
            {answered && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                <div className="glass rounded-xl border-gold-400/20 p-6 mb-8 text-sm text-[#ccc] font-medium leading-relaxed">
                  <span className="font-black text-gold-400 uppercase tracking-widest text-[10px] block mb-2">Explanation</span>
                  {q.explanation}
                </div>
                <div className="flex justify-end">
                  <Button className="rounded-lg" onClick={nextQuestion}>
                    {currentIndex < questions.length - 1 ? "Next Question" : "See Results"} <ArrowRight size={14} />
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
