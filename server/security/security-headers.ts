import { Request, Response, NextFunction } from 'express';

// Security headers configuration
interface SecurityHeadersConfig {
  contentSecurityPolicy: string;
  xFrameOptions: 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM';
  xContentTypeOptions: 'nosniff';
  strictTransportSecurity: string;
  xXSSProtection: string;
  referrerPolicy:
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'same-origin'
    | 'strict-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url';
  permissionsPolicy: string;
  crossOriginEmbedderPolicy: 'unsafe-none' | 'require-corp';
  crossOriginOpenerPolicy:
    | 'unsafe-none'
    | 'same-origin-allow-popups'
    | 'same-origin';
  crossOriginResourcePolicy: 'same-site' | 'same-origin' | 'cross-origin';
}

// Default security headers configuration
const defaultSecurityHeaders: SecurityHeadersConfig = {
  contentSecurityPolicy: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://www.google.com https://apis.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "media-src 'self' data: https: blob:",
    "connect-src 'self' https://api.openai.com https://generativelanguage.googleapis.com https://*.firebaseapp.com https://*.googleapis.com wss://*.firebaseapp.com",
    "frame-src 'self' https://*.google.com https://*.firebaseapp.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; '),

  xFrameOptions: 'DENY',
  xContentTypeOptions: 'nosniff',
  strictTransportSecurity: 'max-age=31536000; includeSubDomains; preload',
  xXSSProtection: '1; mode=block',
  referrerPolicy: 'strict-origin-when-cross-origin',
  permissionsPolicy: [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'accelerometer=()',
    'gyroscope=()',
  ].join(', '),
  crossOriginEmbedderPolicy: 'require-corp',
  crossOriginOpenerPolicy: 'same-origin',
  crossOriginResourcePolicy: 'same-origin',
};

// Security headers middleware
export const securityHeaders = (
  config: Partial<SecurityHeadersConfig> = {}
) => {
  const headers = { ...defaultSecurityHeaders, ...config };

  return (req: Request, res: Response, next: NextFunction) => {
    // Content Security Policy
    res.setHeader('Content-Security-Policy', headers.contentSecurityPolicy);

    // Prevent clickjacking
    res.setHeader('X-Frame-Options', headers.xFrameOptions);

    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', headers.xContentTypeOptions);

    // HTTPS enforcement (only in production)
    if (process.env.NODE_ENV === 'production') {
      res.setHeader(
        'Strict-Transport-Security',
        headers.strictTransportSecurity
      );
    }

    // XSS protection
    res.setHeader('X-XSS-Protection', headers.xXSSProtection);

    // Referrer policy
    res.setHeader('Referrer-Policy', headers.referrerPolicy);

    // Permissions policy
    res.setHeader('Permissions-Policy', headers.permissionsPolicy);

    // Cross-Origin policies
    res.setHeader(
      'Cross-Origin-Embedder-Policy',
      headers.crossOriginEmbedderPolicy
    );
    res.setHeader(
      'Cross-Origin-Opener-Policy',
      headers.crossOriginOpenerPolicy
    );
    res.setHeader(
      'Cross-Origin-Resource-Policy',
      headers.crossOriginResourcePolicy
    );

    // Additional security headers
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    res.setHeader('X-Download-Options', 'noopen');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');

    // Remove server information
    res.removeHeader('X-Powered-By');
    res.removeHeader('Server');

    next();
  };
};

// CORS configuration for security
export const secureCORS = (allowedOrigins: string[] = []) => {
  const defaultOrigins = [
    'https://aios-97581.web.app',
    'https://aios-97581.firebaseapp.com',
    'http://localhost:3000',
    'http://localhost:5173',
  ];

  const origins = [...defaultOrigins, ...allowedOrigins];

  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;

    // Check if origin is allowed
    if (origin && origins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (process.env.NODE_ENV === 'development') {
      // Allow all origins in development
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }

    // CORS headers
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS, PATCH'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With, X-Session-Token'
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    next();
  };
};

