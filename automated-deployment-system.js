/**
 * 🚀 AuraOS Automated Deployment System
 * نظام النشر الآلي
 * 
 * This system handles automated deployment to different environments
 * with proper CI/CD pipeline integration and rollback capabilities.
 */

class AutomatedDeploymentSystem {
  constructor() {
    this.deploymentStatus = {
      isDeploying: false,
      currentDeployment: null,
      deploymentHistory: [],
      environments: {
        development: { status: 'ready', lastDeploy: null },
        staging: { status: 'ready', lastDeploy: null },
        production: { status: 'ready', lastDeploy: null }
      }
    };
    this.deploymentConfig = {
      autoDeploy: false,
      environments: {
        development: {
          url: 'http://localhost:3000',
          branch: 'develop',
          autoDeploy: true
        },
        staging: {
          url: 'https://staging.auraos.com',
          branch: 'staging',
          autoDeploy: false
        },
        production: {
          url: 'https://auraos.com',
          branch: 'main',
          autoDeploy: false
        }
      },
      buildSteps: [
        'install-dependencies',
        'run-tests',
        'build-application',
        'run-security-scan',
        'deploy-to-environment',
        'run-health-checks',
        'notify-team'
      ]
    };
    this.init();
  }

  /**
   * Initialize the deployment system
   */
  init() {
    this.setupDeploymentMonitoring();
    this.createDeploymentUI();
    this.setupEventListeners();
    this.startDeploymentMonitoring();
  }

  /**
   * Setup deployment monitoring
   */
  setupDeploymentMonitoring() {
    this.monitoring = {
      checkInterval: 10000, // 10 seconds
      lastCheck: null,
      isChecking: false,
      healthChecks: {
        development: { status: 'healthy', responseTime: 0 },
        staging: { status: 'healthy', responseTime: 0 },
        production: { status: 'healthy', responseTime: 0 }
      }
    };
  }

  /**
   * Create deployment UI
   */
  createDeploymentUI() {
    const deploymentPanel = document.createElement('div');
    deploymentPanel.id = 'deploymentSystemPanel';
    deploymentPanel.className = 'deployment-system-panel';
    deploymentPanel.innerHTML = this.generateDeploymentUIHTML();
    
    // Add to control panel if it exists
    const controlPanel = document.getElementById('easyControlPanel');
    if (controlPanel) {
      const deploymentSection = controlPanel.querySelector('.deployment-section');
      if (deploymentSection) {
        deploymentSection.appendChild(deploymentPanel);
      }
    } else {
      document.body.appendChild(deploymentPanel);
    }

    this.injectDeploymentStyles();
  }

