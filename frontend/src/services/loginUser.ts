import { api } from './api';

interface UserData {
    email: string;
    password: string;
}

export const loginUser = async (userData: UserData) => {
	try {
			const apiData = {
					email: userData.email,
					password: userData.password,
			};

			const response = await api.post('/auth/login', apiData);
			return response.data;

	} catch (error) {
			console.error('Login error:', error);
			throw error;
	}
};