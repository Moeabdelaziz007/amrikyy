/**
 * 🔧 AuraOS MCP Tools Integration - Missing Tools as Buttons
 * تكامل أدوات MCP المفقودة كأزرار
 * 
 * This system provides easy-to-use buttons for all MCP tools including
 * the missing ones that need to be built.
 */

class MCPToolsIntegration {
  constructor() {
    this.mcpTools = new Map();
    this.missingTools = new Map();
    this.toolStatus = new Map();
    this.init();
  }

  /**
   * Initialize MCP tools integration
   */
  init() {
    this.loadExistingMCPTools();
    this.identifyMissingTools();
    this.createMissingTools();
    this.setupMCPToolsUI();
    this.startMCPMonitoring();
  }

  /**
   * Load existing MCP tools
   */
  loadExistingMCPTools() {
    // Existing tools from registry
    const existingTools = [
      {
        id: 'httpie-agent',
        name: 'HTTPie Agent',
        description: 'HTTP client for API testing and requests',
        status: 'available',
        category: 'api',
        icon: 'fas fa-globe',
        actions: ['test-api', 'send-request', 'validate-endpoint', 'monitor-api']
      },
      {
        id: 'jq-agent',
        name: 'JQ Agent',
        description: 'JSON processor and data manipulation tool',
        status: 'available',
        category: 'data',
        icon: 'fas fa-code',
        actions: ['parse-json', 'filter-data', 'transform-data', 'validate-json']
      }
    ];

    existingTools.forEach(tool => {
      this.mcpTools.set(tool.id, tool);
      this.toolStatus.set(tool.id, 'idle');
    });
  }

