"use client";

import { useState } from "react";
import { 
    Users, 
    Flag, 
    Megaphone, 
    Droplet, 
    Plus, 
    MapPin, 
    Lock, 
    Globe, 
    Activity, 
    ChevronRight, 
    Radio,
    ShieldAlert
} from "lucide-react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import MemberGrowthChart from "../components/dashboard/charts/MembergrowthChart";
import ActivityChart from "../components/dashboard/charts/ActivityCharts";
import CreateGroupModal from "../components/dashboard/modals/CreateGroupModal";
import CreateRideModal from "../components/dashboard/modals/CreateRideModal";
import CreateAnnouncementModal from "../components/dashboard/modals/CreateAnnouncementModal";
import CreateBloodRequestModal from "../components/dashboard/modals/CreateBloodRequestModal";
import { recentGroups, recentRides, recentAnnouncements, recentBloodRequests } from "@/lib/mock/dashboardData";
import { QuickActionCardProps, FeedPanelProps } from "@/lib/api";

type ModalKey = "group" | "ride" | "announcement" | "blood" | null;

const URGENCY_STYLE: Record<string, { bg: string; text: string; border: string; pulse: boolean }> = {
    critical: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/40", pulse: true },
    urgent: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/40", pulse: false },
    standard: { bg: "bg-slate-800/60", text: "text-slate-400", border: "border-slate-700", pulse: false },
};

