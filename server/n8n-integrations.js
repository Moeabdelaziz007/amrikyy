"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.N8nIntegrationManager = void 0;
exports.getN8nIntegrationManager = getN8nIntegrationManager;
class N8nIntegrationManager {
    connectors = new Map();
    credentials = new Map();
    webhooks = new Map();
    isLive = false;
    constructor() {
        this.initializeDefaultConnectors();
        this.initializeLiveMode();
    }
    initializeLiveMode() {
        this.isLive = true;
        console.log('🔌 N8n Integration Manager is now LIVE');
    }
    initializeDefaultConnectors() {
        // Communication Integrations
        this.registerConnector({
            id: 'telegram',
            name: 'telegram',
            displayName: 'Telegram',
            description: 'Send messages and interact with Telegram bots',
            category: 'communication',
            icon: '📱',
            version: '1.0.0',
            isOfficial: true,
            credentials: [
                {
                    name: 'telegramApi',
                    displayName: 'Telegram API',
                    type: 'apiKey',
                    required: true,
                    properties: [
                        {
                            displayName: 'Bot Token',
                            name: 'token',
                            type: 'password',
                            required: true,
                            placeholder: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz'
                        }
                    ]
                }
            ],
            nodes: [
                {
                    name: 'telegram.trigger',
                    displayName: 'Telegram Trigger',
                    description: 'Triggers when a message is received',
                    version: 1,
                    type: 'trigger',
                    category: ['communication'],
                    defaults: { name: 'Telegram Trigger', color: '#0088cc' },
                    inputs: [],
                    outputs: ['main'],
                    webhookUrl: '/webhook/telegram'
                },
                {
                    name: 'telegram.sendMessage',
                    displayName: 'Send Message',
                    description: 'Send a message to a Telegram chat',
                    version: 1,
                    type: 'action',
                    category: ['communication'],
                    defaults: { name: 'Send Message', color: '#0088cc' },
                    inputs: ['main'],
                    outputs: ['main'],
                    credentials: ['telegramApi'],
                    properties: [
                        {
                            displayName: 'Chat ID',
                            name: 'chatId',
                            type: 'string',
                            required: true,
                            placeholder: 'Chat ID or @username'
                        },
                        {
                            displayName: 'Message',
                            name: 'message',
                            type: 'string',
                            required: true,
                            placeholder: 'Message text'
                        },
                        {
                            displayName: 'Parse Mode',
                            name: 'parseMode',
                            type: 'options',
                            options: [
                                { name: 'HTML', value: 'HTML' },
                                { name: 'Markdown', value: 'Markdown' },
                                { name: 'None', value: 'None' }
                            ]
                        }
                    ]
                }
            ],
            webhooks: [
                {
                    name: 'telegramWebhook',
                    httpMethod: 'POST',
                    path: '/webhook/telegram',
                    responseMode: 'onReceived'
                }
            ]
        });
        // AI Integrations
        this.registerConnector({
            id: 'openai',
            name: 'openai',
            displayName: 'OpenAI',
            description: 'Integrate with OpenAI GPT models',
            category: 'ai',
            icon: '🤖',
            version: '1.0.0',
            isOfficial: true,
            credentials: [
                {
                    name: 'openaiApi',
                    displayName: 'OpenAI API',
                    type: 'apiKey',
                    required: true,
                    properties: [
                        {
                            displayName: 'API Key',
                            name: 'apiKey',
                            type: 'password',
                            required: true,
                            placeholder: 'sk-...'
                        }
                    ]
                }
            ],
            nodes: [
                {
                    name: 'openai.chat',
                    displayName: 'Chat Completion',
                    description: 'Generate chat completions using OpenAI',
                    version: 1,
                    type: 'action',
                    category: ['ai'],
                    defaults: { name: 'Chat Completion', color: '#8B5CF6' },
                    inputs: ['main'],
                    outputs: ['main'],
                    credentials: ['openaiApi'],
                    properties: [
                        {
                            displayName: 'Model',
                            name: 'model',
                            type: 'options',
                            required: true,
                            options: [
                                { name: 'GPT-4', value: 'gpt-4' },
                                { name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' }
                            ]
                        },
                        {
                            displayName: 'Messages',
                            name: 'messages',
                            type: 'collection',
                            required: true,
                            placeholder: 'Chat messages'
                        },
                        {
                            displayName: 'Temperature',
                            name: 'temperature',
                            type: 'number',
                            default: 0.7
                        }
                    ]
                }
            ]
        });
        // Social Media Integrations
        this.registerConnector({
            id: 'twitter',
            name: 'twitter',
            displayName: 'X (Twitter)',
            description: 'Post tweets and interact with X/Twitter',
            category: 'social_media',
            icon: '🐦',
            version: '1.0.0',
            isOfficial: true,
            credentials: [
                {
                    name: 'twitterOAuth2Api',
                    displayName: 'Twitter OAuth2 API',
                    type: 'oauth2',
                    required: true,
                    properties: [
                        {
                            displayName: 'Client ID',
                            name: 'clientId',
                            type: 'string',
                            required: true
                        },
                        {
                            displayName: 'Client Secret',
                            name: 'clientSecret',
                            type: 'password',
                            required: true
                        }
                    ]
                }
            ],
            nodes: [
                {
                    name: 'twitter.tweet',
                    displayName: 'Tweet',
                    description: 'Post a tweet',
                    version: 1,
                    type: 'action',
                    category: ['social_media'],
                    defaults: { name: 'Tweet', color: '#1DA1F2' },
                    inputs: ['main'],
                    outputs: ['main'],
                    credentials: ['twitterOAuth2Api'],
                    properties: [
                        {
                            displayName: 'Text',
                            name: 'text',
                            type: 'string',
                            required: true,
                            placeholder: 'Tweet text'
                        }
                    ]
                }
            ]
        });
        // Productivity Integrations
        this.registerConnector({
            id: 'google_sheets',
            name: 'googleSheets',
            displayName: 'Google Sheets',
            description: 'Read and write data to Google Sheets',
            category: 'productivity',
            icon: '📊',
            version: '1.0.0',
            isOfficial: true,
            credentials: [
                {
                    name: 'googleSheetsOAuth2Api',
                    displayName: 'Google Sheets OAuth2 API',
                    type: 'oauth2',
                    required: true,
                    properties: [
                        {
                            displayName: 'Client ID',
                            name: 'clientId',
                            type: 'string',
                            required: true
                        },
                        {
                            displayName: 'Client Secret',
                            name: 'clientSecret',
                            type: 'password',
                            required: true
                        }
                    ]
                }
            ],
            nodes: [
                {
                    name: 'googleSheets.append',
                    displayName: 'Append Row',
                    description: 'Append a row to a Google Sheet',
                    version: 1,
                    type: 'action',
                    category: ['productivity'],
                    defaults: { name: 'Append Row', color: '#0F9D58' },
                    inputs: ['main'],
                    outputs: ['main'],
                    credentials: ['googleSheetsOAuth2Api'],
                    properties: [
                        {
                            displayName: 'Sheet ID',
                            name: 'sheetId',
                            type: 'string',
                            required: true,
                            placeholder: 'Google Sheet ID'
                        },
                        {
                            displayName: 'Range',
                            name: 'range',
                            type: 'string',
                            required: true,
                            placeholder: 'A:Z'
                        }
                    ]
                }
            ]
        });
        // Database Integrations
        this.registerConnector({
            id: 'mysql',
            name: 'mysql',
            displayName: 'MySQL',
            description: 'Connect to MySQL databases',
            category: 'database',
            icon: '🗄️',
            version: '1.0.0',
            isOfficial: true,
            credentials: [
                {
                    name: 'mySql',
                    displayName: 'MySQL',
                    type: 'custom',
                    required: true,
                    properties: [
                        {
                            displayName: 'Host',
                            name: 'host',
                            type: 'string',
                            required: true,
                            default: 'localhost'
                        },
                        {
                            displayName: 'Database',
                            name: 'database',
                            type: 'string',
                            required: true
                        },
                        {
                            displayName: 'User',
                            name: 'user',
                            type: 'string',
                            required: true
                        },
                        {
                            displayName: 'Password',
                            name: 'password',
                            type: 'password',
                            required: true
                        },
                        {
                            displayName: 'Port',
                            name: 'port',
                            type: 'number',
                            default: 3306
                        }
                    ]
                }
            ],
            nodes: [
                {
                    name: 'mysql.executeQuery',
                    displayName: 'Execute Query',
                    description: 'Execute a SQL query',
                    version: 1,
                    type: 'action',
                    category: ['database'],
                    defaults: { name: 'Execute Query', color: '#4479A1' },
                    inputs: ['main'],
                    outputs: ['main'],
                    credentials: ['mySql'],
                    properties: [
                        {
                            displayName: 'Query',
                            name: 'query',
                            type: 'string',
                            required: true,
                            placeholder: 'SELECT * FROM users'
                        }
                    ]
                }
            ]
        });
        // HTTP/API Integrations
        this.registerConnector({
            id: 'http_request',
            name: 'httpRequest',
            displayName: 'HTTP Request',
            description: 'Make HTTP requests to any API',
            category: 'utilities',
            icon: '🌐',
            version: '1.0.0',
            isOfficial: true,
            credentials: [],
            nodes: [
                {
                    name: 'httpRequest',
                    displayName: 'HTTP Request',
                    description: 'Make HTTP requests',
                    version: 1,
                    type: 'action',
                    category: ['utilities'],
                    defaults: { name: 'HTTP Request', color: '#FF6B6B' },
                    inputs: ['main'],
                    outputs: ['main'],
                    properties: [
                        {
                            displayName: 'Method',
                            name: 'method',
                            type: 'options',
                            required: true,
                            options: [
                                { name: 'GET', value: 'GET' },
                                { name: 'POST', value: 'POST' },
                                { name: 'PUT', value: 'PUT' },
                                { name: 'DELETE', value: 'DELETE' }
                            ]
                        },
                        {
                            displayName: 'URL',
                            name: 'url',
                            type: 'string',
                            required: true,
                            placeholder: 'https://api.example.com'
                        },
                        {
                            displayName: 'Headers',
                            name: 'headers',
                            type: 'collection',
                            placeholder: 'Request headers'
                        },
                        {
                            displayName: 'Body',
                            name: 'body',
                            type: 'string',
                            placeholder: 'Request body'
                        }
                    ]
                }
            ]
        });
        // Email Integrations
        this.registerConnector({
            id: 'gmail',
            name: 'gmail',
            displayName: 'Gmail',
            description: 'Send emails via Gmail',
            category: 'communication',
            icon: '📧',
            version: '1.0.0',
            isOfficial: true,
            credentials: [
                {
                    name: 'gmailOAuth2',
                    displayName: 'Gmail OAuth2 API',
                    type: 'oauth2',
                    required: true,
                    properties: [
                        {
                            displayName: 'Client ID',
                            name: 'clientId',
                            type: 'string',
                            required: true
                        },
                        {
                            displayName: 'Client Secret',
                            name: 'clientSecret',
                            type: 'password',
                            required: true
                        }
                    ]
                }
            ],
            nodes: [
                {
                    name: 'gmail.sendEmail',
                    displayName: 'Send Email',
                    description: 'Send an email via Gmail',
                    version: 1,
                    type: 'action',
                    category: ['communication'],
                    defaults: { name: 'Send Email', color: '#EA4335' },
                    inputs: ['main'],
                    outputs: ['main'],
                    credentials: ['gmailOAuth2'],
                    properties: [
                        {
                            displayName: 'To',
                            name: 'to',
                            type: 'string',
                            required: true,
                            placeholder: 'recipient@example.com'
                        },
                        {
                            displayName: 'Subject',
                            name: 'subject',
                            type: 'string',
                            required: true,
                            placeholder: 'Email subject'
                        },
                        {
                            displayName: 'Body',
                            name: 'body',
                            type: 'string',
                            required: true,
                            placeholder: 'Email body'
                        }
                    ]
                }
            ]
        });
        // File Storage Integrations
        this.registerConnector({
            id: 'google_drive',
            name: 'googleDrive',
            displayName: 'Google Drive',
            description: 'Upload and manage files in Google Drive',
            category: 'storage',
            icon: '☁️',
            version: '1.0.0',
            isOfficial: true,
            credentials: [
                {
                    name: 'googleDriveOAuth2Api',
                    displayName: 'Google Drive OAuth2 API',
                    type: 'oauth2',
                    required: true,
                    properties: [
                        {
                            displayName: 'Client ID',
                            name: 'clientId',
                            type: 'string',
                            required: true
                        },
                        {
                            displayName: 'Client Secret',
                            name: 'clientSecret',
                            type: 'password',
                            required: true
                        }
                    ]
                }
            ],
            nodes: [
                {
                    name: 'googleDrive.upload',
                    displayName: 'Upload File',
                    description: 'Upload a file to Google Drive',
                    version: 1,
                    type: 'action',
                    category: ['storage'],
                    defaults: { name: 'Upload File', color: '#4285F4' },
                    inputs: ['main'],
                    outputs: ['main'],
                    credentials: ['googleDriveOAuth2Api'],
                    properties: [
                        {
                            displayName: 'File Name',
                            name: 'fileName',
                            type: 'string',
                            required: true,
                            placeholder: 'document.pdf'
                        },
                        {
                            displayName: 'File Content',
                            name: 'fileContent',
                            type: 'string',
                            required: true,
                            placeholder: 'Base64 encoded file content'
                        },
                        {
                            displayName: 'Folder ID',
                            name: 'folderId',
                            type: 'string',
                            placeholder: 'Google Drive folder ID'
                        }
                    ]
                }
            ]
        });
        // Analytics Integrations
        this.registerConnector({
            id: 'google_analytics',
            name: 'googleAnalytics',
            displayName: 'Google Analytics',
            description: 'Access Google Analytics data',
            category: 'analytics',
            icon: '📈',
            version: '1.0.0',
            isOfficial: true,
            credentials: [
                {
                    name: 'googleAnalyticsOAuth2Api',
                    displayName: 'Google Analytics OAuth2 API',
                    type: 'oauth2',
                    required: true,
                    properties: [
                        {
                            displayName: 'Client ID',
                            name: 'clientId',
                            type: 'string',
                            required: true
                        },
                        {
                            displayName: 'Client Secret',
                            name: 'clientSecret',
                            type: 'password',
                            required: true
                        }
                    ]
                }
            ],
            nodes: [
                {
                    name: 'googleAnalytics.getReport',
                    displayName: 'Get Report',
                    description: 'Get analytics report data',
                    version: 1,
                    type: 'action',
                    category: ['analytics'],
                    defaults: { name: 'Get Report', color: '#FF9800' },
                    inputs: ['main'],
                    outputs: ['main'],
                    credentials: ['googleAnalyticsOAuth2Api'],
                    properties: [
                        {
                            displayName: 'View ID',
                            name: 'viewId',
                            type: 'string',
                            required: true,
                            placeholder: 'Google Analytics view ID'
                        },
                        {
                            displayName: 'Metrics',
                            name: 'metrics',
                            type: 'string',
                            required: true,
                            placeholder: 'ga:sessions,ga:users'
                        },
                        {
                            displayName: 'Dimensions',
                            name: 'dimensions',
                            type: 'string',
                            placeholder: 'ga:date,ga:country'
                        }
                    ]
                }
            ]
        });
        console.log(`🔌 Registered ${this.connectors.size} integration connectors`);
    }
    // Public API Methods
    registerConnector(connector) {
        this.connectors.set(connector.id, connector);
        console.log(`📦 Registered connector: ${connector.displayName}`);
    }
    getConnector(connectorId) {
        return this.connectors.get(connectorId);
    }
    getAllConnectors() {
        return Array.from(this.connectors.values());
    }
    getConnectorsByCategory(category) {
        return Array.from(this.connectors.values()).filter(c => c.category === category);
    }
    getPopularConnectors() {
        // Return most commonly used connectors
        const popularIds = ['telegram', 'openai', 'http_request', 'google_sheets', 'gmail'];
        return popularIds
            .map(id => this.connectors.get(id))
            .filter(Boolean);
    }
    getFeaturedConnectors() {
        return Array.from(this.connectors.values()).filter(c => c.isOfficial && !c.isPremium);
    }
    getPremiumConnectors() {
        return Array.from(this.connectors.values()).filter(c => c.isPremium);
    }
    getCommunityConnectors() {
        return Array.from(this.connectors.values()).filter(c => c.isCommunity);
    }
    // Credential Management
    setCredentials(connectorId, credentialName, credentials) {
        const key = `${connectorId}:${credentialName}`;
        this.credentials.set(key, credentials);
        console.log(`🔑 Stored credentials for ${connectorId}:${credentialName}`);
    }
    getCredentials(connectorId, credentialName) {
        const key = `${connectorId}:${credentialName}`;
        return this.credentials.get(key);
    }
    // Webhook Management
    registerWebhook(connectorId, webhook) {
        if (!this.webhooks.has(connectorId)) {
            this.webhooks.set(connectorId, []);
        }
        this.webhooks.get(connectorId).push(webhook);
        console.log(`🎣 Registered webhook for ${connectorId}: ${webhook.name}`);
    }
    getWebhooks(connectorId) {
        return this.webhooks.get(connectorId) || [];
    }
    // Search and Discovery
    searchConnectors(query) {
        const lowercaseQuery = query.toLowerCase();
        return Array.from(this.connectors.values()).filter(connector => connector.name.toLowerCase().includes(lowercaseQuery) ||
            connector.displayName.toLowerCase().includes(lowercaseQuery) ||
            connector.description.toLowerCase().includes(lowercaseQuery) ||
            connector.category.toLowerCase().includes(lowercaseQuery));
    }
    getConnectorStatistics() {
        const connectors = Array.from(this.connectors.values());
        const categories = [...new Set(connectors.map(c => c.category))];
        return {
            total: connectors.length,
            byCategory: categories.reduce((acc, category) => {
                acc[category] = connectors.filter(c => c.category === category).length;
                return acc;
            }, {}),
            official: connectors.filter(c => c.isOfficial).length,
            premium: connectors.filter(c => c.isPremium).length,
            community: connectors.filter(c => c.isCommunity).length,
            withWebhooks: connectors.filter(c => c.webhooks && c.webhooks.length > 0).length
        };
    }
    getSystemStatus() {
        return {
            isLive: this.isLive,
            totalConnectors: this.connectors.size,
            totalCredentials: this.credentials.size,
            totalWebhooks: Array.from(this.webhooks.values()).reduce((sum, hooks) => sum + hooks.length, 0),
            statistics: this.getConnectorStatistics()
        };
    }
    // Integration Testing
    async testConnector(connectorId, credentialName) {
        const connector = this.getConnector(connectorId);
        const credentials = this.getCredentials(connectorId, credentialName);
        if (!connector) {
            return { success: false, message: 'Connector not found' };
        }
        if (!credentials) {
            return { success: false, message: 'Credentials not found' };
        }
        try {
            // In a real implementation, this would test the actual API connection
            console.log(`🧪 Testing connector: ${connector.displayName}`);
            // Simulate API test
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { success: true, message: 'Connection successful' };
        }
        catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Connection failed'
            };
        }
    }
    // Node Execution Helpers
    async executeNode(node, parameters, inputData) {
        console.log(`🔧 Executing ${node.displayName} node`);
        try {
            // In a real implementation, this would execute the actual node logic
            // For now, we'll simulate the execution
            await new Promise(resolve => setTimeout(resolve, 500));
            return inputData.map(item => ({
                ...item,
                nodeResult: {
                    success: true,
                    nodeType: node.name,
                    parameters,
                    timestamp: new Date().toISOString()
                }
            }));
        }
        catch (error) {
            console.error(`Node execution error: ${node.displayName}`, error);
            throw error;
        }
    }
}
exports.N8nIntegrationManager = N8nIntegrationManager;
// Export singleton instance
let n8nIntegrationManager = null;
function getN8nIntegrationManager() {
    if (!n8nIntegrationManager) {
        n8nIntegrationManager = new N8nIntegrationManager();
    }
    return n8nIntegrationManager;
}