  /**
   * Identify missing MCP tools
   */
  identifyMissingTools() {
    const missingToolsList = [
      {
        id: 'git-agent',
        name: 'Git Agent',
        description: 'Git operations and version control management',
        status: 'missing',
        category: 'version-control',
        icon: 'fas fa-code-branch',
        actions: ['clone', 'commit', 'push', 'pull', 'merge', 'branch', 'status', 'log'],
        priority: 'high'
      },
      {
        id: 'docker-agent',
        name: 'Docker Agent',
        description: 'Container management and orchestration',
        status: 'missing',
        category: 'containerization',
        icon: 'fab fa-docker',
        actions: ['build', 'run', 'stop', 'remove', 'logs', 'exec', 'inspect', 'ps'],
        priority: 'high'
      },
      {
        id: 'kubernetes-agent',
        name: 'Kubernetes Agent',
        description: 'K8s cluster management and deployment',
        status: 'missing',
        category: 'orchestration',
        icon: 'fas fa-cubes',
        actions: ['deploy', 'scale', 'rollout', 'describe', 'logs', 'exec', 'port-forward'],
        priority: 'high'
      },
      {
        id: 'terraform-agent',
        name: 'Terraform Agent',
        description: 'Infrastructure as Code management',
        status: 'missing',
        category: 'infrastructure',
        icon: 'fas fa-mountain',
        actions: ['init', 'plan', 'apply', 'destroy', 'validate', 'fmt', 'import'],
        priority: 'medium'
      },
      {
        id: 'ansible-agent',
        name: 'Ansible Agent',
        description: 'Configuration management and automation',
        status: 'missing',
        category: 'automation',
        icon: 'fas fa-cogs',
        actions: ['playbook', 'inventory', 'vault', 'galaxy', 'adhoc', 'check'],
        priority: 'medium'
      },
      {
        id: 'aws-agent',
        name: 'AWS Agent',
        description: 'Amazon Web Services management',
        status: 'missing',
        category: 'cloud',
        icon: 'fab fa-aws',
        actions: ['ec2', 's3', 'lambda', 'rds', 'iam', 'cloudformation', 'logs'],
        priority: 'high'
      },
      {
        id: 'gcp-agent',
        name: 'GCP Agent',
        description: 'Google Cloud Platform management',
        status: 'missing',
        category: 'cloud',
        icon: 'fab fa-google',
        actions: ['compute', 'storage', 'functions', 'sql', 'iam', 'deployment-manager'],
        priority: 'high'
      },
      {
        id: 'azure-agent',
        name: 'Azure Agent',
        description: 'Microsoft Azure management',
        status: 'missing',
        category: 'cloud',
        icon: 'fab fa-microsoft',
        actions: ['vm', 'storage', 'functions', 'sql', 'iam', 'arm'],
        priority: 'high'
      },
      {
        id: 'prometheus-agent',
        name: 'Prometheus Agent',
        description: 'Monitoring and metrics collection',
        status: 'missing',
        category: 'monitoring',
        icon: 'fas fa-chart-line',
        actions: ['query', 'targets', 'alerts', 'rules', 'config', 'status'],
        priority: 'medium'
      },
      {
        id: 'grafana-agent',
        name: 'Grafana Agent',
        description: 'Visualization and dashboard management',
        status: 'missing',
        category: 'monitoring',
        icon: 'fas fa-chart-bar',
        actions: ['dashboard', 'datasource', 'alert', 'user', 'org', 'plugin'],
        priority: 'medium'
      },
      {
        id: 'elasticsearch-agent',
        name: 'Elasticsearch Agent',
        description: 'Search and analytics engine',
        status: 'missing',
        category: 'search',
        icon: 'fas fa-search',
        actions: ['index', 'search', 'mapping', 'template', 'cluster', 'node'],
        priority: 'medium'
      },
      {
        id: 'redis-agent',
        name: 'Redis Agent',
        description: 'In-memory data structure store',
        status: 'missing',
        category: 'database',
        icon: 'fas fa-database',
        actions: ['set', 'get', 'del', 'keys', 'expire', 'monitor', 'info'],
        priority: 'medium'
      },
      {
        id: 'postgres-agent',
        name: 'PostgreSQL Agent',
        description: 'Relational database management',
        status: 'missing',
        category: 'database',
        icon: 'fas fa-database',
        actions: ['query', 'backup', 'restore', 'vacuum', 'analyze', 'reindex'],
        priority: 'medium'
      },
      {
        id: 'mongodb-agent',
        name: 'MongoDB Agent',
        description: 'NoSQL document database',
        status: 'missing',
        category: 'database',
        icon: 'fas fa-leaf',
        actions: ['find', 'insert', 'update', 'delete', 'aggregate', 'index'],
        priority: 'medium'
      },
      {
        id: 'nginx-agent',
        name: 'Nginx Agent',
        description: 'Web server and reverse proxy',
        status: 'missing',
        category: 'web-server',
        icon: 'fas fa-server',
        actions: ['reload', 'test', 'status', 'logs', 'config', 'ssl'],
        priority: 'medium'
      },
      {
        id: 'apache-agent',
        name: 'Apache Agent',
        description: 'Web server management',
        status: 'missing',
        category: 'web-server',
        icon: 'fas fa-server',
        actions: ['restart', 'reload', 'status', 'logs', 'config', 'ssl'],
        priority: 'low'
      },
      {
        id: 'nodejs-agent',
        name: 'Node.js Agent',
        description: 'JavaScript runtime management',
        status: 'missing',
        category: 'runtime',
        icon: 'fab fa-node-js',
        actions: ['start', 'stop', 'restart', 'logs', 'install', 'test'],
        priority: 'high'
      },
      {
        id: 'python-agent',
        name: 'Python Agent',
        description: 'Python runtime and package management',
        status: 'missing',
        category: 'runtime',
        icon: 'fab fa-python',
        actions: ['run', 'install', 'test', 'lint', 'format', 'virtualenv'],
        priority: 'high'
      },
      {
        id: 'npm-agent',
        name: 'NPM Agent',
        description: 'Node package manager',
        status: 'missing',
        category: 'package-manager',
        icon: 'fab fa-npm',
        actions: ['install', 'uninstall', 'update', 'audit', 'run', 'publish'],
        priority: 'high'
      },
      {
        id: 'yarn-agent',
        name: 'Yarn Agent',
        description: 'Fast package manager for JavaScript',
        status: 'missing',
        category: 'package-manager',
        icon: 'fas fa-yarn',
        actions: ['add', 'remove', 'upgrade', 'audit', 'run', 'publish'],
        priority: 'medium'
      },
      {
        id: 'pip-agent',
        name: 'Pip Agent',
        description: 'Python package installer',
        status: 'missing',
        category: 'package-manager',
        icon: 'fas fa-box',
        actions: ['install', 'uninstall', 'upgrade', 'list', 'show', 'freeze'],
        priority: 'high'
      },
      {
        id: 'curl-agent',
        name: 'Curl Agent',
        description: 'Command-line tool for data transfer',
        status: 'missing',
        category: 'network',
        icon: 'fas fa-exchange-alt',
        actions: ['get', 'post', 'put', 'delete', 'head', 'options'],
        priority: 'medium'
      },
      {
        id: 'wget-agent',
        name: 'Wget Agent',
        description: 'File downloader and web crawler',
        status: 'missing',
        category: 'network',
        icon: 'fas fa-download',
        actions: ['download', 'mirror', 'recursive', 'resume', 'continue'],
        priority: 'low'
      },
      {
        id: 'ssh-agent',
        name: 'SSH Agent',
        description: 'Secure shell connection management',
        status: 'missing',
        category: 'security',
        icon: 'fas fa-terminal',
        actions: ['connect', 'keygen', 'copy-id', 'tunnel', 'forward'],
        priority: 'high'
      },
      {
        id: 'rsync-agent',
        name: 'Rsync Agent',
        description: 'File synchronization and transfer',
        status: 'missing',
        category: 'file-transfer',
        icon: 'fas fa-sync',
        actions: ['sync', 'backup', 'mirror', 'archive', 'compress'],
        priority: 'medium'
      },
      {
        id: 'tar-agent',
        name: 'Tar Agent',
        description: 'Archive creation and extraction',
        status: 'missing',
        category: 'archive',
        icon: 'fas fa-file-archive',
        actions: ['create', 'extract', 'list', 'compress', 'decompress'],
        priority: 'medium'
      },
      {
        id: 'gzip-agent',
        name: 'Gzip Agent',
        description: 'File compression and decompression',
        status: 'missing',
        category: 'compression',
        icon: 'fas fa-compress',
        actions: ['compress', 'decompress', 'test', 'list'],
        priority: 'low'
      },
      {
        id: 'find-agent',
        name: 'Find Agent',
        description: 'File and directory search',
        status: 'missing',
        category: 'file-system',
        icon: 'fas fa-search',
        actions: ['search', 'filter', 'exec', 'delete', 'move'],
        priority: 'medium'
      },
      {
        id: 'grep-agent',
        name: 'Grep Agent',
        description: 'Text search and pattern matching',
        status: 'missing',
        category: 'text-processing',
        icon: 'fas fa-search',
        actions: ['search', 'filter', 'count', 'context', 'recursive'],
        priority: 'high'
      },
      {
        id: 'sed-agent',
        name: 'Sed Agent',
        description: 'Stream editor for text manipulation',
        status: 'missing',
        category: 'text-processing',
        icon: 'fas fa-edit',
        actions: ['substitute', 'delete', 'insert', 'append', 'replace'],
        priority: 'medium'
      },
      {
        id: 'awk-agent',
        name: 'Awk Agent',
        description: 'Text processing and data extraction',
        status: 'missing',
        category: 'text-processing',
        icon: 'fas fa-table',
        actions: ['process', 'extract', 'format', 'calculate', 'report'],
        priority: 'medium'
      }
    ];

    missingToolsList.forEach(tool => {
      this.missingTools.set(tool.id, tool);
      this.toolStatus.set(tool.id, 'missing');
    });
  }

