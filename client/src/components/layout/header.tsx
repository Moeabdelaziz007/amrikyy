import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, User, LogOut } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  showNotifications?: boolean;
  notificationCount?: number;
  user?: {
    name: string;
    avatar?: string;
    isOnline?: boolean;
  };
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
  onNotificationClick?: () => void;
}

/**
 * Enhanced Header Component with improved styling and functionality
 * 
 * Features:
 * - Modern glass morphism design
 * - Animated neon effects
 * - Notification system with badge
 * - User profile integration
 * - Responsive design
 * - Accessibility support
 */
export default function Header({
  title,
  subtitle,
  actions,
  showNotifications = true,
  notificationCount = 0,
  user,
  onSettingsClick,
  onProfileClick,
  onLogoutClick,
  onNotificationClick,
}: HeaderProps) {
  return (
    <header className="glass-card border-b border-border/50 px-6 py-4 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Title Section */}
        <div className="flex-1 min-w-0">
          <h1
            className="text-2xl font-bold neon-text animate-neon-flicker truncate"
            data-testid="text-page-title"
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="text-sm text-muted-foreground mt-1 truncate"
              data-testid="text-page-subtitle"
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-3 ml-4">
          {/* Custom Actions */}
          {actions}

          {/* Notifications */}
          {showNotifications && (
            <Button
              variant="ghost"
              size="sm"
              className="relative neon-glow-sm hover:neon-glow-md transition-all duration-300 p-2"
              onClick={onNotificationClick}
              data-testid="button-notifications"
              aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ''}`}
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-neon-pulse neon-glow-sm"
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Badge>
              )}
            </Button>
          )}

          {/* Settings */}
          {onSettingsClick && (
            <Button
              variant="ghost"
              size="sm"
              className="neon-glow-sm hover:neon-glow-md transition-all duration-300 p-2"
              onClick={onSettingsClick}
              data-testid="button-settings"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}

          {/* User Profile */}
          {user && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="neon-glow-sm hover:neon-glow-md transition-all duration-300 p-2"
                onClick={onProfileClick}
                data-testid="button-profile"
                aria-label={`User profile for ${user.name}`}
              >
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
                {user.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background animate-neon-pulse"></div>
                )}
              </Button>
              
              {/* User Name */}
              <span className="text-sm font-medium text-foreground hidden sm:block">
                {user.name}
              </span>

              {/* Logout */}
              {onLogoutClick && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="neon-glow-sm hover:neon-glow-md transition-all duration-300 p-2 text-destructive hover:text-destructive-foreground"
                  onClick={onLogoutClick}
                  data-testid="button-logout"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
