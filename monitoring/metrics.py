"""
Prometheus metrics configuration for AuraOS
"""

from prometheus_client import Counter, Histogram, Gauge, Info, CollectorRegistry
from typing import Dict, Any, Optional
import time
from functools import wraps

# Create custom registry
registry = CollectorRegistry()

# Application metrics
APP_INFO = Info('auraos_app_info', 'Application information', registry=registry)
APP_VERSION = Gauge('auraos_version', 'Application version', registry=registry)
APP_START_TIME = Gauge('auraos_start_time_seconds', 'Application start time', registry=registry)

# HTTP metrics
HTTP_REQUESTS_TOTAL = Counter(
    'auraos_http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status_code'],
    registry=registry
)

HTTP_REQUEST_DURATION = Histogram(
    'auraos_http_request_duration_seconds',
    'HTTP request duration',
    ['method', 'endpoint'],
    registry=registry
)

HTTP_REQUEST_SIZE = Histogram(
    'auraos_http_request_size_bytes',
    'HTTP request size in bytes',
    ['method', 'endpoint'],
    registry=registry
)

HTTP_RESPONSE_SIZE = Histogram(
    'auraos_http_response_size_bytes',
    'HTTP response size in bytes',
    ['method', 'endpoint'],
    registry=registry
)

# Database metrics
DB_CONNECTIONS_ACTIVE = Gauge(
    'auraos_db_connections_active',
    'Active database connections',
    ['database'],
    registry=registry
)

DB_CONNECTIONS_IDLE = Gauge(
    'auraos_db_connections_idle',
    'Idle database connections',
    ['database'],
    registry=registry
)

DB_QUERIES_TOTAL = Counter(
    'auraos_db_queries_total',
    'Total database queries',
    ['database', 'operation'],
    registry=registry
)

DB_QUERY_DURATION = Histogram(
    'auraos_db_query_duration_seconds',
    'Database query duration',
    ['database', 'operation'],
    registry=registry
)

# Redis metrics
REDIS_CONNECTIONS_ACTIVE = Gauge(
    'auraos_redis_connections_active',
    'Active Redis connections',
    registry=registry
)

REDIS_OPERATIONS_TOTAL = Counter(
    'auraos_redis_operations_total',
    'Total Redis operations',
    ['operation'],
    registry=registry
)

REDIS_OPERATION_DURATION = Histogram(
    'auraos_redis_operation_duration_seconds',
    'Redis operation duration',
    ['operation'],
    registry=registry
)

# AI/ML metrics
AI_REQUESTS_TOTAL = Counter(
    'auraos_ai_requests_total',
    'Total AI requests',
    ['model', 'operation'],
    registry=registry
)

AI_REQUEST_DURATION = Histogram(
    'auraos_ai_request_duration_seconds',
    'AI request duration',
    ['model', 'operation'],
    registry=registry
)

AI_TOKENS_USED = Counter(
    'auraos_ai_tokens_used_total',
    'Total AI tokens used',
    ['model', 'operation'],
    registry=registry
)

# File operations metrics
FILE_OPERATIONS_TOTAL = Counter(
    'auraos_file_operations_total',
    'Total file operations',
    ['operation', 'status'],
    registry=registry
)

FILE_OPERATION_DURATION = Histogram(
    'auraos_file_operation_duration_seconds',
    'File operation duration',
    ['operation'],
    registry=registry
)

FILE_SIZE_BYTES = Histogram(
    'auraos_file_size_bytes',
    'File size in bytes',
    ['file_type'],
    registry=registry
)

# User metrics
USERS_TOTAL = Gauge(
    'auraos_users_total',
    'Total number of users',
    registry=registry
)

USER_SESSIONS_ACTIVE = Gauge(
    'auraos_user_sessions_active',
    'Active user sessions',
    registry=registry
)

USER_ACTIVITY_TOTAL = Counter(
    'auraos_user_activity_total',
    'Total user activities',
    ['activity_type'],
    registry=registry
)

# System metrics
SYSTEM_CPU_USAGE = Gauge(
    'auraos_system_cpu_usage_percent',
    'System CPU usage percentage',
    registry=registry
)

SYSTEM_MEMORY_USAGE = Gauge(
    'auraos_system_memory_usage_bytes',
    'System memory usage in bytes',
    registry=registry
)

SYSTEM_DISK_USAGE = Gauge(
    'auraos_system_disk_usage_bytes',
    'System disk usage in bytes',
    ['mount_point'],
    registry=registry
)

# Error metrics
ERRORS_TOTAL = Counter(
    'auraos_errors_total',
    'Total errors',
    ['error_type', 'service'],
    registry=registry
)

# Performance metrics
PERFORMANCE_OPERATIONS_TOTAL = Counter(
    'auraos_performance_operations_total',
    'Total performance operations',
    ['operation'],
    registry=registry
)

PERFORMANCE_OPERATION_DURATION = Histogram(
    'auraos_performance_operation_duration_seconds',
    'Performance operation duration',
    ['operation'],
    registry=registry
)

