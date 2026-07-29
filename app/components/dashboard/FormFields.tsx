"use client";

import {
    InputHTMLAttributes,
    TextareaHTMLAttributes,
    useState,
    ReactNode,
} from "react";
import {
    FieldWrapperProps,
    SelectFieldProps,
    ImageUploadFieldProps,
    ToggleFieldProps,
    TagsInputFieldProps,
} from "@/lib/api";
import { Upload, X, Check, Loader2, ChevronDown } from "lucide-react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string };
type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
};

// --- FIELD WRAPPER ---
const FieldWrapper = ({ label, children }: FieldWrapperProps) => {
    return (
        <div className="space-y-1.5">
            <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {label}
            </label>
            {children}
        </div>
    );
};

// --- TEXT INPUT FIELD ---
export function TextField({ label, className = "", ...props }: TextFieldProps) {
    return (
        <FieldWrapper label={label}>
            <input
                {...props}
                className={`w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 font-sans text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 ${className}`}
            />
        </FieldWrapper>
    );
}

// --- TEXTAREA FIELD ---
export function TextAreaField({
    label,
    className = "",
    ...props
}: TextAreaFieldProps) {
    return (
        <FieldWrapper label={label}>
            <textarea
                {...props}
                className={`w-full resize-none rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 font-sans text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 ${className}`}
            />
        </FieldWrapper>
    );
}

// --- SELECT FIELD ---
export function SelectField({
    label,
    value,
    onChange,
    options,
}: SelectFieldProps) {
    return (
        <FieldWrapper label={label}>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 pr-10 font-sans text-sm text-slate-100 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                >
                    {options.map((opt) => (
                        <option
                            key={opt.value}
                            value={opt.value}
                            className="bg-slate-900 text-slate-100"
                        >
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
            </div>
        </FieldWrapper>
    );
}

// --- SUBMIT BUTTON ---
export function SubmitButton({
    loading,
    children,
}: {
    loading: boolean;
    children: ReactNode;
}) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-[1px] font-mono text-xs font-bold uppercase tracking-widest text-slate-950 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none"
        >
            <div className="flex w-full items-center justify-center gap-2 rounded-[11px] bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 text-slate-950 transition-all group-hover:bg-opacity-90">
                {loading && <Loader2 size={16} className="animate-spin text-slate-950" />}
                <span>{children}</span>
            </div>
        </button>
    );
}

// --- IMAGE UPLOAD FIELD ---
export function ImageUploadField({
    label,
    value,
    onChange,
    hint,
}: ImageUploadFieldProps) {
    function handleFile(file: File | undefined) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => onChange(reader.result as string);
        reader.readAsDataURL(file);
    }

    return (
        <FieldWrapper label={label}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Preview Container */}
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80 p-1">
                    {value ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={value}
                            alt="Uploaded preview"
                            className="h-full w-full rounded-lg object-cover"
                        />
                    ) : (
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-600">
                            NO MEDIA
                        </span>
                    )}
                </div>

                {/* Upload Controls */}
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-200 transition-colors hover:border-orange-500/50 hover:text-orange-400">
                            <Upload size={14} />
                            <span>{value ? "Replace Image" : "Upload Image"}</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFile(e.target.files?.[0])}
                            />
                        </label>

                        {value && (
                            <button
                                type="button"
                                onClick={() => onChange(null)}
                                className="flex items-center gap-1 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/20"
                            >
                                <X size={14} />
                                <span>Remove</span>
                            </button>
                        )}
                    </div>

                    {hint && (
                        <p className="font-mono text-[10px] text-slate-500">// {hint}</p>
                    )}
                </div>
            </div>
        </FieldWrapper>
    );
}

// --- TOGGLE SWITCH FIELD ---
export function ToggleField({
    label,
    checked,
    onChange,
    hint,
}: ToggleFieldProps) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/80 p-4">
            <div className="space-y-0.5">
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                    {label}
                </p>
                {hint && (
                    <p className="font-mono text-[10px] text-slate-500">// {hint}</p>
                )}
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-200 ${checked
                        ? "border-orange-500 bg-orange-500/20"
                        : "border-slate-800 bg-slate-900"
                    }`}
            >
                <span
                    className={`absolute top-0.5 flex h-4 w-4 items-center justify-center rounded-full transition-all duration-200 ${checked
                            ? "left-[22px] bg-orange-500 text-slate-950"
                            : "left-1 bg-slate-600"
                        }`}
                >
                    {checked && <Check size={10} strokeWidth={3} />}
                </span>
            </button>
        </div>
    );
}

// --- TAGS INPUT FIELD ---
export function TagsInputField({
    label,
    tags,
    onChange,
    placeholder,
}: TagsInputFieldProps) {
    const [draft, setDraft] = useState("");

    function addTag() {
        const value = draft.trim();
        if (value && !tags.includes(value)) {
            onChange([...tags, value]);
        }
        setDraft("");
    }

    function removeTag(tagToRemove: string) {
        onChange(tags.filter((t) => t !== tagToRemove));
    }

    return (
        <FieldWrapper label={label}>
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 transition-all duration-200 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500/50">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 font-mono text-xs font-semibold text-orange-400"
                    >
                        <span>{tag}</span>
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-orange-400/70 hover:text-orange-300"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}

                <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            addTag();
                        } else if (e.key === "Backspace" && !draft && tags.length) {
                            removeTag(tags[tags.length - 1]);
                        }
                    }}
                    onBlur={addTag}
                    placeholder={tags.length ? "" : placeholder}
                    className="min-w-[120px] flex-1 bg-transparent font-sans text-sm text-slate-100 placeholder-slate-600 outline-none"
                />
            </div>
        </FieldWrapper>
    );
}