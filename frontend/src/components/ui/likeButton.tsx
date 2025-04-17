import React from "react";
import { FaHeart } from "react-icons/fa";
import { useLikeCount } from "../../hooks/useLikeCount";

interface LikeButtonProps {
  commentId: string;
  initialLikeCount: number;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  commentId,
  initialLikeCount,
}) => {
  const { likeCount, hasLiked, toggleLike, isLoading } = useLikeCount(
    commentId,
    initialLikeCount
  );

  return (
    <div
      className={`comment-action ${hasLiked ? "liked" : ""} ${
        isLoading ? "loading" : ""
      }`}
      onClick={toggleLike}
      aria-label={hasLiked ? "Unlike" : "Like"}
      role="button"
      tabIndex={0}
    >
      <span>
        <FaHeart color={hasLiked ? "red" : "gray"} />
      </span>{" "}
      {likeCount}
    </div>
  );
};
