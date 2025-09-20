/**
 * Mock Firestore adapter for local testing without Firebase
 */

import { Task, TaskExecution, TaskSchedule, Worker } from '../types/task';

// In-memory storage
const tasks = new Map<string, Task>();
const executions = new Map<string, TaskExecution>();
const schedules = new Map<string, TaskSchedule>();
const workers = new Map<string, Worker>();

export const initializeFirestore = () => {
  console.log('Mock Firestore initialized for local testing');
};

// Task operations
export const saveTask = async (task: Task): Promise<void> => {
  tasks.set(task.id, task);
  console.log(`Task saved: ${task.id} - ${task.name}`);
};

export const getTask = async (id: string): Promise<Task | null> => {
  return tasks.get(id) || null;
};

export const getAllTasks = async (): Promise<Task[]> => {
  return Array.from(tasks.values());
};

export const deleteTask = async (id: string): Promise<void> => {
  tasks.delete(id);
  console.log(`Task deleted: ${id}`);
};

// Task execution operations
export const saveTaskExecution = async (execution: TaskExecution): Promise<void> => {
  executions.set(execution.id, execution);
  console.log(`Execution saved: ${execution.id} - Status: ${execution.status}`);
};

export const getTaskExecution = async (id: string): Promise<TaskExecution | null> => {
  return executions.get(id) || null;
};

export const getTaskExecutions = async (taskId: string): Promise<TaskExecution[]> => {
  return Array.from(executions.values())
    .filter(exec => exec.taskId === taskId)
    .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
};

// Task schedule operations
export const saveTaskSchedule = async (schedule: TaskSchedule): Promise<void> => {
  schedules.set(schedule.id, schedule);
  console.log(`Schedule saved: ${schedule.id}`);
};

export const getTaskSchedule = async (id: string): Promise<TaskSchedule | null> => {
  return schedules.get(id) || null;
};

// Worker operations
export const saveWorker = async (worker: Worker): Promise<void> => {
  workers.set(worker.id, worker);
  console.log(`Worker saved: ${worker.id} - Status: ${worker.status}`);
};

export const getWorker = async (id: string): Promise<Worker | null> => {
  return workers.get(id) || null;
};

export const getAllWorkers = async (): Promise<Worker[]> => {
  return Array.from(workers.values());
};

// Utility function to clear all data (for testing)
export const clearAllData = (): void => {
  tasks.clear();
  executions.clear();
  schedules.clear();
  workers.clear();
  console.log('All mock data cleared');
};

// Utility function to get storage stats
export const getStorageStats = () => {
  return {
    tasks: tasks.size,
    executions: executions.size,
    schedules: schedules.size,
    workers: workers.size
  };
};
