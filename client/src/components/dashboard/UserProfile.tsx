import React, { useState, useEffect } from 'react';
import { User, Settings, Bell, Shield, Palette, Camera, Save, X } from 'lucide-react';

interface UserProfileProps {
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    joinDate: string;
    lastActive: string;
    preferences: {
      theme: 'light' | 'dark' | 'system';
      language: string;
      notifications: boolean;
      emailUpdates: boolean;
    };
  };
  onUpdate?: (updates: any) => void;
  onClose?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onUpdate,
  onClose
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    preferences: user?.preferences || {
      theme: 'system' as const,
      language: 'ar',
      notifications: true,
      emailUpdates: true,
    }
  });

  const [stats, setStats] = useState({
    totalAutomations: 0,
    activeWorkflows: 0,
    completedTasks: 0,
    successRate: 0,
  });

  useEffect(() => {
    // Load user stats from API
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      // This would be replaced with actual API calls
      setStats({
        totalAutomations: 12,
        activeWorkflows: 5,
        completedTasks: 89,
        successRate: 94.5,
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleSave = async () => {
    try {
      // Save user profile updates
      if (onUpdate) {
        await onUpdate(formData);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary-dark">
                <Camera size={14} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">{user.role}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              عضو منذ {new Date(user.joinDate).toLocaleDateString('ar-SA')}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              <Settings size={18} />
              <span>تحرير الملف الشخصي</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Save size={18} />
                <span>حفظ</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                <X size={18} />
                <span>إلغاء</span>
              </button>
            </div>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalAutomations}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            الأتمتة الكلية
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.activeWorkflows}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            مسارات العمل النشطة
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.completedTasks}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            المهام المكتملة
          </div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.successRate}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            معدل النجاح
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <User size={20} className="mr-2 rtl:ml-2" />
            المعلومات الأساسية
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">الاسم</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{user.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{user.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Palette size={20} className="mr-2 rtl:ml-2" />
            التفضيلات
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">السمة</label>
              {isEditing ? (
                <select
                  value={formData.preferences.theme}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, theme: e.target.value as any }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                >
                  <option value="light">فاتح</option>
                  <option value="dark">داكن</option>
                  <option value="system">النظام</option>
                </select>
              ) : (
                <p className="text-gray-900 dark:text-white">
                  {formData.preferences.theme === 'light' ? 'فاتح' :
                   formData.preferences.theme === 'dark' ? 'داكن' : 'النظام'}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">اللغة</label>
              {isEditing ? (
                <select
                  value={formData.preferences.language}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, language: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              ) : (
                <p className="text-gray-900 dark:text-white">
                  {formData.preferences.language === 'ar' ? 'العربية' : 'English'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Bell size={20} className="mr-2 rtl:ml-2" />
            الإشعارات
          </h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.preferences.notifications}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, notifications: e.target.checked }
                }))}
                className="mr-3 rtl:ml-3"
                disabled={!isEditing}
              />
              <span>تفعيل الإشعارات</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.preferences.emailUpdates}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, emailUpdates: e.target.checked }
                }))}
                className="mr-3 rtl:ml-3"
                disabled={!isEditing}
              />
              <span>تلقي التحديثات عبر البريد الإلكتروني</span>
            </label>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center">
              <Shield size={20} className="mr-2 rtl:ml-2" />
              معلومات الحساب
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              آخر نشاط: {new Date(user.lastActive).toLocaleDateString('ar-SA')}
            </p>
          </div>
          <div className="text-left rtl:text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">معرف المستخدم</p>
            <p className="font-mono text-xs text-gray-700 dark:text-gray-300">
              {user.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
