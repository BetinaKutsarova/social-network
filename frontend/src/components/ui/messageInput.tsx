import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiPaperclip, FiSmile } from 'react-icons/fi';
import './MessageInput.css';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled = false }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="message-input-form">
        <button
          type="button"
          className="message-input-button attachment-button"
          title="Attach file"
        >
          <FiPaperclip size={20} />
        </button>
        
        <div className="textarea-container">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="message-textarea"
            disabled={disabled}
          />
          
          <button
            type="button"
            className="message-input-button emoji-button"
            title="Add emoji"
          >
            <FiSmile size={20} />
          </button>
        </div>
        
        <button
          type="submit"
          className={`message-input-button send-button ${disabled || !message.trim() ? 'send-button-disabled' : ''}`}
          disabled={disabled || !message.trim()}
          title="Send message"
        >
          <FiSend size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;