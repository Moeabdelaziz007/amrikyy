'use client';

import React from 'react';
import { useLocation } from 'wouter';
import { Button } from './button';
import { 
  Sparkles, 
  Zap, 
  Palette, 
  TestTube,
  ArrowLeft,
  Home
} from 'lucide-react';

interface PopupNavigationProps {
  showBackButton?: boolean;
  showHomeButton?: boolean;
  title?: string;
  subtitle?: string;
}

export const PopupNavigation: React.FC<PopupNavigationProps> = ({
  showBackButton = true,
  showHomeButton = true,
  title = "Enhanced Popup System",
  subtitle = "Modern, accessible, and beautiful popup components"
}) => {
  const [, setLocation] = useLocation();

  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showHomeButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation('/')}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation('/popup-showcase')}
              className="gap-2"
            >
              <Palette className="w-4 h-4" />
              Showcase
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation('/popup-test')}
              className="gap-2"
            >
              <TestTube className="w-4 h-4" />
              Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick Access Component for Development
export const PopupQuickAccess: React.FC = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col gap-2">
        <Button
          size="sm"
          onClick={() => setLocation('/popup-showcase')}
          className="gap-2 shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          Showcase
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLocation('/popup-test')}
          className="gap-2 shadow-lg"
        >
          <TestTube className="w-4 h-4" />
          Test
        </Button>
      </div>
    </div>
  );
};

export default PopupNavigation;

