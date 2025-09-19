// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollIndicator = document.querySelector('.scroll-indicator');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Animate hamburger bars
    const bars = hamburger.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (hamburger.classList.contains('active')) {
            if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) bar.style.opacity = '0';
            if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        }
    });
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Reset hamburger bars
        const bars = hamburger.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll indicator click
scrollIndicator.addEventListener('click', () => {
    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
        const offsetTop = featuresSection.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.feature-card, .testimonial-card, .download-card, .about-text, .about-visual');
animateElements.forEach(el => {
    observer.observe(el);
});

// Add CSS for animation
const style = document.createElement('style');
style.textContent = `
    .feature-card,
    .testimonial-card,
    .download-card,
    .about-text,
    .about-visual {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;
document.head.appendChild(style);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        const speed = scrolled * 0.5;
        heroBackground.style.transform = `translateY(${speed}px)`;
    }
});

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 1000);
    }
});

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const isNumber = !isNaN(parseFloat(target));
        
        if (isNumber) {
            const finalValue = parseFloat(target.replace(/[^\d.]/g, ''));
            const suffix = target.replace(/[\d.]/g, '');
            let current = 0;
            const increment = finalValue / 100;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= finalValue) {
                    counter.textContent = finalValue + suffix;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + suffix;
                }
            }, 20);
        }
    });
}

// Trigger counter animation when hero stats come into view
const heroStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroStatsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    heroStatsObserver.observe(heroStats);
}

// Download button interactions
document.querySelectorAll('.download-card .btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Add loading state
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        this.disabled = true;
        
        // Simulate download
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
            this.style.background = '#10b981';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                this.style.background = '';
            }, 2000);
        }, 2000);
    });
});

// Watch demo button interaction
document.querySelector('.btn-secondary').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Create modal for demo video
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        max-width: 80%;
        max-height: 80%;
        position: relative;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.style.cssText = `
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
    `;
    
    const video = document.createElement('div');
    video.style.cssText = `
        width: 100%;
        height: 300px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 1.5rem;
        margin-bottom: 1rem;
    `;
    video.innerHTML = '<i class="fas fa-play-circle" style="font-size: 4rem;"></i><br>Demo Video Coming Soon';
    
    modalContent.appendChild(closeButton);
    modalContent.appendChild(video);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
    
    // Close modal
    const closeModal = () => {
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.8)';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    };
    
    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    });
});

// Form validation (if forms are added later)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });
    
    return isValid;
}

// Add smooth reveal animation for sections
const revealSections = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealSections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    revealObserver.observe(section);
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Scroll-based animations and effects
    const scrolled = window.pageYOffset;
    
    // Parallax effect
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        const speed = scrolled * 0.3;
        heroBackground.style.transform = `translateY(${speed}px)`;
    }
    
    // Navbar background
    if (scrolled > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loading class to body for initial animations
    document.body.classList.add('loading');
    
    // Remove loading class after page load
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 1000);
    
    // Initialize any other components here
    console.log('AuraOS homepage loaded successfully!');
});

// Error handling for missing elements
const elementsToCheck = [
    '.navbar',
    '.hamburger',
    '.nav-menu',
    '.hero-title',
    '.hero-stats'
];

elementsToCheck.forEach(selector => {
    if (!document.querySelector(selector)) {
        console.warn(`Element not found: ${selector}`);
    }
});

// Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Login modal
        document.getElementById('loginBtn').addEventListener('click', () => this.showLoginModal());
        document.getElementById('closeLogin').addEventListener('click', () => this.hideModal('loginModal'));
        document.getElementById('signupLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchModal('loginModal', 'signupModal');
        });

        // Signup modal
        document.getElementById('closeSignup').addEventListener('click', () => this.hideModal('signupModal'));
        document.getElementById('loginLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchModal('signupModal', 'loginModal');
        });

        // Forms
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signupForm').addEventListener('submit', (e) => this.handleSignup(e));

        // Password toggles
        document.getElementById('togglePassword').addEventListener('click', () => this.togglePassword('password'));
        document.getElementById('toggleSignupPassword').addEventListener('click', () => this.togglePassword('signupPassword'));

        // Password strength
        document.getElementById('signupPassword').addEventListener('input', () => this.checkPasswordStrength());

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });
    }

    showLoginModal() {
        document.getElementById('loginModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    hideModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    switchModal(fromId, toId) {
        this.hideModal(fromId);
        document.getElementById(toId).style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    togglePassword(inputId) {
        const input = document.getElementById(inputId);
        const toggle = document.getElementById(`toggle${inputId.charAt(0).toUpperCase() + inputId.slice(1)}`);
        
        if (input.type === 'password') {
            input.type = 'text';
            toggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            input.type = 'password';
            toggle.innerHTML = '<i class="fas fa-eye"></i>';
        }
    }

    checkPasswordStrength() {
        const password = document.getElementById('signupPassword').value;
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');

        let strength = 0;
        let strengthLabel = '';

        if (password.length >= 8) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        strengthBar.className = 'strength-fill';
        
        if (strength <= 2) {
            strengthBar.classList.add('weak');
            strengthLabel = 'Weak';
        } else if (strength === 3) {
            strengthBar.classList.add('fair');
            strengthLabel = 'Fair';
        } else if (strength === 4) {
            strengthBar.classList.add('good');
            strengthLabel = 'Good';
        } else {
            strengthBar.classList.add('strong');
            strengthLabel = 'Strong';
        }

        strengthText.textContent = `Password strength: ${strengthLabel}`;
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validatePassword(password) {
        return password.length >= 8;
    }

    showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearErrors() {
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        this.clearErrors();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validation
        if (!this.validateEmail(email)) {
            this.showError('email', 'Please enter a valid email address');
            return;
        }

        if (!this.validatePassword(password)) {
            this.showError('password', 'Password must be at least 8 characters long');
            return;
        }

        // Simulate API call
        try {
            const user = await this.simulateLogin(email, password);
            
            if (user) {
                this.currentUser = user;
                this.isLoggedIn = true;
                
                // Store in localStorage if remember me is checked
                if (rememberMe) {
                    localStorage.setItem('auraos_user', JSON.stringify(user));
                }
                
                this.hideModal('loginModal');
                this.showUserDashboard();
                this.showSuccessMessage('Welcome back!');
            } else {
                this.showError('password', 'Invalid email or password');
            }
        } catch (error) {
            this.showError('password', 'Login failed. Please try again.');
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        this.clearErrors();

        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Validation
        if (!name.trim()) {
            this.showError('name', 'Please enter your full name');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showError('signupEmail', 'Please enter a valid email address');
            return;
        }

        if (!this.validatePassword(password)) {
            this.showError('signupPassword', 'Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('confirmPassword', 'Passwords do not match');
            return;
        }

        if (!agreeTerms) {
            this.showError('agreeTerms', 'Please agree to the terms and conditions');
            return;
        }

        // Simulate API call
        try {
            const user = await this.simulateSignup(name, email, password);
            
            if (user) {
                this.currentUser = user;
                this.isLoggedIn = true;
                
                this.hideModal('signupModal');
                this.showUserDashboard();
                this.showSuccessMessage('Account created successfully!');
            }
        } catch (error) {
            this.showError('signupEmail', 'Signup failed. Please try again.');
        }
    }

    async simulateLogin(email, password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data
        const mockUsers = [
            { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password123' },
            { id: 3, name: 'Admin User', email: 'admin@auraos.com', password: 'admin123' }
        ];

        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: `https://images.unsplash.com/photo-${1472099645785 + user.id}?w=100&h=100&fit=crop&crop=face`
            };
        }
        
        return null;
    }

    async simulateSignup(name, email, password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate random ID
        const id = Math.floor(Math.random() * 1000) + 100;
        
        return {
            id: id,
            name: name,
            email: email,
            avatar: `https://images.unsplash.com/photo-${1472099645785 + id}?w=100&h=100&fit=crop&crop=face`
        };
    }

    showUserDashboard() {
        // Update navbar
        const loginBtn = document.getElementById('loginBtn');
        loginBtn.style.display = 'none';

        // Show user dashboard
        const dashboard = document.getElementById('userDashboard');
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const userAvatar = document.getElementById('userAvatar');

        userName.textContent = `Welcome back, ${this.currentUser.name}!`;
        userEmail.textContent = this.currentUser.email;
        userAvatar.src = this.currentUser.avatar;

        dashboard.style.display = 'block';

        // Update page title
        document.title = `${this.currentUser.name} - AuraOS`;
    }

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        
        // Clear localStorage
        localStorage.removeItem('auraos_user');
        
        // Hide dashboard
        document.getElementById('userDashboard').style.display = 'none';
        
        // Show login button
        document.getElementById('loginBtn').style.display = 'block';
        
        // Reset page title
        document.title = 'AuraOS - Modern Operating System';
        
        this.showSuccessMessage('Logged out successfully');
    }

    checkAuthStatus() {
        const savedUser = localStorage.getItem('auraos_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.isLoggedIn = true;
            this.showUserDashboard();
        }
    }

    showSuccessMessage(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10001;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// Chatbot System
class ChatbotSystem {
    constructor() {
        this.isOpen = false;
        this.messageCount = 0;
        this.conversationHistory = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateBadge();
    }

    setupEventListeners() {
        // Toggle chatbot
        document.getElementById('chatbotToggle').addEventListener('click', () => this.toggleChatbot());
        document.getElementById('minimizeChatbot').addEventListener('click', () => this.toggleChatbot());

        // Send message
        document.getElementById('sendMessage').addEventListener('click', () => this.sendMessage());
        document.getElementById('chatbotInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Quick action buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const message = e.target.getAttribute('data-message');
                this.sendQuickMessage(message);
            });
        });
    }

    toggleChatbot() {
        const chatbotWindow = document.getElementById('chatbotWindow');
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            chatbotWindow.classList.add('active');
            document.getElementById('chatbotInput').focus();
            this.updateBadge(0); // Clear badge when opened
        } else {
            chatbotWindow.classList.remove('active');
        }
    }

    sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();

        if (message) {
            this.addMessage(message, 'user');
            input.value = '';
            
            // Simulate bot response
            setTimeout(() => {
                const response = this.generateResponse(message);
                this.addMessage(response, 'bot');
            }, 1000);
        }
    }

    sendQuickMessage(message) {
        this.addMessage(message, 'user');
        
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 1000);
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="message-content">
                <p>${content}</p>
                <span class="message-time">${time}</span>
            </div>
        `;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Add to conversation history
        this.conversationHistory.push({ content, sender, time });

        // Update badge if chatbot is closed
        if (!this.isOpen && sender === 'user') {
            this.messageCount++;
            this.updateBadge();
        }
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Predefined responses based on keywords
        const responses = {
            'download': 'You can download AuraOS from our download section! We support Windows, macOS, and Linux. The download is free and takes about 2.1 GB of space.',
            'requirements': 'AuraOS system requirements: \n• 4GB RAM minimum (8GB recommended)\n• 10GB free disk space\n• Modern processor (Intel/AMD)\n• Graphics card with OpenGL 3.3 support\n• Internet connection for updates',
            'support': 'Our support team is available 24/7! You can reach us through:\n• Community Discord\n• GitHub Issues\n• Email support\n• Documentation portal',
            'hello': 'Hello! I\'m your AuraOS assistant. How can I help you today?',
            'help': 'I can help you with:\n• Download instructions\n• System requirements\n• Installation guide\n• Troubleshooting\n• Feature explanations\n\nWhat would you like to know?',
            'price': 'AuraOS is completely free and open source! There are no hidden costs or premium features. You get the full experience at no charge.',
            'features': 'AuraOS includes:\n• Lightning-fast boot times\n• Advanced security features\n• Beautiful, customizable interface\n• Cross-platform compatibility\n• Cloud integration\n• Extensive customization options',
            'install': 'To install AuraOS:\n1. Download the installer for your platform\n2. Run the installer as administrator\n3. Follow the setup wizard\n4. Restart your computer\n5. Enjoy your new OS!'
        };

        // Find matching response
        for (const [keyword, response] of Object.entries(responses)) {
            if (message.includes(keyword)) {
                return response;
            }
        }

        // Default responses
        const defaultResponses = [
            'That\'s an interesting question! Let me help you find the right information.',
            'I understand you\'re asking about that. Could you be more specific so I can provide better assistance?',
            'Great question! Let me connect you with the most relevant information about AuraOS.',
            'I\'d be happy to help with that! What specific aspect would you like to know more about?',
            'That\'s something our team can definitely help with. Let me provide you with some useful information.'
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    updateBadge(count = null) {
        const badge = document.querySelector('.chatbot-badge');
        
        if (count !== null) {
            this.messageCount = count;
        }

        if (this.messageCount > 0 && !this.isOpen) {
            badge.textContent = this.messageCount > 99 ? '99+' : this.messageCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Initialize systems when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize authentication system
    window.authSystem = new AuthSystem();
    
    // Initialize chatbot system
    window.chatbotSystem = new ChatbotSystem();
    
    // Add toast animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('AuraOS systems initialized successfully!');
});

// Export functions for potential external use
window.AuraOS = {
    toggleMobileMenu: () => {
        hamburger.click();
    },
    scrollToSection: (sectionId) => {
        const section = document.querySelector(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    },
    animateCounters: animateCounters,
    login: () => window.authSystem.showLoginModal(),
    logout: () => window.authSystem.logout(),
    toggleChatbot: () => window.chatbotSystem.toggleChatbot()
};
