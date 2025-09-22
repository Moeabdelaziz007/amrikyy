// Mobile Analytics Components - Part 3
// Charts, buttons, and utility components

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertTriangle,
  Loader2,
  Smartphone,
  Tablet,
  Monitor,
} from 'lucide-react';

// Mobile Performance Chart Component
interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface MobilePerformanceChartProps {
  data: ChartData[];
  title: string;
  className?: string;
}

export const MobilePerformanceChart: React.FC<MobilePerformanceChartProps> = ({
  data,
  title,
  className = '',
}) => {
  return (
    <Card className={`p-4 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{item.label}</span>
              <Badge
                variant="outline"
                style={{ backgroundColor: item.color, color: 'white' }}
              >
                {item.value}%
              </Badge>
            </div>
            <Progress
              value={item.value}
              className="h-2"
              style={{
                backgroundColor: `${item.color}20`,
                '--progress-background': item.color,
              }}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// Mobile Action Button Component
interface MobileActionButtonProps {
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export const MobileActionButton: React.FC<MobileActionButtonProps> = ({
  icon,
  label,
  onClick,
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center gap-2 ${className}`}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      <span className="text-sm">{label}</span>
    </Button>
  );
};

// Mobile Loading Skeleton Component
interface MobileLoadingSkeletonProps {
  lines?: number;
  className?: string;
}

export const MobileLoadingSkeleton: React.FC<MobileLoadingSkeletonProps> = ({
  lines = 3,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Card key={index} className="p-4">
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
          </div>
        </Card>
      ))}
    </div>
  );
};

// Mobile Error State Component
interface MobileErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const MobileErrorState: React.FC<MobileErrorStateProps> = ({
  title,
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
};

// Mobile Device Info Component
export const MobileDeviceInfo: React.FC = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    userAgent: '',
    platform: '',
    language: '',
    timezone: '',
    screenResolution: '',
    viewport: '',
  });

  useEffect(() => {
    setDeviceInfo({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
    });
  }, []);

  const getDeviceIcon = () => {
    const width = window.innerWidth;
    if (width < 768) return <Smartphone className="w-4 h-4" />;
    if (width < 1024) return <Tablet className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const getDeviceType = () => {
    const width = window.innerWidth;
    if (width < 768) return 'Mobile';
    if (width < 1024) return 'Tablet';
    return 'Desktop';
  };

  return (
    <Card className="p-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          {getDeviceIcon()}
          Device Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="font-medium">Type:</span>
            <Badge variant="outline" className="ml-1">
              {getDeviceType()}
            </Badge>
          </div>
          <div>
            <span className="font-medium">Platform:</span>
            <span className="ml-1">{deviceInfo.platform}</span>
          </div>
          <div>
            <span className="font-medium">Language:</span>
            <span className="ml-1">{deviceInfo.language}</span>
          </div>
          <div>
            <span className="font-medium">Timezone:</span>
            <span className="ml-1">{deviceInfo.timezone}</span>
          </div>
          <div>
            <span className="font-medium">Screen:</span>
            <span className="ml-1">{deviceInfo.screenResolution}</span>
          </div>
          <div>
            <span className="font-medium">Viewport:</span>
            <span className="ml-1">{deviceInfo.viewport}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
