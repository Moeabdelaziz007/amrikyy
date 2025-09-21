import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../dashboard/GlassCard';

interface ActivityEvent {
  id: string;
  timestamp: number;
  type: 'system' | 'agent' | 'automation' | 'user' | 'error' | 'success';
  level: 'info' | 'warning' | 'error' | 'success' | 'debug';
  source: string;
  message: string;
  details?: any;
  duration?: number;
}

interface LiveActivityPanelProps {
  className?: string;
}

export const LiveActivityPanel: React.FC<LiveActivityPanelProps> = ({ className = '' }) => {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [filter, setFilter] = useState<'all' | ActivityEvent['type']>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | ActivityEvent['level']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Mock real-time events generator
  useEffect(() => {
    if (isPaused) return;

    const eventTypes: ActivityEvent['type'][] = ['system', 'agent', 'automation', 'user', 'error', 'success'];
    const levels: ActivityEvent['level'][] = ['info', 'warning', 'error', 'success', 'debug'];
    const sources = ['Telegram Bot', 'AI Analysis', 'Workflow Engine', 'GitHub Integration', 'Notification Service', 'Data Processor'];
    
    const messages = {
      system: ['System maintenance scheduled', 'Configuration updated', 'Service restarted', 'Cache cleared'],
      agent: ['Agent started processing', 'Agent completed task', 'Agent encountered issue', 'Agent status changed'],
      automation: ['Workflow triggered', 'Automation completed', 'Scheduled task executed', 'Process automated'],
      user: ['User logged in', 'User action performed', 'User preference updated', 'User session started'],
      error: ['Connection failed', 'Processing error', 'Validation failed', 'Timeout occurred'],
      success: ['Operation completed', 'Task successful', 'Integration active', 'Process completed']
    };

    const interval = setInterval(() => {
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const level = levels[Math.floor(Math.random() * levels.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const messageList = messages[type] || ['Event occurred'];
      const message = messageList[Math.floor(Math.random() * messageList.length)];

      const newEvent: ActivityEvent = {
        id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: Date.now(),
        type,
        level,
        source,
        message,
        details: Math.random() > 0.7 ? { duration: Math.floor(Math.random() * 5000) } : undefined
      };

      setEvents(prev => [...prev.slice(-99), newEvent]);
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events, autoScroll]);

  const filteredEvents = events.filter(event => {
    const matchesType = filter === 'all' || event.type === filter;
    const matchesLevel = levelFilter === 'all' || event.level === levelFilter;
    const matchesSearch = searchQuery === '' || 
      event.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.source.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesLevel && matchesSearch;
  });

  const getEventIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'system': return '⚙️';
      case 'agent': return '🤖';
      case 'automation': return '🔄';
      case 'user': return '👤';
      case 'error': return '❌';
      case 'success': return '✅';
      default: return '📋';
    }
  };

  const getLevelColor = (level: ActivityEvent['level']) => {
    switch (level) {
      case 'success': return 'text-status-success border-status-success bg-status-success-bg';
      case 'warning': return 'text-status-warning border-status-warning bg-status-warning-bg';
      case 'error': return 'text-status-error border-status-error bg-status-error-bg';
      case 'info': return 'text-status-info border-status-info bg-status-info-bg';
      case 'debug': return 'text-text-secondary border-glass-border bg-glass-secondary';
      default: return 'text-text-primary border-glass-border bg-glass-primary';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const clearEvents = () => {
    setEvents([]);
  };

  const exportEvents = () => {
    const dataStr = JSON.stringify(filteredEvents, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `auraos-activity-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <GlassCard
      title="Live Activity Monitor"
      subtitle="Real-time System Events & Automation"
      glowColor="green"
      className={className}
    >
      {/* Control Panel */}
      <div className="mb-4 space-y-3">
        {/* Search and Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-glass-primary border border-glass-border rounded-lg text-text-primary placeholder-text-secondary focus:border-cyber-blue focus:outline-none focus:ring-2 focus:ring-cyber-blue/20"
            />
            <div className="absolute right-3 top-2.5 text-text-secondary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 bg-glass-primary border border-glass-border rounded-lg text-text-primary focus:border-cyber-blue focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="system">System</option>
            <option value="agent">Agent</option>
            <option value="automation">Automation</option>
            <option value="user">User</option>
            <option value="error">Error</option>
            <option value="success">Success</option>
          </select>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as any)}
            className="px-3 py-2 bg-glass-primary border border-glass-border rounded-lg text-text-primary focus:border-cyber-blue focus:outline-none"
          >
            <option value="all">All Levels</option>
            <option value="success">Success</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="debug">Debug</option>
          </select>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isPaused 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-glow-green-sm' 
                  : 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-glow-red-sm'
              }`}
            >
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </button>
            <button
              onClick={clearEvents}
              className="px-4 py-2 bg-glass-secondary text-text-primary rounded-lg text-sm font-medium hover:bg-glass-primary transition-all duration-200"
            >
              🗑️ Clear
            </button>
            <button
              onClick={exportEvents}
              className="px-4 py-2 bg-glass-secondary text-text-primary rounded-lg text-sm font-medium hover:bg-glass-primary transition-all duration-200"
            >
              📥 Export
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="rounded"
              />
              Auto-scroll
            </label>
            <div className="text-sm text-text-secondary">
              {filteredEvents.length} events
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="h-96 overflow-auto cyber-scrollbar bg-glass-primary rounded-lg border border-glass-border">
        {filteredEvents.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-secondary">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-sm">No events match your filters</div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className={`p-3 rounded-lg border backdrop-blur-sm transition-all duration-200 hover:shadow-glow-blue-sm ${getLevelColor(event.level)}`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeInUp 0.3s ease-out forwards'
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-lg mt-0.5">{getEventIcon(event.type)}</div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-text-secondary">
                        {formatTimestamp(event.timestamp)}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${
                        event.level === 'success' ? 'bg-status-success text-white' :
                        event.level === 'warning' ? 'bg-status-warning text-white' :
                        event.level === 'error' ? 'bg-status-error text-white' :
                        event.level === 'info' ? 'bg-status-info text-white' :
                        'bg-glass-secondary text-text-secondary'
                      }`}>
                        {event.level}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-glass-secondary rounded-full border border-glass-border">
                        {event.source}
                      </span>
                    </div>
                    
                    <div className="text-sm font-medium mb-1">
                      {event.message}
                    </div>
                    
                    {event.details && (
                      <div className="text-xs text-text-secondary">
                        Duration: {event.details.duration}ms
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full ${
                      event.level === 'success' ? 'bg-status-success animate-pulse' :
                      event.level === 'warning' ? 'bg-status-warning animate-pulse' :
                      event.level === 'error' ? 'bg-status-error animate-pulse' :
                      event.level === 'info' ? 'bg-status-info animate-pulse' :
                      'bg-glass-border'
                    }`} />
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Activity Stats */}
      <div className="mt-4 grid grid-cols-5 gap-3 pt-4 border-t border-glass-border">
        <div className="text-center">
          <div className="text-lg font-bold text-status-success">
            {events.filter(e => e.level === 'success').length}
          </div>
          <div className="text-xs text-text-secondary">Success</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-status-info">
            {events.filter(e => e.level === 'info').length}
          </div>
          <div className="text-xs text-text-secondary">Info</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-status-warning">
            {events.filter(e => e.level === 'warning').length}
          </div>
          <div className="text-xs text-text-secondary">Warning</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-status-error">
            {events.filter(e => e.level === 'error').length}
          </div>
          <div className="text-xs text-text-secondary">Error</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-text-primary">
            {events.length}
          </div>
          <div className="text-xs text-text-secondary">Total</div>
        </div>
      </div>
    </GlassCard>
  );
};

export default LiveActivityPanel;
