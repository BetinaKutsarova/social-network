import { ReactNode, ChangeEvent } from "react";

export interface InputProps {
    label: string;
    name: string;
    type: string;
    id: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error: string;
    required?: boolean;
    children?: ReactNode;
}