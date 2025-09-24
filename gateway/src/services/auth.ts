// Authentication Service - خدمة المصادقة والتفويض
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Logger } from '../utils/logger.js';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

interface TokenPayload {
  userId: string;
  username: string;
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
}

export class AuthService {
  private jwtSecret: string;
  private jwtExpiresIn: string;
  private logger: Logger;
  private users: Map<string, User> = new Map();

  constructor(jwtSecret: string, jwtExpiresIn: string = '24h') {
    this.jwtSecret = jwtSecret;
    this.jwtExpiresIn = jwtExpiresIn;
    this.logger = new Logger();
    
    // Initialize with default users
    this.initializeDefaultUsers();
  }

  private initializeDefaultUsers(): void {
    // Default admin user
    const adminUser: User = {
      id: 'admin-001',
      username: 'admin',
      email: 'admin@auraos.com',
      role: 'admin',
      permissions: ['*'], // All permissions
      isActive: true,
      createdAt: new Date(),
    };

    // Default service user
    const serviceUser: User = {
      id: 'service-001',
      username: 'service',
      email: 'service@auraos.com',
      role: 'service',
      permissions: ['read', 'write', 'publish', 'subscribe'],
      isActive: true,
      createdAt: new Date(),
    };

    this.users.set(adminUser.id, adminUser);
    this.users.set(serviceUser.id, serviceUser);
  }

  // User management
  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const userId = this.generateUserId();
      const hashedPassword = await this.hashPassword(userData.password || 'default123');
      
      const user: User = {
        id: userId,
        username: userData.username || `user-${userId}`,
        email: userData.email || '',
        role: userData.role || 'user',
        permissions: userData.permissions || ['read'],
        isActive: true,
        createdAt: new Date(),
      };

      this.users.set(userId, user);
      
      this.logger.info('User created', {
        userId,
        username: user.username,
        role: user.role,
      });

      return user;
    } catch (error) {
      this.logger.error('Failed to create user', { error });
      throw error;
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.users.get(userId) || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(userId);
    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    this.users.set(userId, updatedUser);

    this.logger.info('User updated', { userId, updates });
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const deleted = this.users.delete(userId);
    if (deleted) {
      this.logger.info('User deleted', { userId });
    }
    return deleted;
  }

  // Authentication
  async authenticate(username: string, password: string): Promise<{ user: User; token: string } | null> {
    try {
      const user = await this.getUserByUsername(username);
      if (!user || !user.isActive) {
        return null;
      }

      // For demo purposes, we'll use a simple password check
      // In production, you'd verify against hashed passwords
      const isValidPassword = await this.verifyPassword(password, 'default123');
      if (!isValidPassword) {
        return null;
      }

      // Update last login
      user.lastLogin = new Date();
      this.users.set(user.id, user);

      // Generate token
      const token = await this.generateToken(user);

      this.logger.info('User authenticated', {
        userId: user.id,
        username: user.username,
        role: user.role,
      });

      return { user, token };
    } catch (error) {
      this.logger.error('Authentication failed', { error, username });
      throw error;
    }
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as TokenPayload;
      
      // Verify user still exists and is active
      const user = await this.getUserById(decoded.userId);
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      return decoded;
    } catch (error) {
      this.logger.error('Token verification failed', { error });
      throw new Error('Invalid token');
    }
  }

  async refreshToken(token: string): Promise<string> {
    try {
      const decoded = await this.verifyToken(token);
      const user = await this.getUserById(decoded.userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      return await this.generateToken(user);
    } catch (error) {
      this.logger.error('Token refresh failed', { error });
      throw error;
    }
  }

  // Authorization
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    try {
      const user = await this.getUserById(userId);
      if (!user || !user.isActive) {
        return false;
      }

      // Admin has all permissions
      if (user.permissions.includes('*')) {
        return true;
      }

      return user.permissions.includes(permission);
    } catch (error) {
      this.logger.error('Permission check failed', { error, userId, permission });
      return false;
    }
  }

  async hasRole(userId: string, role: string): Promise<boolean> {
    try {
      const user = await this.getUserById(userId);
      return user ? user.role === role : false;
    } catch (error) {
      this.logger.error('Role check failed', { error, userId, role });
      return false;
    }
  }

  // Token management
  private async generateToken(user: User): Promise<string> {
    const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
      userId: user.id,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    });
  }

  // Password utilities
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    return bcrypt.hash(password, saltRounds);
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Utility methods
  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // API Key management
  async generateApiKey(userId: string, name: string): Promise<{ apiKey: string; expiresAt: Date }> {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const apiKey = this.generateApiKeyString();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      // Store API key (in production, store in database)
      this.logger.info('API key generated', {
        userId,
        name,
        expiresAt,
      });

      return { apiKey, expiresAt };
    } catch (error) {
      this.logger.error('Failed to generate API key', { error, userId });
      throw error;
    }
  }

  async validateApiKey(apiKey: string): Promise<User | null> {
    try {
      // In production, validate against stored API keys
      // For demo, we'll use a simple validation
      if (apiKey.startsWith('auraos_')) {
        return await this.getUserById('service-001');
      }
      return null;
    } catch (error) {
      this.logger.error('API key validation failed', { error });
      return null;
    }
  }

  private generateApiKeyString(): string {
    const prefix = 'auraos_';
    const randomPart = Math.random().toString(36).substr(2, 32);
    return `${prefix}${randomPart}`;
  }

  // Get all users (for admin purposes)
  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  // Get user statistics
  getUserStats(): { totalUsers: number; activeUsers: number; usersByRole: Record<string, number> } {
    const users = this.getAllUsers();
    const activeUsers = users.filter(user => user.isActive);
    const usersByRole: Record<string, number> = {};

    users.forEach(user => {
      usersByRole[user.role] = (usersByRole[user.role] || 0) + 1;
    });

    return {
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      usersByRole,
    };
  }
}
