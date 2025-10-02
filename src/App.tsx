import React from 'react';
import './styles/minimal.css';
import { I18nProvider } from './i18n/i18n';
import { ThemeProvider } from './themes/AdvancedThemeSystem';
import Desktop from './shell/Desktop';

function AppRoot() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <Desktop />
      </ThemeProvider>
    </I18nProvider>
  );
}

export default AppRoot;

