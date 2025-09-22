import React, { memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData, NodeType, NodeStatus } from '../../types/workflow';
import {
  Play,
  Square,
  Settings,
  GitBranch,
  MessageSquare,
  Github,
  Clock,
  Filter,
  Workflow,
  Merge,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Pause,
} from 'lucide-react';

interface WorkflowNodeData extends NodeData {
  onSelect?: (nodeId: string) => void;
  onUpdate?: (nodeId: string, updates: Partial<NodeData>) => void;
}

const WorkflowNode: React.FC<NodeProps<WorkflowNodeData>> = memo(
  ({ data, selected }) => {
    const { onSelect, onUpdate, ...nodeData } = data;

    const handleClick = useCallback(() => {
      if (onSelect) {
        onSelect(nodeData.id);
      }
    }, [onSelect, nodeData.id]);

    const getNodeIcon = () => {
      const iconProps = { className: 'w-5 h-5' };

      switch (nodeData.type) {
        case NodeType.START:
          return <Play {...iconProps} />;
        case NodeType.END:
          return <Square {...iconProps} />;
        case NodeType.PROCESS:
          return <Settings {...iconProps} />;
        case NodeType.DECISION:
          return <GitBranch {...iconProps} />;
        case NodeType.SLACK:
          return <MessageSquare {...iconProps} />;
        case NodeType.DISCORD:
          return <MessageSquare {...iconProps} />;
        case NodeType.GITHUB_ACTION:
          return <Github {...iconProps} />;
        case NodeType.DELAY:
          return <Clock {...iconProps} />;
        case NodeType.CONDITION:
          return <Filter {...iconProps} />;
        case NodeType.PARALLEL:
          return <Workflow {...iconProps} />;
        case NodeType.MERGE:
          return <Merge {...iconProps} />;
        default:
          return <Settings {...iconProps} />;
      }
    };

    const getStatusIcon = () => {
      const iconProps = { className: 'w-4 h-4' };

      switch (nodeData.status) {
        case NodeStatus.SUCCESS:
          return <CheckCircle {...iconProps} className="text-green-400" />;
        case NodeStatus.FAILED:
          return <XCircle {...iconProps} className="text-red-400" />;
        case NodeStatus.RUNNING:
          return (
            <Loader2 {...iconProps} className="text-blue-400 animate-spin" />
          );
        case NodeStatus.PENDING:
          return <Clock {...iconProps} className="text-gray-400" />;
        case NodeStatus.SKIPPED:
          return <Pause {...iconProps} className="text-yellow-400" />;
        case NodeStatus.CANCELLED:
          return <AlertCircle {...iconProps} className="text-orange-400" />;
        default:
          return null;
      }
    };

    const getNodeColor = () => {
      if (selected) {
        return 'ring-2 ring-blue-400 ring-opacity-50';
      }

      switch (nodeData.status) {
        case NodeStatus.SUCCESS:
          return 'border-green-400 bg-green-400/10';
        case NodeStatus.FAILED:
          return 'border-red-400 bg-red-400/10';
        case NodeStatus.RUNNING:
          return 'border-blue-400 bg-blue-400/10';
        case NodeStatus.PENDING:
          return 'border-gray-400 bg-gray-400/10';
        case NodeStatus.SKIPPED:
          return 'border-yellow-400 bg-yellow-400/10';
        case NodeStatus.CANCELLED:
          return 'border-orange-400 bg-orange-400/10';
        default:
          return 'border-gray-500 bg-gray-800';
      }
    };

    const getNodeTypeColor = () => {
      switch (nodeData.type) {
        case NodeType.START:
          return 'text-green-400';
        case NodeType.END:
          return 'text-red-400';
        case NodeType.PROCESS:
          return 'text-blue-400';
        case NodeType.DECISION:
          return 'text-yellow-400';
        case NodeType.SLACK:
          return 'text-purple-400';
        case NodeType.DISCORD:
          return 'text-indigo-400';
        case NodeType.GITHUB_ACTION:
          return 'text-gray-400';
        case NodeType.DELAY:
          return 'text-orange-400';
        case NodeType.CONDITION:
          return 'text-pink-400';
        case NodeType.PARALLEL:
          return 'text-cyan-400';
        case NodeType.MERGE:
          return 'text-teal-400';
        default:
          return 'text-gray-400';
      }
    };

    const shouldShowTargetHandle = nodeData.type !== NodeType.START;
    const shouldShowSourceHandle = nodeData.type !== NodeType.END;

    return (
      <div
        className={`
        relative min-w-[200px] max-w-[250px] p-4 rounded-lg border-2 shadow-lg
        transition-all duration-200 cursor-pointer
        ${getNodeColor()}
        hover:shadow-xl hover:scale-105
      `}
        onClick={handleClick}
      >
        {/* Target Handle */}
        {shouldShowTargetHandle && (
          <Handle
            type="target"
            position={Position.Top}
            className="w-3 h-3 bg-gray-600 border-2 border-gray-800 hover:bg-gray-400"
          />
        )}

        {/* Node Content */}
        <div className="flex items-center gap-3">
          <div className={`flex-shrink-0 ${getNodeTypeColor()}`}>
            {getNodeIcon()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-medium text-white text-sm truncate">
              {nodeData.label}
            </div>
            <div className="text-gray-400 text-xs truncate">
              {nodeData.type}
            </div>
          </div>

          {/* Status Icon */}
          <div className="flex-shrink-0">{getStatusIcon()}</div>
        </div>

        {/* Node Data Preview */}
        {nodeData.data && Object.keys(nodeData.data).length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-600">
            <div className="text-xs text-gray-400">
              {Object.entries(nodeData.data)
                .slice(0, 2)
                .map(([key, value]) => (
                  <div key={key} className="truncate">
                    <span className="text-gray-500">{key}:</span>{' '}
                    {String(value)}
                  </div>
                ))}
              {Object.keys(nodeData.data).length > 2 && (
                <div className="text-gray-500">
                  +{Object.keys(nodeData.data).length - 2} أكثر...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Configuration Badges */}
        {nodeData.config && (
          <div className="mt-2 flex flex-wrap gap-1">
            {nodeData.config.retryCount && (
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                Retry: {nodeData.config.retryCount}
              </span>
            )}
            {nodeData.config.timeout && (
              <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded">
                Timeout: {nodeData.config.timeout}s
              </span>
            )}
            {nodeData.config.onError && (
              <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">
                Error: {nodeData.config.onError}
              </span>
            )}
          </div>
        )}

        {/* Source Handle */}
        {shouldShowSourceHandle && (
          <Handle
            type="source"
            position={Position.Bottom}
            className="w-3 h-3 bg-gray-600 border-2 border-gray-800 hover:bg-gray-400"
          />
        )}

        {/* Multiple Outputs for Decision Nodes */}
        {nodeData.type === NodeType.DECISION && (
          <>
            <Handle
              type="source"
              position={Position.Right}
              id="true"
              className="w-3 h-3 bg-green-600 border-2 border-gray-800 hover:bg-green-400"
            />
            <Handle
              type="source"
              position={Position.Left}
              id="false"
              className="w-3 h-3 bg-red-600 border-2 border-gray-800 hover:bg-red-400"
            />
          </>
        )}

        {/* Multiple Outputs for Parallel Nodes */}
        {nodeData.type === NodeType.PARALLEL && (
          <>
            <Handle
              type="source"
              position={Position.Right}
              id="branch1"
              className="w-3 h-3 bg-cyan-600 border-2 border-gray-800 hover:bg-cyan-400"
            />
            <Handle
              type="source"
              position={Position.BottomRight}
              id="branch2"
              className="w-3 h-3 bg-cyan-600 border-2 border-gray-800 hover:bg-cyan-400"
            />
          </>
        )}
      </div>
    );
  }
);

WorkflowNode.displayName = 'WorkflowNode';

export default WorkflowNode;