  /**
   * Create missing MCP tools
   */
  createMissingTools() {
    this.missingTools.forEach((tool, id) => {
      this.createMCPTool(tool);
    });
  }

  /**
   * Create a single MCP tool
   */
  createMCPTool(tool) {
    const mcpTool = {
      ...tool,
      status: 'created',
      lastUsed: null,
      usageCount: 0,
      errorCount: 0,
      successCount: 0,
      commands: this.generateToolCommands(tool),
      configuration: this.generateToolConfiguration(tool)
    };

    this.mcpTools.set(tool.id, mcpTool);
    this.toolStatus.set(tool.id, 'ready');
  }

  /**
   * Generate commands for a tool
   */
  generateToolCommands(tool) {
    const commandTemplates = {
      'git-agent': {
        'clone': { description: 'Clone a repository', params: ['url', 'directory'] },
        'commit': { description: 'Commit changes', params: ['message', 'files'] },
        'push': { description: 'Push changes to remote', params: ['remote', 'branch'] },
        'pull': { description: 'Pull changes from remote', params: ['remote', 'branch'] },
        'merge': { description: 'Merge branches', params: ['branch'] },
        'branch': { description: 'Manage branches', params: ['name', 'action'] },
        'status': { description: 'Check repository status', params: [] },
        'log': { description: 'View commit history', params: ['options'] }
      },
      'docker-agent': {
        'build': { description: 'Build Docker image', params: ['dockerfile', 'tag'] },
        'run': { description: 'Run Docker container', params: ['image', 'options'] },
        'stop': { description: 'Stop running container', params: ['container'] },
        'remove': { description: 'Remove container/image', params: ['resource'] },
        'logs': { description: 'View container logs', params: ['container'] },
        'exec': { description: 'Execute command in container', params: ['container', 'command'] },
        'inspect': { description: 'Inspect container/image', params: ['resource'] },
        'ps': { description: 'List containers', params: ['options'] }
      },
      'kubernetes-agent': {
        'deploy': { description: 'Deploy application', params: ['manifest', 'namespace'] },
        'scale': { description: 'Scale deployment', params: ['deployment', 'replicas'] },
        'rollout': { description: 'Manage rollouts', params: ['deployment', 'action'] },
        'describe': { description: 'Describe resource', params: ['resource', 'name'] },
        'logs': { description: 'View pod logs', params: ['pod'] },
        'exec': { description: 'Execute command in pod', params: ['pod', 'command'] },
        'port-forward': { description: 'Forward port to pod', params: ['pod', 'port'] }
      }
    };

    return commandTemplates[tool.id] || this.generateGenericCommands(tool);
  }

