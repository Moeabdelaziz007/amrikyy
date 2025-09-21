#!/bin/bash

# 🚀 سكريبت تطبيق مساحة العمل OpenShift Dev Spaces
# AuraOS Workspace Application Script

set -e

# ألوان للإخراج
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# رموز تعبيرية
ROCKET="🚀"
CHECK="✅"
CROSS="❌"
WARNING="⚠️"
INFO="ℹ️"
GEAR="⚙️"

echo -e "${PURPLE}${ROCKET} بدء تطبيق مساحة العمل OpenShift Dev Spaces${NC}"
echo -e "${CYAN}================================================${NC}"

# التحقق من المتطلبات
echo -e "\n${BLUE}${INFO} التحقق من المتطلبات...${NC}"

# التحقق من وجود Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}${CROSS} Git غير مثبت. يرجى تثبيت Git أولاً${NC}"
    exit 1
fi
echo -e "${GREEN}${CHECK} Git متوفر${NC}"

# التحقق من وجود Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}${WARNING} Docker غير مثبت. سيتم تخطي اختبارات Docker${NC}"
    DOCKER_AVAILABLE=false
else
    echo -e "${GREEN}${CHECK} Docker متوفر${NC}"
    DOCKER_AVAILABLE=true
fi

# التحقق من وجود Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}${WARNING} Node.js غير مثبت. سيتم تخطي اختبارات Node.js${NC}"
    NODE_AVAILABLE=false
else
    echo -e "${GREEN}${CHECK} Node.js متوفر ($(node --version))${NC}"
    NODE_AVAILABLE=true
fi

# التحقق من وجود Python
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo -e "${YELLOW}${WARNING} Python غير مثبت. سيتم تخطي اختبارات Python${NC}"
    PYTHON_AVAILABLE=false
else
    PYTHON_CMD=$(command -v python3 || command -v python)
    echo -e "${GREEN}${CHECK} Python متوفر ($($PYTHON_CMD --version))${NC}"
    PYTHON_AVAILABLE=true
fi

# إنشاء مجلدات العمل
echo -e "\n${BLUE}${GEAR} إنشاء مجلدات العمل...${NC}"
mkdir -p .devcontainer
mkdir -p .vscode
mkdir -p logs
mkdir -p uploads
echo -e "${GREEN}${CHECK} تم إنشاء المجلدات${NC}"

# التحقق من ملفات التكوين
echo -e "\n${BLUE}${INFO} التحقق من ملفات التكوين...${NC}"

required_files=(
    "devfile.yaml"
    ".devcontainer/devcontainer.json"
    "docker-compose.yml"
    "requirements.txt"
    ".vscode/tasks.json"
)

for file in "${required_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo -e "${GREEN}${CHECK} $file موجود${NC}"
    else
        echo -e "${RED}${CROSS} $file مفقود${NC}"
        exit 1
    fi
done

# التحقق من صحة devfile.yaml
echo -e "\n${BLUE}${GEAR} التحقق من صحة devfile.yaml...${NC}"
if command -v yq &> /dev/null; then
    if yq eval '.' devfile.yaml > /dev/null 2>&1; then
        echo -e "${GREEN}${CHECK} devfile.yaml صحيح${NC}"
    else
        echo -e "${RED}${CROSS} خطأ في تنسيق devfile.yaml${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}${WARNING} yq غير متوفر، سيتم تخطي فحص YAML${NC}"
fi

# تثبيت المتطلبات إذا كانت متوفرة محلياً
if [[ "$NODE_AVAILABLE" == true ]]; then
    echo -e "\n${BLUE}${GEAR} تثبيت متطلبات Node.js...${NC}"
    if [[ -f "package.json" ]]; then
        npm install --silent
        echo -e "${GREEN}${CHECK} تم تثبيت متطلبات Node.js${NC}"
    else
        echo -e "${YELLOW}${WARNING} package.json غير موجود${NC}"
    fi
fi

if [[ "$PYTHON_AVAILABLE" == true ]]; then
    echo -e "\n${BLUE}${GEAR} تثبيت متطلبات Python...${NC}"
    if [[ -f "requirements.txt" ]]; then
        $PYTHON_CMD -m pip install -r requirements.txt --quiet --user
        echo -e "${GREEN}${CHECK} تم تثبيت متطلبات Python${NC}"
    else
        echo -e "${YELLOW}${WARNING} requirements.txt غير موجود${NC}"
    fi
fi

