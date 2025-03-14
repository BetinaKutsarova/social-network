import axios from 'axios';

interface UserData {
    username: string;
    email: string;
    password: string;
}

/**
 * Sends registration data to the Koa API
 * @param userData User registration information
 * @returns Promise that resolves on successful registration
 */

export const registerUser = async (userData: UserData) => {
    try {
        const apiData = {
            name: userData.username,
            email: userData.email,
            password: userData.password,
            role: 'user'
        };

        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, apiData, {
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