import { AxiosRequestConfig } from "axios";
import { makeRequest } from "./MakeRequest";
import { getAuthHeaders } from "./getRequests";
import { CommunityUpdatePayload, CommunityUpdateResponse, EventUpdatePayload, GetEventById } from ".";

const baseConfig: AxiosRequestConfig = {
    method: 'PATCH',
    headers: {
        "Content-Type": "application/json",
    }
}

export function updateCommunityData(id: string, data: CommunityUpdatePayload, headers?: AxiosRequestConfig["headers"]): Promise<CommunityUpdateResponse> {
    return makeRequest<CommunityUpdateResponse>({
        ...baseConfig,
        url: `/communities/${id}`,
        data,
        headers: {
            ...baseConfig.headers,
            ...getAuthHeaders(),
            ...headers,
        }
    })
}

export function updateEventsData(id: string, data: EventUpdatePayload, headers?: AxiosRequestConfig["headers"]): Promise<GetEventById> {
    return makeRequest<GetEventById>({
        ...baseConfig,
        url: `/home/Events/${id}`,
        data,
        headers: {
            ...baseConfig.headers,
            ...getAuthHeaders(),
            ...headers,
        }
    })
}