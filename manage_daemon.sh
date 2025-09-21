#!/bin/bash
# AuraOS Learning Growth Daemon Management Script
# Provides easy commands to manage the daemon service

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DAEMON_NAME="com.auraos.learningdaemon"
PLIST_FILE="/Library/LaunchDaemons/${DAEMON_NAME}.plist"
AURAOS_HOME="/Users/cryptojoker710/Downloads/AuraOS"
LOG_FILE="${AURAOS_HOME}/logs/daemon.log"
CONFIG_FILE="${AURAOS_HOME}/config/learning_daemon_config.json"

# Functions
show_status() {
    echo -e "${BLUE}📊 Daemon Status:${NC}"
    if launchctl list | grep -q "$DAEMON_NAME"; then
        echo -e "${GREEN}✅ Service is running${NC}"
        launchctl list | grep "$DAEMON_NAME"
    else
        echo -e "${RED}❌ Service is not running${NC}"
    fi
}

show_logs() {
    echo -e "${BLUE}📄 Recent Logs (last 50 lines):${NC}"
    if [[ -f "$LOG_FILE" ]]; then
        tail -n 50 "$LOG_FILE"
    else
        echo -e "${YELLOW}⚠️ Log file not found: $LOG_FILE${NC}"
    fi
}

show_config() {
    echo -e "${BLUE}⚙️ Current Configuration:${NC}"
    if [[ -f "$CONFIG_FILE" ]]; then
        cat "$CONFIG_FILE" | python3 -m json.tool
    else
        echo -e "${YELLOW}⚠️ Config file not found: $CONFIG_FILE${NC}"
    fi
}

start_daemon() {
    echo -e "${YELLOW}🚀 Starting daemon...${NC}"
    sudo launchctl load -w "$PLIST_FILE"
    sleep 2
    show_status
}

stop_daemon() {
    echo -e "${YELLOW}🛑 Stopping daemon...${NC}"
    sudo launchctl unload "$PLIST_FILE"
    sleep 2
    show_status
}

restart_daemon() {
    echo -e "${YELLOW}🔄 Restarting daemon...${NC}"
    stop_daemon
    sleep 1
    start_daemon
}

edit_config() {
    echo -e "${BLUE}✏️ Opening config file for editing...${NC}"
    if [[ -f "$CONFIG_FILE" ]]; then
        nano "$CONFIG_FILE"
        echo -e "${GREEN}✅ Config updated. Changes will be applied automatically.${NC}"
    else
        echo -e "${RED}❌ Config file not found: $CONFIG_FILE${NC}"
    fi
}

show_help() {
    echo -e "${BLUE}🧠 AuraOS Learning Growth Daemon Manager${NC}"
    echo "=============================================="
    echo ""
    echo -e "${YELLOW}Usage: $0 [command]${NC}"
    echo ""
    echo -e "${BLUE}Commands:${NC}"
    echo "  status    - Show daemon status"
    echo "  start     - Start the daemon"
    echo "  stop      - Stop the daemon"
    echo "  restart   - Restart the daemon"
    echo "  logs      - Show recent logs"
    echo "  config    - Show current configuration"
    echo "  edit      - Edit configuration file"
    echo "  install   - Install daemon as system service"
    echo "  uninstall - Remove daemon from system"
    echo "  help      - Show this help message"
    echo ""
    echo -e "${BLUE}Examples:${NC}"
    echo "  $0 status"
    echo "  $0 logs"
    echo "  $0 restart"
}

install_daemon() {
    echo -e "${BLUE}📦 Installing daemon as system service...${NC}"
    if [[ -f "${AURAOS_HOME}/install_daemon.sh" ]]; then
        sudo bash "${AURAOS_HOME}/install_daemon.sh"
    else
        echo -e "${RED}❌ Install script not found: ${AURAOS_HOME}/install_daemon.sh${NC}"
    fi
}

uninstall_daemon() {
    echo -e "${YELLOW}🗑️ Uninstalling daemon...${NC}"
    
    # Stop daemon
    sudo launchctl unload "$PLIST_FILE" 2>/dev/null || true
    
    # Remove plist file
    if [[ -f "$PLIST_FILE" ]]; then
        sudo rm "$PLIST_FILE"
        echo -e "${GREEN}✅ Removed plist file${NC}"
    fi
    
    # Remove logrotate config
    if [[ -f "/etc/logrotate.d/auraos-learning-daemon.conf" ]]; then
        sudo rm "/etc/logrotate.d/auraos-learning-daemon.conf"
        echo -e "${GREEN}✅ Removed logrotate configuration${NC}"
    fi
    
    echo -e "${GREEN}🎉 Daemon uninstalled successfully${NC}"
}

# Main script logic
case "${1:-help}" in
    "status")
        show_status
        ;;
    "start")
        start_daemon
        ;;
    "stop")
        stop_daemon
        ;;
    "restart")
        restart_daemon
        ;;
    "logs")
        show_logs
        ;;
    "config")
        show_config
        ;;
    "edit")
        edit_config
        ;;
    "install")
        install_daemon
        ;;
    "uninstall")
        uninstall_daemon
        ;;
    "help"|*)
        show_help
        ;;
esac
