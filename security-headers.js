// AuraOS Security Headers - تعزيز الأمان
const helmet = require('helmet');

// إعدادات أمان شاملة
const securityConfig = {
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'", 
        "'unsafe-inline'", 
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com"
      ],
      scriptSrc: [
        "'self'", 
        "'unsafe-inline'", 
        "https://www.gstatic.com",
        "https://apis.google.com"
      ],
      imgSrc: [
        "'self'", 
        "data:", 
        "https:",
        "blob:",
        "https://ui-avatars.com"
      ],
      connectSrc: [
        "'self'", 
        "https://api.openai.com",
        "https://generativelanguage.googleapis.com",
        "wss://localhost:3001"
      ],
      fontSrc: [
        "'self'", 
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com"
      ],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      workerSrc: ["'self'"],
      childSrc: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: [],
      blockAllMixedContent: []
    }
  },
  
  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  
  // X-Frame-Options
  frameguard: {
    action: 'deny'
  },
  
  // X-Content-Type-Options
  noSniff: true,
  
  // Referrer Policy
  referrerPolicy: {
    policy: ['strict-origin-when-cross-origin']
  },
  
  // Permissions Policy
  permissionsPolicy: {
    features: {
      camera: [],
      microphone: [],
      geolocation: [],
      payment: [],
      usb: [],
      accelerometer: [],
      gyroscope: [],
      magnetometer: []
    }
  },
  
  // Cross-Origin Embedder Policy
  crossOriginEmbedderPolicy: false,
  
  // Cross-Origin Opener Policy
  crossOriginOpenerPolicy: {
    policy: 'same-origin'
  },
  
  // Cross-Origin Resource Policy
  crossOriginResourcePolicy: {
    policy: 'cross-origin'
  }
};

// دالة تطبيق الأمان
function applySecurityHeaders(app) {
  console.log('🔒 تطبيق إعدادات الأمان...');
  
  // تطبيق Helmet مع الإعدادات المخصصة
  app.use(helmet(securityConfig));
  
  // إعدادات إضافية للأمان
  app.use((req, res, next) => {
    // إضافة رؤوس أمان إضافية
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    res.setHeader('X-Download-Options', 'noopen');
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    
    // منع تسريب معلومات الخادم
    res.removeHeader('X-Powered-By');
    
    next();
  });
  
  console.log('✅ تم تطبيق إعدادات الأمان بنجاح');
}

// دالة التحقق من الأمان
function validateSecurity(req, res, next) {
  // التحقق من User-Agent
  const userAgent = req.get('User-Agent');
  if (!userAgent || userAgent.length > 500) {
    return res.status(400).json({ error: 'User-Agent غير صالح' });
  }
  
  // التحقق من حجم الطلب
  const contentLength = req.get('Content-Length');
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB
    return res.status(413).json({ error: 'حجم الطلب كبير جداً' });
  }
  
  // التحقق من نوع المحتوى
  if (req.method === 'POST' || req.method === 'PUT') {
    const contentType = req.get('Content-Type');
    const allowedTypes = [
      'application/json',
      'application/x-www-form-urlencoded',
      'multipart/form-data'
    ];
    
    if (contentType && !allowedTypes.some(type => contentType.includes(type))) {
      return res.status(415).json({ error: 'نوع المحتوى غير مدعوم' });
    }
  }
  
  next();
}

// دالة تسجيل محاولات الأمان
function logSecurityEvents(req, res, next) {
  const originalSend = res.send;
  
  res.send = function(data) {
    // تسجيل محاولات غير عادية
    if (res.statusCode >= 400) {
      console.warn(`⚠️ محاولة غير عادية: ${req.method} ${req.url} - ${res.statusCode}`);
    }
    
    return originalSend.call(this, data);
  };
  
  next();
}

module.exports = {
  applySecurityHeaders,
  validateSecurity,
  logSecurityEvents,
  securityConfig
};
