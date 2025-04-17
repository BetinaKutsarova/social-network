export interface PasswordStrengthIndicatorProps {
    password: string;
}

export interface StrengthResult {
    score: number;
    label: string;
    color?: string;
    percent?: number;
}