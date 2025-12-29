import axios from "axios";
import {useAuthStore} from "@/stores/auth.store.ts";

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    timeout: 30000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        const token = authStore.accessToken;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 &&
            originalRequest.headers.Authorization &&
            !originalRequest._retry) {

            originalRequest._retry = true;

            try {
                const authStore = useAuthStore();
                const refreshed = await authStore.refreshToken();

                if (refreshed) {
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.log('Token refresh failed');
            }
        }

        return Promise.reject(error);
    }
);

export default api