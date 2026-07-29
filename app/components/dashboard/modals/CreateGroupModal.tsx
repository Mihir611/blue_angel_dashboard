"use client";

import { useState, FormEvent } from "react";
import Modal from "../Modal";
import { TextAreaField, SelectField, SubmitButton, TextField } from "../FormFields";
import Alert from "@/app/components/alerts/page";
import { ApiError, CreateModalProps } from "@/lib/api";

const CreateGroupModal = ({ open, onClose, onCreated }: CreateModalProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState("public");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        // Creation logic goes here
    };

    return (
        <Modal open={open} onClose={onClose} title="Charter Riding Squadron">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <Alert variant="error" title="Charter Error" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <TextField
                    label="Squadron Designation (Group Name)"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mud & Asphalt Collective"
                />

                <TextAreaField
                    label="Charter & Philosophy"
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Riding style, bike preferences, and squad philosophy..."
                />

                <SelectField
                    label="Access Visibility"
                    value={visibility}
                    onChange={setVisibility}
                    options={[
                        { value: "public", label: "Public — Open telemetry, anyone can join" },
                        { value: "private", label: "Private — Encrypted, invitation only" },
                    ]}
                />

                <div className="pt-2">
                    <SubmitButton loading={loading}>
                        {loading ? "Registering Squadron..." : "Initialize Squad Charter"}
                    </SubmitButton>
                </div>
            </form>
        </Modal>
    );
};

export default CreateGroupModal;