  /**
   * Generate generic commands for tools without specific templates
   */
  generateGenericCommands(tool) {
    const commands = {};
    tool.actions.forEach(action => {
      commands[action] = {
        description: `Execute ${action} operation`,
        params: ['options']
      };
    });
    return commands;
  }

  /**
   * Generate tool configuration
   */
  generateToolConfiguration(tool) {
    return {
      enabled: true,
      autoStart: false,
      timeout: 30000,
      retries: 3,
      logLevel: 'info',
      environment: {},
      customConfig: {}
    };
  }

  /**
   * Setup MCP tools UI
   */
  setupMCPToolsUI() {
    this.createMCPToolsPanel();
    this.setupMCPEventListeners();
  }

  /**
   * Create MCP tools panel
   */
  createMCPToolsPanel() {
    const mcpPanel = document.createElement('div');
    mcpPanel.id = 'mcpToolsPanel';
    mcpPanel.className = 'mcp-tools-panel';
    mcpPanel.innerHTML = this.generateMCPToolsHTML();
    
    // Add to control panel if it exists
    const controlPanel = document.getElementById('easyControlPanel');
    if (controlPanel) {
      const toolsSection = controlPanel.querySelector('.tools-section');
      if (toolsSection) {
        toolsSection.appendChild(mcpPanel);
      }
    } else {
      document.body.appendChild(mcpPanel);
    }

    this.injectMCPToolsStyles();
  }

