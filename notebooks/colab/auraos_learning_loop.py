# AuraOS Learning Loop Training - Google Colab Setup
# إعداد Google Colab للتعلم الآلي وتدريب الحلقات

"""
🚀 إعداد Google Colab للتعلم الآلي وتدريب الحلقات

هذا الملف يحتوي على إعداد شامل لتدريب نماذج التعلم الآلي في AuraOS
باستخدام Google Colab مع ميزات متقدمة للتعلم الذكي.

الميزات:
- تدريب نماذج BERT/Transformer
- حلقة تعلم ذكية مع Early Stopping
- مراقبة الأداء مع Weights & Biases
- تحليل شامل للنتائج
- تحسين الأداء مع GPU
"""

# =============================================================================
# 📋 المتطلبات الأساسية
# =============================================================================

def install_requirements():
    """تثبيت المكتبات المطلوبة"""
    import subprocess
    import sys
    
    packages = [
        "torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118",
        "transformers datasets accelerate",
        "wandb tensorboard",
        "scikit-learn pandas numpy matplotlib seaborn",
        "jupyter ipywidgets"
    ]
    
    for package in packages:
        subprocess.check_call([sys.executable, "-m", "pip", "install"] + package.split())

# =============================================================================
# 🔧 إعداد البيئة
# =============================================================================

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import warnings
warnings.filterwarnings('ignore')

def setup_environment():
    """إعداد البيئة الأساسية"""
    # إعداد الجهاز
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # إعداد Weights & Biases للتعقب
    try:
        import wandb
        wandb.init(project="auraos-learning-loop", entity="your-username")
        print("✅ Weights & Biases initialized")
    except:
        print("⚠️ Weights & Biases not available")
    
    return device

# =============================================================================
# 📊 فئة مجموعة البيانات المخصصة
# =============================================================================

class AuraOSDataset(Dataset):
    """
    مجموعة بيانات مخصصة لـ AuraOS Learning Loop
    
    الميزات:
    - دعم النصوص الطويلة
    - ترميز تلقائي مع BERT
    - معالجة متقدمة للبيانات
    """
    
    def __init__(self, data, tokenizer, max_length=512):
        self.data = data
        self.tokenizer = tokenizer
        self.max_length = max_length
    
    def __len__(self):
        return len(self.data)
    
    def __getitem__(self, idx):
        item = self.data[idx]
        
        # ترميز النص
        encoding = self.tokenizer(
            item['text'],
            truncation=True,
            padding='max_length',
            max_length=self.max_length,
            return_tensors='pt'
        )
        
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(item['label'], dtype=torch.long)
        }

# =============================================================================
# 🧠 نموذج التعلم الآلي
# =============================================================================

class AuraOSLearningModel(nn.Module):
    """
    نموذج التعلم الآلي لـ AuraOS
    
    الميزات:
    - بناء على BERT/Transformer
    - طبقات تصنيف مخصصة
    - دعم Dropout للتقليل من Overfitting
    """
    
    def __init__(self, model_name='bert-base-uncased', num_classes=10, dropout=0.3):
        super(AuraOSLearningModel, self).__init__()
        
        # نموذج BERT الأساسي
        from transformers import AutoModel
        self.bert = AutoModel.from_pretrained(model_name)
        self.dropout = nn.Dropout(dropout)
        self.classifier = nn.Linear(self.bert.config.hidden_size, num_classes)
        
    def forward(self, input_ids, attention_mask):
        # تمرير البيانات عبر BERT
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        
        # استخدام [CLS] token للتصنيف
        pooled_output = outputs.pooler_output
        output = self.dropout(pooled_output)
        return self.classifier(output)

# =============================================================================
# 🔄 حلقة التعلم الذكية
# =============================================================================

