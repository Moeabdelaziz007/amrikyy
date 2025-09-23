'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService, User, LoginCredentials, AuthResponse, SecurityMetrics } from '@/lib/auth-service';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  loginWithGoogle: () => Promise<AuthResponse>;
  loginAsGuest: () => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  updatePreferences: (preferences: any) => Promise<boolean>;
  getSecurityMetrics: () => SecurityMetrics;
  enableTwoFactor: () => Promise<{ qrCode: string; secret: string }>;
  verifyTwoFactor: (code: string) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  getUserProfile: () => Promise<User | null>;
  updateUserProfile: (updates: Partial<User>) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function EnhancedAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        const token = authService.getToken();
        
        if (currentUser && token) {
          // Verify token is still valid
          const isValid = await authService.refreshAuthToken();
          if (isValid) {
            setUser(currentUser);
          } else {
            // Token expired, clear auth
            await authService.logout();
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      if (response.success && response.user) {
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Google login function
  const loginWithGoogle = useCallback(async (): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const response = await authService.loginWithGoogle();
      
      if (response.success && response.user) {
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Google login error:', error);
      return {
        success: false,
        error: 'Google login failed',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Guest login function
  const loginAsGuest = useCallback(async (): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const response = await authService.loginAsGuest();
      
      if (response.success && response.user) {
        setUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Guest login error:', error);
      return {
        success: false,
        error: 'Guest login failed',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh token function
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      return await authService.refreshAuthToken();
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }, []);

  // Update preferences function
  const updatePreferences = useCallback(async (preferences: any): Promise<boolean> => {
    try {
      const success = await authService.updatePreferences(preferences);
      if (success && user) {
        // Update local user state
        const updatedUser = { ...user, preferences: { ...user.preferences, ...preferences } };
        setUser(updatedUser);
      }
      return success;
    } catch (error) {
      console.error('Update preferences error:', error);
      return false;
    }
  }, [user]);

  // Get security metrics function
  const getSecurityMetrics = useCallback((): SecurityMetrics => {
    return authService.getSecurityMetrics();
  }, []);

  // Enable two-factor authentication
  const enableTwoFactor = useCallback(async (): Promise<{ qrCode: string; secret: string }> => {
    try {
      return await authService.enableTwoFactor();
    } catch (error) {
      console.error('Enable 2FA error:', error);
      throw error;
    }
  }, []);

  // Verify two-factor code
  const verifyTwoFactor = useCallback(async (code: string): Promise<boolean> => {
    try {
      return await authService.verifyTwoFactor(code);
    } catch (error) {
      console.error('Verify 2FA error:', error);
      return false;
    }
  }, []);

  // Request password reset
  const requestPasswordReset = useCallback(async (email: string): Promise<boolean> => {
    try {
      return await authService.requestPasswordReset(email);
    } catch (error) {
      console.error('Password reset request error:', error);
      return false;
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      return await authService.changePassword(currentPassword, newPassword);
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  }, []);

  // Get user profile
  const getUserProfile = useCallback(async (): Promise<User | null> => {
    try {
      const profile = await authService.getUserProfile();
      if (profile) {
        setUser(profile);
      }
      return profile;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }, []);

  // Update user profile
  const updateUserProfile = useCallback(async (updates: Partial<User>): Promise<boolean> => {
    try {
      const success = await authService.updateUserProfile(updates);
      if (success && user) {
        setUser({ ...user, ...updates });
      }
      return success;
    } catch (error) {
      console.error('Update user profile error:', error);
      return false;
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    loginAsGuest,
    logout,
    refreshToken,
    updatePreferences,
    getSecurityMetrics,
    enableTwoFactor,
    verifyTwoFactor,
    requestPasswordReset,
    changePassword,
    getUserProfile,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useEnhancedAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useEnhancedAuth must be used within an EnhancedAuthProvider');
  }
  return context;
};

// Backward compatibility
export const useAuth = useEnhancedAuth;
