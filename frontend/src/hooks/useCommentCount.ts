import { useEffect } from "react";
import { useAtom } from "jotai";
import { commentCountFamily } from "../state/atoms";

export const useCommentCount = (postId: string, initialCount: number) => {
  const [commentCounts, setCommentCounts] = useAtom(commentCountFamily);
  const currentCommentCount = commentCounts[postId] ?? initialCount;

  useEffect(() => {
    if (commentCounts[postId] === undefined) {
      setCommentCounts((prev) => ({
        ...prev,
        [postId]: initialCount,
      }));
    }
  }, [postId, initialCount, commentCounts, setCommentCounts]);

  const incrementCommentCount = () => {
    setCommentCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1,
    }));
  };

  return {
    commentCount: currentCommentCount,
    incrementCommentCount,
  };
};
