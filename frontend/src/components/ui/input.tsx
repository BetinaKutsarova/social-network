import { InputProps } from "../../interfaces/input";

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
        {error ? <span className="error">{error}</span>: <span className="error"></span>}
    </div>
);

