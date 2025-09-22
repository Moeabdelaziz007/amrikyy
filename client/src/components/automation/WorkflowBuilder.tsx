// Advanced Visual Workflow Builder with Node Editor
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Square,
  RefreshCw,
  Save,
  Download,
  Upload,
  Plus,
  Minus,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Settings,
  Eye,
  Trash2,
  Copy,
  Cut,
  Paste,
  Undo,
  Redo,
  Search,
  Filter,
  Code,
  Database,
  Globe,
  Bot,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  BarChart3,
  Users,
  MessageSquare,
  Calendar,
  Timer,
  Target,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  Move,
  Link2,
  Unlink,
  Lock,
  Unlock,
  EyeOff,
  EyeIcon,
  Node,
  GitBranch,
  GitCommit,
  GitMerge,
  Layers,
  Network,
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  type:
    | 'trigger'
    | 'action'
    | 'condition'
    | 'delay'
    | 'webhook'
    | 'ai'
    | 'data'
    | 'loop'
    | 'merge';
  name: string;
  description: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: Record<string, any>;
  inputs: NodePort[];
  outputs: NodePort[];
  status: 'idle' | 'running' | 'success' | 'error' | 'warning';
  data: any;
  isSelected: boolean;
  isLocked: boolean;
  isCollapsed: boolean;
  metadata: {
    category: string;
    tags: string[];
    version: string;
    author: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface NodePort {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any';
  required: boolean;
  defaultValue?: any;
  description: string;
}

interface WorkflowConnection {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
  type: 'data' | 'control' | 'conditional';
  label?: string;
  isActive: boolean;
  conditions?: Record<string, any>;
}

interface WorkflowVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  value: any;
  description: string;
  isGlobal: boolean;
  scope: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  variables: WorkflowVariable[];
  settings: WorkflowSettings;
  metadata: {
    version: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
  };
}

interface WorkflowSettings {
  name: string;
  description: string;
  version: string;
  timeout: number;
  retryAttempts: number;
  parallelExecution: boolean;
  errorHandling: 'stop' | 'continue' | 'retry';
  logging: boolean;
  notifications: boolean;
  scheduling?: {
    enabled: boolean;
    cron: string;
    timezone: string;
  };
}

interface WorkflowBuilderProps {
  workflow?: WorkflowTemplate;
  onSave: (workflow: WorkflowTemplate) => void;
  onExecute: (workflow: WorkflowTemplate) => void;
  onExport: (workflow: WorkflowTemplate, format: 'json' | 'yaml') => void;
  onImport: (file: File) => void;
  templates: WorkflowTemplate[];
  onLoadTemplate: (templateId: string) => void;
}

