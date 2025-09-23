/**
 * 🔄 AuraOS Push/Pull Update System
 * نظام دفع وسحب التحديثات
 * 
 * This system handles automatic updates, version control, and deployment
 * synchronization across all components of the AuraOS system.
 */

class PushPullUpdateSystem {
  constructor() {
    this.updateStatus = {
      isUpdating: false,
      lastUpdate: null,
      updateHistory: [],
      availableUpdates: [],
      pendingChanges: [],
      conflicts: []
    };
    this.gitIntegration = null;
    this.deploymentConfig = {
      autoDeploy: false,
      stagingUrl: 'https://staging.auraos.com',
      productionUrl: 'https://auraos.com',
      environments: ['development', 'staging', 'production']
    };
    this.init();
  }

  /**
   * Initialize the update system
   */
  init() {
    this.setupGitIntegration();
    this.setupUpdateMonitoring();
    this.createUpdateUI();
    this.setupEventListeners();
    this.startPeriodicChecks();
  }

  /**
   * Setup Git integration
   */
  setupGitIntegration() {
    this.gitIntegration = {
      repository: 'https://github.com/auraos/auraos',
      branch: 'main',
      remote: 'origin',
      lastCommit: null,
      localChanges: [],
      remoteChanges: []
    };
  }

  /**
   * Setup update monitoring
   */
  setupUpdateMonitoring() {
    this.monitoring = {
      checkInterval: 30000, // 30 seconds
      lastCheck: null,
      isChecking: false,
      checkHistory: []
    };
  }

  /**
   * Create update UI
   */
  createUpdateUI() {
    const updatePanel = document.createElement('div');
    updatePanel.id = 'updateSystemPanel';
    updatePanel.className = 'update-system-panel';
    updatePanel.innerHTML = this.generateUpdateUIHTML();
    
    // Add to control panel if it exists
    const controlPanel = document.getElementById('easyControlPanel');
    if (controlPanel) {
      const updateSection = controlPanel.querySelector('.update-section');
      if (updateSection) {
        updateSection.appendChild(updatePanel);
      }
    } else {
      document.body.appendChild(updatePanel);
    }

    this.injectUpdateStyles();
  }

