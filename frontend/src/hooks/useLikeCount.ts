import { useAtom } from "jotai";
import { likeCountsAtom, userLikedStatusAtom } from "../state/atoms";
import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";

export const useLikeCount = (commentId: string, initialCount: number = 0) => {
  const [likeCounts, setLikeCounts] = useAtom(likeCountsAtom);
  const [userLikedStatus, setUserLikedStatus] = useAtom(userLikedStatusAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const likeCount = likeCounts[commentId] ?? initialCount;
  const hasLiked = userLikedStatus[commentId] ?? false;

  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const response = await api.get(`/comment/${commentId}/like/count`);
        const count = response.data.count;

				console.log(count)

        setLikeCounts((prev) => ({
          ...prev,
          [commentId]: count,
        }));
      } catch (err) {
        console.error("Error fetching like count:", err);
        setLikeCounts((prev) => ({
          ...prev,
          [commentId]: initialCount,
        }));
      }
    };

    fetchLikeCount();

  }, [commentId, initialCount, setLikeCounts]);

  const toggleLike = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      if (!hasLiked) {
        await api.post(`/comment/${commentId}/like`);
        setLikeCounts((prev) => ({
          ...prev,
          [commentId]: (prev[commentId] || 0) + 1,
        }));
        setUserLikedStatus((prev) => ({
          ...prev,
          [commentId]: true,
        }));
      } else {
        await api.delete(`/comment/${commentId}/like`);
        setLikeCounts((prev) => ({
          ...prev,
          [commentId]: Math.max(0, (prev[commentId] || 0) - 1),
        }));
        setUserLikedStatus((prev) => ({
          ...prev,
          [commentId]: false,
        }));
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred with liking the comment"
      );
    } finally {
      setIsLoading(false);
    }
  }, [commentId, hasLiked, isLoading, setLikeCounts, setUserLikedStatus]);

  return { likeCount, hasLiked, toggleLike, isLoading, error };
};
