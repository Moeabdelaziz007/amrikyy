// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker registered successfully:', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content is available, show update notification
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// PWA Update Notification
function showUpdateNotification() {
    const updateNotification = document.createElement('div');
    updateNotification.className = 'update-notification';
    updateNotification.innerHTML = `
        <div class="update-content">
            <i class="fas fa-sync-alt"></i>
            <span>New version available!</span>
            <button onclick="updateApp()">Update</button>
            <button onclick="dismissUpdate()">Later</button>
        </div>
    `;
    
    document.body.appendChild(updateNotification);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (updateNotification.parentNode) {
            updateNotification.remove();
        }
    }, 10000);
}

// Update App Function
function updateApp() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((registration) => {
            if (registration && registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
            }
        });
    }
}

// Dismiss Update
function dismissUpdate() {
    const notification = document.querySelector('.update-notification');
    if (notification) {
        notification.remove();
    }
}

// PWA Install Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
});

function showInstallButton() {
    const installButton = document.createElement('button');
    installButton.className = 'install-app-btn';
    installButton.innerHTML = `
        <i class="fas fa-download"></i>
        <span>Install AuraOS</span>
    `;
    installButton.onclick = installApp;
    
    // Add to navigation
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.appendChild(installButton);
    }
}

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
        });
    }
}

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyC4xK8Y9Z2L3M4N5O6P7Q8R9S0T1U2V3W4",
    authDomain: "aios-97581.firebaseapp.com",
    projectId: "aios-97581",
    storageBucket: "aios-97581.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdefghijklmnopqrstuv"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

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

