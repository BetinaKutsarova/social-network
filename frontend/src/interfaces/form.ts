export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    role: 'user' | 'trainer' | 'admin'
}

export interface UpdateUserData {
	username?: string;
	email?: string;
	avatarUrl?: string;
}