class MetricsCollector:
    """Metrics collector for AuraOS services"""
    
    def __init__(self, service_name: str = "auraos"):
        self.service_name = service_name
        self.start_time = time.time()
        
        # Set application info
        APP_INFO.info({
            'service': service_name,
            'version': '1.0.0',
            'environment': 'development'
        })
        
        APP_START_TIME.set(self.start_time)
    
    def record_http_request(self, method: str, endpoint: str, 
                          status_code: int, duration: float,
                          request_size: Optional[int] = None,
                          response_size: Optional[int] = None):
        """Record HTTP request metrics"""
        HTTP_REQUESTS_TOTAL.labels(
            method=method,
            endpoint=endpoint,
            status_code=str(status_code)
        ).inc()
        
        HTTP_REQUEST_DURATION.labels(
            method=method,
            endpoint=endpoint
        ).observe(duration)
        
        if request_size is not None:
            HTTP_REQUEST_SIZE.labels(
                method=method,
                endpoint=endpoint
            ).observe(request_size)
        
        if response_size is not None:
            HTTP_RESPONSE_SIZE.labels(
                method=method,
                endpoint=endpoint
            ).observe(response_size)
    
    def record_db_operation(self, database: str, operation: str, duration: float):
        """Record database operation metrics"""
        DB_QUERIES_TOTAL.labels(
            database=database,
            operation=operation
        ).inc()
        
        DB_QUERY_DURATION.labels(
            database=database,
            operation=operation
        ).observe(duration)
    
    def record_redis_operation(self, operation: str, duration: float):
        """Record Redis operation metrics"""
        REDIS_OPERATIONS_TOTAL.labels(operation=operation).inc()
        REDIS_OPERATION_DURATION.labels(operation=operation).observe(duration)
    
    def record_ai_request(self, model: str, operation: str, duration: float, tokens: int):
        """Record AI request metrics"""
        AI_REQUESTS_TOTAL.labels(model=model, operation=operation).inc()
        AI_REQUEST_DURATION.labels(model=model, operation=operation).observe(duration)
        AI_TOKENS_USED.labels(model=model, operation=operation).inc(tokens)
    
    def record_file_operation(self, operation: str, duration: float, 
                            status: str = "success", file_size: Optional[int] = None,
                            file_type: Optional[str] = None):
        """Record file operation metrics"""
        FILE_OPERATIONS_TOTAL.labels(operation=operation, status=status).inc()
        FILE_OPERATION_DURATION.labels(operation=operation).observe(duration)
        
        if file_size is not None and file_type is not None:
            FILE_SIZE_BYTES.labels(file_type=file_type).observe(file_size)
    
    def record_user_activity(self, activity_type: str):
        """Record user activity metrics"""
        USER_ACTIVITY_TOTAL.labels(activity_type=activity_type).inc()
    
    def record_error(self, error_type: str):
        """Record error metrics"""
        ERRORS_TOTAL.labels(error_type=error_type, service=self.service_name).inc()
    
    def record_performance(self, operation: str, duration: float):
        """Record performance metrics"""
        PERFORMANCE_OPERATIONS_TOTAL.labels(operation=operation).inc()
        PERFORMANCE_OPERATION_DURATION.labels(operation=operation).observe(duration)

# Decorator for automatic metrics collection
def track_metrics(operation: str, metrics_type: str = "performance"):
    """Decorator to automatically track metrics for functions"""
    def decorator(func):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                duration = time.time() - start_time
                
                if metrics_type == "performance":
                    PERFORMANCE_OPERATIONS_TOTAL.labels(operation=operation).inc()
                    PERFORMANCE_OPERATION_DURATION.labels(operation=operation).observe(duration)
                
                return result
            except Exception as e:
                duration = time.time() - start_time
                ERRORS_TOTAL.labels(error_type=type(e).__name__, service="auraos").inc()
                raise
        
        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                duration = time.time() - start_time
                
                if metrics_type == "performance":
                    PERFORMANCE_OPERATIONS_TOTAL.labels(operation=operation).inc()
                    PERFORMANCE_OPERATION_DURATION.labels(operation=operation).observe(duration)
                
                return result
            except Exception as e:
                duration = time.time() - start_time
                ERRORS_TOTAL.labels(error_type=type(e).__name__, service="auraos").inc()
                raise
        
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper
    
    return decorator

# Global metrics collector instance
_global_collector: Optional[MetricsCollector] = None

def get_metrics_collector(service_name: str = "auraos") -> MetricsCollector:
    """Get global metrics collector instance"""
    global _global_collector
    if _global_collector is None:
        _global_collector = MetricsCollector(service_name)
    return _global_collector

def setup_metrics(service_name: str = "auraos") -> MetricsCollector:
    """Setup global metrics configuration"""
    global _global_collector
    _global_collector = MetricsCollector(service_name)
    return _global_collector
