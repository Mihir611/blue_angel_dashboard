"use client";

import { useState, FormEvent } from "react";
import Modal from "../Modal";
import { TextField, SelectField, SubmitButton } from "../FormFields";
import Alert from "@/app/components/alerts/page";
import { ApiError, CreateModalProps } from "@/lib/api";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const CreateBloodRequestModal = ({ open, onClose, onCreated }: CreateModalProps) => {
    const [patientName, setPatientName] = useState("");
    const [bloodGroup, setBloodGroup] = useState("O+");
    const [unitsNeeded, setUnitsNeeded] = useState("1");
    const [hospital, setHospital] = useState("");
    const [location, setLocation] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [urgency, setUrgency] = useState("urgent");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        // Dispatch logic goes here
    };

    return (
        <Modal open={open} onClose={onClose} title="Emergency Donor SOS">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <Alert variant="error" title="SOS Dispatch Failed" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <TextField
                    label="Patient Identification"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Full name of recipient"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <SelectField
                        label="Blood Group"
                        value={bloodGroup}
                        onChange={setBloodGroup}
                        options={BLOOD_GROUPS.map((g) => ({ value: g, label: g }))}
                    />
                    <TextField
                        label="Units Needed"
                        required
                        type="number"
                        min={1}
                        value={unitsNeeded}
                        onChange={(e) => setUnitsNeeded(e.target.value)}
                    />
                </div>

                <TextField
                    label="Hospital Facility"
                    required
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    placeholder="e.g. Manipal Hospital, ICU Block"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <TextField
                        label="City / Waypoint"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Bangalore"
                    />
                    <TextField
                        label="Comms Hotline (Phone)"
                        required
                        type="tel"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                    />
                </div>

                <SelectField
                    label="Triage Urgency Level"
                    value={urgency}
                    onChange={setUrgency}
                    options={[
                        { value: "critical", label: "Critical — Needed immediately" },
                        { value: "urgent", label: "Urgent — Within 24 hours" },
                        { value: "standard", label: "Standard — Planned requirement" },
                    ]}
                />

                <div className="pt-2">
                    <SubmitButton loading={loading}>
                        {loading ? "Broadcasting SOS..." : "Dispatch Emergency Request"}
                    </SubmitButton>
                </div>
            </form>
        </Modal>
    );
};

export default CreateBloodRequestModal;