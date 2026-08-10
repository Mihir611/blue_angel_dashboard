import { AxiosRequestConfig } from "axios";
import { makeRequest } from "./MakeRequest";
import { getToken } from "../auth-client";
import { GetCommunitiesParams, CommunitiesGetResponse, CommunityGetByIdResponse, GetEvents, GetEventById } from "./interfaces";

export function getAuthHeaders(): AxiosRequestConfig['headers'] {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

const baseConfig: AxiosRequestConfig = {
    method: 'GET',
    headers: {
        "Content-Type": "application/json",
    },
}

export function getCommunities(params?: GetCommunitiesParams, headers?: AxiosRequestConfig["headers"]): Promise<CommunitiesGetResponse> {
    return makeRequest<CommunitiesGetResponse>({
        ...baseConfig,
        url: '/communities',
        params,
        headers: {
            ...baseConfig.headers,
            ...getAuthHeaders(),
            ...headers,
        }
    })
}

export function getCommunityById(id: string, headers?: AxiosRequestConfig["headers"]): Promise<CommunityGetByIdResponse> {
    return makeRequest<CommunityGetByIdResponse>({
        ...baseConfig,
        url: `/communities/${id}`,
        headers: {
            ...baseConfig.headers,
            ...getAuthHeaders(),
            ...headers,
        }
    })
}

export function getEvents(headers?: AxiosRequestConfig["headers"]): Promise<GetEvents> {
    return makeRequest<GetEvents>({
        ...baseConfig,
        url: '/home/getEvents',
        headers: {
            ...baseConfig.headers,
            ...getAuthHeaders(),
            ...headers,
        }
    })
}

export function getEventByID(id: string, headers?: AxiosRequestConfig["headers"]): Promise<GetEventById> {
    return makeRequest<GetEventById>({
        ...baseConfig,
        url: `/home/Event?eventId=${id}`,
        headers: {
            ...baseConfig.headers,
            ...getAuthHeaders(),
            ...headers,
        }
    })
}