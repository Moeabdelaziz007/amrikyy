import React from 'react';
import './styles/minimal.css';
import { I18nProvider } from './i18n/i18n';
import { ThemeProvider } from './themes/AdvancedThemeSystem';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Desktop from './shell/Desktop';
import LoginScreen from './components/auth/LoginScreen';

function AppContent() {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#0a0f1e] to-[#1a1f2e]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00f6ff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#00f6ff] text-lg font-semibold">Loading AuraOS...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show LoginScreen
  if (!user) {
    return <LoginScreen />;
  }

  // If user is logged in, show Desktop
  return <Desktop />;
}

function AppRoot() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default AppRoot;

