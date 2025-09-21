"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "@/lib/firebase";

type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous?: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      // Check for existing guest user
      const isGuestUser = localStorage.getItem('isGuestUser') === 'true';
      const guestUserData = localStorage.getItem('guestUser');

      if (user) {
        // Real Firebase user
        setUser(user);
        setLoading(false);
      } else if (isGuestUser && guestUserData) {
        // Guest user
        const guestUser = JSON.parse(guestUserData);
        setUser(guestUser);
        setLoading(false);
      } else {
        // No user
        setUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await AuthService.signInWithGoogle();
    } catch (error) {
      console.error('Sign-in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInAsGuest = async () => {
    try {
      setLoading(true);
      // Create a guest user object
      const guestUser: User = {
        uid: 'guest-' + Date.now(),
        email: 'guest@auraos.com',
        displayName: 'Guest User',
        photoURL: null,
        emailVerified: false,
        isAnonymous: true
      };

      // Store guest info in localStorage
      localStorage.setItem('isGuestUser', 'true');
      localStorage.setItem('guestUser', JSON.stringify(guestUser));

      setUser(guestUser);
    } catch (error) {
      console.error('Guest sign-in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      await AuthService.signInWithEmail(email, password);
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
    try {
      setLoading(true);
      await AuthService.signUpWithEmail(email, password, displayName);
    } catch (error) {
      console.error('Email sign-up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);

      // Check if current user is guest
      const isGuestUser = localStorage.getItem('isGuestUser') === 'true';

      if (isGuestUser) {
        // Clear guest user data
        localStorage.removeItem('isGuestUser');
        localStorage.removeItem('guestUser');
        setUser(null);
      } else {
        // Real Firebase user
        await AuthService.signOut();
      }
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signInAsGuest,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};