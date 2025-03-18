import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useLogout = () => {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            const token = Cookies.get('auth_token');
            
            if (token) {
                await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            
            Cookies.remove('auth_token');
            navigate('/login');

        } catch (error) {
            console.error('Logout error:', error);
            Cookies.remove('auth_token');
            navigate('/login');
        }
    };

    return { logout };
};