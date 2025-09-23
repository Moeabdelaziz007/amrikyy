#!/bin/bash
# Backup script for AuraOS

set -e

echo "💾 AuraOS Backup Script"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="auraos_backup_$TIMESTAMP"

# Create backup directory
create_backup_dir() {
    print_status "Creating backup directory..."
    mkdir -p "$BACKUP_DIR"
    print_success "Backup directory created"
}

# Backup database
backup_database() {
    print_status "Backing up database..."
    
    # Check if PostgreSQL is running
    if docker ps | grep -q postgres; then
        docker exec postgres pg_dump -U postgres auraos > "$BACKUP_DIR/database_$TIMESTAMP.sql"
        print_success "Database backed up"
    else
        print_warning "PostgreSQL not running, skipping database backup"
    fi
}

# Backup Redis data
backup_redis() {
    print_status "Backing up Redis data..."
    
    # Check if Redis is running
    if docker ps | grep -q redis; then
        docker exec redis redis-cli BGSAVE
        sleep 5
        docker cp redis:/data/dump.rdb "$BACKUP_DIR/redis_$TIMESTAMP.rdb"
        print_success "Redis data backed up"
    else
        print_warning "Redis not running, skipping Redis backup"
    fi
}

# Backup uploaded files
backup_files() {
    print_status "Backing up uploaded files..."
    
    if [ -d "uploads" ]; then
        tar -czf "$BACKUP_DIR/files_$TIMESTAMP.tar.gz" uploads/
        print_success "Files backed up"
    else
        print_warning "No uploads directory found, skipping file backup"
    fi
}

# Backup configuration
backup_config() {
    print_status "Backing up configuration..."
    
    # Backup environment files
    if [ -f ".env" ]; then
        cp .env "$BACKUP_DIR/env_$TIMESTAMP"
    fi
    
    # Backup Docker Compose files
    if [ -f "docker-compose.yml" ]; then
        cp docker-compose.yml "$BACKUP_DIR/docker-compose_$TIMESTAMP.yml"
    fi
    
    if [ -f "docker-compose.production.yml" ]; then
        cp docker-compose.production.yml "$BACKUP_DIR/docker-compose.production_$TIMESTAMP.yml"
    fi
    
    print_success "Configuration backed up"
}

# Backup logs
backup_logs() {
    print_status "Backing up logs..."
    
    if [ -d "logs" ]; then
        tar -czf "$BACKUP_DIR/logs_$TIMESTAMP.tar.gz" logs/
        print_success "Logs backed up"
    else
        print_warning "No logs directory found, skipping log backup"
    fi
}

# Create backup archive
create_archive() {
    print_status "Creating backup archive..."
    
    cd "$BACKUP_DIR"
    tar -czf "${BACKUP_NAME}.tar.gz" *
    cd ..
    
    print_success "Backup archive created: $BACKUP_DIR/${BACKUP_NAME}.tar.gz"
}

# Cleanup old backups
cleanup_old_backups() {
    print_status "Cleaning up old backups..."
    
    # Keep only last 7 days of backups
    find "$BACKUP_DIR" -name "auraos_backup_*.tar.gz" -mtime +7 -delete
    
    print_success "Old backups cleaned up"
}

# Main backup function
main() {
    echo "=========================================="
    echo "AuraOS Backup Process"
    echo "=========================================="
    
    create_backup_dir
    backup_database
    backup_redis
    backup_files
    backup_config
    backup_logs
    create_archive
    cleanup_old_backups
    
    echo ""
    echo "=========================================="
    echo "🎉 Backup Complete!"
    echo "=========================================="
    echo ""
    echo "Backup file: $BACKUP_DIR/${BACKUP_NAME}.tar.gz"
    echo "Size: $(du -h "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" | cut -f1)"
    echo ""
}

# Run main function
main "$@"