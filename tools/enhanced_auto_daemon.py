#!/usr/bin/env python3
"""
Enhanced Auto-daemon to keep AuraOS Learning Growth running continuously with auto-recovery.
Features: Dynamic config reload, health monitoring, log rotation, and signal handling.
"""

import subprocess
import time
import json
import os
import signal
import sys
import threading
from pathlib import Path
from datetime import datetime

# Try to import watchdog, fallback if not available
try:
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler
    WATCHDOG_AVAILABLE = True
except ImportError:
    WATCHDOG_AVAILABLE = False
    print("⚠️ Watchdog not available. Install with: pip install watchdog")

# Paths
CONFIG_PATH = Path(__file__).parent.parent / "config" / "learning_daemon_config.json"
STATE_DIR = Path(__file__).parent / "state"
LOG_PATH = Path(__file__).parent.parent / "logs" / "daemon.log"
HEALTH_CHECK_INTERVAL = 30  # seconds

DEFAULT_CONFIG = {
    "script": "auraos_learning_api_server.py",
    "restart_backoff_sec": 5,
    "max_backoff_sec": 120,
    "auto_start": True,
    "health_check_enabled": True,
    "log_rotation_enabled": True,
    "max_log_size_mb": 10,
    "max_health_failures": 3
}

class ConfigHandler(FileSystemEventHandler):
    """Handle config file changes for dynamic reload"""
    
    def __init__(self, daemon_instance):
        self.daemon_instance = daemon_instance
        
    def on_modified(self, event):
        if event.src_path == str(CONFIG_PATH):
            self.daemon_instance.reload_config()
            log("🔄 Config reloaded dynamically!")

class LearningDaemon:
    """Enhanced Learning Growth Daemon with dynamic config and health monitoring"""
    
    def __init__(self):
        self.config = DEFAULT_CONFIG.copy()
        self.process = None
        self.is_running = True
        self.backoff = 5
        self.max_backoff = 120
        self.last_health_check = time.time()
        self.health_failures = 0
        self.max_health_failures = 3
        
    def load_config(self):
        """Load configuration from file"""
        if CONFIG_PATH.exists():
            try:
                with open(CONFIG_PATH, "r") as f:
                    new_config = json.load(f)
                    self.config.update(new_config)
                    log(f"📋 Config loaded: {self.config}")
            except Exception as e:
                log(f"❌ Error loading config: {e}")
        else:
            log("⚠️ Config file not found, using defaults")
            
    def reload_config(self):
        """Reload configuration dynamically"""
        old_config = self.config.copy()
        self.load_config()
        
        # Update runtime parameters
        self.backoff = self.config.get("restart_backoff_sec", 5)
        self.max_backoff = self.config.get("max_backoff_sec", 120)
        self.max_health_failures = self.config.get("max_health_failures", 3)
        
        log(f"🔄 Config reloaded: {self.config}")
        
    def ensure_dirs(self):
        """Ensure required directories exist"""
        STATE_DIR.mkdir(exist_ok=True, parents=True)
        LOG_PATH.parent.mkdir(exist_ok=True, parents=True)
        
    def log_rotation_check(self):
        """Check and rotate logs if needed"""
        if not self.config.get("log_rotation_enabled", True):
            return
            
        max_size_mb = self.config.get("max_log_size_mb", 10)
        max_size_bytes = max_size_mb * 1024 * 1024
        
        if LOG_PATH.exists() and LOG_PATH.stat().st_size > max_size_bytes:
            # Rotate log file
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            rotated_path = LOG_PATH.parent / f"daemon_{timestamp}.log"
            
            try:
                LOG_PATH.rename(rotated_path)
                log(f"📄 Log rotated: {rotated_path}")
            except Exception as e:
                log(f"❌ Error rotating log: {e}")
    
    def health_check(self):
        """Perform health check on the learning system"""
        if not self.config.get("health_check_enabled", True):
            return True
            
        try:
            # Check if process is still running
            if self.process and self.process.poll() is not None:
                return False
                
            # Check if learning API is responding
            # This is a simple check - in production, you'd make an HTTP request
            health_file = STATE_DIR / "health_check"
            health_file.touch()
            
            # Update health check timestamp
            self.last_health_check = time.time()
            self.health_failures = 0
            
            return True
            
        except Exception as e:
            log(f"❌ Health check failed: {e}")
            self.health_failures += 1
            return False
    
    def start_process(self):
        """Start the learning process"""
        script = self.config.get("script", "auraos_learning_api_server.py")
        script_path = Path(__file__).parent.parent / script
        
        if not script_path.exists():
            log(f"❌ Script not found: {script_path}")
            return None
            
        try:
            log(f"🚀 Starting {script}")
            proc = subprocess.Popen(
                ["python3", str(script_path)],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                cwd=str(script_path.parent)
            )
            return proc
        except Exception as e:
            log(f"❌ Error starting process: {e}")
            return None
    
    def monitor_process(self):
        """Monitor the learning process"""
        while self.is_running:
            try:
                # Start process if not running
                if not self.process or self.process.poll() is not None:
                    self.process = self.start_process()
                    if not self.process:
                        log(f"❌ Failed to start process, retrying in {self.backoff}s")
                        time.sleep(self.backoff)
                        self.backoff = min(self.backoff * 2, self.max_backoff)
                        continue
                    else:
                        self.backoff = self.config.get("restart_backoff_sec", 5)
                
                # Monitor process output
                if self.process and self.process.stdout:
                    line = self.process.stdout.readline()
                    if line:
                        log(line.rstrip())
                
                # Health check
                if time.time() - self.last_health_check > HEALTH_CHECK_INTERVAL:
                    if not self.health_check():
                        log(f"⚠️ Health check failed ({self.health_failures}/{self.max_health_failures})")
                        if self.health_failures >= self.max_health_failures:
                            log("❌ Too many health failures, restarting process")
                            if self.process:
                                self.process.terminate()
                                self.process = None
                                self.health_failures = 0
                
                # Log rotation check
                self.log_rotation_check()
                
                time.sleep(1)
                
            except Exception as e:
                log(f"❌ Error in monitor loop: {e}")
                time.sleep(5)
    
    def start_config_watcher(self):
        """Start config file watcher"""
        if not WATCHDOG_AVAILABLE:
            log("⚠️ Watchdog not available, config reload disabled")
            return None
            
        try:
            observer = Observer()
            observer.schedule(ConfigHandler(self), str(CONFIG_PATH.parent), recursive=False)
            observer.start()
            log("👁️ Config watcher started")
            return observer
        except Exception as e:
            log(f"❌ Error starting config watcher: {e}")
            return None
    
    def signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        log(f"🛑 Received signal {signum}, shutting down...")
        self.is_running = False
        if self.process:
            self.process.terminate()
        sys.exit(0)
    
    def run(self):
        """Main daemon loop"""
        # Setup signal handlers
        signal.signal(signal.SIGTERM, self.signal_handler)
        signal.signal(signal.SIGINT, self.signal_handler)
        
        # Initialize
        self.ensure_dirs()
        self.load_config()
        
        # Start config watcher
        observer = self.start_config_watcher()
        
        try:
            log("🧠 AuraOS Learning Growth Daemon started")
            self.monitor_process()
        finally:
            if observer:
                observer.stop()
            log("✅ Daemon shutdown complete")

def log(msg):
    """Log message with timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_msg = f"{timestamp} - {msg}"
    
    try:
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write(log_msg + "\n")
    except Exception:
        # Fallback to console if file logging fails
        print(log_msg)

def main():
    """Main entry point"""
    daemon = LearningDaemon()
    daemon.run()

if __name__ == "__main__":
    main()
