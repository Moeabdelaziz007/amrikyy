import { IAppManifest } from '../../core/types/os';

const MCPPanelManifest: IAppManifest = {
  id: 'mcp',
  name: 'MCP',
  version: '1.0.0',
  description: 'Master Control Program - System monitoring and control interface',
  author: 'AuraOS Team',
  icon: '⚙️',
  category: 'system',
  permissions: [
    'system:read',
    'system:control',
    'service:monitor',
    'process:manage'
  ],
  dependencies: [
    'mcp.service',
    'ai.service'
  ],
  features: [
    'System monitoring',
    'Command execution',
    'Service management',
    'Process control',
    'Real-time status'
  ]
};

export default MCPPanelManifest;
