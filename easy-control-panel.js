/**
 * 🎮 AuraOS Easy Control Panel - No Typing Required
 * لوحة التحكم السهلة - بدون كتابة
 * 
 * This system provides easy-to-use control buttons for all tools and features
 * without requiring any typing or complex commands.
 */

class EasyControlPanel {
  constructor() {
    this.tools = new Map();
    this.automationTasks = new Map();
    this.deploymentStatus = {
      isDeploying: false,
      lastDeployment: null,
      deploymentHistory: []
    };
    this.updateStatus = {
      lastCheck: null,
      availableUpdates: [],
      isUpdating: false
    };
    this.init();
  }

  /**
   * Initialize the control panel
   */
  init() {
    this.setupControlButtons();
    this.loadToolRegistry();
    this.setupEventListeners();
    this.startStatusMonitoring();
    this.createControlPanelUI();
  }

  /**
   * Create the main control panel UI
   */
  createControlPanelUI() {
    const controlPanel = document.createElement('div');
    controlPanel.id = 'easyControlPanel';
    controlPanel.className = 'easy-control-panel';
    controlPanel.innerHTML = this.generateControlPanelHTML();
    
    document.body.appendChild(controlPanel);
    this.injectControlPanelStyles();
  }

  /**
   * Generate the control panel HTML
   */
  generateControlPanelHTML() {
    return `
      <div class="control-panel-overlay" id="controlPanelOverlay">
        <div class="control-panel-container">
          <!-- Header -->
          <div class="control-panel-header">
            <div class="header-left">
              <i class="fas fa-gamepad"></i>
              <h2>Easy Control Panel</h2>
              <span class="status-indicator" id="panelStatus">Ready</span>
            </div>
            <div class="header-right">
              <button class="close-btn" id="closeControlPanel">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="quick-actions-section">
            <h3><i class="fas fa-bolt"></i> Quick Actions</h3>
            <div class="quick-actions-grid">
              <button class="action-btn primary" data-action="start-all-tools">
                <i class="fas fa-play"></i>
                <span>Start All Tools</span>
              </button>
              <button class="action-btn success" data-action="check-updates">
                <i class="fas fa-sync-alt"></i>
                <span>Check Updates</span>
              </button>
              <button class="action-btn warning" data-action="deploy-system">
                <i class="fas fa-rocket"></i>
                <span>Deploy System</span>
              </button>
              <button class="action-btn info" data-action="system-status">
                <i class="fas fa-heartbeat"></i>
                <span>System Status</span>
              </button>
            </div>
          </div>

          <!-- Tools Control -->
          <div class="tools-section">
            <h3><i class="fas fa-tools"></i> Tools Control</h3>
            <div class="tools-grid" id="toolsGrid">
              <!-- Tools will be dynamically loaded here -->
            </div>
          </div>

          <!-- Automation Control -->
          <div class="automation-section">
            <h3><i class="fas fa-robot"></i> Automation Control</h3>
            <div class="automation-controls">
              <button class="control-btn" data-action="start-autopilot">
                <i class="fas fa-play-circle"></i>
                <span>Start Autopilot</span>
              </button>
              <button class="control-btn" data-action="pause-autopilot">
                <i class="fas fa-pause-circle"></i>
                <span>Pause Autopilot</span>
              </button>
              <button class="control-btn" data-action="stop-autopilot">
                <i class="fas fa-stop-circle"></i>
                <span>Stop Autopilot</span>
              </button>
              <button class="control-btn" data-action="configure-autopilot">
                <i class="fas fa-cog"></i>
                <span>Configure</span>
              </button>
            </div>
          </div>

          <!-- Deployment Control -->
          <div class="deployment-section">
            <h3><i class="fas fa-rocket"></i> Deployment Control</h3>
            <div class="deployment-controls">
              <button class="control-btn" data-action="deploy-staging">
                <i class="fas fa-code-branch"></i>
                <span>Deploy to Staging</span>
              </button>
              <button class="control-btn" data-action="deploy-production">
                <i class="fas fa-globe"></i>
                <span>Deploy to Production</span>
              </button>
              <button class="control-btn" data-action="rollback">
                <i class="fas fa-undo"></i>
                <span>Rollback</span>
              </button>
              <button class="control-btn" data-action="deployment-history">
                <i class="fas fa-history"></i>
                <span>History</span>
              </button>
            </div>
            <div class="deployment-status" id="deploymentStatus">
              <div class="status-item">
                <span class="label">Status:</span>
                <span class="value" id="deploymentStatusValue">Ready</span>
              </div>
              <div class="status-item">
                <span class="label">Last Deploy:</span>
                <span class="value" id="lastDeploymentTime">Never</span>
              </div>
            </div>
          </div>

          <!-- Update Control -->
          <div class="update-section">
            <h3><i class="fas fa-download"></i> Update Control</h3>
            <div class="update-controls">
              <button class="control-btn" data-action="check-updates">
                <i class="fas fa-search"></i>
                <span>Check for Updates</span>
              </button>
              <button class="control-btn" data-action="pull-updates">
                <i class="fas fa-download"></i>
                <span>Pull Updates</span>
              </button>
              <button class="control-btn" data-action="push-changes">
                <i class="fas fa-upload"></i>
                <span>Push Changes</span>
              </button>
              <button class="control-btn" data-action="update-history">
                <i class="fas fa-list"></i>
                <span>Update History</span>
              </button>
            </div>
            <div class="update-status" id="updateStatus">
              <div class="status-item">
                <span class="label">Status:</span>
                <span class="value" id="updateStatusValue">Up to date</span>
              </div>
              <div class="status-item">
                <span class="label">Available:</span>
                <span class="value" id="availableUpdates">0 updates</span>
              </div>
            </div>
          </div>

          <!-- System Monitor -->
          <div class="system-monitor-section">
            <h3><i class="fas fa-desktop"></i> System Monitor</h3>
            <div class="monitor-grid">
              <div class="monitor-item">
                <div class="monitor-icon">
                  <i class="fas fa-microchip"></i>
                </div>
                <div class="monitor-info">
                  <span class="monitor-label">CPU Usage</span>
                  <span class="monitor-value" id="cpuUsage">0%</span>
                </div>
              </div>
              <div class="monitor-item">
                <div class="monitor-icon">
                  <i class="fas fa-memory"></i>
                </div>
                <div class="monitor-info">
                  <span class="monitor-label">Memory</span>
                  <span class="monitor-value" id="memoryUsage">0%</span>
                </div>
              </div>
              <div class="monitor-item">
                <div class="monitor-icon">
                  <i class="fas fa-hdd"></i>
                </div>
                <div class="monitor-info">
                  <span class="monitor-label">Disk Space</span>
                  <span class="monitor-value" id="diskUsage">0%</span>
                </div>
              </div>
              <div class="monitor-item">
                <div class="monitor-icon">
                  <i class="fas fa-network-wired"></i>
                </div>
                <div class="monitor-info">
                  <span class="monitor-label">Network</span>
                  <span class="monitor-value" id="networkStatus">Online</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Logs and Feedback -->
          <div class="logs-section">
            <h3><i class="fas fa-file-alt"></i> Activity Logs</h3>
            <div class="logs-container" id="logsContainer">
              <div class="log-entry">
                <span class="log-time">[12:34:56]</span>
                <span class="log-message">Control panel initialized</span>
                <span class="log-level info">INFO</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Control Button -->
      <button class="floating-control-btn" id="floatingControlBtn">
        <i class="fas fa-gamepad"></i>
        <span class="btn-tooltip">Easy Control Panel</span>
      </button>
    `;
  }

