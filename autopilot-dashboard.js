// AuraOS Autopilot Dashboard JavaScript

class AutopilotDashboard {
  constructor() {
    this.isConnected = false;
    this.refreshInterval = null;
    this.charts = {};
    this.currentLanguage = 'ar';

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeCharts();
    this.connectToSystem();
    this.startAutoRefresh();
    this.initLiveWidgets();

    console.log('🚀 Autopilot Dashboard initialized');
  }

  setupEventListeners() {
    // Header controls
    document
      .getElementById('refreshBtn')
      .addEventListener('click', () => this.refreshData());
    document
      .getElementById('settingsBtn')
      .addEventListener('click', () => this.openSettingsModal());
    document
      .getElementById('languageToggle')
      .addEventListener('click', () => this.toggleLanguage());

    // Dark mode toggle
    const darkToggle = document.getElementById('darkModeToggle');
    if (darkToggle) {
      darkToggle.addEventListener('click', () => this.toggleDarkMode());
    }

    // Task queue controls
    document
      .getElementById('pauseQueue')
      .addEventListener('click', () => this.pauseQueue());
    document
      .getElementById('clearQueue')
      .addEventListener('click', () => this.clearQueue());

    // Modals
    document
      .getElementById('closeTaskModal')
      .addEventListener('click', () => this.closeModal('taskModal'));
    document
      .getElementById('closeSettingsModal')
      .addEventListener('click', () => this.closeModal('settingsModal'));
    document
      .getElementById('cancelTask')
      .addEventListener('click', () => this.closeModal('taskModal'));
    document
      .getElementById('cancelSettings')
      .addEventListener('click', () => this.closeModal('settingsModal'));

    // Task creation
    document
      .getElementById('createTaskFab')
      .addEventListener('click', () => this.openTaskModal());
    document
      .getElementById('createTask')
      .addEventListener('click', () => this.createTask());
    document.getElementById('taskForm').addEventListener('submit', e => {
      e.preventDefault();
      this.createTask();
    });

    // Settings
    document
      .getElementById('saveSettings')
      .addEventListener('click', () => this.saveSettings());

    // Settings tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', e => this.switchTab(e.target.dataset.tab));
    });

    // Log level filter
    document
      .getElementById('logLevel')
      .addEventListener('change', e => this.filterLogs(e.target.value));
    document
      .getElementById('clearLogs')
      .addEventListener('click', () => this.clearLogs());

    // Time range selector
    document
      .getElementById('timeRange')
      .addEventListener('change', e => this.updateCharts(e.target.value));

    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', e => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });

    // Overlay card controls
    document
      .querySelectorAll('.glass-card .card-controls .overlay-btn')
      .forEach(btn => {
        btn.addEventListener('click', async e => {
          const button = e.currentTarget;
          const action = button.dataset.action;
          const card = button.closest('.glass-card');
          await this.handleCardAction(card, action, button);
        });
      });

    // Logs modal controls
    const closeLogs = document.getElementById('closeLogsModal');
    const clearLive = document.getElementById('clearLiveLogs');
    const pauseLive = document.getElementById('pauseLiveLogs');
    if (closeLogs)
      closeLogs.addEventListener('click', () => this.closeModal('logsModal'));
    if (clearLive)
      clearLive.addEventListener('click', () => this.clearLiveLogs());
    if (pauseLive)
      pauseLive.addEventListener('click', e =>
        this.toggleLogsPause(e.currentTarget)
      );
    const logsLevel = document.getElementById('logsLevel');
    const logsSearch = document.getElementById('logsSearch');
    if (logsLevel)
      logsLevel.addEventListener('change', () => this.renderLiveLogs());
    if (logsSearch)
      logsSearch.addEventListener('input', () => this.renderLiveLogs());
  }

  connectToSystem() {
    // Simulate connection to Autopilot system
    this.isConnected = true;
    this.updateConnectionStatus(true);
    this.loadInitialData();

    console.log('✅ Connected to Autopilot system');
  }

  updateConnectionStatus(connected) {
    const indicator = document.querySelector('.status-indicator');
    const brand = document.querySelector('.header-brand span:last-child');

    if (connected) {
      indicator.className = 'status-indicator online';
      indicator.textContent = 'متصل';
      brand.style.color = '#00ff88';
    } else {
      indicator.className = 'status-indicator offline';
      indicator.textContent = 'غير متصل';
      brand.style.color = '#ff3b30';
    }
  }

  loadInitialData() {
    // Load system status
    this.updateSystemStatus({
      activeTasks: 3,
      queuedTasks: 7,
      successRate: 94.5,
      activeAgents: 5,
    });

    // Load task queue
    this.updateTaskQueue([
      {
        id: 'TASK_001',
        content: 'تحليل بيانات المبيعات',
        type: 'data_analysis',
        agent: 'gemini_ai',
        priority: 'high',
        status: 'processing',
        progress: 75,
      },
      {
        id: 'TASK_002',
        content: 'استخراج بيانات موقع',
        type: 'web_scraping',
        agent: 'httpie_agent',
        priority: 'medium',
        status: 'pending',
        progress: 0,
      },
      {
        id: 'TASK_003',
        content: 'معالجة ملف JSON',
        type: 'data_processing',
        agent: 'jq_agent',
        priority: 'low',
        status: 'completed',
        progress: 100,
      },
    ]);

    // Load agents
    this.updateAgents([
      {
        name: 'Gemini AI',
        type: 'ai_analysis',
        status: 'online',
        load: 3,
        maxLoad: 5,
        efficiency: 95,
        tasksCompleted: 142,
      },
      {
        name: 'HTTPie Agent',
        type: 'web_automation',
        status: 'online',
        load: 1,
        maxLoad: 3,
        efficiency: 90,
        tasksCompleted: 89,
      },
      {
        name: 'JQ Agent',
        type: 'data_processing',
        status: 'online',
        load: 5,
        maxLoad: 10,
        efficiency: 98,
        tasksCompleted: 234,
      },
      {
        name: 'Automation Agent',
        type: 'automation',
        status: 'offline',
        load: 0,
        maxLoad: 2,
        efficiency: 85,
        tasksCompleted: 45,
      },
    ]);

    // Load system logs
    this.updateSystemLogs([
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'Task TASK_001 started processing with Gemini AI',
      },
      {
        timestamp: new Date(Date.now() - 60000).toISOString(),
        level: 'success',
        message: 'Task TASK_003 completed successfully',
      },
      {
        timestamp: new Date(Date.now() - 120000).toISOString(),
        level: 'warning',
        message: 'Agent Automation Agent went offline',
      },
    ]);
  }

  updateSystemStatus(status) {
    document.getElementById('activeTasks').textContent = status.activeTasks;
    document.getElementById('queuedTasks').textContent = status.queuedTasks;
    document.getElementById('successRate').textContent =
      status.successRate + '%';
    document.getElementById('activeAgents').textContent = status.activeAgents;
  }

  updateTaskQueue(tasks) {
    const queueList = document.getElementById('taskQueueList');
    queueList.innerHTML = '';

    tasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.className = 'queue-item';

      const progressBar =
        task.status === 'processing'
          ? `<div class="progress-bar"><div class="progress-fill" style="width: ${task.progress}%"></div></div>`
          : `<span>${task.progress}%</span>`;

      taskElement.innerHTML = `
                <span>${task.content}</span>
                <span>${this.getTaskTypeLabel(task.type)}</span>
                <span>${this.getAgentLabel(task.agent)}</span>
                <span class="task-priority ${task.priority}">${this.getPriorityLabel(task.priority)}</span>
                <span class="task-status ${task.status}">${this.getStatusLabel(task.status)}</span>
                ${progressBar}
            `;

      queueList.appendChild(taskElement);
    });
  }

  updateAgents(agents) {
    const agentsGrid = document.getElementById('agentsGrid');
    agentsGrid.innerHTML = '';

    agents.forEach(agent => {
      const agentElement = document.createElement('div');
      agentElement.className = 'agent-card';

      agentElement.innerHTML = `
                <div class="agent-header">
                    <div class="agent-name">
                        <i class="fas fa-robot"></i>
                        ${agent.name}
                    </div>
                    <div class="agent-status ${agent.status}">
                        ${agent.status === 'online' ? 'متصل' : 'غير متصل'}
                    </div>
                </div>
                <div class="agent-stats">
                    <div class="agent-stat">
                        <div class="agent-stat-value">${agent.load}/${agent.maxLoad}</div>
                        <div class="agent-stat-label">الحمولة</div>
                    </div>
                    <div class="agent-stat">
                        <div class="agent-stat-value">${agent.efficiency}%</div>
                        <div class="agent-stat-label">الكفاءة</div>
                    </div>
                    <div class="agent-stat">
                        <div class="agent-stat-value">${agent.tasksCompleted}</div>
                        <div class="agent-stat-label">المهام المكتملة</div>
                    </div>
                    <div class="agent-stat">
                        <div class="agent-stat-value">${agent.type}</div>
                        <div class="agent-stat-label">النوع</div>
                    </div>
                </div>
            `;

      agentsGrid.appendChild(agentElement);
    });
  }

  updateSystemLogs(logs) {
    const logsList = document.getElementById('systemLogs');
    logsList.innerHTML = '';

    logs.forEach(log => {
      const logElement = document.createElement('div');
      logElement.className = 'log-entry';

      logElement.innerHTML = `
                <span class="log-timestamp">${this.formatTime(log.timestamp)}</span>
                <span class="log-level ${log.level}">${this.getLogLevelLabel(log.level)}</span>
                <span class="log-message">${log.message}</span>
            `;

      logsList.appendChild(logElement);
    });
  }

  initializeCharts() {
    // Task Volume Chart
    const taskVolumeCtx = document
      .getElementById('taskVolumeChart')
      .getContext('2d');
    this.charts.taskVolume = new Chart(taskVolumeCtx, {
      type: 'line',
      data: {
        labels: this.generateTimeLabels(),
        datasets: [
          {
            label: 'حجم المهام',
            data: this.generateRandomData(12, 0, 20),
            borderColor: '#00d9ff',
            backgroundColor: 'rgba(0, 217, 255, 0.1)',
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#ffffff',
            },
          },
        },
        scales: {
          x: {
            ticks: { color: '#ffffff' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
          },
          y: {
            ticks: { color: '#ffffff' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
          },
        },
      },
    });

    // Agent Performance Chart
    const agentPerformanceCtx = document
      .getElementById('agentPerformanceChart')
      .getContext('2d');
    this.charts.agentPerformance = new Chart(agentPerformanceCtx, {
      type: 'doughnut',
      data: {
        labels: ['Gemini AI', 'HTTPie', 'JQ', 'Automation', 'File'],
        datasets: [
          {
            data: [35, 20, 25, 10, 10],
            backgroundColor: [
              '#00d9ff',
              '#00ff88',
              '#ff9500',
              '#ff3b30',
              '#af52de',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#ffffff',
            },
          },
        },
      },
    });

    // Success Rate Chart
    const successRateCtx = document
      .getElementById('successRateChart')
      .getContext('2d');
    this.charts.successRate = new Chart(successRateCtx, {
      type: 'bar',
      data: {
        labels: this.generateTimeLabels(),
        datasets: [
          {
            label: 'معدل النجاح (%)',
            data: this.generateRandomData(12, 85, 100),
            backgroundColor: 'rgba(0, 255, 136, 0.6)',
            borderColor: '#00ff88',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#ffffff',
            },
          },
        },
        scales: {
          x: {
            ticks: { color: '#ffffff' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
          },
          y: {
            ticks: { color: '#ffffff' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
          },
        },
      },
    });

    // Response Time Chart
    const responseTimeCtx = document
      .getElementById('responseTimeChart')
      .getContext('2d');
    this.charts.responseTime = new Chart(responseTimeCtx, {
      type: 'line',
      data: {
        labels: this.generateTimeLabels(),
        datasets: [
          {
            label: 'وقت الاستجابة (ms)',
            data: this.generateRandomData(12, 1000, 8000),
            borderColor: '#ff9500',
            backgroundColor: 'rgba(255, 149, 0, 0.1)',
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#ffffff',
            },
          },
        },
        scales: {
          x: {
            ticks: { color: '#ffffff' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
          },
          y: {
            ticks: { color: '#ffffff' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
          },
        },
      },
    });
  }

  generateTimeLabels() {
    const labels = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 5 * 60000);
      labels.push(
        time.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      );
    }
    return labels;
  }

  generateRandomData(count, min, max) {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return data;
  }

  startAutoRefresh() {
    this.refreshInterval = setInterval(() => {
      this.refreshData();
    }, 5000); // Refresh every 5 seconds
  }

  initLiveWidgets() {
    try {
      if (window.AuraWidgets) {
        const ws = window.AuraWidgets.connect();
        const el = document.getElementById('live-system-chart');
        if (el) {
          this.liveChart = window.AuraWidgets.SystemLiveChart(el, ws);
        }

        // Subscribe to logs
        this.liveLogs = [];
        this.logsPaused = false;
        this.unsubscribeLogs = ws.subscribe(msg => {
          if (this.logsPaused) return;
          const t = new Date();
          if (msg?.type === 'notification') {
            this.pushLiveLog({
              ts: t,
              level: 'info',
              text: msg.data?.message || 'Notification',
            });
          } else if (msg?.type === 'alert') {
            const title = msg.data?.title || 'Alert';
            const message = msg.data?.message || '';
            this.pushLiveLog({
              ts: t,
              level: 'alert',
              text: `${title}${message ? ': ' + message : ''}`,
            });
          } else if (msg?.type === 'system_health') {
            const cpu = msg.data?.components?.cpu?.value;
            const mem = msg.data?.components?.memory?.value;
            this.pushLiveLog({
              ts: t,
              level: 'info',
              text: `Health CPU=${cpu} MEM=${mem}%`,
            });
          }
        });
      }
    } catch (e) {
      console.warn('Live widgets init failed', e);
    }
  }

  async handleCardAction(card, action, button) {
    try {
      button.classList.add('loading');
      if (action === 'refresh') {
        await this.refreshData();
        button.classList.remove('loading');
        button.classList.add('success');
        setTimeout(() => button.classList.remove('success'), 800);
        return;
      }
      if (action === 'play') {
        await this.sendAlert('info', 'تشغيل', 'تم تفعيل التشغيل');
      } else if (action === 'stop') {
        await this.sendAlert('warning', 'إيقاف', 'تم إيقاف العمليات');
      } else if (action === 'emergency') {
        await this.sendAlert('error', 'طوارئ', 'تم تفعيل وضع الطوارئ');
        this.openLogsModal();
      }
      button.classList.remove('loading');
      button.classList.add('success');
      setTimeout(() => button.classList.remove('success'), 800);
    } catch (err) {
      button.classList.remove('loading');
      button.classList.add('error');
      setTimeout(() => button.classList.remove('error'), 1000);
      this.pushLiveLog({
        ts: new Date(),
        level: 'error',
        text: `Action failed: ${err?.message || err}`,
      });
    }
  }

  async sendAlert(type, title, message) {
    const base = `${location.protocol}//${location.hostname}:3001`;
    const res = await fetch(`${base}/api/v1/system/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, title, message, source: 'autopilot-ui' }),
    });
    if (!res.ok) throw new Error('Failed to send alert');
    return res.json();
  }

  openLogsModal() {
    document.getElementById('logsModal').classList.add('active');
    this.renderLiveLogs();
  }

  clearLiveLogs() {
    this.liveLogs = [];
    this.renderLiveLogs();
  }

  toggleLogsPause(btn) {
    this.logsPaused = !this.logsPaused;
    btn.textContent = this.logsPaused ? 'استئناف البث' : 'إيقاف البث';
  }

  pushLiveLog(entry) {
    this.liveLogs.push(entry);
    if (this.liveLogs.length > 500) this.liveLogs.shift();
    this.renderLiveLogs();
  }

  renderLiveLogs() {
    const list = document.getElementById('liveLogs');
    if (!list) return;
    const qEl = document.getElementById('logsSearch');
    const lEl = document.getElementById('logsLevel');
    const q = qEl ? (qEl.value || '').toLowerCase() : '';
    const level = lEl ? lEl.value || 'all' : 'all';
    const filtered = (this.liveLogs || [])
      .filter(l => {
        if (level !== 'all' && l.level !== level) return false;
        if (q && !`${l.text}`.toLowerCase().includes(q)) return false;
        return true;
      })
      .slice(-200)
      .reverse();
    list.innerHTML = filtered
      .map(l => {
        const ts = new Date(l.ts).toLocaleTimeString('ar-SA', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        return `<div class="log-item"><span>${ts}</span><span class="badge ${l.level}">${l.level}</span><span>${l.text}</span></div>`;
      })
      .join('');
  }

  toggleDarkMode() {
    try {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('auraos:theme', isDark ? 'dark' : 'light');
    } catch (e) {}
  }

  refreshData() {
    console.log('🔄 Refreshing dashboard data...');
    // Simulate data refresh
    this.loadInitialData();
    this.updateCharts();
  }

  updateCharts(timeRange = '1h') {
    // Update chart data based on time range
    Object.values(this.charts).forEach(chart => {
      if (chart.config.type === 'line' || chart.config.type === 'bar') {
        chart.data.labels = this.generateTimeLabels();
        chart.data.datasets.forEach(dataset => {
          dataset.data = this.generateRandomData(12, 0, 100);
        });
        chart.update();
      }
    });
  }

  openTaskModal() {
    document.getElementById('taskModal').classList.add('active');
  }

  closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
  }

  createTask() {
    const form = document.getElementById('taskForm');
    const formData = new FormData(form);

    const task = {
      type: document.getElementById('taskType').value,
      content: document.getElementById('taskContent').value,
      priority: document.getElementById('taskPriority').value,
      agent: document.getElementById('assignedAgent').value,
    };

    console.log('📝 Creating task:', task);

    // Simulate task creation
    this.showNotification('تم إنشاء المهمة بنجاح', 'success');
    this.closeModal('taskModal');
    form.reset();

    // Refresh data
    setTimeout(() => this.refreshData(), 1000);
  }

  openSettingsModal() {
    document.getElementById('settingsModal').classList.add('active');
  }

  saveSettings() {
    const settings = {
      language: document.getElementById('systemLanguage').value,
      refreshRate: document.getElementById('refreshRate').value,
      telegramNotifications: document.getElementById('telegramNotifications')
        .checked,
      emailNotifications: document.getElementById('emailNotifications').checked,
    };

    console.log('⚙️ Saving settings:', settings);
    this.showNotification('تم حفظ الإعدادات', 'success');
    this.closeModal('settingsModal');
  }

  switchTab(tabName) {
    // Remove active class from all tabs and contents
    document
      .querySelectorAll('.tab-btn')
      .forEach(btn => btn.classList.remove('active'));
    document
      .querySelectorAll('.tab-content')
      .forEach(content => content.classList.remove('active'));

    // Add active class to selected tab and content
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
  }

  pauseQueue() {
    const btn = document.getElementById('pauseQueue');
    const icon = btn.querySelector('i');

    if (icon.classList.contains('fa-pause')) {
      icon.classList.remove('fa-pause');
      icon.classList.add('fa-play');
      btn.innerHTML = '<i class="fas fa-play"></i> استئناف';
      this.showNotification('تم إيقاف قائمة المهام مؤقتاً', 'warning');
    } else {
      icon.classList.remove('fa-play');
      icon.classList.add('fa-pause');
      btn.innerHTML = '<i class="fas fa-pause"></i> إيقاف مؤقت';
      this.showNotification('تم استئناف قائمة المهام', 'success');
    }
  }

  clearQueue() {
    if (confirm('هل أنت متأكد من مسح جميع المهام في قائمة الانتظار؟')) {
      document.getElementById('taskQueueList').innerHTML =
        '<div class="empty-state">قائمة الانتظار فارغة</div>';
      this.showNotification('تم مسح قائمة المهام', 'info');
    }
  }

  clearLogs() {
    if (confirm('هل أنت متأكد من مسح جميع السجلات؟')) {
      document.getElementById('systemLogs').innerHTML =
        '<div class="empty-state">لا توجد سجلات</div>';
      this.showNotification('تم مسح السجلات', 'info');
    }
  }

  filterLogs(level) {
    console.log('🔍 Filtering logs by level:', level);
    // Implement log filtering logic
  }

  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'ar' ? 'en' : 'ar';
    const btn = document.getElementById('languageToggle');

    if (this.currentLanguage === 'ar') {
      btn.innerHTML = '<i class="fas fa-language"></i> EN';
      document.documentElement.lang = 'ar';
      document.documentElement.dir = 'rtl';
    } else {
      btn.innerHTML = '<i class="fas fa-language"></i> AR';
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
    }

    this.showNotification(
      `تم تغيير اللغة إلى ${this.currentLanguage === 'ar' ? 'العربية' : 'English'}`,
      'info'
    );
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff3b30' : type === 'warning' ? '#ff9500' : '#00d9ff'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 3000;
            animation: slideIn 0.3s ease-out;
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Utility functions
  getTaskTypeLabel(type) {
    const labels = {
      data_analysis: 'تحليل البيانات',
      web_scraping: 'استخراج البيانات',
      automation: 'أتمتة',
      ai_task: 'ذكاء اصطناعي',
      general: 'عام',
    };
    return labels[type] || type;
  }

  getAgentLabel(agent) {
    const labels = {
      gemini_ai: 'Gemini AI',
      httpie_agent: 'HTTPie',
      jq_agent: 'JQ',
      automation_agent: 'Automation',
      file_agent: 'File',
      voice_processing_agent: 'Voice',
      image_processing_agent: 'Image',
    };
    return labels[agent] || agent;
  }

  getPriorityLabel(priority) {
    const labels = {
      urgent: 'عاجل',
      high: 'عالية',
      medium: 'متوسطة',
      low: 'منخفضة',
    };
    return labels[priority] || priority;
  }

  getStatusLabel(status) {
    const labels = {
      pending: 'في الانتظار',
      processing: 'قيد التنفيذ',
      completed: 'مكتمل',
      failed: 'فشل',
    };
    return labels[status] || status;
  }

  getLogLevelLabel(level) {
    const labels = {
      info: 'معلومات',
      warning: 'تحذير',
      error: 'خطأ',
      success: 'نجح',
    };
    return labels[level] || level;
  }

  formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AutopilotDashboard();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .empty-state {
        text-align: center;
        padding: 2rem;
        color: rgba(255, 255, 255, 0.6);
        font-style: italic;
    }
`;
document.head.appendChild(style);
