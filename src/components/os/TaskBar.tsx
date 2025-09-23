import { Search, Calendar, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const TaskBar = () => {
  const currentTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const currentDate = new Date().toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 glass border-t border-white/10 flex items-center justify-between px-6 z-40">
      {/* Start Menu Area */}
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
          <span className="text-white font-bold text-sm">AI</span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search apps, files..."
            className="w-64 pl-10 glass border-white/20 bg-white/5"
          />
        </div>
      </div>

      {/* System Tray */}
      <div className="flex items-center space-x-4 text-sm">
        <div className="flex items-center space-x-2 text-foreground/80">
          <Calendar className="w-4 h-4" />
          <span>{currentDate}</span>
        </div>
        <div className="flex items-center space-x-2 text-foreground/80">
          <Clock className="w-4 h-4" />
          <span>{currentTime}</span>
        </div>
      </div>
    </div>
  );
};
