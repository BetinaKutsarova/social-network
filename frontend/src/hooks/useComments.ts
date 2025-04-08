import { useState, useEffect, useCallback } from "react";
import { CommentInterface } from "../components/ui/comment";
import { api } from "../services/api";

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<CommentInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/post/${postId}/comment`);
      setComments(response.data);
    } catch (err) {
      setError("Error loading comments. Please try again later.");
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const refreshComments = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments, refreshTrigger]);

  return { comments, loading, error, refreshComments };
};