// Enhanced Authentication System with Firebase
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.isGuest = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFirebaseAuth();
        this.checkAuthStatus();
    }

    setupFirebaseAuth() {
        // Listen for authentication state changes
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.handleAuthSuccess(user);
            } else {
                this.handleAuthSignOut();
            }
        });
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

        // Guest login
        document.getElementById('guestLoginBtn').addEventListener('click', () => this.guestLogin());

        // Social login buttons
        document.querySelector('.google-btn').addEventListener('click', () => this.googleLogin());
        document.querySelector('.github-btn').addEventListener('click', () => this.githubLogin());

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
        this.setLoadingState(true);

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validation
        if (!this.validateEmail(email)) {
            this.showError('email', 'Please enter a valid email address');
            this.setLoadingState(false);
            return;
        }

        if (!this.validatePassword(password)) {
            this.showError('password', 'Password must be at least 8 characters long');
            this.setLoadingState(false);
            return;
        }

        try {
            // Firebase Authentication
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Set persistence based on remember me
            const persistence = rememberMe ? 
                firebase.auth.Auth.Persistence.LOCAL : 
                firebase.auth.Auth.Persistence.SESSION;
            
            await auth.setPersistence(persistence);
            
            // Store user data
            this.currentUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email.split('@')[0],
                photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email.split('@')[0])}&background=6366f1&color=fff`
            };
            
            this.isLoggedIn = true;
            this.isGuest = false;
            
            this.hideModal('loginModal');
            this.showUserDashboard();
            this.showSuccessMessage('Welcome back!');
            
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Login failed. Please try again.';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email address.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Please try again later.';
                    break;
            }
            
            this.showError('password', errorMessage);
        } finally {
            this.setLoadingState(false);
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

        const displayName = this.currentUser.displayName || this.currentUser.name;
        const email = this.currentUser.email;
        
        userName.textContent = `Welcome ${this.isGuest ? 'back, Guest' : 'back, ' + displayName}!`;
        userEmail.textContent = email;
        userAvatar.src = this.currentUser.photoURL || this.currentUser.avatar;

        // Add guest indicator if needed
        if (this.isGuest) {
            userName.innerHTML += ' <span class="guest-badge">Guest</span>';
        }

        dashboard.style.display = 'block';

        // Update page title
        document.title = `${displayName} - AuraOS`;
    }

    // Set loading state for buttons
    setLoadingState(loading) {
        const submitBtn = document.querySelector('.login-submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        if (loading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            submitBtn.disabled = true;
        } else {
            btnText.style.display = 'flex';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    }

    // Guest login functionality
    async guestLogin() {
        try {
            // Create anonymous guest user
            const userCredential = await auth.signInAnonymously();
            const user = userCredential.user;
            
            this.currentUser = {
                uid: user.uid,
                email: 'guest@auraos.com',
                displayName: 'Guest User',
                photoURL: 'https://ui-avatars.com/api/?name=Guest&background=10b981&color=fff',
                isAnonymous: true
            };
            
            this.isLoggedIn = true;
            this.isGuest = true;
            
            this.hideModal('loginModal');
            this.showUserDashboard();
            this.showSuccessMessage('Welcome as guest!');
            
        } catch (error) {
            console.error('Guest login error:', error);
            this.showError('password', 'Guest login failed. Please try again.');
        }
    }

    // Google login
    async googleLogin() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');
            
            const result = await auth.signInWithPopup(provider);
            const user = result.user;
            
            this.currentUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            };
            
            this.isLoggedIn = true;
            this.isGuest = false;
            
            this.hideModal('loginModal');
            this.showUserDashboard();
            this.showSuccessMessage('Welcome!');
            
        } catch (error) {
            console.error('Google login error:', error);
            this.showError('password', 'Google login failed. Please try again.');
        }
    }

    // GitHub login
    async githubLogin() {
        try {
            const provider = new firebase.auth.GithubAuthProvider();
            provider.addScope('user:email');
            
            const result = await auth.signInWithPopup(provider);
            const user = result.user;
            
            this.currentUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            };
            
            this.isLoggedIn = true;
            this.isGuest = false;
            
            this.hideModal('loginModal');
            this.showUserDashboard();
            this.showSuccessMessage('Welcome!');
            
        } catch (error) {
            console.error('GitHub login error:', error);
            this.showError('password', 'GitHub login failed. Please try again.');
        }
    }

    // Handle successful authentication
    handleAuthSuccess(user) {
        this.currentUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email.split('@')[0])}&background=6366f1&color=fff`,
            isAnonymous: user.isAnonymous
        };
        
        this.isLoggedIn = true;
        this.isGuest = user.isAnonymous;
        
        this.showUserDashboard();
    }

    // Handle sign out
    handleAuthSignOut() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.isGuest = false;
        
        document.getElementById('userDashboard').style.display = 'none';
        document.getElementById('loginBtn').style.display = 'block';
        document.title = 'AuraOS - Modern Operating System';
    }

    logout() {
        auth.signOut().then(() => {
            this.showSuccessMessage('Logged out successfully');
        }).catch((error) => {
            console.error('Logout error:', error);
            this.showSuccessMessage('Logged out successfully');
        });
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

// Enhanced Chatbot System with Meta-Learning and Zero-Shot Capabilities
class ChatbotSystem {
    constructor() {
        this.isOpen = false;
        this.messageCount = 0;
        this.conversationHistory = [];
        this.learningPatterns = new Map();
        this.zeroShotCache = new Map();
        this.metaLearningModel = new MetaLearningModel();
        this.adaptationHistory = [];
        this.performanceMetrics = {
            accuracy: 0,
            responseTime: 0,
            userSatisfaction: 0,
            learningRate: 0
        };
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

        // Analytics button (add dynamically if not exists)
        if (!document.getElementById('showAnalytics')) {
            const analyticsBtn = document.createElement('button');
            analyticsBtn.id = 'showAnalytics';
            analyticsBtn.className = 'chatbot-analytics';
            analyticsBtn.innerHTML = '<i class="fas fa-chart-line"></i>';
            analyticsBtn.title = 'Show Learning Analytics';
            analyticsBtn.addEventListener('click', () => this.showLearningAnalytics());
            
            const header = document.querySelector('.chatbot-header');
            if (header) {
                const controls = header.querySelector('.chatbot-controls') || header;
                controls.appendChild(analyticsBtn);
            }
        }
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
        const startTime = performance.now();
        const message = userMessage.toLowerCase();
        
        // Zero-shot learning: Try to generate response without prior examples
        const zeroShotResponse = this.zeroShotLearning(userMessage);
        if (zeroShotResponse) {
            this.updatePerformanceMetrics(performance.now() - startTime, true);
            return zeroShotResponse;
        }

        // Meta-learning: Use learned patterns to adapt responses
        const metaResponse = this.metaLearningModel.adaptResponse(userMessage, this.conversationHistory);
        if (metaResponse) {
            this.updatePerformanceMetrics(performance.now() - startTime, true);
            return metaResponse;
        }

        // Pattern-based learning: Check learned patterns
        const patternResponse = this.checkLearnedPatterns(message);
        if (patternResponse) {
            this.updatePerformanceMetrics(performance.now() - startTime, true);
            return patternResponse;
        }

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
                this.learnPattern(keyword, response, userMessage);
                this.updatePerformanceMetrics(performance.now() - startTime, true);
                return response;
            }
        }

        // Default responses with learning
        const defaultResponses = [
            'That\'s an interesting question! Let me help you find the right information.',
            'I understand you\'re asking about that. Could you be more specific so I can provide better assistance?',
            'Great question! Let me connect you with the most relevant information about AuraOS.',
            'I\'d be happy to help with that! What specific aspect would you like to know more about?',
            'That\'s something our team can definitely help with. Let me provide you with some useful information.'
        ];

        const response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        this.learnFromInteraction(userMessage, response);
        this.updatePerformanceMetrics(performance.now() - startTime, false);
        return response;
    }

    // Zero-shot learning: Generate responses without prior examples
    zeroShotLearning(userMessage) {
        // Check cache first
        if (this.zeroShotCache.has(userMessage)) {
            return this.zeroShotCache.get(userMessage);
        }

        // Analyze message structure and intent
        const intent = this.analyzeIntent(userMessage);
        const entities = this.extractEntities(userMessage);
        
        // Generate response based on intent and entities
        const response = this.generateZeroShotResponse(intent, entities, userMessage);
        
        if (response) {
            this.zeroShotCache.set(userMessage, response);
            return response;
        }
        
        return null;
    }

    // Analyze user intent from message
    analyzeIntent(message) {
        const questionWords = ['what', 'how', 'when', 'where', 'why', 'who', 'which'];
        const actionWords = ['download', 'install', 'get', 'find', 'create', 'make'];
        const problemWords = ['error', 'issue', 'problem', 'bug', 'fix', 'help'];
        
        if (questionWords.some(word => message.includes(word))) {
            return 'question';
        } else if (actionWords.some(word => message.includes(word))) {
            return 'action';
        } else if (problemWords.some(word => message.includes(word))) {
            return 'problem';
        } else if (message.includes('hello') || message.includes('hi')) {
            return 'greeting';
        }
        
        return 'general';
    }

    // Extract entities from message
    extractEntities(message) {
        const entities = {
            os: [],
            features: [],
            technical: []
        };

        const osTerms = ['windows', 'macos', 'linux', 'ubuntu', 'debian'];
        const featureTerms = ['security', 'performance', 'interface', 'customization'];
        const technicalTerms = ['ram', 'cpu', 'gpu', 'storage', 'memory'];

        osTerms.forEach(term => {
            if (message.includes(term)) entities.os.push(term);
        });

        featureTerms.forEach(term => {
            if (message.includes(term)) entities.features.push(term);
        });

        technicalTerms.forEach(term => {
            if (message.includes(term)) entities.technical.push(term);
        });

        return entities;
    }

    // Generate zero-shot response based on intent and entities
    generateZeroShotResponse(intent, entities, originalMessage) {
        switch (intent) {
            case 'question':
                if (entities.os.length > 0) {
                    return `Great question about ${entities.os.join(' and ')}! AuraOS is compatible with multiple operating systems. Would you like specific installation instructions for any of these platforms?`;
                }
                if (entities.features.length > 0) {
                    return `I'd be happy to explain more about ${entities.features.join(', ')} in AuraOS. These are key features that make our OS unique. What specific aspect would you like to know more about?`;
                }
                return 'That\'s a great question! Let me provide you with the most relevant information about AuraOS.';
                
            case 'action':
                if (entities.os.length > 0) {
                    return `I can help you with ${originalMessage} for ${entities.os.join(' and ')}. Let me guide you through the process step by step.`;
                }
                return `I\'d be happy to help you with that action! Let me provide you with the best approach for AuraOS.`;
                
            case 'problem':
                return `I understand you\'re experiencing an issue. Let me help you troubleshoot this problem with AuraOS. Can you provide more details about the specific error or situation?`;
                
            case 'greeting':
                return `Hello! I\'m your AuraOS assistant with advanced learning capabilities. I can help you with downloads, technical questions, troubleshooting, and much more. What would you like to explore today?`;
                
            default:
                return null;
        }
    }

    // Check learned patterns from previous interactions
    checkLearnedPatterns(message) {
        for (const [pattern, response] of this.learningPatterns) {
            if (this.calculateSimilarity(message, pattern) > 0.7) {
                return response;
            }
        }
        return null;
    }

    // Learn patterns from successful interactions
    learnPattern(keyword, response, userMessage) {
        const pattern = {
            keyword,
            userMessage,
            response,
            timestamp: Date.now(),
            successCount: 1
        };
        
        if (this.learningPatterns.has(keyword)) {
            const existing = this.learningPatterns.get(keyword);
            existing.successCount++;
            existing.lastUsed = Date.now();
        } else {
            this.learningPatterns.set(keyword, pattern);
        }
    }

    // Learn from general interactions
    learnFromInteraction(userMessage, response) {
        const interaction = {
            userMessage,
            response,
            timestamp: Date.now(),
            feedback: null
        };
        
        this.conversationHistory.push(interaction);
        
        // Keep only recent history for performance
        if (this.conversationHistory.length > 100) {
            this.conversationHistory = this.conversationHistory.slice(-50);
        }
        
        // Update meta-learning model
        this.metaLearningModel.updateModel(interaction);
    }

    // Calculate similarity between two strings
    calculateSimilarity(str1, str2) {
        const words1 = str1.toLowerCase().split(' ');
        const words2 = str2.toLowerCase().split(' ');
        const intersection = words1.filter(word => words2.includes(word));
        return intersection.length / Math.max(words1.length, words2.length);
    }

    // Update performance metrics
    updatePerformanceMetrics(responseTime, success) {
        this.performanceMetrics.responseTime = 
            (this.performanceMetrics.responseTime + responseTime) / 2;
        
        if (success) {
            this.performanceMetrics.accuracy = Math.min(1, this.performanceMetrics.accuracy + 0.01);
        }
        
        // Calculate learning rate based on pattern improvements
        this.performanceMetrics.learningRate = this.calculateLearningRate();
    }

    // Calculate current learning rate
    calculateLearningRate() {
        const recentInteractions = this.conversationHistory.slice(-10);
        if (recentInteractions.length < 5) return 0;
        
        let improvementCount = 0;
        for (let i = 1; i < recentInteractions.length; i++) {
            if (this.calculateSimilarity(
                recentInteractions[i].userMessage, 
                recentInteractions[i-1].userMessage
            ) > 0.5) {
                improvementCount++;
            }
        }
        
        return improvementCount / (recentInteractions.length - 1);
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

    // Show learning analytics
    showLearningAnalytics() {
        const stats = this.metaLearningModel.getLearningStats();
        const metrics = this.performanceMetrics;
        
        const analyticsHTML = `
            <div class="analytics-modal">
                <div class="analytics-header">
                    <h3>Learning Analytics</h3>
                    <button class="close-analytics">&times;</button>
                </div>
                <div class="analytics-content">
                    <div class="metrics-grid">
                        <div class="metric-card">
                            <h4>Response Accuracy</h4>
                            <div class="metric-value">${(metrics.accuracy * 100).toFixed(1)}%</div>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: ${metrics.accuracy * 100}%"></div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <h4>Response Time</h4>
                            <div class="metric-value">${metrics.responseTime.toFixed(0)}ms</div>
                        </div>
                        <div class="metric-card">
                            <h4>Learning Rate</h4>
                            <div class="metric-value">${(metrics.learningRate * 100).toFixed(1)}%</div>
                            <div class="metric-bar">
                                <div class="metric-fill" style="width: ${metrics.learningRate * 100}%"></div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <h4>Adaptation Rules</h4>
                            <div class="metric-value">${stats.adaptationRules}</div>
                        </div>
                        <div class="metric-card">
                            <h4>Context Memory</h4>
                            <div class="metric-value">${stats.contextMemory} items</div>
                        </div>
                        <div class="metric-card">
                            <h4>Zero-Shot Cache</h4>
                            <div class="metric-value">${this.zeroShotCache.size} responses</div>
                        </div>
                    </div>
                    <div class="learning-insights">
                        <h4>Learning Insights</h4>
                        <ul>
                            <li>Pattern Recognition: ${this.learningPatterns.size} learned patterns</li>
                            <li>Conversation History: ${this.conversationHistory.length} interactions</li>
                            <li>Adaptation Success: ${stats.recentAdaptations} recent adaptations</li>
                            <li>Meta-Learning Rate: ${(stats.learningRate * 100).toFixed(1)}%</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        // Create and show modal
        const modal = document.createElement('div');
        modal.className = 'analytics-overlay';
        modal.innerHTML = analyticsHTML;
        document.body.appendChild(modal);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .analytics-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10001;
            }
            .analytics-modal {
                background: white;
                border-radius: 1rem;
                padding: 2rem;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }
            .analytics-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 1rem;
            }
            .analytics-header h3 {
                margin: 0;
                color: #1f2937;
            }
            .close-analytics {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6b7280;
            }
            .metrics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }
            .metric-card {
                background: #f9fafb;
                padding: 1rem;
                border-radius: 0.5rem;
                text-align: center;
            }
            .metric-card h4 {
                margin: 0 0 0.5rem 0;
                font-size: 0.875rem;
                color: #6b7280;
            }
            .metric-value {
                font-size: 1.5rem;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 0.5rem;
            }
            .metric-bar {
                height: 4px;
                background: #e5e7eb;
                border-radius: 2px;
                overflow: hidden;
            }
            .metric-fill {
                height: 100%;
                background: #6366f1;
                transition: width 0.3s ease;
            }
            .learning-insights {
                background: #f3f4f6;
                padding: 1rem;
                border-radius: 0.5rem;
            }
            .learning-insights h4 {
                margin: 0 0 1rem 0;
                color: #1f2937;
            }
            .learning-insights ul {
                margin: 0;
                padding-left: 1.5rem;
            }
            .learning-insights li {
                margin-bottom: 0.5rem;
                color: #4b5563;
            }
        `;
        document.head.appendChild(style);

        // Close modal functionality
        modal.querySelector('.close-analytics').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.head.removeChild(style);
            }
        });
    }

    // Update learning rate display
    updateLearningDisplay() {
        const learningRateDisplay = document.getElementById('learningRateDisplay');
        if (learningRateDisplay) {
            const rate = (this.performanceMetrics.learningRate * 100).toFixed(1);
            learningRateDisplay.textContent = `${rate}%`;
        }
    }
}

