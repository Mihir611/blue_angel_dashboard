import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { AnnouncementPriority } from ".";
export interface StoredUser {
    userId: string;
    email: string;
}

export interface AuthSession {
    accessToken: string;
    refreshToken: string;
    user: StoredUser;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    Success: boolean;
    tokens: {
        accessToken: string;
        refreshToken: string;
        generatedAt: number;
    }
    user: {
        userId: string;
        email: string;
    };
}

export interface CreateAnnouncementPayload {
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
  displayOrder: number;
  isActive: boolean;
  priority: AnnouncementPriority;
  expiresAt?: string; // ISO date string; omit for an announcement that never expires
}

export interface CreateAnnouncementResponse {
  id: string;
  title: string;
}

//#region Dashboard Interfaces
export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

export interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export interface DashboardLayoutProps {
    children: ReactNode;
    title: string;
    subTitle?: string;
}

export interface StatCardProps {
    label: string;
    value: string;
    delta?: string;
    deltaTone?: "up" | "down" | "neutral";
    icon?: ReactNode;
}

export interface DashboardModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export interface FieldWrapperProps {
    label: string;
    children: ReactNode;
}

export interface SelectFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
}

export interface ImageUploadFieldProps {
    label: string;
    value: string | null;
    onChange: (dataUrl: string | null) => void;
    hint?: string;
}

export interface ToggleFieldProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    hint?: string;
}

export interface TagsInputFieldProps {
    label: string;
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
}

export interface CreateModalProps {
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

export interface QuickActionCardProps {
    icon: ReactNode;
    label: string;
    description: string;
    onClick: () => void;
    accentColor?: string;
}

export interface FeedPanelProps {
    title: string;
    onAdd: () => void;
    children: ReactNode;
}