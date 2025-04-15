import { FaTrash, FaComment } from "react-icons/fa";
import type { FeedItemProps } from "../../interfaces/dashboard";
import { deletePost } from "../../services/deletePost";
import { CreateCommentSection } from "./createCommentSection";
import { useState } from "react";
import { useCommentCount } from "../../hooks/useCommentCount";
import { formatDate } from "../../utils/formatDate";
import { CommentsList } from "./commentsList";
import { useComments } from "../../hooks/useComments";
import { Link } from "react-router-dom";

export const FeedItem: React.FC<FeedItemProps> = ({
  item,
  currentUser,
  onDelete,
}) => {
  const [showCommentSection, setShowCommentSection] = useState(false);
  const { commentCount, incrementCommentCount, decrementCommentCount } =
    useCommentCount(item.id, item.commentCount);
  const { comments, loading, error, refreshComments } = useComments(item.id);

  const handleCommentAdded = () => {
    incrementCommentCount();
    refreshComments();
  };

  const handleCommentDeleted = () => {
    decrementCommentCount();
    refreshComments();
  };

  const toggleCommentSection = () => {
    setShowCommentSection(!showCommentSection);
  };

  const canDelete =
    currentUser &&
    (currentUser.id === item.author.id || currentUser.role === "admin");

  const handleDelete = async () => {
    try {
      await deletePost(item.id);
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <div className="feed-item">
      <div className="feed-item-header">
        {/* <img
          src={avatarUrl}
          alt={item.author.username}
          className="avatar"
          width="40"
          height="40"
        /> */}

        <div className="feed-item-user-info">
          <div className="feed-item-meta">
            <Link
              to={`/profile/${item.author.id}`} style={{ textDecoration: 'none' }}>
              <span className="feed-item-username">{item.author.username}</span>
            </Link>
            <span className="feed-item-time">·</span>
            <span className="feed-item-time">{formatDate(item.createdAt)}</span>
          </div>
          <p className="feed-item-content">{item.content}</p>
        </div>
        <div className="feed-item-actions">
          <div className="feed-item-action" onClick={toggleCommentSection}>
            <span>
              <FaComment />
            </span>{" "}
            {commentCount}
          </div>
          <div className="feed-item-action">
            {canDelete && (
              <span
                onClick={handleDelete}
                aria-label="Delete post"
                title="Delete post"
              >
                <FaTrash />
              </span>
            )}
          </div>
        </div>
      </div>

      {showCommentSection && (
        <CreateCommentSection
          postId={item.id}
          onCommentAdded={handleCommentAdded}
        />
      )}
      {showCommentSection && (
        <CommentsList
          comments={comments}
          loading={loading}
          error={error}
          onCommentDeleted={handleCommentDeleted}
        />
      )}
    </div>
  );
};
