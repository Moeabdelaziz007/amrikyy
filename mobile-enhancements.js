// Mobile Enhancements - تحسينات الشاشات الصغيرة
class MobileEnhancements {
  constructor() {
    this.isMobile = this.detectMobile();
    this.touchStartY = 0;
    this.touchStartX = 0;
    this.isScrolling = false;

    this.init();
  }

  init() {
    this.setupMobileOptimizations();
    this.setupTouchGestures();
    this.setupMobileNavigation();
    this.setupMobileChatbot();
    this.setupMobileModals();
    this.setupPerformanceOptimizations();
  }

  detectMobile() {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) ||
      window.innerWidth <= 768 ||
      'ontouchstart' in window
    );
  }

  setupMobileOptimizations() {
    if (!this.isMobile) return;

    // Add mobile class to body
    document.body.classList.add('mobile-device');

    // Optimize viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.content =
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }

    // Prevent zoom on input focus
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        if (this.isMobile) {
          input.style.fontSize = '16px';
        }
      });

      input.addEventListener('blur', () => {
        if (this.isMobile) {
          input.style.fontSize = '';
        }
      });
    });

    // Optimize images for mobile
    this.optimizeImagesForMobile();

    // Setup mobile-specific event listeners
    this.setupMobileEventListeners();
  }

  setupTouchGestures() {
    if (!this.isMobile) return;

    // Swipe gestures for navigation
    let startX, startY, endX, endY;

    document.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', e => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;

      this.handleSwipeGesture(startX, startY, endX, endY);
    });

    // Pull to refresh
    this.setupPullToRefresh();

    // Touch feedback
    this.setupTouchFeedback();
  }

  handleSwipeGesture(startX, startY, endX, endY) {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          this.handleSwipeRight();
        } else {
          this.handleSwipeLeft();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) {
          this.handleSwipeDown();
        } else {
          this.handleSwipeUp();
        }
      }
    }
  }

  handleSwipeRight() {
    // Open navigation menu
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && !navMenu.classList.contains('active')) {
      this.toggleMobileMenu();
    }
  }

  handleSwipeLeft() {
    // Close navigation menu
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && navMenu.classList.contains('active')) {
      this.toggleMobileMenu();
    }
  }

  handleSwipeUp() {
    // Show chatbot if hidden
    const chatbot = document.getElementById('chatbotContainer');
    if (chatbot && chatbot.style.display === 'none') {
      chatbot.style.display = 'block';
    }
  }

  handleSwipeDown() {
    // Hide chatbot
    const chatbot = document.getElementById('chatbotContainer');
    if (chatbot && chatbot.style.display !== 'none') {
      chatbot.style.display = 'none';
    }
  }

  setupPullToRefresh() {
    let startY = 0;
    let pullDistance = 0;
    const pullThreshold = 100;

    document.addEventListener('touchstart', e => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    });

    document.addEventListener('touchmove', e => {
      if (window.scrollY === 0 && startY > 0) {
        pullDistance = e.touches[0].clientY - startY;

        if (pullDistance > 0) {
          e.preventDefault();
          this.showPullToRefreshIndicator(pullDistance);
        }
      }
    });

    document.addEventListener('touchend', () => {
      if (pullDistance > pullThreshold) {
        this.refreshPage();
      }

      this.hidePullToRefreshIndicator();
      startY = 0;
      pullDistance = 0;
    });
  }

  showPullToRefreshIndicator(distance) {
    let indicator = document.getElementById('pull-to-refresh');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'pull-to-refresh';
      indicator.innerHTML = `
                <div class="pull-indicator">
                    <i class="fas fa-arrow-down"></i>
                    <span>Pull to refresh</span>
                </div>
            `;
      document.body.insertBefore(indicator, document.body.firstChild);
    }

    const opacity = Math.min(distance / 100, 1);
    indicator.style.opacity = opacity;
    indicator.style.transform = `translateY(${distance}px)`;
  }

  hidePullToRefreshIndicator() {
    const indicator = document.getElementById('pull-to-refresh');
    if (indicator) {
      indicator.style.opacity = '0';
      indicator.style.transform = 'translateY(-50px)';
    }
  }

  refreshPage() {
    window.location.reload();
  }

  setupTouchFeedback() {
    const interactiveElements = document.querySelectorAll(
      '.btn, .nav-link, .tab-btn, .quick-btn, .feature-card'
    );

    interactiveElements.forEach(element => {
      element.addEventListener('touchstart', () => {
        element.classList.add('touch-active');
      });

      element.addEventListener('touchend', () => {
        setTimeout(() => {
          element.classList.remove('touch-active');
        }, 150);
      });
    });
  }

  setupMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        this.toggleMobileMenu();
      });

      // Close menu when clicking outside
      document.addEventListener('click', e => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
          navMenu.classList.remove('active');
          hamburger.classList.remove('active');
        }
      });

      // Close menu when clicking on links
      const navLinks = navMenu.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          hamburger.classList.remove('active');
        });
      });
    }
  }

  toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    }
  }

  setupMobileChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');

    if (chatbotToggle && chatbotWindow) {
      // Enhanced mobile chatbot behavior
      chatbotToggle.addEventListener('click', () => {
        if (this.isMobile) {
          chatbotWindow.classList.toggle('active');
          chatbotWindow.classList.toggle('mobile-fullscreen');

          // Add swipe hint on first open
          if (!chatbotWindow.dataset.hintShown) {
            this.showSwipeHint();
            chatbotWindow.dataset.hintShown = 'true';
          }
        }
      });

      // Resize chatbot for mobile
      if (this.isMobile) {
        chatbotWindow.style.width = '100%';
        chatbotWindow.style.height = '75vh';
        chatbotWindow.style.maxWidth = 'none';
        chatbotWindow.style.position = 'fixed';
        chatbotWindow.style.bottom = '0';
        chatbotWindow.style.left = '0';
        chatbotWindow.style.right = '0';
        chatbotWindow.style.transform = 'translateY(100%)';
        chatbotWindow.style.transition =
          'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }

      // Handle mobile keyboard
      const chatbotInput = document.getElementById('chatbotInput');
      if (chatbotInput) {
        chatbotInput.addEventListener('focus', () => {
          if (this.isMobile) {
            document.body.classList.add('keyboard-open');
            setTimeout(() => {
              const messagesContainer =
                document.getElementById('chatbotMessages');
              if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
              }
            }, 300);
          }
        });

        chatbotInput.addEventListener('blur', () => {
          if (this.isMobile) {
            setTimeout(() => {
              document.body.classList.remove('keyboard-open');
            }, 100);
          }
        });
      }

      // Close chatbot when clicking outside
      document.addEventListener('click', e => {
        if (this.isMobile && chatbotWindow.classList.contains('active')) {
          if (
            !chatbotToggle.contains(e.target) &&
            !chatbotWindow.contains(e.target)
          ) {
            chatbotWindow.classList.remove('active');
          }
        }
      });
    }
  }

  showSwipeHint() {
    const hint = document.createElement('div');
    hint.className = 'swipe-hint';
    hint.innerHTML = `
            <i class="fas fa-hand-pointer"></i>
            <span>Swipe to navigate</span>
        `;

    document.body.appendChild(hint);

    setTimeout(() => {
      hint.classList.add('show');
    }, 500);

    setTimeout(() => {
      hint.classList.remove('show');
      setTimeout(() => {
        hint.remove();
      }, 300);
    }, 3000);
  }

  setupMobileModals() {
    const modals = document.querySelectorAll('.modal');

    modals.forEach(modal => {
      if (this.isMobile) {
        modal.classList.add('mobile-modal');
      }

      // Handle mobile modal closing
      modal.addEventListener('click', e => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    });
  }

  optimizeImagesForMobile() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      if (this.isMobile) {
        // Lazy loading for mobile
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }

        // Optimize image sizes
        if (img.width > window.innerWidth) {
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
        }
      }
    });
  }

  setupMobileEventListeners() {
    // Handle orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleOrientationChange();
      }, 500);
    });

    // Handle resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handlePageHidden();
      } else {
        this.handlePageVisible();
      }
    });

    // Handle online/offline
    window.addEventListener('online', () => {
      this.showToast('You are back online!', 'success');
    });

    window.addEventListener('offline', () => {
      this.showToast('You are offline. Some features may not work.', 'warning');
    });
  }

  handleOrientationChange() {
    // Recalculate chatbot size
    const chatbotWindow = document.getElementById('chatbotWindow');
    if (chatbotWindow && this.isMobile) {
      if (window.innerHeight > window.innerWidth) {
        // Portrait
        chatbotWindow.style.height = '70vh';
      } else {
        // Landscape
        chatbotWindow.style.height = '60vh';
      }
    }

    // Recalculate modal sizes
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (modal.style.display === 'block') {
        modal.style.display = 'none';
        setTimeout(() => {
          modal.style.display = 'block';
        }, 100);
      }
    });
  }

  handleResize() {
    const newIsMobile = window.innerWidth <= 768;

    if (newIsMobile !== this.isMobile) {
      this.isMobile = newIsMobile;
      document.body.classList.toggle('mobile-device', this.isMobile);

      if (this.isMobile) {
        this.setupMobileOptimizations();
      }
    }
  }

  handlePageHidden() {
    // Pause animations and timers
    document.body.classList.add('page-hidden');
  }

  handlePageVisible() {
    // Resume animations and timers
    document.body.classList.remove('page-hidden');
  }

  setupPerformanceOptimizations() {
    if (!this.isMobile) return;

    // Reduce animations on low-end devices
    if (this.isLowEndDevice()) {
      document.body.classList.add('reduced-motion');
    }

    // Optimize scroll performance
    this.optimizeScrollPerformance();

    // Lazy load non-critical resources
    this.lazyLoadResources();
  }

  isLowEndDevice() {
    // Simple heuristic to detect low-end devices
    return (
      navigator.hardwareConcurrency <= 2 ||
      /Android [1-4]\.|iPhone OS [1-9]_/.test(navigator.userAgent)
    );
  }

  optimizeScrollPerformance() {
    let ticking = false;

    const updateScroll = () => {
      // Throttle scroll events
      ticking = false;
    };

    document.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(updateScroll);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  lazyLoadResources() {
    // Lazy load non-critical CSS
    const lazyStyles = [
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    ];

    lazyStyles.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'print';
      link.onload = () => {
        link.media = 'all';
      };
      document.head.appendChild(link);
    });
  }

  showToast(message, type = 'info') {
    if (window.Analytics && window.Analytics.showToast) {
      window.Analytics.showToast(message, type);
    } else {
      // Fallback toast
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.textContent = message;
      toast.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 12px 20px;
                border-radius: 25px;
                z-index: 10000;
                font-size: 14px;
            `;

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.remove();
      }, 3000);
    }
  }
}

// Initialize mobile enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MobileEnhancements();
});

// Export for global access
window.MobileEnhancements = MobileEnhancements;
