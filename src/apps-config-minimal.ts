import React from 'react';

// Minimal apps configuration for deployment
export const appsConfig = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: '📊',
    component: () => React.createElement('div', { className: 'p-8 text-center text-white' }, 'Dashboard Coming Soon')
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: '⚙️',
    component: () => React.createElement('div', { className: 'p-8 text-center text-white' }, 'Settings Coming Soon')
  }
];
