'use client';

import { useAuth } from '@/hooks/use-auth';
import Loading from '@/pages/loading';
import Login from '@/pages/login';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  // Show guest mode indicator for guest users
  const isGuestUser =
    user?.isAnonymous || localStorage.getItem('isGuestUser') === 'true';

  return (
    <>
      {isGuestUser && (
        <div className="bg-yellow-100 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-2 text-center">
          <span className="text-sm text-yellow-800 dark:text-yellow-200">
            <i className="fas fa-user mr-2"></i>
            You're using Guest Mode.{' '}
            <a href="/login" className="underline hover:no-underline">
              Sign in
            </a>{' '}
            for full features.
          </span>
        </div>
      )}
      {children}
    </>
  );
}
