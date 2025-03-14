import { ReactNode, ChangeEvent } from "react";

interface InputProps {
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

export const Input = ({ label, name, type, id, value, onChange, error, required }: InputProps) => (
    <div className="input-group">
        <label htmlFor={id}>{label}</label>
        <input
            type={type}
            name={name}
            id={id}
            value={value}
            onChange={onChange}
            required={required}
        />
        {error && <span className="error">{error}</span>}
    </div>
);

