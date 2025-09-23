"""
Alerting configuration for AuraOS monitoring
"""

import os
import json
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass
from enum import Enum

import requests
from loguru import logger

class AlertSeverity(Enum):
    """Alert severity levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class AlertStatus(Enum):
    """Alert status"""
    ACTIVE = "active"
    RESOLVED = "resolved"
    SUPPRESSED = "suppressed"

@dataclass
class Alert:
    """Alert data structure"""
    id: str
    title: str
    description: str
    severity: AlertSeverity
    status: AlertStatus
    service: str
    metric: str
    threshold: float
    current_value: float
    created_at: datetime
    resolved_at: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None

class AlertManager:
    """Alert management system"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.alerts: Dict[str, Alert] = {}
        self.alert_rules = self._load_alert_rules()
        self.notification_channels = self._load_notification_channels()
    
    def _load_alert_rules(self) -> List[Dict[str, Any]]:
        """Load alert rules from configuration"""
        return self.config.get("alert_rules", [])
    
    def _load_notification_channels(self) -> List[Dict[str, Any]]:
        """Load notification channels from configuration"""
        return self.config.get("notification_channels", [])
    
    def check_metrics(self, metrics: Dict[str, float]) -> List[Alert]:
        """Check metrics against alert rules"""
        new_alerts = []
        
        for rule in self.alert_rules:
            metric_name = rule["metric"]
            threshold = rule["threshold"]
            operator = rule["operator"]
            
            if metric_name in metrics:
                current_value = metrics[metric_name]
                should_alert = False
                
                if operator == "gt" and current_value > threshold:
                    should_alert = True
                elif operator == "lt" and current_value < threshold:
                    should_alert = True
                elif operator == "eq" and current_value == threshold:
                    should_alert = True
                elif operator == "gte" and current_value >= threshold:
                    should_alert = True
                elif operator == "lte" and current_value <= threshold:
                    should_alert = True
                
                if should_alert:
                    alert = self._create_alert(rule, current_value)
                    if alert.id not in self.alerts:
                        new_alerts.append(alert)
                        self.alerts[alert.id] = alert
        
        return new_alerts
    
    def _create_alert(self, rule: Dict[str, Any], current_value: float) -> Alert:
        """Create new alert from rule"""
        alert_id = f"{rule['service']}_{rule['metric']}_{rule['severity']}"
        
        return Alert(
            id=alert_id,
            title=rule["title"],
            description=rule["description"],
            severity=AlertSeverity(rule["severity"]),
            status=AlertStatus.ACTIVE,
            service=rule["service"],
            metric=rule["metric"],
            threshold=rule["threshold"],
            current_value=current_value,
            created_at=datetime.utcnow(),
            metadata=rule.get("metadata", {})
        )
    
    def resolve_alert(self, alert_id: str):
        """Resolve an alert"""
        if alert_id in self.alerts:
            alert = self.alerts[alert_id]
            alert.status = AlertStatus.RESOLVED
            alert.resolved_at = datetime.utcnow()
            logger.info(f"Alert resolved: {alert_id}")
    
    def send_notifications(self, alerts: List[Alert]):
        """Send notifications for new alerts"""
        for alert in alerts:
            for channel in self.notification_channels:
                try:
                    self._send_notification(alert, channel)
                except Exception as e:
                    logger.error(f"Failed to send notification via {channel['type']}: {e}")
    
    def _send_notification(self, alert: Alert, channel: Dict[str, Any]):
        """Send notification via specific channel"""
        channel_type = channel["type"]
        
        if channel_type == "webhook":
            self._send_webhook_notification(alert, channel)
        elif channel_type == "email":
            self._send_email_notification(alert, channel)
        elif channel_type == "slack":
            self._send_slack_notification(alert, channel)
        elif channel_type == "telegram":
            self._send_telegram_notification(alert, channel)
    
    def _send_webhook_notification(self, alert: Alert, channel: Dict[str, Any]):
        """Send webhook notification"""
        url = channel["url"]
        payload = {
            "alert_id": alert.id,
            "title": alert.title,
            "description": alert.description,
            "severity": alert.severity.value,
            "service": alert.service,
            "metric": alert.metric,
            "threshold": alert.threshold,
            "current_value": alert.current_value,
            "created_at": alert.created_at.isoformat(),
            "metadata": alert.metadata
        }
        
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        logger.info(f"Webhook notification sent for alert {alert.id}")
    
    def _send_email_notification(self, alert: Alert, channel: Dict[str, Any]):
        """Send email notification"""
        # Implementation would depend on email service (SMTP, SendGrid, etc.)
        logger.info(f"Email notification sent for alert {alert.id}")
    
    def _send_slack_notification(self, alert: Alert, channel: Dict[str, Any]):
        """Send Slack notification"""
        webhook_url = channel["webhook_url"]
        
        # Color based on severity
        color_map = {
            AlertSeverity.LOW: "good",
            AlertSeverity.MEDIUM: "warning",
            AlertSeverity.HIGH: "danger",
            AlertSeverity.CRITICAL: "danger"
        }
        
        payload = {
            "attachments": [
                {
                    "color": color_map.get(alert.severity, "warning"),
                    "title": alert.title,
                    "text": alert.description,
                    "fields": [
                        {
                            "title": "Service",
                            "value": alert.service,
                            "short": True
                        },
                        {
                            "title": "Metric",
                            "value": alert.metric,
                            "short": True
                        },
                        {
                            "title": "Current Value",
                            "value": str(alert.current_value),
                            "short": True
                        },
                        {
                            "title": "Threshold",
                            "value": str(alert.threshold),
                            "short": True
                        },
                        {
                            "title": "Severity",
                            "value": alert.severity.value.upper(),
                            "short": True
                        }
                    ],
                    "timestamp": int(alert.created_at.timestamp())
                }
            ]
        }
        
        response = requests.post(webhook_url, json=payload, timeout=10)
        response.raise_for_status()
        logger.info(f"Slack notification sent for alert {alert.id}")
    
    def _send_telegram_notification(self, alert: Alert, channel: Dict[str, Any]):
        """Send Telegram notification"""
        bot_token = channel["bot_token"]
        chat_id = channel["chat_id"]
        
        message = f"""
🚨 *{alert.title}*

*Service:* {alert.service}
*Metric:* {alert.metric}
*Current Value:* {alert.current_value}
*Threshold:* {alert.threshold}
*Severity:* {alert.severity.value.upper()}

{alert.description}

*Time:* {alert.created_at.strftime('%Y-%m-%d %H:%M:%S UTC')}
        """
        
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {
            "chat_id": chat_id,
            "text": message,
            "parse_mode": "Markdown"
        }
        
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        logger.info(f"Telegram notification sent for alert {alert.id}")
    
    def get_active_alerts(self) -> List[Alert]:
        """Get all active alerts"""
        return [alert for alert in self.alerts.values() if alert.status == AlertStatus.ACTIVE]
    
    def get_alerts_by_service(self, service: str) -> List[Alert]:
        """Get alerts for specific service"""
        return [alert for alert in self.alerts.values() if alert.service == service]
    
    def get_alerts_by_severity(self, severity: AlertSeverity) -> List[Alert]:
        """Get alerts by severity level"""
        return [alert for alert in self.alerts.values() if alert.severity == severity]

