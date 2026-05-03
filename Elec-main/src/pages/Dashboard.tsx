import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";
import { CIVIC_TIPS } from "../data/civicTips";
import { TOPICS } from "../data/topics";
import { Button } from "../components/ui/Button";
import { MessageSquare, BookOpen, Brain, Settings, LogOut, ArrowRight, Trophy } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useToast } from "../hooks/useToast";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [scores, setScores] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    api.quiz.getScores().then(setScores).catch(console.error);
    api.users.getGuideProgress().then(setProgress).catch(console.error);
    api.chat.getConversations().then(c => setConversations(c.slice(0, 2))).catch(console.error);
  }, []);

  const completedSteps = progress.filter(p => p.completed).length;
  const civicTip = CIVIC_TIPS[new Date().getDay() % CIVIC_TIPS.length];
  const nextElection = new Date("2024-11-05");
  const daysDiff = Math.max(0, Math.ceil((nextElection.getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
  const pct = Math.round((completedSteps / 6) * 100);

  return (
    <div className="flex h-screen bg-navy-900 pt-16">
      {/* Sidebar */}
      <div className="hidden md:flex w-60 glass-strong border-r border-white/5 flex-col p-4">
        <div className="space-y-1 flex-1">
          <NavItem icon={<BookOpen size={18}/>} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
          <NavItem icon={<Brain size={18}/>} label="Quiz Stats" onClick={() => setActiveTab("overview")} />
          <NavItem icon={<MessageSquare size={18}/>} label="Saved Chats" onClick={() => setActiveTab("overview")} />
          <NavItem icon={<Settings size={18}/>} label="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
        </div>
        <div className="pt-4 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400/20 to-accent-purple/20 border border-white/10 flex items-center justify-center text-white font-bold shrink-0 text-sm">
              {user?.display_name?.substring(0, 2) || "U"}
            </div>
            <div className="truncate">
              <p className="text-[11px] uppercase tracking-widest font-bold text-[#F5F5F5] truncate">{user?.display_name}</p>
              <p className="text-[10px] text-[#666] truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] uppercase tracking-widest font-bold text-accent-rose/70 hover:bg-accent-rose/10 hover:text-accent-rose transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8 relative overflow-hidden">
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 text-[10px] text-gold-400 font-bold uppercase tracking-widest mb-4">Dashboard</span>
                  <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#F5F5F5] mb-2">Welcome back, {user?.display_name}!</h2>
                  <p className="text-sm text-[#666] italic mb-8 border-l-2 border-gold-400/30 pl-3">"{civicTip}"</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-white/80 mb-2">
                      <span>Voting Guide</span><span className="text-gold-400">{completedSteps}/6</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.3 }}
                        className="bg-gradient-to-r from-gold-400 to-accent-purple h-full rounded-full" />
                    </div>
                  </div>
                  <Link to="/guide"><Button size="sm" className="mt-4 rounded-lg">Continue Guide <ArrowRight size={14} /></Button></Link>
                </div>
                <div className="absolute right-[-20px] top-10 opacity-[0.02] pointer-events-none select-none">
                  <div className="text-[150px] font-black leading-none transform rotate-12">ELECTIQ</div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-8 flex flex-col justify-center">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 text-[10px] text-gold-400 font-bold uppercase tracking-widest mb-4 w-fit">Next Election</span>
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="font-display text-6xl text-gradient font-black tracking-tighter">{daysDiff}</span>
                  <span className="text-sm font-bold uppercase tracking-widest text-[#666]">days</span>
                </div>
                <h3 className="text-white font-black uppercase tracking-tighter text-xl mb-1">General Election</h3>
                <p className="text-sm text-[#666] mb-6">United States (Federal & Local)</p>
                <Button variant="secondary" size="sm" className="rounded-lg w-fit">View Details</Button>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 text-center flex flex-col items-center justify-center">
                <div className="relative w-28 h-28 mb-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                    <motion.circle cx="50" cy="50" r="40" fill="transparent" stroke="url(#dash-grad)" strokeWidth="6" strokeLinecap="round"
                      strokeDasharray="251.2" initial={{ strokeDashoffset: 251.2 }} animate={{ strokeDashoffset: 251.2 - (251.2 * (completedSteps / 6)) }}
                      transition={{ duration: 1, delay: 0.5 }} />
                    <defs><linearGradient id="dash-grad"><stop offset="0%" stopColor="#4E88FF" /><stop offset="100%" stopColor="#8B5CF6" /></linearGradient></defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white">{completedSteps}</span>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#666]">of 6</span>
                  </div>
                </div>
                <Link to="/guide"><Button variant="secondary" size="sm" className="rounded-lg">Review Guide</Button></Link>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-6 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy size={14} className="text-gold-400" />
                  <span className="text-[10px] text-gold-400 font-bold uppercase tracking-widest">Quiz Performance</span>
                </div>
                <div className="flex justify-between items-end mb-4 border-b border-white/5 pb-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-[#666] mb-1">Mastered</p>
                    <p className="text-2xl text-white font-black">{scores.filter(s => (s.best_score / s.total) >= 0.8).length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-[#666] mb-1">Attempts</p>
                    <p className="text-2xl text-white font-black">{scores.reduce((a, b) => a + b.attempts, 0)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-[#666] mb-1">Average</p>
                  <p className="text-2xl text-gradient font-black">
                    {scores.length > 0 ? Math.round(scores.reduce((a, b) => a + (b.best_score / b.total), 0) / scores.length * 100) : 0}%
                  </p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare size={14} className="text-gold-400" />
                    <span className="text-[10px] text-gold-400 font-bold uppercase tracking-widest">Recent Chats</span>
                  </div>
                  {conversations.length === 0 ? (
                    <p className="text-sm text-[#555]">No conversations yet.</p>
                  ) : (
                    <div className="space-y-2 mb-6">
                      {conversations.map(c => (
                        <div key={c.id} className="p-3 glass rounded-lg">
                          <p className="text-sm text-white truncate font-bold mb-1">{c.title}</p>
                          <p className="text-[10px] text-[#666]">{new Date(c.updated_at).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Link to="/chat"><Button variant="secondary" size="sm" className="w-full rounded-lg">Open Assistant</Button></Link>
              </motion.div>
            </div>

            {/* Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass rounded-2xl p-6 overflow-hidden">
              <span className="text-[10px] text-gold-400 font-bold uppercase tracking-widest mb-4 block">Quiz Score History</span>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-white/80">
                  <thead className="text-[10px] uppercase tracking-widest font-bold text-[#666] border-b border-white/5">
                    <tr><th className="px-4 py-3">Topic</th><th className="px-4 py-3">Best Score</th><th className="px-4 py-3">Attempts</th><th className="px-4 py-3">Last Played</th></tr>
                  </thead>
                  <tbody>
                    {scores.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-8 text-[#555] uppercase text-[10px] tracking-widest">No quizzes taken yet.</td></tr>
                    ) : scores.map((s, i) => {
                      const topic = TOPICS.find(t => t.id === s.topic_id);
                      return (
                        <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-4 font-bold text-white flex items-center gap-2"><span>{topic?.emoji}</span> {topic?.label || s.topic_id}</td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1 w-32">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-gold-400 font-bold">{Math.round((s.best_score / s.total) * 100)}%</span>
                                <span className="text-[#666]">({s.best_score}/{s.total})</span>
                              </div>
                              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-gold-400 to-accent-purple h-full rounded-full" style={{ width: `${(s.best_score / s.total) * 100}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 font-mono text-[#888]">{s.attempts}</td>
                          <td className="px-4 py-4 font-mono text-xs text-[#666]">{new Date(s.last_played).toLocaleDateString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}
        {activeTab === "settings" && <SettingsView />}
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all uppercase tracking-widest text-[11px] font-bold ${active ? "bg-white/10 text-white" : "text-[#666] hover:bg-white/5 hover:text-white"}`}>
      {icon}<span>{label}</span>
    </button>
  );
}

function SettingsView() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ display_name: user?.display_name || "", country: user?.country || "US", state_district: user?.state_district || "", age_group: user?.age_group || "", learning_goal: user?.learning_goal || "" });
  const [saving, setSaving] = useState(false);
  const { setAuth } = useAuthStore();
  const { toast } = useToast();
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { const data = await api.users.updateProfile(formData); setAuth(data, useAuthStore.getState().token!); toast({ type: "success", message: "Profile updated." }); }
    catch (err: any) { toast({ type: "error", message: err?.message || "Failed to update." }); }
    finally { setSaving(false); }
  };
  const inputCls = "w-full glass rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all";
  return (
    <div className="max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8">
        <h2 className="font-display text-2xl font-black uppercase tracking-tighter text-[#F5F5F5] mb-6">Profile Settings</h2>
        <form onSubmit={handleUpdate} className="space-y-5">
          <div><label className="block text-[10px] uppercase font-bold tracking-widest text-[#666] mb-2">Display Name</label>
            <input type="text" value={formData.display_name} onChange={e => setFormData({ ...formData, display_name: e.target.value })} className={inputCls} required /></div>
          <div><label className="block text-[10px] uppercase font-bold tracking-widest text-[#666] mb-2">Country</label>
            <input type="text" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} className={inputCls} /></div>
          <div><label className="block text-[10px] uppercase font-bold tracking-widest text-[#666] mb-2">State / Region</label>
            <input type="text" value={formData.state_district} onChange={e => setFormData({ ...formData, state_district: e.target.value })} className={inputCls} placeholder="e.g. California" /></div>
          <div><label className="block text-[10px] uppercase font-bold tracking-widest text-[#666] mb-2">Age Group</label>
            <select value={formData.age_group} onChange={e => setFormData({ ...formData, age_group: e.target.value })} className={inputCls}>
              <option value="">Select</option><option value="under_18">Under 18</option><option value="18_24">18-24</option>
              <option value="25_34">25-34</option><option value="35_44">35-44</option><option value="45_54">45-54</option><option value="55_plus">55+</option>
            </select></div>
          <Button type="submit" variant="gradient" className="rounded-lg" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
        </form>
      </motion.div>
    </div>
  );
}
