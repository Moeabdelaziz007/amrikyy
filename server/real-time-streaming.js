"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealTimeAIStreaming = void 0;
exports.initializeRealTimeAIStreaming = initializeRealTimeAIStreaming;
exports.getRealTimeAIStreaming = getRealTimeAIStreaming;
const events_1 = require("events");
const ws_1 = require("ws");
const uuid_1 = require("uuid");
const multi_modal_ai_js_1 = require("./multi-modal-ai.js");
const firebase_js_1 = require("./firebase.js"); // Import Firebase token verification
class RealTimeAIStreaming extends events_1.EventEmitter {
    wss = null;
    connections = new Map();
    config;
    aiEngine;
    heartbeatInterval = null;
    cleanupInterval = null;
    constructor(config) {
        super();
        this.config = config;
        this.aiEngine = (0, multi_modal_ai_js_1.getMultiModalAIEngine)();
        this.setupAIEngineListeners();
    }
    async start(server) {
        // Skip starting if already running or if main WebSocket server is handling connections
        if (this.wss) {
            console.log('⚠️ Real-Time AI Streaming already started');
            return;
        }
        return new Promise((resolve, reject) => {
            try {
                // Use a different port to avoid conflicts with main WebSocket server
                const aiStreamingPort = this.config.port + 1; // Use port 8081 instead of 8080
                this.wss = new ws_1.WebSocketServer({
                    port: aiStreamingPort,
                    path: this.config.path, // Use the path from config
                    perMessageDeflate: this.config.enableCompression,
                    verifyClient: async (info, done) => {
                        const token = new URL(info.req.url, `http://${info.req.headers.host}`).searchParams.get('token');
                        if (!token) {
                            return done(false, 401, 'Unauthorized');
                        }
                        try {
                            const decodedToken = await (0, firebase_js_1.verifyToken)(token);
                            info.req.user = decodedToken;
                            done(true);
                        }
                        catch (error) {
                            done(false, 401, 'Unauthorized');
                        }
                    }
                });
                this.wss.on('connection', (ws, request) => {
                    this.handleNewConnection(ws, request);
                });
                this.wss.on('error', (error) => {
                    console.error('❌ Real-Time AI Streaming WebSocket error:', error);
                    this.emit('error', error);
                    // Don't reject here as it might be a port conflict
                });
                this.startHeartbeat();
                this.startCleanup();
                console.log(`🚀 Real-Time AI Streaming started on port ${aiStreamingPort}`);
                this.emit('started');
                resolve();
            }
            catch (error) {
                console.warn('⚠️ Real-Time AI Streaming failed to start (likely port conflict):', error.message);
                // Don't reject - let the main WebSocket server handle connections
                resolve();
            }
        });
    }
    async stop() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
        for (const connection of this.connections.values()) {
            connection.ws.close();
        }
        if (this.wss) {
            this.wss.close();
        }
        console.log('🛑 Real-Time AI Streaming stopped');
        this.emit('stopped');
    }
    handleNewConnection(ws, request) {
        const connectionId = (0, uuid_1.v4)();
        const userId = request.user.uid;
        const connection = {
            id: connectionId,
            userId,
            ws,
            isActive: true,
            connectedAt: new Date(),
            lastActivity: new Date(),
            messageCount: 0
        };
        this.connections.set(connectionId, connection);
        ws.on('message', (data) => {
            this.handleMessage(connectionId, data);
        });
        ws.on('close', () => {
            this.handleDisconnection(connectionId);
        });
        ws.on('error', (error) => {
            this.handleConnectionError(connectionId, error);
        });
        this.sendMessage(connectionId, {
            id: (0, uuid_1.v4)(),
            type: 'status',
            data: {
                message: 'Connected to Real-Time AI Streaming',
                connectionId,
                userId,
                timestamp: new Date()
            },
            timestamp: new Date()
        });
        this.emit('connectionEstablished', connection);
        console.log(`🔗 New streaming connection: ${connectionId} (User: ${userId})`);
    }
    async handleMessage(connectionId, data) {
        const connection = this.connections.get(connectionId);
        if (!connection || !connection.isActive) {
            return;
        }
        try {
            const message = JSON.parse(data.toString());
            connection.lastActivity = new Date();
            connection.messageCount++;
            switch (message.type) {
                case 'start_session':
                    await this.handleStartSession(connectionId, message.data);
                    break;
                case 'process_input':
                    await this.handleProcessInput(connectionId, message.data);
                    break;
                case 'end_session':
                    await this.handleEndSession(connectionId, message.data);
                    break;
                case 'heartbeat':
                    await this.handleHeartbeat(connectionId);
                    break;
                case 'get_status':
                    await this.handleGetStatus(connectionId);
                    break;
                default:
                    this.sendError(connectionId, `Unknown message type: ${message.type}`);
            }
        }
        catch (error) {
            this.sendError(connectionId, `Message processing error: ${error.message}`);
        }
    }
    // ... (rest of the methods remain the same)
    async handleStartSession(connectionId, data) {
        const connection = this.connections.get(connectionId);
        if (!connection)
            return;
        try {
            const { modelId, userId } = data;
            const sessionId = await this.aiEngine.startStreamingSession(userId || connection.userId, modelId);
            connection.sessionId = sessionId;
            this.sendMessage(connectionId, {
                id: (0, uuid_1.v4)(),
                type: 'status',
                data: {
                    message: 'Streaming session started',
                    sessionId,
                    modelId,
                    timestamp: new Date()
                },
                timestamp: new Date()
            });
            this.emit('sessionStarted', { connectionId, sessionId, modelId });
        }
        catch (error) {
            this.sendError(connectionId, `Failed to start session: ${error.message}`);
        }
    }
    async handleProcessInput(connectionId, data) {
        const connection = this.connections.get(connectionId);
        if (!connection || !connection.sessionId) {
            this.sendError(connectionId, 'No active session');
            return;
        }
        try {
            const input = data.input;
            const startTime = Date.now();
            // Process input through AI engine
            const output = await this.aiEngine.processStreamingInput(connection.sessionId, input);
            const processingTime = Date.now() - startTime;
            this.sendMessage(connectionId, {
                id: (0, uuid_1.v4)(),
                type: 'output',
                data: {
                    input,
                    output,
                    processingTime,
                    timestamp: new Date()
                },
                timestamp: new Date()
            });
            this.emit('inputProcessed', {
                connectionId,
                sessionId: connection.sessionId,
                input,
                output,
                processingTime
            });
        }
        catch (error) {
            this.sendError(connectionId, `Input processing failed: ${error.message}`);
        }
    }
    async handleEndSession(connectionId, data) {
        const connection = this.connections.get(connectionId);
        if (!connection || !connection.sessionId) {
            this.sendError(connectionId, 'No active session');
            return;
        }
        try {
            await this.aiEngine.endStreamingSession(connection.sessionId);
            this.sendMessage(connectionId, {
                id: (0, uuid_1.v4)(),
                type: 'status',
                data: {
                    message: 'Streaming session ended',
                    sessionId: connection.sessionId,
                    timestamp: new Date()
                },
                timestamp: new Date()
            });
            this.emit('sessionEnded', { connectionId, sessionId: connection.sessionId });
            connection.sessionId = undefined;
        }
        catch (error) {
            this.sendError(connectionId, `Failed to end session: ${error.message}`);
        }
    }
    async handleHeartbeat(connectionId) {
        const connection = this.connections.get(connectionId);
        if (connection) {
            connection.lastActivity = new Date();
            this.sendMessage(connectionId, {
                id: (0, uuid_1.v4)(),
                type: 'heartbeat',
                data: {
                    timestamp: new Date(),
                    status: 'alive'
                },
                timestamp: new Date()
            });
        }
    }
    async handleGetStatus(connectionId) {
        const connection = this.connections.get(connectionId);
        if (!connection)
            return;
        const status = {
            connectionId: connection.id,
            userId: connection.userId,
            sessionId: connection.sessionId,
            isActive: connection.isActive,
            connectedAt: connection.connectedAt,
            lastActivity: connection.lastActivity,
            messageCount: connection.messageCount,
            timestamp: new Date()
        };
        this.sendMessage(connectionId, {
            id: (0, uuid_1.v4)(),
            type: 'status',
            data: status,
            timestamp: new Date()
        });
    }
    handleDisconnection(connectionId) {
        const connection = this.connections.get(connectionId);
        if (connection) {
            connection.isActive = false;
            if (connection.sessionId) {
                this.aiEngine.endStreamingSession(connection.sessionId);
            }
            this.connections.delete(connectionId);
            this.emit('connectionClosed', connection);
            console.log(`🔌 Streaming connection closed: ${connectionId}`);
        }
    }
    handleConnectionError(connectionId, error) {
        const connection = this.connections.get(connectionId);
        if (connection) {
            this.emit('connectionError', { connectionId, error });
            console.error(`❌ Streaming connection error: ${connectionId}`, error);
        }
    }
    sendMessage(connectionId, message) {
        const connection = this.connections.get(connectionId);
        if (connection && connection.isActive && connection.ws.readyState === ws_1.WebSocket.OPEN) {
            try {
                connection.ws.send(JSON.stringify(message));
            }
            catch (error) {
                console.error(`Failed to send message to ${connectionId}:`, error);
            }
        }
    }
    sendError(connectionId, errorMessage) {
        this.sendMessage(connectionId, {
            id: (0, uuid_1.v4)(),
            type: 'error',
            data: {
                error: errorMessage,
                timestamp: new Date()
            },
            timestamp: new Date()
        });
    }
    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            for (const connection of Array.from(this.connections.values())) {
                if (connection.isActive) {
                    this.sendMessage(connection.id, {
                        id: (0, uuid_1.v4)(),
                        type: 'heartbeat',
                        data: {
                            timestamp: new Date(),
                            status: 'ping'
                        },
                        timestamp: new Date()
                    });
                }
            }
        }, this.config.heartbeatInterval);
    }
    startCleanup() {
        this.cleanupInterval = setInterval(() => {
            const now = Date.now();
            const timeout = this.config.connectionTimeout;
            for (const [connectionId, connection] of Array.from(this.connections.entries())) {
                const lastActivity = connection.lastActivity.getTime();
                if (now - lastActivity > timeout) {
                    console.log(`🧹 Cleaning up inactive connection: ${connectionId}`);
                    connection.ws.close();
                    this.connections.delete(connectionId);
                }
            }
        }, 60000);
    }
    setupAIEngineListeners() {
        this.aiEngine.on('streamingSessionStarted', (session) => {
            this.emit('aiSessionStarted', session);
        });
        this.aiEngine.on('streamingSessionEnded', (session) => {
            this.emit('aiSessionEnded', session);
        });
        this.aiEngine.on('streamingMessageProcessed', (data) => {
            this.emit('aiMessageProcessed', data);
        });
        this.aiEngine.on('processingComplete', (data) => {
            this.emit('aiProcessingComplete', data);
        });
        this.aiEngine.on('processingError', (data) => {
            this.emit('aiProcessingError', data);
        });
    }
    getConnection(connectionId) {
        return this.connections.get(connectionId);
    }
    getAllConnections() {
        return Array.from(this.connections.values());
    }
    getActiveConnections() {
        return Array.from(this.connections.values()).filter(conn => conn.isActive);
    }
    getConnectionStats() {
        const connections = Array.from(this.connections.values());
        return {
            total: connections.length,
            active: connections.filter(conn => conn.isActive).length,
            inactive: connections.filter(conn => !conn.isActive).length,
            totalMessages: connections.reduce((sum, conn) => sum + conn.messageCount, 0),
            averageMessagesPerConnection: connections.length > 0
                ? connections.reduce((sum, conn) => sum + conn.messageCount, 0) / connections.length
                : 0
        };
    }
    broadcastMessage(message, excludeConnectionId) {
        for (const connection of Array.from(this.connections.values())) {
            if (connection.isActive && connection.id !== excludeConnectionId) {
                this.sendMessage(connection.id, message);
            }
        }
    }
    sendToUser(userId, message) {
        for (const connection of Array.from(this.connections.values())) {
            if (connection.isActive && connection.userId === userId) {
                this.sendMessage(connection.id, message);
            }
        }
    }
    getStreamingMetrics() {
        const stats = this.getConnectionStats();
        const aiMetrics = this.aiEngine.getPerformanceMetrics();
        return {
            connections: stats,
            aiEngine: {
                models: this.aiEngine.getAllModels().length,
                activeModels: this.aiEngine.getActiveModels().length,
                sessions: this.aiEngine.getActiveStreamingSessions().length,
                performance: Object.fromEntries(aiMetrics)
            },
            timestamp: new Date()
        };
    }
}
exports.RealTimeAIStreaming = RealTimeAIStreaming;
let realTimeAIStreaming = null;
function initializeRealTimeAIStreaming(server) {
    if (!realTimeAIStreaming) {
        const config = {
            maxConnections: 1000,
            heartbeatInterval: 30000,
            connectionTimeout: 300000,
            enableCompression: true,
            path: '/api/ws' // Define a specific path for WebSocket
        };
        realTimeAIStreaming = new RealTimeAIStreaming(config);
        realTimeAIStreaming.start(server);
    }
    return realTimeAIStreaming;
}
function getRealTimeAIStreaming() {
    if (!realTimeAIStreaming) {
        throw new Error('RealTimeAIStreaming is not initialized. Call initializeRealTimeAIStreaming first.');
    }
    return realTimeAIStreaming;
}
