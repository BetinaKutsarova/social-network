import { api } from './api';

export interface PostData {
	content: string;
}

export const deletePost = async (postId: string) => {
  const response = await api.delete(`/post/${postId}`);
  return response.data;
};