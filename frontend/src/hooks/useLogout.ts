import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const useLogout = () => {
	const navigate = useNavigate();

	const logout = async () => {
		try {
			await api.post('/auth/logout');
			navigate('/login');
		} catch (error) {
			console.error('Logout error:', error);
			navigate('/login');
		}
	};

	return { logout };
};