// Enhanced Authentication Service
import { automationApi } from '@/services/automation-api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
  avatar?: string;
  emailVerified: boolean;
  isAnonymous?: boolean;
  lastLogin?: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
  twoFactorEnabled: boolean;
  securityLevel: 'basic' | 'enhanced' | 'maximum';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  twoFactorCode?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  expiresAt?: Date;
  requiresTwoFactor?: boolean;
  error?: string;
}

export interface SecurityMetrics {
  loginAttempts: number;
  lastFailedLogin?: Date;
  isLocked: boolean;
  lockoutExpires?: Date;
  suspiciousActivity: boolean;
  deviceTrusted: boolean;
}

class AuthService {
  private baseUrl: string;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private user: User | null = null;

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.loadStoredAuth();
  }

  // Load authentication data from storage
  private loadStoredAuth() {
    try {
      this.token = localStorage.getItem('auth_token');
      this.refreshToken = localStorage.getItem('refresh_token');
      const userData = localStorage.getItem('user_data');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
      this.clearAuth();
    }
  }

  // Store authentication data
  private storeAuth(user: User, token: string, refreshToken?: string) {
    this.user = user;
    this.token = token;
    this.refreshToken = refreshToken || null;

    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  // Clear authentication data
  private clearAuth() {
    this.user = null;
    this.token = null;
    this.refreshToken = null;

    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lockoutTime');
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.user;
  }

  // Get current token
  getToken(): string | null {
    return this.token;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.user && !!this.token;
  }

  // Enhanced login with security features
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store authentication data
        this.storeAuth(data.user, data.token, data.refreshToken);

        // Update user preferences if provided
        if (data.user.preferences) {
          await this.updatePreferences(data.user.preferences);
        }

        // Track successful login
        this.trackLoginSuccess(data.user);

        return {
          success: true,
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
          requiresTwoFactor: data.requiresTwoFactor,
        };
      } else {
        // Track failed login
        this.trackLoginFailure(credentials.email);

        return {
          success: false,
          error: data.error || 'Login failed',
          requiresTwoFactor: data.requiresTwoFactor,
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  }

  // Google OAuth login
  async loginWithGoogle(): Promise<AuthResponse> {
    try {
      // In a real implementation, this would integrate with Google OAuth
      // For now, we'll simulate the process
      const mockUser: User = {
        id: 'google_' + Date.now(),
        email: 'user@gmail.com',
        name: 'Google User',
        role: 'user',
        emailVerified: true,
        avatar: 'https://via.placeholder.com/150',
        lastLogin: new Date(),
      };

      const mockToken = 'google_token_' + Date.now();
      
      this.storeAuth(mockUser, mockToken);
      this.trackLoginSuccess(mockUser);

      return {
        success: true,
        user: mockUser,
        token: mockToken,
      };
    } catch (error) {
      console.error('Google login error:', error);
      return {
        success: false,
        error: 'Google login failed',
      };
    }
  }

  // Guest login
  async loginAsGuest(): Promise<AuthResponse> {
    try {
      const guestUser: User = {
        id: 'guest_' + Date.now(),
        email: 'guest@auraos.com',
        name: 'Guest User',
        role: 'guest',
        emailVerified: false,
        isAnonymous: true,
        lastLogin: new Date(),
        preferences: {
          theme: 'auto',
          notifications: false,
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          twoFactorEnabled: false,
          securityLevel: 'basic',
        },
      };

      const guestToken = 'guest_token_' + Date.now();
      
      this.storeAuth(guestUser, guestToken);
      this.trackLoginSuccess(guestUser);

      return {
        success: true,
        user: guestUser,
        token: guestToken,
      };
    } catch (error) {
      console.error('Guest login error:', error);
      return {
        success: false,
        error: 'Guest login failed',
      };
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      if (this.token) {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  // Refresh token
  async refreshAuthToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.token = data.token;
        localStorage.setItem('auth_token', data.token);
        return true;
      } else {
        this.clearAuth();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuth();
      return false;
    }
  }

  // Update user preferences
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<boolean> {
    if (!this.user) return false;

    try {
      const response = await automationApi.updateMyPreferences(preferences);
      
      if (response.success) {
        this.user.preferences = { ...this.user.preferences, ...preferences };
        localStorage.setItem('user_data', JSON.stringify(this.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      return false;
    }
  }

  // Get security metrics
  getSecurityMetrics(): SecurityMetrics {
    const loginAttempts = parseInt(localStorage.getItem('loginAttempts') || '0');
    const lastFailedLogin = localStorage.getItem('lastFailedLogin');
    const lockoutTime = localStorage.getItem('lockoutTime');
    const isLocked = lockoutTime ? new Date(lockoutTime) > new Date() : false;

    return {
      loginAttempts,
      lastFailedLogin: lastFailedLogin ? new Date(lastFailedLogin) : undefined,
      isLocked,
      lockoutExpires: lockoutTime ? new Date(lockoutTime) : undefined,
      suspiciousActivity: loginAttempts > 3,
      deviceTrusted: localStorage.getItem('deviceTrusted') === 'true',
    };
  }

  // Track successful login
  private trackLoginSuccess(user: User) {
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lockoutTime');
    localStorage.removeItem('lastFailedLogin');
    
    // Mark device as trusted after successful login
    localStorage.setItem('deviceTrusted', 'true');
    
    // Update last login time
    user.lastLogin = new Date();
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  // Track failed login
  private trackLoginFailure(email: string) {
    const attempts = parseInt(localStorage.getItem('loginAttempts') || '0') + 1;
    localStorage.setItem('loginAttempts', attempts.toString());
    localStorage.setItem('lastFailedLogin', new Date().toISOString());

    // Lock account after 5 failed attempts
    if (attempts >= 5) {
      const lockoutTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      localStorage.setItem('lockoutTime', lockoutTime.toISOString());
    }
  }

  // Enable two-factor authentication
  async enableTwoFactor(): Promise<{ qrCode: string; secret: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/2fa/enable`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return {
          qrCode: data.qrCode,
          secret: data.secret,
        };
      }
      
      throw new Error(data.error || 'Failed to enable 2FA');
    } catch (error) {
      console.error('2FA enable error:', error);
      throw error;
    }
  }

  // Verify two-factor code
  async verifyTwoFactor(code: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/2fa/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      return response.ok && data.success;
    } catch (error) {
      console.error('2FA verify error:', error);
      return false;
    }
  }

  // Password reset request
  async requestPasswordReset(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return response.ok && data.success;
    } catch (error) {
      console.error('Password reset request error:', error);
      return false;
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      return response.ok && data.success;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  }

  // Get user profile
  async getUserProfile(): Promise<User | null> {
    try {
      const response = await automationApi.getMe();
      
      if (response.success) {
        this.user = response.data;
        localStorage.setItem('user_data', JSON.stringify(this.user));
        return this.user;
      }
      
      return null;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(updates: Partial<User>): Promise<boolean> {
    try {
      const response = await automationApi.updateMe(updates);
      
      if (response.success) {
        this.user = { ...this.user, ...updates };
        localStorage.setItem('user_data', JSON.stringify(this.user));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Update user profile error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
