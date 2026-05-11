import apiClient from '../../../api/apiClient';

import { type LoginRequest, type LoginResponse, type User } from '../types/auth.types';

export const authService = {
    login: (data: LoginRequest) => {
        return apiClient.post<LoginResponse>('/auth/login', data);
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getCurrentUser: (): User | null => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                username: payload.sub || payload.preferred_username,
                role: payload.role || 'USER',
                exp: payload.exp,
            };
        } catch {
            return null;
        }
    },

    isTokenValid: (): boolean => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp > currentTime;
        } catch {
            return false;
        }
    },
};
