import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

// Input validation schemas
export const validationSchemas = {
  // User validation
  user: z.object({
    email: z.string().email('Invalid email format').max(254),
    password: z.string().min(8, 'Password must be at least 8 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
        'Password must contain uppercase, lowercase, number and special character'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(50),
    role: z.enum(['admin', 'user', 'moderator']).optional()
  }),

  // Post validation
  post: z.object({
    title: z.string().min(1, 'Title is required').max(200),
    content: z.string().min(1, 'Content is required').max(5000),
    tags: z.array(z.string().max(30)).max(10),
    visibility: z.enum(['public', 'private', 'friends']).default('public')
  }),

  // API request validation
  apiRequest: z.object({
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
    endpoint: z.string().min(1).max(500),
    data: z.record(z.any()).optional()
  }),

  // Search validation
  search: z.object({
    query: z.string().min(1, 'Search query is required').max(100),
    limit: z.number().int().min(1).max(100).default(10),
    offset: z.number().int().min(0).default(0)
  }),

  // File upload validation
  fileUpload: z.object({
    filename: z.string().min(1).max(255),
    mimetype: z.string().regex(/^image\/(jpeg|jpg|png|gif|webp)$/, 'Invalid file type'),
    size: z.number().int().max(10 * 1024 * 1024, 'File size too large') // 10MB
  })
};

// Sanitization options
interface SanitizationOptions {
  htmlEscape: boolean;
  sqlInjection: boolean;
  xssProtection: boolean;
  pathTraversal: boolean;
  maxLength?: number;
}

const defaultSanitizationOptions: SanitizationOptions = {
  htmlEscape: true,
  sqlInjection: true,
  xssProtection: true,
  pathTraversal: true,
  maxLength: 1000
};

// Input validation middleware factory
export const validateInput = (schema: ZodSchema, options: SanitizationOptions = defaultSanitizationOptions) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      const validationResult = schema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        return res.status(400).json({
          error: 'Validation failed',
          message: 'Invalid input data',
          details: errors,
          code: 'VALIDATION_ERROR'
        });
      }

      // Sanitize validated data
      const sanitizedData = sanitizeObject(validationResult.data, options);
      req.body = sanitizedData;

      next();
    } catch (error) {
      console.error('Validation error:', error);
      return res.status(500).json({
        error: 'Validation error',
        message: 'Failed to validate input data',
        code: 'VALIDATION_SYSTEM_ERROR'
      });
    }
  };
};

// Query parameter validation
export const validateQuery = (schema: ZodSchema, options: SanitizationOptions = defaultSanitizationOptions) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationResult = schema.safeParse(req.query);
      
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        return res.status(400).json({
          error: 'Query validation failed',
          message: 'Invalid query parameters',
          details: errors,
          code: 'QUERY_VALIDATION_ERROR'
        });
      }

      // Sanitize query parameters
      const sanitizedQuery = sanitizeObject(validationResult.data, options);
      req.query = sanitizedQuery;

      next();
    } catch (error) {
      console.error('Query validation error:', error);
      return res.status(500).json({
        error: 'Query validation error',
        message: 'Failed to validate query parameters',
        code: 'QUERY_VALIDATION_SYSTEM_ERROR'
      });
    }
  };
};

// Sanitize input object recursively
function sanitizeObject(obj: any, options: SanitizationOptions): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, options));
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value, options);
    }
    return sanitized;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj, options);
  }

  return obj;
}