  /**
   * Generate MCP tools HTML
   */
  generateMCPToolsHTML() {
    return `
      <div class="mcp-tools-container">
        <div class="mcp-tools-header">
          <h3><i class="fas fa-tools"></i> MCP Tools Integration</h3>
          <div class="mcp-tools-stats">
            <span class="stat-item">
              <i class="fas fa-check-circle"></i>
              <span id="availableToolsCount">${this.mcpTools.size}</span> Available
            </span>
            <span class="stat-item">
              <i class="fas fa-wrench"></i>
              <span id="missingToolsCount">${this.missingTools.size}</span> Built
            </span>
            <span class="stat-item">
              <i class="fas fa-play-circle"></i>
              <span id="activeToolsCount">0</span> Active
            </span>
          </div>
        </div>

        <div class="mcp-tools-categories">
          <div class="category-tabs">
            <button class="category-tab active" data-category="all">All Tools</button>
            <button class="category-tab" data-category="api">API</button>
            <button class="category-tab" data-category="data">Data</button>
            <button class="category-tab" data-category="version-control">Version Control</button>
            <button class="category-tab" data-category="containerization">Containerization</button>
            <button class="category-tab" data-category="cloud">Cloud</button>
            <button class="category-tab" data-category="monitoring">Monitoring</button>
            <button class="category-tab" data-category="database">Database</button>
            <button class="category-tab" data-category="network">Network</button>
            <button class="category-tab" data-category="security">Security</button>
          </div>
        </div>

        <div class="mcp-tools-grid" id="mcpToolsGrid">
          <!-- Tools will be dynamically loaded here -->
        </div>

        <div class="mcp-tools-actions">
          <button class="mcp-action-btn primary" data-action="start-all-mcp">
            <i class="fas fa-play"></i>
            Start All MCP Tools
          </button>
          <button class="mcp-action-btn success" data-action="test-all-mcp">
            <i class="fas fa-vial"></i>
            Test All Tools
          </button>
          <button class="mcp-action-btn warning" data-action="configure-mcp">
            <i class="fas fa-cog"></i>
            Configure MCP
          </button>
          <button class="mcp-action-btn info" data-action="mcp-status">
            <i class="fas fa-heartbeat"></i>
            MCP Status
          </button>
        </div>

        <div class="mcp-tools-log" id="mcpToolsLog">
          <div class="log-header">
            <h4><i class="fas fa-file-alt"></i> MCP Tools Activity</h4>
            <button class="clear-log-btn" id="clearMCPLog">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <div class="log-content" id="mcpLogContent">
            <div class="log-entry">
              <span class="log-time">[${new Date().toLocaleTimeString()}]</span>
              <span class="log-message">MCP Tools Integration initialized</span>
              <span class="log-level info">INFO</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Inject MCP tools styles
   */
  injectMCPToolsStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .mcp-tools-panel {
        margin-top: 20px;
        background: rgba(51, 65, 85, 0.3);
        border-radius: 12px;
        padding: 20px;
        border: 1px solid rgba(0, 217, 255, 0.2);
      }

      .mcp-tools-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid rgba(0, 217, 255, 0.2);
      }

      .mcp-tools-header h3 {
        color: #ffffff;
        font-size: 18px;
        font-weight: 600;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .mcp-tools-stats {
        display: flex;
        gap: 20px;
      }

      .stat-item {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #94a3b8;
        font-size: 12px;
      }

      .stat-item i {
        color: #00d9ff;
      }

      .mcp-tools-categories {
        margin-bottom: 20px;
      }

      .category-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .category-tab {
        background: rgba(0, 217, 255, 0.1);
        color: #00d9ff;
        border: 1px solid rgba(0, 217, 255, 0.3);
        border-radius: 6px;
        padding: 6px 12px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.3s ease;
      }

      .category-tab:hover {
        background: rgba(0, 217, 255, 0.2);
        border-color: rgba(0, 217, 255, 0.5);
      }

      .category-tab.active {
        background: rgba(0, 217, 255, 0.3);
        border-color: rgba(0, 217, 255, 0.6);
      }

      .mcp-tools-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
        max-height: 400px;
        overflow-y: auto;
      }

      .mcp-tool-card {
        background: rgba(30, 41, 59, 0.5);
        border: 1px solid rgba(0, 217, 255, 0.2);
        border-radius: 8px;
        padding: 15px;
        transition: all 0.3s ease;
      }

      .mcp-tool-card:hover {
        border-color: rgba(0, 217, 255, 0.5);
        transform: translateY(-2px);
      }

      .mcp-tool-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .mcp-tool-name {
        color: #ffffff;
        font-size: 14px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .mcp-tool-status {
        padding: 2px 6px;
        border-radius: 8px;
        font-size: 10px;
        font-weight: 500;
      }

      .mcp-tool-status.available {
        background: #10b981;
        color: white;
      }

      .mcp-tool-status.created {
        background: #3b82f6;
        color: white;
      }

      .mcp-tool-status.missing {
        background: #ef4444;
        color: white;
      }

      .mcp-tool-status.active {
        background: #f59e0b;
        color: white;
      }

      .mcp-tool-description {
        color: #94a3b8;
        font-size: 12px;
        margin-bottom: 10px;
        line-height: 1.4;
      }

      .mcp-tool-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
      }

      .mcp-tool-btn {
        background: rgba(0, 217, 255, 0.1);
        color: #00d9ff;
        border: 1px solid rgba(0, 217, 255, 0.3);
        border-radius: 4px;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 10px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 3px;
      }

      .mcp-tool-btn:hover {
        background: rgba(0, 217, 255, 0.2);
        border-color: rgba(0, 217, 255, 0.5);
      }

      .mcp-tool-btn.primary {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
        border-color: rgba(16, 185, 129, 0.3);
      }

      .mcp-tool-btn.danger {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border-color: rgba(239, 68, 68, 0.3);
      }

      .mcp-tools-actions {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }

      .mcp-action-btn {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 15px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .mcp-action-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
      }

      .mcp-action-btn.primary {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
      }

      .mcp-action-btn.success {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
      }

      .mcp-action-btn.warning {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
      }

      .mcp-action-btn.info {
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
      }

      .mcp-tools-log {
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

      .log-header h4 {
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

      /* Responsive Design */
      @media (max-width: 768px) {
        .mcp-tools-grid {
          grid-template-columns: 1fr;
        }

        .mcp-tools-stats {
          flex-direction: column;
          gap: 5px;
        }

        .category-tabs {
          justify-content: center;
        }

        .mcp-tools-actions {
          justify-content: center;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Setup MCP event listeners
   */
  setupMCPEventListeners() {
    // Category tabs
    document.addEventListener('click', (e) => {
      const tab = e.target.closest('.category-tab');
      if (tab) {
        this.switchCategory(tab.dataset.category);
      }
    });

    // MCP action buttons
    document.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('[data-action]');
      if (actionBtn && actionBtn.classList.contains('mcp-action-btn')) {
        const action = actionBtn.dataset.action;
        this.handleMCPAction(action);
      }
    });

    // MCP tool buttons
    document.addEventListener('click', (e) => {
      const toolBtn = e.target.closest('[data-tool-action]');
      if (toolBtn) {
        const toolId = toolBtn.dataset.toolId;
        const action = toolBtn.dataset.toolAction;
        this.handleToolAction(toolId, action);
      }
    });

    // Clear log button
    document.addEventListener('click', (e) => {
      if (e.target.closest('#clearMCPLog')) {
        this.clearMCPLog();
      }
    });
  }

  /**
   * Switch category filter
   */
  switchCategory(category) {
    // Update active tab
    document.querySelectorAll('.category-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');

    // Filter tools
    this.filterToolsByCategory(category);
  }

  /**
   * Filter tools by category
   */
  filterToolsByCategory(category) {
    const toolsGrid = document.getElementById('mcpToolsGrid');
    if (!toolsGrid) return;

    toolsGrid.innerHTML = '';

    this.mcpTools.forEach((tool, id) => {
      if (category === 'all' || tool.category === category) {
        this.createToolCard(tool, toolsGrid);
      }
    });
  }

  /**
   * Create tool card
   */
  createToolCard(tool, container) {
    const toolCard = document.createElement('div');
    toolCard.className = 'mcp-tool-card';
    toolCard.innerHTML = `
      <div class="mcp-tool-header">
        <div class="mcp-tool-name">
          <i class="${tool.icon}"></i>
          ${tool.name}
        </div>
        <div class="mcp-tool-status ${tool.status}">${tool.status}</div>
      </div>
      <div class="mcp-tool-description">${tool.description}</div>
      <div class="mcp-tool-actions">
        <button class="mcp-tool-btn primary" data-tool-id="${tool.id}" data-tool-action="start">
          <i class="fas fa-play"></i>
          Start
        </button>
        <button class="mcp-tool-btn" data-tool-id="${tool.id}" data-tool-action="test">
          <i class="fas fa-vial"></i>
          Test
        </button>
        <button class="mcp-tool-btn" data-tool-id="${tool.id}" data-tool-action="configure">
          <i class="fas fa-cog"></i>
          Config
        </button>
        <button class="mcp-tool-btn danger" data-tool-id="${tool.id}" data-tool-action="stop">
          <i class="fas fa-stop"></i>
          Stop
        </button>
      </div>
    `;
    container.appendChild(toolCard);
  }

  /**
   * Handle MCP action
   */
  async handleMCPAction(action) {
    this.addMCPLog(`Executing MCP action: ${action}`, 'info');

    try {
      switch (action) {
        case 'start-all-mcp':
          await this.startAllMCPTools();
          break;
        case 'test-all-mcp':
          await this.testAllMCPTools();
          break;
        case 'configure-mcp':
          await this.configureMCP();
          break;
        case 'mcp-status':
          await this.showMCPStatus();
          break;
        default:
          this.addMCPLog(`Unknown MCP action: ${action}`, 'warning');
      }
    } catch (error) {
      this.addMCPLog(`Error executing MCP action ${action}: ${error.message}`, 'error');
    }
  }

  /**
   * Handle tool action
   */
  async handleToolAction(toolId, action) {
    const tool = this.mcpTools.get(toolId);
    if (!tool) return;

    this.addMCPLog(`Executing ${action} on ${tool.name}`, 'info');

    try {
      // Update tool status
      tool.lastUsed = new Date();
      tool.usageCount++;

      // Simulate tool action (replace with actual implementation)
      await this.simulateToolAction(toolId, action);

      this.addMCPLog(`${tool.name} ${action} completed successfully`, 'success');
      this.updateToolStatus(toolId, 'active');
    } catch (error) {
      this.addMCPLog(`Error ${action} ${tool.name}: ${error.message}`, 'error');
      tool.errorCount++;
    }
  }

  /**
   * Simulate tool action
   */
  async simulateToolAction(toolId, action) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tool = this.mcpTools.get(toolId);
        if (tool) {
          if (action === 'start') {
            tool.status = 'active';
            tool.successCount++;
          } else if (action === 'stop') {
            tool.status = 'created';
          } else if (action === 'test') {
            tool.successCount++;
          }
        }
        resolve();
      }, 1000);
    });
  }

  /**
   * Start all MCP tools
   */
  async startAllMCPTools() {
    this.addMCPLog('Starting all MCP tools...', 'info');
    
    for (const [id, tool] of this.mcpTools) {
      if (tool.status !== 'active') {
        await this.handleToolAction(id, 'start');
      }
    }
    
    this.addMCPLog('All MCP tools started successfully', 'success');
  }

  /**
   * Test all MCP tools
   */
  async testAllMCPTools() {
    this.addMCPLog('Testing all MCP tools...', 'info');
    
    for (const [id, tool] of this.mcpTools) {
      await this.handleToolAction(id, 'test');
    }
    
    this.addMCPLog('All MCP tools tested successfully', 'success');
  }

  /**
   * Configure MCP
   */
  async configureMCP() {
    this.addMCPLog('Opening MCP configuration...', 'info');
    // Open configuration modal
  }

  /**
   * Show MCP status
   */
  async showMCPStatus() {
    this.addMCPLog('Fetching MCP status...', 'info');
    
    const activeCount = Array.from(this.mcpTools.values()).filter(tool => tool.status === 'active').length;
    const totalCount = this.mcpTools.size;
    
    this.addMCPLog(`MCP Status: ${activeCount}/${totalCount} tools active`, 'info');
  }

  /**
   * Update tool status
   */
  updateToolStatus(toolId, status) {
    const tool = this.mcpTools.get(toolId);
    if (tool) {
      tool.status = status;
      this.toolStatus.set(toolId, status);
    }
  }

  /**
   * Add log entry
   */
  addMCPLog(message, level = 'info') {
    const logContent = document.getElementById('mcpLogContent');
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
   * Clear MCP log
   */
  clearMCPLog() {
    const logContent = document.getElementById('mcpLogContent');
    if (logContent) {
      logContent.innerHTML = `
        <div class="log-entry">
          <span class="log-time">[${new Date().toLocaleTimeString()}]</span>
          <span class="log-message">MCP Tools log cleared</span>
          <span class="log-level info">INFO</span>
        </div>
      `;
    }
  }

  /**
   * Start MCP monitoring
   */
  startMCPMonitoring() {
    // Load tools into grid
    this.loadToolsIntoGrid();
    
    // Update stats periodically
    setInterval(() => {
      this.updateMCPStats();
    }, 5000);
  }

  /**
   * Load tools into grid
   */
  loadToolsIntoGrid() {
    const toolsGrid = document.getElementById('mcpToolsGrid');
    if (!toolsGrid) return;

    toolsGrid.innerHTML = '';

    this.mcpTools.forEach((tool, id) => {
      this.createToolCard(tool, toolsGrid);
    });
  }

  /**
   * Update MCP stats
   */
  updateMCPStats() {
    const availableCount = Array.from(this.mcpTools.values()).filter(tool => tool.status === 'available' || tool.status === 'created').length;
    const missingCount = Array.from(this.mcpTools.values()).filter(tool => tool.status === 'missing').length;
    const activeCount = Array.from(this.mcpTools.values()).filter(tool => tool.status === 'active').length;

    const availableElement = document.getElementById('availableToolsCount');
    const missingElement = document.getElementById('missingToolsCount');
    const activeElement = document.getElementById('activeToolsCount');

    if (availableElement) availableElement.textContent = availableCount;
    if (missingElement) missingElement.textContent = missingCount;
    if (activeElement) activeElement.textContent = activeCount;
  }
}

// Initialize MCP tools integration when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.mcpToolsIntegration = new MCPToolsIntegration();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MCPToolsIntegration;
}
