import React, { useCallback, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
  ReactFlowInstance,
  NodeTypes,
  EdgeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

import {
  Workflow,
  NodeData,
  Connection as WorkflowConnection,
  NodeType,
} from '../../types/workflow';
import { DAGService } from '../../services/dag-service';
import { WorkflowNode } from './WorkflowNode';
import { WorkflowEdge } from './WorkflowEdge';
import { NodePalette } from './NodePalette';
import { ConnectionLine } from './ConnectionLine';

const nodeTypes: NodeTypes = {
  workflowNode: WorkflowNode,
};

const edgeTypes: EdgeTypes = {
  workflowEdge: WorkflowEdge,
};

interface WorkflowCanvasProps {
  workflow: Workflow;
  onWorkflowChange: (workflow: Workflow) => void;
  onNodeSelect?: (nodeId: string) => void;
  onConnectionSelect?: (connectionId: string) => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  workflow,
  onWorkflowChange,
  onNodeSelect,
  onConnectionSelect,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    workflow.nodes.map(node => ({
      id: node.id,
      type: 'workflowNode',
      position: node.position,
      data: {
        ...node,
        onSelect: onNodeSelect,
        onUpdate: handleNodeUpdate,
      },
    }))
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState(
    workflow.connections.map(conn => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      sourceHandle: conn.sourceHandle,
      targetHandle: conn.targetHandle,
      label: conn.label,
      type: 'workflowEdge',
      data: {
        ...conn,
        onSelect: onConnectionSelect,
      },
    }))
  );

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [validation, setValidation] = useState(
    DAGService.validateDAG(workflow)
  );

  // معالج تحديث العقدة
  const handleNodeUpdate = useCallback(
    (nodeId: string, updates: Partial<NodeData>) => {
      const updatedNodes = workflow.nodes.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      );

      const updatedWorkflow = {
        ...workflow,
        nodes: updatedNodes,
      };

      // تحديث التحقق من DAG
      const newValidation = DAGService.validateDAG(updatedWorkflow);
      setValidation(newValidation);

      onWorkflowChange(updatedWorkflow);
    },
    [workflow, onWorkflowChange]
  );

  // معالج إضافة اتصال جديد
  const onConnect = useCallback(
    (connection: Connection) => {
      const newConnection: WorkflowConnection = {
        id: `conn_${Date.now()}`,
        source: connection.source!,
        target: connection.target!,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        type: 'default',
      };

      const updatedConnections = [...workflow.connections, newConnection];
      const updatedWorkflow = {
        ...workflow,
        connections: updatedConnections,
      };

      // تحديث التحقق من DAG
      const newValidation = DAGService.validateDAG(updatedWorkflow);
      setValidation(newValidation);

      onWorkflowChange(updatedWorkflow);
    },
    [workflow, onWorkflowChange]
  );

  // معالج إسقاط العقدة
  const [, drop] = useDrop({
    accept: 'node',
    drop: (item: { type: NodeType; label: string }, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: offset.x,
        y: offset.y,
      });

      const newNode: NodeData = {
        id: `node_${Date.now()}`,
        type: item.type,
        label: item.label,
        position,
        data: {},
        config: {
          retryCount: 3,
          timeout: 30000,
          onError: 'continue',
        },
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedNodes = [...workflow.nodes, newNode];
      const updatedWorkflow = {
        ...workflow,
        nodes: updatedNodes,
      };

      onWorkflowChange(updatedWorkflow);
    },
  });

  // تحديث العقد والاتصالات عند تغيير سير العمل
  React.useEffect(() => {
    setNodes(
      workflow.nodes.map(node => ({
        id: node.id,
        type: 'workflowNode',
        position: node.position,
        data: {
          ...node,
          onSelect: onNodeSelect,
          onUpdate: handleNodeUpdate,
        },
      }))
    );

    setEdges(
      workflow.connections.map(conn => ({
        id: conn.id,
        source: conn.source,
        target: conn.target,
        sourceHandle: conn.sourceHandle,
        targetHandle: conn.targetHandle,
        label: conn.label,
        type: 'workflowEdge',
        data: {
          ...conn,
          onSelect: onConnectionSelect,
        },
      }))
    );
  }, [workflow, onNodeSelect, onConnectionSelect, handleNodeUpdate]);

  return (
    <div className="h-full w-full" ref={drop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent={ConnectionLine}
        fitView
        attributionPosition="bottom-left"
        className="bg-gray-900"
      >
        <Background color="#374151" gap={20} />
        <Controls className="bg-gray-800 border-gray-600" />
        <MiniMap
          className="bg-gray-800 border-gray-600"
          nodeColor={node => {
            switch (node.data?.type) {
              case NodeType.START:
                return '#10b981';
              case NodeType.END:
                return '#ef4444';
              case NodeType.API_CALL:
              case NodeType.SLACK:
              case NodeType.DISCORD:
              case NodeType.GITHUB_ACTION:
                return '#3b82f6';
              default:
                return '#6b7280';
            }
          }}
        />

        {/* مؤشر التحقق من DAG */}
        {!validation.isValid && (
          <div className="absolute top-4 right-4 bg-red-600 text-white p-3 rounded-lg shadow-lg max-w-md">
            <h4 className="font-semibold mb-2">أخطاء في سير العمل:</h4>
            <ul className="text-sm space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-red-200">⚠️</span>
                  {error}
                </li>
              ))}
            </ul>
            {validation.warnings.length > 0 && (
              <>
                <h4 className="font-semibold mt-3 mb-2">تحذيرات:</h4>
                <ul className="text-sm space-y-1">
                  {validation.warnings.map((warning, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-yellow-200">⚠️</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </ReactFlow>
    </div>
  );
};

// مكون رئيسي مع DndProvider
export const WorkflowCanvasWithProvider: React.FC<
  WorkflowCanvasProps
> = props => (
  <DndProvider backend={HTML5Backend}>
    <ReactFlowProvider>
      <WorkflowCanvas {...props} />
    </ReactFlowProvider>
  </DndProvider>
);
