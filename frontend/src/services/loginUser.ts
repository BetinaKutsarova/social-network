import { api } from './api';
import { LoginFormData } from '../interfaces/form';

export const loginUser = async (userData: LoginFormData) => {
	const response = await api.post('/auth/login', userData);
	return response.data;
};