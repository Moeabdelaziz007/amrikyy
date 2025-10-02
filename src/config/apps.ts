import React from 'react';
import AutomationsManifest from '../apps/Automations/manifest';
import AuraNotesManifest from '../apps/AuraNotes/manifest';
import MCPPanelManifest from '../apps/MCPPanel/manifest';
import TerminalManifest from '../apps/Terminal/manifest';

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
  },
  {
    id: AutomationsManifest.id,
    name: AutomationsManifest.name,
    icon: '🛠️'
  },
  {
    id: AuraNotesManifest.id,
    name: AuraNotesManifest.name,
    icon: '📝'
  },
  {
    id: MCPPanelManifest.id,
    name: MCPPanelManifest.name,
    icon: '⚙️'
  },
  {
    id: TerminalManifest.id,
    name: TerminalManifest.name,
    icon: '💻'
  }
];


