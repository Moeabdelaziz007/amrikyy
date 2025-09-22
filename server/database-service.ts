// Database Integration for Task Automation Engine
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface DatabaseTask {
  id: string;
  name: string;
  description: string;
  type: string;
  config: Record<string, any>;
  dependencies: string[];
  resources: ResourceRequirement[];
  retryPolicy: RetryPolicy;
  timeout: number;
  priority: number;
  tags: string[];
  metadata: TaskMetadata;
  status:
    | 'pending'
    | 'running'
    | 'completed'
    | 'failed'
    | 'cancelled'
    | 'retrying';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

export interface DatabaseTaskExecution {
  id: string;
  taskId: string;
  status:
    | 'pending'
    | 'running'
    | 'completed'
    | 'failed'
    | 'cancelled'
    | 'retrying';
  input: any;
  output?: any;
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  error?: ExecutionError;
  metrics: ExecutionMetrics;
  resources: ResourceAllocation;
  retryCount: number;
  maxRetries: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DatabaseTaskSchedule {
  id: string;
  taskId: string;
  cronExpression: string;
  timezone: string;
  nextRunAt: Timestamp;
  isActive: boolean;
  lastRunAt?: Timestamp;
  runCount: number;
  maxRuns?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DatabaseWorkflow {
  id: string;
  name: string;
  description: string;
  version: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  variables: WorkflowVariable[];
  settings: WorkflowSettings;
  metadata: WorkflowMetadata;
  status: 'draft' | 'active' | 'paused' | 'archived';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

export interface DatabaseWorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'paused' | 'cancelled';
  input: any;
  output?: any;
  startedAt: Timestamp;
  completedAt?: Timestamp;
  error?: ExecutionError;
  metrics: ExecutionMetrics;
  context: ExecutionContext;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export class DatabaseService {
  private db = db;

  // Task Management
  async createTask(
    taskData: Omit<DatabaseTask, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<DatabaseTask> {
    const task: Omit<DatabaseTask, 'id'> = {
      ...taskData,
      id: uuidv4(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await addDoc(collection(this.db, 'tasks'), task);
    return task as DatabaseTask;
  }

  async updateTask(
    taskId: string,
    updates: Partial<DatabaseTask>
  ): Promise<void> {
    const taskRef = doc(this.db, 'tasks', taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  async deleteTask(taskId: string): Promise<void> {
    const taskRef = doc(this.db, 'tasks', taskId);
    await deleteDoc(taskRef);
  }

  async getTask(taskId: string): Promise<DatabaseTask | null> {
    const taskRef = doc(this.db, 'tasks', taskId);
    const taskSnap = await getDoc(taskRef);

    if (taskSnap.exists()) {
      return { id: taskSnap.id, ...taskSnap.data() } as DatabaseTask;
    }
    return null;
  }

  async listTasks(
    filters: {
      status?: string;
      type?: string;
      createdBy?: string;
      limit?: number;
    } = {}
  ): Promise<DatabaseTask[]> {
    let q = query(collection(this.db, 'tasks'));

    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters.type) {
      q = query(q, where('type', '==', filters.type));
    }
    if (filters.createdBy) {
      q = query(q, where('createdBy', '==', filters.createdBy));
    }
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    q = query(q, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as DatabaseTask[];
  }

  // Task Execution Management
  async createTaskExecution(
    executionData: Omit<DatabaseTaskExecution, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<DatabaseTaskExecution> {
    const execution: Omit<DatabaseTaskExecution, 'id'> = {
      ...executionData,
      id: uuidv4(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await addDoc(collection(this.db, 'task_executions'), execution);
    return execution as DatabaseTaskExecution;
  }

  async updateTaskExecution(
    executionId: string,
    updates: Partial<DatabaseTaskExecution>
  ): Promise<void> {
    const executionRef = doc(this.db, 'task_executions', executionId);
    await updateDoc(executionRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  async getTaskExecution(
    executionId: string
  ): Promise<DatabaseTaskExecution | null> {
    const executionRef = doc(this.db, 'task_executions', executionId);
    const executionSnap = await getDoc(executionRef);

    if (executionSnap.exists()) {
      return {
        id: executionSnap.id,
        ...executionSnap.data(),
      } as DatabaseTaskExecution;
    }
    return null;
  }

  async listTaskExecutions(
    filters: {
      taskId?: string;
      status?: string;
      limit?: number;
    } = {}
  ): Promise<DatabaseTaskExecution[]> {
    let q = query(collection(this.db, 'task_executions'));

    if (filters.taskId) {
      q = query(q, where('taskId', '==', filters.taskId));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    q = query(q, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as DatabaseTaskExecution[];
  }

  // Task Schedule Management
  async createTaskSchedule(
    scheduleData: Omit<DatabaseTaskSchedule, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<DatabaseTaskSchedule> {
    const schedule: Omit<DatabaseTaskSchedule, 'id'> = {
      ...scheduleData,
      id: uuidv4(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await addDoc(collection(this.db, 'task_schedules'), schedule);
    return schedule as DatabaseTaskSchedule;
  }

  async updateTaskSchedule(
    scheduleId: string,
    updates: Partial<DatabaseTaskSchedule>
  ): Promise<void> {
    const scheduleRef = doc(this.db, 'task_schedules', scheduleId);
    await updateDoc(scheduleRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  async getTaskSchedule(
    scheduleId: string
  ): Promise<DatabaseTaskSchedule | null> {
    const scheduleRef = doc(this.db, 'task_schedules', scheduleId);
    const scheduleSnap = await getDoc(scheduleRef);

    if (scheduleSnap.exists()) {
      return {
        id: scheduleSnap.id,
        ...scheduleSnap.data(),
      } as DatabaseTaskSchedule;
    }
    return null;
  }

  async listTaskSchedules(
    filters: {
      taskId?: string;
      isActive?: boolean;
      limit?: number;
    } = {}
  ): Promise<DatabaseTaskSchedule[]> {
    let q = query(collection(this.db, 'task_schedules'));

    if (filters.taskId) {
      q = query(q, where('taskId', '==', filters.taskId));
    }
    if (filters.isActive !== undefined) {
      q = query(q, where('isActive', '==', filters.isActive));
    }
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    q = query(q, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as DatabaseTaskSchedule[];
  }

  // Workflow Management
  async createWorkflow(
    workflowData: Omit<DatabaseWorkflow, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<DatabaseWorkflow> {
    const workflow: Omit<DatabaseWorkflow, 'id'> = {
      ...workflowData,
      id: uuidv4(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await addDoc(collection(this.db, 'workflows'), workflow);
    return workflow as DatabaseWorkflow;
  }

  async updateWorkflow(
    workflowId: string,
    updates: Partial<DatabaseWorkflow>
  ): Promise<void> {
    const workflowRef = doc(this.db, 'workflows', workflowId);
    await updateDoc(workflowRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  async getWorkflow(workflowId: string): Promise<DatabaseWorkflow | null> {
    const workflowRef = doc(this.db, 'workflows', workflowId);
    const workflowSnap = await getDoc(workflowRef);

    if (workflowSnap.exists()) {
      return {
        id: workflowSnap.id,
        ...workflowSnap.data(),
      } as DatabaseWorkflow;
    }
    return null;
  }

  async listWorkflows(
    filters: {
      status?: string;
      createdBy?: string;
      limit?: number;
    } = {}
  ): Promise<DatabaseWorkflow[]> {
    let q = query(collection(this.db, 'workflows'));

    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters.createdBy) {
      q = query(q, where('createdBy', '==', filters.createdBy));
    }
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    q = query(q, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as DatabaseWorkflow[];
  }

  // Workflow Execution Management
  async createWorkflowExecution(
    executionData: Omit<
      DatabaseWorkflowExecution,
      'id' | 'createdAt' | 'updatedAt'
    >
  ): Promise<DatabaseWorkflowExecution> {
    const execution: Omit<DatabaseWorkflowExecution, 'id'> = {
      ...executionData,
      id: uuidv4(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await addDoc(collection(this.db, 'workflow_executions'), execution);
    return execution as DatabaseWorkflowExecution;
  }

  async updateWorkflowExecution(
    executionId: string,
    updates: Partial<DatabaseWorkflowExecution>
  ): Promise<void> {
    const executionRef = doc(this.db, 'workflow_executions', executionId);
    await updateDoc(executionRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  async getWorkflowExecution(
    executionId: string
  ): Promise<DatabaseWorkflowExecution | null> {
    const executionRef = doc(this.db, 'workflow_executions', executionId);
    const executionSnap = await getDoc(executionRef);

    if (executionSnap.exists()) {
      return {
        id: executionSnap.id,
        ...executionSnap.data(),
      } as DatabaseWorkflowExecution;
    }
    return null;
  }

  async listWorkflowExecutions(
    filters: {
      workflowId?: string;
      status?: string;
      limit?: number;
    } = {}
  ): Promise<DatabaseWorkflowExecution[]> {
    let q = query(collection(this.db, 'workflow_executions'));

    if (filters.workflowId) {
      q = query(q, where('workflowId', '==', filters.workflowId));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    q = query(q, orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as DatabaseWorkflowExecution[];
  }

  // Real-time Listeners
  subscribeToTasks(callback: (tasks: DatabaseTask[]) => void): () => void {
    const q = query(collection(this.db, 'tasks'), orderBy('updatedAt', 'desc'));

    return onSnapshot(q, querySnapshot => {
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as DatabaseTask[];
      callback(tasks);
    });
  }

  subscribeToTaskExecutions(
    callback: (executions: DatabaseTaskExecution[]) => void
  ): () => void {
    const q = query(
      collection(this.db, 'task_executions'),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, querySnapshot => {
      const executions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as DatabaseTaskExecution[];
      callback(executions);
    });
  }

  subscribeToWorkflows(
    callback: (workflows: DatabaseWorkflow[]) => void
  ): () => void {
    const q = query(
      collection(this.db, 'workflows'),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, querySnapshot => {
      const workflows = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as DatabaseWorkflow[];
      callback(workflows);
    });
  }

  subscribeToWorkflowExecutions(
    callback: (executions: DatabaseWorkflowExecution[]) => void
  ): () => void {
    const q = query(
      collection(this.db, 'workflow_executions'),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, querySnapshot => {
      const executions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as DatabaseWorkflowExecution[];
      callback(executions);
    });
  }
}

// Export database service instance
export const databaseService = new DatabaseService();

// Re-export types for convenience
export type {
  ResourceRequirement,
  RetryPolicy,
  TaskMetadata,
  ExecutionError,
  ExecutionMetrics,
  ResourceAllocation,
  WorkflowNode,
  WorkflowConnection,
  WorkflowVariable,
  WorkflowSettings,
  WorkflowMetadata,
  ExecutionContext,
} from './task-automation-engine';
