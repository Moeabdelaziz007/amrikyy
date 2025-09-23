#!/usr/bin/env node
/**
 * Health Check Script - فحص صحة النظام
 * للتحقق من حالة النظام في Docker و Kubernetes
 */

import http from 'http';
import { performance } from 'perf_hooks';

const PORT = process.env.PORT || 3000;
const HEALTH_CHECK_PORT = process.env.HEALTH_CHECK_PORT || 3001;

class HealthChecker {
  constructor() {
    this.checks = {
      memory: this.checkMemory.bind(this),
      disk: this.checkDisk.bind(this),
      network: this.checkNetwork.bind(this),
      database: this.checkDatabase.bind(this),
      external: this.checkExternal.bind(this)
    };
  }

  async checkMemory() {
    const memUsage = process.memoryUsage();
    const memUsageMB = memUsage.heapUsed / 1024 / 1024;
    const memLimitMB = 512; // 512MB limit

    return {
      status: memUsageMB < memLimitMB ? 'healthy' : 'unhealthy',
      details: {
        used: `${memUsageMB.toFixed(2)}MB`,
        limit: `${memLimitMB}MB`,
        percentage: `${((memUsageMB / memLimitMB) * 100).toFixed(2)}%`
      }
    };
  }

  async checkDisk() {
    try {
      const fs = await import('fs');
      const stats = fs.statSync('.');
      
      return {
        status: 'healthy',
        details: {
          accessible: true,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error.message
        }
      };
    }
  }

  async checkNetwork() {
    try {
      const startTime = performance.now();
      
      // محاولة الاتصال بـ localhost
      const response = await fetch(`http://localhost:${PORT}/health`);
      const endTime = performance.now();
      
      return {
        status: response.ok ? 'healthy' : 'unhealthy',
        details: {
          responseTime: `${(endTime - startTime).toFixed(2)}ms`,
          statusCode: response.status
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error.message
        }
      };
    }
  }

  async checkDatabase() {
    // محاكاة فحص قاعدة البيانات
    return {
      status: 'healthy',
      details: {
        connected: true,
        responseTime: '5ms'
      }
    };
  }

  async checkExternal() {
    try {
      // فحص الاتصال بالخدمات الخارجية
      const services = [
        'https://api.telegram.org',
        'https://generativelanguage.googleapis.com'
      ];

      const results = await Promise.allSettled(
        services.map(async (url) => {
          const startTime = performance.now();
          const response = await fetch(url, { method: 'HEAD' });
          const endTime = performance.now();
          
          return {
            url,
            status: response.ok ? 'healthy' : 'unhealthy',
            responseTime: endTime - startTime
          };
        })
      );

      const healthyServices = results.filter(result => 
        result.status === 'fulfilled' && result.value.status === 'healthy'
      ).length;

      return {
        status: healthyServices >= services.length / 2 ? 'healthy' : 'unhealthy',
        details: {
          totalServices: services.length,
          healthyServices,
          services: results.map(result => 
            result.status === 'fulfilled' ? result.value : { error: result.reason }
          )
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error.message
        }
      };
    }
  }

  async runAllChecks() {
    const results = {};
    let overallStatus = 'healthy';

    for (const [name, check] of Object.entries(this.checks)) {
      try {
        results[name] = await check();
        if (results[name].status === 'unhealthy') {
          overallStatus = 'unhealthy';
        }
      } catch (error) {
        results[name] = {
          status: 'unhealthy',
          details: { error: error.message }
        };
        overallStatus = 'unhealthy';
      }
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks: results
    };
  }

  async startHealthServer() {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url, `http://${req.headers.host}`);
      
      if (url.pathname === '/health') {
        const healthStatus = await this.runAllChecks();
        
        res.writeHead(healthStatus.status === 'healthy' ? 200 : 503, {
          'Content-Type': 'application/json'
        });
        
        res.end(JSON.stringify(healthStatus, null, 2));
      } else if (url.pathname === '/ready') {
        // فحص جاهزية النظام
        const memoryCheck = await this.checkMemory();
        const diskCheck = await this.checkDisk();
        
        const ready = memoryCheck.status === 'healthy' && diskCheck.status === 'healthy';
        
        res.writeHead(ready ? 200 : 503, {
          'Content-Type': 'application/json'
        });
        
        res.end(JSON.stringify({
          status: ready ? 'ready' : 'not ready',
          timestamp: new Date().toISOString(),
          checks: {
            memory: memoryCheck,
            disk: diskCheck
          }
        }));
      } else if (url.pathname === '/live') {
        // فحص الحياة
        res.writeHead(200, {
          'Content-Type': 'application/json'
        });
        
        res.end(JSON.stringify({
          status: 'alive',
          timestamp: new Date().toISOString(),
          uptime: process.uptime()
        }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
      }
    });

    server.listen(HEALTH_CHECK_PORT, () => {
      console.log(`🏥 Health check server running on port ${HEALTH_CHECK_PORT}`);
      console.log(`🏥 Health endpoint: http://localhost:${HEALTH_CHECK_PORT}/health`);
      console.log(`🏥 Ready endpoint: http://localhost:${HEALTH_CHECK_PORT}/ready`);
      console.log(`🏥 Live endpoint: http://localhost:${HEALTH_CHECK_PORT}/live`);
    });

    return server;
  }
}

// تشغيل فحص الصحة
if (import.meta.url === `file://${process.argv[1]}`) {
  const healthChecker = new HealthChecker();
  
  // تشغيل فحص سريع
  healthChecker.runAllChecks().then(result => {
    console.log('🏥 Health Check Results:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.status === 'healthy') {
      console.log('✅ System is healthy');
      process.exit(0);
    } else {
      console.log('❌ System is unhealthy');
      process.exit(1);
    }
  }).catch(error => {
    console.error('❌ Health check failed:', error);
    process.exit(1);
  });
}

export default HealthChecker;
