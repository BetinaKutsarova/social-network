import { useState, ChangeEvent, useCallback } from 'react';
import { loginValidator } from '../utils/loginValidator';
import { LoginErrors } from '../interfaces/error';
import { LoginFormData } from '../interfaces/form';

export const useLoginFormData = () => {
	const [loginFormData, setLoginFormData] = useState<LoginFormData>({
		email: "",
		password: ""
	});

	const [errors, setErrors] = useState<LoginErrors>({ 
		email: "",
		password: "",
	});

	const handleChange = useCallback((e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		setLoginFormData(prev => ({ ...prev, [name]: value }));

		if (name === 'email' || name === 'password') {
			const error = loginValidator(name, value);
			setErrors(prev => ({ ...prev, [name]: error }));
		}
	}, []);

	const isLoginFormValid = useCallback(() => {
		const emailError = loginValidator("email", loginFormData.email);
		const passwordError = loginValidator("password", loginFormData.password);

		const newErrors = {
			email: emailError,
			password: passwordError,
		};

		setErrors(newErrors);

		return !Object.values(newErrors).some(error => error !== "");
	}, [loginFormData]);

	const resetForm = useCallback(() => {
		setLoginFormData({
			email: "",
			password: "",
		});

		setErrors({
			email: "",
			password: "",
		});
	}, []);


	return {
		loginFormData,
		handleChange,
		resetForm,
		errors,
		isLoginFormValid
	};
};