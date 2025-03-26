import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Message } from '../../components/ui/message';
import { PasswordStrengthIndicator } from '../../components/ui/passwordStrengthIndicator';
import { registerUser } from '../../services/registerUser';
import { RegisterFormData } from '../../interfaces/form';
import { useRegisterFormData } from '../../hooks/useRegisterFormData';

export const Register: React.FC = () => {
	const [submitMessage, setSubmitMessage] = useState<string>("");
	const [messageType, setMessageType] = useState<'error' | 'success'>('error');
	const navigate = useNavigate();

	const { registerFormData, handleChange, resetForm, errors, isRegisterFormValid } = useRegisterFormData();

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!isRegisterFormValid()) {
			setMessageType("error");
			setSubmitMessage("Please fix the errors in the form.");
			return;
		}

		const userData: RegisterFormData = {
			username: registerFormData.username,
			email: registerFormData.email,
			password: registerFormData.password,
			role: registerFormData.role
		};

		try {
			await registerUser(userData);
			navigate('/login');
			resetForm();
		} catch (error) {
			console.error('Registration error:', error);
			setMessageType("error");
			setSubmitMessage("Error in registration.");
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
							className="form-select animal-dropdown"
							required
						>
							<option value="user">User</option>
							<option value="trainer">Trainer</option>
						</select>
					</div>

					<button type="submit">Register</button>
					{submitMessage && <Message type={messageType}>{submitMessage}</Message>}
					<p>Already have an account? <Link to="/login">Login here</Link></p>
				</form>
			</div>
		</div>
	);
};