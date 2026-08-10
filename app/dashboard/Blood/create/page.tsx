"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Activity, MapPin, PhoneCall, Crosshair } from "lucide-react";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import {
    TextField,
    TextAreaField,
    SelectField,
    SubmitButton,
} from "@/app/components/dashboard/FormFields";
import { createBloodRequest } from "@/lib/api"; // see postRequest.ts addition below

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
type Urgency = "critical" | "urgent" | "normal";

export default function CreateBloodRequestPage() {
    const router = useRouter();

    // Patient & triage
    const [patientName, setPatientName] = useState("");
    const [bloodGroup, setBloodGroup] = useState("O+");
    const [unitsRequired, setUnitsRequired] = useState("1");
    const [urgency, setUrgency] = useState<Urgency>("urgent");
    const [requiredBy, setRequiredBy] = useState("");
    const [additionalNotes, setAdditionalNotes] = useState("");

    // Hospital / location
    const [hospitalName, setHospitalName] = useState("");
    const [hospitalAddress, setHospitalAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [locating, setLocating] = useState(false);

    // Contact
    const [contactNumber, setContactNumber] = useState("");
    const [alternateContactNumber, setAlternateContactNumber] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleUseCurrentLocation() {
        if (!navigator.geolocation) {
            setError("Geolocation isn't supported on this browser.");
            return;
        }
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLatitude(pos.coords.latitude.toString());
                setLongitude(pos.coords.longitude.toString());
                setLocating(false);
            },
            () => {
                setError("Couldn't fetch current location. Enter coordinates manually.");
                setLocating(false);
            }
        );
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);

        if (!patientName || !bloodGroup || !hospitalName || !hospitalAddress || !city) {
            setError("Patient name, blood group, and hospital name/address/city are required.");
            return;
        }
        if (!contactNumber) {
            setError("A contact number is required.");
            return;
        }
        if (!requiredBy) {
            setError("Please specify the required-by date and time.");
            return;
        }
        if (!latitude || !longitude) {
            setError("Hospital coordinates are required. Use 'Locate' or enter manually.");
            return;
        }
        const lat = Number(latitude);
        const lng = Number(longitude);
        if (Number.isNaN(lat) || Number.isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            setError("Coordinates look invalid — latitude must be -90 to 90, longitude -180 to 180.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                patientName,
                bloodGroup,
                unitsRequired: Number(unitsRequired),
                urgency,
                hospital: {
                    name: hospitalName,
                    address: hospitalAddress,
                    city,
                    state: state || undefined,
                    location: {
                        type: "Point" as const,
                        coordinates: [lng, lat] as [number, number],
                    },
                },
                contactNumber,
                alternateContactNumber: alternateContactNumber || undefined,
                requiredBy: new Date(requiredBy).toISOString(),
                additionalNotes: additionalNotes || undefined,
            };

            await createBloodRequest(payload);
            router.push("/dashboard/Blood");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Something went wrong while dispatching the request.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <DashboardLayout title="Emergency Donor Dispatch" subTitle="Initiate high-priority rider blood requirement alert">
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
                                value={unitsRequired}
                                onChange={(e) => setUnitsRequired(e.target.value)}
                            />
                        </div>
                        <SelectField
                            label="Triage Urgency Level"
                            value={urgency}
                            onChange={(v) => setUrgency(v as Urgency)}
                            options={[
                                { value: "critical", label: "Critical — Immediate dispatch required" },
                                { value: "urgent", label: "Urgent — Needed within 24 hours" },
                                { value: "normal", label: "Normal — Planned procedure requirement" },
                            ]}
                        />
                        <TextField
                            label="Required By"
                            required
                            type="datetime-local"
                            value={requiredBy}
                            onChange={(e) => setRequiredBy(e.target.value)}
                        />
                        <TextAreaField
                            label="Clinical / Ward Notes (Optional)"
                            rows={3}
                            maxLength={500}
                            value={additionalNotes}
                            onChange={(e) => setAdditionalNotes(e.target.value)}
                            placeholder="Include ward number, attending physician name, or donor instructions..."
                        />
                    </div>
                </section>

                {/* Section 2: Hospital & Location */}
                <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl">
                    <div className="mb-5 flex items-center justify-between gap-2.5 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-2.5">
                            <MapPin size={18} className="text-red-400" />
                            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-red-400">
                                // Location Telemetry
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={handleUseCurrentLocation}
                            disabled={locating}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                        >
                            <Crosshair size={12} className={locating ? "animate-spin" : ""} />
                            {locating ? "Locating..." : "Locate"}
                        </button>
                    </div>

                    <div className="space-y-4">
                        <TextField
                            label="Hospital Facility"
                            required
                            value={hospitalName}
                            onChange={(e) => setHospitalName(e.target.value)}
                            placeholder="e.g. Manipal Hospital"
                        />
                        <TextField
                            label="Hospital Address"
                            required
                            value={hospitalAddress}
                            onChange={(e) => setHospitalAddress(e.target.value)}
                            placeholder="e.g. Tiger Circle Rd, Madhav Nagar"
                        />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <TextField label="City" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Udupi" />
                            <TextField label="State" value={state} onChange={(e) => setState(e.target.value)} placeholder="Karnataka" />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <TextField
                                label="Latitude"
                                required
                                type="number"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                placeholder="13.3409"
                            />
                            <TextField
                                label="Longitude"
                                required
                                type="number"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                placeholder="74.7421"
                            />
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

                    <div className="space-y-4">
                        <TextField
                            label="Direct Contact Hotline"
                            required
                            type="tel"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            placeholder="+91 98765 43210"
                        />
                        <TextField
                            label="Alternate Contact (Optional)"
                            type="tel"
                            value={alternateContactNumber}
                            onChange={(e) => setAlternateContactNumber(e.target.value)}
                            placeholder="+91 98765 43210"
                        />
                    </div>
                </section>

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