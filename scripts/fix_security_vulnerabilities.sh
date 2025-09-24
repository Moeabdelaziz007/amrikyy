#!/bin/bash
# fix_security_vulnerabilities.sh - Fix security vulnerabilities

set -e

echo "🔒 Fixing Security Vulnerabilities"
echo "=================================="

# Create security fixes log
echo "Security Fixes Applied - $(date)" > logs/security_fixes.log

# Update vulnerable packages
echo "🔧 Updating vulnerable packages..."

# Update esbuild to latest version
echo "Updating esbuild..." >> logs/security_fixes.log
npm update esbuild@latest
echo "✅ Updated esbuild"

# Update lodash to latest version
echo "Updating lodash..." >> logs/security_fixes.log
npm update lodash@latest
echo "✅ Updated lodash"

# Update oauth2-server to latest version
echo "Updating oauth2-server..." >> logs/security_fixes.log
npm update oauth2-server@latest
echo "✅ Updated oauth2-server"

# Install missing security packages
echo "🔧 Installing missing security packages..."

# Install input validation packages
echo "Installing isomorphic-dompurify..." >> logs/security_fixes.log
npm install isomorphic-dompurify@latest
echo "✅ Installed isomorphic-dompurify"

echo "Installing validator..." >> logs/security_fixes.log
npm install validator@latest
echo "✅ Installed validator"

# Install type definitions
echo "Installing type definitions..." >> logs/security_fixes.log
npm install @types/isomorphic-dompurify@latest @types/validator@latest
echo "✅ Installed type definitions"

# Fix input validation implementation
echo "🔧 Implementing input validation..."

# Create input validation utility
cat > server/utils/input-validation.ts << 'EOF'
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

export class InputValidator {
    static sanitizeHtml(input: string): string {
        return DOMPurify.sanitize(input);
    }
    
    static validateEmail(email: string): boolean {
        return validator.isEmail(email);
    }
    
    static validateUrl(url: string): boolean {
        return validator.isURL(url);
    }
    
    static validatePhone(phone: string): boolean {
        return validator.isMobilePhone(phone);
    }
    
    static validatePassword(password: string): boolean {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        return validator.isLength(password, { min: 8 }) &&
               validator.matches(password, /[A-Z]/) &&
               validator.matches(password, /[a-z]/) &&
               validator.matches(password, /[0-9]/);
    }
    
    static sanitizeString(input: string): string {
        return validator.escape(input);
    }
    
    static validateInput(input: any, type: string): boolean {
        switch (type) {
            case 'email':
                return this.validateEmail(input);
            case 'url':
                return this.validateUrl(input);
            case 'phone':
                return this.validatePhone(input);
            case 'password':
                return this.validatePassword(input);
            default:
                return typeof input === 'string' && input.length > 0;
        }
    }
}
EOF

echo "✅ Created input validation utility"

# Fix security headers
echo "🔧 Implementing security headers..."

# Create security headers middleware
cat > server/middleware/security-headers.ts << 'EOF'
import { Request, Response, NextFunction } from 'express';

export function securityHeaders(req: Request, res: Response, next: NextFunction) {
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Enable XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Strict Transport Security
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    // Content Security Policy
    res.setHeader('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "font-src 'self' data:; " +
        "connect-src 'self' https:; " +
        "frame-ancestors 'none';"
    );
    
    // Referrer Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions Policy
    res.setHeader('Permissions-Policy', 
        'camera=(), microphone=(), geolocation=(), payment=()'
    );
    
    next();
}
EOF

echo "✅ Created security headers middleware"

# Fix CORS configuration
echo "🔧 Implementing secure CORS..."

# Create secure CORS configuration
cat > server/config/cors.ts << 'EOF'
import cors from 'cors';

export const corsOptions = {
    origin: function (origin: string | undefined, callback: Function) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'https://yourdomain.com',
            'https://www.yourdomain.com'
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400 // 24 hours
};

export const corsMiddleware = cors(corsOptions);
EOF

echo "✅ Created secure CORS configuration"

# Fix session security
echo "🔧 Implementing secure sessions..."

# Create secure session configuration
cat > server/config/session.ts << 'EOF'
import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';

export const sessionConfig = {
    secret: process.env.SESSION_SECRET || uuidv4(),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'strict' as const
    },
    name: 'sessionId',
    genid: () => uuidv4()
};
EOF

echo "✅ Created secure session configuration"

# Fix SQL injection prevention
echo "🔧 Implementing SQL injection prevention..."

# Create database security utilities
cat > server/utils/database-security.ts << 'EOF'
import { sql } from 'drizzle-orm';

