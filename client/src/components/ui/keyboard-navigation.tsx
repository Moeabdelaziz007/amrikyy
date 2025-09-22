'use client';

import { useEffect } from 'react';

interface KeyboardNavigationProps {
  children: React.ReactNode;
}

export function KeyboardNavigation({ children }: KeyboardNavigationProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle global keyboard shortcuts
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'k':
            event.preventDefault();
            // Focus search or command palette
            const searchInput = document.querySelector(
              'input[type="search"], input[placeholder*="search" i]'
            ) as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
            }
            break;
          case '/':
            event.preventDefault();
            // Toggle help or shortcuts
            console.log('Help shortcut triggered');
            break;
        }
      }

      // Handle escape key
      if (event.key === 'Escape') {
        // Close modals, dropdowns, etc.
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.blur) {
          activeElement.blur();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return <>{children}</>;
}
