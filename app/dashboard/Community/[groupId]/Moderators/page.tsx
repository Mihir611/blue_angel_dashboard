"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
    ArrowLeft, 
    ShieldCheck, 
    UserPlus, 
    Search, 
    ShieldAlert, 
    Trash2, 
    Check, 
    Shield 
} from "lucide-react";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import Alert from "@/app/components/alerts/page";

interface Member {
    id: string;
    name: string;
    email: string;
    role: "commander" | "moderator" | "rider";
    joinedAt: string;
}

// Mock initial squad members
const INITIAL_MEMBERS: Member[] = [
    { id: "1", name: "Mihir", email: "mihir@motonomaad.com", role: "commander", joinedAt: "Jan 2025" },
    { id: "2", name: "Alex Mercer", email: "alex@rider.net", role: "moderator", joinedAt: "Mar 2025" },
    { id: "3", name: "Rohan Sharma", email: "rohan@highways.com", role: "rider", joinedAt: "May 2025" },
    { id: "4", name: "Vikram K", email: "vikram@adv-riders.in", role: "rider", joinedAt: "Jun 2025" },
    { id: "5", name: "Ananya Roy", email: "ananya@touring.org", role: "moderator", joinedAt: "Feb 2025" },
];

export default function GroupModeratorsPage({ params }: { params: { groupId: string } }) {
    const router = useRouter();
    const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
    const [searchQuery, setSearchQuery] = useState("");
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    // Promote rider to moderator
    function handlePromote(id: string) {
        setMembers((prev) =>
            prev.map((m) => (m.id === id ? { ...m, role: "moderator" } : m))
        );
        const member = members.find((m) => m.id === id);
        setAlertMessage(`Promoted ${member?.name || "Rider"} to Community Moderator.`);
    }

    // Demote moderator to rider
    function handleDemote(id: string) {
        setMembers((prev) =>
            prev.map((m) => (m.id === id ? { ...m, role: "rider" } : m))
        );
        const member = members.find((m) => m.id === id);
        setAlertMessage(`Revoked moderator permissions for ${member?.name || "Rider"}.`);
    }

    const filteredMembers = members.filter(
        (m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const moderatorsCount = members.filter((m) => m.role === "moderator").length;

    return (
        <DashboardLayout title="Squad Moderation" subTitle="Appoint and manage community moderators">
            {/* Floating Notification */}
            {alertMessage && (
                <div className="fixed bottom-6 right-6 z-50 w-full max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <Alert
                        variant="success"
                        title="Permission Updated"
                        onClose={() => setAlertMessage(null)}
                    >
                        {alertMessage}
                    </Alert>
                </div>
            )}

            {/* Top Navigation */}
            <button
                onClick={() => router.push("/dashboard/Community")}
                className="group mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 font-mono text-xs text-slate-400 transition-all hover:border-orange-500/50 hover:text-orange-400"
            >
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                <span>RETURN TO SQUADRON DIRECTORY</span>
            </button>

            {/* Header Telemetry Status Card */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-xl">
                <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.2)]">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-100">
                            Active Moderators ({moderatorsCount})
                        </h2>
                        <p className="font-mono text-[11px] text-slate-400">// SQUAD MODERATION MATRIX</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search rider name or email..."
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 pl-9 font-sans text-xs text-slate-100 placeholder-slate-500 outline-none transition-all focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                    />
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                </div>
            </div>

            {/* Roster Table Container */}
            <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                        {/* Table Header */}
                        <thead className="border-b border-slate-800/80 bg-slate-950/60 uppercase tracking-wider text-slate-400">
                            <tr>
                                <th className="px-6 py-4">Rider / Member</th>
                                <th className="px-6 py-4">Current Role</th>
                                <th className="px-6 py-4">Joined Squad</th>
                                <th className="px-6 py-4 text-right">Moderation Action</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-slate-800/50 text-slate-200">
                            {filteredMembers.map((member) => {
                                const isCommander = member.role === "commander";
                                const isModerator = member.role === "moderator";

                                return (
                                    <tr
                                        key={member.id}
                                        className="transition-colors hover:bg-slate-800/30"
                                    >
                                        {/* Rider Profile */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 font-bold text-orange-400">
                                                    {member.name.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-100">{member.name}</p>
                                                    <p className="text-[10px] text-slate-500">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role Badge */}
                                        <td className="px-6 py-4">
                                            {isCommander && (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                                                    <Shield size={12} /> COMMANDER
                                                </span>
                                            )}
                                            {isModerator && (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-bold text-orange-400">
                                                    <ShieldCheck size={12} /> MODERATOR
                                                </span>
                                            )}
                                            {!isCommander && !isModerator && (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950 px-2.5 py-0.5 text-[10px] text-slate-400">
                                                    RIDER
                                                </span>
                                            )}
                                        </td>

                                        {/* Joined Date */}
                                        <td className="px-6 py-4 text-slate-400">{member.joinedAt}</td>

                                        {/* Action Button */}
                                        <td className="px-6 py-4 text-right">
                                            {isCommander ? (
                                                <span className="text-[10px] text-slate-600">// PRIMARY ADMIN</span>
                                            ) : isModerator ? (
                                                <button
                                                    onClick={() => handleDemote(member.id)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-red-400 transition-colors hover:bg-red-500/20"
                                                >
                                                    <ShieldAlert size={12} /> Revoke Mod
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handlePromote(member.id)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-orange-400 transition-colors hover:bg-orange-500/20"
                                                >
                                                    <UserPlus size={12} /> Appoint Mod
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}