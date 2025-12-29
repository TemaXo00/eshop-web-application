import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {useRouter} from 'vue-router';
import api from '@/config/api.config';
import type {LoginDto, RegisterDto, User} from '@/types/auth.type';

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();

    const user = ref<User | null>(null);
    const accessToken = ref<string>('');
    const isLoading = ref(false);
    const error = ref<string>('');

    const savedUser = localStorage.getItem('auth_user');
    const savedToken = localStorage.getItem('auth_token');

    if (savedUser) {
        try {
            user.value = JSON.parse(savedUser);
        } catch {
            localStorage.removeItem('auth_user');
        }
    }

    if (savedToken) {
        accessToken.value = savedToken;
    }

    const isAuthenticated = computed(() => {
        return !!accessToken.value && !!user.value;
    });

    const fullName = computed(() => {
        if (!user.value) return '';
        const firstName = user.value.first_name || '';
        const lastName = user.value.last_name || '';
        return `${firstName} ${lastName}`.trim();
    });

    const saveToStorage = () => {
        if (user.value) {
            localStorage.setItem('auth_user', JSON.stringify(user.value));
        } else {
            localStorage.removeItem('auth_user');
        }

        if (accessToken.value) {
            localStorage.setItem('auth_token', accessToken.value);
        } else {
            localStorage.removeItem('auth_token');
        }
    };

    const setUser = (userData: User | null) => {
        user.value = userData;
        saveToStorage();
    };

    const setToken = (token: string) => {
        accessToken.value = token;
        saveToStorage();
    };

    const decodeToken = (token: string | undefined | null) => {
        if (!token) return null;

        try {
            const parts = token.split('.');
            if (parts.length !== 3) return null;

            return JSON.parse(atob(parts[1]));
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    };

    const login = async (data: LoginDto) => {
        isLoading.value = true;
        error.value = '';

        try {
            const response = await api.post('/auth/login', data);
            const token = response.data?.data?.accessToken;

            if (!token) {
                error.value = 'No access token received';
                return { success: false };
            }

            setToken(token);

            const payload = decodeToken(token);
            if (payload) {
                const userData: User = {
                    id: payload.id || Date.now(),
                    first_name: 'User',
                    last_name: null,
                    username: null,
                    avatar_url: null,
                    status: 'ACTIVE',
                    role: payload.role || 'USER',
                    phone: '',
                    email: data.email,
                    created_at: new Date().toISOString(),
                };
                setUser(userData);
            }

            await router.push('/');
            return { success: true };

        } catch (err: any) {
            error.value = err.response?.data?.message || err.message || 'Login failed';
            return { success: false };
        } finally {
            isLoading.value = false;
        }
    };

    const register = async (data: RegisterDto) => {
        isLoading.value = true;
        error.value = '';

        try {
            const response = await api.post('/auth/register', data);
            const token = response.data?.data?.accessToken;

            if (!token) {
                error.value = 'No access token received';
                return { success: false };
            }

            setToken(token);

            const payload = decodeToken(token);
            if (payload) {
                const userData: User = {
                    id: payload.id || Date.now(),
                    first_name: data.first_name,
                    last_name: data.last_name || null,
                    username: data.username || null,
                    avatar_url: data.avatar_url || null,
                    status: 'ACTIVE',
                    role: payload.role || 'USER',
                    phone: data.phone,
                    email: data.email,
                    created_at: new Date().toISOString(),
                };
                setUser(userData);
            }

            await router.push('/');
            return { success: true };

        } catch (err: any) {
            error.value = err.response?.data?.message || err.message || 'Registration failed';
            return { success: false };
        } finally {
            isLoading.value = false;
        }
    };

    const refreshToken = async () => {
        try {
            const response = await api.post('/auth/refresh', {});
            const token = response.data?.data?.accessToken;
            if (token) {
                setToken(token);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout', {});
        } finally {
            setUser(null);
            setToken('');
            error.value = '';
            await router.push('/login');
        }
    };

    return {
        user,
        accessToken,
        isLoading,
        error,
        isAuthenticated,
        fullName,
        login,
        register,
        logout,
        refreshToken,
    };
});