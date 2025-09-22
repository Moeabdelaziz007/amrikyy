/**
 * خدمة إدارة DAG (Directed Acyclic Graph)
 * DAG Management Service
 */

import {
  Workflow,
  NodeData,
  Connection,
  DAGNode,
  DAGValidation,
  TopologicalOrder,
  NodeType,
} from '../types/workflow';

export class DAGService {
  /**
   * بناء DAG من سير العمل
   */
  static buildDAG(workflow: Workflow): Map<string, DAGNode> {
    const dagNodes = new Map<string, DAGNode>();

    // تهيئة العقد
    workflow.nodes.forEach(node => {
      dagNodes.set(node.id, {
        id: node.id,
        dependencies: [],
        dependents: [],
        level: 0,
        isEntry: false,
        isExit: false,
      });
    });

    // بناء التبعيات من الاتصالات
    workflow.connections.forEach(connection => {
      const sourceNode = dagNodes.get(connection.source);
      const targetNode = dagNodes.get(connection.target);

      if (sourceNode && targetNode) {
        // إضافة التبعية
        if (!targetNode.dependencies.includes(connection.source)) {
          targetNode.dependencies.push(connection.source);
        }

        // إضافة التابعات
        if (!sourceNode.dependents.includes(connection.target)) {
          sourceNode.dependents.push(connection.target);
        }
      }
    });

    // تحديد عقد البداية والنهاية
    dagNodes.forEach(node => {
      node.isEntry = node.dependencies.length === 0;
      node.isExit = node.dependents.length === 0;
    });

    // حساب المستويات
    this.calculateLevels(dagNodes);

    return dagNodes;
  }

  /**
   * حساب مستويات العقد
   */
  private static calculateLevels(dagNodes: Map<string, DAGNode>): void {
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const dfs = (nodeId: string, level: number = 0) => {
      if (visiting.has(nodeId)) {
        return; // تبعية دائرية
      }

      if (visited.has(nodeId)) {
        return;
      }

      visiting.add(nodeId);
      const node = dagNodes.get(nodeId);
      if (node) {
        node.level = Math.max(node.level, level);

        // تحديث المستوى للتابعات
        node.dependents.forEach(dependentId => {
          dfs(dependentId, level + 1);
        });
      }

      visiting.delete(nodeId);
      visited.add(nodeId);
    };

    // البدء من عقد البداية
    dagNodes.forEach(node => {
      if (node.isEntry) {
        dfs(node.id, 0);
      }
    });
  }

  /**
   * التحقق من صحة DAG
   */
  static validateDAG(workflow: Workflow): DAGValidation {
    const errors: string[] = [];
    const warnings: string[] = [];
    const cycles: string[][] = [];

    const dagNodes = this.buildDAG(workflow);

    // التحقق من التبعيات الدائرية
    const cyclesFound = this.detectCycles(dagNodes);
    cycles.push(...cyclesFound);

    if (cycles.length > 0) {
      errors.push(`تم اكتشاف ${cycles.length} تبعية دائرية`);
    }

    // التحقق من عقد البداية
    const entryNodes = Array.from(dagNodes.values()).filter(
      node => node.isEntry
    );
    if (entryNodes.length === 0) {
      errors.push('لا توجد عقدة بداية في سير العمل');
    } else if (entryNodes.length > 1) {
      warnings.push(`يوجد ${entryNodes.length} عقدة بداية`);
    }

    // التحقق من عقد النهاية
    const exitNodes = Array.from(dagNodes.values()).filter(node => node.isExit);
    if (exitNodes.length === 0) {
      errors.push('لا توجد عقدة نهاية في سير العمل');
    }

    // التحقق من العقد المعزولة
    const isolatedNodes = Array.from(dagNodes.values()).filter(
      node => node.dependencies.length === 0 && node.dependents.length === 0
    );
    if (isolatedNodes.length > 0) {
      warnings.push(`يوجد ${isolatedNodes.length} عقدة معزولة`);
    }

    // التحقق من أنواع العقد
    const startNodes = workflow.nodes.filter(
      node => node.type === NodeType.START
    );
    const endNodes = workflow.nodes.filter(node => node.type === NodeType.END);

    if (startNodes.length !== 1) {
      errors.push('يجب أن يكون هناك عقدة بداية واحدة فقط');
    }

    if (endNodes.length !== 1) {
      errors.push('يجب أن يكون هناك عقدة نهاية واحدة على الأقل');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      cycles,
    };
  }

