import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import { requestNotificationPermission, showNotification } from '../utils/notifications';
import './ChatWindow.css';
import { useI18n } from '../i18n/i18n';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const ChatWindow: React.FC = () => {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    setMessages([{ id: 1, text: t('chat_greeting'), sender: 'bot' }]);
  }, [t]);

  const handleSendMessage = (text: string) => {
    const newUserMessage: Message = {
      id: Date.now(),
      text,
      sender: 'user',
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsTyping(true);
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: t('chat_thank_you'),
        sender: 'bot',
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botResponse]);
      showNotification(t('chat_notification'), botResponse.text);
    }, 2000);
  };

  return (
    <div className="chat-container" style={{ width: 360, maxWidth: '90vw' }}>
      <div className="chat-window">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} text={msg.text} sender={msg.sender} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;
