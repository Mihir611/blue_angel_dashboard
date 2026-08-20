import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { AnnouncementPriority } from ".";
export interface StoredUser {
    userId: string;
    email: string;
    role: string;
    riderLevel: string;
    isPlatformOwner: boolean;
}

export interface AuthSession {
    accessToken: string;
    refreshToken: string;
    user: StoredUser;
}

export interface LoginPayload {
    context: string;
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
        role: string;
        riderLevel: string;
        isPlatformOwner: boolean;
    };
}

//#region Community interfaces
export interface Community {
    _id: string;
    communityName: string;
    email: string;
    phoneNumber: string;
    logo: string;
    incorporationDate: string;
    description: string;
    tagline?: string;
    instagramHandle?: string;
    location: {
        city: string;
        state: string;
        country: string;
    };
    general: {
        name: string;
        email: string;
        phoneNumber: string;
    };
    hasSubCommunities: boolean;
    communityLevel: number;
    isPrivate?: boolean;
    memberCount?: Number;
    createdAt?: string;
    updatedAt?: string;
}

export interface GetCommunitiesParams {
    page?: number;
    limit?: number;
    city?: string;
    state?: string;
    country?: string;
}

export interface CommunitiesGetResponse {
    Success: boolean;
    results: number;
    total: number;
    page: number;
    totalPages: number;
    data: {
        communities: Community[];
    };
}

export interface CommunityGetByIdResponse {
    Success: boolean;
    data: {
        community: Community;
    };
}

export interface CommunityUpdatePayload {
    description: string;
    tagline: string;
    instagramHandle: string;
    hasSubCommunities: boolean;
    general: {
        email: string;
        phoneNumber: string
        name: string;
    }
}

export interface CommunityUpdateResponse {
    Success: boolean;
    data: { community: Community };
    message: string;
}

export interface CreateCommunityPayload {
    communityName: string,
    email: string,
    phoneNumber: string;
    logo: string,
    incorporationDate: string,
    description: string,
    tagline: string,
    instagramHandle: string,
    location: {
        city: string;
        state: string;
        country: string;
    },
    general: {
        name: string;
        email: string;
        phoneNumber: string;
    },
    hasSubCommunities: boolean,
}

export interface CreateCommunityResponse {
    Success: boolean,
    message: string
}
//#endregion Community interfaces

//#region CommunityApplication interfaces
export interface CommunityApplication {
    _id?: string;
    applicantUserId: string;
    communityName: string;
    email: string;
    phoneNumber: string;
    logo: string;
    incorporationDate: string;
    description: string;
    tagline?: string;
    instagramHandle?: string;
    location: {
        city: string;
        state: string;
        country: string;
    };
    status: 'pending' | 'approved' | 'rejected';
    reviewedBy: string | null;
    reviewedAt: string | null;
    rejectionReason: string | null;
    applicationId: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApplicantInfo {
    userName: string;
    contact: {
        email: string;
        phone: string;
    };
}

export interface GetCommunityApplicationResponse {
    Success: boolean;
    message: string;
    data: {applications: CommunityApplication[]};
}
//#endregion CommunityApplication interfaces

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

//#region Event interfaces
export interface Events {
    _id?: string;
    location: {
        city: string;
        state: string;
        country: string;
    },
    title: string;
    description: string;
    imageUrl: string;
    eventDate: string;
    category: string;
    price: Number;
    contactInfo: {
        email: string;
        phone: string;
    },
    tags: string;
    isActive: boolean;
}

export interface CreateEventResponse {
    success: boolean;
    message: string;
    data: Events
}

export interface CreateEventPayload {
    eventsData: Events;
}

export interface GetEvents {
    success: boolean;
    message: string;
    data: Events[];
}

export interface GetEventById {
    success: boolean;
    message: string;
    data: Events;
}

export interface EventUpdatePayload {
    eventsData: Partial<Omit<Events, "_id">>;
}

//#endregion Event interfaces

//#region Blood interfaces
export interface BloodRequestPayload {
    _id?: string;
    patientName: string;
    bloodGroup: string;
    unitsRequired: number;
    urgency: "critical" | "urgent" | "normal";
    hospital: {
        name: string;
        address: string;
        city: string;
        state?: string;
        location: {
            type: "Point";
            coordinates: [number, number]; // [lng, lat]
        };
    };
    contactNumber: string;
    alternateContactNumber?: string;
    requiredBy: string; // ISO date string
    createdBy: string;
    additionalNotes?: string;
}

export interface BloodRequestResponse {
    Success: boolean;
    data: { bloodRequest: any };
}

export interface GetBloodRequestParams {
    status?: "active" | "fulfilled" | "expired" | "cancelled";
    bloodGroup?: string;
    urgency?: "critical" | "urgent" | "normal";
    city?: string;
    page?: number;
    limit?: number;
}

export interface GetBloodRequests {
    Success: boolean;
    message: string;
    results: number;
    total: number;
    page: number;
    totalPages: number;
    data: { bloodRequests: BloodRequestPayload[] };
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
    disabled?: boolean;
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