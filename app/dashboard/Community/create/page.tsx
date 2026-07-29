"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Globe, ShieldCheck } from "lucide-react";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import {
    TextField,
    TextAreaField,
    SubmitButton,
    ImageUploadField,
} from "@/app/components/dashboard/FormFields";

const CURRENT_YEAR = new Date().getFullYear();

export default function CreateGroupPage() {
    const router = useRouter();

    const [groupName, setGroupName] = useState("");
    const [tagLine, setTagLine] = useState("");
    const [description, setDescription] = useState("");
    const [groupLogo, setGroupLogo] = useState<string | null>(null);
    const [establishedYear, setEstablishedYear] = useState(String(CURRENT_YEAR));
    const [instagramId, setInstagramId] = useState("");

    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("India");

    const [adminName, setAdminName] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPhone, setAdminPhone] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);

        const year = Number(establishedYear);
        if (!year || year < 1900 || year > CURRENT_YEAR) {
            setError(`Established year must be between 1900 and ${CURRENT_YEAR}.`);
            return;
        }

        setLoading(true);
        // API call logic
    }

    return (
        <DashboardLayout title="Register Riding Squad" subTitle="Form a new motorcycle chapter or riding collective">
            {/* Navigation back button */}
            <button
                onClick={() => router.push("/dashboard/Community")}
                className="group mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 font-mono text-xs text-slate-400 transition-all hover:border-orange-500/50 hover:text-orange-400"
            >
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                <span>RETURN TO SQUADRON DIRECTORY</span>
            </button>

            <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
                {/* Identity */}
                <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl">
                    <div className="mb-5 flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
                        <Users size={18} className="text-orange-500" />
                        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-orange-400">
                            // Squad Identity & Emblem
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <ImageUploadField
                            label="Squad Insignia / Logo"
                            value={groupLogo}
                            onChange={setGroupLogo}
                            hint="Square format works best. Minimum size 200x200px."
                        />
                        <TextField
                            label="Squad Designation (Group Name)"
                            required
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="e.g. Mud & Asphalt Chapter"
                        />
                        <TextField
                            label="Motto / Tagline"
                            required
                            maxLength={80}
                            value={tagLine}
                            onChange={(e) => setTagLine(e.target.value)}
                            placeholder="e.g. Throttle Open. Minds Clear."
                        />
                        <TextAreaField
                            label="Squad Charter & Description"
                            required
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the riding style, bike preferences, and core philosophy..."
                        />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <TextField
                                label="Established Year"
                                required
                                type="number"
                                min={1900}
                                max={CURRENT_YEAR}
                                value={establishedYear}
                                onChange={(e) => setEstablishedYear(e.target.value)}
                            />
                            <TextField
                                label="Instagram Handle"
                                value={instagramId}
                                onChange={(e) => setInstagramId(e.target.value)}
                                placeholder="@squad_handle"
                            />
                        </div>
                    </div>
                </section>

                {/* Location */}
                <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl">
                    <div className="mb-5 flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
                        <Globe size={18} className="text-orange-500" />
                        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-orange-400">
                            // Base Coordinates
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <TextField label="Base City" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Bangalore" />
                        <TextField label="State / Province" required value={state} onChange={(e) => setState(e.target.value)} placeholder="Karnataka" />
                        <TextField label="Country" required value={country} onChange={(e) => setCountry(e.target.value)} placeholder="India" />
                    </div>
                </section>

                {/* Admin contact */}
                <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl">
                    <div className="mb-5 flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
                        <ShieldCheck size={18} className="text-orange-500" />
                        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-orange-400">
                            // Commander Contact Protocol
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <TextField
                            label="Lead Commander Name"
                            required
                            value={adminName}
                            onChange={(e) => setAdminName(e.target.value)}
                            placeholder="Full name of primary contact"
                        />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <TextField
                                label="Official Email"
                                required
                                type="email"
                                value={adminEmail}
                                onChange={(e) => setAdminEmail(e.target.value)}
                                placeholder="commander@squad.com"
                            />
                            <TextField
                                label="Comms Hotline (Phone)"
                                required
                                type="tel"
                                value={adminPhone}
                                onChange={(e) => setAdminPhone(e.target.value)}
                                placeholder="+91 98765 43210"
                            />
                        </div>
                    </div>
                </section>

                {/* Error Banner */}
                {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 font-mono text-xs text-red-400">
                        <span>[REGISTRATION ERROR]: {error}</span>
                    </div>
                )}

                <SubmitButton loading={loading}>
                    {loading ? "Registering Squadron..." : "Initialize Squad Charter"}
                </SubmitButton>
            </form>
        </DashboardLayout>
    );
}