"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { DashboardModalProps } from "@/lib/api";

const Modal = ({ open, onClose, title, children }: DashboardModalProps) => {
    // Handle Escape key & body scroll lock
    useEffect(() => {
        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }

        if (open) {
            document.addEventListener("keydown", handleEsc);
            // Lock body scroll when modal is active
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Animated Backdrop Blur Overlay */}
            <div
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Dialog Glassmorphic Window */}
            <div
                className="relative z-10 flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/90 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
            >
                {/* Glowing Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-80" />

                {/* Modal Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-slate-800/80 px-6 py-4 bg-slate-950/50">
                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-100">
                            // {title}
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-slate-100"
                        aria-label="Close modal"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Modal Content Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar text-slate-200 font-sans text-sm">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;