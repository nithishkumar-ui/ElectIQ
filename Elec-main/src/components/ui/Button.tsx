import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Button({ className, variant = "primary", size = "default", ...props }: any) {
  const base = "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-200 focus-visible:outline-none focus:ring-2 focus:ring-gold-400/50 focus:ring-offset-2 focus:ring-offset-navy-900 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] relative overflow-hidden group/btn";
  const variants = {
    primary: "bg-white text-black hover:bg-gold-400 hover:text-white hover:shadow-glow",
    secondary: "border border-[#333] text-white hover:border-gold-400/50 hover:shadow-[0_0_20px_rgba(78,136,255,0.1)]",
    ghost: "text-white/70 hover:bg-white/10 hover:text-white",
    gradient: "bg-gradient-to-r from-gold-400 to-accent-purple text-white hover:shadow-glow-lg border-0",
  };
  const sizes = {
    default: "h-11 px-6 py-3 text-[11px]",
    sm: "h-9 px-4 text-[10px]",
    lg: "h-14 px-8 text-[12px]",
    xl: "h-16 px-10 text-[13px]",
  };
  return (
    <button className={cn(base, variants[variant as keyof typeof variants], sizes[size as keyof typeof sizes], className)} {...props}>
      {/* Shine sweep on hover */}
      <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      <span className="relative z-10 flex items-center justify-center gap-2">{props.children}</span>
    </button>
  );
}
