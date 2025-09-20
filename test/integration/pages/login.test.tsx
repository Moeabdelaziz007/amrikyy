import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from '@/pages/login';

// Mock Firebase Auth
const mockSignInWithPopup = vi.fn();
const mockOnAuthStateChanged = vi.fn();

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithPopup: mockSignInWithPopup,
  GoogleAuthProvider: vi.fn(),
  onAuthStateChanged: mockOnAuthStateChanged,
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Login Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form correctly', () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    expect(screen.getByText('Welcome to AuraOS')).toBeInTheDocument();
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in with Google' })).toBeInTheDocument();
  });

  it('should handle successful Google login', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
    };

    mockSignInWithPopup.mockResolvedValue({ user: mockUser });

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const loginButton = screen.getByRole('button', { name: 'Sign in with Google' });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockSignInWithPopup).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle login error', async () => {
    const error = new Error('Login failed');
    mockSignInWithPopup.mockRejectedValue(error);

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const loginButton = screen.getByRole('button', { name: 'Sign in with Google' });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('should show loading state during login', async () => {
    mockSignInWithPopup.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const loginButton = screen.getByRole('button', { name: 'Sign in with Google' });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(loginButton).toBeDisabled();
    });
  });
});
