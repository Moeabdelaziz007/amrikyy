// Advanced Analytics System
class AnalyticsManager {
  constructor() {
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.pageViews = [];
    this.userInteractions = [];
    this.performanceMetrics = {};
    this.errorLogs = [];

    this.init();
  }

  init() {
    this.setupPerformanceMonitoring();
    this.setupUserBehaviorTracking();
    this.setupErrorTracking();
    this.setupCoreWebVitals();
    this.startSessionTracking();
    this.setupHeatmapTracking();
    this.setupConversionTracking();
    this.setupFirebaseAuthListener();
  }

  // Setup Firebase authentication listener for analytics sync
  setupFirebaseAuthListener() {
    if (typeof firebase !== 'undefined' && firebase.auth) {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          // User signed in, sync local analytics
          this.syncLocalAnalytics();
        }
      });
    }
  }

  // Performance Monitoring
  setupPerformanceMonitoring() {
    // Navigation Timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.captureNavigationTiming();
        this.captureResourceTiming();
        this.capturePaintTiming();
      }, 0);
    });

    // Memory Usage
    if ('memory' in performance) {
      setInterval(() => {
        this.captureMemoryUsage();
      }, 30000); // Every 30 seconds
    }

    // Network Information
    if ('connection' in navigator) {
      this.captureNetworkInfo();
      navigator.connection.addEventListener('change', () => {
        this.captureNetworkInfo();
      });
    }
  }

  captureNavigationTiming() {
    const timing = performance.getEntriesByType('navigation')[0];
    if (!timing) return;

    const metrics = {
      type: 'navigation_timing',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      metrics: {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        ssl:
          timing.secureConnectionStart > 0
            ? timing.connectEnd - timing.secureConnectionStart
            : 0,
        ttfb: timing.responseStart - timing.requestStart,
        download: timing.responseEnd - timing.responseStart,
        domContentLoaded:
          timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
        totalTime: timing.loadEventEnd - timing.navigationStart,
      },
    };

    this.trackEvent('performance', metrics);
  }

  captureResourceTiming() {
    const resources = performance.getEntriesByType('resource');
    const resourceMetrics = resources.map(resource => ({
      name: resource.name,
      type: resource.initiatorType,
      duration: resource.duration,
      size: resource.transferSize || 0,
      startTime: resource.startTime,
    }));

    this.trackEvent('resource_timing', {
      type: 'resource_timing',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      resources: resourceMetrics,
    });
  }

  capturePaintTiming() {
    const paintEntries = performance.getEntriesByType('paint');
    const paintMetrics = {};

    paintEntries.forEach(entry => {
      paintMetrics[entry.name] = entry.startTime;
    });

    this.trackEvent('paint_timing', {
      type: 'paint_timing',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      metrics: paintMetrics,
    });
  }

  captureMemoryUsage() {
    if (!('memory' in performance)) return;

    const memory = {
      type: 'memory_usage',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      metrics: {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      },
    };

    this.trackEvent('performance', memory);
  }

  captureNetworkInfo() {
    const connection = navigator.connection;
    if (!connection) return;

    const networkInfo = {
      type: 'network_info',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      metrics: {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      },
    };

    this.trackEvent('performance', networkInfo);
  }

  // Core Web Vitals
  setupCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    this.observeLCP();

    // First Input Delay (FID)
    this.observeFID();

    // Cumulative Layout Shift (CLS)
    this.observeCLS();

    // First Contentful Paint (FCP)
    this.observeFCP();
  }

  observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        this.trackEvent('core_web_vitals', {
          type: 'lcp',
          timestamp: Date.now(),
          sessionId: this.sessionId,
          value: lastEntry.startTime,
          element: lastEntry.element ? lastEntry.element.tagName : null,
        });
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.trackEvent('core_web_vitals', {
            type: 'fid',
            timestamp: Date.now(),
            sessionId: this.sessionId,
            value: entry.processingStart - entry.startTime,
            target: entry.target ? entry.target.tagName : null,
          });
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  observeCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        this.trackEvent('core_web_vitals', {
          type: 'cls',
          timestamp: Date.now(),
          sessionId: this.sessionId,
          value: clsValue,
        });
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  observeFCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.trackEvent('core_web_vitals', {
            type: 'fcp',
            timestamp: Date.now(),
            sessionId: this.sessionId,
            value: entry.startTime,
          });
        });
      });

      observer.observe({ entryTypes: ['paint'] });
    }
  }

  // User Behavior Tracking
  setupUserBehaviorTracking() {
    // Page Views
    this.trackPageView();

    // Click Events
    document.addEventListener('click', e => {
      this.trackClick(e);
    });

    // Scroll Events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackScroll();
      }, 100);
    });

    // Form Interactions
    document.addEventListener('submit', e => {
      this.trackFormSubmit(e);
    });

    // Input Focus/Blur
    document.addEventListener('focusin', e => {
      this.trackInputFocus(e);
    });

    document.addEventListener('focusout', e => {
      this.trackInputBlur(e);
    });

    // Mouse Movement (Heatmap)
    this.setupHeatmapTracking();
  }

  trackPageView() {
    const pageView = {
      type: 'page_view',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };

    this.pageViews.push(pageView);
    this.trackEvent('user_behavior', pageView);
  }

  trackClick(event) {
    const click = {
      type: 'click',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      element: {
        tagName: event.target.tagName,
        id: event.target.id,
        className: event.target.className,
        text: event.target.textContent?.substring(0, 100),
      },
      position: {
        x: event.clientX,
        y: event.clientY,
      },
      url: window.location.href,
    };

    this.userInteractions.push(click);
    this.trackEvent('user_behavior', click);
  }

  trackScroll() {
    const scrollData = {
      type: 'scroll',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      position: {
        x: window.scrollX,
        y: window.scrollY,
      },
      maxScroll: {
        x: document.documentElement.scrollWidth - window.innerWidth,
        y: document.documentElement.scrollHeight - window.innerHeight,
      },
      percentage: Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100
      ),
    };

    this.trackEvent('user_behavior', scrollData);
  }

  trackFormSubmit(event) {
    const form = event.target;
    const formData = {
      type: 'form_submit',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      form: {
        id: form.id,
        className: form.className,
        action: form.action,
        method: form.method,
        fieldCount: form.elements.length,
      },
      url: window.location.href,
    };

    this.trackEvent('user_behavior', formData);
  }

  trackInputFocus(event) {
    if (
      event.target.tagName === 'INPUT' ||
      event.target.tagName === 'TEXTAREA'
    ) {
      const focusData = {
        type: 'input_focus',
        timestamp: Date.now(),
        sessionId: this.sessionId,
        element: {
          type: event.target.type,
          id: event.target.id,
          name: event.target.name,
          placeholder: event.target.placeholder,
        },
      };

      this.trackEvent('user_behavior', focusData);
    }
  }

  trackInputBlur(event) {
    if (
      event.target.tagName === 'INPUT' ||
      event.target.tagName === 'TEXTAREA'
    ) {
      const blurData = {
        type: 'input_blur',
        timestamp: Date.now(),
        sessionId: this.sessionId,
        element: {
          type: event.target.type,
          id: event.target.id,
          name: event.target.name,
          valueLength: event.target.value.length,
        },
      };

      this.trackEvent('user_behavior', blurData);
    }
  }

  // Heatmap Tracking
  setupHeatmapTracking() {
    this.mousePositions = [];
    this.clickPositions = [];

    document.addEventListener('mousemove', e => {
      this.mousePositions.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      });

      // Keep only last 1000 positions
      if (this.mousePositions.length > 1000) {
        this.mousePositions = this.mousePositions.slice(-1000);
      }
    });

    document.addEventListener('click', e => {
      this.clickPositions.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
        element: event.target.tagName,
      });
    });
  }

  // Error Tracking
  setupErrorTracking() {
    // JavaScript Errors
    window.addEventListener('error', e => {
      this.trackError({
        type: 'javascript_error',
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error ? e.error.stack : null,
      });
    });

    // Unhandled Promise Rejections
    window.addEventListener('unhandledrejection', e => {
      this.trackError({
        type: 'unhandled_promise_rejection',
        reason: e.reason?.toString(),
        stack: e.reason?.stack,
      });
    });

    // Resource Loading Errors
    window.addEventListener(
      'error',
      e => {
        if (e.target !== window) {
          this.trackError({
            type: 'resource_error',
            element: e.target.tagName,
            src: e.target.src || e.target.href,
            message: 'Failed to load resource',
          });
        }
      },
      true
    );
  }

  trackError(errorData) {
    const error = {
      ...errorData,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.errorLogs.push(error);
    this.trackEvent('error', error);

    // Send critical errors immediately
    if (errorData.type === 'javascript_error') {
      this.sendErrorToServer(error);
    }
  }

  // Conversion Tracking
  setupConversionTracking() {
    // Track specific conversion events
    this.conversionGoals = {
      login: false,
      signup: false,
      download: false,
      chat_start: false,
      profile_complete: false,
    };

    // Listen for conversion events
    this.setupConversionListeners();
  }

  setupConversionListeners() {
    // Login conversion
    document.addEventListener('userLogin', () => {
      this.trackConversion('login');
    });

    // Signup conversion
    document.addEventListener('userSignup', () => {
      this.trackConversion('signup');
    });

    // Download conversion
    document.addEventListener('download', () => {
      this.trackConversion('download');
    });

    // Chat start conversion
    document.addEventListener('chatStart', () => {
      this.trackConversion('chat_start');
    });
  }

  trackConversion(goal) {
    if (this.conversionGoals[goal]) return; // Already tracked

    this.conversionGoals[goal] = true;

    const conversion = {
      type: 'conversion',
      goal,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      timeToConversion: Date.now() - this.startTime,
      pageViews: this.pageViews.length,
      interactions: this.userInteractions.length,
    };

    this.trackEvent('conversion', conversion);
  }

  // Session Tracking
  startSessionTracking() {
    // Track session duration
    setInterval(() => {
      const sessionDuration = Date.now() - this.startTime;
      this.trackEvent('session', {
        type: 'session_duration',
        duration: sessionDuration,
        sessionId: this.sessionId,
        pageViews: this.pageViews.length,
        interactions: this.userInteractions.length,
        errors: this.errorLogs.length,
      });
    }, 60000); // Every minute

    // Track session end
    window.addEventListener('beforeunload', () => {
      this.trackSessionEnd();
    });
  }

  trackSessionEnd() {
    const sessionData = {
      type: 'session_end',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      duration: Date.now() - this.startTime,
      pageViews: this.pageViews.length,
      interactions: this.userInteractions.length,
      errors: this.errorLogs.length,
      conversions: Object.values(this.conversionGoals).filter(Boolean).length,
    };

    this.trackEvent('session', sessionData);
    this.sendSessionToServer(sessionData);
  }

  // Event Tracking
  trackEvent(category, data) {
    const event = {
      category,
      data,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: firebase.auth().currentUser?.uid || null,
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };

    this.events.push(event);

    // Send to Firebase
    this.sendToFirebase(event);

    // Send to external analytics (if configured)
    this.sendToExternalAnalytics(event);

    // Keep only last 1000 events in memory
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  // Data Sending
  async sendToFirebase(event) {
    try {
      // Check if Firebase is properly initialized and user is authenticated
      if (
        typeof firebase !== 'undefined' &&
        firebase.auth &&
        firebase.auth().currentUser
      ) {
        await firebase.firestore().collection('analytics').add(event);
      } else {
        // If not authenticated, store locally for later sync
        this.storeLocally(event);
      }
    } catch (error) {
      console.error('Error sending analytics to Firebase:', error);
      // Store locally if Firebase fails
      this.storeLocally(event);
    }
  }

  // Store analytics data locally when Firebase is unavailable
  storeLocally(event) {
    try {
      const localAnalytics = JSON.parse(
        localStorage.getItem('auraos_analytics') || '[]'
      );
      localAnalytics.push({
        ...event,
        timestamp: Date.now(),
        storedLocally: true,
      });

      // Keep only last 100 events locally
      if (localAnalytics.length > 100) {
        localAnalytics.splice(0, localAnalytics.length - 100);
      }

      localStorage.setItem('auraos_analytics', JSON.stringify(localAnalytics));
    } catch (error) {
      console.error('Error storing analytics locally:', error);
    }
  }

  // Sync locally stored analytics when Firebase becomes available
  async syncLocalAnalytics() {
    try {
      const localAnalytics = JSON.parse(
        localStorage.getItem('auraos_analytics') || '[]'
      );
      if (localAnalytics.length === 0) return;

      if (
        typeof firebase !== 'undefined' &&
        firebase.auth &&
        firebase.auth().currentUser
      ) {
        const batch = firebase.firestore().batch();
        const analyticsRef = firebase.firestore().collection('analytics');

        localAnalytics.forEach(event => {
          const docRef = analyticsRef.doc();
          batch.set(docRef, event);
        });

        await batch.commit();
        localStorage.removeItem('auraos_analytics');
        console.log(
          `Synced ${localAnalytics.length} analytics events to Firebase`
        );
      }
    } catch (error) {
      console.error('Error syncing local analytics:', error);
    }
  }

  sendToExternalAnalytics(event) {
    // Send to Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', event.data.type || 'custom_event', {
        event_category: event.category,
        event_label: event.data.element?.tagName || 'unknown',
        value: event.data.value || 1,
        custom_parameter_1: event.sessionId,
        custom_parameter_2: event.userId,
      });
    }

    // Send to custom analytics endpoint
    if (window.ANALYTICS_ENDPOINT) {
      fetch(window.ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }).catch(error => {
        console.error('Error sending to external analytics:', error);
      });
    }
  }

  async sendErrorToServer(error) {
    try {
      if (
        typeof firebase !== 'undefined' &&
        firebase.auth &&
        firebase.auth().currentUser
      ) {
        await firebase.firestore().collection('errors').add(error);
      } else {
        // Store error locally if Firebase is unavailable
        this.storeLocally({ ...error, type: 'error' });
      }
    } catch (error) {
      console.error('Error sending error to server:', error);
      this.storeLocally({ ...error, type: 'error' });
    }
  }

  async sendSessionToServer(sessionData) {
    try {
      if (
        typeof firebase !== 'undefined' &&
        firebase.auth &&
        firebase.auth().currentUser
      ) {
        await firebase.firestore().collection('sessions').add(sessionData);
      } else {
        // Store session locally if Firebase is unavailable
        this.storeLocally({ ...sessionData, type: 'session' });
      }
    } catch (error) {
      console.error('Error sending session to server:', error);
      this.storeLocally({ ...sessionData, type: 'session' });
    }
  }

  // Utility Methods
  generateSessionId() {
    return (
      'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    );
  }

  // Public API
  trackCustomEvent(eventName, properties = {}) {
    this.trackEvent('custom', {
      type: 'custom_event',
      eventName,
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
    });
  }

  setUserProperties(properties) {
    this.trackEvent('user_properties', {
      type: 'user_properties',
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
    });
  }

  getSessionData() {
    return {
      sessionId: this.sessionId,
      startTime: this.startTime,
      duration: Date.now() - this.startTime,
      pageViews: this.pageViews.length,
      interactions: this.userInteractions.length,
      errors: this.errorLogs.length,
      conversions: Object.values(this.conversionGoals).filter(Boolean).length,
    };
  }

  getHeatmapData() {
    return {
      mousePositions: this.mousePositions,
      clickPositions: this.clickPositions,
    };
  }

  // Public method to manually sync local analytics
  async syncAnalytics() {
    await this.syncLocalAnalytics();
  }

  // Get local analytics count
  getLocalAnalyticsCount() {
    try {
      const localAnalytics = JSON.parse(
        localStorage.getItem('auraos_analytics') || '[]'
      );
      return localAnalytics.length;
    } catch (error) {
      return 0;
    }
  }
}

// Initialize analytics when DOM is loaded
let analyticsManager = null;

document.addEventListener('DOMContentLoaded', () => {
  analyticsManager = new AnalyticsManager();

  // Make analytics available globally
  window.Analytics = analyticsManager;
});

// Export for use in other modules
window.AnalyticsManager = AnalyticsManager;
