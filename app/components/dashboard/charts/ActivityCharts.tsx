"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { activityData } from "@/lib/mock/dashboardData";

// Custom Telemetry Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-3 font-mono text-xs shadow-2xl backdrop-blur-xl">
                <p className="mb-1.5 font-bold uppercase text-slate-400">// Cycle: {label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={`item-${index}`} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-slate-300">{entry.name}:</span>
                        <span className="font-bold text-slate-100">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const ActivityChart = () => {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-xl">
            {/* Top Header */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                            Rides & Events Expedition Metrics
                        </h3>
                    </div>
                    <p className="font-mono text-[10px] text-slate-500 mt-0.5">
                        // Monthly telemetry distribution
                    </p>
                </div>
                <div className="rounded-md border border-slate-800 bg-slate-950/80 px-2 py-1 font-mono text-[10px] text-slate-400">
                    SYS: SYNCED
                </div>
            </div>

            {/* Chart Area */}
            <ResponsiveContainer width="100%" height={230}>
                <BarChart data={activityData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
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
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(249, 115, 22, 0.05)" }} />
                    <Legend 
                        wrapperStyle={{ 
                            fontSize: "11px", 
                            fontFamily: "monospace", 
                            paddingTop: "10px" 
                        }} 
                    />
                    <Bar 
                        dataKey="rides" 
                        fill="#f97316" 
                        radius={[6, 6, 0, 0]} 
                        name="Expeditions (Rides)" 
                    />
                    <Bar 
                        dataKey="events" 
                        fill="#10b981" 
                        radius={[6, 6, 0, 0]} 
                        name="Gatherings (Events)" 
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ActivityChart;