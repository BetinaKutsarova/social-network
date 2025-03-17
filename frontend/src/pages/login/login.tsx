import React from 'react';
import { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Message } from '../../components/ui/message';
import { Input } from '../../components/ui/input';
import { loginValidator } from '../../utils/loginValidator';
import { loginUser } from '../../services/loginUser';
import { LoginFormData } from '../../types/form.types';
import { LoginErrors } from '../../types/error.types';
import Cookies from 'js-cookie';

export const Login: React.FC = () => {
    const [submitMessage, setSubmitMessage] = useState<string>("");
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');
    const navigate = useNavigate();

    const [loginFormData, setLoginFormData] = useState<LoginFormData>({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState<LoginErrors>({
        email: "",
        password: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginFormData(prev => ({
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
            email: loginValidator("email", loginFormData.email),
            password: loginValidator("password", loginFormData.password),
        };

        setErrors(newErrors);
        const newErrorValues = Object.values(newErrors);
        if (newErrorValues.every(error => error === "")) {
            const userData: LoginFormData = {
                email: loginFormData.email,
                password: loginFormData.password,
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

                    setLoginFormData({
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
        } else {
            setMessageType("error");
            setSubmitMessage("Oh no! You have a boo boo:(");
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
                    value={loginFormData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                />
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    id="passwordid"
                    value={loginFormData.password}
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