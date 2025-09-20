import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from '@/pages/dashboard';

// Mock Firebase Auth
const mockUser = {
  uid: 'test-uid',
  email: 'test@example.com',
  displayName: 'Test User',
};

vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    user: mockUser,
    loading: false,
    signOut: vi.fn(),
  }),
}));

// Mock Firebase Firestore
const mockGetDocs = vi.fn();
const mockOnSnapshot = vi.fn();

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  getDocs: mockGetDocs,
  onSnapshot: mockOnSnapshot,
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

describe('Dashboard Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dashboard with user data', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('should display navigation menu', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('AI Agents')).toBeInTheDocument();
    expect(screen.getByText('Workflows')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('should handle navigation between sections', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    const aiAgentsLink = screen.getByText('AI Agents');
    fireEvent.click(aiAgentsLink);

    await waitFor(() => {
      expect(screen.getByText('AI Agents')).toBeInTheDocument();
    });
  });

  it('should display user statistics', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    expect(screen.getByText('Total Workflows')).toBeInTheDocument();
    expect(screen.getByText('Active Agents')).toBeInTheDocument();
    expect(screen.getByText('Messages Today')).toBeInTheDocument();
  });

  it('should handle logout functionality', async () => {
    const mockSignOut = vi.fn();
    
    vi.mocked(require('@/hooks/use-auth').useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      signOut: mockSignOut,
    });

    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    const logoutButton = screen.getByText('Sign Out');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
  });
});