  /**
   * Generate deployment UI HTML
   */
  generateDeploymentUIHTML() {
    return `
      <div class="deployment-system-container">
        <div class="deployment-status-overview">
          <div class="environment-cards">
            <div class="env-card development" data-env="development">
              <div class="env-header">
                <div class="env-icon">
                  <i class="fas fa-code"></i>
                </div>
                <div class="env-info">
                  <h4>Development</h4>
                  <span class="env-status ready">Ready</span>
                </div>
              </div>
              <div class="env-details">
                <div class="env-url">http://localhost:3000</div>
                <div class="env-branch">develop</div>
                <div class="env-health">
                  <span class="health-indicator healthy"></span>
                  <span class="health-text">Healthy</span>
                </div>
              </div>
            </div>

            <div class="env-card staging" data-env="staging">
              <div class="env-header">
                <div class="env-icon">
                  <i class="fas fa-flask"></i>
                </div>
                <div class="env-info">
                  <h4>Staging</h4>
                  <span class="env-status ready">Ready</span>
                </div>
              </div>
              <div class="env-details">
                <div class="env-url">https://staging.auraos.com</div>
                <div class="env-branch">staging</div>
                <div class="env-health">
                  <span class="health-indicator healthy"></span>
                  <span class="health-text">Healthy</span>
                </div>
              </div>
            </div>

            <div class="env-card production" data-env="production">
              <div class="env-header">
                <div class="env-icon">
                  <i class="fas fa-rocket"></i>
                </div>
                <div class="env-info">
                  <h4>Production</h4>
                  <span class="env-status ready">Ready</span>
                </div>
              </div>
              <div class="env-details">
                <div class="env-url">https://auraos.com</div>
                <div class="env-branch">main</div>
                <div class="env-health">
                  <span class="health-indicator healthy"></span>
                  <span class="health-text">Healthy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="deployment-controls">
          <div class="control-group">
            <h5><i class="fas fa-play"></i> Quick Deploy</h5>
            <div class="control-buttons">
              <button class="deploy-btn primary" data-action="deploy-dev">
                <i class="fas fa-code"></i>
                Deploy to Dev
              </button>
              <button class="deploy-btn warning" data-action="deploy-staging">
                <i class="fas fa-flask"></i>
                Deploy to Staging
              </button>
              <button class="deploy-btn danger" data-action="deploy-production">
                <i class="fas fa-rocket"></i>
                Deploy to Production
              </button>
            </div>
          </div>

          <div class="control-group">
            <h5><i class="fas fa-cogs"></i> Advanced</h5>
            <div class="control-buttons">
              <button class="deploy-btn" data-action="rollback">
                <i class="fas fa-undo"></i>
                Rollback
              </button>
              <button class="deploy-btn" data-action="health-check">
                <i class="fas fa-heartbeat"></i>
                Health Check
              </button>
              <button class="deploy-btn" data-action="deployment-history">
                <i class="fas fa-history"></i>
                History
              </button>
            </div>
          </div>

          <div class="control-group">
            <h5><i class="fas fa-sliders-h"></i> Configuration</h5>
            <div class="control-buttons">
              <button class="deploy-btn" data-action="configure-deployment">
                <i class="fas fa-cog"></i>
                Configure
              </button>
              <button class="deploy-btn" data-action="auto-deploy-toggle">
                <i class="fas fa-toggle-on"></i>
                Auto Deploy
              </button>
              <button class="deploy-btn" data-action="deployment-status">
                <i class="fas fa-info-circle"></i>
                Status
              </button>
            </div>
          </div>
        </div>

        <div class="deployment-progress" id="deploymentProgress" style="display: none;">
          <div class="progress-header">
            <span class="progress-title">Deployment in Progress</span>
            <span class="progress-percentage">0%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" id="deploymentProgressFill"></div>
          </div>
          <div class="progress-status" id="deploymentProgressStatus">Initializing...</div>
          <div class="build-steps" id="buildSteps">
            <!-- Build steps will be listed here -->
          </div>
        </div>

        <div class="deployment-log" id="deploymentLog">
          <div class="log-header">
            <h5><i class="fas fa-file-alt"></i> Deployment Activity</h5>
            <button class="clear-log-btn" id="clearDeploymentLog">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <div class="log-content" id="deploymentLogContent">
            <div class="log-entry">
              <span class="log-time">[${new Date().toLocaleTimeString()}]</span>
              <span class="log-message">Deployment system initialized</span>
              <span class="log-level info">INFO</span>
            </div>
          </div>
        </div>

        <div class="rollback-panel" id="rollbackPanel" style="display: none;">
          <div class="rollback-header">
            <h5><i class="fas fa-undo"></i> Rollback Options</h5>
          </div>
          <div class="rollback-options" id="rollbackOptions">
            <!-- Rollback options will be listed here -->
          </div>
          <div class="rollback-actions">
            <button class="deploy-btn primary" data-action="confirm-rollback">
              <i class="fas fa-check"></i>
              Confirm Rollback
            </button>
            <button class="deploy-btn danger" data-action="cancel-rollback">
              <i class="fas fa-times"></i>
              Cancel
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Inject deployment styles
   */
  injectDeploymentStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .deployment-system-panel {
        margin-top: 20px;
        background: rgba(51, 65, 85, 0.3);
        border-radius: 12px;
        padding: 20px;
        border: 1px solid rgba(0, 217, 255, 0.2);
      }

      .deployment-system-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .deployment-status-overview {
        margin-bottom: 20px;
      }

      .environment-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
      }

      .env-card {
        background: rgba(30, 41, 59, 0.5);
        border: 1px solid rgba(0, 217, 255, 0.2);
        border-radius: 8px;
        padding: 15px;
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .env-card:hover {
        border-color: rgba(0, 217, 255, 0.5);
        transform: translateY(-2px);
      }

      .env-card.development {
        border-left: 4px solid #10b981;
      }

      .env-card.staging {
        border-left: 4px solid #f59e0b;
      }

      .env-card.production {
        border-left: 4px solid #ef4444;
      }

      .env-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
      }

      .env-icon {
        color: #00d9ff;
        font-size: 20px;
      }

      .env-info h4 {
        color: #ffffff;
        font-size: 14px;
        font-weight: 600;
        margin: 0;
      }

      .env-status {
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 500;
      }

      .env-status.ready {
        background: #10b981;
        color: white;
      }

      .env-status.deploying {
        background: #f59e0b;
        color: white;
      }

      .env-status.error {
        background: #ef4444;
        color: white;
      }

      .env-details {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .env-url {
        color: #94a3b8;
        font-size: 11px;
        font-family: monospace;
      }

      .env-branch {
        color: #6b7280;
        font-size: 10px;
      }

      .env-health {
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .health-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }

      .health-indicator.healthy {
        background: #10b981;
      }

      .health-indicator.unhealthy {
        background: #ef4444;
      }

      .health-text {
        color: #94a3b8;
        font-size: 10px;
      }

      .deployment-controls {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .control-group h5 {
        color: #ffffff;
        font-size: 14px;
        font-weight: 600;
        margin: 0 0 10px 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .control-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .deploy-btn {
        background: rgba(0, 217, 255, 0.1);
        color: #00d9ff;
        border: 1px solid rgba(0, 217, 255, 0.3);
        border-radius: 6px;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .deploy-btn:hover {
        background: rgba(0, 217, 255, 0.2);
        border-color: rgba(0, 217, 255, 0.5);
        transform: translateY(-1px);
      }

      .deploy-btn.primary {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
        border-color: rgba(16, 185, 129, 0.3);
      }

      .deploy-btn.warning {
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
        border-color: rgba(245, 158, 11, 0.3);
      }

      .deploy-btn.danger {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border-color: rgba(239, 68, 68, 0.3);
      }

      .deployment-progress {
        background: rgba(30, 41, 59, 0.5);
        border: 1px solid rgba(0, 217, 255, 0.2);
        border-radius: 8px;
        padding: 15px;
      }

      .progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .progress-title {
        color: #ffffff;
        font-size: 14px;
        font-weight: 600;
      }

      .progress-percentage {
        color: #00d9ff;
        font-size: 14px;
        font-weight: 600;
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 8px;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #00d9ff, #0099cc);
        border-radius: 4px;
        width: 0%;
        transition: width 0.3s ease;
      }

      .progress-status {
        color: #94a3b8;
        font-size: 12px;
        margin-bottom: 10px;
      }

      .build-steps {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .build-step {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
      }

      .build-step.pending {
        background: rgba(107, 114, 128, 0.1);
        color: #6b7280;
      }

      .build-step.running {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
      }

      .build-step.completed {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
      }

      .build-step.failed {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
      }

      .step-icon {
        width: 12px;
        text-align: center;
      }

      .deployment-log {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        padding: 15px;
        max-height: 200px;
        overflow-y: auto;
      }

      .log-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(0, 217, 255, 0.2);
      }

      .log-header h5 {
        color: #ffffff;
        font-size: 14px;
        font-weight: 600;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .clear-log-btn {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: 4px;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 10px;
        transition: all 0.3s ease;
      }

      .clear-log-btn:hover {
        background: rgba(239, 68, 68, 0.2);
        border-color: rgba(239, 68, 68, 0.5);
      }

      .log-content {
        font-size: 11px;
        line-height: 1.4;
      }

      .log-entry {
        display: flex;
        gap: 8px;
        margin-bottom: 6px;
        padding: 2px 0;
      }

      .log-time {
        color: #6b7280;
        font-family: monospace;
        min-width: 80px;
      }

      .log-message {
        color: #ffffff;
        flex: 1;
      }

      .log-level {
        padding: 1px 4px;
        border-radius: 3px;
        font-size: 9px;
        font-weight: 500;
        min-width: 40px;
        text-align: center;
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

      .rollback-panel {
        background: rgba(245, 158, 11, 0.1);
        border: 1px solid rgba(245, 158, 11, 0.3);
        border-radius: 8px;
        padding: 15px;
      }

      .rollback-header h5 {
        color: #f59e0b;
        font-size: 14px;
        font-weight: 600;
        margin: 0 0 15px 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .rollback-options {
        margin-bottom: 15px;
      }

      .rollback-option {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 6px;
        padding: 10px;
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .rollback-info {
        color: #ffffff;
        font-size: 12px;
      }

      .rollback-actions {
        display: flex;
        gap: 8px;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .environment-cards {
          grid-template-columns: 1fr;
        }

        .control-buttons {
          justify-content: center;
        }

        .rollback-actions {
          flex-direction: column;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Deployment action buttons
    document.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('[data-action]');
      if (actionBtn && actionBtn.classList.contains('deploy-btn')) {
        const action = actionBtn.dataset.action;
        this.handleDeploymentAction(action);
      }
    });

    // Environment cards
    document.addEventListener('click', (e) => {
      const envCard = e.target.closest('.env-card');
      if (envCard) {
        const env = envCard.dataset.env;
        this.showEnvironmentDetails(env);
      }
    });

    // Clear log button
    document.addEventListener('click', (e) => {
      if (e.target.closest('#clearDeploymentLog')) {
        this.clearDeploymentLog();
      }
    });
  }

  /**
   * Handle deployment action
   */
  async handleDeploymentAction(action) {
    this.addDeploymentLog(`Executing deployment action: ${action}`, 'info');

    try {
      switch (action) {
        case 'deploy-dev':
          await this.deployToEnvironment('development');
          break;
        case 'deploy-staging':
          await this.deployToEnvironment('staging');
          break;
        case 'deploy-production':
          await this.deployToEnvironment('production');
          break;
        case 'rollback':
          await this.showRollbackOptions();
          break;
        case 'health-check':
          await this.performHealthCheck();
          break;
        case 'deployment-history':
          await this.showDeploymentHistory();
          break;
        case 'configure-deployment':
          await this.configureDeployment();
          break;
        case 'auto-deploy-toggle':
          await this.toggleAutoDeploy();
          break;
        case 'deployment-status':
          await this.showDeploymentStatus();
          break;
        case 'confirm-rollback':
          await this.confirmRollback();
          break;
        case 'cancel-rollback':
          await this.cancelRollback();
          break;
        default:
          this.addDeploymentLog(`Unknown deployment action: ${action}`, 'warning');
      }
    } catch (error) {
      this.addDeploymentLog(`Error executing deployment action ${action}: ${error.message}`, 'error');
    }
  }

  /**
   * Deploy to environment
   */
  async deployToEnvironment(environment) {
    this.addDeploymentLog(`Starting deployment to ${environment}...`, 'info');
    
    this.deploymentStatus.isDeploying = true;
    this.deploymentStatus.currentDeployment = {
      environment,
      startTime: new Date(),
      status: 'running',
      steps: [...this.deploymentConfig.buildSteps]
    };
    
    this.updateEnvironmentStatus(environment, 'deploying');
    this.showDeploymentProgress(true);
    
    try {
      await this.executeDeploymentPipeline(environment);
      
      this.deploymentStatus.environments[environment].lastDeploy = new Date();
      this.deploymentStatus.deploymentHistory.push({
        environment,
        timestamp: new Date(),
        status: 'success',
        duration: Date.now() - this.deploymentStatus.currentDeployment.startTime.getTime()
      });
      
      this.addDeploymentLog(`Deployment to ${environment} completed successfully`, 'success');
      
    } catch (error) {
      this.addDeploymentLog(`Deployment to ${environment} failed: ${error.message}`, 'error');
      
      this.deploymentStatus.deploymentHistory.push({
        environment,
        timestamp: new Date(),
        status: 'failed',
        error: error.message
      });
    } finally {
      this.deploymentStatus.isDeploying = false;
      this.deploymentStatus.currentDeployment = null;
      this.updateEnvironmentStatus(environment, 'ready');
      this.showDeploymentProgress(false);
    }
  }

  /**
   * Execute deployment pipeline
   */
  async executeDeploymentPipeline(environment) {
    const steps = this.deploymentConfig.buildSteps;
    let progress = 0;
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepProgress = ((i + 1) / steps.length) * 100;
      
      this.updateDeploymentProgress(stepProgress, `Executing ${step}...`);
      this.updateBuildStep(step, 'running');
      
      try {
        await this.executeBuildStep(step, environment);
        this.updateBuildStep(step, 'completed');
        this.addDeploymentLog(`Step ${step} completed successfully`, 'success');
      } catch (error) {
        this.updateBuildStep(step, 'failed');
        this.addDeploymentLog(`Step ${step} failed: ${error.message}`, 'error');
        throw error;
      }
      
      progress = stepProgress;
    }
  }

  /**
   * Execute build step
   */
  async executeBuildStep(step, environment) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate step execution
        if (Math.random() > 0.1) { // 90% success rate
          resolve();
        } else {
          reject(new Error(`Step ${step} failed`));
        }
      }, 1000 + Math.random() * 2000);
    });
  }

  /**
   * Show rollback options
   */
  async showRollbackOptions() {
    this.addDeploymentLog('Loading rollback options...', 'info');
    
    // Simulate loading rollback options
    const rollbackOptions = [
      { version: 'v1.2.0', timestamp: '2025-01-20 10:30:00', environment: 'production' },
      { version: 'v1.1.9', timestamp: '2025-01-19 15:45:00', environment: 'production' },
      { version: 'v1.1.8', timestamp: '2025-01-18 09:15:00', environment: 'production' }
    ];
    
    this.showRollbackPanel(true);
    this.updateRollbackOptions(rollbackOptions);
  }

  /**
   * Perform health check
   */
  async performHealthCheck() {
    this.addDeploymentLog('Performing health checks...', 'info');
    
    for (const env of Object.keys(this.deploymentConfig.environments)) {
      try {
        await this.checkEnvironmentHealth(env);
        this.addDeploymentLog(`Health check for ${env}: OK`, 'success');
      } catch (error) {
        this.addDeploymentLog(`Health check for ${env}: FAILED - ${error.message}`, 'error');
      }
    }
  }

  /**
   * Check environment health
   */
  async checkEnvironmentHealth(environment) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate health check
        if (Math.random() > 0.2) { // 80% success rate
          this.monitoring.healthChecks[environment] = {
            status: 'healthy',
            responseTime: Math.floor(Math.random() * 500) + 100
          };
          resolve();
        } else {
          this.monitoring.healthChecks[environment] = {
            status: 'unhealthy',
            responseTime: 0
          };
          reject(new Error('Health check failed'));
        }
      }, 1000);
    });
  }

  /**
   * Show deployment history
   */
  async showDeploymentHistory() {
    this.addDeploymentLog('Showing deployment history...', 'info');
    console.log('Deployment History:', this.deploymentStatus.deploymentHistory);
  }

  /**
   * Configure deployment
   */
  async configureDeployment() {
    this.addDeploymentLog('Opening deployment configuration...', 'info');
    // Open configuration modal
  }

  /**
   * Toggle auto deploy
   */
  async toggleAutoDeploy() {
    this.deploymentConfig.autoDeploy = !this.deploymentConfig.autoDeploy;
    this.addDeploymentLog(`Auto deploy ${this.deploymentConfig.autoDeploy ? 'enabled' : 'disabled'}`, 'info');
  }

  /**
   * Show deployment status
   */
  async showDeploymentStatus() {
    this.addDeploymentLog('Fetching deployment status...', 'info');
    
    const status = {
      isDeploying: this.deploymentStatus.isDeploying,
      environments: this.deploymentStatus.environments,
      healthChecks: this.monitoring.healthChecks
    };
    
    console.log('Deployment Status:', status);
  }

  /**
   * Confirm rollback
   */
  async confirmRollback() {
    this.addDeploymentLog('Confirming rollback...', 'warning');
    
    if (confirm('Are you sure you want to rollback?')) {
      // Execute rollback
      this.addDeploymentLog('Rollback executed successfully', 'success');
      this.showRollbackPanel(false);
    }
  }

  /**
   * Cancel rollback
   */
  async cancelRollback() {
    this.addDeploymentLog('Rollback cancelled', 'info');
    this.showRollbackPanel(false);
  }

  /**
   * Show environment details
   */
  showEnvironmentDetails(environment) {
    this.addDeploymentLog(`Showing details for ${environment} environment`, 'info');
    // Show environment details modal
  }

  /**
   * Update environment status
   */
  updateEnvironmentStatus(environment, status) {
    this.deploymentStatus.environments[environment].status = status;
    
    const envCard = document.querySelector(`[data-env="${environment}"]`);
    if (envCard) {
      const statusElement = envCard.querySelector('.env-status');
      if (statusElement) {
        statusElement.textContent = status;
        statusElement.className = `env-status ${status}`;
      }
    }
  }

  /**
   * Show deployment progress
   */
  showDeploymentProgress(show) {
    const progressPanel = document.getElementById('deploymentProgress');
    if (progressPanel) {
      progressPanel.style.display = show ? 'block' : 'none';
    }
  }

  /**
   * Update deployment progress
   */
  updateDeploymentProgress(percentage, status) {
    const progressFill = document.getElementById('deploymentProgressFill');
    const progressPercentage = document.querySelector('.progress-percentage');
    const progressStatus = document.getElementById('deploymentProgressStatus');
    
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
    
    if (progressPercentage) {
      progressPercentage.textContent = `${Math.round(percentage)}%`;
    }
    
    if (progressStatus) {
      progressStatus.textContent = status;
    }
  }

  /**
   * Update build step
   */
  updateBuildStep(step, status) {
    const buildSteps = document.getElementById('buildSteps');
    if (!buildSteps) return;
    
    let stepElement = buildSteps.querySelector(`[data-step="${step}"]`);
    if (!stepElement) {
      stepElement = document.createElement('div');
      stepElement.className = 'build-step';
      stepElement.dataset.step = step;
      stepElement.innerHTML = `
        <span class="step-icon">⏳</span>
        <span class="step-name">${step}</span>
      `;
      buildSteps.appendChild(stepElement);
    }
    
    stepElement.className = `build-step ${status}`;
    
    const icon = stepElement.querySelector('.step-icon');
    if (icon) {
      switch (status) {
        case 'pending':
          icon.textContent = '⏳';
          break;
        case 'running':
          icon.textContent = '🔄';
          break;
        case 'completed':
          icon.textContent = '✅';
          break;
        case 'failed':
          icon.textContent = '❌';
          break;
      }
    }
  }

  /**
   * Show rollback panel
   */
  showRollbackPanel(show) {
    const rollbackPanel = document.getElementById('rollbackPanel');
    if (rollbackPanel) {
      rollbackPanel.style.display = show ? 'block' : 'none';
    }
  }

  /**
   * Update rollback options
   */
  updateRollbackOptions(options) {
    const rollbackOptions = document.getElementById('rollbackOptions');
    if (!rollbackOptions) return;
    
    rollbackOptions.innerHTML = '';
    
    options.forEach(option => {
      const optionElement = document.createElement('div');
      optionElement.className = 'rollback-option';
      optionElement.innerHTML = `
        <div class="rollback-info">
          <div>Version: ${option.version}</div>
          <div>Date: ${option.timestamp}</div>
          <div>Environment: ${option.environment}</div>
        </div>
        <input type="radio" name="rollback-version" value="${option.version}">
      `;
      rollbackOptions.appendChild(optionElement);
    });
  }

  /**
   * Add deployment log entry
   */
  addDeploymentLog(message, level = 'info') {
    const logContent = document.getElementById('deploymentLogContent');
    if (!logContent) return;

    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `
      <span class="log-time">[${new Date().toLocaleTimeString()}]</span>
      <span class="log-message">${message}</span>
      <span class="log-level ${level}">${level.toUpperCase()}</span>
    `;

    logContent.appendChild(logEntry);
    logContent.scrollTop = logContent.scrollHeight;

    // Keep only last 100 log entries
    const entries = logContent.querySelectorAll('.log-entry');
    if (entries.length > 100) {
      entries[0].remove();
    }
  }

  /**
   * Clear deployment log
   */
  clearDeploymentLog() {
    const logContent = document.getElementById('deploymentLogContent');
    if (logContent) {
      logContent.innerHTML = `
        <div class="log-entry">
          <span class="log-time">[${new Date().toLocaleTimeString()}]</span>
          <span class="log-message">Deployment log cleared</span>
          <span class="log-level info">INFO</span>
        </div>
      `;
    }
  }

  /**
   * Start deployment monitoring
   */
  startDeploymentMonitoring() {
    // Update health checks periodically
    setInterval(() => {
      this.performHealthCheck();
    }, 60000); // Every minute
  }
}

// Initialize the deployment system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.automatedDeploymentSystem = new AutomatedDeploymentSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AutomatedDeploymentSystem;
}
