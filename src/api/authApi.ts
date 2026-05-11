// src/api/authApi.ts

import axiosClient from "./apiClient";

// type interfaces 
export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export const loginApi = (data: LoginRequest) => {
    return axiosClient.post<LoginResponse>("/auth/login", data);
};


