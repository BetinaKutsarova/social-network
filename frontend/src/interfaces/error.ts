export interface LoginErrors {
    email: string;
    password: string;
}

export interface RegisterErrors {
    username: string;
    email: string;
    password: string;
    role?: string;
}