// Sanitize string input
function sanitizeString(input: string, options: SanitizationOptions): string {
  let sanitized = input;

  // Apply length limit
  if (options.maxLength && sanitized.length > options.maxLength) {
    sanitized = sanitized.substring(0, options.maxLength);
  }

  // HTML escape
  if (options.htmlEscape) {
    sanitized = DOMPurify.sanitize(sanitized, { ALLOWED_TAGS: [] });
  }

  // XSS protection
  if (options.xssProtection) {
    sanitized = sanitized
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  // SQL injection protection
  if (options.sqlInjection) {
    const sqlKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER', 'EXEC', 'UNION'];
    for (const keyword of sqlKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      sanitized = sanitized.replace(regex, '');
    }
  }

  // Path traversal protection
  if (options.pathTraversal) {
    sanitized = sanitized
      .replace(/\.\./g, '')
      .replace(/\.\.\//g, '')
      .replace(/\.\.\\/g, '')
      .replace(/\.\.\\\\/g, '');
  }

  return sanitized.trim();
}

// Specific validation middleware for common use cases
export const validateEmail = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      error: 'Email required',
      message: 'Email address is required',
      code: 'EMAIL_REQUIRED'
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: 'Invalid email',
      message: 'Please provide a valid email address',
      code: 'INVALID_EMAIL'
    });
  }

  // Normalize email
  req.body.email = validator.normalizeEmail(email);
  next();
};

export const validatePassword = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({
      error: 'Password required',
      message: 'Password is required',
      code: 'PASSWORD_REQUIRED'
    });
  }

  // Password strength validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: 'Weak password',
      message: 'Password must be at least 8 characters long and contain uppercase, lowercase, number and special character',
      code: 'WEAK_PASSWORD'
    });
  }

  next();
};

export const validateUrl = (req: Request, res: Response, next: NextFunction) => {
  const { url } = req.body;
  
  if (!url) {
    return next(); // URL is optional
  }

  if (!validator.isURL(url, { protocols: ['http', 'https'], require_protocol: true })) {
    return res.status(400).json({
      error: 'Invalid URL',
      message: 'Please provide a valid URL starting with http:// or https://',
      code: 'INVALID_URL'
    });
  }

  next();
};

// File upload validation
export const validateFileUpload = (allowedTypes: string[], maxSize: number = 10 * 1024 * 1024) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return res.status(400).json({
        error: 'File required',
        message: 'Please upload a file',
        code: 'FILE_REQUIRED'
      });
    }

    const { mimetype, size, originalname } = req.file;

    // Check file type
    if (!allowedTypes.includes(mimetype)) {
      return res.status(400).json({
        error: 'Invalid file type',
        message: `File type ${mimetype} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
        code: 'INVALID_FILE_TYPE'
      });
    }

    // Check file size
    if (size > maxSize) {
      return res.status(400).json({
        error: 'File too large',
        message: `File size ${size} bytes exceeds maximum allowed size ${maxSize} bytes`,
        code: 'FILE_TOO_LARGE'
      });
    }

    // Sanitize filename
    req.file.originalname = sanitizeFilename(originalname);

    next();
  };
};

// Sanitize filename
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .substring(0, 255);
}

// Rate limiting middleware
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up expired entries
    for (const [ip, data] of rateLimitStore.entries()) {
      if (data.resetTime < now) {
        rateLimitStore.delete(ip);
      }
    }

    const current = rateLimitStore.get(key);

    if (!current) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (current.count >= maxRequests) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((current.resetTime - now) / 1000)
      });
    }

    current.count++;
    next();
  };
};

// Content Security Policy validation
export const validateCSP = (req: Request, res: Response, next: NextFunction) => {
  const cspHeader = req.get('Content-Security-Policy');
  
  if (!cspHeader) {
    return res.status(400).json({
      error: 'Missing CSP header',
      message: 'Content Security Policy header is required',
      code: 'MISSING_CSP'
    });
  }

  next();
};

// Input size validation
export const validateInputSize = (maxSize: number = 1024 * 1024) => { // 1MB default
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.get('Content-Length') || '0');
    
    if (contentLength > maxSize) {
      return res.status(413).json({
        error: 'Payload Too Large',
        message: `Request body size ${contentLength} bytes exceeds maximum allowed size ${maxSize} bytes`,
        code: 'PAYLOAD_TOO_LARGE'
      });
    }

    next();
  };
};

// Export validation utilities
export const validationUtils = {
  sanitizeString,
  sanitizeObject,
  sanitizeFilename,
  validateEmail: validator.isEmail,
  validateUrl: validator.isURL,
  validatePassword: (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }
};
