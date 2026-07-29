"use client";

import { StatCardProps } from "@/lib/api";

const StatCard = ({ label, value, delta, deltaTone = "neutral", icon }: StatCardProps) => {
    // Futuristic tone colors for delta metrics
    const deltaStyles = {
        up: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        down: "border-red-500/30 bg-red-500/10 text-red-400",
        neutral: "border-slate-800 bg-slate-900/60 text-slate-400",
    }[deltaTone] || "border-slate-800 bg-slate-900/60 text-slate-400";

    const deltaIcon = deltaTone === "up" ? "▲" : deltaTone === "down" ? "▼" : "•";

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-xl transition-all duration-300 hover:border-orange-500/40 hover:bg-slate-900/80 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]">
            {/* Ambient Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Header: Label & Icon */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500/80 group-hover:animate-ping" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {label}
                    </span>
                </div>

                {icon && (
                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.1)] transition-transform duration-300 group-hover:scale-110 group-hover:border-orange-500/40 group-hover:text-orange-300">
                        {icon}
                    </div>
                )}
            </div>

            {/* Metric Value */}
            <div className="mt-3 flex items-baseline justify-between gap-2">
                <div className="font-sans text-2xl md:text-3xl font-black tracking-tight text-slate-100">
                    {value}
                </div>
            </div>

            {/* Footer: Delta / Trend Badge */}
            {delta && (
                <div className="mt-3 flex items-center gap-2">
                    <div className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide ${deltaStyles}`}>
                        <span>{deltaIcon}</span>
                        <span>{delta}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">vs previous cycle</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;