import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GlassCard } from '../dashboard/GlassCard';

interface AgentNode {
  id: string;
  type: 'trigger' | 'processor' | 'action' | 'condition';
  name: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  position: { x: number; y: number };
  connections: string[];
  progress?: number;
  lastActivity?: string;
}

interface WorkflowCanvasProps {
  className?: string;
}

export const AgentsWorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  className = '',
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<AgentNode[]>([
    {
      id: 'trigger-1',
      type: 'trigger',
      name: 'New Message',
      status: 'running',
      position: { x: 50, y: 100 },
      connections: ['processor-1'],
      progress: 75,
      lastActivity: '2 min ago',
    },
    {
      id: 'processor-1',
      type: 'processor',
      name: 'AI Analysis',
      status: 'running',
      position: { x: 300, y: 100 },
      connections: ['action-1'],
      progress: 45,
      lastActivity: '1 min ago',
    },
    {
      id: 'action-1',
      type: 'action',
      name: 'Auto Reply',
      status: 'idle',
      position: { x: 550, y: 100 },
      connections: [],
      lastActivity: '5 min ago',
    },
    {
      id: 'condition-1',
      type: 'condition',
      name: 'Sentiment Check',
      status: 'completed',
      position: { x: 300, y: 250 },
      connections: ['action-1'],
      lastActivity: 'Just now',
    },
  ]);

  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const getNodeTypeColor = (type: AgentNode['type']) => {
    switch (type) {
      case 'trigger':
        return 'from-cyan-400 to-blue-500';
      case 'processor':
        return 'from-purple-400 to-pink-500';
      case 'action':
        return 'from-green-400 to-emerald-500';
      case 'condition':
        return 'from-yellow-400 to-orange-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusGlow = (status: AgentNode['status']) => {
    switch (status) {
      case 'running':
        return 'shadow-glow-green-md animate-neon-pulse';
      case 'completed':
        return 'shadow-glow-blue-sm';
      case 'error':
        return 'shadow-[0_0_16px_rgba(255,0,64,0.7)]';
      default:
        return 'shadow-glow-gray-sm';
    }
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.preventDefault();
      setDraggedNode(nodeId);
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        setDragOffset({
          x: e.clientX - node.position.x,
          y: e.clientY - node.position.y,
        });
      }
    },
    [nodes]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!draggedNode) return;

      setNodes(prev =>
        prev.map(node =>
          node.id === draggedNode
            ? {
                ...node,
                position: {
                  x: Math.max(0, Math.min(800, e.clientX - dragOffset.x)),
                  y: Math.max(0, Math.min(400, e.clientY - dragOffset.y)),
                },
              }
            : node
        )
      );
    },
    [draggedNode, dragOffset]
  );

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
  }, []);

  useEffect(() => {
    if (draggedNode) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedNode, handleMouseMove, handleMouseUp]);

  const renderConnection = (fromNode: AgentNode, toNodeId: string) => {
    const toNode = nodes.find(n => n.id === toNodeId);
    if (!toNode) return null;

    const fromX = fromNode.position.x + 100;
    const fromY = fromNode.position.y + 50;
    const toX = toNode.position.x;
    const toY = toNode.position.y + 50;

    const isActive =
      fromNode.status === 'running' || toNode.status === 'running';

    return (
      <svg
        key={`${fromNode.id}-${toNodeId}`}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <defs>
          <linearGradient
            id={`gradient-${fromNode.id}-${toNodeId}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#00f5ff" />
            <stop offset="50%" stopColor="#ff00ff" />
            <stop offset="100%" stopColor="#00ff00" />
          </linearGradient>
        </defs>
        <path
          d={`M ${fromX} ${fromY} Q ${(fromX + toX) / 2} ${fromY - 50} ${toX} ${toY}`}
          stroke={`url(#gradient-${fromNode.id}-${toNodeId})`}
          strokeWidth="2"
          fill="none"
          className={`transition-all duration-300 ${isActive ? 'animate-pulse' : 'opacity-60'}`}
          style={{
            filter: isActive
              ? 'drop-shadow(0 0 8px rgba(0, 245, 255, 0.8))'
              : 'none',
          }}
        />
        {/* Animated dots */}
        {isActive && (
          <circle
            r="3"
            fill="#00f5ff"
            className="animate-ping"
            style={{
              animation: `moveAlongPath 2s linear infinite`,
              animationDelay: '0s',
            }}
          >
            <animateMotion dur="2s" repeatCount="indefinite">
              <mpath href={`#path-${fromNode.id}-${toNodeId}`} />
            </animateMotion>
          </circle>
        )}
      </svg>
    );
  };

  return (
    <GlassCard
      title="Agents Workflow Canvas"
      subtitle="Drag & Drop Agent Management"
      glowColor="purple"
      className={`relative overflow-hidden ${className}`}
    >
      {/* Canvas Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-20 grid-rows-10 h-full w-full">
          {Array.from({ length: 200 }).map((_, i) => (
            <div key={i} className="border border-primary/20" />
          ))}
        </div>
      </div>

      {/* Canvas Container */}
      <div
        ref={canvasRef}
        className="relative h-96 w-full bg-gradient-to-br from-bg-primary/50 to-bg-secondary/30 rounded-lg overflow-hidden"
        style={{ minHeight: '400px' }}
      >
        {/* Connections */}
        {nodes.map(node =>
          node.connections.map(connectionId =>
            renderConnection(node, connectionId)
          )
        )}

        {/* Agent Nodes */}
        {nodes.map(node => (
          <div
            key={node.id}
            className={`absolute cursor-move transition-all duration-200 hover:scale-105 ${
              selectedNode === node.id ? 'ring-2 ring-cyan-400' : ''
            }`}
            style={{
              left: node.position.x,
              top: node.position.y,
              zIndex: 10,
            }}
            onMouseDown={e => handleMouseDown(e, node.id)}
            onClick={() => setSelectedNode(node.id)}
          >
            <div
              className={`
                w-24 h-16 rounded-lg border-2 border-white/20 backdrop-blur-sm
                bg-gradient-to-br ${getNodeTypeColor(node.type)}
                ${getStatusGlow(node.status)}
                flex flex-col items-center justify-center text-white text-xs font-bold
                shadow-lg
              `}
            >
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-wider">
                  {node.type}
                </div>
                <div className="text-[8px] mt-1 opacity-90">{node.name}</div>
              </div>

              {/* Status Indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white/50">
                <div
                  className={`w-full h-full rounded-full ${
                    node.status === 'running'
                      ? 'bg-green-400 animate-pulse'
                      : node.status === 'completed'
                        ? 'bg-blue-400'
                        : node.status === 'error'
                          ? 'bg-red-400'
                          : 'bg-gray-400'
                  }`}
                />
              </div>

              {/* Progress Bar for Running Nodes */}
              {node.status === 'running' && node.progress !== undefined && (
                <div className="absolute -bottom-1 left-1 right-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-green-400 transition-all duration-300"
                    style={{ width: `${node.progress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Node Info Tooltip */}
            {selectedNode === node.id && (
              <div className="absolute top-20 left-0 bg-bg-primary border border-glass-border rounded-lg p-2 shadow-glow-blue-md z-20 min-w-32">
                <div className="text-xs text-text-primary">
                  <div className="font-bold">{node.name}</div>
                  <div className="text-text-secondary">
                    Status: {node.status}
                  </div>
                  {node.progress && (
                    <div className="text-text-secondary">
                      Progress: {node.progress}%
                    </div>
                  )}
                  {node.lastActivity && (
                    <div className="text-text-secondary">
                      Last: {node.lastActivity}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add Node Button */}
        <div className="absolute bottom-4 right-4">
          <button className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-glow-blue-md hover:shadow-glow-blue-lg transition-all duration-300 flex items-center justify-center">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Workflow Stats */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        <div className="text-center">
          <div className="text-lg font-bold text-status-success">
            {nodes.filter(n => n.status === 'running').length}
          </div>
          <div className="text-xs text-text-secondary">Running</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-status-info">
            {nodes.filter(n => n.status === 'completed').length}
          </div>
          <div className="text-xs text-text-secondary">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-status-error">
            {nodes.filter(n => n.status === 'error').length}
          </div>
          <div className="text-xs text-text-secondary">Errors</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-text-primary">
            {nodes.length}
          </div>
          <div className="text-xs text-text-secondary">Total</div>
        </div>
      </div>
    </GlassCard>
  );
};

export default AgentsWorkflowCanvas;
