import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";
import { TOPICS } from "../data/topics";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const diffColors: Record<string, string> = {
  Beginner: "text-accent-emerald border-accent-emerald/30 bg-accent-emerald/10",
  Intermediate: "text-accent-amber border-accent-amber/30 bg-accent-amber/10",
  Advanced: "text-accent-rose border-accent-rose/30 bg-accent-rose/10",
};

function TopicCard({ topic, bestScore, totalScore, currentDifficulty, onDifficultyClick, index }: any) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group perspective-1000 h-64 cursor-pointer"
      onClick={() => navigate(`/quiz/${topic.id}?diff=${currentDifficulty}`)}
      role="button" tabIndex={0}
      onKeyDown={e => { if (e.key === "Enter") navigate(`/quiz/${topic.id}?diff=${currentDifficulty}`); }}
    >
      <div className="relative w-full h-full transition-transform duration-700 preserve-3d group-hover:rotate-y-180">
        <div className="absolute inset-0 backface-hidden glass rounded-xl p-6 flex flex-col justify-between card-glow">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold-400/10 to-accent-purple/10 flex items-center justify-center text-2xl">{topic.emoji}</div>
            <button className={`px-2.5 py-1 text-[9px] uppercase font-bold tracking-widest rounded-md border ${diffColors[currentDifficulty] || "text-gold-400"}`}
              onClick={e => { e.stopPropagation(); onDifficultyClick(topic.id); }}>{currentDifficulty}</button>
          </div>
          <div>
            <h3 className="font-display text-xl font-black uppercase tracking-tighter text-[#F5F5F5] mb-1">{topic.label}</h3>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#666]">{topic.count} questions</p>
          </div>
          {bestScore !== undefined && (
            <div className="mt-3">
              <div className="flex justify-between items-end mb-1">
                <span className="text-[9px] uppercase font-bold tracking-widest text-gold-400">Best</span>
                <span className="text-[10px] font-bold text-gold-400">{Math.round((bestScore / (totalScore || topic.count)) * 100)}%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gold-400 to-accent-purple rounded-full" style={{ width: `${(bestScore / (totalScore || topic.count)) * 100}%` }} />
              </div>
            </div>
          )}
        </div>
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-gold-400 to-accent-purple text-white rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-xl font-black uppercase tracking-tighter mb-3">{topic.label}</h3>
            <p className="text-sm leading-relaxed font-medium opacity-90">{topic.description}</p>
          </div>
          <button className="w-full bg-black/30 hover:bg-black/50 text-white py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2" tabIndex={-1}>
            Start Quiz <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export default function Quiz() {
  const [filter, setFilter] = useState("all");
  const { isAuthenticated } = useAuth();
  const [scores, setScores] = useState<any[]>([]);
  const [topicDifficulties, setTopicDifficulties] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated) { api.quiz.getScores().then(setScores).catch(() => {}); }
  }, [isAuthenticated]);

  const handleDifficultyClick = (topicId: string) => {
    setTopicDifficulties(prev => {
      const current = prev[topicId] || TOPICS.find(t => t.id === topicId)?.difficulty || "Beginner";
      const nextIdx = (DIFFICULTIES.indexOf(current) + 1) % DIFFICULTIES.length;
      return { ...prev, [topicId]: DIFFICULTIES[nextIdx] };
    });
  };
  const getTopicDifficulty = (topic: any) => topicDifficulties[topic.id] || topic.difficulty;
  const filteredTopics = filter === "all" ? TOPICS : TOPICS.filter(t => getTopicDifficulty(t) === filter);

  return (
    <div className="min-h-screen bg-navy-900 pt-24 pb-20 bg-grid">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-[10px] text-gold-400 font-bold uppercase tracking-widest mb-6">Civic Assessment</span>
          <h1 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter text-white">Test Your <span className="text-gradient">Knowledge</span></h1>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {["all", "Beginner", "Intermediate", "Advanced"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${filter === f ? "bg-white/10 text-white border border-white/10" : "text-[#666] hover:text-white hover:bg-white/5"}`}>
              {f === "all" ? "All Topics" : f}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTopics.map((t, i) => (
            <TopicCard key={t.id} topic={t} bestScore={scores.find(s => s.topic_id === t.id)?.best_score}
              totalScore={scores.find(s => s.topic_id === t.id)?.total} currentDifficulty={getTopicDifficulty(t)}
              onDifficultyClick={handleDifficultyClick} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
