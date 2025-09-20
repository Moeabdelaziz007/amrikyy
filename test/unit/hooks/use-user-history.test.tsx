import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUserHistory } from '@/hooks/use-user-history';

// Mock Firebase Firestore
const mockCollection = vi.fn();
const mockDoc = vi.fn();
const mockGetDocs = vi.fn();
const mockAddDoc = vi.fn();
const mockUpdateDoc = vi.fn();

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: mockCollection,
  doc: mockDoc,
  getDocs: mockGetDocs,
  addDoc: mockAddDoc,
  updateDoc: mockUpdateDoc,
}));

describe('useUserHistory Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty history', () => {
    const { result } = renderHook(() => useUserHistory());
    
    expect(result.current.history).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should track page visits', async () => {
    const { result } = renderHook(() => useUserHistory());
    
    await act(async () => {
      await result.current.trackPageVisit('dashboard', 'home', 5000);
    });
    
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0]).toMatchObject({
      actionType: 'page_visit',
      targetType: 'page',
      targetId: 'dashboard',
      details: expect.objectContaining({
        pageName: 'dashboard',
        previousPage: 'home',
        duration: 5000
      })
    });
  });

  it('should track user actions', async () => {
    const { result } = renderHook(() => useUserHistory());
    
    await act(async () => {
      await result.current.trackUserAction('click', 'button', 'submit-form', {
        formName: 'login',
        fieldData: { email: 'test@example.com' }
      });
    });
    
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0]).toMatchObject({
      actionType: 'click',
      targetType: 'button',
      targetId: 'submit-form'
    });
  });

  it('should track AI interactions', async () => {
    const { result } = renderHook(() => useUserHistory());
    
    await act(async () => {
      await result.current.trackAIInteraction('chat', 'ai-agent-1', {
        prompt: 'Hello AI',
        response: 'Hello! How can I help you?',
        model: 'gpt-4'
      });
    });
    
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0]).toMatchObject({
      actionType: 'chat',
      targetType: 'ai_agent',
      targetId: 'ai-agent-1'
    });
  });

  it('should track workflow executions', async () => {
    const { result } = renderHook(() => useUserHistory());
    
    await act(async () => {
      await result.current.trackWorkflowExecution('execute', 'workflow-123', {
        workflowName: 'Email Automation',
        steps: ['trigger', 'process', 'send'],
        success: true
      });
    });
    
    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0]).toMatchObject({
      actionType: 'execute',
      targetType: 'workflow',
      targetId: 'workflow-123'
    });
  });

  it('should handle errors gracefully', async () => {
    const error = new Error('Database error');
    mockAddDoc.mockRejectedValue(error);
    
    const { result } = renderHook(() => useUserHistory());
    
    await act(async () => {
      await result.current.trackPageVisit('dashboard', 'home', 5000);
    });
    
    expect(result.current.error).toBe(error);
  });

  it('should export user data', async () => {
    const { result } = renderHook(() => useUserHistory());
    
    // Add some test data
    await act(async () => {
      await result.current.trackPageVisit('dashboard', 'home', 5000);
      await result.current.trackUserAction('click', 'button', 'submit-form');
    });
    
    const exportedData = result.current.exportUserData();
    
    expect(exportedData).toHaveProperty('userHistory');
    expect(exportedData).toHaveProperty('exportDate');
    expect(exportedData.userHistory).toHaveLength(2);
  });
});
