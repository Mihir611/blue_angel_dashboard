"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Megaphone, ShieldAlert, Radio } from "lucide-react";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import Alert from "@/app/components/alerts/page"; // Or "@/app/components/dashboard/Alert" based on your path
import {
    TextField,
    TextAreaField,
    SelectField,
    ToggleField,
    ImageUploadField,
    SubmitButton,
} from "@/app/components/dashboard/FormFields";
import { ANNOUNCEMENT_PRIORITIES, AnnouncementPriority, ApiError } from "@/lib/api";

const PRIORITY_LABELS: Record<AnnouncementPriority, string> = {
    info: "Info — general update",
    important: "Important — worth highlighting",
    urgent: "Urgent — needs immediate attention",
};

export default function CreateAnnouncementPage() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [link, setLink] = useState("");
    const [displayOrder, setDisplayOrder] = useState("0");
    const [isActive, setIsActive] = useState(true);
    const [priority, setPriority] = useState<AnnouncementPriority>("info");
    const [hasExpiry, setHasExpiry] = useState(false);
    const [expiresAt, setExpiresAt] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);

        if (hasExpiry && !expiresAt) {
            setError("Please pick an expiry date, or turn off scheduling.");
            return;
        }

        setLoading(true);
        setError("Please pick an expiry date, or turn off scheduling.");
        // API call logic goes here...
    }

    return (
        <DashboardLayout title="Post Announcement" subTitle="Broadcast critical updates & system directives">
            {/* Fixed Bottom-Right Floating Toast Alert */}
            {error && (
                <div className="fixed bottom-6 right-6 z-50 w-full max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <Alert
                        variant="error"
                        title="Transmission Error"
                        onClose={() => setError(null)}
                    >
                        {error}
                    </Alert>
                </div>
            )}

            {/* Navigation back button */}
            <button
                onClick={() => router.push("/dashboard/Announcements")}
                className="group mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 font-mono text-xs text-slate-400 transition-all hover:border-orange-500/50 hover:text-orange-400"
            >
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                <span>RETURN TO BROADCASTS</span>
            </button>

            <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
                {/* Section 1: Content */}
                <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl">
                    <div className="mb-5 flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
                        <Megaphone size={18} className="text-orange-500" />
                        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-orange-400">
                            // Broadcast Content
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <ImageUploadField
                            label="Banner Media"
                            value={imageUrl}
                            onChange={setImageUrl}
                            hint="High-resolution wide banner for top feed prominence."
                        />
                        <TextField
                            label="Broadcast Title"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Western Ghats Monsoon Rally Safety Protocols"
                        />
                        <TextAreaField
                            label="Directive Details"
                            required
                            rows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Detail the mandatory equipment, assembly locations, and schedule..."
                        />
                        <TextField
                            label="External Reference Link (Optional)"
                            type="url"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder="https://motonomaad.com/routes/sector-4"
                        />
                    </div>
                </section>

                {/* Section 2: Priority & Scheduling */}
                <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl">
                    <div className="mb-5 flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
                        <Radio size={18} className="text-orange-500" />
                        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-orange-400">
                            // Signal Priority & Lifecycle
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <SelectField
                            label="Priority Tier"
                            value={priority}
                            onChange={(v) => setPriority(v as AnnouncementPriority)}
                            options={ANNOUNCEMENT_PRIORITIES.map((p) => ({ value: p, label: PRIORITY_LABELS[p] }))}
                        />
                        <ToggleField
                            label="Schedule Auto-Expiration"
                            hint="Automatically archive this broadcast after a designated timestamp"
                            checked={hasExpiry}
                            onChange={setHasExpiry}
                        />
                        {hasExpiry && (
                            <TextField
                                label="Expiration Timestamp"
                                required
                                type="datetime-local"
                                value={expiresAt}
                                onChange={(e) => setExpiresAt(e.target.value)}
                            />
                        )}
                    </div>
                </section>

                {/* Section 3: Display Controls */}
                <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl">
                    <div className="mb-5 flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
                        <ShieldAlert size={18} className="text-orange-500" />
                        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-orange-400">
                            // Feed Positioning
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <TextField
                                label="Priority Index (Display Order)"
                                type="number"
                                min={0}
                                value={displayOrder}
                                onChange={(e) => setDisplayOrder(e.target.value)}
                                placeholder="0"
                            />
                            <p className="mt-1 font-mono text-[10px] text-slate-500">
                                // Index 0 pins to the top of rider feeds.
                            </p>
                        </div>
                        <ToggleField
                            label="Broadcast Active Immediately"
                            hint="Instantly beam to all registered rider terminals"
                            checked={isActive}
                            onChange={setIsActive}
                        />
                    </div>
                </section>

                <SubmitButton loading={loading}>
                    {loading ? "Transmitting Signal..." : "Transmit Broadcast"}
                </SubmitButton>
            </form>
        </DashboardLayout>
    );
}