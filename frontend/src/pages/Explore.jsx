import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { Globe, Users, FileText, Activity } from 'lucide-react';

export default function Explore() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, UPCOMING, ACTIVE, PAST

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await api.get('/elections/');
        setElections(res.data);
      } catch (err) {
        console.error("Failed to fetch elections", err);
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  const filteredElections = elections.filter(e => {
    if (activeTab === 'ALL') return true;
    return e.status === activeTab;
  });

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading global elections...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Global Elections Hub</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Explore upcoming, active, and past elections around the world. Understand the voting systems, phases, and key information.</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-12">
        {['ALL', 'UPCOMING', 'ACTIVE', 'PAST'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === tab 
                ? 'bg-primary-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                : 'glass-panel hover:bg-white/10 text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredElections.map((election, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={election.id} 
            className="glass-panel p-6 rounded-2xl flex flex-col h-full hover:-translate-y-1 transition-transform border-t border-white/10"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{election.country}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                election.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                election.status === 'UPCOMING' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                'bg-slate-500/20 text-slate-400 border border-slate-500/30'
              }`}>
                {election.status}
              </span>
            </div>
            
            <p className="text-xl text-primary-400 font-semibold mb-4">{election.title}</p>
            <p className="text-slate-400 text-sm mb-6 flex-grow">{election.description}</p>
            
            <div className="space-y-3 pt-4 border-t border-slate-700/50">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Globe size={16} className="text-primary-500" />
                <span>System: {election.system_type}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Activity size={16} className="text-primary-500" />
                <span>Phases: {election.phases.length}</span>
              </div>
            </div>
          </motion.div>
        ))}
        
        {filteredElections.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            No elections found for this category.
          </div>
        )}
      </div>
    </div>
  );
}
