import { useState, useEffect } from 'react';
import { api } from '../services/api';

export const useVerify = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		api.get('/auth/verify')
			.then(() => {
				setIsAuthenticated(true);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error('Authentication error:', error);
				setIsAuthenticated(false);
				setIsLoading(false);
			});
	}, []);

	return { isAuthenticated, isLoading };
};