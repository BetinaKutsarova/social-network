import axios from 'axios';
import { RegisterFormData } from '../interfaces/form';

export const registerUser = async (userData: RegisterFormData) => {
	try {
		const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, userData, {
			headers: {
				'Content-Type': 'application/json'
			}
		});

		return response.data;

	} catch (error) {
		console.error('Registration error:', error);
		throw error;
	}
};