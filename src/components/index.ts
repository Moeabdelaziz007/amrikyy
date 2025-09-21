// AuraOS Components Export Index

// Dashboard Components
export { Dashboard } from './dashboard/Dashboard';
export { GlassCard } from './dashboard/GlassCard';
export { StatusWidget } from './dashboard/StatusWidget';
export { ControlButton } from './dashboard/ControlButton';
export { ClientCard } from './dashboard/ClientCard';

// Re-export types if needed
export type { 
  GlassCardProps,
  StatusWidgetProps,
  ControlButtonProps,
  ClientCardProps 
} from './dashboard/types';

// Default dashboard export for convenience
export default Dashboard;
