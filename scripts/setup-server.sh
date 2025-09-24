#!/bin/bash
# AuraOS Server Setup Script - سكريبت إعداد الخادم

set -e

# ألوان للطباعة
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_status "🖥️ بدء إعداد خادم AuraOS..."

# تحديث النظام
update_system() {
    print_status "🔄 تحديث النظام..."
    
    if command -v apt-get &> /dev/null; then
        # Ubuntu/Debian
        sudo apt-get update
        sudo apt-get upgrade -y
        sudo apt-get install -y curl wget git nginx certbot python3-certbot-nginx
    elif command -v yum &> /dev/null; then
        # CentOS/RHEL
        sudo yum update -y
        sudo yum install -y curl wget git nginx certbot python3-certbot-nginx
    elif command -v dnf &> /dev/null; then
        # Fedora
        sudo dnf update -y
        sudo dnf install -y curl wget git nginx certbot python3-certbot-nginx
    else
        print_warning "نظام التشغيل غير مدعوم، يرجى تثبيت المتطلبات يدوياً"
    fi
    
    print_success "تم تحديث النظام"
}

# تثبيت Node.js
install_nodejs() {
    print_status "📦 تثبيت Node.js..."
    
    if ! command -v node &> /dev/null; then
        # تثبيت Node.js 18.x
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
        
        print_success "تم تثبيت Node.js $(node --version)"
    else
        print_success "Node.js مثبت بالفعل: $(node --version)"
    fi
}

# تثبيت Docker
install_docker() {
    print_status "🐳 تثبيت Docker..."
    
    if ! command -v docker &> /dev/null; then
        # إزالة الإصدارات القديمة
        sudo apt-get remove -y docker docker-engine docker.io containerd runc
        
        # تثبيت Docker
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        
        # إضافة المستخدم إلى مجموعة docker
        sudo usermod -aG docker $USER
        
        # تثبيت Docker Compose
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        
        print_success "تم تثبيت Docker $(docker --version)"
    else
        print_success "Docker مثبت بالفعل: $(docker --version)"
    fi
}

# تثبيت Firebase CLI
install_firebase_cli() {
    print_status "🔥 تثبيت Firebase CLI..."
    
    if ! command -v firebase &> /dev/null; then
        npm install -g firebase-tools
        print_success "تم تثبيت Firebase CLI"
    else
        print_success "Firebase CLI مثبت بالفعل: $(firebase --version)"
    fi
}

# إعداد Nginx
setup_nginx() {
    print_status "⚙️ إعداد Nginx..."
    
    # إنشاء مجلد التكوين
    sudo mkdir -p /etc/nginx/sites-available
    sudo mkdir -p /etc/nginx/sites-enabled
    
    # نسخ إعدادات AuraOS
    if [ -f "nginx.conf" ]; then
        sudo cp nginx.conf /etc/nginx/sites-available/auraos
        sudo ln -sf /etc/nginx/sites-available/auraos /etc/nginx/sites-enabled/
        
        # حذف الإعداد الافتراضي
        sudo rm -f /etc/nginx/sites-enabled/default
        
        # اختبار التكوين
        sudo nginx -t
        
        # إعادة تشغيل Nginx
        sudo systemctl restart nginx
        sudo systemctl enable nginx
        
        print_success "تم إعداد Nginx"
    else
        print_warning "ملف nginx.conf غير موجود"
    fi
}

# إعداد SSL
setup_ssl() {
    print_status "🔒 إعداد SSL..."
    
    read -p "أدخل اسم النطاق (مثال: yourdomain.com): " DOMAIN
    
    if [ ! -z "$DOMAIN" ]; then
        # إعداد شهادة SSL
        sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email admin@"$DOMAIN"
        
        # إعداد التجديد التلقائي
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
        
        print_success "تم إعداد SSL للنطاق: $DOMAIN"
    else
        print_warning "تم تخطي إعداد SSL"
    fi
}

# إعداد Firewall
setup_firewall() {
    print_status "🛡️ إعداد Firewall..."
    
    if command -v ufw &> /dev/null; then
        # إعداد UFW
        sudo ufw default deny incoming
        sudo ufw default allow outgoing
        sudo ufw allow ssh
        sudo ufw allow 80/tcp
        sudo ufw allow 443/tcp
        sudo ufw --force enable
        
        print_success "تم إعداد Firewall"
    else
        print_warning "UFW غير مثبت، يرجى إعداد Firewall يدوياً"
    fi
}

