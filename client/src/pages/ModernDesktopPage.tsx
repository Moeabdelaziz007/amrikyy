/**
 * 🖥️ Modern Desktop Page for AuraOS
 * Enhanced desktop experience with modern design
 */

import React, { useState } from 'react';
import ModernDesktop from '@/components/desktop/ModernDesktop';
import ThemeCustomizer from '@/components/desktop/ThemeCustomizer';
import { DesktopThemeProvider } from '@/components/desktop/DesktopThemeProvider';

const ModernDesktopPage: React.FC = () => {
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);

  return (
    <DesktopThemeProvider defaultThemeId="modern-dark">
      <div className="h-screen overflow-hidden">
        <ModernDesktop />
        
        <ThemeCustomizer 
          isOpen={isThemeCustomizerOpen}
          onClose={() => setIsThemeCustomizerOpen(false)}
        />
        
        {/* Floating Action Button for Theme Customizer */}
        <button
          onClick={() => setIsThemeCustomizerOpen(true)}
          className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-40"
          title="Customize Theme"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
        </button>
      </div>
    </DesktopThemeProvider>
  );
};

export default ModernDesktopPage;
