import React, { useEffect, useMemo, useRef, useState } from 'react';

interface LogEvent {
  id: string;
  ts: number;
  level: 'info' | 'warn' | 'error' | 'debug' | 'success';
  source?: string;
  message: string;
}

interface LiveLogsModalProps {
  open: boolean;
  onClose: () => void;
  clientId?: string;
  clientName?: string;
  initialFilterLevel?: 'all' | LogEvent['level'];
}

export const LiveLogsModal: React.FC<LiveLogsModalProps> = ({
  open,
  onClose,
  clientId,
  clientName,
  initialFilterLevel = 'all',
}) => {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<'all' | LogEvent['level']>(initialFilterLevel);
  const [events, setEvents] = useState<LogEvent[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [autoscroll, setAutoscroll] = useState(true);

  useEffect(() => {
    if (!open) return;
    let canceled = false;
    // Mock stream: replace with real-time source integration
    const levels: LogEvent['level'][] = ['info', 'warn', 'error', 'debug', 'success'];
    const interval = setInterval(() => {
      if (canceled) return;
      const lv = levels[Math.floor(Math.random() * levels.length)];
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setEvents(prev => [
        ...prev,
        {
          id,
          ts: Date.now(),
          level: lv,
          source: clientId || 'system',
          message: `${clientName || 'Client'}: ${lv.toUpperCase()} sample event ${id}`
        }
      ].slice(-500));
    }, 900);
    return () => {
      canceled = true;
      clearInterval(interval);
    };
  }, [open, clientId, clientName]);

  useEffect(() => {
    if (!autoscroll) return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events, autoscroll]);

  const filtered = useMemo(() => {
    return events.filter(e => {
      const levelOk = level === 'all' ? true : e.level === level;
      const q = query.trim().toLowerCase();
      const queryOk = q === '' ? true :
        e.message.toLowerCase().includes(q) ||
        (e.source || '').toLowerCase().includes(q);
      return levelOk && queryOk;
    });
  }, [events, level, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl bg-bg-primary border border-glass-border rounded-lg shadow-glow-blue-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-glass-border bg-glass-primary">
          <div>
            <div className="cyberpunk-heading-2">Live Activity</div>
            <div className="cyberpunk-label text-text-secondary text-xs">
              {clientName ? `${clientName} (${clientId})` : 'All Sources'}
            </div>
          </div>
          <button className="px-3 py-1.5 text-xs border rounded-md hover:bg-glass-secondary" onClick={onClose}>Close</button>
        </div>

        <div className="p-3 border-b border-glass-border bg-glass-secondary">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              className="px-3 py-2 text-sm rounded-md bg-bg-primary border border-glass-border outline-none focus:border-cyber-blue"
              placeholder="Search logs..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <select
              className="px-3 py-2 text-sm rounded-md bg-bg-primary border border-glass-border outline-none focus:border-cyber-blue"
              value={level}
              onChange={e => setLevel(e.target.value as any)}
            >
              <option value="all">All Levels</option>
              <option value="success">Success</option>
              <option value="info">Info</option>
              <option value="warn">Warn</option>
              <option value="error">Error</option>
              <option value="debug">Debug</option>
            </select>
            <label className="inline-flex items-center gap-2 text-xs">
              <input type="checkbox" checked={autoscroll} onChange={e => setAutoscroll(e.target.checked)} />
              Auto-scroll
            </label>
          </div>
        </div>

        <div className="h-[420px] overflow-auto cyber-scrollbar bg-bg-primary">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-sm text-text-secondary">No events</div>
          ) : (
            <ul className="divide-y divide-glass-border">
              {filtered.map(e => (
                <li key={e.id} className="px-4 py-2 text-sm flex items-start gap-3">
                  <span className={`mt-1 w-2 h-2 rounded-full ${
                    e.level === 'success' ? 'bg-status-success' :
                    e.level === 'info' ? 'bg-status-info' :
                    e.level === 'warn' ? 'bg-status-warning' :
                    e.level === 'error' ? 'bg-status-error' :
                    'bg-glass-border'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-text-secondary">
                        {new Date(e.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      <span className="uppercase text-[10px] tracking-wider opacity-70">{e.level}</span>
                      {e.source && <span className="text-[10px] px-1.5 py-0.5 rounded bg-glass-secondary border border-glass-border">{e.source}</span>}
                    </div>
                    <div className="whitespace-pre-wrap break-words">{e.message}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};

export default LiveLogsModal;


