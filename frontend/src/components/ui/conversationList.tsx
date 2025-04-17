import { useChat } from "../../contexts/chatContext";
import { formatDate } from "../../utils/formatDate";
import "./ConversationList.css";

export const ConversationList = () => {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    isLoading,
  } = useChat();

  if (isLoading && conversations.length === 0) {
    return (
      <div className="loading-state">Loading conversations...</div>
    );
  }

  if (conversations.length === 0) {
    return <div className="empty-state">No conversations yet</div>;
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return formatDate(date);
    }

    const diff = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff < 7) {
      return formatDate(date);
    }

    return formatDate(date);
  };

  return (
    <div className="conversation-list">
      {conversations?.length > 0 &&
        conversations?.map((conversation) => (
          <div
            key={conversation.user.id}
            className={`conversation-item ${
              activeConversation === conversation.user.id ? "active" : ""
            }`}
            onClick={() => setActiveConversation(conversation.user.id)}
          >
            <div className="avatar-container">
              {conversation.user.avatarUrl ? (
                <img
                  src={conversation.user.avatarUrl}
                  alt={conversation.user.username}
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  {conversation.user.username.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Online status indicator */}
              <div
                className={`status-indicator ${
                  conversation.user.online ? "status-online" : "status-offline"
                }`}
              ></div>
            </div>

            <div className="conversation-content">
              <div className="conversation-header">
                <h3 className="username">
                  {conversation.user.username}
                </h3>
                {conversation.latestMessage && (
                  <span className="timestamp">
                    {formatTime(conversation.latestMessage.createdAt)}
                  </span>
                )}
              </div>

              <div className="message-preview">
                <p className="preview-text">
                  {conversation.latestMessage ? (
                    <>
                      {conversation.latestMessage.fromMe && <span>You: </span>}
                      {conversation.latestMessage.content}
                    </>
                  ) : (
                    <span className="empty-message">
                      No messages yet
                    </span>
                  )}
                </p>

                {conversation.unreadCount > 0 && (
                  <span className="unread-counter">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ConversationList;