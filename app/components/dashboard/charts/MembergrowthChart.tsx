"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { memberGrowthData } from "@/lib/mock/dashboardData";

// Custom Telemetry Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-3 font-mono text-xs shadow-2xl backdrop-blur-xl">
                <p className="mb-1 font-bold uppercase text-slate-400">// Month: {label}</p>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    <span className="text-slate-300">Total Riders:</span>
                    <span className="font-bold text-orange-400">{payload[0].value}</span>
                </div>
            </div>
        );
    }
    return null;
};

export default function MemberGrowthChart() {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-xl">
            {/* Top Header */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                            Rider Network Growth
                        </h3>
                    </div>
                    <p className="font-mono text-[10px] text-slate-500 mt-0.5">
                        // 6-Month registration telemetry
                    </p>
                </div>
                <div className="rounded-md border border-orange-500/30 bg-orange-500/10 px-2 py-1 font-mono text-[10px] text-orange-400">
                    +13.1% TREND
                </div>
            </div>

            {/* Chart Area */}
            <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={memberGrowthData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="memberGrowthGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                        dataKey="month" 
                        stroke="#64748b" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: "#64748b", fontFamily: "monospace" }}
                    />
                    <YAxis 
                        stroke="#64748b" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: "#64748b", fontFamily: "monospace" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="members"
                        stroke="#f97316"
                        strokeWidth={2.5}
                        fill="url(#memberGrowthGlow)"
                        dot={{ fill: "#f97316", r: 4, strokeWidth: 2, stroke: "#020617" }}
                        activeDot={{ r: 6, fill: "#f97316", stroke: "#ffffff", strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}