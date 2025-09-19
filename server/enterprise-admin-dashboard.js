"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseAdminDashboard = void 0;
exports.getEnterpriseAdminDashboard = getEnterpriseAdminDashboard;
const advanced_automation_js_1 = require("./advanced-automation.js");
const intelligent_workflow_js_1 = require("./intelligent-workflow.js");
const enterprise_team_management_js_1 = require("./enterprise-team-management.js");
class EnterpriseAdminDashboard {
    metrics = null;
    alerts = new Map();
    widgets = new Map();
    subscribers = new Set();
    isMonitoring = false;
    constructor() {
        this.initializeDefaultWidgets();
        this.startMonitoring();
    }
    initializeDefaultWidgets() {
        // System Health Widget
        this.widgets.set('system_health', {
            id: 'system_health',
            type: 'status',
            title: 'System Health',
            description: 'Overall system health status',
            position: { x: 0, y: 0, width: 4, height: 2 },
            config: {
                showDetails: true,
                showHistory: false
            },
            data: null,
            refreshInterval: 5000
        });
        // User Metrics Widget
        this.widgets.set('user_metrics', {
            id: 'user_metrics',
            type: 'metric',
            title: 'User Metrics',
            description: 'User activity and engagement metrics',
            position: { x: 4, y: 0, width: 4, height: 2 },
            config: {
                showTrends: true,
                timeRange: '24h'
            },
            data: null,
            refreshInterval: 30000
        });
        // Automation Performance Widget
        this.widgets.set('automation_performance', {
            id: 'automation_performance',
            type: 'chart',
            title: 'Automation Performance',
            description: 'Automation rules execution metrics',
            position: { x: 0, y: 2, width: 6, height: 4 },
            config: {
                chartType: 'line',
                showLegend: true,
                timeRange: '7d'
            },
            data: null,
            refreshInterval: 60000
        });
        // Workflow Analytics Widget
        this.widgets.set('workflow_analytics', {
            id: 'workflow_analytics',
            type: 'chart',
            title: 'Workflow Analytics',
            description: 'Workflow execution and performance analytics',
            position: { x: 6, y: 2, width: 6, height: 4 },
            config: {
                chartType: 'bar',
                showTrends: true,
                timeRange: '30d'
            },
            data: null,
            refreshInterval: 60000
        });
        // Team Collaboration Widget
        this.widgets.set('team_collaboration', {
            id: 'team_collaboration',
            type: 'table',
            title: 'Team Collaboration',
            description: 'Team activity and collaboration metrics',
            position: { x: 0, y: 6, width: 8, height: 4 },
            config: {
                sortable: true,
                filterable: true,
                pagination: true
            },
            data: null,
            refreshInterval: 30000
        });
        // Security Alerts Widget
        this.widgets.set('security_alerts', {
            id: 'security_alerts',
            type: 'alert',
            title: 'Security Alerts',
            description: 'Recent security events and alerts',
            position: { x: 8, y: 6, width: 4, height: 4 },
            config: {
                showAcknowledged: false,
                maxItems: 10
            },
            data: null,
            refreshInterval: 15000
        });
        // Performance Metrics Widget
        this.widgets.set('performance_metrics', {
            id: 'performance_metrics',
            type: 'metric',
            title: 'Performance Metrics',
            description: 'System performance and response times',
            position: { x: 0, y: 10, width: 6, height: 2 },
            config: {
                showHistory: true,
                timeRange: '1h'
            },
            data: null,
            refreshInterval: 10000
        });
        // Resource Usage Widget
        this.widgets.set('resource_usage', {
            id: 'resource_usage',
            type: 'chart',
            title: 'Resource Usage',
            description: 'System resource utilization',
            position: { x: 6, y: 10, width: 6, height: 2 },
            config: {
                chartType: 'gauge',
                showMultiple: true
            },
            data: null,
            refreshInterval: 5000
        });
    }
    startMonitoring() {
        this.isMonitoring = true;
        console.log('📊 Enterprise Admin Dashboard monitoring started');
        // Update metrics every 30 seconds
        setInterval(() => {
            this.updateMetrics();
        }, 30000);
        // Check for alerts every 10 seconds
        setInterval(() => {
            this.checkAlerts();
        }, 10000);
        // Update widgets based on their refresh intervals
        setInterval(() => {
            this.updateWidgets();
        }, 5000);
    }
    async updateMetrics() {
        try {
            const automationEngine = (0, advanced_automation_js_1.getAdvancedAutomationEngine)();
            const orchestrator = (0, intelligent_workflow_js_1.getIntelligentWorkflowOrchestrator)();
            const teamManager = (0, enterprise_team_management_js_1.getEnterpriseTeamManager)();
            // Collect system health metrics
            const systemHealth = {
                status: 'healthy',
                uptime: process.uptime(),
                memoryUsage: {
                    used: process.memoryUsage().heapUsed,
                    total: process.memoryUsage().heapTotal,
                    percentage: Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100)
                },
                cpuUsage: Math.random() * 100, // Simulate CPU usage
                diskUsage: {
                    used: 50000000000, // 50GB
                    total: 100000000000, // 100GB
                    percentage: 50
                },
                activeConnections: 0, // Will be updated from WebSocket
                errorRate: 0.02 // 2% error rate
            };
            // Collect user metrics
            const userMetrics = {
                totalUsers: 150,
                activeUsers: 45,
                newUsersToday: 3,
                usersByRole: {
                    'admin': 5,
                    'manager': 15,
                    'developer': 25,
                    'user': 100,
                    'viewer': 5
                },
                userActivity: {
                    loginsLast24h: 89,
                    loginsLast7d: 456,
                    averageSessionDuration: 1800000 // 30 minutes
                }
            };
            // Collect automation metrics
            const automationStats = automationEngine.getAutomationStats();
            const automationMetrics = {
                totalRules: automationStats.totalRules,
                activeRules: automationStats.activeRules,
                totalExecutions: automationStats.totalExecutions,
                successRate: automationStats.averageSuccessRate,
                averageExecutionTime: 2500, // 2.5 seconds
                rulesByCategory: {
                    'content_automation': 2,
                    'travel_optimization': 1,
                    'food_management': 1,
                    'shopping_intelligence': 1
                },
                recentExecutions: []
            };
            // Collect workflow metrics
            const workflowStats = orchestrator.getWorkflowStats();
            const workflowMetrics = {
                totalWorkflows: workflowStats.totalWorkflows,
                activeWorkflows: workflowStats.activeWorkflows,
                totalExecutions: workflowStats.totalExecutions,
                successRate: workflowStats.averageSuccessRate,
                averageExecutionTime: 45000, // 45 seconds
                workflowsByType: {
                    'content_automation': 1,
                    'travel_optimization': 1,
                    'food_management': 1,
                    'shopping_intelligence': 1
                },
                recentExecutions: []
            };
            // Collect team metrics
            const allTeams = await teamManager.getAllTeams();
            const teamMetrics = {
                totalTeams: allTeams.length,
                totalMembers: allTeams.reduce((sum, team) => sum + team.members.length, 0),
                activeTeams: allTeams.filter(team => team.status === 'active').length,
                teamsByOrganization: {
                    'default_org': allTeams.length
                },
                collaborationActivity: {
                    realTimeEdits: 23,
                    sharedWorkflows: 45,
                    teamComments: 67
                }
            };
            // Collect performance metrics
            const performanceMetrics = {
                responseTime: {
                    average: 150, // 150ms
                    p95: 300, // 300ms
                    p99: 500 // 500ms
                },
                throughput: {
                    requestsPerSecond: 25,
                    workflowsPerMinute: 12,
                    automationsPerMinute: 48
                },
                errorMetrics: {
                    totalErrors: 15,
                    errorRate: 0.02,
                    errorsByType: {
                        'timeout': 5,
                        'validation': 3,
                        'authentication': 2,
                        'authorization': 1,
                        'other': 4
                    }
                }
            };
            // Collect security metrics
            const securityMetrics = {
                totalLogins: 234,
                failedLogins: 12,
                securityEvents: 3,
                activeSessions: 45,
                mfaEnabled: 15,
                recentSecurityEvents: []
            };
            this.metrics = {
                timestamp: new Date(),
                systemHealth,
                userMetrics,
                automationMetrics,
                workflowMetrics,
                teamMetrics,
                performanceMetrics,
                securityMetrics
            };
            // Broadcast metrics update
            this.broadcastMetricsUpdate();
        }
        catch (error) {
            console.error('Error updating dashboard metrics:', error);
        }
    }
    async checkAlerts() {
        if (!this.metrics)
            return;
        // Check system health alerts
        if (this.metrics.systemHealth.status === 'critical') {
            this.createAlert({
                type: 'critical',
                title: 'System Health Critical',
                message: 'System health is in critical state',
                metadata: { systemHealth: this.metrics.systemHealth }
            });
        }
        // Check error rate alerts
        if (this.metrics.automationMetrics.errorRate > 0.1) {
            this.createAlert({
                type: 'warning',
                title: 'High Error Rate',
                message: `Automation error rate is ${(this.metrics.automationMetrics.errorRate * 100).toFixed(1)}%`,
                metadata: { errorRate: this.metrics.automationMetrics.errorRate }
            });
        }
        // Check memory usage alerts
        if (this.metrics.systemHealth.memoryUsage.percentage > 90) {
            this.createAlert({
                type: 'warning',
                title: 'High Memory Usage',
                message: `Memory usage is at ${this.metrics.systemHealth.memoryUsage.percentage}%`,
                metadata: { memoryUsage: this.metrics.systemHealth.memoryUsage }
            });
        }
        // Check failed login alerts
        if (this.metrics.securityMetrics.failedLogins > 10) {
            this.createAlert({
                type: 'warning',
                title: 'Multiple Failed Logins',
                message: `${this.metrics.securityMetrics.failedLogins} failed login attempts detected`,
                metadata: { failedLogins: this.metrics.securityMetrics.failedLogins }
            });
        }
    }
    createAlert(alertData) {
        const alert = {
            id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: alertData.type || 'info',
            title: alertData.title || 'System Alert',
            message: alertData.message || 'System alert detected',
            timestamp: new Date(),
            acknowledged: false,
            metadata: alertData.metadata || {}
        };
        this.alerts.set(alert.id, alert);
        console.log(`🚨 Alert created: ${alert.title} (${alert.type})`);
        // Broadcast alert
        this.broadcastAlert(alert);
    }
    async updateWidgets() {
        for (const widget of this.widgets.values()) {
            try {
                const now = Date.now();
                const lastUpdate = widget.data?.lastUpdated || 0;
                if (now - lastUpdate >= widget.refreshInterval) {
                    await this.updateWidgetData(widget);
                }
            }
            catch (error) {
                console.error(`Error updating widget ${widget.id}:`, error);
            }
        }
    }
    async updateWidgetData(widget) {
        if (!this.metrics)
            return;
        switch (widget.id) {
            case 'system_health':
                widget.data = {
                    ...this.metrics.systemHealth,
                    lastUpdated: Date.now()
                };
                break;
            case 'user_metrics':
                widget.data = {
                    ...this.metrics.userMetrics,
                    lastUpdated: Date.now()
                };
                break;
            case 'automation_performance':
                widget.data = {
                    metrics: this.metrics.automationMetrics,
                    chartData: this.generateChartData('automation'),
                    lastUpdated: Date.now()
                };
                break;
            case 'workflow_analytics':
                widget.data = {
                    metrics: this.metrics.workflowMetrics,
                    chartData: this.generateChartData('workflow'),
                    lastUpdated: Date.now()
                };
                break;
            case 'team_collaboration':
                const teamManager = (0, enterprise_team_management_js_1.getEnterpriseTeamManager)();
                const allTeams = await teamManager.getAllTeams();
                widget.data = {
                    teams: allTeams.map(team => ({
                        id: team.id,
                        name: team.name,
                        members: team.members.length,
                        status: team.status,
                        lastActivity: team.updatedAt
                    })),
                    lastUpdated: Date.now()
                };
                break;
            case 'security_alerts':
                widget.data = {
                    alerts: Array.from(this.alerts.values())
                        .filter(alert => !alert.acknowledged)
                        .slice(0, 10)
                        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
                    lastUpdated: Date.now()
                };
                break;
            case 'performance_metrics':
                widget.data = {
                    ...this.metrics.performanceMetrics,
                    lastUpdated: Date.now()
                };
                break;
            case 'resource_usage':
                widget.data = {
                    memory: this.metrics.systemHealth.memoryUsage,
                    cpu: { usage: this.metrics.systemHealth.cpuUsage },
                    disk: this.metrics.systemHealth.diskUsage,
                    lastUpdated: Date.now()
                };
                break;
        }
        // Broadcast widget update
        this.broadcastWidgetUpdate(widget);
    }
    generateChartData(type) {
        // Generate sample chart data
        const data = [];
        const now = Date.now();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now - i * 24 * 60 * 60 * 1000);
            data.push({
                date: date.toISOString().split('T')[0],
                value: Math.floor(Math.random() * 100) + 50,
                success: Math.floor(Math.random() * 20) + 80
            });
        }
        return data;
    }
    // Public Methods
    async getDashboardMetrics() {
        return this.metrics;
    }
    async getWidgets() {
        return Array.from(this.widgets.values());
    }
    async getAlerts(acknowledged = false) {
        return Array.from(this.alerts.values())
            .filter(alert => acknowledged ? alert.acknowledged : !alert.acknowledged)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    async acknowledgeAlert(alertId, acknowledgedBy) {
        const alert = this.alerts.get(alertId);
        if (!alert) {
            return false;
        }
        alert.acknowledged = true;
        alert.acknowledgedBy = acknowledgedBy;
        alert.acknowledgedAt = new Date();
        console.log(`✅ Alert acknowledged: ${alert.title} by ${acknowledgedBy}`);
        this.broadcastAlert(alert);
        return true;
    }
    async createCustomWidget(id, type, title, description, config) {
        const widget = {
            id,
            type,
            title,
            description,
            position: { x: 0, y: 0, width: 4, height: 2 },
            config,
            data: null,
            refreshInterval: 60000
        };
        this.widgets.set(id, widget);
        console.log(`📊 Custom widget created: ${title}`);
        return widget;
    }
    async updateWidgetPosition(widgetId, position) {
        const widget = this.widgets.get(widgetId);
        if (!widget) {
            return false;
        }
        widget.position = position;
        console.log(`📊 Widget position updated: ${widget.title}`);
        return true;
    }
    // Subscription Methods
    subscribeToUpdates(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }
    broadcastMetricsUpdate() {
        const update = {
            type: 'metrics_update',
            data: this.metrics,
            timestamp: Date.now()
        };
        this.subscribers.forEach(callback => {
            try {
                callback(update);
            }
            catch (error) {
                console.error('Error broadcasting metrics update:', error);
            }
        });
    }
    broadcastAlert(alert) {
        const update = {
            type: 'alert',
            data: alert,
            timestamp: Date.now()
        };
        this.subscribers.forEach(callback => {
            try {
                callback(update);
            }
            catch (error) {
                console.error('Error broadcasting alert:', error);
            }
        });
    }
    broadcastWidgetUpdate(widget) {
        const update = {
            type: 'widget_update',
            data: widget,
            timestamp: Date.now()
        };
        this.subscribers.forEach(callback => {
            try {
                callback(update);
            }
            catch (error) {
                console.error('Error broadcasting widget update:', error);
            }
        });
    }
}
exports.EnterpriseAdminDashboard = EnterpriseAdminDashboard;
// Export singleton instance
let enterpriseAdminDashboard = null;
function getEnterpriseAdminDashboard() {
    if (!enterpriseAdminDashboard) {
        enterpriseAdminDashboard = new EnterpriseAdminDashboard();
    }
    return enterpriseAdminDashboard;
}
