"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, MapPin, Calendar, Navigation, Flag, Loader2 } from "lucide-react";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import { Events, getEvents } from "@/lib/api";

const CATEGORY_STYLES: Record<string, string> = {
	Adventure: "border-orange-500/30 bg-orange-500/10 text-orange-400",
	hangout: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
	"breakfast-ride": "border-amber-500/30 bg-amber-500/10 text-amber-400",
	"lunch-ride": "border-amber-500/30 bg-amber-500/10 text-amber-400",
	"dinner-ride": "border-amber-500/30 bg-amber-500/10 text-amber-400",
	touring: "border-sky-500/30 bg-sky-500/10 text-sky-400",
	racing: "border-red-500/30 bg-red-500/10 text-red-400",
	other: "border-slate-500/30 bg-slate-500/10 text-slate-400",
};

function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

export default function RidesPage() {
	const [events, setEvents] = useState<Events[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		async function fetchEvents() {
			setLoading(true);
			setError(null);
			try {
				const res = await getEvents();
				if (!cancelled) {
					if (res.success) {
						setEvents(res.data);
					} else {
						setError(res.message || "Failed to load expeditions.");
					}
				}
			} catch (err: any) {
				if (!cancelled) {
					setError(
						err?.response?.data?.message ||
						err?.message ||
						"Failed to load expeditions."
					);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		fetchEvents();
		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<DashboardLayout title="Rides & Events" subTitle="Expeditions, rallies & track days">
			{/* Header Controls */}
			<div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 backdrop-blur-xl">
				<div className="flex items-center gap-3 font-mono text-xs text-slate-400">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-400">
						<Flag size={16} />
					</div>
					<div>
						<span className="font-bold text-slate-200">
							{loading ? "..." : events.length} SCHEDULED EXPEDITIONS
						</span>
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

			{/* Loading state */}
			{loading && (
				<div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-10 font-mono text-xs text-slate-400">
					<Loader2 size={16} className="animate-spin text-orange-500" />
					<span>SCANNING RADAR FOR EXPEDITIONS...</span>
				</div>
			)}

			{/* Error state */}
			{!loading && error && (
				<div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 font-mono text-xs text-red-400">
					[RADAR ERROR]: {error}
				</div>
			)}

			{/* Empty state */}
			{!loading && !error && events.length === 0 && (
				<div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-10 text-center font-mono text-xs text-slate-400">
					No expeditions on the radar yet. Be the first to dispatch one.
				</div>
			)}

			{/* Grid of Expeditions */}
			{!loading && !error && events.length > 0 && (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{events.map((r) => (
						<div
							key={r._id}
							className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-xl transition-all duration-300 hover:border-orange-500/40 hover:bg-slate-900/80 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]"
						>
							<div>
								<div className="flex items-center justify-between">
									<span
										className={`rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ${CATEGORY_STYLES[r.category] || CATEGORY_STYLES.other
											}`}
									>
										{r.category}
									</span>

									<span className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
										<Calendar size={12} />
										{formatDate(r.eventDate)}
									</span>
								</div>

								<h3 className="mt-4 text-base font-bold text-slate-100 group-hover:text-orange-400 transition-colors">
									{r.title}
								</h3>

								<p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
									<MapPin size={13} className="text-orange-500 shrink-0" />
									<span className="truncate">
										{r.location.city}, {r.location.state}
									</span>
								</p>
							</div>

							<div className="mt-5 border-t border-slate-800/80 pt-3">
								<Link
									href={`/dashboard/Events/${r._id}`}
									className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 py-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors hover:border-orange-500/50 hover:text-orange-400"
								>
									<Navigation size={13} />
									<span>Edit Expedition</span>
								</Link>
							</div>
						</div>
					))}
				</div>
			)}
		</DashboardLayout>
	);
}