# Default alert rules configuration
DEFAULT_ALERT_RULES = [
    {
        "title": "High CPU Usage",
        "description": "CPU usage is above 80%",
        "service": "system",
        "metric": "cpu_usage_percent",
        "threshold": 80.0,
        "operator": "gt",
        "severity": "high"
    },
    {
        "title": "High Memory Usage",
        "description": "Memory usage is above 85%",
        "service": "system",
        "metric": "memory_usage_percent",
        "threshold": 85.0,
        "operator": "gt",
        "severity": "high"
    },
    {
        "title": "High Disk Usage",
        "description": "Disk usage is above 90%",
        "service": "system",
        "metric": "disk_usage_percent",
        "threshold": 90.0,
        "operator": "gt",
        "severity": "critical"
    },
    {
        "title": "High Error Rate",
        "description": "Error rate is above 5%",
        "service": "application",
        "metric": "error_rate_percent",
        "threshold": 5.0,
        "operator": "gt",
        "severity": "high"
    },
    {
        "title": "High Response Time",
        "description": "Average response time is above 2 seconds",
        "service": "application",
        "metric": "response_time_seconds",
        "threshold": 2.0,
        "operator": "gt",
        "severity": "medium"
    },
    {
        "title": "Service Down",
        "description": "Service is not responding",
        "service": "application",
        "metric": "service_status",
        "threshold": 0,
        "operator": "eq",
        "severity": "critical"
    }
]

# Default notification channels configuration
DEFAULT_NOTIFICATION_CHANNELS = [
    {
        "type": "webhook",
        "name": "Default Webhook",
        "url": os.getenv("ALERT_WEBHOOK_URL", "http://localhost:8080/alerts"),
        "enabled": True
    }
]

def create_alert_manager(config: Optional[Dict[str, Any]] = None) -> AlertManager:
    """Create alert manager with default configuration"""
    if config is None:
        config = {
            "alert_rules": DEFAULT_ALERT_RULES,
            "notification_channels": DEFAULT_NOTIFICATION_CHANNELS
        }
    
    return AlertManager(config)

# Global alert manager instance
_global_alert_manager: Optional[AlertManager] = None

def get_alert_manager() -> AlertManager:
    """Get global alert manager instance"""
    global _global_alert_manager
    if _global_alert_manager is None:
        _global_alert_manager = create_alert_manager()
    return _global_alert_manager
