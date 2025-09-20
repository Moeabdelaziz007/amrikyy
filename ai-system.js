// Advanced AI System Implementation
class AISystem {
    constructor() {
        this.recognition = null;
        this.synthesis = null;
        this.isListening = false;
        this.isSpeaking = false;
        this.voiceCommands = new Map();
        this.imageProcessor = null;
        this.recommendationEngine = null;
        this.personalizationData = {};
        
        this.init();
    }

    init() {
        this.setupVoiceRecognition();
        this.setupTextToSpeech();
        this.setupImageProcessing();
        this.setupRecommendationEngine();
        this.setupPersonalization();
        this.loadUserPreferences();
    }

    loadUserPreferences() {
        // Load user preferences from localStorage or Firebase
        const stored = localStorage.getItem('auraos_user_preferences');
        if (stored) {
            try {
                this.userPreferences = { ...this.userPreferences, ...JSON.parse(stored) };
            } catch (error) {
                console.error('Error loading user preferences:', error);
            }
        }
        
        // Initialize default preferences if none exist
        if (!this.userPreferences) {
            this.userPreferences = {
                theme: 'light',
                language: 'en',
                voiceEnabled: true,
                notificationsEnabled: true,
                analyticsEnabled: true
            };
            this.saveUserPreferences();
        }
    }

    saveUserPreferences() {
        try {
            localStorage.setItem('auraos_user_preferences', JSON.stringify(this.userPreferences));
        } catch (error) {
            console.error('Error saving user preferences:', error);
        }
    }