class SmartLearningLoop:
    """
    حلقة التعلم الذكية لـ AuraOS
    
    الميزات:
    - Early Stopping
    - Learning Rate Scheduling
    - Gradient Clipping
    - مراقبة الأداء
    - حفظ أفضل النماذج
    """
    
    def __init__(self, model, train_loader, val_loader, device):
        self.model = model.to(device)
        self.train_loader = train_loader
        self.val_loader = val_loader
        self.device = device
        
        # محسن مع تعلم متكيف
        self.optimizer = optim.AdamW(
            self.model.parameters(),
            lr=2e-5,
            weight_decay=0.01
        )
        
        # جدولة معدل التعلم
        self.scheduler = optim.lr_scheduler.ReduceLROnPlateau(
            self.optimizer,
            mode='min',
            factor=0.5,
            patience=3,
            verbose=True
        )
        
        # دالة الخسارة
        self.criterion = nn.CrossEntropyLoss()
        
        # تتبع الأداء
        self.train_losses = []
        self.val_losses = []
        self.val_accuracies = []
        
    def train_epoch(self):
        """تدريب حقبة واحدة"""
        self.model.train()
        total_loss = 0
        
        for batch_idx, batch in enumerate(self.train_loader):
            # نقل البيانات للجهاز
            input_ids = batch['input_ids'].to(self.device)
            attention_mask = batch['attention_mask'].to(self.device)
            labels = batch['labels'].to(self.device)
            
            # إعادة تعيين التدرجات
            self.optimizer.zero_grad()
            
            # التمرير الأمامي
            outputs = self.model(input_ids, attention_mask)
            loss = self.criterion(outputs, labels)
            
            # التمرير الخلفي
            loss.backward()
            
            # قص التدرجات لمنع الانفجار
            torch.nn.utils.clip_grad_norm_(self.model.parameters(), max_norm=1.0)
            
            # تحديث المعاملات
            self.optimizer.step()
            
            total_loss += loss.item()
            
            # تسجيل في Weights & Biases
            try:
                import wandb
                wandb.log({"batch_loss": loss.item()})
            except:
                pass
            
            # طباعة التقدم
            if batch_idx % 100 == 0:
                print(f"Batch {batch_idx}/{len(self.train_loader)}, Loss: {loss.item():.4f}")
        
        return total_loss / len(self.train_loader)
    
    def validate(self):
        """التحقق من الأداء"""
        self.model.eval()
        total_loss = 0
        correct = 0
        total = 0
        
        with torch.no_grad():
            for batch in self.val_loader:
                input_ids = batch['input_ids'].to(self.device)
                attention_mask = batch['attention_mask'].to(self.device)
                labels = batch['labels'].to(self.device)
                
                outputs = self.model(input_ids, attention_mask)
                loss = self.criterion(outputs, labels)
                
                total_loss += loss.item()
                
                # حساب الدقة
                _, predicted = torch.max(outputs.data, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()
        
        accuracy = 100 * correct / total
        avg_loss = total_loss / len(self.val_loader)
        
        return avg_loss, accuracy
    
    def train(self, epochs=10, early_stopping_patience=5):
        """تدريب النموذج"""
        best_val_loss = float('inf')
        patience_counter = 0
        
        print("🚀 بدء التدريب...")
        print("=" * 60)
        
        for epoch in range(epochs):
            print(f"\n📊 Epoch {epoch+1}/{epochs}")
            print("-" * 50)
            
            # تدريب
            train_loss = self.train_epoch()
            
            # تحقق
            val_loss, val_accuracy = self.validate()
            
            # تحديث جدولة معدل التعلم
            self.scheduler.step(val_loss)
            
            # حفظ النتائج
            self.train_losses.append(train_loss)
            self.val_losses.append(val_loss)
            self.val_accuracies.append(val_accuracy)
            
            # طباعة النتائج
            print(f"📈 Train Loss: {train_loss:.4f}")
            print(f"📉 Val Loss: {val_loss:.4f}")
            print(f"🎯 Val Accuracy: {val_accuracy:.2f}%")
            print(f"📚 Learning Rate: {self.optimizer.param_groups[0]['lr']:.2e}")
            
            # تسجيل في Weights & Biases
            try:
                import wandb
                wandb.log({
                    "epoch": epoch + 1,
                    "train_loss": train_loss,
                    "val_loss": val_loss,
                    "val_accuracy": val_accuracy,
                    "learning_rate": self.optimizer.param_groups[0]['lr']
                })
            except:
                pass
            
            # Early Stopping
            if val_loss < best_val_loss:
                best_val_loss = val_loss
                patience_counter = 0
                # حفظ أفضل نموذج
                torch.save(self.model.state_dict(), 'best_model.pth')
                print("💾 تم حفظ أفضل نموذج")
            else:
                patience_counter += 1
                print(f"⏳ Early Stopping Counter: {patience_counter}/{early_stopping_patience}")
                
            if patience_counter >= early_stopping_patience:
                print(f"🛑 Early stopping at epoch {epoch+1}")
                break
        
        print("\n✅ انتهى التدريب!")
        return self.train_losses, self.val_losses, self.val_accuracies
    
    def plot_training_history(self):
        """رسم تاريخ التدريب"""
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))
        
        # رسم الخسارة
        ax1.plot(self.train_losses, label='Train Loss', color='blue', linewidth=2)
        ax1.plot(self.val_losses, label='Validation Loss', color='red', linewidth=2)
        ax1.set_title('📊 Training and Validation Loss', fontsize=14, fontweight='bold')
        ax1.set_xlabel('Epoch')
        ax1.set_ylabel('Loss')
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        
        # رسم الدقة
        ax2.plot(self.val_accuracies, label='Validation Accuracy', color='green', linewidth=2)
        ax2.set_title('🎯 Validation Accuracy', fontsize=14, fontweight='bold')
        ax2.set_xlabel('Epoch')
        ax2.set_ylabel('Accuracy (%)')
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.show()

