"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemMonitor = void 0;
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const progress_1 = require("@/components/ui/progress");
const tabs_1 = require("@/components/ui/tabs");
const alert_1 = require("@/components/ui/alert");
const lucide_react_1 = require("lucide-react");
const SystemMonitor = () => {
    const [systemStatus, setSystemStatus] = (0, react_1.useState)(null);
    const [healthStatus, setHealthStatus] = (0, react_1.useState)(null);
    const [logs, setLogs] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [autoRefresh, setAutoRefresh] = (0, react_1.useState)(true);
    const fetchSystemStatus = async () => {
        try {
            const response = await fetch('/api/system/status');
            if (!response.ok)
                throw new Error('Failed to fetch system status');
            const data = await response.json();
            setSystemStatus(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };
    const fetchHealthStatus = async () => {
        try {
            const response = await fetch('/api/system/health');
            if (!response.ok)
                throw new Error('Failed to fetch health status');
            const data = await response.json();
            setHealthStatus(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };
    const fetchLogs = async () => {
        try {
            const response = await fetch('/api/system/logs?limit=50');
            if (!response.ok)
                throw new Error('Failed to fetch logs');
            const data = await response.json();
            setLogs(data.logs || []);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };
    const refreshAll = async () => {
        setLoading(true);
        setError(null);
        await Promise.all([fetchSystemStatus(), fetchHealthStatus(), fetchLogs()]);
        setLoading(false);
    };
    (0, react_1.useEffect)(() => {
        refreshAll();
    }, []);
    (0, react_1.useEffect)(() => {
        if (!autoRefresh)
            return;
        const interval = setInterval(refreshAll, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, [autoRefresh]);
    const formatUptime = (seconds) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (days > 0)
            return `${days}d ${hours}h ${minutes}m`;
        if (hours > 0)
            return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };
    const formatBytes = (bytes) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0)
            return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'healthy':
            case 'operational':
            case 'active':
            case 'connected':
                return 'bg-green-500';
            case 'warning':
            case 'degraded':
                return 'bg-yellow-500';
            case 'error':
            case 'failed':
            case 'inactive':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };
    const getLogLevelColor = (level) => {
        switch (level.toLowerCase()) {
            case 'debug':
                return 'text-blue-500';
            case 'info':
                return 'text-green-500';
            case 'warn':
                return 'text-yellow-500';
            case 'error':
                return 'text-red-500';
            case 'critical':
                return 'text-purple-500';
            default:
                return 'text-gray-500';
        }
    };
    if (loading && !systemStatus) {
        return (<div className="flex items-center justify-center h-64">
        <lucide_react_1.RefreshCw className="h-8 w-8 animate-spin"/>
        <span className="ml-2">Loading system status...</span>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Monitor</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of AuraOS system health and performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button_1.Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)}>
            {autoRefresh ? (<>
                <lucide_react_1.RefreshCw className="h-4 w-4 mr-2 animate-spin"/>
                Auto-refresh ON
              </>) : (<>
                <lucide_react_1.RefreshCw className="h-4 w-4 mr-2"/>
                Auto-refresh OFF
              </>)}
          </button_1.Button>
          <button_1.Button variant="outline" size="sm" onClick={refreshAll}>
            <lucide_react_1.RefreshCw className="h-4 w-4 mr-2"/>
            Refresh
          </button_1.Button>
        </div>
      </div>

      {error && (<alert_1.Alert variant="destructive">
          <lucide_react_1.AlertTriangle className="h-4 w-4"/>
          <alert_1.AlertDescription>{error}</alert_1.AlertDescription>
        </alert_1.Alert>)}

      <tabs_1.Tabs defaultValue="overview" className="space-y-4">
        <tabs_1.TabsList>
          <tabs_1.TabsTrigger value="overview">Overview</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="performance">Performance</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="services">Services</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="logs">Logs</tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        {/* Overview Tab */}
        <tabs_1.TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* System Status */}
            <card_1.Card>
              <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <card_1.CardTitle className="text-sm font-medium">System Status</card_1.CardTitle>
                <lucide_react_1.Server className="h-4 w-4 text-muted-foreground"/>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus?.system.status || 'unknown')}`}/>
                  <span className="text-2xl font-bold capitalize">
                    {systemStatus?.system.status || 'Unknown'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Version {systemStatus?.system.version || 'N/A'}
                </p>
              </card_1.CardContent>
            </card_1.Card>

            {/* Uptime */}
            <card_1.Card>
              <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <card_1.CardTitle className="text-sm font-medium">Uptime</card_1.CardTitle>
                <lucide_react_1.Activity className="h-4 w-4 text-muted-foreground"/>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="text-2xl font-bold">
                  {systemStatus ? formatUptime(systemStatus.system.uptime) : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Since last restart
                </p>
              </card_1.CardContent>
            </card_1.Card>

            {/* AI Agents */}
            <card_1.Card>
              <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <card_1.CardTitle className="text-sm font-medium">AI Agents</card_1.CardTitle>
                <lucide_react_1.Brain className="h-4 w-4 text-muted-foreground"/>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="text-2xl font-bold">
                  {systemStatus?.ai.activeAgents || 0}/{systemStatus?.ai.agents || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active agents
                </p>
              </card_1.CardContent>
            </card_1.Card>

            {/* Autopilot */}
            <card_1.Card>
              <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <card_1.CardTitle className="text-sm font-medium">Autopilot</card_1.CardTitle>
                <lucide_react_1.Bot className="h-4 w-4 text-muted-foreground"/>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="flex items-center space-x-2">
                  {systemStatus?.autopilot.active ? (<lucide_react_1.CheckCircle className="h-5 w-5 text-green-500"/>) : (<lucide_react_1.XCircle className="h-5 w-5 text-red-500"/>)}
                  <span className="text-2xl font-bold">
                    {systemStatus?.autopilot.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {systemStatus?.autopilot.rules || 0} rules, {systemStatus?.autopilot.workflows || 0} workflows
                </p>
              </card_1.CardContent>
            </card_1.Card>
          </div>

          {/* Service Health */}
          {healthStatus && (<card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle>Service Health</card_1.CardTitle>
                <card_1.CardDescription>Status of all system services</card_1.CardDescription>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(healthStatus.services).map(([service, status]) => (<div key={service} className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}/>
                      <span className="text-sm capitalize">{service}</span>
                      <badge_1.Badge variant={status === 'connected' || status === 'operational' ? 'default' : 'destructive'}>
                        {status}
                      </badge_1.Badge>
                    </div>))}
                </div>
              </card_1.CardContent>
            </card_1.Card>)}
        </tabs_1.TabsContent>

        {/* Performance Tab */}
        <tabs_1.TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Memory Usage */}
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center space-x-2">
                  <lucide_react_1.MemoryStick className="h-5 w-5"/>
                  <span>Memory Usage</span>
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Heap Used</span>
                    <span>{systemStatus ? formatBytes(systemStatus.system.memory.heapUsed) : 'N/A'}</span>
                  </div>
                  <progress_1.Progress value={systemStatus?.performance.memory || 0} className="h-2"/>
                  <div className="flex justify-between text-sm">
                    <span>Total</span>
                    <span>{systemStatus ? formatBytes(systemStatus.system.memory.heapTotal) : 'N/A'}</span>
                  </div>
                </div>
              </card_1.CardContent>
            </card_1.Card>

            {/* CPU Usage */}
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center space-x-2">
                  <lucide_react_1.Cpu className="h-5 w-5"/>
                  <span>CPU Usage</span>
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {systemStatus?.performance.cpu || 0}%
                  </div>
                  <progress_1.Progress value={systemStatus?.performance.cpu || 0} className="h-2"/>
                  <p className="text-xs text-muted-foreground">
                    Approximate CPU usage
                  </p>
                </div>
              </card_1.CardContent>
            </card_1.Card>

            {/* Response Time */}
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center space-x-2">
                  <lucide_react_1.Zap className="h-5 w-5"/>
                  <span>Response Time</span>
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {systemStatus?.performance.responseTime || 0}ms
                  </div>
                  <div className="text-xs text-muted-foreground">
                    API response time
                  </div>
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </div>
        </tabs_1.TabsContent>

        {/* Services Tab */}
        <tabs_1.TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* AI System */}
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center space-x-2">
                  <lucide_react_1.Brain className="h-5 w-5"/>
                  <span>AI System</span>
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Agents</span>
                  <badge_1.Badge variant="outline">{systemStatus?.ai.agents || 0}</badge_1.Badge>
                </div>
                <div className="flex justify-between">
                  <span>Active Agents</span>
                  <badge_1.Badge variant="outline">{systemStatus?.ai.activeAgents || 0}</badge_1.Badge>
                </div>
                <div className="flex justify-between">
                  <span>Total Tasks</span>
                  <badge_1.Badge variant="outline">{systemStatus?.ai.totalTasks || 0}</badge_1.Badge>
                </div>
              </card_1.CardContent>
            </card_1.Card>

            {/* Autopilot System */}
            <card_1.Card>
              <card_1.CardHeader>
                <card_1.CardTitle className="flex items-center space-x-2">
                  <lucide_react_1.Bot className="h-5 w-5"/>
                  <span>Autopilot System</span>
                </card_1.CardTitle>
              </card_1.CardHeader>
              <card_1.CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Status</span>
                  <badge_1.Badge variant={systemStatus?.autopilot.active ? 'default' : 'destructive'}>
                    {systemStatus?.autopilot.active ? 'Active' : 'Inactive'}
                  </badge_1.Badge>
                </div>
                <div className="flex justify-between">
                  <span>Active Rules</span>
                  <badge_1.Badge variant="outline">{systemStatus?.autopilot.rules || 0}</badge_1.Badge>
                </div>
                <div className="flex justify-between">
                  <span>Active Workflows</span>
                  <badge_1.Badge variant="outline">{systemStatus?.autopilot.workflows || 0}</badge_1.Badge>
                </div>
                <div className="flex justify-between">
                  <span>Last Execution</span>
                  <span className="text-sm text-muted-foreground">
                    {systemStatus?.autopilot.lastExecution ?
            new Date(systemStatus.autopilot.lastExecution).toLocaleString() :
            'Never'}
                  </span>
                </div>
              </card_1.CardContent>
            </card_1.Card>
          </div>
        </tabs_1.TabsContent>

        {/* Logs Tab */}
        <tabs_1.TabsContent value="logs" className="space-y-4">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Recent System Logs</card_1.CardTitle>
              <card_1.CardDescription>
                Latest system events and activities
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {logs.length === 0 ? (<p className="text-muted-foreground text-center py-4">
                    No logs available
                  </p>) : (logs.map((log, index) => (<div key={index} className="flex items-start space-x-3 p-2 rounded border">
                      <div className="flex-shrink-0">
                        <span className={`text-xs font-mono ${getLogLevelColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground font-mono">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                          <badge_1.Badge variant="outline" className="text-xs">
                            {log.source}
                          </badge_1.Badge>
                        </div>
                        <p className="text-sm mt-1">{log.message}</p>
                        {log.context && (<details className="mt-2">
                            <summary className="text-xs text-muted-foreground cursor-pointer">
                              Context
                            </summary>
                            <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                              {JSON.stringify(log.context, null, 2)}
                            </pre>
                          </details>)}
                      </div>
                    </div>)))}
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
    </div>);
};
exports.SystemMonitor = SystemMonitor;
