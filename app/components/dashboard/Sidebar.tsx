"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    Users2, 
    Flag, 
    Megaphone, 
    Droplet, 
    ChevronLeft, 
    ChevronRight, 
    Shield
} from "lucide-react";
import { NavItem, SidebarProps } from "@/lib/api";
import pkg from "@/package.json";

const NAV_ITEMS: NavItem[] = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Community", href: "/dashboard/Community", icon: Users2 },
    { label: "Rides & Events", href: "/dashboard/Events", icon: Flag },
    { label: "Announcements", href: "/dashboard/Announcements", icon: Megaphone },
    { label: "Blood Requests", href: "/dashboard/Blood", icon: Droplet },
];

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
    const pathname = usePathname();

    return (
        <aside
            className={`relative flex h-screen flex-col border-r border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl transition-all duration-300 ease-in-out z-30 select-none ${
                collapsed ? "w-[72px]" : "w-[260px]"
            }`}
        >
            {/* --- BRAND / IGNITION HEADER --- */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 px-4">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-500/30 bg-slate-900/80 p-1 shadow-[0_0_12px_rgba(249,115,22,0.25)] transition-all hover:border-orange-500/60">
                        <Image
                            src="/logo.png"
                            alt="Motonomaad"
                            width={32}
                            height={32}
                            className="h-full w-full object-contain filter drop-shadow-[0_0_4px_rgba(249,115,22,0.4)]"
                            priority
                        />
                    </div>

                    {!collapsed && (
                        <div className="flex flex-col tracking-tight">
                            <span 
                                className="text-base tracking-wider uppercase text-slate-100 leading-tight"
                                style={{ fontFamily: "var(--font-black-ops-one), 'Black Ops One', cursive, sans-serif" }}
                            >
                                Moto<span className="text-orange-500">nomaad</span>
                            </span>
                            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
                                Rider OS v{pkg.version}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* --- NAVIGATION LINKS --- */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4 custom-scrollbar">
                {!collapsed && (
                    <div className="mb-2 px-2 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        System Navigation
                    </div>
                )}

                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-mono tracking-wide transition-all duration-200 ${
                                active
                                    ? "bg-gradient-to-r from-orange-500/20 to-orange-500/5 text-orange-400 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]"
                                    : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-200 hover:border hover:border-slate-800"
                            }`}
                        >
                            {active && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
                            )}

                            <Icon
                                size={18}
                                className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                                    active ? "text-orange-400" : "text-slate-400 group-hover:text-slate-200"
                                }`}
                            />

                            {!collapsed && (
                                <span className="truncate font-semibold uppercase tracking-wider">
                                    {item.label}
                                </span>
                            )}

                            {collapsed && (
                                <div className="pointer-events-none absolute left-full ml-3 z-50 hidden rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] font-mono text-slate-200 shadow-xl group-hover:block whitespace-nowrap">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* --- RIDER SYSTEM STATUS --- */}
            {!collapsed && (
                <div className="mx-3 mb-4 rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 font-mono text-[10px]">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                            <Shield size={12} /> ENCRYPTED
                        </span>
                        <span className="text-slate-500">SYS: OK</span>
                    </div>
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 w-3/4 rounded-full" />
                    </div>
                </div>
            )}

            {/* --- COLLAPSE TOGGLE BUTTON --- */}
            <button
                onClick={onToggle}
                className="absolute -right-3.5 top-20 flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 shadow-md transition-all duration-200 hover:border-orange-500 hover:bg-orange-500 hover:text-slate-950"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
        </aside>
    );
};

export default Sidebar;