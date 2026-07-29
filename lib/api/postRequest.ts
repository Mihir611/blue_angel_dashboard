import { AxiosRequestConfig } from "axios";
import { makeRequest } from "./MakeRequest";
import { LoginPayload, LoginResponse } from "./interfaces";

const baseConfig: AxiosRequestConfig = {
    method: 'POST',
    headers: {
        "Content-Type": "application/json",
    },
}

export function loginRequest(data: LoginPayload, headers?: AxiosRequestConfig["headers"]): Promise<LoginResponse> {
    return makeRequest <LoginResponse> ({
        ...baseConfig,
        url: '/user/login',
        data,
        headers: {
            ...baseConfig.headers,
            ...headers,
        }
    })
}