import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-navy-900">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-accent-purple flex items-center justify-center text-white font-black text-xs">
              E
            </div>
            <p className="font-display text-lg font-black text-white tracking-tight">
              ELECT<span className="text-gradient-gold">IQ</span>
            </p>
          </div>
          <p className="text-xs text-[#555]">An AI-powered civic education assistant · Strictly non-partisan</p>
          <p className="text-xs text-[#444]">© {new Date().getFullYear()} ElectIQ</p>
        </div>
      </div>
    </footer>
  );
}
