import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/use-auth';

// Mock Firebase Auth
const mockUser = {
  uid: 'test-uid',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: 'https://example.com/photo.jpg'
};

const mockSignInWithPopup = vi.fn();
const mockSignOut = vi.fn();
const mockOnAuthStateChanged = vi.fn();

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithPopup: mockSignInWithPopup,
  GoogleAuthProvider: vi.fn(),
  signOut: mockSignOut,
  onAuthStateChanged: mockOnAuthStateChanged,
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with no user', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('should handle successful login', async () => {
    mockSignInWithPopup.mockResolvedValue({ user: mockUser });
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.signInWithGoogle();
    });
    
    expect(mockSignInWithPopup).toHaveBeenCalledTimes(1);
  });

  it('should handle login error', async () => {
    const error = new Error('Login failed');
    mockSignInWithPopup.mockRejectedValue(error);
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      try {
        await result.current.signInWithGoogle();
      } catch (e) {
        expect(e).toBe(error);
      }
    });
  });

  it('should handle logout', async () => {
    mockSignOut.mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.signOut();
    });
    
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it('should update user state when auth state changes', () => {
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      // Simulate auth state change
      const unsubscribe = mockOnAuthStateChanged.mockImplementation((callback) => {
        callback(mockUser);
        return unsubscribe;
      });
    });
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
  });
});
