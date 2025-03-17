import axios from 'axios';

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

        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, apiData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;

    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};