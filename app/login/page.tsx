"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { saveToken } from "@/lib/auth-client";
import { loginRequest, ApiError } from "@/lib/api";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get("from") || "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const data = await loginRequest({ context: 'dashboard', email: email.trim(), password });
            const accessToken = data?.tokens?.accessToken;
            if (!data?.Success || !accessToken) {
                setError("Sign-in succeeded but no token was returned.");
                setLoading(false);
                return;
            }
            saveToken({
                accessToken,
                refreshToken: data.tokens.refreshToken,
                user: data.user,
            });
            router.push(from);
            router.refresh();
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || "Unable to sign in. Please check your credentials and try again.");
            setLoading(false);
        }
    }

    const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 text-slate-100 px-4 py-12">
            {/* --- FUTURISTIC BACKGROUND GRID & LIGHT GLOWS --- */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-80" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            
            {/* Ambient glowing orbs */}
            <div className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-orange-600/10 blur-[120px]" />
            <div className="pointer-events-none absolute -right-20 bottom-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

            {/* --- HUD AMBIENT WIDGETS (Rider Telemetry in Empty Space) --- */}
            {/* Top Left Widget: System Health */}
            <div className="hidden xl:flex absolute top-12 left-12 flex-col gap-2 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-md text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2 text-orange-400 font-bold tracking-widest uppercase">
                    <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                    Telemetry Link Active
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-1 text-[11px]">
                    <span>RPM LIMIT: <span className="text-slate-200">14,500</span></span>
                    <span>GEAR: <span className="text-cyan-400">NEUTRAL</span></span>
                    <span>ENGINE TEMP: <span className="text-slate-200">88°C</span></span>
                    <span>TRACTION: <span className="text-emerald-400">SPORT+</span></span>
                </div>
            </div>

            {/* Bottom Left Widget: Map/Route Info */}
            <div className="hidden lg:flex absolute bottom-12 left-12 flex-col gap-1.5 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-md text-xs font-mono text-slate-400">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-300 font-bold uppercase tracking-wider">Current Waypoint</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-cyan-400 border border-cyan-500/30">GPS FIXED</span>
                </div>
                <p className="text-slate-200 font-semibold text-sm">Passo dello Stelvio // Sector 04</p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-gradient-to-r from-orange-500 to-amber-300 h-full w-2/3 rounded-full" />
                </div>
            </div>

            {/* Top Right Widget: Rider Mode */}
            <div className="hidden lg:flex absolute top-12 right-12 flex-col items-end gap-1 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-md text-xs font-mono text-slate-400">
                <span className="text-[10px] tracking-widest text-slate-500 uppercase">Rider Identity Protocol</span>
                <span className="text-orange-400 font-bold tracking-wider uppercase text-sm">Motonomaad OS v4.2</span>
                <span className="text-[11px] text-slate-400">AUTHENTICATION REQUIRED</span>
            </div>

            {/* Bottom Right Widget: Weather & Road Conditions */}
            <div className="hidden xl:flex absolute bottom-12 right-12 flex-col gap-2 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-md text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2 text-cyan-400 font-bold tracking-widest uppercase">
                    Road Conditions
                </div>
                <div className="flex gap-4 text-[11px] mt-1">
                    <div>
                        <p className="text-slate-500">SURFACE</p>
                        <p className="text-slate-200 font-medium">DRY ASPHALT</p>
                    </div>
                    <div className="border-l border-slate-800 pl-4">
                        <p className="text-slate-500">VISIBILITY</p>
                        <p className="text-slate-200 font-medium">10 KM</p>
                    </div>
                    <div className="border-l border-slate-800 pl-4">
                        <p className="text-slate-500">WIND</p>
                        <p className="text-slate-200 font-medium">12 NW</p>
                    </div>
                </div>
            </div>

            {/* --- MAIN LOGIN CARD --- */}
            <div className="relative z-10 w-full max-w-md">
                {/* Brand Header */}
                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="relative mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900/80 p-0.5 shadow-2xl backdrop-blur-xl border border-orange-500/30 group">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                        <Image
                            src="/logo.png"
                            alt="Motonomaad"
                            width={72}
                            height={72}
                            className="relative z-10 h-full w-full object-contain p-2 filter drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                            priority
                        />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white uppercase font-sans">
                        Moto<span className="text-orange-500">nomaad</span>
                    </h1>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-orange-400/90 font-medium">
                        Ride free • Ride far
                    </p>
                </div>

                {/* Login Form Container */}
                <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-2xl">
                    {/* Glowing Accent Top Bar */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-80" />

                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-100">
                            Rider Sign-In
                        </h2>
                        <p className="mt-1 text-xs text-slate-400 font-mono">
                            // Access telemetry, routes & community
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {/* Email Input */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400"
                            >
                                Rider Identification (Email)
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="rider@motonomaad.com"
                                className="w-full rounded-xl bg-slate-950/80 border border-slate-800 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <div className="mb-1.5 flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400"
                                >
                                    Security Passcode
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-[11px] font-mono text-slate-400 hover:text-orange-400 transition-colors underline underline-offset-4"
                                >
                                    Reset Access Code?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full rounded-xl bg-slate-950/80 border border-slate-800 px-4 py-3 pr-11 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <p
                                role="alert"
                                aria-live="polite"
                                className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 font-mono"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0 text-red-400">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <span>{error}</span>
                            </p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className="relative group w-full overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-[1px] font-mono text-xs font-bold uppercase tracking-widest text-slate-950 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
                        >
                            <div className="flex w-full items-center justify-center gap-2 rounded-[11px] bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3.5 text-slate-950 transition-all group-hover:bg-opacity-90">
                                {loading && (
                                    <svg
                                        className="h-4 w-4 animate-spin text-slate-950"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
                                    </svg>
                                )}
                                {loading ? "Authenticating…" : "Engage Ignition"}
                            </div>
                        </button>
                    </form>

                    {/* Footer link */}
                    <p className="mt-6 text-center text-xs text-slate-400">
                        New to the grid?{" "}
                        <Link href="/register" className="font-semibold text-orange-400 hover:text-orange-300 underline underline-offset-4 transition-colors">
                            Initialize Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    );
}