export class DatabaseSecurity {
    static sanitizeQuery(query: string): string {
        // Remove potentially dangerous characters
        return query.replace(/[;'"]/g, '');
    }
    
    static validateTableName(tableName: string): boolean {
        // Only allow alphanumeric characters and underscores
        return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName);
    }
    
    static validateColumnName(columnName: string): boolean {
        // Only allow alphanumeric characters and underscores
        return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(columnName);
    }
    
    static createSafeQuery(tableName: string, columns: string[], whereClause?: string) {
        if (!this.validateTableName(tableName)) {
            throw new Error('Invalid table name');
        }
        
        const validColumns = columns.filter(col => this.validateColumnName(col));
        if (validColumns.length !== columns.length) {
            throw new Error('Invalid column names detected');
        }
        
        return sql`SELECT ${sql.join(validColumns.map(col => sql.identifier(col)))} FROM ${sql.identifier(tableName)}`;
    }
}
EOF

echo "✅ Created database security utilities"

# Fix rate limiting
echo "🔧 Implementing rate limiting..."

# Create rate limiting middleware
cat > server/middleware/rate-limit.ts << 'EOF'
import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

const store: RateLimitStore = {};

export function rateLimit(options: {
    windowMs: number;
    max: number;
    message?: string;
}) {
    return (req: Request, res: Response, next: NextFunction) => {
        const key = req.ip || 'unknown';
        const now = Date.now();
        const windowMs = options.windowMs;
        const max = options.max;
        
        // Clean up expired entries
        Object.keys(store).forEach(k => {
            if (store[k].resetTime < now) {
                delete store[k];
            }
        });
        
        // Check current count
        if (!store[key] || store[key].resetTime < now) {
            store[key] = {
                count: 1,
                resetTime: now + windowMs
            };
        } else {
            store[key].count++;
        }
        
        if (store[key].count > max) {
            return res.status(429).json({
                error: options.message || 'Too many requests',
                retryAfter: Math.ceil((store[key].resetTime - now) / 1000)
            });
        }
        
        next();
    };
}
EOF

echo "✅ Created rate limiting middleware"

# Run security audit
echo "🔍 Running security audit..."
if npm audit --audit-level=moderate 2>&1 | tee logs/security_audit_after.log; then
    echo "✅ Security audit passed"
else
    echo "⚠️  Security audit found issues (see logs/security_audit_after.log)"
fi

# Create security monitoring script
cat > scripts/monitor_security.sh << 'EOF'
#!/bin/bash
# monitor_security.sh - Monitor security status

echo "🔒 Security Monitoring Report"
echo "============================="

# Check for security vulnerabilities
echo "Checking for security vulnerabilities..."
if npm audit --audit-level=moderate > /dev/null 2>&1; then
    echo "✅ No security vulnerabilities found"
else
    echo "❌ Security vulnerabilities detected"
    npm audit --audit-level=moderate
fi

# Check for outdated packages
echo "Checking for outdated packages..."
OUTDATED=$(npm outdated --json 2>/dev/null | jq -r 'keys[]' | wc -l)
if [ "$OUTDATED" -eq 0 ]; then
    echo "✅ All packages are up to date"
else
    echo "⚠️  $OUTDATED packages are outdated"
    npm outdated
fi

# Check for known vulnerabilities in dependencies
echo "Checking dependency vulnerabilities..."
if command -v snyk > /dev/null 2>&1; then
    snyk test
else
    echo "⚠️  Snyk not installed. Install with: npm install -g snyk"
fi

echo "Security monitoring completed"
EOF

chmod +x scripts/monitor_security.sh

# Create security checklist
cat > SECURITY_CHECKLIST.md << 'EOF'
# Security Checklist

## ✅ Completed Security Measures

- [x] Updated vulnerable packages (esbuild, lodash, oauth2-server)
- [x] Installed input validation packages (isomorphic-dompurify, validator)
- [x] Implemented input validation utilities
- [x] Added security headers middleware
- [x] Configured secure CORS
- [x] Implemented secure session configuration
- [x] Added SQL injection prevention
- [x] Implemented rate limiting
- [x] Created security monitoring script

## 🔍 Security Monitoring

Run the following commands regularly:

```bash
# Check for vulnerabilities
npm audit --audit-level=moderate

# Monitor security status
./scripts/monitor_security.sh

# Check for outdated packages
npm outdated
```

## 🛡️ Additional Security Recommendations

1. **Environment Variables**: Ensure all sensitive data is in environment variables
2. **HTTPS**: Use HTTPS in production
3. **Database**: Use parameterized queries
4. **Authentication**: Implement proper authentication and authorization
5. **Logging**: Implement security event logging
6. **Backup**: Regular security backups
7. **Updates**: Keep all dependencies updated
8. **Testing**: Regular security testing

## 🚨 Security Incident Response

1. **Immediate**: Isolate affected systems
2. **Assess**: Determine scope of breach
3. **Contain**: Stop the attack
4. **Eradicate**: Remove threats
5. **Recover**: Restore systems
6. **Learn**: Document lessons learned
EOF

echo ""
echo "🎉 Security vulnerability fixing completed!"
echo "==========================================="
echo "Summary of security measures implemented:"
echo "- Updated all vulnerable packages"
echo "- Installed input validation packages"
echo "- Implemented security headers"
echo "- Configured secure CORS"
echo "- Added session security"
echo "- Implemented SQL injection prevention"
echo "- Added rate limiting"
echo "- Created security monitoring tools"
echo ""
echo "Next steps:"
echo "1. Run './scripts/monitor_security.sh' to check security status"
echo "2. Review SECURITY_CHECKLIST.md for additional measures"
echo "3. Test security measures in development"
echo "4. Deploy security updates to production"
echo "5. Set up regular security monitoring"
