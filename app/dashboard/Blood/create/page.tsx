"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Activity, MapPin, PhoneCall } from "lucide-react";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import {
    TextField,
    TextAreaField,
    SelectField,
    ToggleField,
    SubmitButton,
} from "@/app/components/dashboard/FormFields";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function CreateBloodRequestPage() {
    const router = useRouter();

    const [patientName, setPatientName] = useState("");
    const [bloodGroup, setBloodGroup] = useState("O+");
    const [unitsNeeded, setUnitsNeeded] = useState("1");
    const [hospital, setHospital] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [urgency, setUrgency] = useState("urgent");
    const [hasDeadline, setHasDeadline] = useState(false);
    const [requiredBy, setRequiredBy] = useState("");
    const [notes, setNotes] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);

        if (hasDeadline && !requiredBy) {
            setError("Please pick a required-by date, or turn off the deadline.");
            return;
        }

        setLoading(true);
        // API call logic
    }

    return (
        <DashboardLayout title="Emergency Donor Dispatch" subTitle="Initiate high-priority rider blood requirement alert">
            {/* Navigation back button */}
            <button
                onClick={() => router.push("/dashboard/Blood")}
                className="group mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 font-mono text-xs text-slate-400 transition-all hover:border-red-500/50 hover:text-red-400"
            >
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                <span>RETURN TO EMERGENCY FEED</span>
            </button>

            <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
                {/* Section 1: Requirement Details */}
                <section className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-red-950/10 p-6 backdrop-blur-xl">
                    <div className="mb-5 flex items-center gap-2.5 border-b border-red-500/20 pb-3">
                        <Activity size={18} className="text-red-400 animate-pulse" />
                        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-red-400">
                            // Patient & Triage Specification
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <TextField
                            label="Patient Identification"
                            required
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            placeholder="Full name of recipient"
                        />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <SelectField
                                label="Blood Group"
                                value={bloodGroup}
                                onChange={setBloodGroup}
                                options={BLOOD_GROUPS.map((g) => ({ value: g, label: g }))}
                            />
                            <TextField
                                label="Required Units"
                                required
                                type="number"
                                min={1}
                                value={unitsNeeded}
                                onChange={(e) => setUnitsNeeded(e.target.value)}
                            />
                        </div>
                        <SelectField
                            label="Triage Urgency Level"
                            value={urgency}
                            onChange={setUrgency}
                            options={[
                                { value: "critical", label: "Critical — Immediate dispatch required" },
                                { value: "urgent", label: "Urgent — Needed within 24 hours" },
                                { value: "standard", label: "Standard — Planned procedure requirement" },
                            ]}
                        />
                        <ToggleField
                            label="Strict Deadline Constraint"
                            hint="Specify the exact time threshold for donation"
                            checked={hasDeadline}
                            onChange={setHasDeadline}
                        />
                        {hasDeadline && (
                            <TextField
                                label="Deadline Timestamp"
                                required
                                type="datetime-local"
                                value={requiredBy}
                                onChange={(e) => setRequiredBy(e.target.value)}
                            />
                        )}
                        <TextAreaField
                            label="Clinical / Ward Notes (Optional)"
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Include ward number, attending physician name, or donor instructions..."
                        />
                    </div>
                </section>

                {/* Section 2: Hospital & Location */}
                <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl">
                    <div className="mb-5 flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
                        <MapPin size={18} className="text-red-400" />
                        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-red-400">
                            // Location Telemetry
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <TextField
                            label="Hospital Facility"
                            required
                            value={hospital}
                            onChange={(e) => setHospital(e.target.value)}
                            placeholder="e.g. Manipal Hospital, ICU Block"
                        />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <TextField label="City" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Bangalore" />
                            <TextField label="State" required value={state} onChange={(e) => setState(e.target.value)} placeholder="Karnataka" />
                        </div>
                    </div>
                </section>

                {/* Section 3: Contact Details */}
                <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl">
                    <div className="mb-5 flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
                        <PhoneCall size={18} className="text-red-400" />
                        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-red-400">
                            // Emergency Contact Hotline
                        </h2>
                    </div>

                    <TextField
                        label="Direct Contact Hotline"
                        required
                        type="tel"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                    />
                </section>

                {/* Error Banner */}
                {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 font-mono text-xs text-red-400">
                        <span>[DISPATCH ERROR]: {error}</span>
                    </div>
                )}

                <SubmitButton loading={loading}>
                    {loading ? "Broadcasting SOS..." : "Dispatch Emergency Request"}
                </SubmitButton>
            </form>
        </DashboardLayout>
    );
}