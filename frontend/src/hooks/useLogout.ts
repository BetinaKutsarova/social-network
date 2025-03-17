import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
    const navigate = useNavigate();

    const logout = () => {
        Cookies.remove('auth_token');

        // localStorage.removeItem('user');

        navigate('/login');
    };

    return { logout };
};