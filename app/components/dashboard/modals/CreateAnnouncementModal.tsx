"use client";

import { useState, FormEvent } from "react";
import Modal from "../Modal";
import { TextField, TextAreaField, SubmitButton } from "../FormFields";
import Alert from "@/app/components/alerts/page"; // Or "@/app/components/dashboard/Alert"
import { ApiError, CreateModalProps } from "@/lib/api";

const CreateAnnouncementModal = ({ open, onClose, onCreated }: CreateModalProps) => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        // Dispatch logic goes here
    };

    return (
        <Modal open={open} onClose={onClose} title="Transmit Broadcast">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <Alert variant="error" title="Broadcast Error" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

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
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Detail the mandatory equipment, assembly locations, and schedule..."
                />

                <div className="pt-2">
                    <SubmitButton loading={loading}>
                        {loading ? "Transmitting Signal..." : "Transmit Broadcast"}
                    </SubmitButton>
                </div>
            </form>
        </Modal>
    );
};

export default CreateAnnouncementModal;