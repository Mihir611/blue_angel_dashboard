"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Flag, MapPin, Contact2 } from "lucide-react";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import {
    TextField,
    TextAreaField,
    SelectField,
    ToggleField,
    TagsInputField,
    ImageUploadField,
    SubmitButton,
} from "@/app/components/dashboard/FormFields";
import { EVENT_CATEGORIES, EventCategory } from "@/lib/api";

const CATEGORY_LABELS: Record<EventCategory, string> = {
    Adventure: "Adventure Expedition",
    hangout: "Rider Hangout",
    "breakfast-ride": "Breakfast Ride",
    "lunch-ride": "Lunch Ride",
    "dinner-ride": "Dinner Ride",
    touring: "Cross-Country Touring",
    racing: "Track & Racing",
    other: "Custom Expedition",
};

export default function CreateRidePage() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [eventDate, setEventDate] = useState("");
    const [category, setCategory] = useState<EventCategory>("Adventure");
    const [categoryOther, setCategoryOther] = useState("");
    const [price, setPrice] = useState("0");
    const [tags, setTags] = useState<string[]>([]);
    const [isActive, setIsActive] = useState(true);

    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("India");

    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);

        if (category === "other" && !categoryOther.trim()) {
            setError("Please specify the custom category.");
            return;
        }
        if (!eventDate) {
            setError("Please pick a timestamp for the ride or event.");
            return;
        }

        setLoading(true);
        // API call logic
    }

    return (
        <DashboardLayout title="Dispatch Ride / Event" subTitle="Organize a route rally or community event">
            {/* Navigation back button */}
            <button
                onClick={() => router.push("/dashboard/Events")}
                className="group mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 font-mono text-xs text-slate-400 transition-all hover:border-orange-500/50 hover:text-orange-400"
            >
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                <span>RETURN TO EXPEDITION RADAR</span>
            </button>

            <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
                {/* Details */}
                <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl">
                    <div className="mb-5 flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
                        <Flag size={18} className="text-orange-500" />
                        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-orange-400">
                            // Expedition Briefing
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <ImageUploadField
                            label="Cover Route Banner"
                            value={imageUrl}
                            onChange={setImageUrl}
                            hint="Wide panoramic banner recommended."
                        />
                        <TextField
                            label="Expedition Name"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Sunrise Ascent to Nandi Hills"
                        />
                        <TextAreaField
                            label="Route & Itinerary Details"
                            required
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Outline assembly points, route checkpoints, terrain type, gear required..."
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <SelectField
                                label="Expedition Category"
                                value={category}
                                onChange={(v) => setCategory(v as EventCategory)}
                                options={EVENT_CATEGORIES.map((c: string) => ({ value: c, label: CATEGORY_LABELS[c] || c }))}
                            />
                            <TextField
                                label="Launch Date & Time"
                                required
                                type="datetime-local"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                            />
                        </div>

                        {category === "other" && (
                            <TextField
                                label="Custom Category Specification"
                                required
                                value={categoryOther}
                                onChange={(e) => setCategoryOther(e.target.value)}
                                placeholder="e.g. Charity Track Day"
                            />
                        )}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <TextField
                                label="Pass Fee (₹, 0 for Free Access)"
                                required
                                type="number"
                                min={0}
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            <div className="flex items-end pb-1">
                                <ToggleField
                                    label="Publish Immediately"
                                    hint="Make visible on public radar"
                                    checked={isActive}
                                    onChange={setIsActive}
                                />
                            </div>
                        </div>

                        <TagsInputField
                            label="Radar Search Tags"
                            tags={tags}
                            onChange={setTags}
                            placeholder="Add tags (e.g. Offroad, Highway, Sunset) and press Enter"
                        />
                    </div>
                </section>

                {/* Location */}
                <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl">
                    <div className="mb-5 flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
                        <MapPin size={18} className="text-orange-500" />
                        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-orange-400">
                            // Waypoint & Location
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <TextField label="Starting City" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Bangalore" />
                        <TextField label="State" required value={state} onChange={(e) => setState(e.target.value)} placeholder="Karnataka" />
                        <TextField label="Country" required value={country} onChange={(e) => setCountry(e.target.value)} placeholder="India" />
                    </div>
                </section>

                {/* Contact */}
                <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl">
                    <div className="mb-5 flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
                        <Contact2 size={18} className="text-orange-500" />
                        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-orange-400">
                            // Organizer Telemetry
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextField
                            label="Contact Email"
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="lead@motonomaad.com"
                        />
                        <TextField
                            label="Comms Hotline (Phone)"
                            required
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                        />
                    </div>
                </section>

                {/* Error Banner */}
                {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 font-mono text-xs text-red-400">
                        <span>[DISPATCH ERROR]: {error}</span>
                    </div>
                )}

                <SubmitButton loading={loading}>
                    {loading ? "Publishing Expedition..." : "Publish Expedition to Radar"}
                </SubmitButton>
            </form>
        </DashboardLayout>
    );
}