# إعداد مراقبة النظام
setup_monitoring() {
    print_status "📊 إعداد مراقبة النظام..."
    
    # تثبيت htop للمراقبة
    sudo apt-get install -y htop iotop
    
    # إنشاء سكريبت مراقبة
    cat > monitor.sh << 'EOF'
#!/bin/bash
# AuraOS System Monitor

echo "=== AuraOS System Status ==="
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo ""

echo "=== CPU Usage ==="
top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print "CPU Usage: " 100 - $1 "%"}'
echo ""

echo "=== Memory Usage =="
free -h
echo ""

echo "=== Disk Usage ==="
df -h /
echo ""

echo "=== Docker Containers ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "=== Nginx Status ==="
sudo systemctl status nginx --no-pager -l
echo ""

echo "=== AuraOS Services ==="
if [ -f "docker-compose.production.yml" ]; then
    docker-compose -f docker-compose.production.yml ps
fi
EOF
    
    chmod +x monitor.sh
    
    print_success "تم إنشاء سكريبت المراقبة: monitor.sh"
}

# إعداد النسخ الاحتياطية التلقائية
setup_backups() {
    print_status "💾 إعداد النسخ الاحتياطية التلقائية..."
    
    # إنشاء مجلد النسخ الاحتياطية
    sudo mkdir -p /var/backups/auraos
    sudo chown $USER:$USER /var/backups/auraos
    
    # إنشاء سكريبت النسخ الاحتياطي اليومي
    cat > daily-backup.sh << 'EOF'
#!/bin/bash
# AuraOS Daily Backup Script

BACKUP_DIR="/var/backups/auraos"
DATE=$(date +%Y%m%d)

# إنشاء مجلد اليوم
mkdir -p "$BACKUP_DIR/$DATE"

# نسخ احتياطي للملفات
tar -czf "$BACKUP_DIR/$DATE/files.tar.gz" \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='backups' \
    /var/www/auraos/

# نسخ احتياطي لقاعدة البيانات (إذا كانت تعمل)
if docker ps | grep -q postgres; then
    docker exec auraos-postgres pg_dump -U postgres auraos_production > "$BACKUP_DIR/$DATE/database.sql"
fi

# حذف النسخ الاحتياطية القديمة (أكثر من 7 أيام)
find "$BACKUP_DIR" -type d -mtime +7 -exec rm -rf {} \;

echo "Backup completed: $DATE"
EOF
    
    chmod +x daily-backup.sh
    
    # إضافة إلى crontab
    (crontab -l 2>/dev/null; echo "0 2 * * * $(pwd)/daily-backup.sh") | crontab -
    
    print_success "تم إعداد النسخ الاحتياطية التلقائية"
}

# إنشاء مجلد المشروع
create_project_directory() {
    print_status "📁 إنشاء مجلد المشروع..."
    
    sudo mkdir -p /var/www/auraos
    sudo chown $USER:$USER /var/www/auraos
    
    print_success "تم إنشاء مجلد المشروع: /var/www/auraos"
}

# الدالة الرئيسية
main() {
    print_status "🚀 بدء إعداد خادم AuraOS..."
    
    # التحقق من صلاحيات sudo
    if ! sudo -n true 2>/dev/null; then
        print_error "يجب أن يكون لديك صلاحيات sudo"
        exit 1
    fi
    
    # تحديث النظام
    update_system
    
    # تثبيت المتطلبات
    install_nodejs
    install_docker
    install_firebase_cli
    
    # إنشاء مجلد المشروع
    create_project_directory
    
    # إعداد الخدمات
    setup_nginx
    setup_firewall
    setup_monitoring
    setup_backups
    
    # إعداد SSL (اختياري)
    read -p "هل تريد إعداد SSL؟ (y/n): " setup_ssl_choice
    if [ "$setup_ssl_choice" = "y" ] || [ "$setup_ssl_choice" = "Y" ]; then
        setup_ssl
    fi
    
    print_success "🎉 تم إعداد الخادم بنجاح!"
    print_status "📋 الخطوات التالية:"
    print_status "1. انسخ ملفات المشروع إلى /var/www/auraos"
    print_status "2. عدّل ملف production.env"
    print_status "3. شغّل: ./scripts/deploy.sh docker"
    print_status "4. تحقق من الحالة: ./monitor.sh"
}

# تشغيل الدالة الرئيسية
main "$@"
