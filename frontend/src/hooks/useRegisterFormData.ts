import { useState, ChangeEvent, useCallback } from 'react';
import { registerValidator } from '../utils/registerValidator';
import { RegisterErrors } from '../interfaces/error';
import { RegisterFormData } from '../interfaces/form';

export const useRegisterFormData = () => {
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

	const handleChange = useCallback((e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		setRegisterFormData(prev => ({ ...prev, [name]: value }));

		if (name === 'username' || name === 'email' || name === 'password') {
			const error = registerValidator(name, value);
			setErrors(prev => ({ ...prev, [name]: error }));
		}
	}, []);

	const isRegisterFormValid = useCallback(() => {
		const usernameError = registerValidator("username", registerFormData.username);
		const emailError = registerValidator("email", registerFormData.email);
		const passwordError = registerValidator("password", registerFormData.password);

		const newErrors = {
			username: usernameError,
			email: emailError,
			password: passwordError,
		};

		setErrors(newErrors);

		return !Object.values(newErrors).some(error => error !== "");
	}, [registerFormData]);

	const resetForm = useCallback(() => {
		setRegisterFormData({
			username: "",
			email: "",
			password: "",
			role: "user",
		});

		setErrors({
			username: "",
			email: "",
			password: "",
		});
	}, []);


	return {
		registerFormData,
		handleChange,
		resetForm,
		errors,
		isRegisterFormValid
	};
};