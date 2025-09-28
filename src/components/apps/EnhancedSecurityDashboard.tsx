import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Lock, 
  Key, 
  User, 
  Activity, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Settings, 
  Bell, 
  FileText, 
  Database, 
  Network, 
  HardDrive, 
  Cpu, 
  MemoryStick, 
  Wifi, 
  Globe, 
  Zap,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

interface SecurityThreat {
  id: string;
  type: 'malware' | 'intrusion' | 'phishing' | 'ddos' | 'data_breach' | 'vulnerability';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  source: string;
  target: string;
  timestamp: Date;
  status: 'active' | 'resolved' | 'investigating';
  impact: string;
  recommendation: string;
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'file_access' | 'permission_change' | 'system_change' | 'network_access';
  user: string;
  action: string;
  resource: string;
  ip: string;
  timestamp: Date;
  success: boolean;
  details: string;
}

interface VulnerabilityScan {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cve: string;
  description: string;
  affected_systems: string[];
  remediation: string;
  discovered: Date;
  status: 'open' | 'patched' | 'ignored';
}

interface SecurityStats {
  totalThreats: number;
  activeThreats: number;
  resolvedThreats: number;
  criticalThreats: number;
  totalEvents: number;
  failedLogins: number;
  successfulLogins: number;
  vulnerabilityCount: number;
  patchedVulnerabilities: number;
  securityScore: number;
  lastScan: Date;
  uptime: string;
}

