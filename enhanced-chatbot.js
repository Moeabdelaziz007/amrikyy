// Enhanced Chatbot with Multi-Modal Capabilities
class EnhancedChatbot {
    constructor() {
        this.conversationHistory = [];
        this.contextMemory = new Map();
        this.learningData = {};
        this.isTyping = false;
        this.currentSession = null;
        this.emotionAnalysis = null;
        this.intentRecognition = null;
        this.responseGenerator = null;
        
        this.init();
    }

    init() {
        this.setupChatbotUI();
        this.setupConversationMemory();
        this.setupEmotionAnalysis();
        this.setupIntentRecognition();
        this.setupResponseGeneration();
        this.setupLearningSystem();
        this.loadConversationHistory();
        this.startSession();
    }

    // Chatbot UI Setup
    setupChatbotUI() {
        this.createChatbotInterface();
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setupVoiceInput();
    }

    createChatbotInterface() {
        const chatbotContainer = document.getElementById('chatbotContainer');
        if (!chatbotContainer) return;

        // Enhanced input area
        const inputArea = chatbotContainer.querySelector('.chatbot-input');
        if (inputArea) {
            inputArea.innerHTML = `
                <div class="input-tabs">
                    <button class="tab-btn active" data-mode="text">
                        <i class="fas fa-keyboard"></i>
                        <span>Text</span>
                    </button>
                    <button class="tab-btn" data-mode="voice">
                        <i class="fas fa-microphone"></i>
                        <span>Voice</span>
                    </button>
                    <button class="tab-btn" data-mode="image">
                        <i class="fas fa-image"></i>
                        <span>Image</span>
                    </button>
                    <button class="tab-btn" data-mode="file">
                        <i class="fas fa-file"></i>
                        <span>File</span>
                    </button>
                </div>
                
                <div class="input-content">
                    <div class="text-input active">
                        <div class="input-group">
                            <textarea id="chatbotInput" placeholder="Type your message or ask me anything..." rows="3"></textarea>
                            <div class="input-actions">
                                <button class="action-btn" id="emojiBtn" title="Add Emoji">
                                    <i class="fas fa-smile"></i>
                                </button>
                                <button class="action-btn" id="attachBtn" title="Attach File">
                                    <i class="fas fa-paperclip"></i>
                                </button>
                                <button class="action-btn" id="voiceInputBtn" title="Voice Input">
                                    <i class="fas fa-microphone"></i>
                                </button>
                                <button id="sendMessage" class="send-btn" title="Send Message">
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="voice-input">
                        <div class="voice-recorder">
                            <button class="voice-record-btn" id="voiceRecordBtn">
                                <i class="fas fa-microphone"></i>
                                <span>Hold to Record</span>
                            </button>
                            <div class="voice-visualizer" id="voiceVisualizer"></div>
                            <div class="voice-transcript" id="voiceTranscript"></div>
                        </div>
                    </div>
                    
                    <div class="image-input">
                        <div class="image-upload-area" id="imageUploadArea">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Drag & drop an image here or click to browse</p>
                            <input type="file" id="imageInput" accept="image/*" style="display: none;">
                        </div>
                        <div class="image-preview" id="imagePreview" style="display: none;">
                            <img id="previewImage" alt="Preview">
                            <button class="remove-image" id="removeImage">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="file-input">
                        <div class="file-upload-area" id="fileUploadArea">
                            <i class="fas fa-file-upload"></i>
                            <p>Upload any file for analysis</p>
                            <input type="file" id="fileInput" multiple style="display: none;">
                        </div>
                        <div class="file-list" id="fileList"></div>
                    </div>
                </div>
                
                <div class="quick-actions">
                    <button class="quick-btn" data-action="help">Help</button>
                    <button class="quick-btn" data-action="examples">Examples</button>
                    <button class="quick-btn" data-action="feedback">Feedback</button>
                    <button class="quick-btn" data-action="clear">Clear Chat</button>
                </div>
            `;
        }
    }