# اختبار الخدمات إذا كان Docker متوفراً
if [[ "$DOCKER_AVAILABLE" == true ]]; then
    echo -e "\n${BLUE}${GEAR} اختبار الخدمات...${NC}"
    
    # تشغيل Docker Compose في الخلفية
    if docker-compose up -d --quiet-pull 2>/dev/null; then
        echo -e "${GREEN}${CHECK} تم تشغيل الخدمات بنجاح${NC}"
        
        # انتظار بدء الخدمات
        echo -e "${BLUE}${INFO} انتظار بدء الخدمات...${NC}"
        sleep 10
        
        # اختبار PostgreSQL
        echo -e "${BLUE}${INFO} اختبار PostgreSQL...${NC}"
        if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
            echo -e "${GREEN}${CHECK} PostgreSQL يعمل بشكل صحيح${NC}"
        else
            echo -e "${YELLOW}${WARNING} PostgreSQL قد يحتاج وقت أكثر للبدء${NC}"
        fi
        
        # اختبار Redis
        echo -e "${BLUE}${INFO} اختبار Redis...${NC}"
        if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
            echo -e "${GREEN}${CHECK} Redis يعمل بشكل صحيح${NC}"
        else
            echo -e "${YELLOW}${WARNING} Redis قد يحتاج وقت أكثر للبدء${NC}"
        fi
        
        # إيقاف الخدمات
        docker-compose down --quiet
        echo -e "${GREEN}${CHECK} تم إيقاف الخدمات بنجاح${NC}"
    else
        echo -e "${YELLOW}${WARNING} لا يمكن تشغيل Docker Compose محلياً${NC}"
    fi
fi

# إنشاء ملف معلومات المساحة
echo -e "\n${BLUE}${GEAR} إنشاء معلومات المساحة...${NC}"
cat > workspace-info.json << EOF
{
  "name": "auraos-workspace",
  "version": "1.0.0",
  "created": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "devfile": "devfile.yaml",
  "services": {
    "frontend": {
      "port": 3000,
      "url": "http://localhost:3000"
    },
    "backend": {
      "port": 3001,
      "url": "http://localhost:3001"
    },
    "postgres": {
      "port": 5432,
      "database": "auraos_automation"
    },
    "redis": {
      "port": 6379
    }
  },
  "tools": {
    "nodejs": "18",
    "python": "3.11",
    "postgres": "15",
    "redis": "7"
  }
}
EOF
echo -e "${GREEN}${CHECK} تم إنشاء workspace-info.json${NC}"

# Git operations
echo -e "\n${BLUE}${GEAR} إعداد Git...${NC}"

# التأكد من وجود .gitignore
if [[ ! -f ".gitignore" ]]; then
    echo -e "${BLUE}${INFO} إنشاء .gitignore...${NC}"
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.venv/

# IDE
.vscode/settings.json
.idea/
*.swp
*.swo

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Database
*.sqlite
*.db

# Uploads
uploads/
temp/

# Docker
.dockerignore
EOF
    echo -e "${GREEN}${CHECK} تم إنشاء .gitignore${NC}"
fi

# إضافة الملفات إلى Git
git add .
echo -e "${GREEN}${CHECK} تم إضافة الملفات إلى Git${NC}"

# إظهار حالة Git
echo -e "\n${BLUE}${INFO} حالة Git:${NC}"
git status --short

echo -e "\n${PURPLE}${ROCKET} تم تطبيق مساحة العمل بنجاح!${NC}"
echo -e "${CYAN}================================================${NC}"

echo -e "\n${GREEN}${CHECK} الخطوات التالية:${NC}"
echo -e "${BLUE}1.${NC} قم بتنفيذ: ${YELLOW}git commit -m \"إضافة دعم OpenShift Dev Spaces\"${NC}"
echo -e "${BLUE}2.${NC} قم بتنفيذ: ${YELLOW}git push origin main${NC}"
echo -e "${BLUE}3.${NC} انتقل إلى: ${CYAN}https://workspaces.openshift.com/${NC}"
echo -e "${BLUE}4.${NC} أنشئ مساحة عمل جديدة باستخدام رابط مستودعك"
echo -e "${BLUE}5.${NC} ابدأ التطوير! ${ROCKET}"

echo -e "\n${PURPLE}${INFO} معلومات مهمة:${NC}"
echo -e "${BLUE}• المنافذ:${NC} 3000 (Frontend), 3001 (Backend), 5432 (PostgreSQL), 6379 (Redis)"
echo -e "${BLUE}• الأوامر:${NC} Ctrl+Shift+P ثم ابحث عن المهام باللغة العربية"
echo -e "${BLUE}• الدعم:${NC} راجع ملف OPENSHIFT_DEV_SPACES_SETUP.md"

echo -e "\n${GREEN}🎉 مبروك! مساحة العمل جاهزة للاستخدام${NC}"
