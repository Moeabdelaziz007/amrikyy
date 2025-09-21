import React, { useEffect, useMemo, useState } from 'react';
import { GlassCard } from './GlassCard';
import { StatusWidget } from './StatusWidget';
import { ControlButton } from './ControlButton';

interface ClientCardProps {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'error' | 'warning' | 'idle';
  successCount: number;
  errorCount: number;
  lastActivity?: string;
  progressPercent?: number;
  progressLabel?: string;
  onStart?: () => void;
  onStop?: () => void;
  onRestart?: () => void;
  onEmergencyStop?: () => void;
  onViewLogs?: () => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  id,
  name,
  type,
  status,
  successCount,
  errorCount,
  lastActivity,
  progressPercent,
  progressLabel,
  onStart,
  onStop,
  onRestart,
  onEmergencyStop,
  onViewLogs,
}) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleAction = async (action: () => void | undefined, actionType: string) => {
    if (!action) return;
    
    setIsLoading(actionType);
    setActionError(null);
    try {
      await action();
    } finally {
      setIsLoading(null);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'running':
        return (
          <div className="w-2 h-2 bg-status-success rounded-full animate-pulse shadow-glow-green-sm" />
        );
      case 'error':
        return (
          <div className="w-2 h-2 bg-status-error rounded-full animate-pulse" />
        );
      case 'warning':
        return (
          <div className="w-2 h-2 bg-status-warning rounded-full animate-pulse" />
        );
      default:
        return (
          <div className="w-2 h-2 bg-glass-border rounded-full" />
        );
    }
  };

  const getGlowColor = () => {
    switch (status) {
      case 'running':
        return 'green';
      case 'error':
        return 'red';
      case 'warning':
        return 'yellow';
      default:
        return 'blue';
    }
  };

  return (
    <GlassCard
      status={status}
      title={name}
      subtitle={type}
      glowColor={getGlowColor()}
      animate={status === 'running'}
      className="min-h-[300px] flex flex-col"
    >
      {/* Client Info */}
      <div className="flex items-center gap-2 mb-4">
        {getStatusIcon()}
        <span className="cyberpunk-label text-xs">
          ID: {id}
        </span>
      </div>

      {/* Status Widgets */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <StatusWidget
          label="Success Today"
          value={successCount}
          type="success"
          icon={
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          }
          animate={status === 'running'}
        />
        
        <StatusWidget
          label="Errors Today"
          value={errorCount}
          type="error"
          icon={
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          }
        />
      </div>

      {/* Last Activity */}
      {lastActivity && (
        <div className="mb-4 text-text-secondary cyberpunk-body text-xs">
          Last Activity: {lastActivity}
        </div>
      )}

      {/* Progress Bar (if running) */}
      {status === 'running' && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <div className="cyberpunk-label text-xs">{progressLabel || 'Processing...'}</div>
            {typeof progressPercent === 'number' && (
              <div className="cyberpunk-label text-xs text-text-secondary">{Math.max(0, Math.min(100, progressPercent))}%</div>
            )}
          </div>
          <div className="w-full h-2 rounded-full bg-glass-secondary overflow-hidden">
            <div
              className={`h-2 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-lime-400 neon-glow-sm ${typeof progressPercent !== 'number' ? 'animate-cyber-scan' : ''}`}
              style={{ width: typeof progressPercent === 'number' ? `${Math.max(0, Math.min(100, progressPercent))}%` : '100%' }}
            />
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="mt-auto">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <ControlButton
            variant="success"
            size="sm"
            onClick={() => handleAction(onStart, 'start')}
            disabled={status === 'running' || isLoading !== null}
            loading={isLoading === 'start'}
          >
            {status === 'running' ? 'Running' : 'Start'}
          </ControlButton>
          
          <ControlButton
            variant="warning"
            size="sm"
            onClick={() => handleAction(onStop, 'stop')}
            disabled={status === 'idle' || isLoading !== null}
            loading={isLoading === 'stop'}
          >
            Stop
          </ControlButton>
          
          <ControlButton
            variant="secondary"
            size="sm"
            onClick={() => handleAction(onRestart, 'restart')}
            disabled={isLoading !== null}
            loading={isLoading === 'restart'}
          >
            Restart
          </ControlButton>
          
          <ControlButton
            variant="danger"
            size="sm"
            onClick={() => handleAction(onEmergencyStop, 'emergency')}
            disabled={isLoading !== null}
            loading={isLoading === 'emergency'}
          >
            Emergency
          </ControlButton>
        </div>

        {/* Action error */}
        {actionError && (
          <div className="mb-3 text-xs text-status-error">
            {actionError}
          </div>
        )}

        {/* View Logs Button */}
        <ControlButton
          variant="primary"
          size="sm"
          onClick={onViewLogs}
          className="w-full"
        >
          View Live Logs
        </ControlButton>
      </div>
    </GlassCard>
  );
};
