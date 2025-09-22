# =============================================================================
# AURAOS ENVIRONMENT PROTECTION SYSTEM
# =============================================================================
# This script protects the .env file from accidental deletion or modification
# =============================================================================

#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENV_FILE=".env"
ENV_EXAMPLE_FILE=".env.example"
PROTECTION_LOG="env_protection.log"
BACKUP_DIR="env_backups"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to log protection events
log_event() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$PROTECTION_LOG"
}

# Function to create backup
create_backup() {
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    local backup_file="$BACKUP_DIR/.env.backup.$timestamp"
    
    if [ -f "$ENV_FILE" ]; then
        cp "$ENV_FILE" "$backup_file"
        echo -e "${GREEN}✅ Backup created: $backup_file${NC}"
        log_event "Backup created: $backup_file"
    else
        echo -e "${RED}❌ .env file not found for backup${NC}"
        log_event "ERROR: .env file not found for backup"
    fi
}

# Function to restore from backup
restore_backup() {
    local latest_backup=$(ls -t "$BACKUP_DIR"/.env.backup.* 2>/dev/null | head -n1)
    
    if [ -n "$latest_backup" ]; then
        cp "$latest_backup" "$ENV_FILE"
        echo -e "${GREEN}✅ Restored from backup: $latest_backup${NC}"
        log_event "Restored from backup: $latest_backup"
    else
        echo -e "${RED}❌ No backup found${NC}"
        log_event "ERROR: No backup found for restore"
    fi
}

# Function to check .env file integrity
check_env_integrity() {
    if [ ! -f "$ENV_FILE" ]; then
        echo -e "${RED}❌ CRITICAL: .env file is missing!${NC}"
        log_event "CRITICAL: .env file is missing"
        return 1
    fi
    
    # Check if file has content
    if [ ! -s "$ENV_FILE" ]; then
        echo -e "${RED}❌ CRITICAL: .env file is empty!${NC}"
        log_event "CRITICAL: .env file is empty"
        return 1
    fi
    
    # Check for required variables
    local required_vars=("NODE_ENV" "PORT" "DATABASE_URL" "VITE_FIREBASE_API_KEY")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" "$ENV_FILE"; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Missing required variables: ${missing_vars[*]}${NC}"
        log_event "WARNING: Missing required variables: ${missing_vars[*]}"
        return 1
    fi
    
    echo -e "${GREEN}✅ .env file integrity check passed${NC}"
    log_event "INFO: .env file integrity check passed"
    return 0
}

# Function to protect .env file
protect_env_file() {
    if [ -f "$ENV_FILE" ]; then
        # Make file read-only for owner, but writable for owner
        chmod 600 "$ENV_FILE"
        echo -e "${GREEN}✅ .env file protected with restricted permissions${NC}"
        log_event "INFO: .env file protected with restricted permissions"
        
        # Create backup
        create_backup
    else
        echo -e "${RED}❌ .env file not found${NC}"
        log_event "ERROR: .env file not found"
        return 1
    fi
}

# Function to unprotect .env file (for editing)
unprotect_env_file() {
    if [ -f "$ENV_FILE" ]; then
        chmod 644 "$ENV_FILE"
        echo -e "${YELLOW}⚠️  .env file permissions relaxed for editing${NC}"
        log_event "INFO: .env file permissions relaxed for editing"
    else
        echo -e "${RED}❌ .env file not found${NC}"
        log_event "ERROR: .env file not found"
        return 1
    fi
}

# Function to recreate .env from template
recreate_env() {
    if [ -f "$ENV_EXAMPLE_FILE" ]; then
        cp "$ENV_EXAMPLE_FILE" "$ENV_FILE"
        echo -e "${GREEN}✅ .env file recreated from template${NC}"
        log_event "INFO: .env file recreated from template"
        echo -e "${YELLOW}⚠️  Remember to update the values in .env file${NC}"
    else
        echo -e "${RED}❌ .env.example template not found${NC}"
        log_event "ERROR: .env.example template not found"
        return 1
    fi
}

# Function to show status
show_status() {
    echo -e "${BLUE}📊 AuraOS Environment Protection Status${NC}"
    echo "=========================================="
    
    if [ -f "$ENV_FILE" ]; then
        local file_size=$(wc -c < "$ENV_FILE")
        local file_perms=$(ls -l "$ENV_FILE" | awk '{print $1}')
        local file_date=$(ls -l "$ENV_FILE" | awk '{print $6, $7, $8}')
        
        echo -e "${GREEN}✅ .env file exists${NC}"
        echo "   Size: $file_size bytes"
        echo "   Permissions: $file_perms"
        echo "   Modified: $file_date"
        
        # Check integrity
        if check_env_integrity; then
            echo -e "${GREEN}✅ Integrity check passed${NC}"
        else
            echo -e "${RED}❌ Integrity check failed${NC}"
        fi
    else
        echo -e "${RED}❌ .env file missing${NC}"
    fi
    
    # Show backup count
    local backup_count=$(ls "$BACKUP_DIR"/.env.backup.* 2>/dev/null | wc -l)
    echo "   Backups available: $backup_count"
    
    echo "=========================================="
}

# Function to show help
show_help() {
    echo -e "${BLUE}AuraOS Environment Protection System${NC}"
    echo "=========================================="
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  protect     - Protect .env file with restricted permissions"
    echo "  unprotect   - Relax permissions for editing"
    echo "  backup      - Create a backup of .env file"
    echo "  restore     - Restore from latest backup"
    echo "  check       - Check .env file integrity"
    echo "  recreate    - Recreate .env from template"
    echo "  status      - Show current status"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 protect    # Protect the .env file"
    echo "  $0 status     # Check current status"
    echo "  $0 backup     # Create backup"
    echo ""
}

# Main script logic
case "${1:-help}" in
    "protect")
        protect_env_file
        ;;
    "unprotect")
        unprotect_env_file
        ;;
    "backup")
        create_backup
        ;;
    "restore")
        restore_backup
        ;;
    "check")
        check_env_integrity
        ;;
    "recreate")
        recreate_env
        ;;
    "status")
        show_status
        ;;
    "help"|*)
        show_help
        ;;
esac
