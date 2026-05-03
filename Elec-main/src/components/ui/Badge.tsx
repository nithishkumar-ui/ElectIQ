import React from "react";
import { cn } from "./Button";

export function Badge({ className, children, variant = "default" }: { className?: string; children: React.ReactNode; variant?: "default" | "gold" }) {
  const base = "px-2 py-1 text-[10px] uppercase font-bold tracking-widest shrink-0";
  const variants = {
    default: "text-[#4E88FF]",
    gold: "text-gold-400"
  };
  return <span className={cn(base, variants[variant], className)}>{children}</span>;
}
