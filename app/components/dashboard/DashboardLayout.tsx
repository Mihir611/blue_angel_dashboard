"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { getToken, isTokenExpired, getStoredUser, clearToken } from "@/lib/auth-client";
import { StoredUser, DashboardLayoutProps } from "@/lib/api/interfaces";
import { LogOut, User, Settings, Shield, ChevronDown } from "lucide-react";

const DashboardLayout = ({ children, title, subTitle }: DashboardLayoutProps) => {
    const router = useRouter();
    const [checked, setChecked] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState<StoredUser | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token = getToken();
        if (!token || isTokenExpired(token)) {
            router.replace("/login?from=/dashboard");
            return;
        }
        setUser(getStoredUser());
        setChecked(true);
    }, [router]);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleLogout() {
        clearToken();
        router.push("/login");
    }

    if (!checked) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-slate-950 font-mono text-xs text-orange-400">
                <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-orange-500 animate-ping" />
                    AUTHENTICATING RIDER TELEMETRY...
                </div>
            </div>
        );
    }

    const initials = (user?.email || "?").slice(0, 2).toUpperCase();

    return (
        <div className="relative flex h-screen w-full overflow-hidden bg-slate-950 text-slate-100 antialiased">
            {/* Ambient Background Grid & Glows */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-black opacity-80" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:3rem_3rem]" />

            {/* Sidebar Component */}
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

            {/* Main Content Area */}
            <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* HUD Topbar */}
                <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-950/70 px-6 backdrop-blur-xl">
                    {/* Left: Section Header */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                            <h1 className="text-base font-bold tracking-tight text-slate-100 md:text-lg">
                                {title}
                            </h1>
                        </div>
                        {subTitle && (
                            <p className="font-mono text-[11px] text-slate-400">
                                // {subTitle}
                            </p>
                        )}
                    </div>

                    {/* Right: Quick Controls & Rider Profile Dropdown */}
                    <div className="flex items-center gap-4">
                        {/* Status Indicator */}
                        <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            LINK: ONLINE
                        </div>

                        {/* Search / Command Trigger */}
                        <button
                            type="button"
                            aria-label="Search"
                            className="hidden md:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 font-mono text-xs text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <span>Search routes...</span>
                            <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">⌘K</kbd>
                        </button>

                        <div className="h-4 w-[1px] bg-slate-800" />

                        {/* --- USER AVATAR & DROPDOWN MENU --- */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                type="button"
                                className="flex items-center gap-3 rounded-xl p-1 transition-all hover:bg-slate-900/80"
                            >
                                <div className="hidden text-right lg:block font-mono">
                                    <p className="text-xs font-bold text-slate-200 leading-tight">
                                        {user?.email?.split("@")[0] || "Rider"}
                                    </p>
                                    <p className="text-[10px] text-orange-400 uppercase tracking-wider">
                                        NOMAD CLASS 1
                                    </p>
                                </div>

                                <div className="relative group">
                                    <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 opacity-60 group-hover:opacity-100 blur-[2px] transition-opacity" />
                                    <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 font-mono text-xs font-bold text-orange-400 border border-slate-800">
                                        {initials}
                                    </div>
                                </div>

                                <ChevronDown
                                    size={14}
                                    className={`text-slate-400 transition-transform duration-200 ${
                                        menuOpen ? "rotate-180 text-orange-400" : ""
                                    }`}
                                />
                            </button>

                            {/* Dropdown Popup Panel */}
                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-50 font-mono">
                                    <div className="border-b border-slate-800/80 px-3 py-2.5">
                                        <p className="text-xs font-bold text-slate-200 truncate">
                                            {user?.email || "rider@motonomaad.com"}
                                        </p>
                                        <p className="text-[10px] text-orange-400 uppercase tracking-widest mt-0.5">
                                            // Telemetry Active
                                        </p>
                                    </div>

                                    <div className="py-1 space-y-0.5">
                                        <button
                                            type="button"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
                                        >
                                            <User size={14} className="text-slate-400" />
                                            <span>Rider Profile</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
                                        >
                                            <Settings size={14} className="text-slate-400" />
                                            <span>System Settings</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-300 hover:bg-slate-900 hover:text-white transition-colors"
                                        >
                                            <Shield size={14} className="text-emerald-400" />
                                            <span>Security & Keys</span>
                                        </button>
                                    </div>

                                    <div className="border-t border-slate-800/80 pt-1 mt-1">
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                        >
                                            <LogOut size={14} className="text-red-400" />
                                            <span>Disengage Session</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Dynamic Viewport */}
                <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;