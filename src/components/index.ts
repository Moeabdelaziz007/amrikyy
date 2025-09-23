// AuraOS Components Export Index

// OS Components
export { OSDesktop } from './os/OSDesktop';
export { AppDock } from './os/AppDock';
export { AppWindow } from './os/AppWindow';
export { WindowManager } from './os/WindowManager';

// AI Applications
export { AIChatbotApp } from './apps/AIChatbotApp';
export { AINotesApp } from './apps/AINotesApp';
export { AITravelApp } from './apps/AITravelApp';
export { AICalculatorApp } from './apps/AICalculatorApp';
export { AIWeatherApp } from './apps/AIWeatherApp';
export { SettingsApp } from './apps/SettingsApp';

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
  ClientCardProps,
} from './dashboard/types';

// Default OS Desktop export for convenience
export { OSDesktop as default } from './os/OSDesktop';