    // Voice Recognition System
    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceUI('listening');
                this.showToast('Listening...', 'info');
            };
            
            this.recognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase();
                this.processVoiceCommand(command);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
                this.updateVoiceUI('error');
                this.showToast('Voice recognition error', 'error');
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceUI('idle');
            };
            
            // Setup voice commands
            this.setupVoiceCommands();
        } else {
            console.warn('Speech recognition not supported');
        }
    }

    setupVoiceCommands() {
        this.voiceCommands.set('open dashboard', () => this.navigateToDashboard());
        this.voiceCommands.set('open settings', () => this.navigateToSettings());
        this.voiceCommands.set('start chat', () => this.startChat());
        this.voiceCommands.set('download auraos', () => this.downloadAuraOS());
        this.voiceCommands.set('help', () => this.showHelp());
        this.voiceCommands.set('logout', () => this.logout());
        this.voiceCommands.set('go home', () => this.goHome());
        this.voiceCommands.set('scroll up', () => this.scrollPage('up'));
        this.voiceCommands.set('scroll down', () => this.scrollPage('down'));
        this.voiceCommands.set('search', () => this.openSearch());
        this.voiceCommands.set('toggle theme', () => this.toggleTheme());
        this.voiceCommands.set('what can you do', () => this.showCapabilities());
    }

    processVoiceCommand(command) {
        console.log('Processing voice command:', command);
        
        // Find matching command
        let matched = false;
        for (const [key, handler] of this.voiceCommands) {
            if (command.includes(key)) {
                handler();
                matched = true;
                this.speakResponse(`Executing ${key}`);
                break;
            }
        }
        
        if (!matched) {
            this.speakResponse("I didn't understand that command. Say 'help' for available commands.");
            this.showToast('Command not recognized', 'warning');
        }
        
        // Log command for learning
        this.logVoiceCommand(command, matched);
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            this.recognition.start();
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    // Text-to-Speech System
    setupTextToSpeech() {
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
            
            // Load available voices
            this.loadVoices();
            
            // Listen for voice changes
            this.synthesis.onvoiceschanged = () => {
                this.loadVoices();
            };
        } else {
            console.warn('Speech synthesis not supported');
        }
    }

    loadVoices() {
        this.voices = this.synthesis.getVoices();
        this.preferredVoice = this.voices.find(voice => 
            voice.name.includes('Google') && voice.lang.startsWith('en')
        ) || this.voices[0];
    }

    speakResponse(text, options = {}) {
        if (!this.synthesis) return;
        
        this.synthesis.cancel(); // Stop any current speech
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.preferredVoice;
        utterance.rate = options.rate || 1;
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 0.8;
        
        utterance.onstart = () => {
            this.isSpeaking = true;
            this.updateVoiceUI('speaking');
        };
        
        utterance.onend = () => {
            this.isSpeaking = false;
            this.updateVoiceUI('idle');
        };
        
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            this.isSpeaking = false;
            this.updateVoiceUI('error');
        };
        
        this.synthesis.speak(utterance);
    }

    // Image Processing System
    setupImageProcessing() {
        this.imageProcessor = {
            canvas: document.createElement('canvas'),
            context: null,
            maxWidth: 800,
            maxHeight: 600
        };
        
        this.imageProcessor.context = this.imageProcessor.canvas.getContext('2d');
    }

    processImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();
            
            reader.onload = (e) => {
                img.onload = () => {
                    try {
                        const processedImage = this.resizeImage(img);
                        const imageData = this.extractImageData(processedImage);
                        resolve(imageData);
                    } catch (error) {
                        reject(error);
                    }
                };
                img.src = e.target.result;
            };
            
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    resizeImage(img) {
        const canvas = this.imageProcessor.canvas;
        const ctx = this.imageProcessor.context;
        
        let { width, height } = img;
        
        // Calculate new dimensions
        if (width > height) {
            if (width > this.imageProcessor.maxWidth) {
                height = (height * this.imageProcessor.maxWidth) / width;
                width = this.imageProcessor.maxWidth;
            }
        } else {
            if (height > this.imageProcessor.maxHeight) {
                width = (width * this.imageProcessor.maxHeight) / height;
                height = this.imageProcessor.maxHeight;
            }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        return canvas;
    }

    extractImageData(canvas) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Extract color palette
        const colors = this.extractColorPalette(imageData);
        
        // Extract text using OCR simulation
        const text = this.simulateOCR(imageData);
        
        // Extract objects (simulated)
        const objects = this.simulateObjectDetection(imageData);
        
        return {
            width: canvas.width,
            height: canvas.height,
            colors,
            text,
            objects,
            dataUrl: canvas.toDataURL('image/jpeg', 0.8)
        };
    }

    extractColorPalette(imageData) {
        const pixels = imageData.data;
        const colorCounts = new Map();
        
        // Sample every 10th pixel for performance
        for (let i = 0; i < pixels.length; i += 40) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];
            
            if (a > 128) { // Skip transparent pixels
                const color = `rgb(${r},${g},${b})`;
                colorCounts.set(color, (colorCounts.get(color) || 0) + 1);
            }
        }
        
        // Get top 5 colors
        return Array.from(colorCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([color]) => color);
    }

    simulateOCR(imageData) {
        // Simulate OCR text extraction
        const mockTexts = [
            "Welcome to AuraOS",
            "Modern Operating System",
            "AI-Powered Platform",
            "Download Now",
            "Get Started"
        ];
        
        return mockTexts[Math.floor(Math.random() * mockTexts.length)];
    }

    simulateObjectDetection(imageData) {
        // Simulate object detection
        const mockObjects = [
            { name: 'person', confidence: 0.95, bbox: [100, 100, 200, 300] },
            { name: 'computer', confidence: 0.87, bbox: [300, 200, 150, 120] },
            { name: 'book', confidence: 0.73, bbox: [500, 150, 80, 100] }
        ];
        
        return mockObjects.slice(0, Math.floor(Math.random() * 3) + 1);
    }

    // Recommendation Engine
    setupRecommendationEngine() {
        this.recommendationEngine = {
            userPreferences: {},
            behaviorPatterns: {},
            contentHistory: [],
            recommendations: []
        };
        
        this.loadRecommendationData();
    }

    loadRecommendationData() {
        // Load from localStorage or Firebase
        const stored = localStorage.getItem('auraos_recommendations');
        if (stored) {
            const data = JSON.parse(stored);
            this.recommendationEngine = { ...this.recommendationEngine, ...data };
        }
    }

    saveRecommendationData() {
        localStorage.setItem('auraos_recommendations', JSON.stringify(this.recommendationEngine));
    }

    generateRecommendations(userId, context = {}) {
        const recommendations = [];
        
        // Content-based recommendations
        const contentRecs = this.getContentBasedRecommendations();
        recommendations.push(...contentRecs);
        
        // Collaborative filtering
        const collabRecs = this.getCollaborativeRecommendations(userId);
        recommendations.push(...collabRecs);
        
        // Context-aware recommendations
        const contextRecs = this.getContextAwareRecommendations(context);
        recommendations.push(...contextRecs);
        
        // Sort by relevance score
        recommendations.sort((a, b) => b.score - a.score);
        
        return recommendations.slice(0, 10); // Return top 10
    }

    getContentBasedRecommendations() {
        const contentTypes = [
            { type: 'feature', title: 'Advanced Security Features', score: 0.9 },
            { type: 'tutorial', title: 'Getting Started with AuraOS', score: 0.8 },
            { type: 'download', title: 'Latest AuraOS Update', score: 0.7 },
            { type: 'community', title: 'Join AuraOS Community', score: 0.6 }
        ];
        
        return contentTypes.map(item => ({
            ...item,
            category: 'content',
            description: `Recommended based on your interests`,
            action: `view_${item.type}`
        }));
    }

    getCollaborativeRecommendations(userId) {
        // Simulate collaborative filtering
        const similarUsers = ['user1', 'user2', 'user3'];
        const recommendations = [];
        
        similarUsers.forEach(similarUser => {
            const userRecs = [
                { title: 'AI Chat Assistant', score: 0.85 },
                { title: 'Custom Themes', score: 0.75 },
                { title: 'Voice Commands', score: 0.65 }
            ];
            
            recommendations.push(...userRecs.map(rec => ({
                ...rec,
                category: 'collaborative',
                description: `Users like you also liked this`,
                action: 'view_feature'
            })));
        });
        
        return recommendations;
    }

    getContextAwareRecommendations(context) {
        const recommendations = [];
        
        // Time-based recommendations
        const hour = new Date().getHours();
        if (hour >= 9 && hour <= 17) {
            recommendations.push({
                title: 'Productivity Tools',
                score: 0.8,
                category: 'context',
                description: 'Perfect for work hours',
                action: 'view_tools'
            });
        } else {
            recommendations.push({
                title: 'Entertainment Features',
                score: 0.8,
                category: 'context',
                description: 'Great for relaxation time',
                action: 'view_entertainment'
            });
        }
        
        // Location-based (simulated)
        if (context.location === 'office') {
            recommendations.push({
                title: 'Professional Templates',
                score: 0.7,
                category: 'context',
                description: 'Ideal for office environment',
                action: 'view_templates'
            });
        }
        
        return recommendations;
    }

    // Personalization System
    setupPersonalization() {
        this.personalizationData = {
            themes: ['dark', 'light', 'auto'],
            currentTheme: 'light',
            language: 'en',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            accessibility: {
                highContrast: false,
                largeText: false,
                reducedMotion: false
            },
            behavior: {
                preferredFeatures: [],
                usagePatterns: {},
                interactionHistory: []
            }
        };
        
        this.loadPersonalizationData();
    }

    loadPersonalizationData() {
        const stored = localStorage.getItem('auraos_personalization');
        if (stored) {
            this.personalizationData = { ...this.personalizationData, ...JSON.parse(stored) };
        }
    }

    savePersonalizationData() {
        localStorage.setItem('auraos_personalization', JSON.stringify(this.personalizationData));
    }

    updatePersonalization(key, value) {
        this.personalizationData[key] = value;
        this.savePersonalizationData();
        this.applyPersonalization();
    }

    applyPersonalization() {
        // Apply theme
        document.documentElement.setAttribute('data-theme', this.personalizationData.currentTheme);
        
        // Apply accessibility settings
        if (this.personalizationData.accessibility.highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
        
        if (this.personalizationData.accessibility.largeText) {
            document.body.classList.add('large-text');
        } else {
            document.body.classList.remove('large-text');
        }
        
        if (this.personalizationData.accessibility.reducedMotion) {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
    }

    // Command Handlers
    navigateToDashboard() {
        window.location.href = '/dashboard.html';
    }

    navigateToSettings() {
        if (window.location.pathname.includes('dashboard')) {
            document.querySelector('[data-section="settings"]')?.click();
        } else {
            window.location.href = '/dashboard.html#settings';
        }
    }

    startChat() {
        const chatToggle = document.getElementById('chatbotToggle');
        if (chatToggle) {
            chatToggle.click();
        }
    }

    downloadAuraOS() {
        window.location.href = '#download';
    }

    showHelp() {
        const helpText = `
            Available voice commands:
            - "Open dashboard" - Navigate to dashboard
            - "Open settings" - Go to settings
            - "Start chat" - Open chat interface
            - "Download AuraOS" - Go to download section
            - "Help" - Show this help
            - "Logout" - Sign out
            - "Go home" - Return to homepage
            - "Scroll up/down" - Scroll the page
            - "Search" - Open search
            - "Toggle theme" - Switch theme
        `;
        this.speakResponse(helpText);
        this.showToast('Voice commands help displayed', 'info');
    }

    logout() {
        if (firebase.auth().currentUser) {
            firebase.auth().signOut();
        }
    }

    goHome() {
        window.location.href = '/';
    }

    scrollPage(direction) {
        const scrollAmount = 300;
        const currentScroll = window.scrollY;
        
        if (direction === 'up') {
            window.scrollTo({ top: Math.max(0, currentScroll - scrollAmount), behavior: 'smooth' });
        } else {
            window.scrollTo({ top: currentScroll + scrollAmount, behavior: 'smooth' });
        }
    }

    openSearch() {
        // Simulate opening search
        this.showToast('Search functionality coming soon!', 'info');
    }

    toggleTheme() {
        const currentTheme = this.personalizationData.currentTheme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.updatePersonalization('currentTheme', newTheme);
        this.speakResponse(`Theme changed to ${newTheme}`);
    }

    showCapabilities() {
        const capabilities = `
            I can help you with:
            - Voice commands for navigation
            - Image processing and analysis
            - Smart recommendations
            - Personalization settings
            - Chat assistance
            - And much more!
        `;
        this.speakResponse(capabilities);
    }

    // UI Updates
    updateVoiceUI(state) {
        const voiceButton = document.getElementById('voiceButton');
        if (!voiceButton) return;
        
        const icon = voiceButton.querySelector('i');
        voiceButton.className = `voice-button ${state}`;
        
        switch (state) {
            case 'listening':
                icon.className = 'fas fa-microphone';
                break;
            case 'speaking':
                icon.className = 'fas fa-volume-up';
                break;
            case 'error':
                icon.className = 'fas fa-exclamation-triangle';
                break;
            default:
                icon.className = 'fas fa-microphone-slash';
        }
    }

    // Utility Methods
    logVoiceCommand(command, success) {
        this.personalizationData.behavior.interactionHistory.push({
            type: 'voice_command',
            command,
            success,
            timestamp: Date.now()
        });
        
        this.savePersonalizationData();
    }

    showToast(message, type = 'info') {
        if (window.Analytics) {
            window.Analytics.showToast(message, type);
        }
    }

    // Public API
    processUserInput(input, type = 'text') {
        switch (type) {
            case 'voice':
                this.processVoiceCommand(input);
                break;
            case 'image':
                return this.processImage(input);
            case 'text':
                return this.processTextInput(input);
            default:
                console.warn('Unknown input type:', type);
        }
    }

    processTextInput(text) {
        // Process text input for AI responses
        return {
            input: text,
            processed: true,
            timestamp: Date.now(),
            recommendations: this.generateRecommendations(null, { text })
        };
    }

    getRecommendations(context = {}) {
        return this.generateRecommendations(firebase.auth().currentUser?.uid, context);
    }

    updateUserBehavior(action, data = {}) {
        this.personalizationData.behavior.interactionHistory.push({
            type: action,
            data,
            timestamp: Date.now()
        });
        
        this.savePersonalizationData();
    }
}

// Initialize AI system when DOM is loaded
let aiSystem = null;

document.addEventListener('DOMContentLoaded', () => {
    aiSystem = new AISystem();
    
    // Make AI system available globally
    window.AI = aiSystem;
    
    // Add voice button to UI
    addVoiceButton();
});

function addVoiceButton() {
    const voiceButton = document.createElement('button');
    voiceButton.id = 'voiceButton';
    voiceButton.className = 'voice-button idle';
    voiceButton.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    voiceButton.title = 'Voice Commands (Click to start listening)';
    
    voiceButton.addEventListener('click', () => {
        if (aiSystem.isListening) {
            aiSystem.stopListening();
        } else {
            aiSystem.startListening();
        }
    });
    
    // Add to navigation or floating position
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.appendChild(voiceButton);
    } else {
        // Add as floating button
        voiceButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(voiceButton);
    }
}

// Export for global access
window.AISystem = AISystem;
