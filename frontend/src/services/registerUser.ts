import { api } from './api';
import { RegisterFormData } from '../interfaces/form';

export const registerUser = async (userData: RegisterFormData) => {
		const response = await api.post('/auth/register', userData);
		return response.data;
};