// HTTPS redirection middleware
export const forceHTTPS = (req: Request, res: Response, next: NextFunction) => {
  // Only enforce HTTPS in production
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  // Check if request is secure
  const isSecure =
    req.secure ||
    req.headers['x-forwarded-proto'] === 'https' ||
    req.connection.encrypted;

  if (!isSecure) {
    const httpsUrl = `https://${req.get('host')}${req.url}`;
    return res.redirect(301, httpsUrl);
  }

  next();
};

// Security monitoring middleware
export const securityMonitoring = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  // Log suspicious patterns
  const suspiciousPatterns = [
    /\.\.\//, // Path traversal
    /<script/i, // XSS attempts
    /union.*select/i, // SQL injection
    /eval\(/i, // Code injection
    /javascript:/i, // JavaScript injection
    /on\w+\s*=/i, // Event handler injection
  ];

  const userAgent = req.get('User-Agent') || '';
  const url = req.url;
  const body = JSON.stringify(req.body || {});

  // Check for suspicious patterns
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url) || pattern.test(body) || pattern.test(userAgent)) {
      console.warn('Suspicious request detected:', {
        ip: req.ip,
        userAgent,
        url,
        timestamp: new Date().toISOString(),
        pattern: pattern.toString(),
      });

      // Block suspicious requests
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Request contains suspicious content',
        code: 'SUSPICIOUS_REQUEST',
      });
    }
  }

  // Monitor response
  res.on('finish', () => {
    const duration = Date.now() - startTime;

    // Log security events
    if (
      res.statusCode === 401 ||
      res.statusCode === 403 ||
      res.statusCode === 429
    ) {
      console.warn('Security event:', {
        ip: req.ip,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        userAgent,
        duration,
        timestamp: new Date().toISOString(),
      });
    }
  });

  next();
};

// Request size limiting
export const requestSizeLimit = (maxSize: number = 10 * 1024 * 1024) => {
  // 10MB default
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.get('Content-Length') || '0');

    if (contentLength > maxSize) {
      return res.status(413).json({
        error: 'Payload Too Large',
        message: `Request body size exceeds maximum allowed size of ${maxSize} bytes`,
        code: 'PAYLOAD_TOO_LARGE',
      });
    }

    next();
  };
};

// IP whitelist/blacklist middleware
export const ipFilter = (options: {
  whitelist?: string[];
  blacklist?: string[];
  blockSuspiciousIPs?: boolean;
}) => {
  const { whitelist = [], blacklist = [], blockSuspiciousIPs = true } = options;

  // Common suspicious IP patterns (example - in production, use a proper IP reputation service)
  const suspiciousIPPatterns = [
    /^10\./, // Private networks (adjust as needed)
    /^192\.168\./, // Private networks
    /^127\./, // Localhost
  ];

  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

    // Check blacklist
    if (blacklist.includes(clientIP)) {
      console.warn('Blocked request from blacklisted IP:', clientIP);
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied from this IP address',
        code: 'IP_BLOCKED',
      });
    }

    // Check whitelist (if provided)
    if (whitelist.length > 0 && !whitelist.includes(clientIP)) {
      console.warn('Blocked request from non-whitelisted IP:', clientIP);
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied from this IP address',
        code: 'IP_NOT_WHITELISTED',
      });
    }

    // Check suspicious IPs
    if (blockSuspiciousIPs) {
      for (const pattern of suspiciousIPPatterns) {
        if (pattern.test(clientIP)) {
          console.warn('Blocked request from suspicious IP:', clientIP);
          return res.status(403).json({
            error: 'Forbidden',
            message: 'Access denied from this IP address',
            code: 'SUSPICIOUS_IP',
          });
        }
      }
    }

    next();
  };
};

// Helmet.js alternative for comprehensive security headers
export const comprehensiveSecurity = () => {
  return [
    securityHeaders(),
    secureCORS(),
    forceHTTPS(),
    securityMonitoring(),
    requestSizeLimit(),
  ];
};

// Export all security middleware
export const securityMiddleware = {
  securityHeaders,
  secureCORS,
  forceHTTPS,
  securityMonitoring,
  requestSizeLimit,
  ipFilter,
  comprehensiveSecurity,
};
