import { useState, FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Message } from '../../components/ui/message';
import { registerValidator } from '../../utils/registerValidator';
import { PasswordStrengthIndicator } from '../../components/ui/passwordStrengthIndicator/passwordStrengthIndicator';
import { registerUser } from '../../services/registerUser';

interface FormData {
  username: string;
  email: string;
  password: string;
}

export const Register: React.FC = () => {
    const [submitMessage, setSubmitMessage] = useState<string>("");
    const [messageType, setMessageType] = useState<string>("");
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        username: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<FormData>({
        username: "",
        email: "",
        password: "",
    });

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        const error = registerValidator(name as keyof FormData, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const newErrors: FormData = {
            username: registerValidator("username", formData.username),
            email: registerValidator("email", formData.email),
            password: registerValidator("password", formData.password),
        };

        setErrors(newErrors);
        const newErrorValues = Object.values(newErrors);

        if (newErrorValues.every(error => error === "")) {
            const userData: FormData = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            };

            registerUser(userData)
            .then((response) => {
                console.log('Registration successful:', response);
                setMessageType("success");
                setSubmitMessage("Yay! Successfully registered!");

                setTimeout(() => {
                    navigate('/home');
                }, 1500);

                setFormData({
                    username: "",
                    email: "",
                    password: "",
                });
            })
            .catch(error => {
                console.error('Registration error:', error);
                setMessageType("error");
                if (error.response && error.response.data && error.response.data.message) {
                    setSubmitMessage(error.response.data.message);
                } else {
                    setSubmitMessage("Registration failed. Please try again.");
                }
            });
        } else {
            setMessageType("error");
            setSubmitMessage("Oh no! You have a boo boo:(");
        }
    }

    return (
        <div className="form-container">
            <h1 className="title">Register</h1>
            <form onSubmit={handleSubmit} className="form">
                <Input
                    label="Username"
                    name="username"
                    type="text"
                    id="usernameid"
                    value={formData.username}
                    onChange={handleChange}
                    error={errors.username}
                    required
                />

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
                >
                    <PasswordStrengthIndicator password={formData.password} />
                </Input>
                <button type="submit">Register</button>
                {submitMessage && <Message type={messageType}>{submitMessage}</Message>}
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </form>
        </div>
    );
}