  /**
   * Inject control panel styles
   */
  injectControlPanelStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .easy-control-panel {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: none;
      }

      .easy-control-panel.active {
        display: block;
      }

      .control-panel-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
      }

      .control-panel-container {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        border-radius: 20px;
        padding: 30px;
        max-width: 1200px;
        max-height: 90vh;
        width: 95%;
        overflow-y: auto;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(0, 217, 255, 0.3);
        animation: slideUp 0.3s ease-out;
      }

      .control-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid rgba(0, 217, 255, 0.2);
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 15px;
      }

      .header-left i {
        font-size: 24px;
        color: #00d9ff;
        animation: neon-pulse 2s ease-in-out infinite;
      }

      .header-left h2 {
        color: #ffffff;
        font-size: 24px;
        font-weight: 600;
        margin: 0;
      }

      .status-indicator {
        background: #10b981;
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        animation: pulse 2s infinite;
      }

      .close-btn {
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }

      .close-btn:hover {
        background: #dc2626;
        transform: scale(1.1);
      }

      .quick-actions-section,
      .tools-section,
      .automation-section,
      .deployment-section,
      .update-section,
      .system-monitor-section,
      .logs-section {
        margin-bottom: 30px;
      }

      .quick-actions-section h3,
      .tools-section h3,
      .automation-section h3,
      .deployment-section h3,
      .update-section h3,
      .system-monitor-section h3,
      .logs-section h3 {
        color: #ffffff;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .quick-actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
      }

      .action-btn {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: white;
        border: none;
        border-radius: 12px;
        padding: 15px 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
      }

      .action-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
      }

      .action-btn.primary {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
      }

      .action-btn.success {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
      }

      .action-btn.warning {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
      }

      .action-btn.info {
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
      }

      .tools-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
      }

      .tool-card {
        background: rgba(51, 65, 85, 0.5);
        border: 1px solid rgba(0, 217, 255, 0.2);
        border-radius: 12px;
        padding: 20px;
        transition: all 0.3s ease;
      }

      .tool-card:hover {
        border-color: rgba(0, 217, 255, 0.5);
        transform: translateY(-2px);
      }

      .tool-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }

      .tool-name {
        color: #ffffff;
        font-size: 16px;
        font-weight: 600;
      }

      .tool-status {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
      }

      .tool-status.running {
        background: #10b981;
        color: white;
      }

      .tool-status.stopped {
        background: #ef4444;
        color: white;
      }

      .tool-status.idle {
        background: #6b7280;
        color: white;
      }

      .tool-controls {
        display: flex;
        gap: 8px;
      }

      .control-btn {
        background: rgba(0, 217, 255, 0.1);
        color: #00d9ff;
        border: 1px solid rgba(0, 217, 255, 0.3);
        border-radius: 8px;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .control-btn:hover {
        background: rgba(0, 217, 255, 0.2);
        border-color: rgba(0, 217, 255, 0.5);
      }

      .automation-controls,
      .deployment-controls,
      .update-controls {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 10px;
        margin-bottom: 15px;
      }

      .deployment-status,
      .update-status {
        background: rgba(51, 65, 85, 0.3);
        border-radius: 8px;
        padding: 15px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
      }

      .status-item {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .status-item .label {
        color: #94a3b8;
        font-size: 12px;
        font-weight: 500;
      }

      .status-item .value {
        color: #ffffff;
        font-size: 14px;
        font-weight: 600;
      }

      .monitor-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
      }

      .monitor-item {
        background: rgba(51, 65, 85, 0.3);
        border-radius: 8px;
        padding: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .monitor-icon {
        color: #00d9ff;
        font-size: 20px;
      }

      .monitor-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .monitor-label {
        color: #94a3b8;
        font-size: 12px;
      }

      .monitor-value {
        color: #ffffff;
        font-size: 14px;
        font-weight: 600;
      }

      .logs-container {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        padding: 15px;
        max-height: 200px;
        overflow-y: auto;
      }

      .log-entry {
        display: flex;
        gap: 10px;
        margin-bottom: 8px;
        font-size: 12px;
      }

      .log-time {
        color: #6b7280;
        font-family: monospace;
      }

      .log-message {
        color: #ffffff;
        flex: 1;
      }

      .log-level {
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 500;
      }

      .log-level.info {
        background: #3b82f6;
        color: white;
      }

      .log-level.success {
        background: #10b981;
        color: white;
      }

      .log-level.warning {
        background: #f59e0b;
        color: white;
      }

      .log-level.error {
        background: #ef4444;
        color: white;
      }

      .floating-control-btn {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #00d9ff 0%, #0099cc 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        box-shadow: 0 8px 25px rgba(0, 217, 255, 0.4);
        transition: all 0.3s ease;
        z-index: 9999;
        animation: float 3s ease-in-out infinite;
      }

      .floating-control-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 12px 35px rgba(0, 217, 255, 0.6);
      }

      .btn-tooltip {
        position: absolute;
        right: 70px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      .floating-control-btn:hover .btn-tooltip {
        opacity: 1;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes slideUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      @keyframes neon-pulse {
        0%, 100% { text-shadow: 0 0 5px #00d9ff; }
        50% { text-shadow: 0 0 20px #00d9ff, 0 0 30px #00d9ff; }
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .control-panel-container {
          padding: 20px;
          margin: 10px;
        }

        .quick-actions-grid {
          grid-template-columns: 1fr;
        }

        .tools-grid {
          grid-template-columns: 1fr;
        }

        .automation-controls,
        .deployment-controls,
        .update-controls {
          grid-template-columns: 1fr;
        }

        .monitor-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .floating-control-btn {
          bottom: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          font-size: 20px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Floating button click
    document.addEventListener('click', (e) => {
      if (e.target.closest('#floatingControlBtn')) {
        this.toggleControlPanel();
      }
    });

    // Close button
    document.addEventListener('click', (e) => {
      if (e.target.closest('#closeControlPanel')) {
        this.closeControlPanel();
      }
    });

    // Overlay click to close
    document.addEventListener('click', (e) => {
      if (e.target.id === 'controlPanelOverlay') {
        this.closeControlPanel();
      }
    });

    // Action buttons
    document.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('[data-action]');
      if (actionBtn) {
        const action = actionBtn.dataset.action;
        this.handleAction(action);
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        this.toggleControlPanel();
      }
      if (e.key === 'Escape') {
        this.closeControlPanel();
      }
    });
  }

  /**
   * Toggle control panel visibility
   */
  toggleControlPanel() {
    const panel = document.getElementById('easyControlPanel');
    if (panel) {
      panel.classList.toggle('active');
      if (panel.classList.contains('active')) {
        this.loadToolsIntoGrid();
        this.updateSystemStatus();
      }
    }
  }

  /**
   * Close control panel
   */
  closeControlPanel() {
    const panel = document.getElementById('easyControlPanel');
    if (panel) {
      panel.classList.remove('active');
    }
  }

  /**
   * Handle action button clicks
   */
  async handleAction(action) {
    this.addLog(`Executing action: ${action}`, 'info');

    try {
      switch (action) {
        case 'start-all-tools':
          await this.startAllTools();
          break;
        case 'check-updates':
          await this.checkForUpdates();
          break;
        case 'deploy-system':
          await this.deploySystem();
          break;
        case 'system-status':
          await this.showSystemStatus();
          break;
        case 'start-autopilot':
          await this.startAutopilot();
          break;
        case 'pause-autopilot':
          await this.pauseAutopilot();
          break;
        case 'stop-autopilot':
          await this.stopAutopilot();
          break;
        case 'configure-autopilot':
          await this.configureAutopilot();
          break;
        case 'deploy-staging':
          await this.deployToStaging();
          break;
        case 'deploy-production':
          await this.deployToProduction();
          break;
        case 'rollback':
          await this.rollbackDeployment();
          break;
        case 'deployment-history':
          await this.showDeploymentHistory();
          break;
        case 'pull-updates':
          await this.pullUpdates();
          break;
        case 'push-changes':
          await this.pushChanges();
          break;
        case 'update-history':
          await this.showUpdateHistory();
          break;
        default:
          this.addLog(`Unknown action: ${action}`, 'warning');
      }
    } catch (error) {
      this.addLog(`Error executing ${action}: ${error.message}`, 'error');
    }
  }

  /**
   * Load tool registry
   */
  loadToolRegistry() {
    // Register all available tools
    this.registerTool('dashboard', {
      name: 'Dashboard',
      description: 'Main dashboard system',
      status: 'running',
      actions: ['start', 'stop', 'restart', 'configure']
    });

    this.registerTool('autopilot', {
      name: 'Autopilot',
      description: 'Automated task management',
      status: 'idle',
      actions: ['start', 'stop', 'pause', 'configure']
    });

    this.registerTool('analytics', {
      name: 'Analytics',
      description: 'Data analysis and reporting',
      status: 'running',
      actions: ['start', 'stop', 'refresh', 'export']
    });

    this.registerTool('ai-agent', {
      name: 'AI Agent',
      description: 'AI-powered automation',
      status: 'running',
      actions: ['start', 'stop', 'train', 'configure']
    });

    this.registerTool('learning-brain', {
      name: 'Learning Brain',
      description: 'Machine learning system',
      status: 'idle',
      actions: ['start', 'stop', 'train', 'analyze']
    });

    this.registerTool('mcp-server', {
      name: 'MCP Server',
      description: 'Model Context Protocol server',
      status: 'running',
      actions: ['start', 'stop', 'restart', 'status']
    });

    this.registerTool('telegram-bot', {
      name: 'Telegram Bot',
      description: 'Telegram integration',
      status: 'stopped',
      actions: ['start', 'stop', 'configure', 'test']
    });

    this.registerTool('firebase-integration', {
      name: 'Firebase Integration',
      description: 'Firebase services integration',
      status: 'running',
      actions: ['start', 'stop', 'sync', 'backup']
    });

    this.registerTool('github-integration', {
      name: 'GitHub Integration',
      description: 'GitHub API integration',
      status: 'running',
      actions: ['start', 'stop', 'sync', 'deploy']
    });

    this.registerTool('security-scanner', {
      name: 'Security Scanner',
      description: 'Security vulnerability scanner',
      status: 'idle',
      actions: ['start', 'stop', 'scan', 'report']
    });
  }

  /**
   * Register a tool
   */
  registerTool(id, tool) {
    this.tools.set(id, {
      id,
      ...tool,
      lastAction: null,
      lastActionTime: null
    });
  }

  /**
   * Load tools into the grid
   */
  loadToolsIntoGrid() {
    const toolsGrid = document.getElementById('toolsGrid');
    if (!toolsGrid) return;

    toolsGrid.innerHTML = '';

    this.tools.forEach((tool, id) => {
      const toolCard = document.createElement('div');
      toolCard.className = 'tool-card';
      toolCard.innerHTML = `
        <div class="tool-header">
          <div class="tool-name">${tool.name}</div>
          <div class="tool-status ${tool.status}">${tool.status}</div>
        </div>
        <div class="tool-description">${tool.description}</div>
        <div class="tool-controls">
          ${tool.actions.map(action => `
            <button class="control-btn" data-tool="${id}" data-tool-action="${action}">
              <i class="fas fa-${this.getActionIcon(action)}"></i>
              ${action}
            </button>
          `).join('')}
        </div>
      `;
      toolsGrid.appendChild(toolCard);
    });

    // Add tool action listeners
    document.addEventListener('click', (e) => {
      const toolBtn = e.target.closest('[data-tool-action]');
      if (toolBtn) {
        const toolId = toolBtn.dataset.tool;
        const action = toolBtn.dataset.toolAction;
        this.handleToolAction(toolId, action);
      }
    });
  }

  /**
   * Get action icon
   */
  getActionIcon(action) {
    const icons = {
      start: 'play',
      stop: 'stop',
      restart: 'redo',
      pause: 'pause',
      configure: 'cog',
      train: 'brain',
      analyze: 'chart-line',
      status: 'info-circle',
      test: 'vial',
      sync: 'sync-alt',
      backup: 'save',
      deploy: 'rocket',
      scan: 'search',
      report: 'file-alt',
      export: 'download',
      refresh: 'sync'
    };
    return icons[action] || 'circle';
  }

  /**
   * Handle tool action
   */
  async handleToolAction(toolId, action) {
    const tool = this.tools.get(toolId);
    if (!tool) return;

    this.addLog(`Executing ${action} on ${tool.name}`, 'info');

    try {
      // Update tool status
      tool.lastAction = action;
      tool.lastActionTime = new Date();

      // Simulate tool action (replace with actual implementation)
      await this.simulateToolAction(toolId, action);

      this.addLog(`${tool.name} ${action} completed successfully`, 'success');
      this.loadToolsIntoGrid(); // Refresh the grid
    } catch (error) {
      this.addLog(`Error ${action} ${tool.name}: ${error.message}`, 'error');
    }
  }

  /**
   * Simulate tool action (replace with actual implementation)
   */
  async simulateToolAction(toolId, action) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tool = this.tools.get(toolId);
        if (tool) {
          // Update status based on action
          if (action === 'start') {
            tool.status = 'running';
          } else if (action === 'stop') {
            tool.status = 'stopped';
          } else if (action === 'pause') {
            tool.status = 'idle';
          }
        }
        resolve();
      }, 1000);
    });
  }

  /**
   * Start all tools
   */
  async startAllTools() {
    this.addLog('Starting all tools...', 'info');
    
    for (const [id, tool] of this.tools) {
      if (tool.status !== 'running') {
        await this.handleToolAction(id, 'start');
      }
    }
    
    this.addLog('All tools started successfully', 'success');
  }

  /**
   * Check for updates
   */
  async checkForUpdates() {
    this.addLog('Checking for updates...', 'info');
    
    // Simulate update check
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const availableUpdates = Math.floor(Math.random() * 5);
    this.updateStatus.availableUpdates = availableUpdates;
    this.updateStatus.lastCheck = new Date();
    
    document.getElementById('availableUpdates').textContent = `${availableUpdates} updates`;
    document.getElementById('updateStatusValue').textContent = availableUpdates > 0 ? 'Updates available' : 'Up to date';
    
    this.addLog(`Found ${availableUpdates} available updates`, availableUpdates > 0 ? 'warning' : 'success');
  }

  /**
   * Deploy system
   */
  async deploySystem() {
    this.addLog('Starting system deployment...', 'info');
    
    this.deploymentStatus.isDeploying = true;
    document.getElementById('deploymentStatusValue').textContent = 'Deploying...';
    
    // Simulate deployment
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    this.deploymentStatus.isDeploying = false;
    this.deploymentStatus.lastDeployment = new Date();
    this.deploymentStatus.deploymentHistory.push({
      timestamp: new Date(),
      status: 'success',
      version: '2.1.0'
    });
    
    document.getElementById('deploymentStatusValue').textContent = 'Deployed';
    document.getElementById('lastDeploymentTime').textContent = this.formatTime(this.deploymentStatus.lastDeployment);
    
    this.addLog('System deployment completed successfully', 'success');
  }

  /**
   * Show system status
   */
  async showSystemStatus() {
    this.addLog('Fetching system status...', 'info');
    await this.updateSystemStatus();
    this.addLog('System status updated', 'success');
  }

  /**
   * Update system status
   */
  async updateSystemStatus() {
    // Simulate system metrics
    const cpuUsage = Math.floor(Math.random() * 100);
    const memoryUsage = Math.floor(Math.random() * 100);
    const diskUsage = Math.floor(Math.random() * 100);
    
    document.getElementById('cpuUsage').textContent = `${cpuUsage}%`;
    document.getElementById('memoryUsage').textContent = `${memoryUsage}%`;
    document.getElementById('diskUsage').textContent = `${diskUsage}%`;
    document.getElementById('networkStatus').textContent = 'Online';
  }

  /**
   * Autopilot controls
   */
  async startAutopilot() {
    this.addLog('Starting autopilot...', 'info');
    await this.handleToolAction('autopilot', 'start');
  }

  async pauseAutopilot() {
    this.addLog('Pausing autopilot...', 'info');
    await this.handleToolAction('autopilot', 'pause');
  }

  async stopAutopilot() {
    this.addLog('Stopping autopilot...', 'info');
    await this.handleToolAction('autopilot', 'stop');
  }

  async configureAutopilot() {
    this.addLog('Opening autopilot configuration...', 'info');
    // Open configuration modal or redirect to settings
  }

  /**
   * Deployment controls
   */
  async deployToStaging() {
    this.addLog('Deploying to staging...', 'info');
    // Implement staging deployment
  }

  async deployToProduction() {
    this.addLog('Deploying to production...', 'info');
    await this.deploySystem();
  }

  async rollbackDeployment() {
    this.addLog('Rolling back deployment...', 'info');
    // Implement rollback
  }

  async showDeploymentHistory() {
    this.addLog('Showing deployment history...', 'info');
    // Show deployment history modal
  }

  /**
   * Update controls
   */
  async pullUpdates() {
    this.addLog('Pulling updates...', 'info');
    // Implement git pull
  }

  async pushChanges() {
    this.addLog('Pushing changes...', 'info');
    // Implement git push
  }

  async showUpdateHistory() {
    this.addLog('Showing update history...', 'info');
    // Show update history modal
  }

  /**
   * Add log entry
   */
  addLog(message, level = 'info') {
    const logsContainer = document.getElementById('logsContainer');
    if (!logsContainer) return;

    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `
      <span class="log-time">[${new Date().toLocaleTimeString()}]</span>
      <span class="log-message">${message}</span>
      <span class="log-level ${level}">${level.toUpperCase()}</span>
    `;

    logsContainer.appendChild(logEntry);
    logsContainer.scrollTop = logsContainer.scrollHeight;

    // Keep only last 50 log entries
    const entries = logsContainer.querySelectorAll('.log-entry');
    if (entries.length > 50) {
      entries[0].remove();
    }
  }

  /**
   * Format time
   */
  formatTime(date) {
    if (!date) return 'Never';
    return date.toLocaleString();
  }

  /**
   * Start status monitoring
   */
  startStatusMonitoring() {
    setInterval(() => {
      this.updateSystemStatus();
    }, 5000);
  }

  /**
   * Setup control buttons
   */
  setupControlButtons() {
    // This method is called during initialization
    // The actual button setup is handled by createControlPanelUI()
  }
}

// Initialize the control panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.easyControlPanel = new EasyControlPanel();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EasyControlPanel;
}
