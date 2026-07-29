"use client";

import Link from "next/link";
import { Plus, Megaphone, Calendar, ArrowRight, ShieldAlert } from "lucide-react";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import { recentAnnouncements } from "@/lib/mock/dashboardData";

export default function AnnouncementsPage() {
  return (
    <DashboardLayout title="Announcements" subTitle="Important system & community broadcasts">
      {/* Header Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-400">
            <Megaphone size={16} />
          </div>
          <div>
            <span className="font-bold text-slate-200">{recentAnnouncements.length} BROADCASTS</span>
            <p className="text-[10px] text-slate-500">// ACTIVE COMMUNITY DIRECTIVES</p>
          </div>
        </div>

        <Link
          href="/dashboard/Announcements/create"
          className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
        >
          <Plus size={16} className="transition-transform duration-200 group-hover:rotate-90" />
          <span>New Broadcast</span>
        </Link>
      </div>

      {/* Broadcast Feed */}
      <div className="space-y-4">
        {recentAnnouncements.map((a) => (
          <div
            key={a.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-xl transition-all duration-300 hover:border-orange-500/40 hover:bg-slate-900/80 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-amber-500 opacity-80" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 font-mono text-[9px] font-bold text-orange-400 uppercase tracking-widest">
                    SYSTEM NOTICE
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                    <Calendar size={12} />
                    {a.postedAt}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100 transition-colors group-hover:text-orange-400">
                  {a.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-1.5 font-mono text-xs text-slate-300 transition-colors hover:border-orange-500/50 hover:text-orange-400"
                >
                  <span>Read Full</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}