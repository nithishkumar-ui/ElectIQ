import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import ParticleField from "../components/timeline/ParticleField";

export default function NotFound() {
  return (
    <div className="relative h-screen bg-navy-900 flex flex-col items-center justify-center text-center overflow-hidden">
      <ParticleField dim={0.1} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
         <span className="font-display text-[180px] md:text-[250px] font-bold text-gold-400/5 leading-none select-none">404</span>
      </div>
      <div className="relative z-10 px-6">
        <h2 className="font-display text-4xl text-white mb-4">Page Not Found</h2>
        <p className="text-muted text-lg mb-8 max-w-md mx-auto">The link you followed may be broken, or the page may have been removed.</p>
        <Link to="/">
          <Button size="lg">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
