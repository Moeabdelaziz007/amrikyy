#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Learning Metrics Emitter for AuraOS
Emits learning loop events and metrics to logs and DB for analytics
"""

import asyncio
import json
import time
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from collections import defaultdict, deque
from dataclasses import dataclass, asdict
from enum import Enum
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='{"timestamp":"%(asctime)s","level":"%(levelname)s","category":"learning_metrics","message":"%(message)s","data":%(data)s}'
)
logger = logging.getLogger(__name__)

class MetricType(Enum):
    """Types of learning metrics"""
    PATTERN_LEARNED = "pattern_learned"
    FEEDBACK_RECEIVED = "feedback_received"
    ACCURACY_UPDATE = "accuracy_update"
    CONFIDENCE_CHANGE = "confidence_change"
    CACHE_HIT = "cache_hit"
    CACHE_MISS = "cache_miss"
    RESPONSE_TIME = "response_time"
    ERROR_RATE = "error_rate"
    LEARNING_RATE = "learning_rate"
    ADAPTATION_SUCCESS = "adaptation_success"

@dataclass
class LearningMetric:
    """Learning metric data structure"""
    metric_type: MetricType
    pattern_id: str
    value: float
    timestamp: datetime
    context: Dict[str, Any]
    metadata: Dict[str, Any]

@dataclass
class LearningEvent:
    """Learning event data structure"""
    event_id: str
    event_type: str
    pattern_id: str
    timestamp: datetime
    data: Dict[str, Any]
    outcome: str
    confidence: float

class LearningMetricsEmitter:
    """Emits learning metrics and events for analytics"""
    
    def __init__(self, db_path: Optional[str] = None):
        self.metrics_buffer = deque(maxlen=10000)
        self.events_buffer = deque(maxlen=10000)
        self.db_path = db_path or "learning_metrics.db"
        
        # Aggregation windows
        self.hourly_metrics = defaultdict(lambda: defaultdict(list))
        self.daily_metrics = defaultdict(lambda: defaultdict(list))
        
        # Real-time metrics
        self.current_metrics = {
            "patterns_learned_today": 0,
            "feedback_count_today": 0,
            "avg_accuracy_today": 0.0,
            "avg_confidence_today": 0.0,
            "cache_hit_rate": 0.0,
            "avg_response_time_ms": 0.0,
            "error_rate": 0.0,
            "learning_velocity": 0.0
        }
        
        # Background tasks
        self.emit_task = None
        self.aggregate_task = None
        self.persist_task = None
        
        logger.info("Learning Metrics Emitter initialized", extra={"data": json.dumps({"db_path": self.db_path})})
    
    async def initialize(self):
        """Initialize the emitter and start background tasks"""
        # Start background tasks
        self.emit_task = asyncio.create_task(self._emit_metrics_loop())
        self.aggregate_task = asyncio.create_task(self._aggregate_metrics_loop())
        self.persist_task = asyncio.create_task(self._persist_metrics_loop())
        
        # Initialize database
        await self._init_database()
        
        logger.info("Learning Metrics Emitter started", extra={"data": json.dumps({"status": "running"})})
    
    async def emit_metric(self, metric_type: MetricType, pattern_id: str, value: float,
                          context: Dict[str, Any] = None, metadata: Dict[str, Any] = None):
        """Emit a learning metric"""
        metric = LearningMetric(
            metric_type=metric_type,
            pattern_id=pattern_id,
            value=value,
            timestamp=datetime.now(),
            context=context or {},
            metadata=metadata or {}
        )
        
        # Add to buffer
        self.metrics_buffer.append(metric)
        
        # Update real-time metrics
        await self._update_realtime_metrics(metric)
        
        # Log the metric
        logger.info(
            f"Learning metric: {metric_type.value}",
            extra={"data": json.dumps({
                "metric_type": metric_type.value,
                "pattern_id": pattern_id,
                "value": value,
                "context": context,
                "timestamp": metric.timestamp.isoformat()
            })}
        )
        
        return metric
    
    async def emit_event(self, event_type: str, pattern_id: str, data: Dict[str, Any],
                        outcome: str = "success", confidence: float = 1.0):
        """Emit a learning event"""
        event = LearningEvent(
            event_id=f"event_{int(time.time())}_{hash(pattern_id)}",
            event_type=event_type,
            pattern_id=pattern_id,
            timestamp=datetime.now(),
            data=data,
            outcome=outcome,
            confidence=confidence
        )
        
        # Add to buffer
        self.events_buffer.append(event)
        
        # Log the event
        logger.info(
            f"Learning event: {event_type}",
            extra={"data": json.dumps({
                "event_id": event.event_id,
                "event_type": event_type,
                "pattern_id": pattern_id,
                "outcome": outcome,
                "confidence": confidence,
                "timestamp": event.timestamp.isoformat()
            })}
        )
        
        # Emit corresponding metrics
        if event_type == "pattern_learned":
            await self.emit_metric(MetricType.PATTERN_LEARNED, pattern_id, 1.0, data)
            self.current_metrics["patterns_learned_today"] += 1
        elif event_type == "feedback_received":
            await self.emit_metric(MetricType.FEEDBACK_RECEIVED, pattern_id, data.get("score", 0.0), data)
            self.current_metrics["feedback_count_today"] += 1
        
        return event
    
    async def _update_realtime_metrics(self, metric: LearningMetric):
        """Update real-time metrics based on new metric"""
        if metric.metric_type == MetricType.ACCURACY_UPDATE:
            # Update rolling average
            current = self.current_metrics["avg_accuracy_today"]
            count = self.current_metrics.get("accuracy_count", 0)
            self.current_metrics["avg_accuracy_today"] = (current * count + metric.value) / (count + 1)
            self.current_metrics["accuracy_count"] = count + 1
            
        elif metric.metric_type == MetricType.CONFIDENCE_CHANGE:
            # Update rolling average
            current = self.current_metrics["avg_confidence_today"]
            count = self.current_metrics.get("confidence_count", 0)
            self.current_metrics["avg_confidence_today"] = (current * count + metric.value) / (count + 1)
            self.current_metrics["confidence_count"] = count + 1
            
        elif metric.metric_type == MetricType.CACHE_HIT:
            # Update cache hit rate
            hits = self.current_metrics.get("cache_hits", 0) + 1
            total = self.current_metrics.get("cache_total", 0) + 1
            self.current_metrics["cache_hits"] = hits
            self.current_metrics["cache_total"] = total
            self.current_metrics["cache_hit_rate"] = hits / total
            
        elif metric.metric_type == MetricType.CACHE_MISS:
            # Update cache hit rate
            total = self.current_metrics.get("cache_total", 0) + 1
            hits = self.current_metrics.get("cache_hits", 0)
            self.current_metrics["cache_total"] = total
            self.current_metrics["cache_hit_rate"] = hits / total if total > 0 else 0
            
        elif metric.metric_type == MetricType.RESPONSE_TIME:
            # Update average response time
            current = self.current_metrics["avg_response_time_ms"]
            count = self.current_metrics.get("response_count", 0)
            self.current_metrics["avg_response_time_ms"] = (current * count + metric.value) / (count + 1)
            self.current_metrics["response_count"] = count + 1
            
        elif metric.metric_type == MetricType.ERROR_RATE:
            self.current_metrics["error_rate"] = metric.value
            
        elif metric.metric_type == MetricType.LEARNING_RATE:
            self.current_metrics["learning_velocity"] = metric.value
    
    async def _emit_metrics_loop(self):
        """Background loop to emit metrics periodically"""
        while True:
            try:
                await asyncio.sleep(60)  # Emit every minute
                
                # Emit current metrics snapshot
                snapshot = {
                    "timestamp": datetime.now().isoformat(),
                    "metrics": self.current_metrics.copy(),
                    "buffer_size": len(self.metrics_buffer),
                    "events_buffer_size": len(self.events_buffer)
                }
                
                logger.info(
                    "Learning metrics snapshot",
                    extra={"data": json.dumps(snapshot)}
                )
                
            except Exception as e:
                logger.error(f"Error in metrics emission loop: {e}", extra={"data": json.dumps({"error": str(e)})})
    
    async def _aggregate_metrics_loop(self):
        """Background loop to aggregate metrics"""
        while True:
            try:
                await asyncio.sleep(3600)  # Aggregate every hour
                
                # Aggregate hourly metrics
                await self._aggregate_hourly_metrics()
                
                # Check if daily aggregation needed
                current_hour = datetime.now().hour
                if current_hour == 0:  # Midnight
                    await self._aggregate_daily_metrics()
                
            except Exception as e:
                logger.error(f"Error in aggregation loop: {e}", extra={"data": json.dumps({"error": str(e)})})
    
    async def _aggregate_hourly_metrics(self):
        """Aggregate metrics for the past hour"""
        cutoff_time = datetime.now() - timedelta(hours=1)
        hour_key = datetime.now().strftime("%Y-%m-%d-%H")
        
        hourly_stats = {
            "patterns_learned": 0,
            "feedback_count": 0,
            "avg_accuracy": [],
            "avg_confidence": [],
            "cache_hit_rate": [],
            "avg_response_time": [],
            "error_rates": []
        }
        
        # Process metrics buffer
        for metric in self.metrics_buffer:
            if metric.timestamp >= cutoff_time:
                if metric.metric_type == MetricType.PATTERN_LEARNED:
                    hourly_stats["patterns_learned"] += 1
                elif metric.metric_type == MetricType.FEEDBACK_RECEIVED:
                    hourly_stats["feedback_count"] += 1
                elif metric.metric_type == MetricType.ACCURACY_UPDATE:
                    hourly_stats["avg_accuracy"].append(metric.value)
                elif metric.metric_type == MetricType.CONFIDENCE_CHANGE:
                    hourly_stats["avg_confidence"].append(metric.value)
                elif metric.metric_type == MetricType.RESPONSE_TIME:
                    hourly_stats["avg_response_time"].append(metric.value)
                elif metric.metric_type == MetricType.ERROR_RATE:
                    hourly_stats["error_rates"].append(metric.value)
        
        # Calculate averages
        aggregated = {
            "hour": hour_key,
            "patterns_learned": hourly_stats["patterns_learned"],
            "feedback_count": hourly_stats["feedback_count"],
            "avg_accuracy": sum(hourly_stats["avg_accuracy"]) / len(hourly_stats["avg_accuracy"]) if hourly_stats["avg_accuracy"] else 0,
            "avg_confidence": sum(hourly_stats["avg_confidence"]) / len(hourly_stats["avg_confidence"]) if hourly_stats["avg_confidence"] else 0,
            "avg_response_time": sum(hourly_stats["avg_response_time"]) / len(hourly_stats["avg_response_time"]) if hourly_stats["avg_response_time"] else 0,
            "error_rate": sum(hourly_stats["error_rates"]) / len(hourly_stats["error_rates"]) if hourly_stats["error_rates"] else 0
        }
        
        self.hourly_metrics[hour_key] = aggregated
        
        logger.info(
            "Hourly metrics aggregated",
            extra={"data": json.dumps(aggregated)}
        )
    
    async def _aggregate_daily_metrics(self):
        """Aggregate metrics for the past day"""
        day_key = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
        
        daily_stats = {
            "total_patterns_learned": 0,
            "total_feedback": 0,
            "avg_accuracy": [],
            "avg_confidence": [],
            "avg_response_time": [],
            "avg_error_rate": []
        }
        
        # Aggregate from hourly metrics
        for hour in range(24):
            hour_key = f"{day_key}-{hour:02d}"
            if hour_key in self.hourly_metrics:
                hour_data = self.hourly_metrics[hour_key]
                daily_stats["total_patterns_learned"] += hour_data["patterns_learned"]
                daily_stats["total_feedback"] += hour_data["feedback_count"]
                if hour_data["avg_accuracy"] > 0:
                    daily_stats["avg_accuracy"].append(hour_data["avg_accuracy"])
                if hour_data["avg_confidence"] > 0:
                    daily_stats["avg_confidence"].append(hour_data["avg_confidence"])
                if hour_data["avg_response_time"] > 0:
                    daily_stats["avg_response_time"].append(hour_data["avg_response_time"])
                if hour_data["error_rate"] > 0:
                    daily_stats["avg_error_rate"].append(hour_data["error_rate"])
        
        # Calculate daily averages
        aggregated = {
            "date": day_key,
            "total_patterns_learned": daily_stats["total_patterns_learned"],
            "total_feedback": daily_stats["total_feedback"],
            "avg_accuracy": sum(daily_stats["avg_accuracy"]) / len(daily_stats["avg_accuracy"]) if daily_stats["avg_accuracy"] else 0,
            "avg_confidence": sum(daily_stats["avg_confidence"]) / len(daily_stats["avg_confidence"]) if daily_stats["avg_confidence"] else 0,
            "avg_response_time_ms": sum(daily_stats["avg_response_time"]) / len(daily_stats["avg_response_time"]) if daily_stats["avg_response_time"] else 0,
            "avg_error_rate": sum(daily_stats["avg_error_rate"]) / len(daily_stats["avg_error_rate"]) if daily_stats["avg_error_rate"] else 0,
            "learning_velocity": daily_stats["total_patterns_learned"] / 24  # Patterns per hour
        }
        
        self.daily_metrics[day_key] = aggregated
        
        logger.info(
            "Daily metrics aggregated",
            extra={"data": json.dumps(aggregated)}
        )
        
        # Persist to database
        await self._persist_daily_metrics(aggregated)
    
    async def _persist_metrics_loop(self):
        """Background loop to persist metrics to database"""
        while True:
            try:
                await asyncio.sleep(300)  # Persist every 5 minutes
                
                # Persist current buffers
                await self._persist_buffers()
                
            except Exception as e:
                logger.error(f"Error in persistence loop: {e}", extra={"data": json.dumps({"error": str(e)})})
    
    async def _init_database(self):
        """Initialize database for metrics storage"""
        try:
            import sqlite3
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Create tables
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS learning_metrics (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    metric_type TEXT NOT NULL,
                    pattern_id TEXT NOT NULL,
                    value REAL NOT NULL,
                    context TEXT,
                    metadata TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS learning_events (
                    event_id TEXT PRIMARY KEY,
                    event_type TEXT NOT NULL,
                    pattern_id TEXT NOT NULL,
                    data TEXT,
                    outcome TEXT,
                    confidence REAL,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS daily_aggregates (
                    date TEXT PRIMARY KEY,
                    total_patterns_learned INTEGER,
                    total_feedback INTEGER,
                    avg_accuracy REAL,
                    avg_confidence REAL,
                    avg_response_time_ms REAL,
                    avg_error_rate REAL,
                    learning_velocity REAL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Create indexes
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON learning_metrics(timestamp)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_metrics_pattern ON learning_metrics(pattern_id)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_events_timestamp ON learning_events(timestamp)")
            
            conn.commit()
            conn.close()
            
            logger.info("Database initialized", extra={"data": json.dumps({"db_path": self.db_path})})
            
        except Exception as e:
            logger.error(f"Database initialization error: {e}", extra={"data": json.dumps({"error": str(e)})})
    
    async def _persist_buffers(self):
        """Persist buffered metrics and events to database"""
        try:
            import sqlite3
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Persist metrics
            metrics_to_persist = []
            while self.metrics_buffer:
                metric = self.metrics_buffer.popleft()
                metrics_to_persist.append((
                    metric.metric_type.value,
                    metric.pattern_id,
                    metric.value,
                    json.dumps(metric.context),
                    json.dumps(metric.metadata),
                    metric.timestamp.isoformat()
                ))
            
            if metrics_to_persist:
                cursor.executemany(
                    "INSERT INTO learning_metrics (metric_type, pattern_id, value, context, metadata, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
                    metrics_to_persist
                )
            
            # Persist events
            events_to_persist = []
            while self.events_buffer:
                event = self.events_buffer.popleft()
                events_to_persist.append((
                    event.event_id,
                    event.event_type,
                    event.pattern_id,
                    json.dumps(event.data),
                    event.outcome,
                    event.confidence,
                    event.timestamp.isoformat()
                ))
            
            if events_to_persist:
                cursor.executemany(
                    "INSERT INTO learning_events (event_id, event_type, pattern_id, data, outcome, confidence, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    events_to_persist
                )
            
            conn.commit()
            conn.close()
            
            if metrics_to_persist or events_to_persist:
                logger.info(
                    "Buffers persisted to database",
                    extra={"data": json.dumps({
                        "metrics_persisted": len(metrics_to_persist),
                        "events_persisted": len(events_to_persist)
                    })}
                )
            
        except Exception as e:
            logger.error(f"Buffer persistence error: {e}", extra={"data": json.dumps({"error": str(e)})})
    
    async def _persist_daily_metrics(self, aggregated: Dict[str, Any]):
        """Persist daily aggregated metrics"""
        try:
            import sqlite3
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute("""
                INSERT OR REPLACE INTO daily_aggregates 
                (date, total_patterns_learned, total_feedback, avg_accuracy, avg_confidence, 
                 avg_response_time_ms, avg_error_rate, learning_velocity)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                aggregated["date"],
                aggregated["total_patterns_learned"],
                aggregated["total_feedback"],
                aggregated["avg_accuracy"],
                aggregated["avg_confidence"],
                aggregated["avg_response_time_ms"],
                aggregated["avg_error_rate"],
                aggregated["learning_velocity"]
            ))
            
            conn.commit()
            conn.close()
            
            logger.info(
                "Daily metrics persisted",
                extra={"data": json.dumps({"date": aggregated["date"]})}
            )
            
        except Exception as e:
            logger.error(f"Daily metrics persistence error: {e}", extra={"data": json.dumps({"error": str(e)})})
    
    async def get_current_metrics(self) -> Dict[str, Any]:
        """Get current real-time metrics"""
        return self.current_metrics.copy()
    
    async def get_daily_summary(self, date: Optional[str] = None) -> Dict[str, Any]:
        """Get daily summary metrics"""
        if not date:
            date = datetime.now().strftime("%Y-%m-%d")
        
        return self.daily_metrics.get(date, {})
    
    async def shutdown(self):
        """Shutdown the emitter gracefully"""
        # Cancel background tasks
        if self.emit_task:
            self.emit_task.cancel()
        if self.aggregate_task:
            self.aggregate_task.cancel()
        if self.persist_task:
            self.persist_task.cancel()
        
        # Persist remaining buffers
        await self._persist_buffers()
        
        logger.info("Learning Metrics Emitter shutdown", extra={"data": json.dumps({"status": "stopped"})})

