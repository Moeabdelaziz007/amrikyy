// AuraOS Router System
class AuraRouter {
    constructor() {
        this.routes = new Map();
        this.currentRoute = '';
        this.isTransitioning = false;
        this.transitionDuration = 500;
        this.init();
    }

    init() {
        // Define routes
        this.addRoute('/', 'index.html');
        this.addRoute('/home', 'index.html');
        this.addRoute('/login', 'login.html');
        this.addRoute('/signup', 'signup.html');
        this.addRoute('/loading', 'loading.html');
        this.addRoute('/dashboard', 'dashboard.html');
        this.addRoute('/settings', 'settings.html');
        this.addRoute('/about', 'about.html');

        // Setup event listeners
        this.setupEventListeners();
        
        // Handle initial route
        this.handleRoute();
    }

    addRoute(path, page) {
        this.routes.set(path, page);
    }

    setupEventListeners() {
        // Handle popstate (back/forward buttons)
        window.addEventListener('popstate', (e) => {
            this.handleRoute();
        });

        // Intercept link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link && this.shouldIntercept(link)) {
                e.preventDefault();
                const href = link.getAttribute('href');
                this.navigate(href);
            }
        });

        // Handle form submissions that redirect
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const redirectTo = form.getAttribute('data-redirect');
            if (redirectTo) {
                e.preventDefault();
                setTimeout(() => {
                    this.navigate(redirectTo);
                }, 1000); // Allow form processing time
            }
        });
    }

    shouldIntercept(link) {
        const href = link.getAttribute('href');
        
        // Don't intercept external links
        if (href.startsWith('http') || href.startsWith('//')) {
            return false;
        }

        // Don't intercept hash links
        if (href.startsWith('#')) {
            return false;
        }

        // Don't intercept mailto/tel links
        if (href.startsWith('mailto:') || href.startsWith('tel:')) {
            return false;
        }

        // Don't intercept if target="_blank"
        if (link.getAttribute('target') === '_blank') {
            return false;
        }

        return true;
    }

    navigate(path, options = {}) {
        if (this.isTransitioning && !options.force) {
            return;
        }

        // Clean path
        const cleanPath = this.cleanPath(path);
        
        // Check if route exists
        const page = this.getPageForPath(cleanPath);
        if (!page) {
            console.warn(`Route not found: ${cleanPath}`);
            return;
        }

        // Don't navigate to same page
        if (cleanPath === this.currentRoute && !options.force) {
            return;
        }

        // Update history if not a replace
        if (!options.replace) {
            history.pushState({ path: cleanPath }, '', cleanPath);
        }

        // Perform transition
        this.transitionToPage(page, cleanPath, options);
    }

    cleanPath(path) {
        // Remove .html extension and normalize
        let cleanPath = path.replace(/\.html$/, '');
        
        // Handle special cases
        if (cleanPath === '/index' || cleanPath === '') {
            cleanPath = '/';
        }

        return cleanPath;
    }

    getPageForPath(path) {
        // Try exact match first
        if (this.routes.has(path)) {
            return this.routes.get(path);
        }

        // Try with .html extension
        const htmlPath = path + '.html';
        for (const [route, page] of this.routes.entries()) {
            if (page === htmlPath || page === path + '.html') {
                return page;
            }
        }

        return null;
    }

    async transitionToPage(page, path, options = {}) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        try {
            // Start exit transition
            await this.exitTransition();
            
            // Load new page
            await this.loadPage(page, options);
            
            // Update current route
            this.currentRoute = path;
            
            // Start enter transition
            await this.enterTransition();
            
        } catch (error) {
            console.error('Transition error:', error);
            // Fallback to direct navigation
            window.location.href = page;
        } finally {
            this.isTransitioning = false;
        }
    }

    async exitTransition() {
        return new Promise((resolve) => {
            const body = document.body;
            
            // Add exit class
            body.classList.add('page-exit');
            
            // Wait for animation
            setTimeout(() => {
                resolve();
            }, this.transitionDuration / 2);
        });
    }

    async loadPage(page, options = {}) {
        return new Promise((resolve, reject) => {
            // For now, use traditional navigation
            // In a real SPA, you would fetch and replace content
            window.location.href = page + (options.search || '');
            resolve();
        });
    }

    async enterTransition() {
        return new Promise((resolve) => {
            const body = document.body;
            
            // Remove exit class and add enter class
            body.classList.remove('page-exit');
            body.classList.add('page-enter');
            
            // Wait for animation
            setTimeout(() => {
                body.classList.remove('page-enter');
                resolve();
            }, this.transitionDuration / 2);
        });
    }

    handleRoute() {
        const path = this.cleanPath(window.location.pathname);
        this.currentRoute = path;
    }

    // Utility methods
    back() {
        history.back();
    }

    forward() {
        history.forward();
    }

    replace(path) {
        this.navigate(path, { replace: true });
    }

    getCurrentRoute() {
        return this.currentRoute;
    }

    // Page transition effects
    static addTransitionStyles() {
        if (document.getElementById('aura-router-styles')) return;

        const style = document.createElement('style');
        style.id = 'aura-router-styles';
        style.textContent = `
            /* Page transition styles */
            body {
                transition: opacity 0.3s ease, transform 0.3s ease;
            }

            body.page-exit {
                opacity: 0;
                transform: translateY(-10px);
            }

            body.page-enter {
                opacity: 0;
                transform: translateY(10px);
                animation: pageEnter 0.5s ease forwards;
            }

            @keyframes pageEnter {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Loading overlay for transitions */
            .page-transition-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, var(--bg-dark), var(--bg-primary));
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .page-transition-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .transition-spinner {
                width: 50px;
                height: 50px;
                border: 3px solid rgba(0, 217, 255, 0.3);
                border-top: 3px solid var(--primary-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Smooth link hover effects */
            a {
                transition: all 0.2s ease;
            }

            /* Page-specific enter animations */
            .dashboard-page,
            .settings-page,
            .about-page {
                animation: slideInUp 0.6s ease-out;
            }

            .login-page,
            .signup-page {
                animation: fadeInScale 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes fadeInScale {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }

            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                body,
                .page-transition-overlay,
                a {
                    transition: none !important;
                }
                
                body.page-enter,
                .dashboard-page,
                .settings-page,
                .about-page,
                .login-page,
                .signup-page {
                    animation: none !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Enhanced Page Transitions
class PageTransitions {
    constructor() {
        this.transitionOverlay = null;
        this.init();
    }

    init() {
        this.createOverlay();
        this.setupGlobalTransitions();
    }

    createOverlay() {
        this.transitionOverlay = document.createElement('div');
        this.transitionOverlay.className = 'page-transition-overlay';
        this.transitionOverlay.innerHTML = `
            <div class="transition-spinner"></div>
        `;
        document.body.appendChild(this.transitionOverlay);
    }

    setupGlobalTransitions() {
        // Intercept form submissions for smooth transitions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.method === 'post' || form.getAttribute('data-transition') === 'true') {
                this.showTransition();
            }
        });

        // Add transition to external navigation
        window.addEventListener('beforeunload', () => {
            this.showTransition();
        });
    }

    showTransition() {
        if (this.transitionOverlay) {
            this.transitionOverlay.classList.add('active');
        }
    }

    hideTransition() {
        if (this.transitionOverlay) {
            this.transitionOverlay.classList.remove('active');
        }
    }

    // Smooth scroll to element
    scrollToElement(element, offset = 0) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }

        if (element) {
            const elementTop = element.offsetTop - offset;
            window.scrollTo({
                top: elementTop,
                behavior: 'smooth'
            });
        }
    }

    // Fade in elements when they come into view
    observeElements(selector = '.animate-on-scroll') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll(selector).forEach(el => {
            observer.observe(el);
        });
    }
}

// Initialize router and transitions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add transition styles
    AuraRouter.addTransitionStyles();
    
    // Initialize router
    window.auraRouter = new AuraRouter();
    
    // Initialize transitions
    window.pageTransitions = new PageTransitions();
    
    // Setup smooth scrolling for hash links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            if (href && href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    window.pageTransitions.scrollToElement(target, 80);
                }
            }
        });
    });
    
    // Observe elements for animations
    window.pageTransitions.observeElements();
    
    console.log('AuraOS Router initialized successfully!');
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuraRouter, PageTransitions };
}
