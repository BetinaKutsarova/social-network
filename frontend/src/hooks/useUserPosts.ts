import { useState, useEffect, useCallback } from 'react';
import { useAtom } from 'jotai';
import { activeSectionAtom, userPostsAtom, userAtom } from '../state/atoms';
import { api } from '../services/api';

export const useUserPosts = () => {
	const [user] = useAtom(userAtom);
	const [activeSection] = useAtom(activeSectionAtom);
	const [userPosts, setUserPosts] = useAtom(userPostsAtom);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchUserPosts = useCallback(async () => {
		if (!user?.id) return;

		setIsLoading(true);
		setError(null);

		try {
			const response = await api.get(`/post/${user.id}`);
			setUserPosts(response.data);
		} catch (err) {
			console.error('Error fetching posts:', err);
			setError('Failed to load posts');
		} finally {
			setIsLoading(false);
		}
	}, [user?.id, setUserPosts]);

	useEffect(() => {
		if (activeSection === 'posts' && user?.id) {
			fetchUserPosts();
		}
	}, [activeSection, user?.id, fetchUserPosts]);

	return { userPosts, isLoading, error, refreshPosts: fetchUserPosts };
};