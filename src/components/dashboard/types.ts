// Dashboard Component Types

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  status?: 'running' | 'error' | 'warning' | 'idle';
  title?: string;
  subtitle?: string;
  glowColor?: 'green' | 'blue' | 'purple' | 'red' | 'yellow';
  animate?: boolean;
}

export interface StatusWidgetProps {
  label: string;
  value: string | number;
  type?: 'success' | 'error' | 'warning' | 'info' | 'default';
  icon?: React.ReactNode;
  animate?: boolean;
  onClick?: () => void;
}

export interface ControlButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  glowOnHover?: boolean;
}

export interface ClientCardProps {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'error' | 'warning' | 'idle';
  successCount: number;
  errorCount: number;
  lastActivity?: string;
  onStart?: () => void;
  onStop?: () => void;
  onRestart?: () => void;
  onEmergencyStop?: () => void;
  onViewLogs?: () => void;
}

export interface Client {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'error' | 'warning' | 'idle';
  successCount: number;
  errorCount: number;
  lastActivity?: string;
}

export interface SystemStats {
  totalOperations: number;
  successRate: number;
  activeClients: number;
  uptime: string;
}

export interface ActivityItem {
  time: string;
  event: string;
  type: 'success' | 'warning' | 'info' | 'error';
  icon: string;
}
