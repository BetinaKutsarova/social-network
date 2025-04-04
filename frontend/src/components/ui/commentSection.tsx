import React, { useState } from "react";
import { api } from "../../services/api";
import { CreateCommentData } from "../../interfaces/comment";
import './commentSection.css';

export const CommentSection: React.FC<CreateCommentData> = ({
  postId,
}) => {
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCommentContent(e.target.value);
  };

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) return;

    try {
      setIsSubmitting(true);

      const commentData: CreateCommentData = {
        postId: postId,
        content: commentContent.trim(),
      };

      await api.post(`/post/${postId}/comment`, commentData);
      setCommentContent("");
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-input-wrapper">
      <textarea
        className="comment-textarea"
        placeholder=""
        value={commentContent}
        onChange={handleCommentContentChange}
        disabled={isSubmitting}
      ></textarea>
			<div className="comment-actions">
        <div className="comment-options">
          <button className="comment-option-button">Photo</button>
          <button className="comment-option-button">Video</button>
          <button className="comment-option-button">Poll</button>
        </div>
        <button
          className="comment-button"
          onClick={handleSubmitComment}
          disabled={isSubmitting || !commentContent.trim()}
        >
          {isSubmitting ? "Commenting..." : "Comment"}
        </button>
    </div>
		</div>
  );
};