export const EnhancedSecurityDashboard: React.FC = () => {
  const { user } = useAuth();
  const [securityStats, setSecurityStats] = useState<SecurityStats | null>(null);
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'threats' | 'events' | 'vulnerabilities'>('overview');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    loadSecurityData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      loadSecurityData();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadSecurityData = async () => {
    try {
      await Promise.all([
        loadSecurityStats(),
        loadThreats(),
        loadEvents(),
        loadVulnerabilities()
      ]);
    } catch (error) {
      console.error('Failed to load security data:', error);
      // Use mock data if API fails
      setSecurityStats(getMockSecurityStats());
      setThreats(getMockThreats());
      setEvents(getMockEvents());
      setVulnerabilities(getMockVulnerabilities());
    } finally {
      setLoading(false);
    }
  };

  const loadSecurityStats = async () => {
    try {
      const response = await fetch('/api/security/stats');
      const data = await response.json();
      
      if (data.stats) {
        setSecurityStats(data.stats);
      } else {
        setSecurityStats(getMockSecurityStats());
      }
    } catch (error) {
      console.error('Failed to load security stats:', error);
      setSecurityStats(getMockSecurityStats());
    }
  };

  const loadThreats = async () => {
    try {
      const response = await fetch('/api/security/threats');
      const data = await response.json();
      
      if (data.threats) {
        setThreats(data.threats.map((threat: any) => ({
          ...threat,
          timestamp: new Date(threat.timestamp)
        })));
      } else {
        setThreats(getMockThreats());
      }
    } catch (error) {
      console.error('Failed to load threats:', error);
      setThreats(getMockThreats());
    }
  };

  const loadEvents = async () => {
    try {
      const response = await fetch('/api/security/events');
      const data = await response.json();
      
      if (data.events) {
        setEvents(data.events.map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp)
        })));
      } else {
        setEvents(getMockEvents());
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      setEvents(getMockEvents());
    }
  };

  const loadVulnerabilities = async () => {
    try {
      const response = await fetch('/api/security/vulnerabilities');
      const data = await response.json();
      
      if (data.vulnerabilities) {
        setVulnerabilities(data.vulnerabilities.map((vuln: any) => ({
          ...vuln,
          discovered: new Date(vuln.discovered)
        })));
      } else {
        setVulnerabilities(getMockVulnerabilities());
      }
    } catch (error) {
      console.error('Failed to load vulnerabilities:', error);
      setVulnerabilities(getMockVulnerabilities());
    }
  };

  const runSecurityScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    try {
      const response = await fetch('/api/security/scan', {
        method: 'POST'
      });
      
      if (response.ok) {
        // Simulate scan progress
        const progressInterval = setInterval(() => {
          setScanProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              setIsScanning(false);
              loadSecurityData(); // Refresh data after scan
              return 100;
            }
            return prev + 10;
          });
        }, 500);
      } else {
        throw new Error('Failed to start security scan');
      }
    } catch (error) {
      console.error('Failed to run security scan:', error);
      setIsScanning(false);
      alert('Failed to run security scan. Please try again.');
    }
  };

  const resolveThreat = async (threatId: string) => {
    try {
      const response = await fetch(`/api/security/threats/${threatId}/resolve`, {
        method: 'POST'
      });
      
      if (response.ok) {
        loadThreats();
        alert('Threat resolved successfully!');
      } else {
        throw new Error('Failed to resolve threat');
      }
    } catch (error) {
      console.error('Failed to resolve threat:', error);
      alert('Failed to resolve threat. Please try again.');
    }
  };

  const patchVulnerability = async (vulnId: string) => {
    try {
      const response = await fetch(`/api/security/vulnerabilities/${vulnId}/patch`, {
        method: 'POST'
      });
      
      if (response.ok) {
        loadVulnerabilities();
        alert('Vulnerability patched successfully!');
      } else {
        throw new Error('Failed to patch vulnerability');
      }
    } catch (error) {
      console.error('Failed to patch vulnerability:', error);
      alert('Failed to patch vulnerability. Please try again.');
    }
  };

  const exportSecurityReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      stats: securityStats,
      threats: threats,
      events: events.slice(0, 100), // Last 100 events
      vulnerabilities: vulnerabilities
    };
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `security-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'malware':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'intrusion':
        return <Network className="w-5 h-5 text-orange-500" />;
      case 'phishing':
        return <Globe className="w-5 h-5 text-yellow-500" />;
      case 'ddos':
        return <Zap className="w-5 h-5 text-purple-500" />;
      case 'data_breach':
        return <Database className="w-5 h-5 text-red-600" />;
      case 'vulnerability':
        return <Shield className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-orange-600 text-white';
      case 'medium':
        return 'bg-yellow-600 text-white';
      case 'low':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  // Mock data functions
  const getMockSecurityStats = (): SecurityStats => ({
    totalThreats: 47,
    activeThreats: 12,
    resolvedThreats: 35,
    criticalThreats: 3,
    totalEvents: 2847,
    failedLogins: 23,
    successfulLogins: 156,
    vulnerabilityCount: 8,
    patchedVulnerabilities: 156,
    securityScore: 87,
    lastScan: new Date(Date.now() - 1000 * 60 * 30),
    uptime: '99.8%'
  });

  const getMockThreats = (): SecurityThreat[] => [
    {
      id: '1',
      type: 'malware',
      severity: 'critical',
      title: 'Suspicious File Detected',
      description: 'Malicious executable file detected in downloads folder',
      source: '192.168.1.100',
      target: 'User Downloads',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      status: 'active',
      impact: 'High - Potential data exfiltration',
      recommendation: 'Quarantine file and scan system'
    },
    {
      id: '2',
      type: 'intrusion',
      severity: 'high',
      title: 'Unauthorized Access Attempt',
      description: 'Multiple failed login attempts detected',
      source: '203.0.113.42',
      target: 'Admin Panel',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      status: 'investigating',
      impact: 'Medium - Potential system compromise',
      recommendation: 'Block IP and strengthen authentication'
    },
    {
      id: '3',
      type: 'phishing',
      severity: 'medium',
      title: 'Phishing Email Detected',
      description: 'Suspicious email with malicious attachment',
      source: 'phishing@fake-bank.com',
      target: 'User Inbox',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      status: 'resolved',
      impact: 'Low - Email quarantined',
      recommendation: 'User training on phishing awareness'
    }
  ];

  const getMockEvents = (): SecurityEvent[] => [
    {
      id: '1',
      type: 'login',
      user: 'admin@company.com',
      action: 'Successful login',
      resource: 'Admin Dashboard',
      ip: '192.168.1.50',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      success: true,
      details: 'Login from trusted IP address'
    },
    {
      id: '2',
      type: 'login',
      user: 'unknown@external.com',
      action: 'Failed login attempt',
      resource: 'Admin Dashboard',
      ip: '203.0.113.42',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      success: false,
      details: 'Invalid credentials provided'
    },
    {
      id: '3',
      type: 'file_access',
      user: 'john.doe@company.com',
      action: 'File accessed',
      resource: '/confidential/reports/',
      ip: '192.168.1.75',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      success: true,
      details: 'Read access to sensitive files'
    }
  ];

  const getMockVulnerabilities = (): VulnerabilityScan[] => [
    {
      id: '1',
      name: 'CVE-2024-1234 - SQL Injection',
      severity: 'high',
      cve: 'CVE-2024-1234',
      description: 'SQL injection vulnerability in user authentication',
      affected_systems: ['Web Server', 'Database Server'],
      remediation: 'Update to latest version and sanitize inputs',
      discovered: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: 'open'
    },
    {
      id: '2',
      name: 'CVE-2024-5678 - Cross-Site Scripting',
      severity: 'medium',
      cve: 'CVE-2024-5678',
      description: 'XSS vulnerability in user input fields',
      affected_systems: ['Web Application'],
      remediation: 'Implement proper input validation and output encoding',
      discovered: new Date(Date.now() - 1000 * 60 * 60 * 48),
      status: 'patched'
    }
  ];

  const filteredThreats = threats.filter(threat => {
    const matchesSeverity = filterSeverity === 'all' || threat.severity === filterSeverity;
    const matchesSearch = searchQuery === '' || 
      threat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const filteredEvents = events.filter(event => {
    const matchesSearch = searchQuery === '' ||
      event.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.action.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex h-full bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-400 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading security data...</p>
            <p className="text-gray-400">Analyzing system security</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-red-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Security Dashboard</h1>
              <p className="text-gray-400">Monitor and manage system security</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={runSecurityScan}
              disabled={isScanning}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isScanning ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              {isScanning ? `Scanning... ${scanProgress}%` : 'Run Security Scan'}
            </Button>
            <Button
              onClick={exportSecurityReport}
              variant="outline"
              className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button
              onClick={loadSecurityData}
              variant="outline"
              className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Security Score */}
        {securityStats && (
          <div className="p-6 border-b border-white/10 bg-black/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Security Score</h3>
                <p className="text-gray-400">Overall system security rating</p>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold ${getSecurityScoreColor(securityStats.securityScore)}`}>
                  {securityStats.securityScore}/100
                </div>
                <p className="text-gray-400 text-sm">
                  Last scan: {securityStats.lastScan.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    securityStats.securityScore >= 90 ? 'bg-green-500' :
                    securityStats.securityScore >= 70 ? 'bg-yellow-500' :
                    securityStats.securityScore >= 50 ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${securityStats.securityScore}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        {securityStats && (
          <div className="p-6 border-b border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{securityStats.activeThreats}</p>
                  <p className="text-gray-400 text-sm">Active Threats</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{securityStats.resolvedThreats}</p>
                  <p className="text-gray-400 text-sm">Resolved</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <XCircle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{securityStats.failedLogins}</p>
                  <p className="text-gray-400 text-sm">Failed Logins</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{securityStats.vulnerabilityCount}</p>
                  <p className="text-gray-400 text-sm">Vulnerabilities</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <Activity className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{securityStats.totalEvents}</p>
                  <p className="text-gray-400 text-sm">Total Events</p>
                </CardContent>
              </Card>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{securityStats.uptime}</p>
                  <p className="text-gray-400 text-sm">System Uptime</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'threats', label: 'Threats', icon: AlertTriangle },
            { id: 'events', label: 'Events', icon: Activity },
            { id: 'vulnerabilities', label: 'Vulnerabilities', icon: Shield }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                selectedTab === tab.id
                  ? 'border-red-400 text-red-400 bg-red-400/10'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                {/* Recent Threats */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span>Recent Security Threats</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {threats.slice(0, 5).map(threat => (
                        <div key={threat.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                          <div className="flex items-center space-x-4">
                            {getThreatIcon(threat.type)}
                            <div>
                              <h4 className="text-white font-semibold">{threat.title}</h4>
                              <p className="text-gray-400 text-sm">{threat.description}</p>
                              <p className="text-gray-500 text-xs">
                                {threat.timestamp.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className={getSeverityColor(threat.severity)}>
                              {threat.severity}
                            </Badge>
                            {threat.status === 'active' && (
                              <Button
                                onClick={() => resolveThreat(threat.id)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                Resolve
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Security Recommendations */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Settings className="w-5 h-5 text-blue-400" />
                      <span>Security Recommendations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <Bell className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div>
                          <h4 className="text-white font-semibold">Enable Two-Factor Authentication</h4>
                          <p className="text-gray-400 text-sm">Add an extra layer of security to user accounts</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <Lock className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <h4 className="text-white font-semibold">Update Security Policies</h4>
                          <p className="text-gray-400 text-sm">Review and update password complexity requirements</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <Database className="w-5 h-5 text-green-400 mt-0.5" />
                        <div>
                          <h4 className="text-white font-semibold">Backup Critical Data</h4>
                          <p className="text-gray-400 text-sm">Ensure regular backups of important system data</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTab === 'threats' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search threats..."
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400 w-64"
                    />
                  </div>
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="bg-white/5 border border-white/20 text-white rounded px-3 py-2"
                  >
                    <option value="all">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                {/* Threats List */}
                <div className="space-y-4">
                  {filteredThreats.map(threat => (
                    <Card key={threat.id} className="bg-white/5 border-white/10">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            {getThreatIcon(threat.type)}
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="text-white font-semibold">{threat.title}</h4>
                                <Badge className={getSeverityColor(threat.severity)}>
                                  {threat.severity}
                                </Badge>
                                <Badge variant="outline" className="text-gray-400 border-gray-400">
                                  {threat.status}
                                </Badge>
                              </div>
                              <p className="text-gray-300 mb-3">{threat.description}</p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-400">Source</p>
                                  <p className="text-white">{threat.source}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Target</p>
                                  <p className="text-white">{threat.target}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Impact</p>
                                  <p className="text-white">{threat.impact}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Detected</p>
                                  <p className="text-white">{threat.timestamp.toLocaleString()}</p>
                                </div>
                              </div>
                              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                                <p className="text-blue-400 font-medium">Recommendation:</p>
                                <p className="text-gray-300">{threat.recommendation}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            {threat.status === 'active' && (
                              <Button
                                onClick={() => resolveThreat(threat.id)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                Resolve
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-gray-400 border-gray-400 hover:bg-gray-400 hover:text-white"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'events' && (
              <div className="space-y-6">
                {/* Events List */}
                <div className="space-y-4">
                  {filteredEvents.map(event => (
                    <Card key={event.id} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${event.success ? 'bg-green-500' : 'bg-red-500'}`} />
                            <div>
                              <h4 className="text-white font-semibold">{event.action}</h4>
                              <p className="text-gray-400 text-sm">
                                {event.user} • {event.resource} • {event.ip}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {event.timestamp.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className={event.success ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'}>
                            {event.success ? 'Success' : 'Failed'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'vulnerabilities' && (
              <div className="space-y-6">
                {/* Vulnerabilities List */}
                <div className="space-y-4">
                  {vulnerabilities.map(vuln => (
                    <Card key={vuln.id} className="bg-white/5 border-white/10">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-white font-semibold">{vuln.name}</h4>
                              <Badge className={getSeverityColor(vuln.severity)}>
                                {vuln.severity}
                              </Badge>
                              <Badge variant="outline" className="text-gray-400 border-gray-400">
                                {vuln.status}
                              </Badge>
                            </div>
                            <p className="text-gray-300 mb-3">{vuln.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                              <div>
                                <p className="text-gray-400">CVE ID</p>
                                <p className="text-white font-mono">{vuln.cve}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Affected Systems</p>
                                <p className="text-white">{vuln.affected_systems.join(', ')}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Discovered</p>
                                <p className="text-white">{vuln.discovered.toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                              <p className="text-green-400 font-medium">Remediation:</p>
                              <p className="text-gray-300">{vuln.remediation}</p>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 ml-4">
                            {vuln.status === 'open' && (
                              <Button
                                onClick={() => patchVulnerability(vuln.id)}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Patch
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-gray-400 border-gray-400 hover:bg-gray-400 hover:text-white"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
