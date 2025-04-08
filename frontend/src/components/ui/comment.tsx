import React from "react";
import { FaHeart } from "react-icons/fa";
import { formatDate } from "../../utils/formatDate";

export interface CommentInterface {
  id: string;
  content: string;
  createdAt: string;
  likes: number;
  author: {
    username: string;
    avatarUrl: string;
  };
}
export interface CommentProps {
  comment: CommentInterface;
}

export const Comment: React.FC<CommentProps> = ({ comment }) => {
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
        </div>
      </div>
    </div>
  );
};
