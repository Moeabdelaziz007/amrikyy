#!/usr/bin/env node
/**
 * 📊 Telegram Bot Dashboard
 * Web-based dashboard for monitoring and managing Telegram bots
 */

const express = require('express');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

class TelegramBotDashboard {
  constructor() {
    this.app = express();
    this.port = process.env.DASHBOARD_PORT || 8080;
    this.botData = {
      stats: {
        uptime: Date.now(),
        totalMessages: 0,
        activeUsers: 0,
        commandsUsed: {},
        errors: 0
      },
      logs: [],
      health: {
        status: 'healthy',
        lastCheck: new Date(),
        responseTime: 0
      }
    };
    
    this.setupMiddleware();
    this.setupRoutes();
    this.startDataCollection();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use('/static', express.static(path.join(__dirname, 'dashboard')));
  }

  setupRoutes() {
    // Dashboard home
    this.app.get('/', (req, res) => {
      res.send(this.getDashboardHTML());
    });

    // API endpoints
    this.app.get('/api/stats', (req, res) => {
      res.json(this.getStats());
    });

    this.app.get('/api/health', (req, res) => {
      res.json(this.getHealthStatus());
    });

    this.app.get('/api/logs', (req, res) => {
      res.json(this.getLogs());
    });

    this.app.get('/api/users', (req, res) => {
      res.json(this.getUserData());
    });

    this.app.post('/api/command', async (req, res) => {
      try {
        const { command } = req.body;
        await this.executeCommand(command);
        res.json({ success: true, message: 'Command executed successfully' });
      } catch (error) {
        res.json({ success: false, message: error.message });
      }
    });

    this.app.get('/api/export', async (req, res) => {
      try {
        const exportData = await this.exportData();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=bot-data.json');
        res.send(JSON.stringify(exportData, null, 2));
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  getStats() {
    const uptime = Date.now() - this.botData.stats.uptime;
    const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
    const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));

    return {
      uptime: `${uptimeHours}h ${uptimeMinutes}m`,
      totalMessages: this.botData.stats.totalMessages,
      activeUsers: this.botData.stats.activeUsers,
      errors: this.botData.stats.errors,
      commandsUsed: this.botData.stats.commandsUsed,
      messagesPerHour: this.getMessagesPerHour(),
      errorRate: this.getErrorRate(),
      healthScore: this.getHealthScore()
    };
  }

  getHealthStatus() {
    return {
      ...this.botData.health,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      platform: process.platform,
      nodeVersion: process.version
    };
  }

  getLogs() {
    return this.botData.logs.slice(-100); // Last 100 logs
  }

  getUserData() {
    return {
      totalUsers: this.botData.stats.activeUsers,
      newUsersToday: this.getNewUsersToday(),
      activeUsers: this.getActiveUsers(),
      userEngagement: this.getUserEngagement()
    };
  }

  async executeCommand(command) {
    // Simulate command execution
    this.addLog('info', `Executing command: ${command}`);
    
    switch (command) {
      case 'restart':
        this.addLog('info', 'Bot restart requested');
        break;
      case 'backup':
        await this.createBackup();
        break;
      case 'clear_logs':
        this.botData.logs = [];
        this.addLog('info', 'Logs cleared');
        break;
      default:
        throw new Error('Unknown command');
    }
  }

  async exportData() {
    return {
      timestamp: new Date(),
      stats: this.botData.stats,
      health: this.botData.health,
      logs: this.botData.logs,
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime()
      }
    };
  }

  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(__dirname, 'backups', `backup-${timestamp}.json`);
    
    await fs.mkdir(path.dirname(backupFile), { recursive: true });
    await fs.writeFile(backupFile, JSON.stringify(await this.exportData(), null, 2));
    
    this.addLog('info', `Backup created: ${backupFile}`);
  }

  startDataCollection() {
    // Simulate data collection
    setInterval(() => {
      this.botData.stats.totalMessages += Math.floor(Math.random() * 5);
      this.botData.stats.activeUsers = Math.floor(Math.random() * 10) + 5;
      
      // Add random commands
      const commands = ['/start', '/help', '/status', '/menu', '/ping'];
      const randomCommand = commands[Math.floor(Math.random() * commands.length)];
      this.botData.stats.commandsUsed[randomCommand] = (this.botData.stats.commandsUsed[randomCommand] || 0) + 1;
      
      // Health check
      this.performHealthCheck();
    }, 10000); // Every 10 seconds
  }

