import { IService } from '../types/os';
import type { IWorkflow, INode } from '../automation/types';

export class AutomationService implements IService {
  public readonly name = 'automation';
  private workflows: Map<string, IWorkflow> = new Map();
  private nodeRegistry: Map<string, INode> = new Map();

  start(): void {}

  loadWorkflow(id: string): IWorkflow | undefined {
    return this.workflows.get(id);
  }

  saveWorkflow(workflow: IWorkflow): void {
    this.workflows.set(workflow.id, { ...workflow, updatedAt: Date.now(), createdAt: workflow.createdAt ?? Date.now() });
  }

  async executeWorkflow(workflow: IWorkflow): Promise<Record<string, unknown>> {
    // Build adjacency and indegree maps based on connections
    const nodesById = new Map<string, INode>(workflow.nodes.map(n => [n.id, n]));
    const incoming: Map<string, number> = new Map();
    const inputsBuffer: Map<string, Record<string, unknown>> = new Map();
    const outgoingByFrom: Map<string, { toNodeId: string; toInput: string; fromOutput: string }[]> = new Map();

    for (const n of workflow.nodes) {
      incoming.set(n.id, 0);
      inputsBuffer.set(n.id, {});
    }

    for (const c of workflow.connections) {
      incoming.set(c.toNodeId, (incoming.get(c.toNodeId) ?? 0) + 1);
      const arr = outgoingByFrom.get(c.fromNodeId) ?? [];
      arr.push({ toNodeId: c.toNodeId, toInput: c.toInput, fromOutput: c.fromOutput });
      outgoingByFrom.set(c.fromNodeId, arr);
    }

    // Initialize queue with nodes having no incoming edges
    const ready: string[] = [];
    for (const [id, deg] of incoming.entries()) {
      if (deg === 0) ready.push(id);
    }

    const results: Record<string, unknown> = {};

    // Execute in waves (parallel per level)
    while (ready.length > 0) {
      const batch = [...ready];
      ready.length = 0;
      await Promise.all(batch.map(async (nodeId) => {
        const node = nodesById.get(nodeId)!;
        const impl = this.nodeRegistry.get(node.type) || node;
        const payload = inputsBuffer.get(nodeId) ?? {};
        const output = await Promise.resolve(impl.execute(payload));
        results[nodeId] = output;

        const outs = outgoingByFrom.get(nodeId) ?? [];
        for (const edge of outs) {
          const buf = inputsBuffer.get(edge.toNodeId) ?? {};
          // Merge output field if specified; if fromOutput missing, merge entire object
          if (edge.fromOutput && typeof output === 'object' && output !== null && edge.fromOutput in (output as Record<string, unknown>)) {
            (buf as Record<string, unknown>)[edge.toInput] = (output as Record<string, unknown>)[edge.fromOutput];
          } else {
            (buf as Record<string, unknown>)[edge.toInput] = output;
          }
          inputsBuffer.set(edge.toNodeId, buf);

          const newDeg = (incoming.get(edge.toNodeId) ?? 0) - 1;
          incoming.set(edge.toNodeId, newDeg);
          if (newDeg === 0) ready.push(edge.toNodeId);
        }
      }));
    }

    return results;
  }

  registerNode(node: INode): void {
    this.nodeRegistry.set(node.type, node);
  }
}

export const automationService = new AutomationService();


