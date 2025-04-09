import { api } from "./api";

export const deleteComment = async (postId: string, commentId: string) => {
  const response = await api.delete(`/post/${postId}/comment/${commentId}`);
  return response.data;
};