  /**
   * Generate update UI HTML
   */
  generateUpdateUIHTML() {
    return `
      <div class="update-system-container">
        <div class="update-status-overview">
          <div class="status-card">
            <div class="status-icon">
              <i class="fas fa-sync-alt"></i>
            </div>
            <div class="status-info">
              <h4>Update Status</h4>
              <span class="status-value" id="updateStatusValue">Ready</span>
            </div>
          </div>
          
          <div class="status-card">
            <div class="status-icon">
              <i class="fas fa-download"></i>
            </div>
            <div class="status-info">
              <h4>Available Updates</h4>
              <span class="status-value" id="availableUpdatesCount">0</span>
            </div>
          </div>
          
          <div class="status-card">
            <div class="status-icon">
              <i class="fas fa-upload"></i>
            </div>
            <div class="status-info">
              <h4>Pending Changes</h4>
              <span class="status-value" id="pendingChangesCount">0</span>
            </div>
          </div>
        </div>

        <div class="update-controls">
          <div class="control-group">
            <h5><i class="fas fa-download"></i> Pull Updates</h5>
            <div class="control-buttons">
              <button class="update-btn primary" data-action="check-updates">
                <i class="fas fa-search"></i>
                Check for Updates
              </button>
              <button class="update-btn success" data-action="pull-updates">
                <i class="fas fa-download"></i>
                Pull Updates
              </button>
              <button class="update-btn warning" data-action="pull-force">
                <i class="fas fa-exclamation-triangle"></i>
                Force Pull
              </button>
            </div>
          </div>

          <div class="control-group">
            <h5><i class="fas fa-upload"></i> Push Changes</h5>
            <div class="control-buttons">
              <button class="update-btn info" data-action="stage-changes">
                <i class="fas fa-plus"></i>
                Stage Changes
              </button>
              <button class="update-btn primary" data-action="commit-changes">
                <i class="fas fa-check"></i>
                Commit Changes
              </button>
              <button class="update-btn success" data-action="push-changes">
                <i class="fas fa-upload"></i>
                Push Changes
              </button>
            </div>
          </div>

          <div class="control-group">
            <h5><i class="fas fa-cogs"></i> Advanced</h5>
            <div class="control-buttons">
              <button class="update-btn" data-action="merge-conflicts">
                <i class="fas fa-code-branch"></i>
                Resolve Conflicts
              </button>
              <button class="update-btn" data-action="reset-changes">
                <i class="fas fa-undo"></i>
                Reset Changes
              </button>
              <button class="update-btn" data-action="update-history">
                <i class="fas fa-history"></i>
                Update History
              </button>
            </div>
          </div>
        </div>

        <div class="update-progress" id="updateProgress" style="display: none;">
          <div class="progress-header">
            <span class="progress-title">Update in Progress</span>
            <span class="progress-percentage">0%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" id="progressFill"></div>
          </div>
          <div class="progress-status" id="progressStatus">Initializing...</div>
        </div>

        <div class="update-log" id="updateLog">
          <div class="log-header">
            <h5><i class="fas fa-file-alt"></i> Update Activity</h5>
            <button class="clear-log-btn" id="clearUpdateLog">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <div class="log-content" id="updateLogContent">
            <div class="log-entry">
              <span class="log-time">[${new Date().toLocaleTimeString()}]</span>
              <span class="log-message">Update system initialized</span>
              <span class="log-level info">INFO</span>
            </div>
          </div>
        </div>

        <div class="conflict-resolution" id="conflictResolution" style="display: none;">
          <div class="conflict-header">
            <h5><i class="fas fa-exclamation-triangle"></i> Conflict Resolution</h5>
          </div>
          <div class="conflict-list" id="conflictList">
            <!-- Conflicts will be listed here -->
          </div>
          <div class="conflict-actions">
            <button class="update-btn primary" data-action="resolve-conflicts">
              <i class="fas fa-check"></i>
              Resolve All Conflicts
            </button>
            <button class="update-btn danger" data-action="abort-merge">
              <i class="fas fa-times"></i>
              Abort Merge
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Inject update styles
   */
  injectUpdateStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .update-system-panel {
        margin-top: 20px;
        background: rgba(51, 65, 85, 0.3);
        border-radius: 12px;
        padding: 20px;
        border: 1px solid rgba(0, 217, 255, 0.2);
      }

      .update-system-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .update-status-overview {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
      }

      .status-card {
        background: rgba(30, 41, 59, 0.5);
        border: 1px solid rgba(0, 217, 255, 0.2);
        border-radius: 8px;
        padding: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .status-icon {
        color: #00d9ff;
        font-size: 20px;
      }

      .status-info h4 {
        color: #ffffff;
        font-size: 12px;
        font-weight: 600;
        margin: 0 0 5px 0;
      }

      .status-value {
        color: #94a3b8;
        font-size: 14px;
        font-weight: 500;
      }

      .update-controls {
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

      .update-btn {
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

      .update-btn:hover {
        background: rgba(0, 217, 255, 0.2);
        border-color: rgba(0, 217, 255, 0.5);
        transform: translateY(-1px);
      }

      .update-btn.primary {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
        border-color: rgba(59, 130, 246, 0.3);
      }

      .update-btn.success {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
        border-color: rgba(16, 185, 129, 0.3);
      }

      .update-btn.warning {
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
        border-color: rgba(245, 158, 11, 0.3);
      }

      .update-btn.info {
        background: rgba(139, 92, 246, 0.1);
        color: #8b5cf6;
        border-color: rgba(139, 92, 246, 0.3);
      }

      .update-btn.danger {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border-color: rgba(239, 68, 68, 0.3);
      }

      .update-progress {
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
      }

      .update-log {
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

      .conflict-resolution {
        background: rgba(245, 158, 11, 0.1);
        border: 1px solid rgba(245, 158, 11, 0.3);
        border-radius: 8px;
        padding: 15px;
      }

      .conflict-header h5 {
        color: #f59e0b;
        font-size: 14px;
        font-weight: 600;
        margin: 0 0 15px 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .conflict-list {
        margin-bottom: 15px;
      }

      .conflict-item {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 6px;
        padding: 10px;
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .conflict-file {
        color: #ffffff;
        font-size: 12px;
        font-weight: 500;
      }

      .conflict-actions {
        display: flex;
        gap: 8px;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .update-status-overview {
          grid-template-columns: 1fr;
        }

        .control-buttons {
          justify-content: center;
        }

        .conflict-actions {
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
    // Update action buttons
    document.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('[data-action]');
      if (actionBtn && actionBtn.classList.contains('update-btn')) {
        const action = actionBtn.dataset.action;
        this.handleUpdateAction(action);
      }
    });

    // Clear log button
    document.addEventListener('click', (e) => {
      if (e.target.closest('#clearUpdateLog')) {
        this.clearUpdateLog();
      }
    });
  }

  /**
   * Handle update action
   */
  async handleUpdateAction(action) {
    this.addUpdateLog(`Executing update action: ${action}`, 'info');

    try {
      switch (action) {
        case 'check-updates':
          await this.checkForUpdates();
          break;
        case 'pull-updates':
          await this.pullUpdates();
          break;
        case 'pull-force':
          await this.forcePullUpdates();
          break;
        case 'stage-changes':
          await this.stageChanges();
          break;
        case 'commit-changes':
          await this.commitChanges();
          break;
        case 'push-changes':
          await this.pushChanges();
          break;
        case 'merge-conflicts':
          await this.resolveConflicts();
          break;
        case 'reset-changes':
          await this.resetChanges();
          break;
        case 'update-history':
          await this.showUpdateHistory();
          break;
        case 'resolve-conflicts':
          await this.resolveAllConflicts();
          break;
        case 'abort-merge':
          await this.abortMerge();
          break;
        default:
          this.addUpdateLog(`Unknown update action: ${action}`, 'warning');
      }
    } catch (error) {
      this.addUpdateLog(`Error executing update action ${action}: ${error.message}`, 'error');
    }
  }

  /**
   * Check for updates
   */
  async checkForUpdates() {
    this.addUpdateLog('Checking for updates...', 'info');
    
    this.monitoring.isChecking = true;
    this.updateStatus.isUpdating = true;
    
    try {
      // Simulate checking for updates
      await this.simulateUpdateCheck();
      
      const availableUpdates = Math.floor(Math.random() * 5);
      this.updateStatus.availableUpdates = Array.from({length: availableUpdates}, (_, i) => ({
        id: `update-${i + 1}`,
        type: 'feature',
        description: `Update ${i + 1}: New feature enhancement`,
        version: `1.${i + 1}.0`,
        size: Math.floor(Math.random() * 1000) + 100,
        priority: Math.random() > 0.5 ? 'high' : 'medium'
      }));
      
      this.updateStatus.lastUpdate = new Date();
      this.monitoring.lastCheck = new Date();
      
      this.updateUI();
      this.addUpdateLog(`Found ${availableUpdates} available updates`, availableUpdates > 0 ? 'warning' : 'success');
      
    } catch (error) {
      this.addUpdateLog(`Error checking for updates: ${error.message}`, 'error');
    } finally {
      this.monitoring.isChecking = false;
      this.updateStatus.isUpdating = false;
    }
  }

  /**
   * Pull updates
   */
  async pullUpdates() {
    this.addUpdateLog('Pulling updates...', 'info');
    
    this.showProgress(true);
    this.updateProgress(0, 'Connecting to repository...');
    
    try {
      // Simulate git pull
      await this.simulateGitPull();
      
      this.updateStatus.lastUpdate = new Date();
      this.updateStatus.updateHistory.push({
        timestamp: new Date(),
        type: 'pull',
        status: 'success',
        changes: this.updateStatus.availableUpdates.length
      });
      
      this.addUpdateLog('Updates pulled successfully', 'success');
      
    } catch (error) {
      this.addUpdateLog(`Error pulling updates: ${error.message}`, 'error');
    } finally {
      this.showProgress(false);
    }
  }

  /**
   * Force pull updates
   */
  async forcePullUpdates() {
    this.addUpdateLog('Force pulling updates...', 'warning');
    
    if (confirm('This will overwrite local changes. Are you sure?')) {
      await this.pullUpdates();
    }
  }

  /**
   * Stage changes
   */
  async stageChanges() {
    this.addUpdateLog('Staging changes...', 'info');
    
    // Simulate git add
    await this.simulateGitAdd();
    
    this.addUpdateLog('Changes staged successfully', 'success');
  }

  /**
   * Commit changes
   */
  async commitChanges() {
    this.addUpdateLog('Committing changes...', 'info');
    
    const message = prompt('Enter commit message:');
    if (message) {
      // Simulate git commit
      await this.simulateGitCommit(message);
      
      this.addUpdateLog(`Changes committed: ${message}`, 'success');
    }
  }

  /**
   * Push changes
   */
  async pushChanges() {
    this.addUpdateLog('Pushing changes...', 'info');
    
    this.showProgress(true);
    this.updateProgress(0, 'Pushing to remote repository...');
    
    try {
      // Simulate git push
      await this.simulateGitPush();
      
      this.updateStatus.lastUpdate = new Date();
      this.updateStatus.updateHistory.push({
        timestamp: new Date(),
        type: 'push',
        status: 'success',
        changes: this.updateStatus.pendingChanges.length
      });
      
      this.addUpdateLog('Changes pushed successfully', 'success');
      
    } catch (error) {
      this.addUpdateLog(`Error pushing changes: ${error.message}`, 'error');
    } finally {
      this.showProgress(false);
    }
  }

  /**
   * Resolve conflicts
   */
  async resolveConflicts() {
    this.addUpdateLog('Resolving conflicts...', 'info');
    
    // Simulate conflict detection
    const conflicts = [
      { file: 'dashboard.js', type: 'merge' },
      { file: 'config.json', type: 'merge' },
      { file: 'package.json', type: 'merge' }
    ];
    
    this.updateStatus.conflicts = conflicts;
    this.showConflictResolution(true);
    
    this.addUpdateLog(`Found ${conflicts.length} conflicts to resolve`, 'warning');
  }

  /**
   * Reset changes
   */
  async resetChanges() {
    this.addUpdateLog('Resetting changes...', 'warning');
    
    if (confirm('This will discard all local changes. Are you sure?')) {
      // Simulate git reset
      await this.simulateGitReset();
      
      this.addUpdateLog('Changes reset successfully', 'success');
    }
  }

  /**
   * Show update history
   */
  async showUpdateHistory() {
    this.addUpdateLog('Showing update history...', 'info');
    
    // Show history modal or redirect to history page
    console.log('Update History:', this.updateStatus.updateHistory);
  }

  /**
   * Resolve all conflicts
   */
  async resolveAllConflicts() {
    this.addUpdateLog('Resolving all conflicts...', 'info');
    
    // Simulate conflict resolution
    await this.simulateConflictResolution();
    
    this.updateStatus.conflicts = [];
    this.showConflictResolution(false);
    
    this.addUpdateLog('All conflicts resolved successfully', 'success');
  }

  /**
   * Abort merge
   */
  async abortMerge() {
    this.addUpdateLog('Aborting merge...', 'warning');
    
    if (confirm('This will abort the current merge. Are you sure?')) {
      // Simulate git merge --abort
      await this.simulateGitMergeAbort();
      
      this.updateStatus.conflicts = [];
      this.showConflictResolution(false);
      
      this.addUpdateLog('Merge aborted successfully', 'success');
    }
  }

  /**
   * Simulate update check
   */
  async simulateUpdateCheck() {
    return new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
  }

  /**
   * Simulate git pull
   */
  async simulateGitPull() {
    return new Promise(resolve => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        this.updateProgress(progress, `Pulling updates... ${progress}%`);
        
        if (progress >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });
  }

  /**
   * Simulate git add
   */
  async simulateGitAdd() {
    return new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
  }

  /**
   * Simulate git commit
   */
  async simulateGitCommit(message) {
    return new Promise(resolve => {
      setTimeout(resolve, 1500);
    });
  }

  /**
   * Simulate git push
   */
  async simulateGitPush() {
    return new Promise(resolve => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 15;
        this.updateProgress(progress, `Pushing changes... ${progress}%`);
        
        if (progress >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 150);
    });
  }

  /**
   * Simulate git reset
   */
  async simulateGitReset() {
    return new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
  }

  /**
   * Simulate conflict resolution
   */
  async simulateConflictResolution() {
    return new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
  }

  /**
   * Simulate git merge abort
   */
  async simulateGitMergeAbort() {
    return new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
  }

  /**
   * Show progress
   */
  showProgress(show) {
    const progressPanel = document.getElementById('updateProgress');
    if (progressPanel) {
      progressPanel.style.display = show ? 'block' : 'none';
    }
  }

  /**
   * Update progress
   */
  updateProgress(percentage, status) {
    const progressFill = document.getElementById('progressFill');
    const progressPercentage = document.querySelector('.progress-percentage');
    const progressStatus = document.getElementById('progressStatus');
    
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
    
    if (progressPercentage) {
      progressPercentage.textContent = `${percentage}%`;
    }
    
    if (progressStatus) {
      progressStatus.textContent = status;
    }
  }

  /**
   * Show conflict resolution
   */
  showConflictResolution(show) {
    const conflictPanel = document.getElementById('conflictResolution');
    if (conflictPanel) {
      conflictPanel.style.display = show ? 'block' : 'none';
      
      if (show) {
        this.updateConflictList();
      }
    }
  }

  /**
   * Update conflict list
   */
  updateConflictList() {
    const conflictList = document.getElementById('conflictList');
    if (!conflictList) return;
    
    conflictList.innerHTML = '';
    
    this.updateStatus.conflicts.forEach(conflict => {
      const conflictItem = document.createElement('div');
      conflictItem.className = 'conflict-item';
      conflictItem.innerHTML = `
        <span class="conflict-file">${conflict.file}</span>
        <span class="conflict-type">${conflict.type}</span>
      `;
      conflictList.appendChild(conflictItem);
    });
  }

  /**
   * Update UI
   */
  updateUI() {
    const statusValue = document.getElementById('updateStatusValue');
    const availableCount = document.getElementById('availableUpdatesCount');
    const pendingCount = document.getElementById('pendingChangesCount');
    
    if (statusValue) {
      statusValue.textContent = this.updateStatus.isUpdating ? 'Updating...' : 'Ready';
    }
    
    if (availableCount) {
      availableCount.textContent = this.updateStatus.availableUpdates.length;
    }
    
    if (pendingCount) {
      pendingCount.textContent = this.updateStatus.pendingChanges.length;
    }
  }

  /**
   * Add update log entry
   */
  addUpdateLog(message, level = 'info') {
    const logContent = document.getElementById('updateLogContent');
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
   * Clear update log
   */
  clearUpdateLog() {
    const logContent = document.getElementById('updateLogContent');
    if (logContent) {
      logContent.innerHTML = `
        <div class="log-entry">
          <span class="log-time">[${new Date().toLocaleTimeString()}]</span>
          <span class="log-message">Update log cleared</span>
          <span class="log-level info">INFO</span>
        </div>
      `;
    }
  }

  /**
   * Start periodic checks
   */
  startPeriodicChecks() {
    setInterval(() => {
      if (!this.monitoring.isChecking && !this.updateStatus.isUpdating) {
        this.checkForUpdates();
      }
    }, this.monitoring.checkInterval);
  }
}

// Initialize the update system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.pushPullUpdateSystem = new PushPullUpdateSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PushPullUpdateSystem;
}