// Meta-Learning Model for Adaptive Responses
class MetaLearningModel {
    constructor() {
        this.adaptationRules = new Map();
        this.contextMemory = [];
        this.learningRate = 0.1;
        this.adaptationHistory = [];
        this.performanceWeights = {
            similarity: 0.4,
            context: 0.3,
            timing: 0.2,
            success: 0.1
        };
    }

    // Adapt response based on conversation history and patterns
    adaptResponse(userMessage, conversationHistory) {
        const context = this.buildContext(userMessage, conversationHistory);
        const adaptedResponse = this.generateAdaptedResponse(userMessage, context);
        
        if (adaptedResponse) {
            this.recordAdaptation(userMessage, adaptedResponse, context);
            return adaptedResponse;
        }
        
        return null;
    }

    // Build context from conversation history
    buildContext(userMessage, conversationHistory) {
        const context = {
            recentTopics: [],
            userPreferences: {},
            conversationFlow: [],
            emotionalTone: 'neutral'
        };

        // Analyze recent topics
        const recentMessages = conversationHistory.slice(-5);
        recentMessages.forEach(interaction => {
            const topics = this.extractTopics(interaction.userMessage);
            context.recentTopics.push(...topics);
        });

        // Detect conversation flow patterns
        context.conversationFlow = this.analyzeConversationFlow(conversationHistory);

        // Detect emotional tone
        context.emotionalTone = this.detectEmotionalTone(userMessage);

        return context;
    }