    setupEventListeners() {
        // Input mode tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.switchInputMode(mode);
            });
        });

        // Send message
        document.getElementById('sendMessage')?.addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key to send
        document.getElementById('chatbotInput')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Voice recording
        this.setupVoiceRecording();

        // Image upload
        this.setupImageUpload();

        // File upload
        this.setupFileUpload();

        // Quick actions
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Emoji picker
        document.getElementById('emojiBtn')?.addEventListener('click', () => {
            this.showEmojiPicker();
        });
    }

    setupVoiceRecording() {
        const recordBtn = document.getElementById('voiceRecordBtn');
        const visualizer = document.getElementById('voiceVisualizer');
        const transcript = document.getElementById('voiceTranscript');

        if (!recordBtn) return;

        let mediaRecorder;
        let audioChunks = [];

        recordBtn.addEventListener('mousedown', () => {
            this.startVoiceRecording();
        });

        recordBtn.addEventListener('mouseup', () => {
            this.stopVoiceRecording();
        });

        recordBtn.addEventListener('mouseleave', () => {
            this.stopVoiceRecording();
        });
    }

    setupImageUpload() {
        const uploadArea = document.getElementById('imageUploadArea');
        const imageInput = document.getElementById('imageInput');
        const preview = document.getElementById('imagePreview');
        const previewImage = document.getElementById('previewImage');
        const removeBtn = document.getElementById('removeImage');

        uploadArea?.addEventListener('click', () => {
            imageInput.click();
        });

        uploadArea?.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea?.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea?.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleImageUpload(files[0]);
            }
        });

        imageInput?.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleImageUpload(e.target.files[0]);
            }
        });

        removeBtn?.addEventListener('click', () => {
            this.removeImagePreview();
        });
    }

    setupFileUpload() {
        const uploadArea = document.getElementById('fileUploadArea');
        const fileInput = document.getElementById('fileInput');

        uploadArea?.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput?.addEventListener('change', (e) => {
            Array.from(e.target.files).forEach(file => {
                this.handleFileUpload(file);
            });
        });
    }

    setupDragAndDrop() {
        // Global drag and drop for chatbot
        const chatbotWindow = document.getElementById('chatbotWindow');
        
        if (chatbotWindow) {
            chatbotWindow.addEventListener('dragover', (e) => {
                e.preventDefault();
                chatbotWindow.classList.add('drag-over');
            });

            chatbotWindow.addEventListener('dragleave', () => {
                chatbotWindow.classList.remove('drag-over');
            });

            chatbotWindow.addEventListener('drop', (e) => {
                e.preventDefault();
                chatbotWindow.classList.remove('drag-over');
                
                const files = Array.from(e.dataTransfer.files);
                files.forEach(file => {
                    if (file.type.startsWith('image/')) {
                        this.handleImageUpload(file);
                    } else {
                        this.handleFileUpload(file);
                    }
                });
            });
        }
    }

    setupVoiceInput() {
        // Integration with AI system voice recognition
        if (window.AI && window.AI.recognition) {
            window.AI.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('chatbotInput').value = transcript;
                this.processVoiceInput(transcript);
            };
        }
    }

    // Input Mode Management
    switchInputMode(mode) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

        // Update input content
        document.querySelectorAll('.input-content > div').forEach(content => {
            content.classList.remove('active');
        });
        document.querySelector(`.${mode}-input`).classList.add('active');

        this.currentInputMode = mode;
    }

    // Message Processing
    async sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message to chat
        this.addMessage('user', message);
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Process message based on current mode
            const response = await this.processMessage(message, this.currentInputMode);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add bot response
            this.addMessage('bot', response.text, response);
            
            // Update conversation history
            this.updateConversationHistory('user', message);
            this.updateConversationHistory('bot', response.text);
            
            // Learn from interaction
            this.learnFromInteraction(message, response);
            
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('bot', 'Sorry, I encountered an error processing your message. Please try again.', { error: true });
            console.error('Chatbot error:', error);
        }
    }

    async processMessage(message, mode = 'text') {
        // Analyze message
        const analysis = await this.analyzeMessage(message);
        
        // Generate response based on analysis
        const response = await this.generateResponse(message, analysis, mode);
        
        return response;
    }

    async analyzeMessage(message) {
        // Emotion analysis
        const emotions = this.analyzeEmotions(message);
        
        // Intent recognition
        const intent = this.recognizeIntent(message);
        
        // Context extraction
        const context = this.extractContext(message);
        
        // Sentiment analysis
        const sentiment = this.analyzeSentiment(message);
        
        return {
            emotions,
            intent,
            context,
            sentiment,
            timestamp: Date.now()
        };
    }

    analyzeEmotions(message) {
        const emotionKeywords = {
            happy: ['happy', 'joy', 'excited', 'great', 'awesome', 'amazing', 'wonderful'],
            sad: ['sad', 'depressed', 'down', 'upset', 'disappointed', 'frustrated'],
            angry: ['angry', 'mad', 'furious', 'annoyed', 'irritated', 'frustrated'],
            fearful: ['scared', 'afraid', 'worried', 'anxious', 'nervous', 'concerned'],
            surprised: ['surprised', 'shocked', 'amazed', 'unexpected', 'wow']
        };

        const emotions = {};
        const words = message.toLowerCase().split(/\s+/);

        Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
            emotions[emotion] = keywords.filter(keyword => 
                words.some(word => word.includes(keyword))
            ).length / keywords.length;
        });

        return emotions;
    }

    recognizeIntent(message) {
        const intentPatterns = {
            greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
            question: ['what', 'how', 'why', 'when', 'where', 'who', '?'],
            request: ['can you', 'could you', 'please', 'help me', 'show me'],
            complaint: ['problem', 'issue', 'error', 'bug', 'broken', 'not working'],
            compliment: ['thanks', 'thank you', 'great', 'awesome', 'good job'],
            goodbye: ['bye', 'goodbye', 'see you', 'farewell']
        };

        const messageLower = message.toLowerCase();
        
        for (const [intent, patterns] of Object.entries(intentPatterns)) {
            if (patterns.some(pattern => messageLower.includes(pattern))) {
                return intent;
            }
        }

        return 'general';
    }

    extractContext(message) {
        const context = {
            topics: [],
            entities: [],
            timeReferences: [],
            locationReferences: []
        };

        // Extract topics (simplified)
        const commonTopics = ['auraos', 'download', 'install', 'settings', 'help', 'chat', 'ai', 'features'];
        context.topics = commonTopics.filter(topic => 
            message.toLowerCase().includes(topic)
        );

        // Extract entities (simplified)
        const entityPatterns = {
            email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
            url: /https?:\/\/[^\s]+/g,
            version: /\b\d+\.\d+(?:\.\d+)?\b/g
        };

        Object.entries(entityPatterns).forEach(([type, pattern]) => {
            const matches = message.match(pattern);
            if (matches) {
                context.entities.push(...matches.map(match => ({ type, value: match })));
            }
        });

        return context;
    }

    analyzeSentiment(message) {
        const positiveWords = ['good', 'great', 'awesome', 'excellent', 'amazing', 'wonderful', 'fantastic'];
        const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disappointing', 'frustrating'];
        
        const words = message.toLowerCase().split(/\s+/);
        const positiveCount = words.filter(word => positiveWords.includes(word)).length;
        const negativeCount = words.filter(word => negativeWords.includes(word)).length;
        
        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
    }

    // Response Generation
    async generateResponse(message, analysis, mode) {
        const responses = {
            greeting: [
                "Hello! How can I help you today?",
                "Hi there! What can I do for you?",
                "Greetings! I'm here to assist you."
            ],
            question: [
                "That's a great question! Let me help you with that.",
                "I'd be happy to answer that for you.",
                "Good question! Here's what I can tell you..."
            ],
            request: [
                "I'll be glad to help you with that.",
                "Absolutely! Let me assist you.",
                "Of course! I'm here to help."
            ],
            complaint: [
                "I'm sorry to hear you're having issues. Let me help resolve this.",
                "I understand your frustration. Let's work together to fix this.",
                "That sounds frustrating. I'm here to help you get this sorted out."
            ],
            compliment: [
                "Thank you so much! I'm glad I could help.",
                "You're very welcome! I'm happy to assist.",
                "I appreciate your kind words! Let me know if you need anything else."
            ],
            goodbye: [
                "Goodbye! Feel free to come back anytime.",
                "See you later! I'm always here to help.",
                "Take care! Don't hesitate to reach out if you need assistance."
            ],
            general: [
                "I'm here to help! What would you like to know?",
                "That's interesting! Tell me more about what you're looking for.",
                "I'd be happy to assist you with that."
            ]
        };

        const intent = analysis.intent;
        const possibleResponses = responses[intent] || responses.general;
        const baseResponse = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];

        // Enhance response based on context and mode
        let enhancedResponse = baseResponse;

        if (mode === 'voice') {
            enhancedResponse = this.adaptResponseForVoice(enhancedResponse);
        }

        if (analysis.context.topics.length > 0) {
            enhancedResponse = this.addTopicSpecificContent(enhancedResponse, analysis.context.topics);
        }

        if (analysis.emotions) {
            enhancedResponse = this.addEmotionalContext(enhancedResponse, analysis.emotions);
        }

        return {
            text: enhancedResponse,
            analysis,
            mode,
            timestamp: Date.now(),
            suggestions: this.generateSuggestions(analysis)
        };
    }

    adaptResponseForVoice(response) {
        // Make response more conversational for voice
        return response.replace(/!/g, '.')
                     .replace(/\?/g, '')
                     .toLowerCase();
    }

    addTopicSpecificContent(response, topics) {
        const topicContent = {
            auraos: " AuraOS is our modern operating system platform.",
            download: " You can download AuraOS from our main page.",
            install: " Installation is straightforward and well-documented.",
            settings: " You can access settings from your dashboard.",
            help: " I'm here to provide comprehensive assistance.",
            chat: " Our chat system supports multiple input modes.",
            ai: " Our AI system includes voice commands and smart recommendations.",
            features: " AuraOS includes many advanced features like PWA support and real-time analytics."
        };

        let enhancedResponse = response;
        topics.forEach(topic => {
            if (topicContent[topic]) {
                enhancedResponse += topicContent[topic];
            }
        });

        return enhancedResponse;
    }

    addEmotionalContext(response, emotions) {
        const dominantEmotion = Object.entries(emotions)
            .sort(([,a], [,b]) => b - a)[0];

        if (dominantEmotion && dominantEmotion[1] > 0.3) {
            const emotion = dominantEmotion[0];
            
            switch (emotion) {
                case 'sad':
                    return response + " I'm here to help make things better.";
                case 'angry':
                    return response + " I understand your frustration and I'm here to help resolve this.";
                case 'happy':
                    return response + " I'm glad you're having a positive experience!";
                case 'fearful':
                    return response + " Don't worry, I'm here to guide you through this safely.";
                default:
                    return response;
            }
        }

        return response;
    }

    generateSuggestions(analysis) {
        const suggestions = [];

        if (analysis.intent === 'question') {
            suggestions.push("Ask about AuraOS features", "Get help with installation", "Learn about AI capabilities");
        } else if (analysis.context.topics.includes('auraos')) {
            suggestions.push("Download AuraOS", "View features", "Get support");
        } else {
            suggestions.push("Try voice commands", "Upload an image", "Ask for help");
        }

        return suggestions;
    }

    // Learning System
    setupLearningSystem() {
        this.learningData = {
            userPreferences: {},
            conversationPatterns: [],
            responseEffectiveness: {},
            improvementAreas: []
        };
    }

    learnFromInteraction(userMessage, botResponse) {
        // Store interaction data
        const interaction = {
            userMessage,
            botResponse: botResponse.text,
            analysis: botResponse.analysis,
            timestamp: Date.now(),
            userFeedback: null
        };

        this.learningData.conversationPatterns.push(interaction);

        // Update response effectiveness
        const intent = botResponse.analysis.intent;
        if (!this.learningData.responseEffectiveness[intent]) {
            this.learningData.responseEffectiveness[intent] = [];
        }
        
        this.learningData.responseEffectiveness[intent].push({
            response: botResponse.text,
            timestamp: Date.now(),
            feedback: null
        });

        // Save learning data
        this.saveLearningData();
    }

    saveLearningData() {
        localStorage.setItem('auraos_chatbot_learning', JSON.stringify(this.learningData));
    }

    loadLearningData() {
        const stored = localStorage.getItem('auraos_chatbot_learning');
        if (stored) {
            this.learningData = { ...this.learningData, ...JSON.parse(stored) };
        }
    }

    // UI Management
    addMessage(sender, content, metadata = {}) {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        if (metadata.error) {
            messageDiv.classList.add('error-message');
        }

        const avatar = sender === 'user' ? 
            '<i class="fas fa-user"></i>' : 
            '<i class="fas fa-robot"></i>';

        let messageContent = content;
        
        // Add suggestions if available
        if (metadata.suggestions && metadata.suggestions.length > 0) {
            const suggestionsHtml = metadata.suggestions.map(suggestion => 
                `<button class="suggestion-btn" onclick="window.AI.chatbot.addSuggestion('${suggestion}')">${suggestion}</button>`
            ).join('');
            messageContent += `<div class="suggestions">${suggestionsHtml}</div>`;
        }

        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <p>${messageContent}</p>
                <span class="message-time">${this.formatTime(new Date())}</span>
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Animate message
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 100);
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        this.typingIndicator = typingDiv;
    }

    hideTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.remove();
            this.typingIndicator = null;
        }
    }

    // Utility Methods
    formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    handleQuickAction(action) {
        switch (action) {
            case 'help':
                this.addMessage('bot', 'I can help you with questions about AuraOS, provide technical support, analyze images, process files, and much more! Try asking me anything.');
                break;
            case 'examples':
                this.addMessage('bot', 'Here are some things you can try:\n• "How do I download AuraOS?"\n• "What features does AuraOS have?"\n• Upload an image for analysis\n• Use voice commands\n• Ask for technical support');
                break;
            case 'feedback':
                this.addMessage('bot', 'Thank you for your interest in providing feedback! You can share your thoughts, suggestions, or report issues. Your feedback helps us improve AuraOS.');
                break;
            case 'clear':
                this.clearChat();
                break;
        }
    }

    clearChat() {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div class="message bot-message">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <p>Chat cleared! How can I help you today?</p>
                        <span class="message-time">Just now</span>
                    </div>
                </div>
            `;
        }
        this.conversationHistory = [];
    }

    addSuggestion(suggestion) {
        document.getElementById('chatbotInput').value = suggestion;
        this.sendMessage();
    }

    // File Handling
    async handleImageUpload(file) {
        try {
            this.showToast('Processing image...', 'info');
            
            if (window.AI) {
                const imageData = await window.AI.processImage(file);
                this.addMessage('user', `[Image uploaded: ${file.name}]`);
                this.addMessage('bot', `I've analyzed your image. It contains ${imageData.objects.length} detected objects and the dominant colors are: ${imageData.colors.slice(0, 3).join(', ')}.`);
            }
        } catch (error) {
            this.showToast('Error processing image', 'error');
            console.error('Image processing error:', error);
        }
    }

    handleFileUpload(file) {
        this.addMessage('user', `[File uploaded: ${file.name} (${file.size} bytes)]`);
        this.addMessage('bot', `I've received your file "${file.name}". I can analyze text files, images, and provide insights about the content.`);
    }

    // Session Management
    startSession() {
        this.currentSession = {
            id: 'session_' + Date.now(),
            startTime: Date.now(),
            messageCount: 0,
            context: {}
        };
    }

    updateConversationHistory(sender, message) {
        this.conversationHistory.push({
            sender,
            message,
            timestamp: Date.now(),
            sessionId: this.currentSession?.id
        });

        if (this.currentSession) {
            this.currentSession.messageCount++;
        }
    }

    loadConversationHistory() {
        const stored = localStorage.getItem('auraos_chatbot_history');
        if (stored) {
            this.conversationHistory = JSON.parse(stored);
        }
    }

    saveConversationHistory() {
        localStorage.setItem('auraos_chatbot_history', JSON.stringify(this.conversationHistory));
    }

    showToast(message, type) {
        if (window.Analytics) {
            window.Analytics.showToast(message, type);
        }
    }
}

// Initialize enhanced chatbot when DOM is loaded
let enhancedChatbot = null;

document.addEventListener('DOMContentLoaded', () => {
    enhancedChatbot = new EnhancedChatbot();
    
    // Make chatbot available globally
    window.AI = window.AI || {};
    window.AI.chatbot = enhancedChatbot;
});

// Export for global access
window.EnhancedChatbot = EnhancedChatbot;
