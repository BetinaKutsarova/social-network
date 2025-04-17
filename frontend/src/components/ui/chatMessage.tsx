import React from 'react';
import { formatDistanceToNow, isValid } from 'date-fns';
import './ChatMessage.css';

interface ChatMessageProps {
  content: string;
  timestamp: Date | string;
  isFromMe: boolean;
  isRead?: boolean;
  avatar?: string;
  username?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  timestamp,
  isFromMe,
  isRead = false,
  avatar,
  username
}) => {
  const getFormattedTime = () => {
    try {
      const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
      if (!isValid(date)) {
        return 'Invalid date';
      }
      
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown time';
    }
  };

  const formattedTime = getFormattedTime();

  return (
    <div className={`message-container ${isFromMe ? 'message-from-me' : 'message-from-other'}`}>
      {/* Avatar for messages from others */}
      {!isFromMe && (
        <div className="avatar">
          {avatar ? (
            <img
              src={avatar}
              alt={username || 'User'}
              className="avatar-image"
            />
          ) : (
            <div className="avatar-placeholder">
              {username ? username.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>
      )}
      
      <div className="message-content-wrapper">
        <div className={`message-bubble ${isFromMe ? 'message-bubble-mine' : 'message-bubble-other'}`}>
          <p className="message-text">{content}</p>
        </div>
        
        <div className={`message-metadata ${isFromMe ? 'message-metadata-mine' : 'message-metadata-other'}`}>
          <span className="message-time">{formattedTime}</span>
          {isFromMe && (
            <span className="message-status">
              {isRead ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="message-read-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="message-sent-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;