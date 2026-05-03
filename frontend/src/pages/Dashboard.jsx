import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Trophy, Star, Clock } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [history, setHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [histRes, leadRes] = await Promise.all([
          api.get('/users/me/history'),
          api.get('/quiz/leaderboard')
        ]);
        setHistory(histRes.data.quizzes);
        setLeaderboard(leadRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return <div className="p-12 text-center text-slate-400 animate-pulse">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.username}!</h1>
        <p className="text-slate-400">Track your civic learning journey and see how you rank.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Col: Stats & History */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-6">
              <div className="p-4 bg-primary-500/20 rounded-full text-primary-500">
                <Star size={32} />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium">Total Civic Score</p>
                <p className="text-3xl font-bold">{user?.civic_score}</p>
              </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-6">
              <div className="p-4 bg-blue-500/20 rounded-full text-blue-500">
                <Trophy size={32} />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium">Quizzes Completed</p>
                <p className="text-3xl font-bold">{history.length}</p>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock className="text-slate-400" /> Recent Activity
            </h2>
            
            {history.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No quizzes taken yet. Start exploring!</p>
            ) : (
              <div className="space-y-4">
                {history.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-dark-800/50 rounded-xl border border-white/5">
                    <div>
                      <p className="font-semibold text-slate-200 capitalize">{item.topic.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-400">{item.score} / {item.total_questions}</p>
                      <p className="text-xs text-slate-500">Score</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Leaderboard */}
        <div className="space-y-8">
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Trophy className="text-yellow-500" /> Global Leaderboard
            </h2>
            
            <div className="space-y-3">
              {leaderboard.map((lUser, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${
                  lUser.username === user?.username ? 'bg-primary-500/10 border border-primary-500/30' : 'bg-dark-800/30'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-6 text-center font-bold ${
                      idx === 0 ? 'text-yellow-500' : 
                      idx === 1 ? 'text-slate-300' : 
                      idx === 2 ? 'text-orange-400' : 'text-slate-500'
                    }`}>
                      #{idx + 1}
                    </span>
                    <span className="font-medium">{lUser.username}</span>
                  </div>
                  <span className="font-bold text-primary-400">{lUser.total_score} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
