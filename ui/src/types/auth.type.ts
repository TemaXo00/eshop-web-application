export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    first_name: string;
    last_name?: string;
    email: string;
    password: string;
    phone: string;
    username?: string;
    avatar_url?: string;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string | null;
    username: string | null;
    avatar_url: string | null;
    status: 'ACTIVE' | 'BANNED' | 'DELETED';
    role: string;
    phone: string;
    email: string;
    created_at: string;
}