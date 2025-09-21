// Mobile Analytics Components - Part 2
// Swipeable tabs and collapsible sections

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Mobile Swipeable Tabs Component
interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface MobileSwipeableTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const MobileSwipeableTabs: React.FC<MobileSwipeableTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = ''
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
      let newIndex = currentIndex;

      if (isLeftSwipe && currentIndex < tabs.length - 1) {
        newIndex = currentIndex + 1;
      } else if (isRightSwipe && currentIndex > 0) {
        newIndex = currentIndex - 1;
      }

      if (newIndex !== currentIndex) {
        onTabChange(tabs[newIndex].id);
      }
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange(tab.id)}
            className="flex-1 flex items-center gap-2"
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className="min-h-[400px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

// Mobile Collapsible Section Component
interface MobileCollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const MobileCollapsibleSection: React.FC<MobileCollapsibleSectionProps> = ({
  title,
  icon,
  children,
  defaultOpen = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className={`${className}`}>
      <CardHeader 
        className="pb-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-sm">{title}</CardTitle>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}
    </Card>
  );
};


