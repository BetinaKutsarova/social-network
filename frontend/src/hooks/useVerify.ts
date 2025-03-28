import { useAtom } from 'jotai';
import { useState, useEffect, useCallback } from 'react';
import { userAtom } from '../state/atoms';
import { api } from '../services/api';

export const useVerify = () => {
  const [user, setUser] = useAtom(userAtom);
  const [isLoading, setIsLoading] = useState(true);

	const verifyAuth = useCallback(async (): Promise<void> => {
		if (user) {
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		try {
			const response = await api.get('/auth/verify');
			setUser(response.data.user);
		} catch (error) {
			console.error('Authentication error:', error);
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	}, [setUser, user]);
	
	useEffect(() => {
		verifyAuth();
	}, [verifyAuth]);

  return { 
    user, 
    isAuthenticated: !!user,
    isLoading,
    verifyAuth
  };
};