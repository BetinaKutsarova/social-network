import { useState, useEffect, useCallback } from 'react';
import { useAtom } from 'jotai';
import { activeSectionAtom, allPostsAtom, userAtom } from '../state/atoms';
import { api } from '../services/api';

export const useAllPosts = () => {
	const [user] = useAtom(userAtom);
	const [activeSection] = useAtom(activeSectionAtom);
	const [allPosts, setAllPosts] = useAtom(allPostsAtom);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchAllPosts = useCallback(async () => {
		if (!user?.id) return;

		setIsLoading(true);
		setError(null);

		try {
			const response = await api.get(`/post/`);
			setAllPosts(response.data);
		} catch (err) {
			console.error('Error fetching posts:', err);
			setError('Failed to load posts');
		} finally {
			setIsLoading(false);
		}
	}, [user?.id, setAllPosts]);

	useEffect(() => {
		if (activeSection === 'posts' && user?.id) {
			fetchAllPosts();
		}
	}, [activeSection, user?.id, fetchAllPosts]);

	return { allPosts, isLoading, error, refreshPosts: fetchAllPosts };
};