# =============================================================================
# 📈 تحليل الأداء
# =============================================================================

def analyze_performance(model, test_loader, device):
    """تحليل شامل للأداء"""
    model.eval()
    all_predictions = []
    all_labels = []
    
    print("🔍 تحليل الأداء...")
    
    with torch.no_grad():
        for batch_idx, batch in enumerate(test_loader):
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['labels'].to(device)
            
            outputs = model(input_ids, attention_mask)
            _, predicted = torch.max(outputs, 1)
            
            all_predictions.extend(predicted.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
            
            if batch_idx % 50 == 0:
                print(f"Processed {batch_idx}/{len(test_loader)} batches")
    
    # تقرير التصنيف
    print("\n📋 Classification Report:")
    print("=" * 50)
    print(classification_report(all_labels, all_predictions))
    
    # مصفوفة الارتباك
    from sklearn.metrics import confusion_matrix
    cm = confusion_matrix(all_labels, all_predictions)
    
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=range(len(set(all_labels))),
                yticklabels=range(len(set(all_labels))))
    plt.title('🔍 Confusion Matrix', fontsize=16, fontweight='bold')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.show()
    
    return all_predictions, all_labels

# =============================================================================
# 🚀 الاستخدام الرئيسي
# =============================================================================

def main():
    """الدالة الرئيسية للتدريب"""
    
    print("🚀 AuraOS Learning Loop Training")
    print("=" * 50)
    
    # إعداد البيئة
    device = setup_environment()
    
    # إعداد Tokenizer
    from transformers import AutoTokenizer
    tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
    
    # إنشاء بيانات تجريبية (استبدل ببياناتك الحقيقية)
    sample_data = [
        {'text': 'This is a positive example', 'label': 1},
        {'text': 'This is a negative example', 'label': 0},
        # أضف المزيد من البيانات هنا
    ]
    
    # تقسيم البيانات
    train_data, val_data = train_test_split(sample_data, test_size=0.2, random_state=42)
    
    # إنشاء مجموعات البيانات
    train_dataset = AuraOSDataset(train_data, tokenizer)
    val_dataset = AuraOSDataset(val_data, tokenizer)
    
    train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=16, shuffle=False)
    
    # إنشاء النموذج
    model = AuraOSLearningModel(num_classes=2)  # تصنيف ثنائي
    
    # إنشاء حلقة التعلم
    learning_loop = SmartLearningLoop(model, train_loader, val_loader, device)
    
    # بدء التدريب
    train_losses, val_losses, val_accuracies = learning_loop.train(epochs=10)
    
    # رسم النتائج
    learning_loop.plot_training_history()
    
    # تحليل الأداء
    predictions, labels = analyze_performance(model, val_loader, device)
    
    print("\n✅ تم الانتهاء من التدريب بنجاح!")
    
    return model, learning_loop

# =============================================================================
# 🔧 وظائف مساعدة
# =============================================================================

def monitor_gpu():
    """مراقبة استخدام GPU"""
    if torch.cuda.is_available():
        print(f"GPU: {torch.cuda.get_device_name(0)}")
        print(f"Memory Allocated: {torch.cuda.memory_allocated(0) / 1024**3:.2f} GB")
        print(f"Memory Cached: {torch.cuda.memory_reserved(0) / 1024**3:.2f} GB")
    else:
        print("GPU غير متاح")

def save_model(model, path='auraos_model.pth'):
    """حفظ النموذج"""
    torch.save(model.state_dict(), path)
    print(f"💾 تم حفظ النموذج في: {path}")

def load_model(model, path='auraos_model.pth'):
    """تحميل النموذج"""
    model.load_state_dict(torch.load(path))
    print(f"📂 تم تحميل النموذج من: {path}")
    return model

# =============================================================================
# 🎯 تشغيل التدريب
# =============================================================================

if __name__ == "__main__":
    # تثبيت المتطلبات
    # install_requirements()
    
    # تشغيل التدريب
    model, learning_loop = main()
    
    # مراقبة GPU
    monitor_gpu()
    
    # حفظ النموذج
    save_model(model)
    
    print("\n🎉 تم الانتهاء من جميع العمليات بنجاح!")
