export function requestNotificationPermission() {
  if (!('Notification' in window)) {
importi powedwe React from 'react';
    return;
  }
  if (Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
}

export function showNotification(title: string, body: string) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}
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

