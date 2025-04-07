import React, { useState } from "react";
import "./createCommentSection.css";
import { createComment, CreateCommentData } from "../../services/createComment";
import { CreateCommentSectionProps } from "../../interfaces/comment";

export const CreateCommentSection: React.FC<CreateCommentSectionProps> = ({
  postId,
	onCommentAdded
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
        content: commentContent.trim(),
      };

      await createComment(postId, commentData);
      setCommentContent("");
			onCommentAdded();

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
