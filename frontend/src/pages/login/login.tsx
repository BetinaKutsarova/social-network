import React from 'react';
import { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Message } from '../../components/ui/message';
import { Input } from '../../components/ui/input';
import { loginValidator } from '../../utils/loginValidator';
import { loginUser } from '../../services/loginUser';
import Cookies from 'js-cookie';

interface FormData {
    email: string;
    password: string;
}

interface ErrorsType {
    email: string;
    password: string;
}

export const Login: React.FC = () => {
    const [submitMessage, setSubmitMessage] = useState<string>("");
    const [messageType, setMessageType] = useState<string>("");
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState<ErrorsType>({
        email: "",
        password: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        const error = loginValidator(name as "email" | "password", value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors = {
            email: loginValidator("email", formData.email),
            password: loginValidator("password", formData.password),
        };

        setErrors(newErrors);
        const newErrorValues = Object.values(newErrors);
        if (newErrorValues.every(error => error === "")) {
            const userData: FormData = {
                email: formData.email,
                password: formData.password,
            };

            loginUser(userData)
                .then((response) => {
                    console.log('Login successful:', response);
                    setMessageType("success");
                    setSubmitMessage("Successfully logged in!");

                    Cookies.set('auth_token', response.token, { 
                        expires: 1,
                        secure: import.meta.env.PROD,
                        sameSite: 'strict'
                    });

                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 1500);

                    setFormData({
                        email: "",
                        password: "",
                    });
                })
                .catch(error => {
                    console.error('Login error:', error);
                    setMessageType("error");
                    if (error.response && error.response.data && error.response.data.message) {
                        setSubmitMessage(error.response.data.message);
                    } else {
                        setSubmitMessage("Login failed. Please try again.");
                    }
                });
        }
    }

    return (
        <div className="form-container">
            <h1 className="title">Login</h1>
            <form onSubmit={handleSubmit} className="form">
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    id="emailid"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                />
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    id="passwordid"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                />
                <button type="submit">Login</button>
                {submitMessage && <Message type={messageType}>{submitMessage}</Message>}
                <p>Don&apos;t have an account? <Link to="/register">Register here</Link></p>
            </form>
        </div>
    );
};