import { useState, useMemo, Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Outlines } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { useElectionData } from "../hooks/useElectionData";
import { useChatStore } from "../store/chatStore";
import ParticleField from "../components/timeline/ParticleField";
import { Button } from "../components/ui/Button";

function TimelineNode({ phase, selected, focused, onClick, onFocus }: any) {
  const ref = useRef<THREE.Mesh>(null);
  const focusGlowRef = useRef<THREE.Mesh>(null);
  const focusOutlineRef = useRef<THREE.Mesh>(null);
  const outerTorusRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const pulseStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (selected) {
      pulseStartRef.current = performance.now();
    } else {
      pulseStartRef.current = null;
    }
  }, [selected]);
  
  useFrame((state) => {
    let additionalScale = 0;
    
    if (pulseStartRef.current) {
      const elapsed = (performance.now() - pulseStartRef.current) / 1000;
      if (elapsed < 2) {
        // Fast pulsation for 2 seconds
        additionalScale = Math.sin(elapsed * Math.PI * 6) * 0.3 * (1 - elapsed / 2);
      }
    }

    if (ref.current) {
      if (selected) {
        let scale = 1.1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
        scale += additionalScale;
        ref.current.scale.set(scale, scale, scale);
        ref.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
        const mat = ref.current.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.emissiveIntensity = Math.min(1, 0.8 + Math.sin(state.clock.elapsedTime * 4) * 0.4 + additionalScale);
        }
      } else if (focused || hovered) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
        ref.current.scale.set(scale, scale, scale);
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, 0, 0.1);
        const mat = ref.current.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 5) * 0.3;
        }
      } else {
        ref.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, 0, 0.1);
        const mat = ref.current.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.2, 0.1);
        }
      }
    }

    if (focusOutlineRef.current && (focused)) {
      // Subtle pulsating outline specifically for focused state
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.08;
      focusOutlineRef.current.scale.set(pulseScale, pulseScale, pulseScale);
      const material = focusOutlineRef.current.material as THREE.MeshBasicMaterial;
      if (material) {
        material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 6) * 0.2;
      }
    }

    if (focusGlowRef.current && (selected || hovered)) {
      const progress = (state.clock.elapsedTime * 1.5) % 1;
      const scale = 1 + progress * 1.0;
      focusGlowRef.current.scale.set(scale, scale, scale);
      const material = focusGlowRef.current.material as THREE.MeshBasicMaterial;
      if (material) {
        material.opacity = (1 - progress) * 0.5;
      }
    }

    if (outerTorusRef.current && (selected || hovered)) {
       outerTorusRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  const pos = phase.position || [0, 0, 0];
  return (
    <group 
      position={new THREE.Vector3(...pos)} 
      onClick={(e) => { e.stopPropagation(); onClick(phase); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <mesh ref={ref}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color={selected ? "#4E88FF" : (focused || hovered) ? "#FFD700" : "#333333"} 
          emissive={selected ? "#4E88FF" : (focused || hovered) ? "#FFD700" : "#333333"} 
          emissiveIntensity={(selected || focused || hovered) ? 0.8 : 0.2} 
        />
        {(selected || hovered) && (
          <Outlines thickness={selected ? 0.05 : 0.03} color={selected ? "#4E88FF" : "#FFD700"} />
        )}
      </mesh>
      
      {focused && !selected && !hovered && (
         <mesh ref={focusOutlineRef}>
           <sphereGeometry args={[0.34, 32, 32]} />
           <meshBasicMaterial color="#FFFFFF" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} />
         </mesh>
      )}

      {(selected || hovered) && (
        <group>
          <mesh ref={outerTorusRef} rotation={[-Math.PI/2, 0, 0]}>
            <torusGeometry args={[selected ? 0.6 : 0.5, selected ? 0.02 : 0.015, 32, 100]} />
            <meshBasicMaterial color={selected ? "#4E88FF" : "#FFD700"} transparent opacity={0.6} />
          </mesh>
          <mesh ref={focusGlowRef}>
            <sphereGeometry args={[selected ? 0.45 : 0.4, 32, 32]} />
            <meshBasicMaterial color={selected ? "#4E88FF" : "#FFD700"} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>
      )}

      <Html distanceFactor={10} position={[0, 0.6, 0]} center>
        <button 
          id={`phase-node-${phase.id}`}
          className={`whitespace-nowrap px-3 py-1 text-[10px] uppercase tracking-widest font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#FFD700] ring-offset-2 ring-offset-transparent cursor-pointer ${selected ? "bg-[#4E88FF] text-black shadow-glow" : focused ? "bg-[#222] text-[#FFD700] border border-[#FFD700]" : "bg-[#111] text-white border border-[#333]"}`}
          aria-label={`Select ${phase.label} phase`}
          aria-pressed={selected}
          onClick={(e) => { e.stopPropagation(); onClick(phase); }}
          onFocus={() => onFocus(phase.id)}
        >
          {phase.label}
        </button>
      </Html>
    </group>
  );
}

function TimelineCanvas({ phases, selectedPhaseId, focusedPhaseId, onSelectPhase, onFocusPhase }: any) {
  const curve = useMemo(() => {
    if (!phases || phases.length < 2) return null;
    const points = phases.map((p: any) => new THREE.Vector3(...(p.position || [0,0,0])));
    return new THREE.CatmullRomCurve3(points);
  }, [phases]);

  return (
    <group>
      {curve && (
        <mesh>
          <tubeGeometry args={[curve, 64, 0.05, 8, false]} />
          <meshStandardMaterial color="#444444" transparent opacity={0.3} />
        </mesh>
      )}
      {phases?.map((phase: any) => (
        <TimelineNode 
          key={phase.id} 
          phase={phase} 
          selected={selectedPhaseId === phase.id} 
          focused={focusedPhaseId === phase.id}
          onClick={onSelectPhase} 
          onFocus={onFocusPhase}
        />
      ))}
    </group>
  );
}

export default function Explore() {
  const [country, setCountry] = useState("us");
  const [year, setYear] = useState("2024");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhase, setSelectedPhase] = useState<any>(null);
  const [focusedPhaseId, setFocusedPhaseId] = useState<string | null>(null);
  
  const { data, loading, error } = useElectionData(country);
  const { openWidget } = useChatStore();

  const handleAskGemini = () => {
    if (selectedPhase) {
      openWidget(`Provide a more in-depth explanation of the ${selectedPhase.label} phase in the ${country.toUpperCase()} elections.`);
    }
  };

  const phases = useMemo(() => {
    if (!data?.phases) return [];
    
    let processedPhases = data.phases;
    
    if (year !== "2024") {
      processedPhases = processedPhases.map((p: any) => ({
        ...p,
        date_range: p.date_range.replace(/2024/g, year),
        description: p.description.replace(/2024/g, year),
        key_facts: p.key_facts?.map((f: string) => f.replace(/2024/g, year)),
        position: [p.position[0], p.position[1] + (year === "2025" ? 0.5 : 0), p.position[2]]
      }));
    }

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      processedPhases = processedPhases.filter((p: any) => 
        p.label.toLowerCase().includes(lowerQuery) || 
        p.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    return processedPhases;
  }, [data, year, searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      
      if (!phases || phases.length === 0) return;

      const currentFocusedId = focusedPhaseId || (selectedPhase ? selectedPhase.id : null);
      let nextId = null;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const idx = phases.findIndex((p: any) => p.id === currentFocusedId);
        nextId = phases[Math.min(idx + 1, phases.length - 1)]?.id || phases[0].id;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const idx = phases.findIndex((p: any) => p.id === currentFocusedId);
        if (idx === -1) {
          nextId = phases[phases.length - 1].id;
        } else {
          nextId = phases[Math.max(idx - 1, 0)]?.id;
        }
      } else if ((e.key === "Enter" || e.key === " ") && focusedPhaseId) {
        const phaseToSelect = phases.find((p: any) => p.id === focusedPhaseId);
        if (phaseToSelect) {
          e.preventDefault();
          setSelectedPhase(phaseToSelect);
        }
      }

      if (nextId) {
        setFocusedPhaseId(nextId);
        const el = document.getElementById(`phase-node-${nextId}`);
        if (el) el.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phases, focusedPhaseId, selectedPhase]);

  const hasWebGL = useMemo(() => {
    try {
      const canvas = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    } catch(e) { return false; }
  }, []);

  return (
    <div className="h-screen w-full flex flex-col bg-[#050505] overflow-hidden pt-16">
      {/* Top Bar */}
      <div className="h-16 bg-[#050505] z-20 border-b border-[#222] flex items-center justify-between px-6 shrink-0">
        <div>
           <span className="text-[10px] text-[#4E88FF] font-bold uppercase tracking-widest block leading-tight">Global Data</span>
           <h2 className="font-display text-xl font-black uppercase tracking-tighter text-[#F5F5F5]">Timeline</h2>
        </div>
        <div className="flex gap-4">
          <div className="relative flex items-center">
            <svg 
              className="absolute left-3 w-3 h-3 text-[#666]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="search" 
              placeholder="SEARCH PHASES..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#111] text-[10px] uppercase font-bold tracking-widest text-[#F5F5F5] placeholder-[#444] pl-8 pr-4 py-2 border border-[#333] outline-none focus:border-[#4E88FF] w-48 transition-all focus:w-64"
              aria-label="Search election phases"
            />
          </div>
          <select 
            value={country} 
            onChange={(e) => { setCountry(e.target.value); setSelectedPhase(null); }} 
            className="bg-[#111] text-[10px] uppercase font-bold tracking-widest text-[#F5F5F5] px-4 py-2 border border-[#333] outline-none focus:border-[#4E88FF]"
            aria-label="Select Country"
          >
            <option value="us">United States (US)</option>
            <option value="uk">United Kingdom (UK)</option>
            <option value="india">India</option>
          </select>
          <select 
            value={year} 
            onChange={(e) => setYear(e.target.value)} 
            className="bg-[#111] text-[10px] uppercase font-bold tracking-widest text-[#F5F5F5] px-4 py-2 border border-[#333] outline-none focus:border-[#4E88FF]"
            aria-label="Select Election Year"
          >
             <option value="2024">2024</option>
             <option value="2025">2025</option>
          </select>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main 3D Area */}
        <div className="flex-1 relative cursor-grab active:cursor-grabbing">
          {loading && <div className="absolute inset-0 flex items-center justify-center z-10 text-white">Loading timeline...</div>}
          {error && <div className="absolute inset-0 flex items-center justify-center z-10 text-red-400">Failed to load data</div>}
          
          {hasWebGL && !loading ? (
             <Suspense fallback={null}>
               <Canvas camera={{ position: [0, 4, 15], fov: 60 }}>
                 <color attach="background" args={["#050505"]} />
                 <ambientLight intensity={0.6} />
                 <directionalLight position={[10, 10, 5]} intensity={1} />
                 <ParticleField dim={0.5} />
                 <TimelineCanvas phases={phases || []} selectedPhaseId={selectedPhase?.id} focusedPhaseId={focusedPhaseId} onSelectPhase={setSelectedPhase} onFocusPhase={setFocusedPhaseId} />
                 <OrbitControls enableDamping dampingFactor={0.05} autoRotate={!selectedPhase} autoRotateSpeed={0.5} maxDistance={25} minDistance={5} />
               </Canvas>
             </Suspense>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white overflow-y-auto px-4 py-8">
               <div className="max-w-md w-full space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                 {phases?.map((p: any) => (
                    <button 
                      id={`phase-node-${p.id}`}
                      key={p.id} 
                      onClick={() => setSelectedPhase(p)} 
                      onFocus={() => setFocusedPhaseId(p.id)}
                      className={`relative block w-full text-left focus:outline-none focus:ring-4 focus:ring-[#FFD700] rounded-lg mt-4 first:mt-0 outline-none ${focusedPhaseId === p.id ? 'ring-2 ring-offset-2 ring-offset-[#050505] ring-[#FFD700]' : ''}`}
                      aria-label={`Select ${p.label} phase`}
                      aria-pressed={selectedPhase?.id === p.id}
                    >
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active cursor-pointer">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-navy-800 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 group-hover:bg-gold-400 group-hover:text-navy-900 z-10 transition-colors">
                          ⭐
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-white/10 bg-navy-800/50 shadow">
                          <h3 className="font-bold">{p.label}</h3>
                        </div>
                      </div>
                    </button>
                 ))}
               </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className={`w-80 md:w-96 bg-[#111] z-20 border-l border-[#222] absolute right-0 top-0 bottom-0 transform transition-transform duration-300 ${selectedPhase ? "translate-x-0" : "translate-x-full md:relative md:translate-x-0"}`}>
          <div className="p-8 h-full flex flex-col">
            <AnimatePresence mode="wait">
              {selectedPhase ? (
                <motion.div key={selectedPhase.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 overflow-y-auto pr-2">
                  <div className="flex justify-between items-start mb-4">
                     <h2 className="font-display text-4xl font-black uppercase tracking-tighter text-[#4E88FF] leading-none">{selectedPhase.label}</h2>
                     <button 
                       className="md:hidden text-[#888] font-black focus:outline-none focus:ring-2 focus:ring-[#4E88FF]" 
                       onClick={() => setSelectedPhase(null)}
                       aria-label="Close phase details"
                     >
                       ✕
                     </button>
                  </div>
                  <p className="text-[10px] text-[#F5F5F5] font-black mb-8 uppercase tracking-[0.2em]">{selectedPhase.date_range}</p>
                  <p className="text-[#888] text-sm leading-snug font-medium mb-8">{selectedPhase.description}</p>
                  
                  <span className="text-[10px] text-[#4E88FF] font-bold uppercase tracking-widest mb-4 block">Key Facts</span>
                  <ul className="space-y-4 mb-8">
                    {selectedPhase.key_facts?.map((fact: string, i: number) => (
                      <li key={i} className="text-sm text-[#F5F5F5] font-medium flex gap-3 border-l-2 border-[#4E88FF] pl-4">
                         <span>{fact}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col gap-2">
                    <Button className="w-full flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#4E88FF] focus:ring-offset-2 focus:ring-offset-[#111]" onClick={handleAskGemini}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Learn More
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="w-full flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#4E88FF] focus:ring-offset-2 focus:ring-offset-[#111]" 
                      onClick={() => openWidget(`Write a short, engaging social media post sharing key facts about the ${selectedPhase.label} phase of the ${country.toUpperCase()} elections.`)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                      Share
                    </Button>
                    {selectedPhase.id === "election_day" && (
                      <Button 
                        variant="secondary" 
                        className="w-full flex items-center justify-center gap-2 mt-4 bg-amber-500 hover:bg-amber-600 text-black border-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#111]"
                        onClick={() => openWidget("Please help me find my local polling place.")}
                        aria-label="Find local polling place"
                      >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                       Find Local Polling Place
                      </Button>
                    )}
                  </div>

                  {phases && phases.length > 1 && (
                    <div className="mt-8">
                      <span className="text-[10px] text-[#4E88FF] font-bold uppercase tracking-widest mb-4 block">Related Phases</span>
                      <div className="flex flex-col gap-2">
                        {(() => {
                           const idx = phases.findIndex((p: any) => p.id === selectedPhase.id);
                           const related = [];
                           if (idx > 0) related.push(phases[idx - 1]);
                           if (idx < phases.length - 1) related.push(phases[idx + 1]);
                           return related.map(p => (
                             <button
                               key={p.id}
                               onClick={() => setSelectedPhase(p)}
                               className="text-left bg-[#1a1a1a] p-3 border border-[#333] hover:border-[#4E88FF] transition-colors rounded group focus:outline-none focus:ring-2 focus:ring-[#4E88FF] focus:ring-offset-2 focus:ring-offset-[#11a]"
                               aria-label={`View related phase: ${p.label}`}
                             >
                                <h4 className="text-[#F5F5F5] text-sm font-bold group-hover:text-[#4E88FF] transition-colors">{p.label}</h4>
                                <p className="text-[10px] text-[#888] tracking-widest uppercase mt-1">{p.date_range}</p>
                             </button>
                           ));
                        })()}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="text-5xl mb-4 font-black text-[#444]">{`//`}</div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[#888]">Select node to explore</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
