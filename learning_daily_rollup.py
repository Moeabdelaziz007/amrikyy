#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Daily Rollup Job for Learning KPIs
Aggregates 24-hour learning metrics and generates insights
"""

import asyncio
import json
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import logging
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from learning_metrics_emitter import LearningMetricsEmitter, MetricType

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='{"timestamp":"%(asctime)s","level":"%(levelname)s","category":"daily_rollup","message":"%(message)s","data":%(data)s}'
)
logger = logging.getLogger(__name__)

class LearningDailyRollup:
    """Daily rollup job for learning KPIs"""
    
    def __init__(self, db_path: str = "learning_metrics.db"):
        self.db_path = db_path
        self.emitter = LearningMetricsEmitter(db_path)
        
    async def run_daily_rollup(self, date: Optional[str] = None):
        """Run daily rollup for specified date (default: yesterday)"""
        if not date:
            yesterday = datetime.now() - timedelta(days=1)
            date = yesterday.strftime("%Y-%m-%d")
        
        logger.info(f"Starting daily rollup for {date}", extra={"data": json.dumps({"date": date})})
        
        try:
            # Connect to database
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Get metrics for the day
            start_time = f"{date} 00:00:00"
            end_time = f"{date} 23:59:59"
            
            # 1. Pattern Learning Metrics
            cursor.execute("""
                SELECT COUNT(DISTINCT pattern_id) as unique_patterns,
                       COUNT(*) as total_patterns
                FROM learning_events
                WHERE event_type = 'pattern_learned'
                AND timestamp BETWEEN ? AND ?
            """, (start_time, end_time))
            
            pattern_stats = cursor.fetchone()
            unique_patterns = pattern_stats[0] if pattern_stats[0] else 0
            total_patterns = pattern_stats[1] if pattern_stats[1] else 0
            
            # 2. Feedback Metrics
            cursor.execute("""
                SELECT COUNT(*) as feedback_count,
                       AVG(confidence) as avg_confidence
                FROM learning_events
                WHERE event_type = 'feedback_received'
                AND timestamp BETWEEN ? AND ?
            """, (start_time, end_time))
            
            feedback_stats = cursor.fetchone()
            feedback_count = feedback_stats[0] if feedback_stats[0] else 0
            avg_feedback_confidence = feedback_stats[1] if feedback_stats[1] else 0
            
            # 3. Accuracy Metrics
            cursor.execute("""
                SELECT AVG(value) as avg_accuracy,
                       MIN(value) as min_accuracy,
                       MAX(value) as max_accuracy,
                       COUNT(*) as accuracy_updates
                FROM learning_metrics
                WHERE metric_type = 'accuracy_update'
                AND timestamp BETWEEN ? AND ?
            """, (start_time, end_time))
            
            accuracy_stats = cursor.fetchone()
            avg_accuracy = accuracy_stats[0] if accuracy_stats[0] else 0
            min_accuracy = accuracy_stats[1] if accuracy_stats[1] else 0
            max_accuracy = accuracy_stats[2] if accuracy_stats[2] else 0
            accuracy_updates = accuracy_stats[3] if accuracy_stats[3] else 0
            
            # 4. Performance Metrics
            cursor.execute("""
                SELECT AVG(value) as avg_response_time,
                       MIN(value) as min_response_time,
                       MAX(value) as max_response_time,
                       COUNT(*) as response_count
                FROM learning_metrics
                WHERE metric_type = 'response_time'
                AND timestamp BETWEEN ? AND ?
            """, (start_time, end_time))
            
            performance_stats = cursor.fetchone()
            avg_response_time = performance_stats[0] if performance_stats[0] else 0
            min_response_time = performance_stats[1] if performance_stats[1] else 0
            max_response_time = performance_stats[2] if performance_stats[2] else 0
            response_count = performance_stats[3] if performance_stats[3] else 0
            
            # 5. Cache Metrics
            cursor.execute("""
                SELECT 
                    SUM(CASE WHEN metric_type = 'cache_hit' THEN 1 ELSE 0 END) as cache_hits,
                    SUM(CASE WHEN metric_type = 'cache_miss' THEN 1 ELSE 0 END) as cache_misses
                FROM learning_metrics
                WHERE metric_type IN ('cache_hit', 'cache_miss')
                AND timestamp BETWEEN ? AND ?
            """, (start_time, end_time))
            
            cache_stats = cursor.fetchone()
            cache_hits = cache_stats[0] if cache_stats[0] else 0
            cache_misses = cache_stats[1] if cache_stats[1] else 0
            cache_total = cache_hits + cache_misses
            cache_hit_rate = cache_hits / cache_total if cache_total > 0 else 0
            
            # 6. Error Metrics
            cursor.execute("""
                SELECT AVG(value) as avg_error_rate,
                       MAX(value) as max_error_rate
                FROM learning_metrics
                WHERE metric_type = 'error_rate'
                AND timestamp BETWEEN ? AND ?
            """, (start_time, end_time))
            
            error_stats = cursor.fetchone()
            avg_error_rate = error_stats[0] if error_stats[0] else 0
            max_error_rate = error_stats[1] if error_stats[1] else 0
            
            # 7. Pattern Performance by Hour
            cursor.execute("""
                SELECT 
                    strftime('%H', timestamp) as hour,
                    COUNT(*) as patterns_learned
                FROM learning_events
                WHERE event_type = 'pattern_learned'
                AND timestamp BETWEEN ? AND ?
                GROUP BY hour
                ORDER BY hour
            """, (start_time, end_time))
            
            hourly_patterns = {row[0]: row[1] for row in cursor.fetchall()}
            
            # Calculate learning velocity (patterns per hour)
            learning_velocity = total_patterns / 24 if total_patterns > 0 else 0
            
            # Calculate quality score
            quality_score = self._calculate_quality_score(
                avg_accuracy, cache_hit_rate, avg_error_rate, avg_response_time
            )
            
            # Prepare rollup summary (without insights first)
            rollup_summary = {
                "date": date,
                "patterns": {
                    "unique_patterns_learned": unique_patterns,
                    "total_patterns_learned": total_patterns,
                    "learning_velocity": round(learning_velocity, 2)
                },
                "feedback": {
                    "total_feedback": feedback_count,
                    "avg_confidence": round(avg_feedback_confidence, 3) if avg_feedback_confidence else 0
                },
                "accuracy": {
                    "average": round(avg_accuracy, 3) if avg_accuracy else 0,
                    "minimum": round(min_accuracy, 3) if min_accuracy else 0,
                    "maximum": round(max_accuracy, 3) if max_accuracy else 0,
                    "updates": accuracy_updates
                },
                "performance": {
                    "avg_response_time_ms": round(avg_response_time, 2) if avg_response_time else 0,
                    "min_response_time_ms": round(min_response_time, 2) if min_response_time else 0,
                    "max_response_time_ms": round(max_response_time, 2) if max_response_time else 0,
                    "total_responses": response_count
                },
                "cache": {
                    "hits": cache_hits,
                    "misses": cache_misses,
                    "hit_rate": round(cache_hit_rate, 3)
                },
                "errors": {
                    "avg_error_rate": round(avg_error_rate, 3) if avg_error_rate else 0,
                    "max_error_rate": round(max_error_rate, 3) if max_error_rate else 0
                },
                "hourly_distribution": hourly_patterns,
                "quality_score": round(quality_score, 2)
            }
            
            # Add insights after creating the summary
            rollup_summary["insights"] = self._generate_insights(rollup_summary)
            
            # Store rollup in database
            cursor.execute("""
                INSERT OR REPLACE INTO daily_aggregates 
                (date, total_patterns_learned, total_feedback, avg_accuracy, avg_confidence, 
                 avg_response_time_ms, avg_error_rate, learning_velocity)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                date,
                total_patterns,
                feedback_count,
                avg_accuracy if avg_accuracy else 0,
                avg_feedback_confidence if avg_feedback_confidence else 0,
                avg_response_time if avg_response_time else 0,
                avg_error_rate if avg_error_rate else 0,
                learning_velocity
            ))
            
            conn.commit()
            conn.close()
            
            # Log the rollup summary
            logger.info(
                f"Daily rollup completed for {date}",
                extra={"data": json.dumps(rollup_summary)}
            )
            
            # Write to file for easy access
            rollup_file = f"learning_rollup_{date}.json"
            with open(rollup_file, 'w') as f:
                json.dump(rollup_summary, f, indent=2)
            
            logger.info(
                f"Rollup saved to file",
                extra={"data": json.dumps({"file": rollup_file})}
            )
            
            return rollup_summary
            
        except Exception as e:
            logger.error(f"Error in daily rollup: {e}", extra={"data": json.dumps({"error": str(e)})})
            return None
    
    def _calculate_quality_score(self, accuracy: float, cache_hit_rate: float, 
                                 error_rate: float, response_time: float) -> float:
        """Calculate overall quality score (0-100)"""
        score = 0.0
        
        # Accuracy contributes 40%
        score += accuracy * 40 if accuracy else 0
        
        # Cache hit rate contributes 20%
        score += cache_hit_rate * 20
        
        # Error rate contributes 20% (inverted)
        score += (1 - min(error_rate, 1)) * 20
        
        # Response time contributes 20% (normalized)
        # Assuming < 100ms is excellent, > 1000ms is poor
        if response_time > 0:
            if response_time < 100:
                score += 20
            elif response_time < 500:
                score += 15
            elif response_time < 1000:
                score += 10
            else:
                score += 5
        
        return min(100, max(0, score))
    
    def _generate_insights(self, summary: Dict[str, Any]) -> List[str]:
        """Generate insights from the rollup summary"""
        insights = []
        
        # Pattern learning insights
        if summary.get("patterns", {}).get("total_patterns_learned", 0) > 100:
            insights.append("High learning activity detected - system is actively adapting")
        elif summary.get("patterns", {}).get("total_patterns_learned", 0) < 10:
            insights.append("Low learning activity - consider increasing training data")
        
        # Accuracy insights
        avg_accuracy = summary.get("accuracy", {}).get("average", 0)
        if avg_accuracy > 0.9:
            insights.append("Excellent accuracy achieved - system performing well")
        elif avg_accuracy < 0.7:
            insights.append("Accuracy below threshold - review training algorithms")
        
        # Performance insights
        avg_response = summary.get("performance", {}).get("avg_response_time_ms", 0)
        if avg_response > 500:
            insights.append("Response times are high - consider optimization")
        elif avg_response < 100:
            insights.append("Excellent response times achieved")
        
        # Cache insights
        cache_hit_rate = summary.get("cache", {}).get("hit_rate", 0)
        if cache_hit_rate < 0.8:
            insights.append("Cache hit rate is low - review caching strategy")
        elif cache_hit_rate > 0.95:
            insights.append("Excellent cache performance")
        
        # Error insights
        avg_error_rate = summary.get("errors", {}).get("avg_error_rate", 0)
        if avg_error_rate > 0.05:
            insights.append("Error rate above 5% - investigate error sources")
        
        # Hourly distribution insights
        hourly = summary.get("hourly_distribution", {})
        if hourly:
            peak_hour = max(hourly.items(), key=lambda x: x[1])
            insights.append(f"Peak learning activity at hour {peak_hour[0]} with {peak_hour[1]} patterns")
        
        return insights
    
    async def run_weekly_summary(self):
        """Generate weekly summary from daily rollups"""
        end_date = datetime.now() - timedelta(days=1)
        start_date = end_date - timedelta(days=6)
        
        logger.info(
            "Generating weekly summary",
            extra={"data": json.dumps({
                "start_date": start_date.strftime("%Y-%m-%d"),
                "end_date": end_date.strftime("%Y-%m-%d")
            })}
        )
        
        weekly_stats = {
            "week_ending": end_date.strftime("%Y-%m-%d"),
            "daily_summaries": []
        }
        
        # Collect daily summaries
        for i in range(7):
            date = (start_date + timedelta(days=i)).strftime("%Y-%m-%d")
            rollup_file = f"learning_rollup_{date}.json"
            
            if os.path.exists(rollup_file):
                with open(rollup_file, 'r') as f:
                    daily_data = json.load(f)
                    weekly_stats["daily_summaries"].append(daily_data)
        
        if weekly_stats["daily_summaries"]:
            # Calculate weekly aggregates
            total_patterns = sum(d.get("patterns", {}).get("total_patterns_learned", 0) 
                               for d in weekly_stats["daily_summaries"])
            avg_accuracy = sum(d.get("accuracy", {}).get("average", 0) 
                             for d in weekly_stats["daily_summaries"]) / len(weekly_stats["daily_summaries"])
            avg_quality = sum(d.get("quality_score", 0) 
                            for d in weekly_stats["daily_summaries"]) / len(weekly_stats["daily_summaries"])
            
            weekly_stats["summary"] = {
                "total_patterns_learned": total_patterns,
                "avg_daily_patterns": total_patterns / 7,
                "avg_accuracy": round(avg_accuracy, 3),
                "avg_quality_score": round(avg_quality, 2)
            }
            
            # Save weekly summary
            weekly_file = f"learning_weekly_{end_date.strftime('%Y-%m-%d')}.json"
            with open(weekly_file, 'w') as f:
                json.dump(weekly_stats, f, indent=2)
            
            logger.info(
                "Weekly summary generated",
                extra={"data": json.dumps({"file": weekly_file, "summary": weekly_stats["summary"]})}
            )
        
        return weekly_stats

async def main():
    """Main function to run daily rollup"""
    rollup = LearningDailyRollup()
    
    # Check command line arguments
    if len(sys.argv) > 1:
        if sys.argv[1] == "weekly":
            await rollup.run_weekly_summary()
        else:
            # Run for specific date
            await rollup.run_daily_rollup(sys.argv[1])
    else:
        # Run for yesterday by default
        await rollup.run_daily_rollup()

if __name__ == "__main__":
    asyncio.run(main())
