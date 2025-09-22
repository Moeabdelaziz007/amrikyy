#!/bin/bash

# 🚀 سكريبت الإعداد التلقائي - Red Hat Stack مع AuraOS
# Automated Setup Script for Red Hat Enterprise Linux + OpenShift + AI Inference Server

set -e

# ألوان للإخراج
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# رموز تعبيرية
ROCKET="🚀"
CHECK="✅"
CROSS="❌"
WARNING="⚠️"
INFO="ℹ️"
GEAR="⚙️"
BRAIN="🧠"
CONTAINER="🐳"
LINUX="🐧"

echo -e "${PURPLE}${ROCKET} بدء الإعداد التلقائي لـ Red Hat Stack${NC}"
echo -e "${CYAN}================================================${NC}"
echo -e "${BLUE}${LINUX} Red Hat Enterprise Linux${NC}"
echo -e "${BLUE}${CONTAINER} Red Hat OpenShift Container Platform${NC}"
echo -e "${BLUE}${BRAIN} Red Hat AI Inference Server${NC}"

# متغيرات التكوين
RHEL_VERSION="9"
NODE_VERSION="18"
PYTHON_VERSION="3.11"
OPENSHIFT_VERSION="4.15"

# التحقق من صلاحيات sudo
if ! sudo -n true 2>/dev/null; then
    echo -e "${RED}${CROSS} هذا السكريبت يحتاج صلاحيات sudo${NC}"
    echo -e "${YELLOW}${WARNING} يرجى تشغيل: sudo ./setup-redhat-stack.sh${NC}"
    exit 1
fi

# دالة للتحقق من نجاح العملية
check_success() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}${CHECK} $1${NC}"
        return 0
    else
        echo -e "${RED}${CROSS} فشل في: $1${NC}"
        return 1
    fi
}

# دالة لتثبيت الحزم
install_package() {
    local package=$1
    echo -e "${BLUE}${GEAR} تثبيت $package...${NC}"
    sudo dnf install -y "$package" > /dev/null 2>&1
    check_success "تثبيت $package"
}

# دالة لتحميل وتثبيت ملف
download_and_install() {
    local url=$1
    local filename=$2
    local install_path=$3
    
    echo -e "${BLUE}${GEAR} تحميل $filename...${NC}"
    wget -q "$url" -O "/tmp/$filename"
    check_success "تحميل $filename"
    
    echo -e "${BLUE}${GEAR} تثبيت $filename...${NC}"
    sudo mv "/tmp/$filename" "$install_path"
    sudo chmod +x "$install_path"
    check_success "تثبيت $filename"
}

echo -e "\n${PURPLE}${LINUX} المرحلة 1: إعداد Red Hat Enterprise Linux${NC}"
echo -e "${CYAN}===============================================${NC}"

# تحديث النظام
echo -e "${BLUE}${GEAR} تحديث النظام...${NC}"
sudo dnf update -y > /dev/null 2>&1
check_success "تحديث النظام"

# تثبيت الأدوات الأساسية
echo -e "${BLUE}${GEAR} تثبيت الأدوات الأساسية...${NC}"
install_package "git"
install_package "curl"
install_package "wget"
install_package "vim"
install_package "unzip"

# تثبيت Node.js
echo -e "${BLUE}${GEAR} تثبيت Node.js $NODE_VERSION...${NC}"
curl -fsSL https://rpm.nodesource.com/setup_${NODE_VERSION}.x | sudo bash - > /dev/null 2>&1
install_package "nodejs"
install_package "npm"

# تثبيت Python
echo -e "${BLUE}${GEAR} تثبيت Python $PYTHON_VERSION...${NC}"
install_package "python3.11"
install_package "python3.11-pip"

# تثبيت Docker
echo -e "${BLUE}${GEAR} تثبيت Docker...${NC}"
install_package "docker"
sudo systemctl enable docker > /dev/null 2>&1
sudo systemctl start docker > /dev/null 2>&1
sudo usermod -aG docker "$USER" > /dev/null 2>&1
check_success "تثبيت Docker"

# تثبيت Docker Compose
echo -e "${BLUE}${GEAR} تثبيت Docker Compose...${NC}"
download_and_install \
    "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
    "docker-compose" \
    "/usr/local/bin/docker-compose"

echo -e "\n${PURPLE}${CONTAINER} المرحلة 2: إعداد Red Hat OpenShift Container Platform${NC}"
echo -e "${CYAN}=======================================================${NC}"

