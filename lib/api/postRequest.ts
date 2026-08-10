import { AxiosRequestConfig } from "axios";
import { makeRequest } from "./MakeRequest";
import {
    LoginPayload,
    LoginResponse,
    CreateCommunityPayload,
    CreateCommunityResponse,
    CreateEventPayload,
    CreateEventResponse,
    BloodRequestPayload,
    BloodRequestResponse
} from "./interfaces";
import { getToken } from "../auth-client";

const baseConfig: AxiosRequestConfig = {
    method: 'POST',
    headers: {
        "Content-Type": "application/json",
    },
}

export function loginRequest(data: LoginPayload, headers?: AxiosRequestConfig["headers"]): Promise<LoginResponse> {
    return makeRequest<LoginResponse>({
        ...baseConfig,
        url: '/user/login',
        data,
        headers: {
            ...baseConfig.headers,
            ...headers,
        }
    })
}

export function createCommunity(data: CreateCommunityPayload, headers?: AxiosRequestConfig["headers"]): Promise<CreateCommunityResponse> {
    const token = getToken();

    return makeRequest<CreateCommunityResponse>({
        ...baseConfig,
        url: '/communities',
        data,
        headers: {
            ...baseConfig.headers,
            Authorization: token ? `Bearer ${token}` : undefined,
            ...headers,
        }
    })
}

export function createEventsApi(data: CreateEventPayload, headers?: AxiosRequestConfig['headers']): Promise<CreateEventResponse> {
    const token = getToken();

    return makeRequest<CreateEventResponse>({
        ...baseConfig,
        url: '/home/createEvents',
        data,
        headers: {
            ...baseConfig.headers,
            Authorization: token ? `Bearer ${token}` : undefined,
            ...headers,
        }
    })
}

export function createBloodRequest(payload: BloodRequestPayload, headers?: AxiosRequestConfig['headers']): Promise<BloodRequestResponse> {
    const token = getToken();
    return makeRequest<BloodRequestResponse>({
        ...baseConfig,
        url: '/blood',
        data: payload,
        headers: {
            ...baseConfig.headers,
            Authorization: token ? `Bearer ${token}` : undefined,
            ...headers,
        }
    })
}