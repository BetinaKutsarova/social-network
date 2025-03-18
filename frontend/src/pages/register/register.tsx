import { useState, FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Message } from '../../components/ui/message';
import { registerValidator } from '../../utils/registerValidator';
import { PasswordStrengthIndicator } from '../../components/ui/passwordStrengthIndicator';
import { registerUser } from '../../services/registerUser';
import { RegisterFormData } from '../../types/form.types';
import { RegisterErrors } from '../../types/error.types';

export const Register: React.FC = () => {
    const [submitMessage, setSubmitMessage] = useState<string>("");
    const [messageType, setMessageType] = useState<'error' | 'success'>('error');
    const navigate = useNavigate();

    const [registerFormData, setRegisterFormData] = useState<RegisterFormData>({
        username: "",
        email: "",
        password: "",
        role: "user"
    });

    const [errors, setErrors] = useState<RegisterErrors>({
        username: "",
        email: "",
        password: "",
    });

    function handleChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) {
        const { name, value } = e.target;
        setRegisterFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'username' || name === 'email' || name === 'password') {
            const error = registerValidator(name as 'username' | 'email' | 'password', value);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const newErrors: RegisterErrors = {
            username: registerValidator("username", registerFormData.username),
            email: registerValidator("email", registerFormData.email),
            password: registerValidator("password", registerFormData.password),
        };

        setErrors(newErrors);
        const newErrorValues = Object.values(newErrors);

        if (newErrorValues.every(error => error === "")) {
            const userData: RegisterFormData = {
                username: registerFormData.username,
                email: registerFormData.email,
                password: registerFormData.password,
                role: registerFormData.role
            };

            registerUser(userData)
                .then((response) => {
                    console.log('Registration successful:', response);
                    setMessageType("success");
                    setSubmitMessage("Yay! Successfully registered!");

                    setTimeout(() => {
                        navigate('/login');
                    }, 1500);

                    setRegisterFormData({
                        username: "",
                        email: "",
                        password: "",
                        role: "user"
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
        <div className='auth-container'>
        <div className="form-container">
            <h1 className="title">Register</h1>
            <form onSubmit={handleSubmit} className="form">
                <div>
                    <Input
                        label="Username"
                        name="username"
                        type="text"
                        id="usernameid"
                        value={registerFormData.username}
                        onChange={handleChange}
                        error={errors.username}
                        required
                    />
                </div>

                <div>
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        id="emailid"
                        value={registerFormData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                    />
                </div>

                <div>
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        id="passwordid"
                        value={registerFormData.password}
                        onChange={handleChange}
                        error={errors.password}
                        required
                    />
                </div>

                <PasswordStrengthIndicator password={registerFormData.password} />

                <div className='input-group'>
                    <label htmlFor="roleid">Role</label>
                    <select
                        name="role"
                        id="roleid"
                        value={registerFormData.role}
                        onChange={handleChange}
                        className="form-select"
                        required
                    >
                        <option value="user">User</option>
                        <option value="mentor">Mentor</option>
                    </select>
                </div>

                <button type="submit">Register</button>
                {submitMessage && <Message type={messageType}>{submitMessage}</Message>}
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </form>
        </div>
        </div>
    );
}