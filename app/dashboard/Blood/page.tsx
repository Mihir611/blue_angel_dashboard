"use client";

import Link from "next/link";
import { Plus, Phone, AlertCircle, MapPin, Activity } from "lucide-react";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import { recentBloodRequests } from "@/lib/mock/dashboardData";

const URGENCY_CONFIG: Record<string, { bg: string; border: string; text: string; pulse: boolean }> = {
  critical: { bg: "bg-red-500/10", border: "border-red-500/40", text: "text-red-400", pulse: true },
  urgent: { bg: "bg-orange-500/10", border: "border-orange-500/40", text: "text-orange-400", pulse: false },
  standard: { bg: "bg-slate-800/60", border: "border-slate-700", text: "text-slate-400", pulse: false },
};

export default function BloodRequestsPage() {
  return (
    <DashboardLayout title="Blood Requests" subTitle="Emergency rider donor registry & active dispatch">
      {/* Top Banner Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-500/30 bg-red-950/20 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-3 font-mono text-xs text-slate-300">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/40 bg-red-500/20 text-red-400 animate-pulse">
            <Activity size={18} />
          </div>
          <div>
            <span className="font-bold text-red-400">{recentBloodRequests.length} ACTIVE DISPATCHES</span>
            <p className="text-[10px] text-slate-400">// EMERGENCY DONOR PROTOCOL ONLINE</p>
          </div>
        </div>

        <Link
          href="/dashboard/Blood/create"
          className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]"
        >
          <Plus size={16} className="transition-transform duration-200 group-hover:rotate-90" />
          <span>Post Emergency Requirement</span>
        </Link>
      </div>

      {/* Grid of Emergency Requests */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recentBloodRequests.map((b) => {
          const urgencyStyle = URGENCY_CONFIG[b.urgency.toLowerCase()] || URGENCY_CONFIG.standard;

          return (
            <div
              key={b.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-xl transition-all duration-300 hover:border-red-500/50 hover:bg-slate-900/90 hover:shadow-[0_0_25px_rgba(239,68,68,0.15)]"
            >
              {/* Header: Blood Group & Urgency Pill */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/40 bg-gradient-to-br from-red-500/20 to-red-900/40 font-mono text-lg font-black text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.2)]">
                    {b.bloodGroup}
                  </div>

                  <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${urgencyStyle.bg} ${urgencyStyle.border} ${urgencyStyle.text}`}>
                    {urgencyStyle.pulse && <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />}
                    {b.urgency}
                  </div>
                </div>

                {/* Patient details */}
                <h3 className="mt-4 text-base font-bold text-slate-100 group-hover:text-red-400 transition-colors">
                  {b.patientName}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <MapPin size={13} className="text-red-400/80 shrink-0" />
                  <span className="truncate">{b.hospital}, {b.location}</span>
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-5 border-t border-slate-800/80 pt-3">
                <a
                  href={`tel:${b.organizerPhone || '#'}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-orange-400 transition-all hover:border-orange-500/50 hover:bg-orange-500 hover:text-slate-950"
                >
                  <Phone size={14} />
                  <span>Contact Organizer</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}