# Demo usage
async def demo_learning_metrics():
    """Demo the learning metrics emitter"""
    print("🎯 Learning Metrics Emitter Demo")
    print("=" * 50)
    
    emitter = LearningMetricsEmitter()
    await emitter.initialize()
    
    # Simulate learning events
    print("\n📊 Emitting sample metrics...")
    
    # Pattern learned
    await emitter.emit_event("pattern_learned", "pattern_001", {
        "pattern_type": "user_intent",
        "confidence": 0.85
    })
    
    # Feedback received
    await emitter.emit_event("feedback_received", "pattern_001", {
        "score": 0.9,
        "type": "positive",
        "source": "user"
    })
    
    # Emit various metrics
    await emitter.emit_metric(MetricType.ACCURACY_UPDATE, "pattern_001", 0.87)
    await emitter.emit_metric(MetricType.CONFIDENCE_CHANGE, "pattern_001", 0.92)
    await emitter.emit_metric(MetricType.CACHE_HIT, "pattern_001", 1.0)
    await emitter.emit_metric(MetricType.RESPONSE_TIME, "pattern_001", 145.5)
    
    # Wait a bit for async operations
    await asyncio.sleep(2)
    
    # Get current metrics
    current = await emitter.get_current_metrics()
    print("\n📈 Current Metrics:")
    for key, value in current.items():
        if isinstance(value, float):
            print(f"   {key}: {value:.3f}")
        else:
            print(f"   {key}: {value}")
    
    # Shutdown
    await emitter.shutdown()
    print("\n✅ Demo completed")

if __name__ == "__main__":
    asyncio.run(demo_learning_metrics())
