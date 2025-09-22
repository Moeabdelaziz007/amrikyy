// Automated Reports Component
// AI-generated reports and automated insights

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Download,
  RefreshCw,
  Clock,
  Calendar,
  Settings,
  Bell,
  Zap,
  BarChart3,
  TrendingUp,
  Users,
  Shield,
  Eye,
  Brain,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';
import AdvancedAnalyticsService, {
  AutomatedReport,
} from '../../lib/advanced-analytics-service';

interface AutomatedReportsProps {
  userId: string;
}

export const AutomatedReports: React.FC<AutomatedReportsProps> = ({
  userId,
}) => {
  const [reports, setReports] = useState<AutomatedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<AutomatedReport | null>(
    null
  );
  const [showScheduled, setShowScheduled] = useState(false);

  useEffect(() => {
    loadReports();
    setupRealTimeUpdates();
  }, [userId, showScheduled]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real implementation, this would fetch reports from the database
      const mockReports: AutomatedReport[] = [
        {
          id: 'report_1',
          userId,
          type: 'daily',
          title: 'Daily Analytics Report',
          content:
            '# Daily Analytics Report\n\n## Summary\n- Total Actions: 156\n- Sessions: 8\n- Engagement Score: 78/100\n\n## Key Insights\n- User engagement increased by 12%\n- Most used feature: Chat\n- Peak activity: 2-4 PM',
          insights: [],
          metrics: [],
          generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          scheduledFor: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours from now
        },
        {
          id: 'report_2',
          userId,
          type: 'weekly',
          title: 'Weekly Performance Report',
          content:
            '# Weekly Performance Report\n\n## Performance Metrics\n- Average session duration: 18 minutes\n- Error rate: 1.2%\n- Feature adoption: 6 features\n\n## Recommendations\n- Optimize loading times\n- Add more engaging content',
          insights: [],
          metrics: [],
          generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          scheduledFor: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
        },
        {
          id: 'report_3',
          userId,
          type: 'monthly',
          title: 'Monthly Security Report',
          content:
            '# Monthly Security Report\n\n## Security Overview\n- Total alerts: 3\n- Critical issues: 0\n- Resolved issues: 3\n\n## Security Metrics\n- Threat detection rate: 99.8%\n- Response time: 2.3s',
          insights: [],
          metrics: [],
          generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
          scheduledFor: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000), // 23 days from now
        },
      ];

      setReports(mockReports);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    const interval = setInterval(
      async () => {
        try {
          // Check for new reports
          await loadReports();
        } catch (err) {
          console.error('Failed to update reports:', err);
        }
      },
      5 * 60 * 1000
    ); // Update every 5 minutes

    return () => clearInterval(interval);
  };

  const handleRefresh = () => {
    loadReports();
  };

  const handleGenerateReport = async (
    type: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  ) => {
    try {
      setLoading(true);
      const report = await AdvancedAnalyticsService.generateAutomatedReport(
        userId,
        type
      );
      setReports(prev => [report, ...prev]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate report'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (report: AutomatedReport) => {
    const blob = new Blob([report.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.toLowerCase().replace(/\s+/g, '-')}-${report.generatedAt.toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteReport = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'daily':
        return <Clock className="h-5 w-5" />;
      case 'weekly':
        return <Calendar className="h-5 w-5" />;
      case 'monthly':
        return <BarChart3 className="h-5 w-5" />;
      case 'quarterly':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getReportColor = (type: string) => {
    switch (type) {
      case 'daily':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'weekly':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'monthly':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'quarterly':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getReportLabel = (type: string) => {
    switch (type) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'quarterly':
        return 'Quarterly';
      default:
        return type;
    }
  };

  const filteredReports = showScheduled
    ? reports.filter(r => r.scheduledFor > new Date())
    : reports.filter(r => r.generatedAt <= new Date());

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading automated reports...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Automated Reports</h2>
          <p className="text-muted-foreground">
            AI-generated reports and automated insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={() => setShowScheduled(!showScheduled)}
            variant="outline"
            size="sm"
          >
            <Calendar className="h-4 w-4 mr-2" />
            {showScheduled ? 'Show Generated' : 'Show Scheduled'}
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button
          onClick={() => handleGenerateReport('daily')}
          variant="outline"
          className="h-20 flex flex-col items-center justify-center space-y-2"
        >
          <Clock className="h-6 w-6" />
          <span>Generate Daily Report</span>
        </Button>
        <Button
          onClick={() => handleGenerateReport('weekly')}
          variant="outline"
          className="h-20 flex flex-col items-center justify-center space-y-2"
        >
          <Calendar className="h-6 w-6" />
          <span>Generate Weekly Report</span>
        </Button>
        <Button
          onClick={() => handleGenerateReport('monthly')}
          variant="outline"
          className="h-20 flex flex-col items-center justify-center space-y-2"
        >
          <BarChart3 className="h-6 w-6" />
          <span>Generate Monthly Report</span>
        </Button>
        <Button
          onClick={() => handleGenerateReport('quarterly')}
          variant="outline"
          className="h-20 flex flex-col items-center justify-center space-y-2"
        >
          <TrendingUp className="h-6 w-6" />
          <span>Generate Quarterly Report</span>
        </Button>
      </div>

      {/* Reports Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">
              {filteredReports.length}{' '}
              {showScheduled ? 'scheduled' : 'generated'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Reports</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {reports.filter(r => r.type === 'daily').length}
            </div>
            <p className="text-xs text-muted-foreground">Generated today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Weekly Reports
            </CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reports.filter(r => r.type === 'weekly').length}
            </div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Reports
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {reports.filter(r => r.type === 'monthly').length}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reports List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Generated Reports</CardTitle>
                <CardDescription>
                  Recently generated automated reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredReports.map(report => (
                    <div
                      key={report.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedReport?.id === report.id
                          ? 'bg-accent'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {getReportIcon(report.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${getReportColor(report.type)}`}
                            >
                              {getReportLabel(report.type)}
                            </Badge>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleDownloadReport(report);
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleDeleteReport(report.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <h3 className="font-medium mb-2">{report.title}</h3>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>
                              Generated: {report.generatedAt.toLocaleString()}
                            </span>
                            <span>
                              Next: {report.scheduledFor.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Report Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Report Preview</CardTitle>
                <CardDescription>
                  {selectedReport
                    ? 'Selected report content'
                    : 'Select a report to view content'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedReport ? (
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-2">
                        Report Type
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getReportColor(selectedReport.type)}`}
                      >
                        {getReportLabel(selectedReport.type)}
                      </Badge>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Generated</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedReport.generatedAt.toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">
                        Next Scheduled
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedReport.scheduledFor.toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">
                        Content Preview
                      </div>
                      <div className="text-sm text-muted-foreground max-h-40 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-xs">
                          {selectedReport.content.substring(0, 300)}
                          {selectedReport.content.length > 300 && '...'}
                        </pre>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDownloadReport(selectedReport)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedReport(null)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Full
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Click on a report to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Upcoming automated report generations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports
                  .filter(r => r.scheduledFor > new Date())
                  .map(report => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {getReportIcon(report.type)}
                        <div>
                          <div className="font-medium">{report.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Scheduled for:{' '}
                            {report.scheduledFor.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getReportColor(report.type)}`}
                        >
                          {getReportLabel(report.type)}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Pause className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Report Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Report Templates</CardTitle>
                <CardDescription>Predefined report templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="h-4 w-4" />
                      <div>
                        <div className="text-sm font-medium">
                          Performance Summary
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Key performance metrics
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="h-4 w-4" />
                      <div>
                        <div className="text-sm font-medium">User Behavior</div>
                        <div className="text-xs text-muted-foreground">
                          User engagement patterns
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-4 w-4" />
                      <div>
                        <div className="text-sm font-medium">
                          Security Report
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Security alerts and threats
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Custom Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Templates</CardTitle>
                <CardDescription>
                  Create your own report templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Template Name</label>
                    <input
                      type="text"
                      placeholder="Enter template name"
                      className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Report Type</label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-md text-sm">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                      <option>Quarterly</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Include Sections
                    </label>
                    <div className="mt-1 space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded"
                        />
                        <span className="text-sm">Performance Metrics</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded"
                        />
                        <span className="text-sm">User Insights</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Security Alerts</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Recommendations</span>
                      </label>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure report notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">
                        Email Notifications
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Receive reports via email
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">
                        Push Notifications
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Browser push notifications
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Critical Alerts</div>
                      <div className="text-xs text-muted-foreground">
                        Immediate notifications
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule Settings</CardTitle>
                <CardDescription>
                  Configure report generation schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Daily Reports</label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-md text-sm">
                      <option>6:00 AM</option>
                      <option>9:00 AM</option>
                      <option>12:00 PM</option>
                      <option>6:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Weekly Reports
                    </label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-md text-sm">
                      <option>Monday</option>
                      <option>Tuesday</option>
                      <option>Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Monthly Reports
                    </label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-md text-sm">
                      <option>1st of month</option>
                      <option>15th of month</option>
                      <option>Last day of month</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomatedReports;
