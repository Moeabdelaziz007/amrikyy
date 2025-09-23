"""
Structured logging configuration for AuraOS
"""

import os
import sys
import json
from typing import Dict, Any, Optional
from datetime import datetime
from pathlib import Path

import structlog
from loguru import logger
from prometheus_client import Counter, Histogram, Gauge

# Prometheus metrics for logging
LOG_COUNTER = Counter('auraos_logs_total', 'Total log entries', ['level', 'service'])
LOG_DURATION = Histogram('auraos_log_duration_seconds', 'Log processing duration')
LOG_SIZE = Gauge('auraos_log_size_bytes', 'Log entry size in bytes')

class JSONFormatter:
    """Custom JSON formatter for structured logging"""
    
    def __init__(self, service_name: str = "auraos"):
        self.service_name = service_name
    
    def format(self, record: Dict[str, Any]) -> str:
        """Format log record as JSON"""
        log_entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.get("level", "INFO"),
            "service": self.service_name,
            "message": record.get("message", ""),
            "module": record.get("module", ""),
            "function": record.get("function", ""),
            "line": record.get("line", 0),
            "process_id": os.getpid(),
            "thread_id": record.get("thread", 0),
        }
        
        # Add extra fields
        if "extra" in record:
            log_entry.update(record["extra"])
        
        # Add exception info if present
        if "exception" in record:
            log_entry["exception"] = {
                "type": record["exception"]["type"],
                "value": record["exception"]["value"],
                "traceback": record["exception"]["traceback"]
            }
        
        # Update Prometheus metrics
        LOG_COUNTER.labels(level=log_entry["level"], service=self.service_name).inc()
        LOG_SIZE.set(len(json.dumps(log_entry)))
        
        return json.dumps(log_entry, ensure_ascii=False)

class StructuredLogger:
    """Structured logger for AuraOS services"""
    
    def __init__(self, service_name: str = "auraos", log_level: str = "INFO"):
        self.service_name = service_name
        self.log_level = log_level
        self.log_dir = Path("logs")
        self.log_dir.mkdir(exist_ok=True)
        
        # Configure structlog
        structlog.configure(
            processors=[
                structlog.stdlib.filter_by_level,
                structlog.stdlib.add_logger_name,
                structlog.stdlib.add_log_level,
                structlog.stdlib.PositionalArgumentsFormatter(),
                structlog.processors.TimeStamper(fmt="iso"),
                structlog.processors.StackInfoRenderer(),
                structlog.processors.format_exc_info,
                structlog.processors.UnicodeDecoder(),
                structlog.processors.JSONRenderer()
            ],
            context_class=dict,
            logger_factory=structlog.stdlib.LoggerFactory(),
            wrapper_class=structlog.stdlib.BoundLogger,
            cache_logger_on_first_use=True,
        )
        
        # Configure loguru
        self._setup_loguru()
    
    def _setup_loguru(self):
        """Setup loguru with structured logging"""
        # Remove default handler
        logger.remove()
        
        # Add console handler with JSON formatting
        logger.add(
            sys.stdout,
            format=self._format_log,
            level=self.log_level,
            colorize=True,
            serialize=False
        )
        
        # Add file handler for all logs
        logger.add(
            self.log_dir / "auraos.log",
            format=self._format_log,
            level=self.log_level,
            rotation="100 MB",
            retention="30 days",
            compression="gz",
            serialize=False
        )
        
        # Add error file handler
        logger.add(
            self.log_dir / "errors.log",
            format=self._format_log,
            level="ERROR",
            rotation="50 MB",
            retention="90 days",
            compression="gz",
            serialize=False
        )
        
        # Add access log handler
        logger.add(
            self.log_dir / "access.log",
            format=self._format_log,
            level="INFO",
            rotation="100 MB",
            retention="30 days",
            compression="gz",
            serialize=False,
            filter=lambda record: record["extra"].get("type") == "access"
        )
    
    def _format_log(self, record):
        """Format log record"""
        log_entry = {
            "timestamp": record["time"].isoformat(),
            "level": record["level"].name,
            "service": self.service_name,
            "message": record["message"],
            "module": record["name"],
            "function": record["function"],
            "line": record["line"],
            "process_id": record["process"].id,
            "thread_id": record["thread"].id,
        }
        
        # Add extra fields
        if "extra" in record:
            log_entry.update(record["extra"])
        
        # Add exception info if present
        if record["exception"]:
            log_entry["exception"] = {
                "type": record["exception"].type.__name__,
                "value": str(record["exception"].value),
                "traceback": record["exception"].traceback
            }
        
        return json.dumps(log_entry, ensure_ascii=False)
    
    def get_logger(self, name: Optional[str] = None):
        """Get structured logger instance"""
        if name:
            return structlog.get_logger(name)
        return structlog.get_logger()
    
    def log_request(self, method: str, path: str, status_code: int, 
                   duration: float, user_id: Optional[str] = None):
        """Log HTTP request"""
        logger.info(
            "HTTP request",
            type="access",
            method=method,
            path=path,
            status_code=status_code,
            duration=duration,
            user_id=user_id
        )
    
    def log_error(self, error: Exception, context: Optional[Dict[str, Any]] = None):
        """Log error with context"""
        logger.error(
            "Error occurred",
            error=str(error),
            error_type=type(error).__name__,
            context=context or {}
        )
    
    def log_performance(self, operation: str, duration: float, 
                       metadata: Optional[Dict[str, Any]] = None):
        """Log performance metrics"""
        logger.info(
            "Performance metric",
            type="performance",
            operation=operation,
            duration=duration,
            metadata=metadata or {}
        )
    
    def log_security(self, event: str, user_id: Optional[str] = None,
                    ip_address: Optional[str] = None, 
                    metadata: Optional[Dict[str, Any]] = None):
        """Log security events"""
        logger.warning(
            "Security event",
            type="security",
            event=event,
            user_id=user_id,
            ip_address=ip_address,
            metadata=metadata or {}
        )

# Global logger instance
_global_logger: Optional[StructuredLogger] = None

def get_logger(service_name: str = "auraos", log_level: str = "INFO") -> StructuredLogger:
    """Get global logger instance"""
    global _global_logger
    if _global_logger is None:
        _global_logger = StructuredLogger(service_name, log_level)
    return _global_logger

def setup_logging(service_name: str = "auraos", log_level: str = "INFO"):
    """Setup global logging configuration"""
    global _global_logger
    _global_logger = StructuredLogger(service_name, log_level)
    return _global_logger

# Convenience functions
def log_info(message: str, **kwargs):
    """Log info message"""
    logger.info(message, **kwargs)

def log_warning(message: str, **kwargs):
    """Log warning message"""
    logger.warning(message, **kwargs)

def log_error(message: str, **kwargs):
    """Log error message"""
    logger.error(message, **kwargs)

def log_debug(message: str, **kwargs):
    """Log debug message"""
    logger.debug(message, **kwargs)

def log_critical(message: str, **kwargs):
    """Log critical message"""
    logger.critical(message, **kwargs)