export default function WorkflowBuilder({
  workflow,
  onSave,
  onExecute,
  onExport,
  onImport,
  templates,
  onLoadTemplate,
}: WorkflowBuilderProps) {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [variables, setVariables] = useState<WorkflowVariable[]>([]);
  const [settings, setSettings] = useState<WorkflowSettings>({
    name: 'Untitled Workflow',
    description: '',
    version: '1.0.0',
    timeout: 300,
    retryAttempts: 3,
    parallelExecution: false,
    errorHandling: 'stop',
    logging: true,
    notifications: false,
  });

  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [draggedConnection, setDraggedConnection] = useState<{
    sourceNodeId: string;
    sourcePortId: string;
  } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showNodeLibrary, setShowNodeLibrary] = useState(true);
  const [showProperties, setShowProperties] = useState(true);
  const [showVariables, setShowVariables] = useState(false);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState<Record<string, any>>(
    {}
  );

  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Node templates
  const nodeTemplates = [
    {
      type: 'trigger',
      name: 'Webhook Trigger',
      description: 'Trigger workflow on webhook call',
      icon: Globe,
      color: '#3B82F6',
      inputs: [],
      outputs: [{ id: 'output', name: 'Data', type: 'object', required: true }],
    },
    {
      type: 'trigger',
      name: 'Schedule Trigger',
      description: 'Trigger workflow on schedule',
      icon: Clock,
      color: '#3B82F6',
      inputs: [],
      outputs: [
        { id: 'output', name: 'Trigger', type: 'object', required: true },
      ],
    },
    {
      type: 'action',
      name: 'HTTP Request',
      description: 'Make HTTP request',
      icon: Globe,
      color: '#10B981',
      inputs: [{ id: 'input', name: 'Data', type: 'object', required: true }],
      outputs: [
        { id: 'output', name: 'Response', type: 'object', required: true },
      ],
    },
    {
      type: 'action',
      name: 'Database Query',
      description: 'Execute database query',
      icon: Database,
      color: '#10B981',
      inputs: [{ id: 'input', name: 'Query', type: 'string', required: true }],
      outputs: [
        { id: 'output', name: 'Results', type: 'array', required: true },
      ],
    },
    {
      type: 'ai',
      name: 'AI Processing',
      description: 'Process data with AI',
      icon: Bot,
      color: '#8B5CF6',
      inputs: [{ id: 'input', name: 'Data', type: 'object', required: true }],
      outputs: [
        { id: 'output', name: 'Result', type: 'object', required: true },
      ],
    },
    {
      type: 'condition',
      name: 'If Condition',
      description: 'Conditional branching',
      icon: GitBranch,
      color: '#F59E0B',
      inputs: [{ id: 'input', name: 'Data', type: 'object', required: true }],
      outputs: [
        { id: 'true', name: 'True', type: 'object', required: true },
        { id: 'false', name: 'False', type: 'object', required: true },
      ],
    },
    {
      type: 'delay',
      name: 'Wait',
      description: 'Wait for specified time',
      icon: Timer,
      color: '#6B7280',
      inputs: [{ id: 'input', name: 'Data', type: 'object', required: true }],
      outputs: [{ id: 'output', name: 'Data', type: 'object', required: true }],
    },
    {
      type: 'data',
      name: 'Transform Data',
      description: 'Transform data structure',
      icon: Code,
      color: '#06B6D4',
      inputs: [{ id: 'input', name: 'Data', type: 'object', required: true }],
      outputs: [
        { id: 'output', name: 'Transformed', type: 'object', required: true },
      ],
    },
  ];

  useEffect(() => {
    if (workflow) {
      setNodes(workflow.nodes);
      setConnections(workflow.connections);
      setVariables(workflow.variables);
      setSettings(workflow.settings);
    }
  }, [workflow]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        setCanvasSize({
          width: canvasRef.current.offsetWidth,
          height: canvasRef.current.offsetHeight,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const createNode = useCallback(
    (
      template: (typeof nodeTemplates)[0],
      position: { x: number; y: number }
    ) => {
      const id = `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newNode: WorkflowNode = {
        id,
        type: template.type,
        name: template.name,
        description: template.description,
        position: { x: position.x - 100, y: position.y - 50 },
        size: { width: 200, height: 100 },
        config: {},
        inputs: template.inputs,
        outputs: template.outputs,
        status: 'idle',
        data: null,
        isSelected: false,
        isLocked: false,
        isCollapsed: false,
        metadata: {
          category: template.type,
          tags: [],
          version: '1.0.0',
          author: 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      setNodes(prev => [...prev, newNode]);
      setSelectedNode(newNode);
    },
    []
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes(prev => prev.filter(node => node.id !== nodeId));
      setConnections(prev =>
        prev.filter(
          conn => conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId
        )
      );
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null);
      }
    },
    [selectedNode]
  );

  const updateNode = useCallback(
    (nodeId: string, updates: Partial<WorkflowNode>) => {
      setNodes(prev =>
        prev.map(node => (node.id === nodeId ? { ...node, ...updates } : node))
      );
      if (selectedNode?.id === nodeId) {
        setSelectedNode(prev => (prev ? { ...prev, ...updates } : null));
      }
    },
    [selectedNode]
  );

  const createConnection = useCallback(
    (
      sourceNodeId: string,
      sourcePortId: string,
      targetNodeId: string,
      targetPortId: string
    ) => {
      const id = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newConnection: WorkflowConnection = {
        id,
        sourceNodeId,
        sourcePortId,
        targetNodeId,
        targetPortId,
        type: 'data',
        isActive: true,
      };

      setConnections(prev => [...prev, newConnection]);
    },
    []
  );

  const deleteConnection = useCallback((connectionId: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedNodes([]);
      setSelectedNode(null);
      setDraggedConnection(null);
    }
  }, []);

  const handleCanvasDrag = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        setPan(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    },
    [isDragging, dragStart]
  );

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleCanvasMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleNodeDrag = useCallback(
    (nodeId: string, e: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - pan.x) / zoom;
        const y = (e.clientY - rect.top - pan.y) / zoom;
        updateNode(nodeId, { position: { x, y } });
      }
    },
    [pan, zoom, updateNode]
  );

  const handleNodeSelect = useCallback(
    (nodeId: string, multiSelect: boolean = false) => {
      if (multiSelect) {
        setSelectedNodes(prev =>
          prev.includes(nodeId)
            ? prev.filter(id => id !== nodeId)
            : [...prev, nodeId]
        );
      } else {
        setSelectedNodes([nodeId]);
      }

      const node = nodes.find(n => n.id === nodeId);
      setSelectedNode(node || null);
    },
    [nodes]
  );

  const handlePortClick = useCallback(
    (nodeId: string, portId: string, isOutput: boolean) => {
      if (isOutput) {
        setDraggedConnection({ sourceNodeId: nodeId, sourcePortId: portId });
      } else if (draggedConnection) {
        createConnection(
          draggedConnection.sourceNodeId,
          draggedConnection.sourcePortId,
          nodeId,
          portId
        );
        setDraggedConnection(null);
      }
    },
    [draggedConnection, createConnection]
  );

  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(0.1, Math.min(3, prev + delta)));
  }, []);

  const handleExecute = useCallback(async () => {
    setIsExecuting(true);
    setExecutionResults({});

    const workflowTemplate: WorkflowTemplate = {
      id: `workflow_${Date.now()}`,
      name: settings.name,
      description: settings.description,
      category: 'custom',
      nodes,
      connections,
      variables,
      settings,
      metadata: {
        version: settings.version,
        author: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [],
      },
    };

    try {
      await onExecute(workflowTemplate);
      // Simulate execution results
      const results: Record<string, any> = {};
      nodes.forEach(node => {
        results[node.id] = {
          status: Math.random() > 0.2 ? 'success' : 'error',
          data: { result: `Output from ${node.name}` },
          executionTime: Math.random() * 1000,
        };
      });
      setExecutionResults(results);

      // Update node statuses
      setNodes(prev =>
        prev.map(node => ({
          ...node,
          status: results[node.id]?.status === 'success' ? 'success' : 'error',
        }))
      );
    } catch (error) {
      console.error('Execution failed:', error);
    } finally {
      setIsExecuting(false);
    }
  }, [nodes, connections, variables, settings, onExecute]);

  const handleSave = useCallback(() => {
    const workflowTemplate: WorkflowTemplate = {
      id: `workflow_${Date.now()}`,
      name: settings.name,
      description: settings.description,
      category: 'custom',
      nodes,
      connections,
      variables,
      settings,
      metadata: {
        version: settings.version,
        author: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [],
      },
    };

    onSave(workflowTemplate);
  }, [nodes, connections, variables, settings, onSave]);

  const getNodeIcon = (type: string) => {
    const template = nodeTemplates.find(t => t.type === type);
    return template ? template.icon : Code;
  };

  const getNodeColor = (type: string, status: string) => {
    const template = nodeTemplates.find(t => t.type === type);
    const baseColor = template?.color || '#6B7280';

    switch (status) {
      case 'success':
        return '#10B981';
      case 'error':
        return '#EF4444';
      case 'running':
        return '#3B82F6';
      case 'warning':
        return '#F59E0B';
      default:
        return baseColor;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExecute}
                disabled={isExecuting || nodes.length === 0}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExecuting ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {isExecuting ? 'Executing...' : 'Execute'}
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleZoom(-0.1)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => handleZoom(0.1)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowNodeLibrary(!showNodeLibrary)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Node
            </button>
            <button
              onClick={() => setShowProperties(!showProperties)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
            >
              <Settings className="w-4 h-4 mr-2" />
              Properties
            </button>
            <button
              onClick={() => setShowVariables(!showVariables)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
            >
              <Code className="w-4 h-4 mr-2" />
              Variables
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Node Library */}
        {showNodeLibrary && (
          <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Node Library
              </h3>
              <div className="space-y-2">
                {nodeTemplates.map((template, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={e => {
                      const rect = canvasRef.current?.getBoundingClientRect();
                      if (rect) {
                        const x = (e.clientX - rect.left - pan.x) / zoom;
                        const y = (e.clientY - rect.top - pan.y) / zoom;
                        createNode(template, { x, y });
                      }
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: template.color }}
                    >
                      <template.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {template.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className="w-full h-full relative cursor-grab active:cursor-grabbing"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasDrag}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onClick={handleCanvasClick}
          >
            {/* Grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  radial-gradient(circle, #000 1px, transparent 1px)
                `,
                backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                transform: `translate(${pan.x}px, ${pan.y}px)`,
              }}
            />

            {/* Connections */}
            <svg
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 1 }}
            >
              {connections.map(connection => {
                const sourceNode = nodes.find(
                  n => n.id === connection.sourceNodeId
                );
                const targetNode = nodes.find(
                  n => n.id === connection.targetNodeId
                );

                if (!sourceNode || !targetNode) return null;

                const sourceX = (sourceNode.position.x + 200) * zoom + pan.x;
                const sourceY = (sourceNode.position.y + 50) * zoom + pan.y;
                const targetX = targetNode.position.x * zoom + pan.x;
                const targetY = (targetNode.position.y + 50) * zoom + pan.y;

                return (
                  <path
                    key={connection.id}
                    d={`M ${sourceX} ${sourceY} Q ${(sourceX + targetX) / 2} ${sourceY} ${targetX} ${targetY}`}
                    stroke={connection.isActive ? '#3B82F6' : '#D1D5DB'}
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                    className="hover:stroke-blue-600 cursor-pointer"
                    onClick={() => deleteConnection(connection.id)}
                  />
                );
              })}

              {/* Arrow marker */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
                </marker>
              </defs>
            </svg>

            {/* Nodes */}
            {nodes.map(node => {
              const Icon = getNodeIcon(node.type);
              const color = getNodeColor(node.type, node.status);
              const isSelected = selectedNodes.includes(node.id);

              return (
                <div
                  key={node.id}
                  className={`absolute border-2 rounded-lg shadow-lg cursor-move ${
                    isSelected ? 'border-blue-500' : 'border-gray-300'
                  }`}
                  style={{
                    left: node.position.x * zoom + pan.x,
                    top: node.position.y * zoom + pan.y,
                    width: node.size.width * zoom,
                    height: node.size.height * zoom,
                    backgroundColor: color,
                    zIndex: isSelected ? 10 : 5,
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    handleNodeSelect(node.id, e.ctrlKey || e.metaKey);
                  }}
                  onMouseDown={e => {
                    e.stopPropagation();
                    handleNodeDrag(node.id, e);
                  }}
                >
                  <div className="p-3 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium text-sm">{node.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {node.status === 'running' && (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        )}
                        {node.status === 'success' && (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        {node.status === 'error' && (
                          <XCircle className="w-3 h-3" />
                        )}
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            deleteNode(node.id);
                          }}
                          className="text-white/70 hover:text-white"
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Input Ports */}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1">
                      {node.inputs.map((input, index) => (
                        <div
                          key={input.id}
                          className="w-2 h-2 bg-white rounded-full border border-gray-300 cursor-pointer hover:bg-blue-200"
                          style={{ marginTop: index * 8 }}
                          onClick={e => {
                            e.stopPropagation();
                            handlePortClick(node.id, input.id, false);
                          }}
                        />
                      ))}
                    </div>

                    {/* Output Ports */}
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1">
                      {node.outputs.map((output, index) => (
                        <div
                          key={output.id}
                          className="w-2 h-2 bg-white rounded-full border border-gray-300 cursor-pointer hover:bg-blue-200"
                          style={{ marginTop: index * 8 }}
                          onClick={e => {
                            e.stopPropagation();
                            handlePortClick(node.id, output.id, true);
                          }}
                        />
                      ))}
                    </div>

                    {executionResults[node.id] && (
                      <div className="text-xs mt-1 opacity-80">
                        {executionResults[node.id].executionTime.toFixed(0)}ms
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Properties Panel */}
        {showProperties && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Properties
              </h3>

              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Node Name
                    </label>
                    <input
                      type="text"
                      value={selectedNode.name}
                      onChange={e =>
                        updateNode(selectedNode.id, { name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={selectedNode.description}
                      onChange={e =>
                        updateNode(selectedNode.id, {
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={selectedNode.status}
                      onChange={e =>
                        updateNode(selectedNode.id, {
                          status: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="idle">Idle</option>
                      <option value="running">Running</option>
                      <option value="success">Success</option>
                      <option value="error">Error</option>
                      <option value="warning">Warning</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a node to edit its properties</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
