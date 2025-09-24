// Metrics Collector Service - خدمة جمع المقاييس والمراقبة
import { Logger } from '../utils/logger.js';

interface RequestMetric {
  method: string;
  url: string;
  statusCode: number;
  duration: number;
  userAgent?: string;
  ip?: string;
  timestamp: Date;
}

interface SystemMetric {
  cpu: {
    usage: number;
    loadAverage: number[];
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  uptime: number;
  timestamp: Date;
}

interface CustomMetric {
  name: string;
  value: number;
  labels?: Record<string, string>;
  timestamp: Date;
}

export class MetricsCollector {
  private logger: Logger;
  private requestMetrics: RequestMetric[] = [];
  private systemMetrics: SystemMetric[] = [];
  private customMetrics: Map<string, CustomMetric[]> = new Map();
  private counters: Map<string, number> = new Map();
  private gauges: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();
  private maxMetricsHistory: number = 1000;

  constructor() {
    this.logger = new Logger();
    this.startSystemMetricsCollection();
  }

  // Request metrics
  recordRequest(metric: RequestMetric): void {
    this.requestMetrics.push(metric);
    
    // Keep only recent metrics
    if (this.requestMetrics.length > this.maxMetricsHistory) {
      this.requestMetrics = this.requestMetrics.slice(-this.maxMetricsHistory);
    }

    // Update counters
    this.incrementCounter(`requests_total`, {
      method: metric.method,
      status: metric.statusCode.toString(),
    });

    // Update histogram for response times
    this.recordHistogram('request_duration_ms', metric.duration);
  }

  getRequestMetrics(): RequestMetric[] {
    return [...this.requestMetrics];
  }