  performHealthCheck() {
    const startTime = Date.now();
    
    // Simulate health check
    this.botData.health.responseTime = Math.random() * 1000;
    this.botData.health.status = this.botData.health.responseTime < 500 ? 'healthy' : 'warning';
    this.botData.health.lastCheck = new Date();
    
    this.addLog('info', `Health check: ${this.botData.health.status} (${this.botData.health.responseTime.toFixed(2)}ms)`);
  }

  addLog(level, message) {
    this.botData.logs.push({
      timestamp: new Date(),
      level,
      message
    });
    
    // Keep only last 1000 logs
    if (this.botData.logs.length > 1000) {
      this.botData.logs.shift();
    }
  }

  // Utility methods
  getMessagesPerHour() {
    const uptimeHours = (Date.now() - this.botData.stats.uptime) / (1000 * 60 * 60);
    return Math.round(this.botData.stats.totalMessages / uptimeHours);
  }

  getErrorRate() {
    const total = this.botData.stats.totalMessages + this.botData.stats.errors;
    return total > 0 ? Math.round((this.botData.stats.errors / total) * 100) : 0;
  }

  getHealthScore() {
    let score = 100;
    score -= this.botData.stats.errors * 2;
    score -= this.botData.health.responseTime / 10;
    return Math.max(0, Math.round(score));
  }

  getNewUsersToday() {
    return Math.floor(Math.random() * 5);
  }

  getActiveUsers() {
    return Math.floor(Math.random() * 10) + 5;
  }

  getUserEngagement() {
    return Math.floor(Math.random() * 20) + 70; // 70-90%
  }

