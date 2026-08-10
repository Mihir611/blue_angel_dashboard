"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Lock, Globe, Users, ShieldCheck, Loader2 } from "lucide-react";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import { getCommunities, Community } from "@/lib/api";

const PAGE_LIMIT = 12;

export default function GroupsPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false); // guards against duplicate fetches from rapid observer fires

  const loadPage = useCallback(async (pageToLoad: number) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const res = await getCommunities({ page: pageToLoad, limit: PAGE_LIMIT });
      setCommunities((prev) =>
        pageToLoad === 1 ? res.data.communities : [...prev, ...res.data.communities]
      );
      setTotalPages(res.totalPages);
      setPage(pageToLoad);
    } catch (err) {
      setError("Failed to load squadrons. Please try again.");
    } finally {
      setLoading(false);
      setInitialLoading(false);
      loadingRef.current = false;
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  // Infinite scroll: observe sentinel, load next page when it enters view
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const hasMore = totalPages === null || page < totalPages;
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          loadPage(page + 1);
        }
      },
      { rootMargin: "200px" } // start fetching a bit before it's fully in view
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [page, totalPages, loadPage]);

  const hasMore = totalPages === null || page < totalPages;

  function getInitials(name: string): string {
    const trimmed = name.trim();
    if (!trimmed) return "??";

    const words = trimmed.split(/\s+/);

    if (words.length > 1) {
      // Multi-word name: first letter of first word + first letter of last word
      const first = words[0].charAt(0);
      const last = words[words.length - 1].charAt(0);
      return (first + last).toUpperCase();
    }

    // Single word: first letter + last letter
    const first = trimmed.charAt(0);
    const last = trimmed.charAt(trimmed.length - 1);
    return (first + last).toUpperCase();
  }

  return (
    <DashboardLayout title="Groups" subTitle="Riding crews, local chapters & nomad squads">
      {/* Header Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-400">
            <Users size={16} />
          </div>
          <div>
            <span className="font-bold text-slate-200">{communities.length} SQUAD SQUADRONS</span>
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

      {/* Error Banner */}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 font-mono text-xs text-red-400">
          <span>[LOAD ERROR]: {error}</span>
        </div>
      )}

      {/* Initial loading state */}
      {initialLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 font-mono text-xs text-slate-500">
          <Loader2 size={16} className="animate-spin" />
          <span>Loading squadrons...</span>
        </div>
      ) : (
        <>
          {/* Grid of Squads */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {communities.map((c) => {
              const isPrivate = c.isPrivate ?? false;
              const memberCount = c.memberCount ?? 0;

              return (
                <div
                  key={c._id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-xl transition-all duration-300 hover:border-orange-500/40 hover:bg-slate-900/80 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      {c.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.logo}
                          alt={`${c.communityName} logo`}
                          onError={(e) => {
                            // if the logo URL is broken/unreachable, fall back to initials
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling?.classList.remove("hidden");
                          }}
                          className="h-12 w-12 rounded-xl border border-orange-500/30 object-cover shadow-[0_0_12px_rgba(249,115,22,0.15)]"
                        />
                      ) : null}
                      
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 font-mono text-base font-black text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.15)] ${c.logo ? "hidden" : ""
                          }`}
                      >{getInitials(c.communityName)}</div>

                      <div className="flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950/80 px-2.5 py-1 font-mono text-[10px] text-slate-400">
                        {isPrivate ? (
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
                      {c.communityName}
                    </h3>
                    <div className="mt-2 items-center font-mono text-xs text-slate-400">
                      <p>
                        Commander Name: {c.general.name}
                      </p>
                      <p>Commander Contact Details</p>
                      <span>
                        Email: {c.general.email}
                        Phone: {c.general.phoneNumber}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 font-mono text-xs text-slate-400">
                      <Users size={14} className="text-slate-500" />
                      <span>
                        {memberCount != null ? `${memberCount} RIDERS ENROLLED` : "— RIDERS ENROLLED"}
                      </span>
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
                      href={`/dashboard/Community/${c._id}/Moderators`}
                      className="flex items-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-orange-400 transition-all hover:bg-orange-500/20 hover:border-orange-500/60"
                      title="Manage Squad Moderators"
                    >
                      <ShieldCheck size={14} />
                      <span className="hidden xl:inline">Mods</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scroll sentinel — triggers next page load when visible */}
          {hasMore && (
            <div ref={sentinelRef} className="mt-6 flex items-center justify-center py-6">
              {loading && (
                <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Loading more squadrons...</span>
                </div>
              )}
            </div>
          )}

          {!hasMore && communities.length > 0 && (
            <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-widest text-slate-600">
                            // End of squadron directory
            </p>
          )}

          {!hasMore && communities.length === 0 && (
            <p className="mt-8 text-center font-mono text-xs text-slate-500">
              No squads registered yet. Be the first to form one.
            </p>
          )}
        </>
      )}
    </DashboardLayout>
  );
}