  /**
   * اكتشاف التبعيات الدائرية
   */
  private static detectCycles(dagNodes: Map<string, DAGNode>): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (nodeId: string, path: string[]): void => {
      if (recursionStack.has(nodeId)) {
        // تم اكتشاف تبعية دائرية
        const cycleStart = path.indexOf(nodeId);
        const cycle = path.slice(cycleStart).concat([nodeId]);
        cycles.push(cycle);
        return;
      }

      if (visited.has(nodeId)) {
        return;
      }

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const node = dagNodes.get(nodeId);
      if (node) {
        node.dependents.forEach(dependentId => {
          dfs(dependentId, [...path, nodeId]);
        });
      }

      recursionStack.delete(nodeId);
    };

    dagNodes.forEach((_, nodeId) => {
      if (!visited.has(nodeId)) {
        dfs(nodeId, []);
      }
    });

    return cycles;
  }

  /**
   * ترتيب طوبولوجي للعقد
   */
  static getTopologicalOrder(workflow: Workflow): TopologicalOrder {
    const dagNodes = this.buildDAG(workflow);
    const visited = new Set<string>();
    const result: string[] = [];
    const levels: number[][] = [];

    const dfs = (nodeId: string): void => {
      if (visited.has(nodeId)) {
        return;
      }

      visited.add(nodeId);
      const node = dagNodes.get(nodeId);

      if (node) {
        // زيارة التبعيات أولاً
        node.dependencies.forEach(dependencyId => {
          dfs(dependencyId);
        });

        result.push(nodeId);
      }
    };

    // البدء من عقد البداية
    dagNodes.forEach(node => {
      if (node.isEntry) {
        dfs(node.id);
      }
    });

    // ترتيب العقد حسب المستوى
    const maxLevel = Math.max(
      ...Array.from(dagNodes.values()).map(n => n.level)
    );
    for (let level = 0; level <= maxLevel; level++) {
      levels[level] = Array.from(dagNodes.values())
        .filter(n => n.level === level)
        .map(n => n.id);
    }

    return {
      nodes: result,
      levels,
      totalLevels: maxLevel + 1,
    };
  }

  /**
   * الحصول على العقد الجاهزة للتنفيذ
   */
  static getReadyNodes(
    workflow: Workflow,
    completedNodes: Set<string>
  ): string[] {
    const dagNodes = this.buildDAG(workflow);
    const readyNodes: string[] = [];

    dagNodes.forEach(node => {
      // التحقق من أن جميع التبعيات مكتملة
      const allDependenciesCompleted = node.dependencies.every(dep =>
        completedNodes.has(dep)
      );

      if (allDependenciesCompleted && !completedNodes.has(node.id)) {
        readyNodes.push(node.id);
      }
    });

    return readyNodes;
  }

  /**
   * تحليل تأثير العقدة
   */
  static analyzeNodeImpact(
    workflow: Workflow,
    nodeId: string
  ): {
    affectedNodes: string[];
    criticalPath: boolean;
    impactLevel: 'low' | 'medium' | 'high';
  } {
    const dagNodes = this.buildDAG(workflow);
    const affectedNodes: string[] = [];
    const visited = new Set<string>();

    const traverseDependents = (id: string): void => {
      if (visited.has(id)) return;
      visited.add(id);
      affectedNodes.push(id);

      const node = dagNodes.get(id);
      if (node) {
        node.dependents.forEach(dependentId => {
          traverseDependents(dependentId);
        });
      }
    };

    traverseDependents(nodeId);
    affectedNodes.shift(); // إزالة العقدة نفسها

    const criticalPath = affectedNodes.length > workflow.nodes.length * 0.5;
    let impactLevel: 'low' | 'medium' | 'high' = 'low';

    if (affectedNodes.length > workflow.nodes.length * 0.7) {
      impactLevel = 'high';
    } else if (affectedNodes.length > workflow.nodes.length * 0.3) {
      impactLevel = 'medium';
    }

    return {
      affectedNodes,
      criticalPath,
      impactLevel,
    };
  }
}
