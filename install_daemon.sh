#!/bin/bash
# AuraOS Learning Growth Daemon Installation Script
# This script sets up the daemon as a system service on macOS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DAEMON_NAME="com.auraos.learningdaemon"
PLIST_FILE="/Library/LaunchDaemons/${DAEMON_NAME}.plist"
AURAOS_HOME="/Users/cryptojoker710/Downloads/AuraOS"
DAEMON_SCRIPT="${AURAOS_HOME}/tools/enhanced_auto_daemon.py"
LOG_DIR="${AURAOS_HOME}/logs"
STATE_DIR="${AURAOS_HOME}/tools/state"

echo -e "${BLUE}🧠 AuraOS Learning Growth Daemon Installer${NC}"
echo "================================================"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ This script must be run as root (use sudo)${NC}"
   exit 1
fi

# Check if AuraOS directory exists
if [[ ! -d "$AURAOS_HOME" ]]; then
    echo -e "${RED}❌ AuraOS directory not found: $AURAOS_HOME${NC}"
    exit 1
fi

# Check if daemon script exists
if [[ ! -f "$DAEMON_SCRIPT" ]]; then
    echo -e "${RED}❌ Daemon script not found: $DAEMON_SCRIPT${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Installation Steps:${NC}"
echo "1. Creating required directories..."
mkdir -p "$LOG_DIR"
mkdir -p "$STATE_DIR"
mkdir -p "$(dirname "$PLIST_FILE")"

echo "2. Setting up permissions..."
chown -R $(whoami):staff "$AURAOS_HOME"
chmod +x "$DAEMON_SCRIPT"

echo "3. Installing LaunchDaemon plist..."
cp "${AURAOS_HOME}/${DAEMON_NAME}.plist" "$PLIST_FILE"
chown root:wheel "$PLIST_FILE"
chmod 644 "$PLIST_FILE"

echo "4. Installing logrotate configuration..."
if [[ -d "/etc/logrotate.d" ]]; then
    cp "${AURAOS_HOME}/logrotate/auraos-learning-daemon.conf" "/etc/logrotate.d/"
    echo -e "${GREEN}✅ Logrotate configuration installed${NC}"
else
    echo -e "${YELLOW}⚠️ Logrotate directory not found, skipping log rotation setup${NC}"
fi

echo "5. Installing Python dependencies..."
pip3 install watchdog --user || echo -e "${YELLOW}⚠️ Could not install watchdog, config reload will be disabled${NC}"

echo "6. Loading LaunchDaemon..."
launchctl unload "$PLIST_FILE" 2>/dev/null || true
launchctl load -w "$PLIST_FILE"

echo "7. Verifying installation..."
sleep 2
if launchctl list | grep -q "$DAEMON_NAME"; then
    echo -e "${GREEN}✅ Daemon loaded successfully${NC}"
else
    echo -e "${RED}❌ Failed to load daemon${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Installation Complete!${NC}"
echo "================================"
echo -e "${BLUE}📊 Service Status:${NC}"
launchctl list | grep "$DAEMON_NAME" || echo "Service not running"

echo -e "${BLUE}📁 Important Files:${NC}"
echo "  Daemon Script: $DAEMON_SCRIPT"
echo "  Config File: ${AURAOS_HOME}/config/learning_daemon_config.json"
echo "  Log File: $LOG_DIR/daemon.log"
echo "  Plist File: $PLIST_FILE"

echo -e "${BLUE}🔧 Management Commands:${NC}"
echo "  Start:   sudo launchctl load -w $PLIST_FILE"
echo "  Stop:    sudo launchctl unload $PLIST_FILE"
echo "  Status:  launchctl list | grep $DAEMON_NAME"
echo "  Logs:    tail -f $LOG_DIR/daemon.log"

echo -e "${BLUE}⚙️ Configuration:${NC}"
echo "  Edit config: nano ${AURAOS_HOME}/config/learning_daemon_config.json"
echo "  Config will reload automatically when changed"

echo ""
echo -e "${GREEN}🚀 AuraOS Learning Growth Daemon is now running continuously!${NC}"
