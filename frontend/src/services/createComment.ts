import { api } from './api';

export interface CreateCommentData {
	content: string;
}

export const createComment = async (postId: string, commentData: CreateCommentData) => {
	const response = await api.post(`/post/${postId}/comment`, commentData, {
	});
	return response.data;
};