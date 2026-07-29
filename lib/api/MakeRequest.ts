import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { getToken, clearToken } from "../auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            clearToken();
        }
        return Promise.reject(error);
    }
);

export interface ApiError {
    message: string;
    status?: number;
    raw: unknown;
}

function toApiError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
        const axiosErr = error as AxiosError<{ error?: string; message?: string }>;
        return {
            message:
                axiosErr.response?.data?.error ||
                axiosErr.response?.data?.message ||
                axiosErr.message ||
                "Something went wrong.",
            status: axiosErr.response?.status,
            raw: error,
        };
    }
    return { message: "Something went wrong.", raw: error };
}

export async function makeRequest<TResponse = unknown>(
    config: AxiosRequestConfig
): Promise<TResponse> {
    try {
        const response = await axiosInstance.request<TResponse>(config);
        return response.data;
    } catch (error) {
        throw toApiError(error);
    }
}