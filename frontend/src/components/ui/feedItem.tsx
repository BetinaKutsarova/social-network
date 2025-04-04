import { FaTrash, FaHeart, FaComment } from "react-icons/fa";
import type { FeedItemProps } from "../../interfaces/dashboard";
import { deletePost } from "../../services/deletePost";

const formatDate = (dateInput: string | Date): string => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return date.toLocaleString();
};

export const FeedItem: React.FC<FeedItemProps> = ({
  item,
  avatarUrl,
  currentUser,
  onDelete,
}) => {
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
        <img
          src={avatarUrl}
          alt={item.author.username}
          className="avatar"
          width="40"
          height="40"
        />

        <div className="feed-item-user-info">
          <div className="feed-item-meta">
            <span className="feed-item-username">{item.author.username}</span>
            <span className="feed-item-time">·</span>
            <span className="feed-item-time">{formatDate(item.createdAt)}</span>
          </div>
          <p className="feed-item-content">{item.content}</p>
        </div>
        <div className="feed-item-actions">
          <div className="feed-item-action">
            <span>
              <FaHeart />
            </span>{" "}
            {item.likes}
          </div>
          <div className="feed-item-action">
            <span>
              <FaComment />
            </span>{" "}
            {item.comments}
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
    </div>
  );
};
