// Admin Panel JavaScript Functionality
class AdminPanel {
  constructor() {
    this.currentSection = 'dashboard';
    this.currentUser = null;
    this.users = [];
    this.analytics = {};
    this.systemMetrics = {};
    this.logs = [];

    this.init();
  }

  init() {
    this.checkAdminAccess();
    this.setupEventListeners();
    this.loadDashboardData();
    this.setupRealTimeUpdates();
    this.initializeCharts();
  }

  // Authentication and Access Control
  async checkAdminAccess() {
    try {
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        window.location.href = '/';
        return;
      }

      // Check if user has admin role
      const userDoc = await firebase
        .firestore()
        .collection('users')
        .doc(currentUser.uid)
        .get();

      if (!userDoc.exists || userDoc.data().role !== 'admin') {
        this.showToast('Access denied. Admin privileges required.', 'error');
        window.location.href = '/dashboard.html';
        return;
      }

      this.currentUser = {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName || 'Admin User',
        role: 'admin',
      };

      this.updateAdminInfo();
    } catch (error) {
      console.error('Error checking admin access:', error);
      this.showToast('Error verifying admin access', 'error');
      window.location.href = '/';
    }
  }

  updateAdminInfo() {
    const adminName = document.getElementById('adminName');
    if (adminName && this.currentUser) {
      adminName.textContent = this.currentUser.displayName;
    }
  }

  // Event Listeners
  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        const section = item.dataset.section;
        this.switchSection(section);
      });
    });

    // Refresh data
    document.getElementById('refreshData')?.addEventListener('click', () => {
      this.refreshAllData();
    });

    // Export data
    document.getElementById('exportData')?.addEventListener('click', () => {
      this.exportData();
    });

    // Logout
    document.getElementById('logoutAdmin')?.addEventListener('click', () => {
      this.logout();
    });

    // User management
    this.setupUserManagementListeners();

    // Analytics
    this.setupAnalyticsListeners();

    // Settings
    this.setupSettingsListeners();

    // System monitoring
    this.setupSystemMonitoringListeners();
  }

  setupUserManagementListeners() {
    // User search and filters
    document.getElementById('userSearch')?.addEventListener('input', e => {
      this.filterUsers();
    });

    document.getElementById('roleFilter')?.addEventListener('change', () => {
      this.filterUsers();
    });

    document.getElementById('statusFilter')?.addEventListener('change', () => {
      this.filterUsers();
    });

    // Add user
    document.getElementById('addUser')?.addEventListener('click', () => {
      this.showAddUserModal();
    });

    // Bulk actions
    document.getElementById('bulkActions')?.addEventListener('click', () => {
      this.showBulkActionsModal();
    });

    // Pagination
    document.getElementById('prevPage')?.addEventListener('click', () => {
      this.previousPage();
    });

    document.getElementById('nextPage')?.addEventListener('click', () => {
      this.nextPage();
    });

    // Select all users
    document.getElementById('selectAllUsers')?.addEventListener('change', e => {
      this.selectAllUsers(e.target.checked);
    });
  }

  setupAnalyticsListeners() {
    // Chart period controls
    document.querySelectorAll('.chart-controls button').forEach(btn => {
      btn.addEventListener('click', e => {
        const period = e.target.dataset.period;
        this.updateChartPeriod(period);
      });
    });

    // Analytics tabs
    document.querySelectorAll('.analytics-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const tab = e.target.dataset.tab;
        this.switchAnalyticsTab(tab);
      });
    });
  }

  setupSettingsListeners() {
    // Save settings
    document.getElementById('saveSettings')?.addEventListener('click', () => {
      this.saveSettings();
    });

    // Reset settings
    document.getElementById('resetSettings')?.addEventListener('click', () => {
      this.resetSettings();
    });
  }

  setupSystemMonitoringListeners() {
    // Refresh logs
    document.getElementById('refreshLogs')?.addEventListener('click', () => {
      this.refreshLogs();
    });

    // Export logs
    document.getElementById('exportLogs')?.addEventListener('click', () => {
      this.exportLogs();
    });

    // Log filters
    document.getElementById('logLevel')?.addEventListener('change', () => {
      this.filterLogs();
    });

    document.getElementById('logSource')?.addEventListener('change', () => {
      this.filterLogs();
    });
  }

  // Section Management
  switchSection(section) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    document
      .querySelector(`[data-section="${section}"]`)
      .classList.add('active');

    // Update content
    document.querySelectorAll('.admin-section').forEach(section => {
      section.classList.remove('active');
    });
    document.getElementById(section).classList.add('active');

    this.currentSection = section;

    // Load section-specific data
    switch (section) {
      case 'dashboard':
        this.loadDashboardData();
        break;
      case 'users':
        this.loadUsersData();
        break;
      case 'analytics':
        this.loadAnalyticsData();
        break;
      case 'system':
        this.loadSystemData();
        break;
      case 'security':
        this.loadSecurityData();
        break;
      case 'content':
        this.loadContentData();
        break;
      case 'settings':
        this.loadSettingsData();
        break;
      case 'logs':
        this.loadLogsData();
        break;
    }
  }

  // Dashboard Data
  async loadDashboardData() {
    try {
      this.showLoading(true);

      // Load key metrics
      await this.loadKeyMetrics();

      // Load recent activity
      await this.loadRecentActivity();

      // Load system health
      await this.loadSystemHealth();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.showToast('Error loading dashboard data', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  async loadKeyMetrics() {
    try {
      // Get user count
      const usersSnapshot = await firebase
        .firestore()
        .collection('users')
        .get();
      const userCount = usersSnapshot.size;

      // Get download count (simulated)
      const downloadsSnapshot = await firebase
        .firestore()
        .collection('downloads')
        .get();
      const downloadCount = downloadsSnapshot.size;

      // Get chat sessions (simulated)
      const chatSnapshot = await firebase
        .firestore()
        .collection('chatSessions')
        .get();
      const chatCount = chatSnapshot.size;

      // Update UI
      document.getElementById('totalUsers').textContent = userCount;
      document.getElementById('totalDownloads').textContent = downloadCount;
      document.getElementById('chatSessions').textContent = chatCount;
      document.getElementById('userCount').textContent = userCount;
    } catch (error) {
      console.error('Error loading key metrics:', error);
    }
  }

  async loadRecentActivity() {
    try {
      const activitySnapshot = await firebase
        .firestore()
        .collection('userActivity')
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get();

      const activities = [];
      activitySnapshot.forEach(doc => {
        activities.push({ id: doc.id, ...doc.data() });
      });

      this.updateRecentActivity(activities);
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  }

  updateRecentActivity(activities) {
    const activityList = document.getElementById('recentActivityList');
    if (!activityList) return;

    if (activities.length === 0) {
      activityList.innerHTML =
        '<p class="text-center text-gray-500">No recent activity</p>';
      return;
    }

    activityList.innerHTML = activities
      .map(
        activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas ${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.description || 'User activity'}</p>
                    <span class="activity-time">${this.formatTimeAgo(activity.timestamp?.toDate())}</span>
                </div>
            </div>
        `
      )
      .join('');
  }

  getActivityIcon(type) {
    const icons = {
      login: 'fa-sign-in-alt',
      chat: 'fa-comment',
      download: 'fa-download',
      profile_update: 'fa-user-edit',
      settings_change: 'fa-cog',
      error: 'fa-exclamation-triangle',
      security: 'fa-shield-alt',
    };
    return icons[type] || 'fa-circle';
  }

  async loadSystemHealth() {
    // Simulate system health metrics
    const health = {
      uptime: '99.9%',
      responseTime: '120ms',
      activeUsers: '1,247',
      cpuUsage: 45,
      memoryUsage: 62,
      diskUsage: 38,
      networkIO: 28,
    };

    document.getElementById('systemHealth').textContent = health.uptime;
    this.systemMetrics = health;
  }

  // User Management
  async loadUsersData() {
    try {
      this.showLoading(true);

      const usersSnapshot = await firebase
        .firestore()
        .collection('users')
        .orderBy('createdAt', 'desc')
        .get();

      this.users = [];
      usersSnapshot.forEach(doc => {
        this.users.push({ id: doc.id, ...doc.data() });
      });

      this.displayUsers();
    } catch (error) {
      console.error('Error loading users:', error);
      this.showToast('Error loading users', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  displayUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = this.users
      .map(
        user => `
            <tr>
                <td>
                    <input type="checkbox" class="user-checkbox" data-user-id="${user.id}">
                </td>
                <td>
                    <div class="user-info">
                        <div class="user-avatar">
                            <img src="${user.photoURL || 'https://via.placeholder.com/32'}" alt="User Avatar">
                        </div>
                        <div class="user-details">
                            <div class="user-name">${user.displayName || 'Unknown User'}</div>
                        </div>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>
                    <span class="role-badge ${user.role || 'user'}">${user.role || 'User'}</span>
                </td>
                <td>
                    <span class="status-badge ${user.status || 'active'}">${user.status || 'Active'}</span>
                </td>
                <td>${this.formatTimeAgo(user.lastLogin?.toDate())}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-outline" onclick="adminPanel.editUser('${user.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="adminPanel.deleteUser('${user.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `
      )
      .join('');
  }

  filterUsers() {
    const searchTerm = document
      .getElementById('userSearch')
      .value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    const filteredUsers = this.users.filter(user => {
      const matchesSearch =
        user.displayName?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm);
      const matchesRole = !roleFilter || user.role === roleFilter;
      const matchesStatus =
        !statusFilter || (user.status || 'active') === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });

    this.displayFilteredUsers(filteredUsers);
  }

  displayFilteredUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = users
      .map(
        user => `
            <tr>
                <td>
                    <input type="checkbox" class="user-checkbox" data-user-id="${user.id}">
                </td>
                <td>
                    <div class="user-info">
                        <div class="user-avatar">
                            <img src="${user.photoURL || 'https://via.placeholder.com/32'}" alt="User Avatar">
                        </div>
                        <div class="user-details">
                            <div class="user-name">${user.displayName || 'Unknown User'}</div>
                        </div>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>
                    <span class="role-badge ${user.role || 'user'}">${user.role || 'User'}</span>
                </td>
                <td>
                    <span class="status-badge ${user.status || 'active'}">${user.status || 'Active'}</span>
                </td>
                <td>${this.formatTimeAgo(user.lastLogin?.toDate())}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-outline" onclick="adminPanel.editUser('${user.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="adminPanel.deleteUser('${user.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `
      )
      .join('');
  }

  selectAllUsers(checked) {
    document.querySelectorAll('.user-checkbox').forEach(checkbox => {
      checkbox.checked = checked;
    });
  }

  editUser(userId) {
    const user = this.users.find(u => u.id === userId);
    if (!user) return;

    this.showEditUserModal(user);
  }

  async deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await firebase.firestore().collection('users').doc(userId).delete();
      this.showToast('User deleted successfully', 'success');
      this.loadUsersData();
    } catch (error) {
      console.error('Error deleting user:', error);
      this.showToast('Error deleting user', 'error');
    }
  }

  // Analytics
  async loadAnalyticsData() {
    try {
      this.showLoading(true);

      // Load analytics data from Firestore
      const analyticsSnapshot = await firebase
        .firestore()
        .collection('analytics')
        .orderBy('timestamp', 'desc')
        .limit(1000)
        .get();

      const analyticsData = [];
      analyticsSnapshot.forEach(doc => {
        analyticsData.push({ id: doc.id, ...doc.data() });
      });

      this.analytics = this.processAnalyticsData(analyticsData);
      this.updateAnalyticsCharts();
    } catch (error) {
      console.error('Error loading analytics:', error);
      this.showToast('Error loading analytics data', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  processAnalyticsData(data) {
    const processed = {
      pageViews: [],
      userEngagement: [],
      geographicData: {},
      deviceTypes: {},
      registrationTrends: [],
      errorTrends: [],
    };

    data.forEach(item => {
      switch (item.category) {
        case 'user_behavior':
          if (item.data.type === 'page_view') {
            processed.pageViews.push(item);
          }
          break;
        case 'conversion':
          if (item.goal === 'signup') {
            processed.registrationTrends.push(item);
          }
          break;
        case 'error':
          processed.errorTrends.push(item);
          break;
      }
    });

    return processed;
  }

  updateAnalyticsCharts() {
    // Update charts with processed data
    this.updatePageViewsChart();
    this.updateEngagementChart();
    this.updateDeviceChart();
    this.updateRegistrationChart();
    this.updateErrorTrendsChart();
  }

  updatePageViewsChart() {
    const canvas = document.getElementById('pageViewsChart');
    if (!canvas) return;

    // Simple chart implementation
    const ctx = canvas.getContext('2d');
    const data = this.analytics.pageViews.slice(-30); // Last 30 days

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (data.length === 0) {
      ctx.fillStyle = '#9ca3af';
      ctx.font = '14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
      return;
    }

    // Draw simple line chart
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((item, index) => {
      const x = (index / (data.length - 1)) * (canvas.width - 40) + 20;
      const y = canvas.height - 40 - index * 10; // Simple mock data

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }

  updateEngagementChart() {
    // Similar implementation for engagement chart
    const canvas = document.getElementById('engagementChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(
      'Engagement data visualization',
      canvas.width / 2,
      canvas.height / 2
    );
  }

  updateDeviceChart() {
    const canvas = document.getElementById('deviceChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Simple pie chart
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    const deviceData = [
      { label: 'Desktop', value: 60, color: '#ef4444' },
      { label: 'Mobile', value: 30, color: '#10b981' },
      { label: 'Tablet', value: 10, color: '#f59e0b' },
    ];

    let currentAngle = 0;
    deviceData.forEach(item => {
      const sliceAngle = (item.value / 100) * 2 * Math.PI;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(
        centerX,
        centerY,
        radius,
        currentAngle,
        currentAngle + sliceAngle
      );
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();

      currentAngle += sliceAngle;
    });
  }

  updateRegistrationChart() {
    const canvas = document.getElementById('registrationChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(
      'Registration trends visualization',
      canvas.width / 2,
      canvas.height / 2
    );
  }

  updateErrorTrendsChart() {
    const canvas = document.getElementById('errorTrendsChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(
      'Error trends visualization',
      canvas.width / 2,
      canvas.height / 2
    );
  }

  switchAnalyticsTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.analytics-tabs .tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tab}Tab`).classList.add('active');
  }

  // System Monitoring
  async loadSystemData() {
    try {
      this.showLoading(true);

      // Load system metrics
      await this.loadSystemMetrics();

      // Load real-time performance data
      this.startRealTimeMonitoring();
    } catch (error) {
      console.error('Error loading system data:', error);
      this.showToast('Error loading system data', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  async loadSystemMetrics() {
    // Simulate system metrics
    const metrics = {
      uptime: '99.9%',
      responseTime: '120ms',
      activeUsers: '1,247',
      cpuUsage: 45,
      memoryUsage: 62,
      diskUsage: 38,
      networkIO: 28,
    };

    this.systemMetrics = metrics;
    this.updateSystemMetricsDisplay();
  }

  updateSystemMetricsDisplay() {
    // Update system metrics in UI
    const metrics = this.systemMetrics;

    // Update performance bars
    document.querySelectorAll('.perf-fill').forEach((fill, index) => {
      const values = [
        metrics.cpuUsage,
        metrics.memoryUsage,
        metrics.diskUsage,
        metrics.networkIO,
      ];
      if (values[index] !== undefined) {
        fill.style.width = `${values[index]}%`;
      }
    });

    // Update performance values
    document.querySelectorAll('.perf-value').forEach((value, index) => {
      const values = [
        metrics.cpuUsage,
        metrics.memoryUsage,
        metrics.diskUsage,
        metrics.networkIO,
      ];
      if (values[index] !== undefined) {
        value.textContent = `${values[index]}%`;
      }
    });
  }

  startRealTimeMonitoring() {
    // Simulate real-time updates
    setInterval(() => {
      this.updateRealTimeMetrics();
    }, 5000);
  }

  updateRealTimeMetrics() {
    // Simulate real-time metric updates
    const cpuVariation = (Math.random() - 0.5) * 10;
    const newCpuUsage = Math.max(
      0,
      Math.min(100, this.systemMetrics.cpuUsage + cpuVariation)
    );

    this.systemMetrics.cpuUsage = newCpuUsage;
    this.updateSystemMetricsDisplay();
  }

  // Security
  async loadSecurityData() {
    try {
      this.showLoading(true);

      // Load security events
      await this.loadSecurityEvents();

      // Load threat data
      await this.loadThreatData();
    } catch (error) {
      console.error('Error loading security data:', error);
      this.showToast('Error loading security data', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  async loadSecurityEvents() {
    try {
      const eventsSnapshot = await firebase
        .firestore()
        .collection('securityEvents')
        .orderBy('timestamp', 'desc')
        .limit(20)
        .get();

      const events = [];
      eventsSnapshot.forEach(doc => {
        events.push({ id: doc.id, ...doc.data() });
      });

      this.updateSecurityEvents(events);
    } catch (error) {
      console.error('Error loading security events:', error);
    }
  }

  updateSecurityEvents(events) {
    const eventsContainer = document.getElementById('securityEvents');
    if (!eventsContainer) return;

    if (events.length === 0) {
      eventsContainer.innerHTML =
        '<p class="text-center text-gray-500">No recent security events</p>';
      return;
    }

    eventsContainer.innerHTML = events
      .map(
        event => `
            <div class="security-event">
                <i class="fas fa-shield-alt"></i>
                <div class="security-event-content">
                    <div class="security-event-title">${event.title || 'Security Event'}</div>
                    <div class="security-event-time">${this.formatTimeAgo(event.timestamp?.toDate())}</div>
                </div>
            </div>
        `
      )
      .join('');
  }

  async loadThreatData() {
    // Simulate threat data
    const threatData = {
      threatsBlocked: 1247,
      failedLogins: 23,
      activeSessions: 892,
    };

    // Update UI
    document
      .querySelectorAll('.security-metric .metric-value')
      .forEach((element, index) => {
        const values = Object.values(threatData);
        if (values[index] !== undefined) {
          element.textContent = values[index].toLocaleString();
        }
      });
  }

  // Content Management
  async loadContentData() {
    try {
      this.showLoading(true);

      // Load announcements
      await this.loadAnnouncements();

      // Load documentation
      await this.loadDocumentation();

      // Load media
      await this.loadMedia();
    } catch (error) {
      console.error('Error loading content data:', error);
      this.showToast('Error loading content data', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  async loadAnnouncements() {
    try {
      const announcementsSnapshot = await firebase
        .firestore()
        .collection('announcements')
        .orderBy('createdAt', 'desc')
        .get();

      const announcements = [];
      announcementsSnapshot.forEach(doc => {
        announcements.push({ id: doc.id, ...doc.data() });
      });

      this.updateAnnouncements(announcements);
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
  }

  updateAnnouncements(announcements) {
    const container = document.getElementById('announcementsList');
    if (!container) return;

    if (announcements.length === 0) {
      container.innerHTML =
        '<p class="text-center text-gray-500">No announcements</p>';
      return;
    }

    container.innerHTML = announcements
      .map(
        announcement => `
            <div class="announcement-item">
                <div class="announcement-header">
                    <h4>${announcement.title}</h4>
                    <div class="announcement-actions">
                        <button class="btn btn-sm btn-outline" onclick="adminPanel.editAnnouncement('${announcement.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="adminPanel.deleteAnnouncement('${announcement.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p>${announcement.content}</p>
                <div class="announcement-meta">
                    <span>Created: ${this.formatTimeAgo(announcement.createdAt?.toDate())}</span>
                    <span>Status: ${announcement.status || 'Draft'}</span>
                </div>
            </div>
        `
      )
      .join('');
  }

  async loadDocumentation() {
    // Load documentation structure
    const container = document.getElementById('documentationContent');
    if (container) {
      container.innerHTML =
        '<p class="text-center text-gray-500">Documentation management coming soon</p>';
    }
  }

  async loadMedia() {
    // Load media library
    const container = document.getElementById('mediaGrid');
    if (container) {
      container.innerHTML =
        '<p class="text-center text-gray-500">Media library coming soon</p>';
    }
  }

  // Settings
  async loadSettingsData() {
    try {
      // Load current settings
      const settingsDoc = await firebase
        .firestore()
        .collection('settings')
        .doc('general')
        .get();

      if (settingsDoc.exists) {
        const settings = settingsDoc.data();
        this.populateSettingsForm(settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  populateSettingsForm(settings) {
    // Populate form fields with current settings
    Object.entries(settings).forEach(([key, value]) => {
      const element = document.getElementById(key);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = value;
        } else {
          element.value = value;
        }
      }
    });
  }

  async saveSettings() {
    try {
      this.showLoading(true);

      const settings = {
        siteName: document.getElementById('siteName').value,
        siteDescription: document.getElementById('siteDescription').value,
        maintenanceMode: document.getElementById('maintenanceMode').checked,
        allowRegistration: document.getElementById('allowRegistration').checked,
        requireEmailVerification: document.getElementById(
          'requireEmailVerification'
        ).checked,
        defaultUserRole: document.getElementById('defaultUserRole').value,
        enable2FA: document.getElementById('enable2FA').checked,
        sessionTimeout: parseInt(
          document.getElementById('sessionTimeout').value
        ),
        maxLoginAttempts: parseInt(
          document.getElementById('maxLoginAttempts').value
        ),
      };

      await firebase
        .firestore()
        .collection('settings')
        .doc('general')
        .set(settings, { merge: true });

      this.showToast('Settings saved successfully', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      this.showToast('Error saving settings', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  resetSettings() {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      // Reset form to default values
      document.getElementById('siteName').value = 'AuraOS';
      document.getElementById('siteDescription').value =
        'Modern, AI-powered operating system platform';
      document.getElementById('maintenanceMode').checked = false;
      document.getElementById('allowRegistration').checked = true;
      document.getElementById('requireEmailVerification').checked = true;
      document.getElementById('defaultUserRole').value = 'user';
      document.getElementById('enable2FA').checked = true;
      document.getElementById('sessionTimeout').value = 30;
      document.getElementById('maxLoginAttempts').value = 5;

      this.showToast('Settings reset to defaults', 'info');
    }
  }

  // System Logs
  async loadLogsData() {
    try {
      this.showLoading(true);

      const logsSnapshot = await firebase
        .firestore()
        .collection('systemLogs')
        .orderBy('timestamp', 'desc')
        .limit(100)
        .get();

      this.logs = [];
      logsSnapshot.forEach(doc => {
        this.logs.push({ id: doc.id, ...doc.data() });
      });

      this.displayLogs();
    } catch (error) {
      console.error('Error loading logs:', error);
      this.showToast('Error loading logs', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  displayLogs() {
    const tbody = document.getElementById('logsTableBody');
    if (!tbody) return;

    tbody.innerHTML = this.logs
      .map(
        log => `
            <tr class="log-row log-${log.level}">
                <td>${this.formatDateTime(log.timestamp?.toDate())}</td>
                <td>
                    <span class="log-level ${log.level}">${log.level.toUpperCase()}</span>
                </td>
                <td>${log.source || 'System'}</td>
                <td>${log.message}</td>
                <td>${log.userId || 'System'}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="adminPanel.viewLogDetails('${log.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `
      )
      .join('');
  }

  filterLogs() {
    const levelFilter = document.getElementById('logLevel').value;
    const sourceFilter = document.getElementById('logSource').value;

    const filteredLogs = this.logs.filter(log => {
      const matchesLevel = !levelFilter || log.level === levelFilter;
      const matchesSource = !sourceFilter || log.source === sourceFilter;
      return matchesLevel && matchesSource;
    });

    this.displayFilteredLogs(filteredLogs);
  }

  displayFilteredLogs(logs) {
    const tbody = document.getElementById('logsTableBody');
    if (!tbody) return;

    tbody.innerHTML = logs
      .map(
        log => `
            <tr class="log-row log-${log.level}">
                <td>${this.formatDateTime(log.timestamp?.toDate())}</td>
                <td>
                    <span class="log-level ${log.level}">${log.level.toUpperCase()}</span>
                </td>
                <td>${log.source || 'System'}</td>
                <td>${log.message}</td>
                <td>${log.userId || 'System'}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="adminPanel.viewLogDetails('${log.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `
      )
      .join('');
  }

  // Utility Methods
  formatTimeAgo(date) {
    if (!date) return 'Unknown';

    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  formatDateTime(date) {
    if (!date) return 'Unknown';
    return date.toLocaleString();
  }

  showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.style.display = show ? 'flex' : 'none';
    }
  }

  showToast(message, type = 'info') {
    if (window.Analytics) {
      window.Analytics.showToast(message, type);
    }
  }

  async refreshAllData() {
    this.showToast('Refreshing data...', 'info');
    await this.loadDashboardData();
    this.showToast('Data refreshed successfully', 'success');
  }

  async exportData() {
    try {
      const data = {
        users: this.users,
        analytics: this.analytics,
        systemMetrics: this.systemMetrics,
        logs: this.logs,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `auraos-admin-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      this.showToast('Data exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting data:', error);
      this.showToast('Error exporting data', 'error');
    }
  }

  async logout() {
    try {
      await firebase.auth().signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      this.showToast('Error signing out', 'error');
    }
  }

  // Initialize Charts
  initializeCharts() {
    // Initialize any charts that need setup
    this.setupChartPeriodControls();
  }

  setupChartPeriodControls() {
    // Set up chart period controls
    document.querySelectorAll('.chart-controls button').forEach(btn => {
      btn.addEventListener('click', e => {
        // Remove active class from all buttons
        document.querySelectorAll('.chart-controls button').forEach(b => {
          b.classList.remove('btn-primary');
          b.classList.add('btn-outline');
        });

        // Add active class to clicked button
        e.target.classList.remove('btn-outline');
        e.target.classList.add('btn-primary');

        const period = e.target.dataset.period;
        this.updateChartPeriod(period);
      });
    });
  }

  updateChartPeriod(period) {
    // Update charts based on selected period
    this.showToast(`Updating charts for ${period}`, 'info');
    // Chart update logic would go here
  }

  // Real-time Updates
  setupRealTimeUpdates() {
    // Set up real-time listeners for admin data
    if (window.RealtimeManager) {
      // Listen for user updates
      firebase
        .firestore()
        .collection('users')
        .onSnapshot(snapshot => {
          this.handleUserUpdates(snapshot);
        });

      // Listen for system events
      firebase
        .firestore()
        .collection('systemEvents')
        .onSnapshot(snapshot => {
          this.handleSystemUpdates(snapshot);
        });
    }
  }

  handleUserUpdates(snapshot) {
    // Handle real-time user updates
    if (this.currentSection === 'users') {
      this.loadUsersData();
    }

    // Update user count
    document.getElementById('userCount').textContent = snapshot.size;
    document.getElementById('totalUsers').textContent = snapshot.size;
  }

  handleSystemUpdates(snapshot) {
    // Handle real-time system updates
    if (this.currentSection === 'system') {
      this.loadSystemData();
    }
  }
}

// Initialize admin panel when DOM is loaded
let adminPanel = null;

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is authenticated and has admin access
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      adminPanel = new AdminPanel();
    } else {
      window.location.href = '/';
    }
  });
});

// Export for global access
window.AdminPanel = AdminPanel;
