"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Alert from "@/app/components/alerts/page";
import { ArrowLeft, Users, Globe, ShieldCheck, Network, Plus, X } from "lucide-react";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import {
    TextField,
    TextAreaField,
    SubmitButton,
    ImageUploadField,
    ToggleField,
} from "@/app/components/dashboard/FormFields";
import { createCommunity, ApiError } from "@/lib/api";

const CURRENT_YEAR = new Date().getFullYear();

type SubCommunity = {
    id: string;
    name: string;
    email: string;
    phone: string;
};

function createEmptySubCommunity(): SubCommunity {
    return {
        id: crypto.randomUUID(),
        name: "",
        email: "",
        phone: "",
    };
}

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

    // Community-level contact channels (distinct from the lead commander's personal contact)
    const [communityEmail, setCommunityEmail] = useState("");
    const [communityPhone, setCommunityPhone] = useState("");

    const [adminName, setAdminName] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPhone, setAdminPhone] = useState("");

    // Sub-community handling
    const [hasSubCommunities, setHasSubCommunities] = useState(false);
    const [subCommunities, setSubCommunities] = useState<SubCommunity[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function addSubCommunity() {
        setSubCommunities((prev) => [...prev, createEmptySubCommunity()]);
    }

    function removeSubCommunity(id: string) {
        setSubCommunities((prev) => prev.filter((sc) => sc.id !== id));
    }

    function updateSubCommunity(id: string, field: keyof Omit<SubCommunity, "id">, value: string) {
        setSubCommunities((prev) =>
            prev.map((sc) => (sc.id === id ? { ...sc, [field]: value } : sc))
        );
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);

        const year = Number(establishedYear);
        if (!year || year < 1900 || year > CURRENT_YEAR) {
            setError(`Established year must be between 1900 and ${CURRENT_YEAR}.`);
            return;
        }

        if (hasSubCommunities) {
            const incomplete = subCommunities.some(
                (sc) => !sc.name.trim() || !sc.email.trim() || !sc.phone.trim()
            );
            if (subCommunities.length === 0) {
                setError("Add at least one sub-community, or disable sub-communities.");
                return;
            }
            if (incomplete) {
                setError("Every sub-community needs a name, email, and phone number.");
                return;
            }
        }

        setLoading(true);
        try {
            let res = await createCommunity({
                communityName: groupName,
                email: communityEmail,
                phoneNumber: communityPhone,
                logo: '/motonomaad-logo.png',
                incorporationDate: establishedYear,
                description,
                tagline: tagLine,
                instagramHandle: instagramId,
                location: { city, state, country },
                general: {
                    name: adminName,
                    email: adminEmail,
                    phoneNumber: adminPhone,
                },
                hasSubCommunities,
            });
            if (res.Success) {
                setError(res.message)
            }
        } catch (err) {
            const error = err as ApiError;
            switch (error.status) {
                case 409:
                    setError(error.message);
                    break;
                case 400:
                    setError(error.message);
                    break;
                default:
                    setError(error.message || "Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
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

                {/* Community-level contact channels */}
                <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl">
                    <div className="mb-5 flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
                        <ShieldCheck size={18} className="text-orange-500" />
                        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-orange-400">
                            // Community Comms Channel
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextField
                            label="Community Email"
                            required
                            type="email"
                            value={communityEmail}
                            onChange={(e) => setCommunityEmail(e.target.value)}
                            placeholder="squad@motonomaad.com"
                        />
                        <TextField
                            label="Community Phone"
                            required
                            type="tel"
                            value={communityPhone}
                            onChange={(e) => setCommunityPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                        />
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

                {/* Sub-communities */}
                <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl">
                    <div className="mb-5 flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
                        <Network size={18} className="text-orange-500" />
                        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-orange-400">
                            // Sub-Community Chapters
                        </h2>
                    </div>

                    <ToggleField
                        label="This squad has sub-communities / chapters"
                        checked={hasSubCommunities}
                        onChange={(checked: boolean) => {
                            setHasSubCommunities(checked);
                            if (checked && subCommunities.length === 0) {
                                addSubCommunity();
                            }
                        }}
                    />

                    {hasSubCommunities && (
                        <div className="mt-5 space-y-4">
                            {subCommunities.map((sc, index) => (
                                <div
                                    key={sc.id}
                                    className="relative rounded-xl border border-slate-800/80 bg-slate-950/60 p-4"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <span className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
                                            Sub-Community {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeSubCommunity(sc.id)}
                                            className="inline-flex items-center gap-1 rounded-lg border border-slate-800 px-2 py-1 font-mono text-[11px] text-slate-500 transition-colors hover:border-red-500/50 hover:text-red-400"
                                        >
                                            <X size={12} />
                                            Remove
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <TextField
                                            label="Sub-Community Name"
                                            required
                                            value={sc.name}
                                            onChange={(e) => updateSubCommunity(sc.id, "name", e.target.value)}
                                            placeholder="e.g. North Bangalore Chapter"
                                        />
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <TextField
                                                label="Contact Email"
                                                required
                                                type="email"
                                                value={sc.email}
                                                onChange={(e) => updateSubCommunity(sc.id, "email", e.target.value)}
                                                placeholder="chapter@motonomaad.com"
                                            />
                                            <TextField
                                                label="Contact Phone"
                                                required
                                                type="tel"
                                                value={sc.phone}
                                                onChange={(e) => updateSubCommunity(sc.id, "phone", e.target.value)}
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addSubCommunity}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 px-4 py-3 font-mono text-xs uppercase tracking-widest text-slate-400 transition-all hover:border-orange-500/50 hover:text-orange-400"
                            >
                                <Plus size={14} />
                                Add Sub-Community
                            </button>
                        </div>
                    )}
                </section>
                <SubmitButton loading={loading}>
                    {loading ? "Registering Squadron..." : "Initialize Squad Charter"}
                </SubmitButton>
            </form>
            {error && (
                <Alert variant="error" title="Initialize Squad Charter Error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
        </DashboardLayout>
    );
}