  getDashboardHTML() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AuraOS Telegram Bot Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            color: white;
        }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { font-size: 1.2em; opacity: 0.9; }
        .stats-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 20px; 
            margin-bottom: 30px; 
        }
        .stat-card { 
            background: white; 
            padding: 20px; 
            border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .stat-card:hover { transform: translateY(-5px); }
        .stat-card h3 { color: #667eea; margin-bottom: 10px; }
        .stat-value { font-size: 2em; font-weight: bold; color: #333; }
        .chart-container { 
            background: white; 
            padding: 20px; 
            border-radius: 15px; 
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .controls { 
            background: white; 
            padding: 20px; 
            border-radius: 15px; 
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .btn { 
            background: #667eea; 
            color: white; 
            border: none; 
            padding: 10px 20px; 
            border-radius: 8px; 
            cursor: pointer; 
            margin: 5px;
            transition: background 0.3s ease;
        }
        .btn:hover { background: #5a6fd8; }
        .btn.danger { background: #e74c3c; }
        .btn.danger:hover { background: #c0392b; }
        .logs { 
            background: white; 
            padding: 20px; 
            border-radius: 15px; 
            max-height: 400px; 
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .log-entry { 
            padding: 5px 0; 
            border-bottom: 1px solid #eee; 
            font-family: monospace;
        }
        .log-entry.error { color: #e74c3c; }
        .log-entry.warning { color: #f39c12; }
        .log-entry.info { color: #3498db; }
        .status-indicator { 
            display: inline-block; 
            width: 10px; 
            height: 10px; 
            border-radius: 50%; 
            margin-right: 10px;
        }
        .status-healthy { background: #27ae60; }
        .status-warning { background: #f39c12; }
        .status-error { background: #e74c3c; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 AuraOS Telegram Bot Dashboard</h1>
            <p>Real-time monitoring and management</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <h3>📊 Total Messages</h3>
                <div class="stat-value" id="totalMessages">0</div>
            </div>
            <div class="stat-card">
                <h3>👥 Active Users</h3>
                <div class="stat-value" id="activeUsers">0</div>
            </div>
            <div class="stat-card">
                <h3>⏰ Uptime</h3>
                <div class="stat-value" id="uptime">0h 0m</div>
            </div>
            <div class="stat-card">
                <h3>🏥 Health Score</h3>
                <div class="stat-value" id="healthScore">100</div>
            </div>
        </div>

        <div class="chart-container">
            <h3>📈 Message Activity</h3>
            <canvas id="messageChart" width="400" height="200"></canvas>
        </div>

        <div class="controls">
            <h3>🎛️ Bot Controls</h3>
            <button class="btn" onclick="executeCommand('restart')">🔄 Restart Bot</button>
            <button class="btn" onclick="executeCommand('backup')">💾 Create Backup</button>
            <button class="btn" onclick="executeCommand('clear_logs')">🧹 Clear Logs</button>
            <button class="btn" onclick="exportData()">📤 Export Data</button>
            <button class="btn danger" onclick="emergencyStop()">🚨 Emergency Stop</button>
        </div>

        <div class="logs">
            <h3>📝 Recent Logs</h3>
            <div id="logEntries"></div>
        </div>
    </div>

    <script>
        let messageChart;
        let logEntries = [];

        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', function() {
            initializeChart();
            updateDashboard();
            setInterval(updateDashboard, 5000); // Update every 5 seconds
        });

        function initializeChart() {
            const ctx = document.getElementById('messageChart').getContext('2d');
            messageChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Messages',
                        data: [],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }

        async function updateDashboard() {
            try {
                const [stats, health, logs] = await Promise.all([
                    fetch('/api/stats').then(r => r.json()),
                    fetch('/api/health').then(r => r.json()),
                    fetch('/api/logs').then(r => r.json())
                ]);

                // Update stats
                document.getElementById('totalMessages').textContent = stats.totalMessages;
                document.getElementById('activeUsers').textContent = stats.activeUsers;
                document.getElementById('uptime').textContent = stats.uptime;
                document.getElementById('healthScore').textContent = stats.healthScore;

                // Update chart
                const now = new Date().toLocaleTimeString();
                messageChart.data.labels.push(now);
                messageChart.data.datasets[0].data.push(stats.totalMessages);
                
                if (messageChart.data.labels.length > 20) {
                    messageChart.data.labels.shift();
                    messageChart.data.datasets[0].data.shift();
                }
                messageChart.update();

                // Update logs
                updateLogs(logs);

            } catch (error) {
                console.error('Error updating dashboard:', error);
            }
        }

        function updateLogs(logs) {
            const logContainer = document.getElementById('logEntries');
            logContainer.innerHTML = '';
            
            logs.slice(-20).forEach(log => {
                const logEntry = document.createElement('div');
                logEntry.className = \`log-entry \${log.level}\`;
                logEntry.innerHTML = \`
                    <span class="status-indicator status-\${log.level}"></span>
                    [\${new Date(log.timestamp).toLocaleTimeString()}] \${log.message}
                \`;
                logContainer.appendChild(logEntry);
            });
        }

        async function executeCommand(command) {
            try {
                const response = await fetch('/api/command', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ command })
                });
                
                const result = await response.json();
                if (result.success) {
                    alert('Command executed successfully!');
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                alert('Error executing command: ' + error.message);
            }
        }

        async function exportData() {
            try {
                const response = await fetch('/api/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'bot-data.json';
                a.click();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                alert('Error exporting data: ' + error.message);
            }
        }

        function emergencyStop() {
            if (confirm('Are you sure you want to emergency stop the bot?')) {
                executeCommand('emergency_stop');
            }
        }
    </script>
</body>
</html>
    `;
  }

  async start() {
    try {
      await this.app.listen(this.port);
      console.log('📊 Telegram Bot Dashboard started!');
      console.log(`🌐 Dashboard URL: http://localhost:${this.port}`);
      console.log('✅ Real-time monitoring active');
      console.log('\n📱 Dashboard Features:');
      console.log('• Real-time statistics');
      console.log('• Health monitoring');
      console.log('• Bot controls');
      console.log('• Data export');
      console.log('• Log viewing');
    } catch (error) {
      console.error('❌ Error starting dashboard:', error);
    }
  }
}

// Start the dashboard
const dashboard = new TelegramBotDashboard();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️ Shutting down dashboard...');
  process.exit(0);
});

dashboard.start().catch(console.error);

module.exports = TelegramBotDashboard;
