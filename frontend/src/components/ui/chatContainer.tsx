import React, { useEffect, useRef } from "react";
import { useChat } from "../../contexts/chatContext";
import ChatMessage from "./chatMessage";
import MessageInput from "./messageInput";
import { useAtom } from "jotai";
import { userAtom } from "../../state/atoms";
import './chatContainer.css'

const ChatContainer: React.FC = () => {
  const {
    activeConversation,
    messages,
    sendMessage,
    isLoading,
    activeUserOnline,
    conversations,
  } = useChat();

  const [currentUser] = useAtom(userAtom);

	

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeUser = activeConversation
    ? conversations.find((conv) => conv.user.id === activeConversation)?.user
    : null;

  useEffect(() => {
		{console.log('Active user online?', activeUserOnline)}
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!activeConversation) {
    return (
      <div className="empty-state">
        <p className="empty-state-text">
          Select a conversation to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {activeUser && (
        <div className="chat-header">
          <div className="avatar-container">
            {activeUser.avatarUrl ? (
              <img
                src={activeUser.avatarUrl}
                alt={activeUser.username}
                className="avatar-image"
              />
            ) : (
              <div className="avatar-placeholder">
                {activeUser.username.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Online status indicator */}
            <div
              className={`status-indicator ${
                activeUserOnline ? "status-online" : "status-offline"
              }`}
            ></div>
          </div>

          <div>
            <h3 className="user-name">{activeUser.username}</h3>
            <p className="user-status">
              {activeUserOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      )}

      <div className="messages-container">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-messages">
            <p className="empty-text">No messages yet. Say hello!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const contentPreview = message.content 
                ? message.content.substring(0, 20) + (message.content.length > 20 ? "..." : "") 
                : "[empty message]";
              
              // Log message details for debugging
              console.log("Message:", {
                id: message.id,
                content: contentPreview,
                sender: message.sender,
                isFromMe: message.isFromMe,
                currentUserId: currentUser?.id || "unknown",
              });

              const correctIsFromMe = 
                message.sender === currentUser?.id || 
                message.isFromMe === true;

              return (
                <ChatMessage
                  key={message.id}
                  content={message.content || ""}
                  timestamp={message.createdAt}
                  isFromMe={correctIsFromMe}
                  isRead={message.isRead}
                  avatar={correctIsFromMe ? undefined : activeUser?.avatarUrl}
                  username={correctIsFromMe ? undefined : activeUser?.username}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <MessageInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
};

export default ChatContainer;