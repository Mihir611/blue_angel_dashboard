export { makeRequest, axiosInstance } from './MakeRequest';
export type { ApiError } from './MakeRequest';

//Post Request Exports
export { loginRequest, createCommunity, createEventsApi, createBloodRequest } from './postRequest';
export { getCommunities, getCommunityById, getEvents, getEventByID, getBloodRequests, getApplications } from './getRequests';
export { updateCommunityData } from './patchRequest';
export { updateEventApi } from './putRequest';

//Interface exports
export type {
  LoginPayload,
  LoginResponse,
  Community,
  GetCommunitiesParams,
  CommunitiesGetResponse,
  CreateCommunityPayload,
  CreateCommunityResponse,
  CommunityUpdatePayload,
  CommunityUpdateResponse,
  Events,
  CreateEventPayload,
  CreateEventResponse,
  GetEvents,
  GetEventById,
  EventUpdatePayload,
  UpdateEventResponse,
  BloodRequestPayload,
  BloodRequestResponse,
  GetBloodRequests,
  GetBloodRequestParams,
  CommunityApplication,
  ApplicantInfo,
  GetCommunityApplicationResponse,
  NavItem,
  SidebarProps,
  DashboardLayoutProps,
  StatCardProps,
  DashboardModalProps,
  FieldWrapperProps,
  SelectFieldProps,
  ImageUploadFieldProps,
  ToggleFieldProps,
  TagsInputFieldProps,
  CreateModalProps,
  QuickActionCardProps,
  FeedPanelProps,
} from './interfaces';

export const ANNOUNCEMENT_PRIORITIES = ["info", "important", "urgent"] as const;
export type AnnouncementPriority = (typeof ANNOUNCEMENT_PRIORITIES)[number];

export const EVENT_CATEGORIES = [
  "Adventure",
  "hangout",
  "breakfast-ride",
  "lunch-ride",
  "dinner-ride",
  "touring",
  "racing",
  "other",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];