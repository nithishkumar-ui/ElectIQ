import { useState } from "react";
import { useChatStore } from "../store/chatStore";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/Button";
import { X, MessageSquare, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

const NODES = [
  { id: "reg", label: "Voter Registration", x: 300, y: 80, color: "#0f0f0f", stroke: "#4E88FF", textColor: "white", desc: "Citizens sign up to be included on the electoral roll.", duration: "Months before", stakeholders: ["Voters", "State Officials"] },
  { id: "file", label: "Candidate Filing", x: 600, y: 80, color: "#0f0f0f", stroke: "#333", textColor: "white", desc: "Politicians formally submit paperwork to run.", duration: "Months before", stakeholders: ["Candidates"] },
  { id: "prim", label: "Primary Elections", x: 150, y: 220, color: "#0f0f0f", stroke: "#333", textColor: "white", desc: "Parties vote to select their nominee.", duration: "Spring", stakeholders: ["Voters"] },
  { id: "conv", label: "Party Conventions", x: 600, y: 220, color: "#0f0f0f", stroke: "#333", textColor: "white", desc: "Parties formally nominate their candidate.", duration: "Summer", stakeholders: ["Delegates"] },
  { id: "camp", label: "General Campaign", x: 375, y: 360, color: "#0f0f0f", stroke: "#333", textColor: "white", desc: "Candidates campaign to win over the general electorate.", duration: "Summer-Fall", stakeholders: ["Candidates", "Voters"] },
  { id: "early", label: "Early Voting", x: 150, y: 500, color: "#0f0f0f", stroke: "#333", textColor: "white", desc: "Voters cast ballots before election day.", duration: "Weeks before", stakeholders: ["Voters"] },
  { id: "eday", label: "Election Day", x: 375, y: 500, color: "#4E88FF", stroke: "#4E88FF", textColor: "white", desc: "The final day to cast ballots.", duration: "1 Day", stakeholders: ["Voters", "Poll Workers"] },
  { id: "count", label: "Vote Counting", x: 375, y: 640, color: "#0f0f0f", stroke: "#333", textColor: "white", desc: "Ballots are aggregated and tallied securely.", duration: "Days-Weeks", stakeholders: ["Election Officials"] },
  { id: "cert", label: "Certification", x: 375, y: 920, color: "#0f0f0f", stroke: "#333", textColor: "white", desc: "Results are made official and legally binding.", duration: "Weeks after", stakeholders: ["State Officials"] },
  { id: "ecol", label: "Electoral College", x: 650, y: 920, color: "#0f0f0f", stroke: "#333", textColor: "white", desc: "Electors cast their official votes for President.", duration: "December", stakeholders: ["Electors"] },
  { id: "inaug", label: "Inauguration", x: 375, y: 1060, color: "#0f0f0f", stroke: "#333", textColor: "white", desc: "Swearing in of the new elected official.", duration: "Jan 20", stakeholders: ["President-elect"] },
];

const EDGES = [
  { from: "reg", to: "prim" }, { from: "file", to: "prim" },
  { from: "prim", to: "conv" }, { from: "conv", to: "camp" },
  { from: "camp", to: "early" }, { from: "camp", to: "eday" },
  { from: "early", to: "count" }, { from: "eday", to: "count" },
  { from: "count", to: "cert" }, { from: "cert", to: "ecol" },
  { from: "ecol", to: "inaug" },
];

export default function Process() {
  const [pan, setPan] = useState({ x: 0, y: 50 });
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const { openWidget } = useChatStore();

  const handleMouseDown = () => setDragging(true);
  const handleMouseUp = () => setDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) setPan(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
  };
  const handleWheel = (e: React.WheelEvent) => {
    setZoom(z => Math.max(0.4, Math.min(3, z - e.deltaY * 0.001)));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050505] pt-16"
      onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onMouseMove={handleMouseMove} onWheel={handleWheel}
      style={{ cursor: dragging ? "grabbing" : "grab" }}>
      <div className="absolute inset-0 pointer-events-none z-0 bg-grid opacity-60" />
      <svg width="100%" height="100%" className="relative z-10">
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#333" />
          </marker>
          <filter id="glow"><feGaussianBlur stdDeviation="4" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <linearGradient id="node-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4E88FF" /><stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {EDGES.map((edge, i) => {
            const s = NODES.find(n => n.id === edge.from);
            const e = NODES.find(n => n.id === edge.to);
            if (!s || !e) return null;
            return <path key={i} d={`M${s.x},${s.y + 25} C${s.x},${(s.y + e.y) / 2} ${e.x},${(s.y + e.y) / 2} ${e.x},${e.y - 25}`}
              fill="none" stroke="#222" strokeWidth="2" strokeDasharray="6 3" markerEnd="url(#arrow)" />;
          })}
          {NODES.map(node => {
            const isSelected = selectedNode?.id === node.id;
            const isHighlight = node.id === "eday";
            return (
              <g key={node.id} transform={`translate(${node.x - 85}, ${node.y - 25})`}
                onClick={e => { e.stopPropagation(); setSelectedNode(node); }} className="cursor-pointer">
                <rect width="170" height="50" rx="12" fill={isHighlight ? "url(#node-grad)" : node.color}
                  stroke={isSelected ? "#4E88FF" : isHighlight ? "#4E88FF" : "rgba(255,255,255,0.08)"} strokeWidth={isSelected ? "2" : "1"}
                  filter={isSelected ? "url(#glow)" : undefined}
                  className="transition-all duration-300 hover:stroke-[rgba(78,136,255,0.4)]" />
                <text fill={node.textColor} x="85" y="30" textAnchor="middle" fontSize="10" fontFamily="var(--font-body)" letterSpacing="1.5px" fontWeight="700">
                  {node.label.toUpperCase()}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      <div className="fixed bottom-6 left-6 flex flex-col gap-2 z-10">
        <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="w-10 h-10 glass rounded-lg text-white flex items-center justify-center hover:border-gold-400/30 transition-all"><ZoomIn size={16} /></button>
        <button onClick={() => setZoom(z => Math.max(0.4, z - 0.2))} className="w-10 h-10 glass rounded-lg text-white flex items-center justify-center hover:border-gold-400/30 transition-all"><ZoomOut size={16} /></button>
        <button onClick={() => { setZoom(1); setPan({ x: 0, y: 50 }); }} className="w-10 h-10 glass rounded-lg text-white flex items-center justify-center hover:border-gold-400/30 transition-all"><RotateCcw size={16} /></button>
      </div>

      <AnimatePresence>
        {selectedNode && (
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-16 bottom-0 w-80 md:w-96 glass-strong z-20 p-8 flex flex-col shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] text-gold-400 font-bold uppercase tracking-widest">Phase Info</span>
              <button onClick={() => setSelectedNode(null)} className="text-[#666] hover:text-white transition-colors"><X size={18} /></button>
            </div>
            <h2 className="font-display text-3xl font-black uppercase tracking-tighter text-[#F5F5F5] mb-4 leading-none">{selectedNode.label}</h2>
            <p className="text-[#888] font-medium leading-relaxed mb-8">{selectedNode.desc}</p>
            <div className="glass rounded-xl p-5 mb-8">
              <div className="flex justify-between pb-3 mb-3 border-b border-white/5 text-[10px] uppercase font-bold tracking-widest text-[#666]">
                <span>Duration</span><span className="text-white">{selectedNode.duration}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#666] block mb-2">Stakeholders</span>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.stakeholders.map((s: string) => (
                    <span key={s} className="px-3 py-1 glass rounded-md text-[9px] uppercase tracking-widest text-[#ccc] font-bold">{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <Button variant="gradient" className="mt-auto w-full rounded-lg" onClick={() => openWidget(`Provide more details about the ${selectedNode.label} phase.`)}>
              <MessageSquare size={14} /> Ask AI
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
