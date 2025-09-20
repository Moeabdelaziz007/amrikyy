// Mobile Analytics Components - Part 1
// Reusable components optimized for mobile devices

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  TrendingDown,
  Smartphone,
  Tablet,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2
} from 'lucide-react';

// Mobile Detection Hook
export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile, isTablet, isDesktop };
};

// Mobile Analytics Card Component
interface MobileAnalyticsCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
  description?: string;
  className?: string;
}

export const MobileAnalyticsCard: React.FC<MobileAnalyticsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  description,
  className = ''
}) => {
  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'decrease':
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-500';
      case 'decrease':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className={`p-3 ${className}`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-xs font-medium text-muted-foreground">{title}</span>
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-xs ${getChangeColor()}`}>
              {getChangeIcon()}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="text-lg font-bold">{value}</div>
          {description && (
            <div className="text-xs text-muted-foreground">{description}</div>
          )}
        </div>
      </div>
    </Card>
  );
};

