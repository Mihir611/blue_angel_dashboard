"use client";

import { ReactNode } from "react";
import {
    AlertCircle,
    AlertTriangle,
    Info,
    CheckCircle2,
    X
} from "lucide-react";

export type AlertVariant = "error" | "warning" | "info" | "success";

export interface AlertProps {
    variant?: AlertVariant;
    title?: string;
    children: ReactNode;
    onClose?: () => void;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

const VARIANT_CONFIG = {
    error: {
        icon: AlertCircle,
        border: "border-red-500/40",
        bg: "bg-red-950/20",
        titleColor: "text-red-400",
        badgeBg: "bg-red-500/20 border-red-500/40 text-red-400",
        accentLine: "from-red-500 to-rose-600",
        glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]",
        code: "ERR_ALERT",
    },
    warning: {
        icon: AlertTriangle,
        border: "border-amber-500/40",
        bg: "bg-amber-950/20",
        titleColor: "text-amber-400",
        badgeBg: "bg-amber-500/20 border-amber-500/40 text-amber-400",
        accentLine: "from-amber-500 to-orange-500",
        glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
        code: "WARN_SIGNAL",
    },
    info: {
        icon: Info,
        border: "border-cyan-500/40",
        bg: "bg-cyan-950/20",
        titleColor: "text-cyan-400",
        badgeBg: "bg-cyan-500/20 border-cyan-500/40 text-cyan-400",
        accentLine: "from-cyan-500 to-blue-500",
        glow: "shadow-[0_0_20px_rgba(6,182,212,0.15)]",
        code: "SYS_INFO",
    },
    success: {
        icon: CheckCircle2,
        border: "border-emerald-500/40",
        bg: "bg-emerald-950/20",
        titleColor: "text-emerald-400",
        badgeBg: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400",
        accentLine: "from-emerald-500 to-teal-500",
        glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
        code: "SUCCESS_ACK",
    },
};

export default function Alert({
    variant = "info",
    title,
    children,
    onClose,
    action,
    className = "",
}: AlertProps) {
    const config = VARIANT_CONFIG[variant];
    const Icon = config.icon;

    return (
        <div
            role="alert"
            className={`relative overflow-hidden rounded-2xl border ${config.border} ${config.bg} p-4 backdrop-blur-xl transition-all duration-300 ${config.glow} ${className}`}
        >
            {/* Left Vertical Glowing Accent Bar */}
            <div
                className={`absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b ${config.accentLine}`}
            />

            <div className="flex items-start gap-3.5 pl-1">
                {/* Icon Badge */}
                <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${config.badgeBg}`}
                >
                    <Icon size={18} />
                </div>

                {/* Content Body */}
                <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
              // {config.code}
                        </span>
                        {title && (
                            <h4 className={`font-mono text-xs font-bold uppercase tracking-wider ${config.titleColor}`}>
                                {title}
                            </h4>
                        )}
                    </div>

                    <div className="mt-1 font-sans text-xs font-medium leading-relaxed text-slate-200">
                        {children}
                    </div>

                    {/* Action Button */}
                    {action && (
                        <div className="mt-3">
                            <button
                                type="button"
                                onClick={action.onClick}
                                className={`rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-200 transition-colors hover:border-slate-700 hover:text-white`}
                            >
                                {action.label}
                            </button>
                        </div>
                    )}
                </div>

                {/* Close Button */}
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Dismiss Alert"
                        className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-slate-200"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}