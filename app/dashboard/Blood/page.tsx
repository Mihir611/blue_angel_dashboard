"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Phone, AlertCircle, MapPin, Activity, Loader2 } from "lucide-react";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import { getBloodRequests, BloodRequestPayload } from "@/lib/api";

type RequestStatus = "active" | "fulfilled" | "expired" | "cancelled";
type BloodRequestRecord = BloodRequestPayload & {
	_id: string;
	status: RequestStatus;
	requestId: string;
	respondersCount?: number;
};

const URGENCY_CONFIG: Record<string, { bg: string; border: string; text: string; pulse: boolean }> = {
	critical: { bg: "bg-red-500/10", border: "border-red-500/40", text: "text-red-400", pulse: true },
	urgent: { bg: "bg-orange-500/10", border: "border-orange-500/40", text: "text-orange-400", pulse: false },
	normal: { bg: "bg-slate-800/60", border: "border-slate-700", text: "text-slate-400", pulse: false },
};

const STATUS_CONFIG: Record<RequestStatus, { bg: string; text: string; label: string }> = {
	active: { bg: "bg-emerald-500/10 border-emerald-500/40", text: "text-emerald-400", label: "Active" },
	fulfilled: { bg: "bg-sky-500/10 border-sky-500/40", text: "text-sky-400", label: "Fulfilled" },
	expired: { bg: "bg-slate-700/40 border-slate-600", text: "text-slate-400", label: "Expired" },
	cancelled: { bg: "bg-slate-700/40 border-slate-600", text: "text-slate-500", label: "Cancelled" },
};

const STATUS_FILTERS: { value: RequestStatus | "all"; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "active", label: "Active" },
	{ value: "fulfilled", label: "Fulfilled" },
	{ value: "expired", label: "Expired" },
	{ value: "cancelled", label: "Cancelled" },
];



export default function BloodRequestsPage() {
	const [requests, setRequests] = useState<BloodRequestRecord[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
	const [updatingId, setUpdatingId] = useState<string | null>(null);

	const fetchRequests = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			// No bloodGroup filter -> all blood groups returned.
			// No city filter -> city left empty, so results aren't scoped to any location.
			const res = await getBloodRequests({
				status: statusFilter === "all" ? undefined : statusFilter,
				limit: 48,
			});
			setRequests((res.data.bloodRequests as BloodRequestRecord[]) || []);
		} catch (err: any) {
			setError(err?.response?.data?.message || "Couldn't load blood requests.");
		} finally {
			setLoading(false);
		}
	}, [statusFilter]);

	useEffect(() => {
		fetchRequests();
	}, [fetchRequests]);

	return (
		<DashboardLayout title="Blood Requests" subTitle="Emergency rider donor registry & active dispatch">
			{/* Top Banner Controls */}
			<div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-500/30 bg-red-950/20 p-4 backdrop-blur-xl">
				<div className="flex items-center gap-3 font-mono text-xs text-slate-300">
					<div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/40 bg-red-500/20 text-red-400 animate-pulse">
						<Activity size={18} />
					</div>
					<div>
						{/* <span className="font-bold text-red-400">{activeCount} ACTIVE DISPATCHES</span> */}
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

			{/* Status Filter Tabs */}
			<div className="mb-6 flex flex-wrap gap-2">
				{STATUS_FILTERS.map((f) => (
					<button
						key={f.value}
						onClick={() => setStatusFilter(f.value)}
						className={`rounded-lg border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors ${statusFilter === f.value
								? "border-red-500/50 bg-red-500/20 text-red-400"
								: "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
							}`}
					>
						{f.label}
					</button>
				))}
			</div>

			{/* Error Banner */}
			{error && (
				<div className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 font-mono text-xs text-red-400">
					<span>[FEED ERROR]: {error}</span>
				</div>
			)}

			{/* Loading State */}
			{loading ? (
				<div className="flex items-center justify-center gap-2 py-16 font-mono text-xs text-slate-500">
					<Loader2 size={16} className="animate-spin" />
					<span>Loading dispatch feed...</span>
				</div>
			) : requests.length === 0 ? (
				<div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-10 text-center font-mono text-xs text-slate-500">
					No blood requests match this filter.
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{requests.map((b) => {
						const urgencyStyle = URGENCY_CONFIG[b.urgency] || URGENCY_CONFIG.normal;
						const statusStyle = STATUS_CONFIG[b.status];

						return (
							<div
								key={b._id}
								className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-xl transition-all duration-300 hover:border-red-500/50 hover:bg-slate-900/90 hover:shadow-[0_0_25px_rgba(239,68,68,0.15)]"
							>
								<div>
									<div className="flex items-start justify-between">
										<div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/40 bg-gradient-to-br from-red-500/20 to-red-900/40 font-mono text-lg font-black text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.2)]">
											{b.bloodGroup}
										</div>

										<div className="flex flex-col items-end gap-1.5">
											<div
												className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${urgencyStyle.bg} ${urgencyStyle.border} ${urgencyStyle.text}`}
											>
												{urgencyStyle.pulse && (
													<span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />
												)}
												{b.urgency}
											</div>

											{/* {isAdmin ? (
												<select
													value={b.status}
													disabled={updatingId === b._id}
													onChange={(e) =>
														handleStatusChange(b._id, e.target.value as RequestStatus)
													}
													className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text} bg-slate-950 disabled:opacity-50`}
												>
													{Object.entries(STATUS_CONFIG).map(([value, cfg]) => (
														<option key={value} value={value}>
															{cfg.label}
														</option>
													))}
												</select>
											) : (
												<span
													className={`rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text}`}
												>
													{statusStyle.label}
												</span>
											)} */}
										</div>
									</div>

									<h3 className="mt-4 text-base font-bold text-slate-100 group-hover:text-red-400 transition-colors">
										{b.patientName}
									</h3>
									<p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
										<MapPin size={13} className="text-red-400/80 shrink-0" />
										<span className="truncate">
											{b.hospital.name}, {b.hospital.city}
										</span>
									</p>
									<p className="mt-1 text-[11px] text-slate-500 font-mono">
										{b.unitsRequired} unit{b.unitsRequired > 1 ? "s" : ""} · Req. by{" "}
										{new Date(b.requiredBy).toLocaleString("en-IN", {
											day: "2-digit",
											month: "short",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</p>
								</div>

								<div className="mt-5 flex gap-2 border-t border-slate-800/80 pt-3">
									<a
										href={`tel:${b.contactNumber}`}
										className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-orange-400 transition-all hover:border-orange-500/50 hover:bg-orange-500 hover:text-slate-950"
									>
										<Phone size={14} />
										<span>Contact</span>
									</a>

									{/* {isAdmin && (
                                        <Link
                                            href={`/dashboard/Blood/${b._id}/edit`}
                                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-400 transition-all hover:border-red-500/50 hover:text-red-400"
                                        >
                                            <Pencil size={14} />
                                        </Link>
                                    )} */}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</DashboardLayout>
	);
}