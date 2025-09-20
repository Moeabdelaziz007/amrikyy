// Security Analytics Component
// Advanced security monitoring and threat detection

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Unlock, 
  Activity, 
  Clock, 
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Settings,
  Bell,
  Zap,
  Users,
  Globe,
  Database,
  Network,
  FileText,
  Search
} from 'lucide-react';
import AdvancedAnalyticsService, { SecurityAlert } from '../../lib/advanced-analytics-service';

interface SecurityAnalyticsProps {
  userId: string;
}

export const SecurityAnalytics: React.FC<SecurityAnalyticsProps> = ({ userId }) => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    loadSecurityAlerts();
    setupRealTimeUpdates();
  }, [userId, showResolved]);

  const loadSecurityAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await AdvancedAnalyticsService.detectSecurityAnomalies(userId);
      setAlerts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load security alerts');
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    const interval = setInterval(async () => {
      try {
        const data = await AdvancedAnalyticsService.detectSecurityAnomalies(userId);
        setAlerts(data);
      } catch (err) {
        console.error('Failed to update security alerts:', err);
      }
    }, 30 * 1000); // Update every 30 seconds

    return () => clearInterval(interval);
  };

  const handleRefresh = () => {
    loadSecurityAlerts();
  };

  const handleExportAlerts = () => {
    const alertsData = {
      alerts,
      exportedAt: new Date().toISOString(),
      userId,
      filters: {
        severity: selectedSeverity,
        type: selectedType,
        showResolved
      }
    };

    const blob = new Blob([JSON.stringify(alertsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-alerts-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      // In a real implementation, this would update the alert status in the database
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, resolved: true, resolvedAt: new Date() }
          : alert
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve alert');
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'high': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'medium': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'low': return <Bell className="h-5 w-5 text-blue-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'suspicious_activity': return <Activity className="h-4 w-4" />;
      case 'anomaly': return <Eye className="h-4 w-4" />;
      case 'security_breach': return <Lock className="h-4 w-4" />;
      case 'data_leak': return <Database className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'suspicious_activity': return 'Suspicious Activity';
      case 'anomaly': return 'Anomaly Detected';
      case 'security_breach': return 'Security Breach';
      case 'data_leak': return 'Data Leak';
      default: return type;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const matchesType = selectedType === 'all' || alert.type === selectedType;
    const matchesResolved = showResolved || !alert.resolved;
    
    return matchesSeverity && matchesType && matchesResolved;
  });

  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.resolved);
  const highAlerts = alerts.filter(a => a.severity === 'high' && !a.resolved);
  const totalActiveAlerts = alerts.filter(a => !a.resolved).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading security analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security Analytics</h2>
          <p className="text-muted-foreground">
            Advanced security monitoring and threat detection
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExportAlerts} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>{criticalAlerts.length} Critical Security Alert{criticalAlerts.length > 1 ? 's' : ''}</strong> 
                detected - Immediate action required
              </div>
              <Button size="sm" variant="destructive">
                <Shield className="h-4 w-4 mr-2" />
                View Critical Alerts
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActiveAlerts}</div>
            <p className="text-xs text-muted-foreground">
              {criticalAlerts.length} critical, {highAlerts.length} high
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Should be addressed soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {alerts.filter(a => a.resolved).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully resolved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Severity:</label>
          <select 
            value={selectedSeverity} 
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Type:</label>
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Types</option>
            <option value="suspicious_activity">Suspicious Activity</option>
            <option value="anomaly">Anomaly</option>
            <option value="security_breach">Security Breach</option>
            <option value="data_leak">Data Leak</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="showResolved"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="showResolved" className="text-sm font-medium">
            Show Resolved
          </label>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
          <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
          <TabsTrigger value="threats">Threat Analysis</TabsTrigger>
          <TabsTrigger value="reports">Security Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Alert 
                key={alert.id} 
                variant={alert.severity === 'critical' ? 'destructive' : 'default'}
                className={getSeverityColor(alert.severity)}
              >
                <div className="flex items-start space-x-3">
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1">
                    <AlertDescription>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getSeverityColor(alert.severity)}`}
                          >
                            {alert.severity}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {getTypeLabel(alert.type)}
                          </Badge>
                          {alert.resolved && (
                            <Badge variant="default" className="text-xs">
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {alert.timestamp.toLocaleString()}
                          </span>
                          {!alert.resolved && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleResolveAlert(alert.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="mb-2">
                        <strong>{alert.description}</strong>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <pre className="whitespace-pre-wrap text-xs">
                          {JSON.stringify(alert.details, null, 2)}
                        </pre>
                      </div>
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}

            {filteredAlerts.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Security Alerts</h3>
                  <p className="text-muted-foreground text-center">
                    {showResolved 
                      ? 'No alerts match the current filters.' 
                      : 'All security systems are operating normally. No active alerts detected.'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Real-time Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Real-time Activity</span>
                </CardTitle>
                <CardDescription>Live security monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Authentication Events</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600">Normal</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Data Access</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600">Normal</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Network Traffic</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-yellow-600">Monitoring</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">System Health</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600">Healthy</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Metrics</span>
                </CardTitle>
                <CardDescription>Key security indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Threat Detection Rate</span>
                    <span className="text-sm font-medium text-green-600">99.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">False Positive Rate</span>
                    <span className="text-sm font-medium text-blue-600">0.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Response Time</span>
                    <span className="text-sm font-medium text-green-600">2.3s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">System Uptime</span>
                    <span className="text-sm font-medium text-green-600">99.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Threat Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Threat Categories</CardTitle>
                <CardDescription>Types of security threats detected</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4" />
                      <span className="text-sm font-medium">Suspicious Activity</span>
                    </div>
                    <Badge variant="outline">12</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">Anomalies</span>
                    </div>
                    <Badge variant="outline">8</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span className="text-sm font-medium">Security Breaches</span>
                    </div>
                    <Badge variant="outline">3</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4" />
                      <span className="text-sm font-medium">Data Leaks</span>
                    </div>
                    <Badge variant="outline">1</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>Current security risk level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-green-600">LOW</div>
                  <div className="text-sm text-muted-foreground">Overall Risk Level</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Authentication Risk</span>
                      <Badge variant="outline" className="text-green-600">Low</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data Access Risk</span>
                      <Badge variant="outline" className="text-green-600">Low</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Network Risk</span>
                      <Badge variant="outline" className="text-yellow-600">Medium</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">System Risk</span>
                      <Badge variant="outline" className="text-green-600">Low</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Security Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Security Reports</CardTitle>
                <CardDescription>Generated security reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4" />
                      <div>
                        <div className="text-sm font-medium">Daily Security Report</div>
                        <div className="text-xs text-muted-foreground">Generated 2 hours ago</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4" />
                      <div>
                        <div className="text-sm font-medium">Weekly Threat Analysis</div>
                        <div className="text-xs text-muted-foreground">Generated 1 day ago</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4" />
                      <div>
                        <div className="text-sm font-medium">Monthly Security Summary</div>
                        <div className="text-xs text-muted-foreground">Generated 1 week ago</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Report Generation */}
            <Card>
              <CardHeader>
                <CardTitle>Generate Report</CardTitle>
                <CardDescription>Create custom security reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Report Type</label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-md text-sm">
                      <option>Security Summary</option>
                      <option>Threat Analysis</option>
                      <option>Compliance Report</option>
                      <option>Incident Report</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Time Period</label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-md text-sm">
                      <option>Last 24 hours</option>
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Custom range</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Include</label>
                    <div className="mt-1 space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Security Alerts</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Threat Analysis</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Detailed Logs</span>
                      </label>
                    </div>
                  </div>
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityAnalytics;
