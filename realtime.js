// Real-Time Features Implementation
class RealtimeManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.heartbeatInterval = null;
    this.messageQueue = [];

    this.init();
  }

  init() {
    this.setupWebSocket();
    this.setupEventListeners();
    this.setupNotificationPermission();
    this.startHeartbeat();
  }

  setupWebSocket() {
    // Use Socket.io for real-time communication
    // For now, we'll simulate WebSocket behavior with polling
    this.connect();
  }

  connect() {
    try {
      // Simulate WebSocket connection
      this.socket = {
        connected: true,
        send: data => this.handleSend(data),
        close: () => this.handleClose(),
        on: (event, callback) => this.handleEvent(event, callback),
      };

      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.onConnect();
      this.processMessageQueue();

      console.log('Real-time connection established');
    } catch (error) {
      console.error('Failed to connect:', error);
      this.handleReconnect();
    }
  }

  handleSend(data) {
    // Simulate sending data
    console.log('Sending data:', data);

    // Simulate server response
    setTimeout(() => {
      this.handleMessage({
        type: 'response',
        data: { status: 'received', timestamp: Date.now() },
      });
    }, 100);
  }

  handleClose() {
    this.isConnected = false;
    this.onDisconnect();
    this.stopHeartbeat();
  }

  handleEvent(event, callback) {
    this.eventCallbacks = this.eventCallbacks || {};
    this.eventCallbacks[event] = callback;
  }

  handleMessage(message) {
    if (this.eventCallbacks && this.eventCallbacks.message) {
      this.eventCallbacks.message(message);
    }

    // Process different message types
    switch (message.type) {
      case 'notification':
        this.handleNotification(message.data);
        break;
      case 'chat_message':
        this.handleChatMessage(message.data);
        break;
      case 'user_status':
        this.handleUserStatus(message.data);
        break;
      case 'system_update':
        this.handleSystemUpdate(message.data);
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  onConnect() {
    this.updateConnectionStatus(true);
    this.showToast('Connected to real-time services', 'success');

    // Join user to their personal channel
    this.joinChannel('user', firebase.auth().currentUser?.uid);
  }

  onDisconnect() {
    this.updateConnectionStatus(false);
    this.showToast('Disconnected from real-time services', 'warning');
    this.handleReconnect();
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay =
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

      console.log(
        `Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`
      );

      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      this.showToast('Unable to reconnect to real-time services', 'error');
    }
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.send({
          type: 'heartbeat',
          timestamp: Date.now(),
        });
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  send(data) {
    if (this.isConnected && this.socket) {
      this.socket.send(JSON.stringify(data));
    } else {
      // Queue message for when connection is restored
      this.messageQueue.push(data);
    }
  }

  processMessageQueue() {
    while (this.messageQueue.length > 0 && this.isConnected) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }

  joinChannel(type, id) {
    this.send({
      type: 'join_channel',
      channel: `${type}:${id}`,
      user: firebase.auth().currentUser?.uid,
    });
  }

  leaveChannel(type, id) {
    this.send({
      type: 'leave_channel',
      channel: `${type}:${id}`,
      user: firebase.auth().currentUser?.uid,
    });
  }

  // Event Handlers
  handleNotification(data) {
    const { title, message, type = 'info', actions = [] } = data;

    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      this.showBrowserNotification(title, message, type);
    }

    // Show in-app toast
    this.showToast(message, type);

    // Log notification
    this.logActivity(
      'notification_received',
      `Received ${type} notification: ${title}`
    );
  }

  handleChatMessage(data) {
    const { from, message, timestamp, type = 'text' } = data;

    // Update chat interface if it exists
    this.updateChatInterface(data);

    // Show notification for new messages
    if (from !== firebase.auth().currentUser?.uid) {
      this.showToast(`New message from ${from}`, 'info');
    }
  }

  handleUserStatus(data) {
    const { userId, status, lastSeen } = data;

    // Update user status indicators
    this.updateUserStatus(userId, status, lastSeen);
  }

  handleSystemUpdate(data) {
    const { type, message, action } = data;

    switch (type) {
      case 'maintenance':
        this.showMaintenanceNotification(message);
        break;
      case 'update_available':
        this.showUpdateNotification(message, action);
        break;
      case 'security_alert':
        this.showSecurityAlert(message);
        break;
    }
  }

  // Notification Methods
  async setupNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  }

  showBrowserNotification(title, message, type = 'info') {
    if (Notification.permission !== 'granted') return;

    const notification = new Notification(title, {
      body: message,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: `auraos-${type}`,
      requireInteraction: false,
      silent: false,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);
  }

  showToast(message, type = 'info') {
    const toastContainer =
      document.getElementById('toastContainer') || this.createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">
                    <i class="fas ${this.getToastIcon(type)}"></i>
                </div>
                <div class="toast-message">
                    <span>${message}</span>
                </div>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

    toastContainer.appendChild(toast);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove();
          }
        }, 300);
      }
    }, 5000);
  }

  createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  }

  getToastIcon(type) {
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle',
    };
    return icons[type] || 'fa-info-circle';
  }

  updateConnectionStatus(connected) {
    const statusElement = document.querySelector('.user-status');
    if (statusElement) {
      statusElement.textContent = connected ? 'Online' : 'Offline';
      statusElement.className = `user-status ${connected ? 'online' : 'offline'}`;
    }

    // Update connection indicator
    const indicator = document.getElementById('connectionIndicator');
    if (indicator) {
      indicator.className = `connection-indicator ${connected ? 'connected' : 'disconnected'}`;
    }
  }

  updateChatInterface(messageData) {
    const chatMessages = document.getElementById('chatbotMessages');
    if (!chatMessages) return;

    const messageElement = document.createElement('div');
    messageElement.className = 'message bot-message';
    messageElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${messageData.message}</p>
                <span class="message-time">${this.formatTime(new Date(messageData.timestamp))}</span>
            </div>
        `;

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  updateUserStatus(userId, status, lastSeen) {
    // Update user status in various parts of the UI
    const statusElements = document.querySelectorAll(
      `[data-user-id="${userId}"] .user-status`
    );
    statusElements.forEach(element => {
      element.textContent = status;
      element.className = `user-status ${status.toLowerCase()}`;
    });
  }

  showMaintenanceNotification(message) {
    const modal = document.createElement('div');
    modal.className = 'maintenance-modal';
    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <i class="fas fa-tools"></i>
                    <h3>System Maintenance</h3>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Understood
                    </button>
                </div>
            </div>
        `;

    document.body.appendChild(modal);
  }

  showUpdateNotification(message, action) {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
            <div class="update-content">
                <i class="fas fa-sync-alt"></i>
                <span>${message}</span>
                <button onclick="this.handleUpdate()">Update Now</button>
                <button onclick="this.parentElement.parentElement.remove()">Later</button>
            </div>
        `;

    document.body.appendChild(notification);
  }

  showSecurityAlert(message) {
    const alert = document.createElement('div');
    alert.className = 'security-alert';
    alert.innerHTML = `
            <div class="alert-content">
                <i class="fas fa-shield-alt"></i>
                <div class="alert-text">
                    <h4>Security Alert</h4>
                    <p>${message}</p>
                </div>
                <button class="alert-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

    document.body.appendChild(alert);
  }

  // Utility Methods
  formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  logActivity(type, description) {
    // Log activity to Firestore
    if (firebase.auth().currentUser) {
      firebase
        .firestore()
        .collection('userActivity')
        .doc(firebase.auth().currentUser.uid)
        .collection('activities')
        .add({
          type,
          description,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .catch(error => {
          console.error('Error logging activity:', error);
        });
    }
  }

  // Public API Methods
  sendChatMessage(message, type = 'text') {
    this.send({
      type: 'chat_message',
      message,
      messageType: type,
      from: firebase.auth().currentUser?.uid,
      timestamp: Date.now(),
    });
  }

  sendNotification(userId, title, message, type = 'info') {
    this.send({
      type: 'send_notification',
      targetUser: userId,
      title,
      message,
      notificationType: type,
    });
  }

  updateStatus(status) {
    this.send({
      type: 'status_update',
      status,
      userId: firebase.auth().currentUser?.uid,
      timestamp: Date.now(),
    });
  }

  // Cleanup
  destroy() {
    this.stopHeartbeat();
    if (this.socket) {
      this.socket.close();
    }
    this.messageQueue = [];
  }
}

// Initialize real-time manager when DOM is loaded
let realtimeManager = null;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize real-time features if user is authenticated
  firebase.auth().onAuthStateChanged(user => {
    if (user && !realtimeManager) {
      realtimeManager = new RealtimeManager();
    } else if (!user && realtimeManager) {
      realtimeManager.destroy();
      realtimeManager = null;
    }
  });
});

// Export for global access
window.RealtimeManager = RealtimeManager;
