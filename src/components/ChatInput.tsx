import React, { useState } from 'react';
import { useI18n } from '../i18n/i18n';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState('');
  const { t, dir } = useI18n();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (text.trim()) {
        onSendMessage(text.trim());
        setText('');
      }
    }
  };

  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={t('chat_placeholder')}
      rows={1}
      style={{ width: '100%', padding: '10px', fontSize: '16px', direction: dir }}
    />
  );
};

export default ChatInput;
