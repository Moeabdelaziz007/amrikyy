# 🚀 دليل الإعداد الشامل - Red Hat Stack مع AuraOS

## 📋 نظرة عامة
هذا الدليل يساعدك في إعداد التركيبة الثلاثية:
- **Red Hat Enterprise Linux** (النظام الأساسي)
- **Red Hat OpenShift Container Platform** (إدارة الحاويات)
- **Red Hat AI Inference Server** (تحسين الذكاء الاصطناعي)

## 🎯 الهدف النهائي
تشغيل مشروع AuraOS بكفاءة وأمان عالي مع دعم متقدم للذكاء الاصطناعي.

---

## 📋 المرحلة 1: إعداد Red Hat Enterprise Linux

### 1.1 الحصول على النسخة التجريبية
```bash
# انتقل إلى: https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux/trial
# سجل للحصول على نسخة تجريبية مجانية لمدة 60 يوم
```

### 1.2 تثبيت النظام
```bash
# تحميل ISO من Red Hat
# تثبيت على VMware/VirtualBox أو جهاز مخصص

# بعد التثبيت، تحديث النظام
sudo dnf update -y
sudo dnf install -y git curl wget vim
```

### 1.3 إعداد البيئة الأساسية
```bash
# تثبيت Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

# تثبيت Python 3.11
sudo dnf install -y python3.11 python3.11-pip

# تثبيت Docker
sudo dnf install -y docker
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER

# تثبيت Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 1.4 التحقق من التثبيت
```bash
# اختبار جميع الأدوات
node --version    # يجب أن يظهر v18.x.x
python3 --version # يجب أن يظهر Python 3.11.x
docker --version   # يجب أن يظهر Docker version
docker-compose --version
```

---

## 📋 المرحلة 2: إعداد Red Hat OpenShift Container Platform

### 2.1 الحصول على النسخة التجريبية
```bash
# انتقل إلى: https://www.redhat.com/en/technologies/cloud-computing/openshift/trial
# سجل للحصول على نسخة تجريبية مجانية
```

### 2.2 تثبيت OpenShift CLI
```bash
# تحميل oc CLI
wget https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/openshift-client-linux.tar.gz
tar -xzf openshift-client-linux.tar.gz
sudo mv oc kubectl /usr/local/bin/

# التحقق من التثبيت
oc version
kubectl version --client
```

### 2.3 إعداد OpenShift Local (للتطوير)
```bash
# تثبيت OpenShift Local
wget https://developers.redhat.com/content-gateway/file/pub/openshift-v4/clients/crc/latest/crc-linux-installer.tar.xz
tar -xf crc-linux-installer.tar.xz
cd crc-linux-*
sudo mv crc /usr/local/bin/

# إعداد OpenShift Local
crc setup
crc start
```

### 2.4 تكوين مشروع AuraOS
```bash
# إنشاء مشروع جديد
oc new-project auraos-dev

# إنشاء ConfigMap للمتغيرات
oc create configmap auraos-config \
  --from-literal=DB_PASSWORD=auraos123 \
  --from-literal=REDIS_PASSWORD=redis123 \
  --from-literal=JWT_SECRET=your-super-secret-jwt-key

# إنشاء Secret للبيانات الحساسة
oc create secret generic auraos-secrets \
  --from-literal=postgres-password=auraos123 \
  --from-literal=redis-password=redis123
```

---

## 📋 المرحلة 3: إعداد Red Hat AI Inference Server

### 3.1 الحصول على النسخة التجريبية
```bash
# انتقل إلى: https://www.redhat.com/en/technologies/artificial-intelligence/inference-server/trial
# سجل للحصول على نسخة تجريبية
```

### 3.2 تثبيت AI Inference Server
```bash
# تحميل وتثبيت AI Inference Server
sudo dnf install -y redhat-ai-inference-server

# إعداد الخدمة
sudo systemctl enable ai-inference-server
sudo systemctl start ai-inference-server
```

### 3.3 تكوين النماذج الذكية
```bash
# إنشاء مجلد للنماذج
sudo mkdir -p /opt/ai-models/auraos
sudo chown $USER:$USER /opt/ai-models/auraos

# تكوين النماذج المخصصة لمشروع AuraOS
cat > /opt/ai-models/auraos/config.yaml << 'EOF'
models:
  - name: auraos-agent
    path: /opt/ai-models/auraos/agent
    type: custom
    framework: python
  - name: learning-brain
    path: /opt/ai-models/auraos/brain
    type: custom
    framework: python
EOF
```

---

## 📋 المرحلة 4: نشر مشروع AuraOS

### 4.1 إعداد ملفات Kubernetes
```bash
# إنشاء مجلد Kubernetes
mkdir -p k8s-manifests

# إنشاء Deployment للواجهة الأمامية
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

# إنشاء Deployment للخادم الخلفي
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
```

### 4.2 نشر الخدمات
```bash
# نشر جميع الخدمات
oc apply -f k8s-manifests/

# التحقق من حالة النشر
oc get pods
oc get services
oc get deployments
```

---

## 📋 المرحلة 5: اختبار التكامل

### 5.1 اختبار الخدمات الأساسية
```bash
# اختبار الواجهة الأمامية
curl http://localhost:3000

# اختبار الخادم الخلفي
curl http://localhost:3001/health

# اختبار قاعدة البيانات
oc exec -it postgres-pod -- psql -U postgres -d auraos_automation -c "SELECT version();"

# اختبار Redis
oc exec -it redis-pod -- redis-cli ping
```

### 5.2 اختبار الذكاء الاصطناعي
```bash
# اختبار AI Inference Server
curl http://localhost:8080/health

# اختبار النماذج المخصصة
curl -X POST http://localhost:8080/predict \
  -H "Content-Type: application/json" \
  -d '{"model": "auraos-agent", "input": "test"}'
```

---

## 🔧 أدوات المراقبة والصيانة

### مراقبة الأداء
```bash
# مراقبة الموارد
oc top nodes
oc top pods

# مراقبة الخدمات
oc logs -f deployment/auraos-frontend
oc logs -f deployment/auraos-backend
```

### النسخ الاحتياطي
```bash
# نسخ احتياطي لقاعدة البيانات
oc exec -it postgres-pod -- pg_dump -U postgres auraos_automation > backup.sql

# نسخ احتياطي للتكوين
oc get configmap auraos-config -o yaml > config-backup.yaml
```

---

## 🆘 استكشاف الأخطاء

### مشاكل شائعة وحلولها
```bash
# مشكلة: Pod لا يبدأ
oc describe pod <pod-name>
oc logs <pod-name>

# مشكلة: خدمة لا تستجيب
oc get endpoints
oc describe service <service-name>

# مشكلة: AI Inference Server
sudo systemctl status ai-inference-server
sudo journalctl -u ai-inference-server
```

---

## 📊 مؤشرات الأداء

### مقاييس النجاح
- ✅ جميع الخدمات تعمل بنجاح
- ✅ استجابة سريعة (< 2 ثانية)
- ✅ استهلاك موارد معقول
- ✅ أمان البيانات محقق
- ✅ النسخ الاحتياطي يعمل

---

## 🎯 الخطوات التالية

1. **مراقبة الأداء** لمدة أسبوع
2. **تحسين التكوين** حسب الاستخدام
3. **إضافة خدمات جديدة** حسب الحاجة
4. **تطوير المزيد من النماذج الذكية**

---

**🎉 مبروك! تم إعداد البنية التحتية الكاملة بنجاح**
