import { api } from './api';

export interface CreatePostData {
  content: string;
}

export const createPost = async (postData: CreatePostData) => {
  const response = await api.post('/post', postData, {
  });
  return response.data;
};