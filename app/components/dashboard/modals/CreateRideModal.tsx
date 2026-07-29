"use client";

import { useState, FormEvent } from "react";
import Modal from "../Modal";
import { TextAreaField, TextField, SelectField, SubmitButton } from "../FormFields";
import Alert from "@/app/components/alerts/page";
import { ApiError, CreateModalProps } from "@/lib/api";

const CreateRideModal = ({ open, onClose, onCreated }: CreateModalProps) => {
    const [type, setType] = useState("ride");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        // Creation logic goes here
    };

    return (
        <Modal open={open} onClose={onClose} title="Dispatch Expedition">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <Alert variant="error" title="Dispatch Error" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <SelectField
                    label="Dispatched Type"
                    value={type}
                    onChange={setType}
                    options={[
                        { value: "ride", label: "Expedition Ride" },
                        { value: "event", label: "Rider Gathering / Track Event" },
                    ]}
                />

                <TextField
                    label="Expedition Name"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sunrise Ascent to Nandi Hills"
                />

                <TextAreaField
                    label="Itinerary & Route Details"
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Assembly point, checkpoints, required safety gear..."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <TextField
                        label="Launch Point (Location)"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Starting coordinates / point"
                    />
                    <TextField
                        label="Launch Timestamp"
                        required
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div className="pt-2">
                    <SubmitButton loading={loading}>
                        {loading ? "Publishing Expedition..." : "Publish Expedition to Radar"}
                    </SubmitButton>
                </div>
            </form>
        </Modal>
    );
};

export default CreateRideModal;