export default function DashboardOverviewPage() {
    const [openModal, setOpenModal] = useState<ModalKey>(null);

    return (
        <DashboardLayout title="Telemetry Overview" subTitle="Live system metrics & community dispatches">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    label="Total Members" 
                    value="702" 
                    delta="+92 this cycle" 
                    deltaTone="up" 
                    icon={<Users size={18} />} 
                />
                <StatCard 
                    label="Active Squadrons" 
                    value="38" 
                    delta="+4 this cycle" 
                    deltaTone="up" 
                    icon={<Users size={18} />} 
                />
                <StatCard 
                    label="Upcoming Expeditions" 
                    value="12" 
                    delta="3 on radar" 
                    deltaTone="neutral" 
                    icon={<Flag size={18} />} 
                />
                <StatCard 
                    label="Emergency Dispatches" 
                    value="2" 
                    delta="1 Critical SOS" 
                    deltaTone="down" 
                    icon={<Droplet size={18} />} 
                />
            </div>

            {/* Performance Analytics Charts */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-1 backdrop-blur-xl">
                    <MemberGrowthChart />
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-1 backdrop-blur-xl">
                    <ActivityChart />
                </div>
            </div>

            {/* Tactical Quick Actions */}
            <div className="mt-8">
                <div className="mb-3 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                    <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
                        // Quick Command Actions
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <QuickActionCard
                        icon={<Users size={20} />}
                        label="Form a Squad"
                        description="Charter a new riding crew"
                        onClick={() => setOpenModal("group")}
                    />
                    <QuickActionCard
                        icon={<Flag size={20} />}
                        label="Dispatch Ride"
                        description="Publish route & rally info"
                        onClick={() => setOpenModal("ride")}
                    />
                    <QuickActionCard
                        icon={<Megaphone size={20} />}
                        label="Post Broadcast"
                        description="Share news with community"
                        onClick={() => setOpenModal("announcement")}
                    />
                    <QuickActionCard
                        icon={<Droplet size={20} />}
                        label="Emergency SOS"
                        description="Request urgent blood donors"
                        onClick={() => setOpenModal("blood")}
                        accentColor="red"
                    />
                </div>
            </div>

            {/* Live Feed Panels Grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Groups Feed */}
                <FeedPanel title="Registered Squadrons" onAdd={() => setOpenModal("group")}>
                    <div className="divide-y divide-slate-800/60">
                        {recentGroups.map((g) => (
                            <div 
                                key={g.id} 
                                className="group flex items-center justify-between py-3 transition-colors hover:bg-slate-800/30 px-2 rounded-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-orange-500/30 bg-orange-500/10 font-mono text-xs font-bold text-orange-400">
                                        {g.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-sans text-sm font-bold text-slate-200 group-hover:text-orange-400 transition-colors">
                                            {g.name}
                                        </p>
                                        <p className="font-mono text-[11px] text-slate-500">
                                            {g.members} RIDERS ENROLLED
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="rounded-full border border-slate-800 bg-slate-950/80 p-1.5 text-slate-400">
                                        {g.isPrivate ? <Lock size={13} className="text-amber-400" /> : <Globe size={13} className="text-emerald-400" />}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </FeedPanel>

                {/* Rides & Events Feed */}
                <FeedPanel title="Expedition Radar" onAdd={() => setOpenModal("ride")}>
                    <div className="divide-y divide-slate-800/60">
                        {recentRides.map((r) => {
                            const isEvent = r.type === "event";
                            return (
                                <div 
                                    key={r.id} 
                                    className="group flex items-center justify-between py-3 transition-colors hover:bg-slate-800/30 px-2 rounded-xl"
                                >
                                    <div className="space-y-0.5">
                                        <p className="font-sans text-sm font-bold text-slate-200 group-hover:text-orange-400 transition-colors">
                                            {r.title}
                                        </p>
                                        <p className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                                            <MapPin size={12} className="text-orange-500 shrink-0" />
                                            <span>{r.location} · {r.date}</span>
                                        </p>
                                    </div>
                                    <span
                                        className={`rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ${
                                            isEvent
                                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                                : "border-orange-500/30 bg-orange-500/10 text-orange-400"
                                        }`}
                                    >
                                        {r.type}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </FeedPanel>

                {/* Announcements Feed */}
                <FeedPanel title="System Broadcasts" onAdd={() => setOpenModal("announcement")}>
                    <div className="divide-y divide-slate-800/60">
                        {recentAnnouncements.map((a) => (
                            <div 
                                key={a.id} 
                                className="group flex items-center justify-between py-3 transition-colors hover:bg-slate-800/30 px-2 rounded-xl"
                            >
                                <div className="space-y-0.5">
                                    <p className="font-sans text-sm font-bold text-slate-200 group-hover:text-orange-400 transition-colors">
                                        {a.title}
                                    </p>
                                    <p className="font-mono text-[11px] text-slate-500">
                                        BROADCASTED // {a.postedAt}
                                    </p>
                                </div>
                                <Radio size={14} className="text-orange-500/70" />
                            </div>
                        ))}
                    </div>
                </FeedPanel>

                {/* Blood Requests Feed */}
                <FeedPanel title="Emergency Donor SOS" onAdd={() => setOpenModal("blood")}>
                    <div className="divide-y divide-slate-800/60">
                        {recentBloodRequests.map((b) => {
                            const style = URGENCY_STYLE[b.urgency.toLowerCase()] || URGENCY_STYLE.standard;
                            return (
                                <div 
                                    key={b.id} 
                                    className="group flex items-center justify-between py-3 transition-colors hover:bg-slate-800/30 px-2 rounded-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/40 bg-red-500/10 font-mono text-xs font-black text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.2)]">
                                            {b.bloodGroup}
                                        </div>
                                        <div>
                                            <p className="font-sans text-sm font-bold text-slate-200 group-hover:text-red-400 transition-colors">
                                                {b.patientName}
                                            </p>
                                            <p className="font-mono text-[11px] text-slate-400 truncate max-w-[180px] sm:max-w-xs">
                                                {b.hospital}, {b.location}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${style.bg} ${style.border} ${style.text}`}
                                    >
                                        {style.pulse && <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />}
                                        {b.urgency}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </FeedPanel>
            </div>

            {/* Modal Dialog Overlays */}
            <CreateGroupModal open={openModal === "group"} onClose={() => setOpenModal(null)} />
            <CreateRideModal open={openModal === "ride"} onClose={() => setOpenModal(null)} />
            <CreateAnnouncementModal open={openModal === "announcement"} onClose={() => setOpenModal(null)} />
            <CreateBloodRequestModal open={openModal === "blood"} onClose={() => setOpenModal(null)} />
        </DashboardLayout>
    );
};

// --- HIGH-TECH QUICK ACTION CARD COMPONENT ---
const QuickActionCard = ({ icon, label, description, onClick, accentColor = "orange" }: QuickActionCardProps) => {
    const isRed = accentColor === "red";

    return (
        <button
            onClick={onClick}
            type="button"
            className={`group relative flex items-start gap-3.5 rounded-2xl border bg-slate-900/50 p-4 text-left backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${
                isRed 
                    ? "border-red-500/30 hover:border-red-500/60 hover:bg-slate-900/90 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]" 
                    : "border-slate-800/80 hover:border-orange-500/40 hover:bg-slate-900/90 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]"
            }`}
        >
            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-110 ${
                    isRed
                        ? "border-red-500/30 bg-red-500/10 text-red-400"
                        : "border-orange-500/30 bg-orange-500/10 text-orange-400"
                }`}
            >
                {icon}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-slate-100 group-hover:text-orange-400 transition-colors">
                        {label}
                    </p>
                    <ChevronRight size={14} className="text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-orange-400" />
                </div>
                <p className="mt-1 font-sans text-xs text-slate-400 leading-snug">
                    {description}
                </p>
            </div>
        </button>
    );
};

// --- HIGH-TECH FEED PANEL CONTAINER COMPONENT ---
const FeedPanel = ({ title, onAdd, children }: FeedPanelProps) => {
    return (
        <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-xl">
            <div>
                {/* Panel Header */}
                <div className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                            {title}
                        </h3>
                    </div>

                    <button
                        onClick={onAdd}
                        type="button"
                        className="flex items-center gap-1 rounded-lg border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-orange-400 transition-all hover:bg-orange-500/20 hover:border-orange-500/60"
                    >
                        <Plus size={12} />
                        <span>Add</span>
                    </button>
                </div>

                {/* Panel Items List */}
                <div>{children}</div>
            </div>
        </div>
    );
};