    // Extract topics from message
    extractTopics(message) {
        const topics = [];
        const topicKeywords = {
            'installation': ['install', 'setup', 'configure'],
            'troubleshooting': ['error', 'problem', 'issue', 'fix'],
            'features': ['feature', 'function', 'capability'],
            'performance': ['speed', 'fast', 'slow', 'performance'],
            'security': ['security', 'safe', 'protect', 'secure']
        };

        Object.entries(topicKeywords).forEach(([topic, keywords]) => {
            if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
                topics.push(topic);
            }
        });

        return topics;
    }

    // Analyze conversation flow patterns
    analyzeConversationFlow(conversationHistory) {
        if (conversationHistory.length < 2) return ['initial'];

        const flow = [];
        for (let i = 1; i < conversationHistory.length; i++) {
            const prev = conversationHistory[i - 1];
            const curr = conversationHistory[i];
            
            if (this.calculateSimilarity(prev.userMessage, curr.userMessage) > 0.6) {
                flow.push('continuation');
            } else {
                flow.push('topic_shift');
            }
        }

        return flow;
    }

    // Detect emotional tone of message
    detectEmotionalTone(message) {
        const positiveWords = ['great', 'awesome', 'excellent', 'love', 'amazing'];
        const negativeWords = ['terrible', 'awful', 'hate', 'bad', 'problem'];
        const urgentWords = ['urgent', 'asap', 'quickly', 'immediately'];

        const messageLower = message.toLowerCase();
        
        if (urgentWords.some(word => messageLower.includes(word))) {
            return 'urgent';
        } else if (positiveWords.some(word => messageLower.includes(word))) {
            return 'positive';
        } else if (negativeWords.some(word => messageLower.includes(word))) {
            return 'negative';
        }
        
        return 'neutral';
    }

    // Generate adapted response based on context
    generateAdaptedResponse(userMessage, context) {
        // Check for adaptation rules
        for (const [pattern, rule] of this.adaptationRules) {
            if (this.calculateSimilarity(userMessage, pattern) > 0.7) {
                return this.applyAdaptationRule(rule, context, userMessage);
            }
        }

        // Generate contextual response
        return this.generateContextualResponse(userMessage, context);
    }

    // Apply adaptation rule with context
    applyAdaptationRule(rule, context, userMessage) {
        let response = rule.baseResponse;

        // Adapt based on emotional tone
        if (context.emotionalTone === 'urgent') {
            response = `I understand this is urgent. ${response} Let me provide you with immediate assistance.`;
        } else if (context.emotionalTone === 'negative') {
            response = `I'm sorry you're experiencing issues. ${response} Let me help you resolve this.`;
        } else if (context.emotionalTone === 'positive') {
            response = `Great to hear! ${response} I'm here to help you get the most out of AuraOS.`;
        }

        // Adapt based on recent topics
        if (context.recentTopics.length > 0) {
            const recentTopic = context.recentTopics[context.recentTopics.length - 1];
            response += `\n\nSince you were asking about ${recentTopic}, would you like me to elaborate on that as well?`;
        }

        return response;
    }

    // Generate contextual response
    generateContextualResponse(userMessage, context) {
        const messageLower = userMessage.toLowerCase();

        // Context-aware responses based on conversation flow
        if (context.conversationFlow.includes('continuation')) {
            return "I see you'd like to continue our discussion. Let me provide more detailed information about that topic.";
        }

        if (context.recentTopics.length > 0) {
            const lastTopic = context.recentTopics[context.recentTopics.length - 1];
            return `Building on our previous discussion about ${lastTopic}, I can help you with that. What specific aspect would you like to explore further?`;
        }

        // Emotional tone adaptation
        switch (context.emotionalTone) {
            case 'urgent':
                return "I understand this is time-sensitive. Let me provide you with the most efficient solution right away.";
            case 'negative':
                return "I'm here to help resolve any issues you're experiencing. Let's work through this together.";
            case 'positive':
                return "I'm glad to help! Let me provide you with the information you need to continue your positive experience with AuraOS.";
            default:
                return null;
        }
    }

    // Update model with new interaction
    updateModel(interaction) {
        // Extract patterns from successful interactions
        if (interaction.feedback === 'positive' || this.isSuccessfulInteraction(interaction)) {
            this.createAdaptationRule(interaction);
        }

        // Update context memory
        this.contextMemory.push({
            message: interaction.userMessage,
            response: interaction.response,
            timestamp: interaction.timestamp
        });

        // Keep memory manageable
        if (this.contextMemory.length > 50) {
            this.contextMemory = this.contextMemory.slice(-25);
        }

        // Update learning rate based on performance
        this.updateLearningRate();
    }

    // Create adaptation rule from successful interaction
    createAdaptationRule(interaction) {
        const pattern = this.extractPattern(interaction.userMessage);
        const rule = {
            pattern,
            baseResponse: interaction.response,
            successCount: 1,
            lastUsed: Date.now(),
            context: this.buildContext(interaction.userMessage, [interaction])
        };

        if (this.adaptationRules.has(pattern)) {
            const existing = this.adaptationRules.get(pattern);
            existing.successCount++;
            existing.lastUsed = Date.now();
        } else {
            this.adaptationRules.set(pattern, rule);
        }
    }

    // Extract pattern from message
    extractPattern(message) {
        // Simple pattern extraction - could be enhanced with NLP
        const words = message.toLowerCase().split(' ');
        return words.filter(word => word.length > 3).join(' ');
    }

    // Check if interaction was successful
    isSuccessfulInteraction(interaction) {
        // Simple heuristic - could be enhanced with user feedback
        const responseLength = interaction.response.length;
        const hasSpecificInfo = interaction.response.includes('•') || 
                               interaction.response.includes('1.') ||
                               interaction.response.includes('specific');
        
        return responseLength > 50 && hasSpecificInfo;
    }

    // Update learning rate based on performance
    updateLearningRate() {
        const recentAdaptations = this.adaptationHistory.slice(-10);
        if (recentAdaptations.length < 5) return;

        const successRate = recentAdaptations.filter(a => a.success).length / recentAdaptations.length;
        
        if (successRate > 0.7) {
            this.learningRate = Math.min(0.2, this.learningRate + 0.01);
        } else if (successRate < 0.3) {
            this.learningRate = Math.max(0.05, this.learningRate - 0.01);
        }
    }

    // Record adaptation attempt
    recordAdaptation(userMessage, response, context) {
        this.adaptationHistory.push({
            userMessage,
            response,
            context,
            timestamp: Date.now(),
            success: null // Would be updated with user feedback
        });

        if (this.adaptationHistory.length > 100) {
            this.adaptationHistory = this.adaptationHistory.slice(-50);
        }
    }

    // Calculate similarity between two strings
    calculateSimilarity(str1, str2) {
        const words1 = str1.toLowerCase().split(' ');
        const words2 = str2.toLowerCase().split(' ');
        const intersection = words1.filter(word => words2.includes(word));
        return intersection.length / Math.max(words1.length, words2.length);
    }

    // Get learning statistics
    getLearningStats() {
        return {
            adaptationRules: this.adaptationRules.size,
            contextMemory: this.contextMemory.length,
            learningRate: this.learningRate,
            recentAdaptations: this.adaptationHistory.length,
            performanceWeights: this.performanceWeights
        };
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
    toggleChatbot: () => window.chatbotSystem.toggleChatbot(),
    
    // Meta-Learning and AI capabilities
    getLearningStats: () => window.chatbotSystem.metaLearningModel.getLearningStats(),
    getPerformanceMetrics: () => window.chatbotSystem.performanceMetrics,
    showLearningAnalytics: () => window.chatbotSystem.showLearningAnalytics(),
    
    // Zero-shot learning capabilities
    testZeroShotLearning: (message) => {
        const chatbot = window.chatbotSystem;
        return chatbot.zeroShotLearning(message);
    },
    
    // Meta-learning capabilities
    testMetaLearning: (message) => {
        const chatbot = window.chatbotSystem;
        return chatbot.metaLearningModel.adaptResponse(message, chatbot.conversationHistory);
    },
    
    // Learning system controls
    resetLearning: () => {
        const chatbot = window.chatbotSystem;
        chatbot.learningPatterns.clear();
        chatbot.zeroShotCache.clear();
        chatbot.conversationHistory = [];
        chatbot.metaLearningModel = new MetaLearningModel();
        chatbot.performanceMetrics = {
            accuracy: 0,
            responseTime: 0,
            userSatisfaction: 0,
            learningRate: 0
        };
        console.log('Learning system reset successfully');
    },
    
    // Export learning data
    exportLearningData: () => {
        const chatbot = window.chatbotSystem;
        const data = {
            learningPatterns: Array.from(chatbot.learningPatterns.entries()),
            zeroShotCache: Array.from(chatbot.zeroShotCache.entries()),
            conversationHistory: chatbot.conversationHistory,
            performanceMetrics: chatbot.performanceMetrics,
            metaLearningStats: chatbot.metaLearningModel.getLearningStats(),
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `auraos-learning-data-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return data;
    }
};
