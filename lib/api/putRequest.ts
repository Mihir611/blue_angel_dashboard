import { AxiosRequestConfig } from "axios";
import { makeRequest } from "./MakeRequest";
import { EventUpdatePayload, UpdateEventResponse } from "./interfaces";
import { getAuthHeaders } from "./getRequests";

const baseConfig: AxiosRequestConfig = {
    method: 'PUT',
    headers: {
        "Content-Type": "application/json",
    },
}

export function updateEventApi(id: string, data: EventUpdatePayload, headers?: AxiosRequestConfig['headers']): Promise<UpdateEventResponse> {
    return makeRequest({
        ...baseConfig,
        url: `/updateEvent/${id}`,
        data,
        headers: {
            ...baseConfig.headers,
            ...getAuthHeaders(),
            ...headers,
        }
    })
}