# تثبيت OpenShift CLI
echo -e "${BLUE}${GEAR} تثبيت OpenShift CLI...${NC}"
download_and_install \
    "https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/openshift-client-linux.tar.gz" \
    "openshift-client.tar.gz" \
    "/tmp/openshift-client.tar.gz"

cd /tmp
tar -xzf openshift-client.tar.gz > /dev/null 2>&1
sudo mv oc kubectl /usr/local/bin/ > /dev/null 2>&1
cd - > /dev/null
check_success "تثبيت OpenShift CLI"

# تثبيت OpenShift Local (CRC)
echo -e "${BLUE}${GEAR} تثبيت OpenShift Local...${NC}"
download_and_install \
    "https://developers.redhat.com/content-gateway/file/pub/openshift-v4/clients/crc/latest/crc-linux-installer.tar.xz" \
    "crc-installer.tar.xz" \
    "/tmp/crc-installer.tar.xz"

cd /tmp
tar -xf crc-installer.tar.xz > /dev/null 2>&1
sudo mv crc-linux-*/crc /usr/local/bin/ > /dev/null 2>&1
cd - > /dev/null
check_success "تثبيت OpenShift Local"

echo -e "\n${PURPLE}${BRAIN} المرحلة 3: إعداد Red Hat AI Inference Server${NC}"
echo -e "${CYAN}===============================================${NC}"

# إنشاء مجلد للنماذج الذكية
echo -e "${BLUE}${GEAR} إنشاء مجلد النماذج الذكية...${NC}"
sudo mkdir -p /opt/ai-models/auraos
sudo chown "$USER:$USER" /opt/ai-models/auraos
check_success "إنشاء مجلد النماذج"

# تكوين AI Inference Server
echo -e "${BLUE}${GEAR} تكوين AI Inference Server...${NC}"
cat > /opt/ai-models/auraos/config.yaml << 'EOF'
models:
  - name: auraos-agent
    path: /opt/ai-models/auraos/agent
    type: custom
    framework: python
    description: "AuraOS AI Agent Model"
  - name: learning-brain
    path: /opt/ai-models/auraos/brain
    type: custom
    framework: python
    description: "AuraOS Learning Brain Model"
EOF
check_success "تكوين AI Inference Server"

echo -e "\n${PURPLE}${ROCKET} المرحلة 4: إعداد مشروع AuraOS${NC}"
echo -e "${CYAN}=====================================${NC}"

# إنشاء مجلدات Kubernetes
echo -e "${BLUE}${GEAR} إنشاء مجلدات Kubernetes...${NC}"
mkdir -p k8s-manifests
mkdir -p monitoring
mkdir -p logs
check_success "إنشاء المجلدات"

# إنشاء ملفات Kubernetes
echo -e "${BLUE}${GEAR} إنشاء ملفات Kubernetes...${NC}"

# Frontend Deployment
cat > k8s-manifests/frontend-deployment.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auraos-frontend
  labels:
    app: auraos-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: auraos-frontend
  template:
    metadata:
      labels:
        app: auraos-frontend
    spec:
      containers:
      - name: frontend
        image: nginx:alpine
        ports:
        - containerPort: 80
        volumeMounts:
        - name: frontend-files
          mountPath: /usr/share/nginx/html
      volumes:
      - name: frontend-files
        configMap:
          name: auraos-frontend-files
---
apiVersion: v1
kind: Service
metadata:
  name: auraos-frontend-service
spec:
  selector:
    app: auraos-frontend
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
EOF

# Backend Deployment
cat > k8s-manifests/backend-deployment.yaml << 'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auraos-backend
  labels:
    app: auraos-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: auraos-backend
  template:
    metadata:
      labels:
        app: auraos-backend
    spec:
      containers:
      - name: backend
        image: node:18-alpine
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          value: "postgresql://postgres:auraos123@postgres-service:5432/auraos_automation"
        - name: REDIS_URL
          value: "redis://:redis123@redis-service:6379"
        volumeMounts:
        - name: backend-code
          mountPath: /app
        command: ["node", "/app/server/index.js"]
      volumes:
      - name: backend-code
        configMap:
          name: auraos-backend-code
---
apiVersion: v1
kind: Service
metadata:
  name: auraos-backend-service
spec:
  selector:
    app: auraos-backend
  ports:
  - port: 3001
    targetPort: 3001
  type: ClusterIP
EOF

