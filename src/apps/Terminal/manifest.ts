import { IAppManifest } from '../../core/types/os';

const TerminalManifest: IAppManifest = {
  id: 'terminal',
  name: 'Terminal',
  version: '1.0.0',
  description: 'AI-powered terminal with intelligent command processing',
  author: 'AuraOS Team',
  icon: '💻',
  category: 'system',
  permissions: [
    'system:execute',
    'ai:process',
    'service:access',
    'command:run'
  ],
  dependencies: [
    'ai.service',
    'mcp.service',
    'automation.service'
  ],
  features: [
    'Natural language commands',
    'AI command analysis',
    'System integration',
    'Real-time processing',
    'Intelligent responses'
  ]
};

export default TerminalManifest;
