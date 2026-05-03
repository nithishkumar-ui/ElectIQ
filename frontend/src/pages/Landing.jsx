import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { ArrowRight, BookOpen, ShieldCheck, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

function AnimatedSphere() {
  return (
    <Sphere visible args={[1, 100, 200]} scale={2}>
      <MeshDistortMaterial 
        color="#22c55e" 
        attach="material" 
        distort={0.4} 
        speed={1.5} 
        roughness={0.2}
      />
    </Sphere>
  );
}

export default function Landing() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 2, 5]} intensity={1} />
            <AnimatedSphere />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold leading-tight"
            >
              Demystify <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
                Elections
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-slate-300 max-w-lg"
            >
              ElectIQ is your AI-powered civic education assistant. Understand voting processes, learn about democratic systems, and test your knowledge.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <Link to="/explore" className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                Start Exploring <ArrowRight size={20} />
              </Link>
              <Link to="/quiz" className="px-8 py-4 glass-panel hover:bg-white/10 rounded-full font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2">
                Take a Quiz
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-dark-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why use ElectIQ?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">We make learning about civic duties engaging, objective, and interactive.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="w-10 h-10 text-primary-500" />}
              title="Objective Information"
              desc="Get strictly non-partisan, factual data about election mechanics without political bias."
            />
            <FeatureCard 
              icon={<BookOpen className="w-10 h-10 text-primary-500" />}
              title="Interactive Guides"
              desc="Visualize complex election timelines and processes from around the globe."
            />
            <FeatureCard 
              icon={<Trophy className="w-10 h-10 text-primary-500" />}
              title="Gamified Learning"
              desc="Take quizzes, earn civic score points, and climb the global leaderboard."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
      <div className="bg-primary-500/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
