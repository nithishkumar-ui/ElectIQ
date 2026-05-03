import React from "react";
import { cn } from "./Button";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("bg-[#111] border border-[#222] overflow-hidden", className)}>{children}</div>;
}
