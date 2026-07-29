"use client";

import Link from "next/link";
import { Plus, MapPin, Calendar, Navigation, Flag } from "lucide-react";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import { recentRides } from "@/lib/mock/dashboardData";

export default function RidesPage() {
  return (
    <DashboardLayout title="Rides & Events" subTitle="Expeditions, rallies & track days">
      {/* Header Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-400">
            <Flag size={16} />
          </div>
          <div>
            <span className="font-bold text-slate-200">{recentRides.length} SCHEDULED EXPEDITIONS</span>
            <p className="text-[10px] text-slate-500">// UPCOMING RADAR DISPATCHES</p>
          </div>
        </div>

        <Link
          href="/dashboard/Events/create"
          className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
        >
          <Plus size={16} className="transition-transform duration-200 group-hover:rotate-90" />
          <span>Host Ride / Event</span>
        </Link>
      </div>

      {/* Grid of Expeditions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recentRides.map((r) => {
          const isEvent = r.type === "event";

          return (
            <div
              key={r.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-xl transition-all duration-300 hover:border-orange-500/40 hover:bg-slate-900/80 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ${
                      isEvent
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-orange-500/30 bg-orange-500/10 text-orange-400"
                    }`}
                  >
                    {r.type}
                  </span>

                  <span className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
                    <Calendar size={12} />
                    {r.date}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-100 group-hover:text-orange-400 transition-colors">
                  {r.title}
                </h3>

                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <MapPin size={13} className="text-orange-500 shrink-0" />
                  <span className="truncate">{r.location}</span>
                </p>
              </div>

              <div className="mt-5 border-t border-slate-800/80 pt-3">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 py-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors hover:border-orange-500/50 hover:text-orange-400"
                >
                  <Navigation size={13} />
                  <span>View Route GPS</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}