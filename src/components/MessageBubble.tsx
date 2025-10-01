import React from 'react';
import './MessageBubble.css';

interface MessageBubbleProps {
  text: string;
  sender: 'user' | 'bot';
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, sender }) => {
  const bubbleClass = sender === 'user' ? 'message-bubble user' : 'message-bubble bot';
  return (
    <div className={bubbleClass}>
      <p>{text}</p>
    </div>
  );
};

export default MessageBubble;


