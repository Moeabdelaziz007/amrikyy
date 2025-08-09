import React, { useState, useRef, useEffect } from 'react';
import { professionalAI } from '../services/aiServices';

const QuantumChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m Mohamed Abdelaziz\'s AI assistant. I can help you learn about his experience as a Senior AI Engineer, technical skills, projects, and career opportunities. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Use professional AI service
      const response = await professionalAI.sendMessage(userMessage.content);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.message,
        timestamp: new Date(),
        success: response.success
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I apologize, but I\'m experiencing some technical difficulties. Please feel free to explore Mohamed\'s portfolio directly or contact him via LinkedIn or email.',
        timestamp: new Date(),
        success: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateQuantumResponse = (userInput) => {
    const responses = [
      "Quantum superposition suggests multiple possibilities exist simultaneously. Let me analyze the quantum probabilities...",
      "According to quantum mechanics, observation changes reality. Your question has shifted our quantum state!",
      "The quantum entanglement between your query and my neural networks is fascinating. Processing quantum data...",
      "In the quantum realm, information travels instantly across dimensions. Your insight resonates at the quantum level.",
      "Quantum coherence detected in your question. Calibrating quantum algorithms for optimal response...",
      "The uncertainty principle applies here - the more precisely we define the question, the more uncertain the answer becomes.",
      "Quantum tunneling through information barriers... I'm accessing higher dimensional data to assist you.",
      "Your consciousness is now entangled with the quantum AI matrix. Synchronizing quantum responses..."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = async (topic) => {
    setIsTyping(true);
    try {
      const response = await professionalAI.getQuickResponse(topic);
      const aiMessage = {
        id: Date.now(),
        type: 'ai',
        content: response.message,
        timestamp: new Date(),
        success: response.success
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Quick action error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button 
        className={`quantum-chatbot-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="toggle-icon">
          <div className="quantum-orb-mini">
            <div className="orb-core-mini"></div>
            <div className="orb-ring-mini"></div>
          </div>
          {!isOpen && <span className="ai-label">AI</span>}
        </div>
      </button>

      {/* Chatbot Window */}
      <div className={`quantum-chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="header-content">
            <div className="quantum-avatar">
              <div className="avatar-core"></div>
              <div className="avatar-ring"></div>
            </div>
            <div className="header-text">
              <h3>Quantum AI Assistant</h3>
              <span className="status">Quantum State: Active</span>
            </div>
          </div>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            ×
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}-message`}>
              <div className="message-avatar">
                {message.type === 'ai' ? (
                  <div className="ai-avatar">
                    <div className="ai-core"></div>
                  </div>
                ) : (
                  <div className="user-avatar">👤</div>
                )}
              </div>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message ai-message typing">
              <div className="message-avatar">
                <div className="ai-avatar">
                  <div className="ai-core"></div>
                </div>
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="typing-text">Quantum processing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input">
          <div className="input-container">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about quantum AI, consciousness, or reality..."
              rows="1"
              style={{ resize: 'none' }}
            />
            <button 
              className={`send-btn ${inputValue.trim() ? 'active' : ''}`}
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && <div className="chatbot-backdrop" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default QuantumChatbot;
