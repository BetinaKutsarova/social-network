import React from "react";
import { FaHeart, FaTrash } from "react-icons/fa";
import { formatDate } from "../../utils/formatDate";
import { useAtom } from "jotai";
import { userAtom } from "../../state/atoms";
import { deleteComment } from "../../services/deleteComment";

export interface CommentInterface {
  id: string;
	postId: string;
  content: string;
  createdAt: string;
  likes: number;
  author: {
    id: string;
    username: string;
    avatarUrl: string;
  };
}
export interface CommentProps {
  comment: CommentInterface;
  onCommentDeleted: () => void;
}

export const Comment: React.FC<CommentProps> = ({
  comment,
  onCommentDeleted,
}) => {
  const [user] = useAtom(userAtom);

  const canDelete =
    user && (user.id === comment.author.id || user.role === "admin");

  const handleDelete = async () => {
    try {
      await deleteComment(comment.postId, comment.id);
      if (onCommentDeleted) {
        onCommentDeleted();
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <div className="comment">
      <div className="comment-header">
        <div className="comment-user-info">
          <div className="comment-meta">
            <span className="comment-username">{comment.author.username}</span>
            <span className="comment-time">·</span>
            <span className="comment-time">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="comment-content">{comment.content}</p>
        </div>

        <div className="comment-actions">
          <div className="comment-action">
            <span>
              <FaHeart />
            </span>{" "}
            {comment.likes}
          </div>
          <div className="comment-action">
            {canDelete && (
              <span
                onClick={handleDelete}
                aria-label="Delete comment"
                title="Delete comment"
              >
                <FaTrash />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
