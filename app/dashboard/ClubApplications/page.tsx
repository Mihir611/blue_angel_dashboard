'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Clock, RefreshCw } from "lucide-react";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import { CommunityApplication, getApplications } from "@/lib/api";

export default function CommunityApplicationsPage() {
    const [applications, setApplications] = useState<CommunityApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getApplications();
            setApplications(res.data.applications)
        } catch (err) {
            console.error(err);
            setError('Failed to load applications.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    return (
        <DashboardLayout title="Community Applications">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/communities"
                            className="flex items-center justify-center w-9 h-9 rounded border border-[#2A2A2A] bg-[#1A1A1A] text-slate-400 hover:text-[#FF6B1A] hover:border-[#FF6B1A] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-mono font-semibold text-[#FF6B1A] tracking-wide">
                                COMMUNITY APPLICATIONS
                            </h1>
                            <p className="text-sm text-slate-500 font-mono">
                                {applications.length} pending review{applications.length === 1 ? '' : 's'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={fetchApplications}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 rounded border border-[#2A2A2A] bg-[#1A1A1A] text-sm font-mono text-slate-400 hover:text-[#FF6B1A] hover:border-[#FF6B1A] transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        REFRESH
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="rounded border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm font-mono text-red-400">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading && applications.length === 0 && (
                    <div className="rounded border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-12 text-center text-sm font-mono text-slate-500">
                        Loading applications...
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && applications.length === 0 && (
                    <div className="rounded border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-12 text-center">
                        <Building2 className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                        <p className="text-sm font-mono text-slate-500">No pending applications right now.</p>
                    </div>
                )}

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {applications.map((app) => (
                        <Link
                            key={app.applicationId}
                            href={`/dashboard/communities/applications/${app.applicationId}`}
                            className="group rounded border border-[#2A2A2A] bg-[#1A1A1A] p-4 hover:border-[#FF6B1A] transition-colors"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded bg-[#0D0D0D] border border-[#2A2A2A] flex items-center justify-center shrink-0 overflow-hidden">
                                        {app.logo ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={app.logo} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <Building2 className="w-5 h-5 text-slate-500" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-mono font-medium text-slate-100 truncate group-hover:text-[#FF6B1A] transition-colors">
                                            {app.communityName}
                                        </h3>
                                        <p className="text-xs font-mono text-slate-500 truncate">{app.applicationId}</p>
                                    </div>
                                </div>
                                <span className="shrink-0 px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wide bg-yellow-900/30 text-yellow-500 border border-yellow-900/50">
                                    {app.status}
                                </span>
                            </div>

                            <p className="mt-3 text-sm text-slate-400 line-clamp-2">{app.description}</p>

                            <div className="mt-4 flex items-center gap-4 text-xs font-mono text-slate-500">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {app.location?.city}, {app.location?.state}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {new Date(app.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </Link>
                    ))}

                </div>
            </div>
        </DashboardLayout>
    )
}