/**
 * Firestore adapter for persisting task automation data
 */

import admin from 'firebase-admin';
import { Task, TaskExecution, TaskSchedule, Worker } from '../types/task';

// Initialize Firebase Admin SDK
let db: admin.firestore.Firestore;

export const initializeFirestore = (serviceAccountPath?: string) => {
  try {
    if (!admin.apps.length) {
      if (serviceAccountPath) {
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      } else {
        // Use default credentials (for local development or production)
        admin.initializeApp();
      }
    }
    db = admin.firestore();
    console.log('Firestore initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firestore:', error);
    throw error;
  }
};

// Task operations
export const saveTask = async (task: Task): Promise<void> => {
  try {
    await db.collection('tasks').doc(task.id).set({
      ...task,
      createdAt: admin.firestore.Timestamp.fromDate(task.createdAt),
      updatedAt: admin.firestore.Timestamp.fromDate(task.updatedAt)
    });
  } catch (error) {
    console.error('Failed to save task:', error);
    throw error;
  }
};

export const getTask = async (id: string): Promise<Task | null> => {
  try {
    const doc = await db.collection('tasks').doc(id).get();
    if (!doc.exists) {
      return null;
    }
    
    const data = doc.data()!;
    return {
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as Task;
  } catch (error) {
    console.error('Failed to get task:', error);
    throw error;
  }
};

export const getAllTasks = async (): Promise<Task[]> => {
  try {
    const snapshot = await db.collection('tasks').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as Task;
    });
  } catch (error) {
    console.error('Failed to get all tasks:', error);
    throw error;
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    await db.collection('tasks').doc(id).delete();
  } catch (error) {
    console.error('Failed to delete task:', error);
    throw error;
  }
};

// Task execution operations
export const saveTaskExecution = async (execution: TaskExecution): Promise<void> => {
  try {
    await db.collection('executions').doc(execution.id).set({
      ...execution,
      startedAt: admin.firestore.Timestamp.fromDate(execution.startedAt),
      completedAt: execution.completedAt 
        ? admin.firestore.Timestamp.fromDate(execution.completedAt)
        : null
    });
  } catch (error) {
    console.error('Failed to save task execution:', error);
    throw error;
  }
};

export const getTaskExecution = async (id: string): Promise<TaskExecution | null> => {
  try {
    const doc = await db.collection('executions').doc(id).get();
    if (!doc.exists) {
      return null;
    }
    
    const data = doc.data()!;
    return {
      ...data,
      startedAt: data.startedAt.toDate(),
      completedAt: data.completedAt ? data.completedAt.toDate() : undefined
    } as TaskExecution;
  } catch (error) {
    console.error('Failed to get task execution:', error);
    throw error;
  }
};

export const getTaskExecutions = async (taskId: string): Promise<TaskExecution[]> => {
  try {
    const snapshot = await db.collection('executions')
      .where('taskId', '==', taskId)
      .orderBy('startedAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        startedAt: data.startedAt.toDate(),
        completedAt: data.completedAt ? data.completedAt.toDate() : undefined
      } as TaskExecution;
    });
  } catch (error) {
    console.error('Failed to get task executions:', error);
    throw error;
  }
};

// Task schedule operations
export const saveTaskSchedule = async (schedule: TaskSchedule): Promise<void> => {
  try {
    await db.collection('schedules').doc(schedule.id).set({
      ...schedule,
      nextRunAt: schedule.nextRunAt 
        ? admin.firestore.Timestamp.fromDate(schedule.nextRunAt)
        : null,
      createdAt: admin.firestore.Timestamp.fromDate(schedule.createdAt),
      updatedAt: admin.firestore.Timestamp.fromDate(schedule.updatedAt)
    });
  } catch (error) {
    console.error('Failed to save task schedule:', error);
    throw error;
  }
};

export const getTaskSchedule = async (id: string): Promise<TaskSchedule | null> => {
  try {
    const doc = await db.collection('schedules').doc(id).get();
    if (!doc.exists) {
      return null;
    }
    
    const data = doc.data()!;
    return {
      ...data,
      nextRunAt: data.nextRunAt ? data.nextRunAt.toDate() : undefined,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as TaskSchedule;
  } catch (error) {
    console.error('Failed to get task schedule:', error);
    throw error;
  }
};

// Worker operations
export const saveWorker = async (worker: Worker): Promise<void> => {
  try {
    await db.collection('workers').doc(worker.id).set({
      ...worker,
      lastHeartbeat: admin.firestore.Timestamp.fromDate(worker.lastHeartbeat)
    });
  } catch (error) {
    console.error('Failed to save worker:', error);
    throw error;
  }
};

export const getWorker = async (id: string): Promise<Worker | null> => {
  try {
    const doc = await db.collection('workers').doc(id).get();
    if (!doc.exists) {
      return null;
    }
    
    const data = doc.data()!;
    return {
      ...data,
      lastHeartbeat: data.lastHeartbeat.toDate()
    } as Worker;
  } catch (error) {
    console.error('Failed to get worker:', error);
    throw error;
  }
};

export const getAllWorkers = async (): Promise<Worker[]> => {
  try {
    const snapshot = await db.collection('workers').get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        lastHeartbeat: data.lastHeartbeat.toDate()
      } as Worker;
    });
  } catch (error) {
    console.error('Failed to get all workers:', error);
    throw error;
  }
};
