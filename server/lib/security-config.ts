// =============================================================================
// 🔐 AuraOS Security Configuration & Validation
// =============================================================================
//
// Comprehensive security configuration for AuraOS
// Includes environment validation, security headers, and best practices
//
// =============================================================================

import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

// =============================================================================
// 🔒 Security Configuration Types
// =============================================================================

interface SecurityConfig {
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  encryption: {
    algorithm: string;
    key: string;
    ivLength: number;
  };
  cors: {
    origin: string[];
    credentials: boolean;
    methods: string[];
    allowedHeaders: string[];
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests: boolean;
  };
  headers: {
    contentSecurityPolicy: string;
    hsts: boolean;
    xssProtection: boolean;
    noSniff: boolean;
    frameOptions: string;
  };
}

// =============================================================================
// 🌍 Environment Security Validation
// =============================================================================

class SecurityValidator {
  private static instance: SecurityValidator;
  private config: SecurityConfig | null = null;

  private constructor() {
    this.validateEnvironment();
    this.createSecurityConfig();
  }

  public static getInstance(): SecurityValidator {
    if (!SecurityValidator.instance) {
      SecurityValidator.instance = new SecurityValidator();
    }
    return SecurityValidator.instance;
  }

  private validateEnvironment(): void {
    const requiredVars = [
      'JWT_SECRET',
      'JWT_REFRESH_SECRET',
      'ENCRYPTION_KEY',
      'API_ENCRYPTION_KEY',
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required security environment variables: ${missingVars.join(', ')}\n` +
          'Please check your .env file and ensure all security configuration variables are set.'
      );
    }

    // Validate JWT secret strength
    const jwtSecret = process.env.JWT_SECRET!;
    if (jwtSecret.length < 32) {
      throw new Error(
        'JWT_SECRET must be at least 32 characters long for security.\n' +
          'Current length: ' +
          jwtSecret.length
      );
    }

    // Validate encryption key strength
    const encryptionKey = process.env.ENCRYPTION_KEY!;
    if (encryptionKey.length !== 32) {
      throw new Error(
        'ENCRYPTION_KEY must be exactly 32 characters long.\n' +
          'Current length: ' +
          encryptionKey.length
      );
    }

    console.log('✅ Security environment validation passed');
  }

  private createSecurityConfig(): void {
    this.config = {
      jwt: {
        secret: process.env.JWT_SECRET!,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        refreshSecret: process.env.JWT_REFRESH_SECRET!,
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
      },
      encryption: {
        algorithm: 'aes-256-gcm',
        key: process.env.ENCRYPTION_KEY!,
        ivLength: 16,
      },
      cors: {
        origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
        credentials: process.env.CORS_CREDENTIALS === 'true',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
          'Origin',
          'X-Requested-With',
          'Content-Type',
          'Accept',
          'Authorization',
          'X-API-Key',
          'X-Client-Version',
        ],
      },
      rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
        skipSuccessfulRequests: false,
      },
      headers: {
        contentSecurityPolicy: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https:",
          "font-src 'self' data:",
          "connect-src 'self' https: wss:",
          "frame-src 'none'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          'upgrade-insecure-requests',
        ].join('; '),
        hsts: process.env.NODE_ENV === 'production',
        xssProtection: true,
        noSniff: true,
        frameOptions: 'DENY',
      },
    };

    console.log('🔐 Security configuration created successfully');
  }

  public getConfig(): SecurityConfig {
    if (!this.config) {
      throw new Error('Security configuration not initialized');
    }
    return this.config;
  }

  // =============================================================================
  // 🔐 Encryption Utilities
  // =============================================================================

  public encrypt(text: string): { encrypted: string; iv: string; tag: string } {
    const { algorithm, key, ivLength } = this.config!.encryption;
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipher(algorithm, key);
    cipher.setAAD(Buffer.from('auraos-auth', 'utf8'));

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
    };
  }

  public decrypt(encryptedData: {
    encrypted: string;
    iv: string;
    tag: string;
  }): string {
    const { algorithm, key } = this.config!.encryption;
    const decipher = crypto.createDecipher(algorithm, key);
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
    decipher.setAAD(Buffer.from('auraos-auth', 'utf8'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  // =============================================================================
  // 🛡️ Security Headers Middleware
  // =============================================================================

  public securityHeadersMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const { headers } = this.config!;

      // Content Security Policy
      res.setHeader('Content-Security-Policy', headers.contentSecurityPolicy);

      // HTTP Strict Transport Security (HSTS)
      if (headers.hsts) {
        res.setHeader(
          'Strict-Transport-Security',
          'max-age=31536000; includeSubDomains; preload'
        );
      }

      // X-Content-Type-Options
      if (headers.noSniff) {
        res.setHeader('X-Content-Type-Options', 'nosniff');
      }

      // X-Frame-Options
      res.setHeader('X-Frame-Options', headers.frameOptions);

      // X-XSS-Protection
      if (headers.xssProtection) {
        res.setHeader('X-XSS-Protection', '1; mode=block');
      }

      // Referrer Policy
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

      // Permissions Policy
      res.setHeader(
        'Permissions-Policy',
        [
          'camera=()',
          'microphone=()',
          'geolocation=()',
          'payment=()',
          'usb=()',
          'magnetometer=()',
          'gyroscope=()',
          'accelerometer=()',
        ].join(', ')
      );

      // Remove X-Powered-By header
      res.removeHeader('X-Powered-By');

      next();
    };
  }

  // =============================================================================
  // 🔍 Security Audit
  // =============================================================================

  public async securityAudit(): Promise<{
    status: 'secure' | 'warning' | 'critical';
    issues: Array<{
      level: 'low' | 'medium' | 'high' | 'critical';
      message: string;
      recommendation: string;
    }>;
    score: number;
  }> {
    const issues: Array<{
      level: 'low' | 'medium' | 'high' | 'critical';
      message: string;
      recommendation: string;
    }> = [];

    let score = 100;

    // Check JWT secret strength
    const jwtSecret = process.env.JWT_SECRET!;
    if (jwtSecret.length < 64) {
      issues.push({
        level: jwtSecret.length < 32 ? 'critical' : 'high',
        message: `JWT secret is only ${jwtSecret.length} characters long`,
        recommendation:
          'Use a JWT secret of at least 64 characters for production',
      });
      score -= jwtSecret.length < 32 ? 30 : 15;
    }

    // Check encryption key
    const encryptionKey = process.env.ENCRYPTION_KEY!;
    if (encryptionKey.length !== 32) {
      issues.push({
        level: 'critical',
        message: `Encryption key is ${encryptionKey.length} characters, should be 32`,
        recommendation: 'Use exactly 32 characters for AES-256 encryption key',
      });
      score -= 25;
    }

    // Check HTTPS in production
    if (process.env.NODE_ENV === 'production' && !process.env.FORCE_HTTPS) {
      issues.push({
        level: 'high',
        message: 'HTTPS not enforced in production',
        recommendation: 'Set FORCE_HTTPS=true in production environment',
      });
      score -= 20;
    }

    // Check CORS configuration
    const corsOrigin = process.env.CORS_ORIGIN;
    if (corsOrigin?.includes('*')) {
      issues.push({
        level: 'critical',
        message: 'CORS origin includes wildcard (*)',
        recommendation:
          'Use specific origins instead of wildcards for security',
      });
      score -= 25;
    }

    // Determine overall status
    let status: 'secure' | 'warning' | 'critical';
    if (score >= 90) status = 'secure';
    else if (score >= 70) status = 'warning';
    else status = 'critical';

    return { status, issues, score };
  }
}

// =============================================================================
// 🚀 Export Singleton Instance
// =============================================================================

const securityValidator = SecurityValidator.getInstance();

// Export the main instance and utilities
export { securityValidator, SecurityValidator };

// Export types
export type { SecurityConfig };

// =============================================================================
// 📋 Usage Examples
// =============================================================================

/*
// Basic usage:
import { securityValidator } from '@/lib/security';

// Get security configuration:
const config = securityValidator.getConfig();

// Add security headers middleware:
app.use(securityValidator.securityHeadersMiddleware());

// Encrypt sensitive data:
const encrypted = securityValidator.encrypt('sensitive data');

// Decrypt data:
const decrypted = securityValidator.decrypt(encrypted);

// Run security audit:
const audit = await securityValidator.securityAudit();
console.log('Security score:', audit.score);
*/

export default securityValidator;
