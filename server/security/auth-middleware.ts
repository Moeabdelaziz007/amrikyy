import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../firebase';

// Enhanced JWT configuration
interface JWTConfig {
  secret: string;
  expiresIn: string;
  refreshExpiresIn: string;
  algorithm: 'HS256' | 'RS256';
}

interface UserSession {
  userId: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  permissions: string[];
  sessionId: string;
  lastActivity: Date;
  ipAddress: string;
  userAgent: string;
}

interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

interface Role {
  name: string;
  permissions: Permission[];
  inheritedRoles?: string[];
}

// Role-based permissions configuration
const ROLES: Record<string, Role> = {
  admin: {
    name: 'admin',
    permissions: [
      { resource: '*', actions: ['create', 'read', 'update', 'delete'] },
    ],
  },
  moderator: {
    name: 'moderator',
    permissions: [
      { resource: 'posts', actions: ['read', 'update', 'delete'] },
      { resource: 'users', actions: ['read'] },
      { resource: 'analytics', actions: ['read'] },
    ],
  },
  user: {
    name: 'user',
    permissions: [
      { resource: 'posts', actions: ['create', 'read'] },
      { resource: 'profile', actions: ['read', 'update'] },
      { resource: 'analytics', actions: ['read'] },
    ],
  },
};

// Security configuration
const JWT_CONFIG: JWTConfig = {
  secret:
    process.env.JWT_SECRET ||
    'your-super-secure-jwt-secret-key-change-in-production',
  expiresIn: '15m',
  refreshExpiresIn: '7d',
  algorithm: 'HS256',
};

// Active sessions storage (in production, use Redis or database)
const activeSessions = new Map<string, UserSession>();

// Enhanced authentication middleware
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided',
        code: 'NO_TOKEN',
      });
    }

    // Verify Firebase token
    const decodedToken = await verifyToken(token);

    // Check if session is active
    const session = activeSessions.get(decodedToken.uid);
    if (!session) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Invalid or expired session',
        code: 'INVALID_SESSION',
      });
    }

    // Update last activity
    session.lastActivity = new Date();
    session.ipAddress = req.ip || req.connection.remoteAddress || '';
    session.userAgent = req.get('User-Agent') || '';

    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: session.role,
      permissions: session.permissions,
      sessionId: session.sessionId,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({
      error: 'Access denied',
      message: 'Invalid token',
      code: 'INVALID_TOKEN',
    });
  }
};

// Role-based authorization middleware
export const authorize = (resource: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED',
        });
      }

      // Check if user has permission
      const hasPermission = checkPermission(user.role, resource, action);

      if (!hasPermission) {
        // Log unauthorized access attempt
        console.warn(
          `Unauthorized access attempt: User ${user.uid} tried to ${action} ${resource}`
        );

        return res.status(403).json({
          error: 'Forbidden',
          message: `Insufficient permissions to ${action} ${resource}`,
          code: 'INSUFFICIENT_PERMISSIONS',
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({
        error: 'Authorization error',
        message: 'Failed to verify permissions',
        code: 'AUTH_ERROR',
      });
    }
  };
};

// Check if user has permission for specific resource and action
function checkPermission(
  role: string,
  resource: string,
  action: string
): boolean {
  const roleConfig = ROLES[role];
  if (!roleConfig) return false;

  // Check direct permissions
  for (const permission of roleConfig.permissions) {
    if (permission.resource === '*' || permission.resource === resource) {
      if (permission.actions.includes(action as any)) {
        return true;
      }
    }
  }

  // Check inherited roles
  if (roleConfig.inheritedRoles) {
    for (const inheritedRole of roleConfig.inheritedRoles) {
      if (checkPermission(inheritedRole, resource, action)) {
        return true;
      }
    }
  }

  return false;
}

// Session management functions
export const createSession = (user: any, req: Request): UserSession => {
  const sessionId = generateSessionId();
  const session: UserSession = {
    userId: user.uid,
    email: user.email,
    role: user.role || 'user',
    permissions: getRolePermissions(user.role || 'user'),
    sessionId,
    lastActivity: new Date(),
    ipAddress: req.ip || req.connection.remoteAddress || '',
    userAgent: req.get('User-Agent') || '',
  };

  activeSessions.set(user.uid, session);
  return session;
};

export const destroySession = (userId: string): boolean => {
  return activeSessions.delete(userId);
};

export const getSession = (userId: string): UserSession | undefined => {
  return activeSessions.get(userId);
};

export const updateSessionActivity = (userId: string): void => {
  const session = activeSessions.get(userId);
  if (session) {
    session.lastActivity = new Date();
  }
};

// Utility functions
function generateSessionId(): string {
  return (
    'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  );
}

function getRolePermissions(role: string): string[] {
  const roleConfig = ROLES[role];
  if (!roleConfig) return [];

  const permissions: string[] = [];
  for (const permission of roleConfig.permissions) {
    for (const action of permission.actions) {
      permissions.push(`${permission.resource}:${action}`);
    }
  }
  return permissions;
}

// Session cleanup (run periodically)
export const cleanupExpiredSessions = (): void => {
  const now = new Date();
  const sessionTimeout = 30 * 60 * 1000; // 30 minutes

  for (const [userId, session] of activeSessions.entries()) {
    const timeSinceActivity = now.getTime() - session.lastActivity.getTime();
    if (timeSinceActivity > sessionTimeout) {
      activeSessions.delete(userId);
      console.log(`Cleaned up expired session for user: ${userId}`);
    }
  }
};

// Admin-only middleware
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin privileges required',
      code: 'ADMIN_REQUIRED',
    });
  }
  next();
};

// Rate limiting per user
const userRateLimit = new Map<string, { count: number; resetTime: number }>();

export const rateLimitPerUser = (
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return next(); // Let authentication middleware handle this
    }

    const now = Date.now();
    const userLimit = userRateLimit.get(user.uid);

    if (!userLimit || now > userLimit.resetTime) {
      userRateLimit.set(user.uid, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (userLimit.count >= maxRequests) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((userLimit.resetTime - now) / 1000),
      });
    }

    userLimit.count++;
    next();
  };
};

// Security logging middleware
export const securityLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const user = req.user;

    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userId: user?.uid,
      userRole: user?.role,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      sessionId: user?.sessionId,
    };

    // Log security events
    if (
      res.statusCode === 401 ||
      res.statusCode === 403 ||
      res.statusCode === 429
    ) {
      console.warn('Security event:', logEntry);
    } else {
      console.log('API access:', logEntry);
    }
  });

  next();
};

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string;
        role: string;
        permissions: string[];
        sessionId: string;
      };
    }
  }
}
