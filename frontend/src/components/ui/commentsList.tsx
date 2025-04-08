import React from "react";
import { Comment, CommentInterface } from "./comment";
import "./comment.css";

interface CommentsListProps {
	comments: CommentInterface[];
	loading: boolean;
	error: string;
}

export const CommentsList: React.FC<CommentsListProps> = ({comments, loading, error }) => {

  if (loading) {
    return <div className="comments-loading">Loading comments...</div>;
  }

  if (error) {
    return <div className="comments-error">{error}</div>;
  }

  if (comments?.length === 0) {
    return <div className="comments-empty">No comments yet</div>;
  }

  return (
    <div className="comments-list">
      {comments?.length > 0 &&
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
    </div>
  );
};