  getRequestStats(): {
    totalRequests: number;
    averageResponseTime: number;
    requestsPerMinute: number;
    statusCodeDistribution: Record<string, number>;
    topEndpoints: Array<{ endpoint: string; count: number }>;
  } {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    const recentRequests = this.requestMetrics.filter(
      metric => metric.timestamp.getTime() > oneMinuteAgo
    );

    const totalRequests = this.requestMetrics.length;
    const averageResponseTime = totalRequests > 0 
      ? this.requestMetrics.reduce((sum, metric) => sum + metric.duration, 0) / totalRequests
      : 0;
    
    const requestsPerMinute = recentRequests.length;

    const statusCodeDistribution: Record<string, number> = {};
    this.requestMetrics.forEach(metric => {
      const status = metric.statusCode.toString();
      statusCodeDistribution[status] = (statusCodeDistribution[status] || 0) + 1;
    });

    const endpointCounts: Record<string, number> = {};
    this.requestMetrics.forEach(metric => {
      endpointCounts[metric.url] = (endpointCounts[metric.url] || 0) + 1;
    });

    const topEndpoints = Object.entries(endpointCounts)
      .map(([endpoint, count]) => ({ endpoint, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalRequests,
      averageResponseTime,
      requestsPerMinute,
      statusCodeDistribution,
      topEndpoints,
    };
  }

  // System metrics
  private startSystemMetricsCollection(): void {
    setInterval(() => {
      this.collectSystemMetrics();
    }, 30000); // Every 30 seconds
  }

  private collectSystemMetrics(): void {
    try {
      const cpuUsage = process.cpuUsage();
      const memoryUsage = process.memoryUsage();
      const uptime = process.uptime();

      const systemMetric: SystemMetric = {
        cpu: {
          usage: (cpuUsage.user + cpuUsage.system) / 1000000, // Convert to seconds
          loadAverage: require('os').loadavg(),
        },
        memory: {
          used: memoryUsage.heapUsed,
          total: memoryUsage.heapTotal,
          percentage: (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100,
        },
        uptime,
        timestamp: new Date(),
      };

      this.systemMetrics.push(systemMetric);

      // Keep only recent metrics
      if (this.systemMetrics.length > this.maxMetricsHistory) {
        this.systemMetrics = this.systemMetrics.slice(-this.maxMetricsHistory);
      }

    } catch (error) {
      this.logger.error('Failed to collect system metrics', { error });
    }
  }

  getSystemMetrics(): SystemMetric[] {
    return [...this.systemMetrics];
  }

  getCurrentSystemMetrics(): SystemMetric | null {
    return this.systemMetrics.length > 0 
      ? this.systemMetrics[this.systemMetrics.length - 1]
      : null;
  }

  // Custom metrics
  recordCustomMetric(name: string, value: number, labels?: Record<string, string>): void {
    const metric: CustomMetric = {
      name,
      value,
      labels,
      timestamp: new Date(),
    };

    if (!this.customMetrics.has(name)) {
      this.customMetrics.set(name, []);
    }

    const metrics = this.customMetrics.get(name)!;
    metrics.push(metric);

    // Keep only recent metrics
    if (metrics.length > this.maxMetricsHistory) {
      metrics.splice(0, metrics.length - this.maxMetricsHistory);
    }
  }

  getCustomMetrics(name: string): CustomMetric[] {
    return this.customMetrics.get(name) || [];
  }

  getAllCustomMetrics(): Map<string, CustomMetric[]> {
    return new Map(this.customMetrics);
  }

  // Counters
  incrementCounter(name: string, labels?: Record<string, string>): void {
    const key = this.getMetricKey(name, labels);
    const currentValue = this.counters.get(key) || 0;
    this.counters.set(key, currentValue + 1);
  }

  decrementCounter(name: string, labels?: Record<string, string>): void {
    const key = this.getMetricKey(name, labels);
    const currentValue = this.counters.get(key) || 0;
    this.counters.set(key, Math.max(0, currentValue - 1));
  }

  getCounter(name: string, labels?: Record<string, string>): number {
    const key = this.getMetricKey(name, labels);
    return this.counters.get(key) || 0;
  }

  getAllCounters(): Map<string, number> {
    return new Map(this.counters);
  }

  // Gauges
  setGauge(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.getMetricKey(name, labels);
    this.gauges.set(key, value);
  }

  getGauge(name: string, labels?: Record<string, string>): number {
    const key = this.getMetricKey(name, labels);
    return this.gauges.get(key) || 0;
  }

  getAllGauges(): Map<string, number> {
    return new Map(this.gauges);
  }

  // Histograms
  recordHistogram(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.getMetricKey(name, labels);
    
    if (!this.histograms.has(key)) {
      this.histograms.set(key, []);
    }

    const values = this.histograms.get(key)!;
    values.push(value);

    // Keep only recent values
    if (values.length > this.maxMetricsHistory) {
      values.splice(0, values.length - this.maxMetricsHistory);
    }
  }

  getHistogram(name: string, labels?: Record<string, string>): {
    count: number;
    sum: number;
    average: number;
    min: number;
    max: number;
    percentiles: { p50: number; p90: number; p95: number; p99: number };
  } {
    const key = this.getMetricKey(name, labels);
    const values = this.histograms.get(key) || [];

    if (values.length === 0) {
      return {
        count: 0,
        sum: 0,
        average: 0,
        min: 0,
        max: 0,
        percentiles: { p50: 0, p90: 0, p95: 0, p99: 0 },
      };
    }

    const sortedValues = [...values].sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = sum / values.length;
    const min = sortedValues[0];
    const max = sortedValues[sortedValues.length - 1];

    const percentiles = {
      p50: this.calculatePercentile(sortedValues, 50),
      p90: this.calculatePercentile(sortedValues, 90),
      p95: this.calculatePercentile(sortedValues, 95),
      p99: this.calculatePercentile(sortedValues, 99),
    };

    return {
      count: values.length,
      sum,
      average,
      min,
      max,
      percentiles,
    };
  }

  getAllHistograms(): Map<string, number[]> {
    return new Map(this.histograms);
  }

  // Utility methods
  private getMetricKey(name: string, labels?: Record<string, string>): string {
    if (!labels) return name;
    
    const labelString = Object.entries(labels)
      .map(([key, value]) => `${key}="${value}"`)
      .join(',');
    
    return `${name}{${labelString}}`;
  }

  private calculatePercentile(sortedValues: number[], percentile: number): number {
    const index = Math.ceil((percentile / 100) * sortedValues.length) - 1;
    return sortedValues[Math.max(0, index)];
  }

  // Health metrics
  getHealthMetrics(): {
    isHealthy: boolean;
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
    requestRate: number;
    errorRate: number;
  } {
    const currentSystem = this.getCurrentSystemMetrics();
    const requestStats = this.getRequestStats();
    
    const totalRequests = this.requestMetrics.length;
    const errorRequests = this.requestMetrics.filter(
      metric => metric.statusCode >= 400
    ).length;
    
    const errorRate = totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0;
    
    const isHealthy = errorRate < 10 && 
                     (currentSystem?.memory.percentage || 0) < 90 &&
                     (currentSystem?.cpu.usage || 0) < 80;

    return {
      isHealthy,
      uptime: currentSystem?.uptime || 0,
      memoryUsage: currentSystem?.memory.percentage || 0,
      cpuUsage: currentSystem?.cpu.usage || 0,
      requestRate: requestStats.requestsPerMinute,
      errorRate,
    };
  }

  // Export metrics in Prometheus format
  exportPrometheusMetrics(): string {
    const lines: string[] = [];
    
    // Counters
    for (const [key, value] of this.counters) {
      lines.push(`# TYPE ${key} counter`);
      lines.push(`${key} ${value}`);
    }
    
    // Gauges
    for (const [key, value] of this.gauges) {
      lines.push(`# TYPE ${key} gauge`);
      lines.push(`${key} ${value}`);
    }
    
    // Histograms
    for (const [key, values] of this.histograms) {
      const histogram = this.getHistogram(key);
      lines.push(`# TYPE ${key} histogram`);
      lines.push(`${key}_count ${histogram.count}`);
      lines.push(`${key}_sum ${histogram.sum}`);
      lines.push(`${key}_bucket{le="0.5"} ${this.calculatePercentile(values.sort((a, b) => a - b), 50)}`);
      lines.push(`${key}_bucket{le="0.9"} ${this.calculatePercentile(values.sort((a, b) => a - b), 90)}`);
      lines.push(`${key}_bucket{le="0.95"} ${this.calculatePercentile(values.sort((a, b) => a - b), 95)}`);
      lines.push(`${key}_bucket{le="0.99"} ${this.calculatePercentile(values.sort((a, b) => a - b), 99)}`);
      lines.push(`${key}_bucket{le="+Inf"} ${histogram.count}`);
    }
    
    return lines.join('\n');
  }

  // Clear all metrics
  clearMetrics(): void {
    this.requestMetrics = [];
    this.systemMetrics = [];
    this.customMetrics.clear();
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
    
    this.logger.info('All metrics cleared');
  }
}