check_success "إنشاء ملفات Kubernetes"

echo -e "\n${PURPLE}${GEAR} المرحلة 5: اختبار التكامل${NC}"
echo -e "${CYAN}===============================${NC}"

# اختبار الأدوات المثبتة
echo -e "${BLUE}${INFO} اختبار الأدوات المثبتة...${NC}"

# اختبار Node.js
if node --version > /dev/null 2>&1; then
    echo -e "${GREEN}${CHECK} Node.js: $(node --version)${NC}"
else
    echo -e "${RED}${CROSS} Node.js غير مثبت بشكل صحيح${NC}"
fi

# اختبار Python
if python3 --version > /dev/null 2>&1; then
    echo -e "${GREEN}${CHECK} Python: $(python3 --version)${NC}"
else
    echo -e "${RED}${CROSS} Python غير مثبت بشكل صحيح${NC}"
fi

# اختبار Docker
if docker --version > /dev/null 2>&1; then
    echo -e "${GREEN}${CHECK} Docker: $(docker --version | cut -d' ' -f3 | cut -d',' -f1)${NC}"
else
    echo -e "${RED}${CROSS} Docker غير مثبت بشكل صحيح${NC}"
fi

# اختبار OpenShift CLI
if oc version --client > /dev/null 2>&1; then
    echo -e "${GREEN}${CHECK} OpenShift CLI مثبت${NC}"
else
    echo -e "${RED}${CROSS} OpenShift CLI غير مثبت بشكل صحيح${NC}"
fi

# اختبار CRC
if crc version > /dev/null 2>&1; then
    echo -e "${GREEN}${CHECK} OpenShift Local (CRC) مثبت${NC}"
else
    echo -e "${RED}${CROSS} OpenShift Local غير مثبت بشكل صحيح${NC}"
fi

echo -e "\n${PURPLE}${ROCKET} المرحلة 6: إنشاء سكريبتات التشغيل${NC}"
echo -e "${CYAN}=======================================${NC}"

# إنشاء سكريبت تشغيل OpenShift
cat > start-openshift.sh << 'EOF'
#!/bin/bash
echo "🚀 بدء OpenShift Local..."
crc start
echo "✅ تم بدء OpenShift Local بنجاح"
echo "🌐 الوصول: https://console-openshift-console.apps-crc.testing"
EOF
chmod +x start-openshift.sh

# إنشاء سكريبت نشر AuraOS
cat > deploy-auraos.sh << 'EOF'
#!/bin/bash
echo "🚀 نشر مشروع AuraOS..."
oc new-project auraos-dev
oc apply -f k8s-manifests/
echo "✅ تم نشر AuraOS بنجاح"
EOF
chmod +x deploy-auraos.sh

# إنشاء سكريبت مراقبة النظام
cat > monitor-system.sh << 'EOF'
#!/bin/bash
echo "📊 مراقبة النظام..."
echo "=== حالة الخدمات ==="
systemctl status docker
echo ""
echo "=== استخدام الموارد ==="
free -h
df -h
echo ""
echo "=== حالة OpenShift ==="
oc get pods -A
EOF
chmod +x monitor-system.sh

check_success "إنشاء سكريبتات التشغيل"

echo -e "\n${PURPLE}${ROCKET} تم الإعداد بنجاح!${NC}"
echo -e "${CYAN}================================================${NC}"

echo -e "\n${GREEN}${CHECK} الخطوات التالية:${NC}"
echo -e "${BLUE}1.${NC} أعد تشغيل النظام أو سجل الخروج والدخول مرة أخرى"
echo -e "${BLUE}2.${NC} شغل: ${YELLOW}./start-openshift.sh${NC}"
echo -e "${BLUE}3.${NC} شغل: ${YELLOW}./deploy-auraos.sh${NC}"
echo -e "${BLUE}4.${NC} راقب النظام: ${YELLOW}./monitor-system.sh${NC}"

echo -e "\n${PURPLE}${INFO} معلومات مهمة:${NC}"
echo -e "${BLUE}• OpenShift Console:${NC} https://console-openshift-console.apps-crc.testing"
echo -e "${BLUE}• AuraOS Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}• AuraOS Backend:${NC} http://localhost:3001"
echo -e "${BLUE}• AI Models:${NC} /opt/ai-models/auraos/"

echo -e "\n${GREEN}🎉 مبروك! تم إعداد Red Hat Stack بالكامل${NC}"
echo -e "${CYAN}================================================${NC}"
