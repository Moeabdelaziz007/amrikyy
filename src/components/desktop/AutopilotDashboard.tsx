import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Brain,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface AutopilotDashboardProps {
  onExecute?: (data: any) => void;
}

interface AutopilotTask {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  estimatedDuration: number;
  description: string;
}

interface AutopilotStatus {
  isActive: boolean;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageExecutionTime: number;
  efficiency: number;
  lastActivity: Date;
}

interface AutopilotMetrics {
  tasksPerHour: number;
  successRate: number;
  averageTaskDuration: number;
  systemLoad: number;
}

export default function AutopilotDashboard({ onExecute }: AutopilotDashboardProps) {
  const [autopilotStatus, setAutopilotStatus] = useState<AutopilotStatus>({
    isActive: false,
    totalTasks: 0,
    completedTasks: 0,
    failedTasks: 0,
    averageExecutionTime: 0,
    efficiency: 0,
    lastActivity: new Date()
  });
  
  const [tasks, setTasks] = useState<AutopilotTask[]>([]);
  const [metrics, setMetrics] = useState<AutopilotMetrics>({
    tasksPerHour: 0,
    successRate: 0,
    averageTaskDuration: 0,
    systemLoad: 0
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [autopilotSettings, setAutopilotSettings] = useState({
    maxConcurrentTasks: 5,
    autoRetryFailedTasks: true,
    smartScheduling: true,
    energyOptimization: true,
    learningMode: true
  });

  // Load autopilot data
  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    loadAutopilotStatus();
    loadTasks();
    loadMetrics();
  }, []);

  const loadAutopilotStatus = async () => {
    try {
      const status = await apiClient.request('/api/autopilot/status');
      setAutopilotStatus(status);
    } catch (err) {
      console.warn('Failed to load autopilot status:', err);
      // Use mock data for development
      setAutopilotStatus({
        isActive: true,
        totalTasks: 24,
        completedTasks: 18,
        failedTasks: 2,
        averageExecutionTime: 45,
        efficiency: 85,
        lastActivity: new Date()
      });
    }
  };

  const loadTasks = async () => {
    try {
      const response = await apiClient.request('/api/autopilot/tasks');
      setTasks(response.tasks || []);
    } catch (err) {
      console.warn('Failed to load tasks:', err);
      // Use mock data for development
      setTasks([
        {
          id: '1',
          name: 'System Optimization',
          status: 'running',
          progress: 75,
          priority: 'high',
          createdAt: new Date(Date.now() - 300000),
          estimatedDuration: 300,
          description: 'Optimizing system performance and memory usage'
        },
        {
          id: '2',
          name: 'Data Backup',
          status: 'completed',
          progress: 100,
          priority: 'medium',
          createdAt: new Date(Date.now() - 600000),
          estimatedDuration: 180,
          description: 'Automated backup of user data and configurations'
        },
        {
          id: '3',
          name: 'Security Scan',
          status: 'pending',
          progress: 0,
          priority: 'high',
          createdAt: new Date(Date.now() - 120000),
          estimatedDuration: 600,
          description: 'Comprehensive security vulnerability scan'
        },
        {
          id: '4',
          name: 'Cache Cleanup',
          status: 'failed',
          progress: 30,
          priority: 'low',
          createdAt: new Date(Date.now() - 900000),
          estimatedDuration: 120,
          description: 'Cleaning up temporary files and cache'
        }
      ]);
    }
  };

  const loadMetrics = async () => {
    try {
      const response = await apiClient.request('/api/autopilot/metrics');
      setMetrics(response);
    } catch (err) {
      console.warn('Failed to load metrics:', err);
      // Use mock data for development
      setMetrics({
        tasksPerHour: 12,
        successRate: 87.5,
        averageTaskDuration: 180,
        systemLoad: 65
      });
    }
  };

  const toggleAutopilot = async () => {
    setIsLoading(true);
    try {
      const action = autopilotStatus.isActive ? 'stop' : 'start';
      await apiClient.request(`/api/autopilot/${action}`, { method: 'POST' });
      
      setAutopilotStatus(prev => ({ ...prev, isActive: !prev.isActive }));
      onExecute?.({ action, status: !autopilotStatus.isActive });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle autopilot');
    } finally {
      setIsLoading(false);
    }
  };

  const executeTask = async (taskId: string) => {
    setIsLoading(true);
    try {
      await apiClient.request(`/api/autopilot/tasks/${taskId}/execute`, { method: 'POST' });
      loadTasks(); // Refresh tasks
      onExecute?.({ action: 'execute_task', taskId });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute task');
    } finally {
      setIsLoading(false);
    }
  };

  const retryTask = async (taskId: string) => {
    setIsLoading(true);
    try {
      await apiClient.request(`/api/autopilot/tasks/${taskId}/retry`, { method: 'POST' });
      loadTasks(); // Refresh tasks
      onExecute?.({ action: 'retry_task', taskId });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retry task');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Autopilot Dashboard
        </CardTitle>
        <CardDescription>
          Monitor and control automated tasks and system optimization
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Status Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Autopilot Status</p>
                      <Badge variant={autopilotStatus.isActive ? 'default' : 'secondary'}>
                        {autopilotStatus.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <Brain className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Efficiency</p>
                      <p className="text-2xl font-bold">{autopilotStatus.efficiency}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Completed Tasks</p>
                      <p className="text-2xl font-bold">{autopilotStatus.completedTasks}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Failed Tasks</p>
                      <p className="text-2xl font-bold">{autopilotStatus.failedTasks}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Control Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={toggleAutopilot} 
                disabled={isLoading}
                variant={autopilotStatus.isActive ? 'destructive' : 'default'}
              >
                {autopilotStatus.isActive ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Stop Autopilot
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Autopilot
                  </>
                )}
              </Button>
              
              <Button variant="outline" onClick={loadAutopilotStatus}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks" className="space-y-4">
            <div className="space-y-3">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        <h4 className="font-medium">{task.name}</h4>
                        <Badge variant={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        {task.status === 'failed' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => retryTask(task.id)}
                          >
                            Retry
                          </Button>
                        )}
                        {task.status === 'pending' && (
                          <Button 
                            size="sm"
                            onClick={() => executeTask(task.id)}
                          >
                            Execute
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Created: {task.createdAt.toLocaleTimeString()}</span>
                      <span>Duration: {task.estimatedDuration}s</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4" />
                    <span className="text-sm font-medium">Tasks per Hour</span>
                  </div>
                  <p className="text-2xl font-bold">{metrics.tasksPerHour}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">Success Rate</span>
                  </div>
                  <p className="text-2xl font-bold">{metrics.successRate}%</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Avg Duration</span>
                  </div>
                  <p className="text-2xl font-bold">{metrics.averageTaskDuration}s</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm font-medium">System Load</span>
                  </div>
                  <p className="text-2xl font-bold">{metrics.systemLoad}%</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Max Concurrent Tasks</label>
                <input
                  type="number"
                  value={autopilotSettings.maxConcurrentTasks}
                  onChange={(e) => setAutopilotSettings(prev => ({ 
                    ...prev, 
                    maxConcurrentTasks: parseInt(e.target.value) 
                  }))}
                  className="w-20 px-2 py-1 border rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto Retry Failed Tasks</label>
                <input
                  type="checkbox"
                  checked={autopilotSettings.autoRetryFailedTasks}
                  onChange={(e) => setAutopilotSettings(prev => ({ 
                    ...prev, 
                    autoRetryFailedTasks: e.target.checked 
                  }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Smart Scheduling</label>
                <input
                  type="checkbox"
                  checked={autopilotSettings.smartScheduling}
                  onChange={(e) => setAutopilotSettings(prev => ({ 
                    ...prev, 
                    smartScheduling: e.target.checked 
                  }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Energy Optimization</label>
                <input
                  type="checkbox"
                  checked={autopilotSettings.energyOptimization}
                  onChange={(e) => setAutopilotSettings(prev => ({ 
                    ...prev, 
                    energyOptimization: e.target.checked 
                  }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Learning Mode</label>
                <input
                  type="checkbox"
                  checked={autopilotSettings.learningMode}
                  onChange={(e) => setAutopilotSettings(prev => ({ 
                    ...prev, 
                    learningMode: e.target.checked 
                  }))}
                />
              </div>
              
              <Button onClick={() => onExecute?.({ action: 'save_settings', settings: autopilotSettings })}>
                <Settings className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {error && (
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
