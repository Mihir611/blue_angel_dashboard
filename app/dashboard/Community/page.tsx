"use client";

import Link from "next/link";
import { Plus, Lock, Globe, Users, ShieldCheck } from "lucide-react";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import { recentGroups } from "@/lib/mock/dashboardData";

export default function GroupsPage() {
  return (
    <DashboardLayout title="Groups" subTitle="Riding crews, local chapters & nomad squads">
      {/* Header Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-400">
            <Users size={16} />
          </div>
          <div>
            <span className="font-bold text-slate-200">{recentGroups.length} SQUAD SQUADRONS</span>
            <p className="text-[10px] text-slate-500">// REGISTERED CREWS & CLUBS</p>
          </div>
        </div>

        <Link
          href="/dashboard/Community/create"
          className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
        >
          <Plus size={16} className="transition-transform duration-200 group-hover:rotate-90" />
          <span>Form New Squad</span>
        </Link>
      </div>

      {/* Grid of Squads */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recentGroups.map((g) => (
          <div
            key={g.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-xl transition-all duration-300 hover:border-orange-500/40 hover:bg-slate-900/80 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 font-mono text-base font-black text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.15)]">
                  {g.name.slice(0, 2).toUpperCase()}
                </div>

                <div className="flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950/80 px-2.5 py-1 font-mono text-[10px] text-slate-400">
                  {g.isPrivate ? (
                    <>
                      <Lock size={12} className="text-amber-400" />
                      <span>PRIVATE</span>
                    </>
                  ) : (
                    <>
                      <Globe size={12} className="text-emerald-400" />
                      <span>PUBLIC</span>
                    </>
                  )}
                </div>
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-100 group-hover:text-orange-400 transition-colors">
                {g.name}
              </h3>

              <div className="mt-2 flex items-center gap-2 font-mono text-xs text-slate-400">
                <Users size={14} className="text-slate-500" />
                <span>{g.members} RIDERS ENROLLED</span>
              </div>
            </div>

            {/* Action Buttons Footer */}
            <div className="mt-5 border-t border-slate-800/80 pt-3 flex items-center gap-2">
              <button
                type="button"
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950/80 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
              >
                Access Telemetry
              </button>

              {/* Admin Moderator Management Button */}
              <Link
                href={`/dashboard/Community/${g.id}/Moderators`}
                className="flex items-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-orange-400 transition-all hover:bg-orange-500/20 hover:border-orange-500/60"
                title="Manage Squad Moderators"
              >
                <ShieldCheck size={14} />
                <span className="hidden xl:inline">Mods</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}