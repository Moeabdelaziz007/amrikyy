"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_1 = require("http");
const routes_1 = require("./routes");
const real_time_streaming_1 = require("./real-time-streaming");
const vite_1 = require("./vite");
const autopilot_agent_1 = require("./autopilot-agent");
const self_improving_ai_1 = require("./self-improving-ai");
const debug_stream_1 = require("./debug-stream");
const firebase_1 = require("./firebase");
const enhanced_logger_js_1 = require("./enhanced-logger.js");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const debugStream = (0, debug_stream_1.getDebugStream)();
// Initialize Firebase
(0, firebase_1.initializeFirebase)();
// Initialize Enhanced Logger
enhanced_logger_js_1.enhancedLogger.info('AuraOS Server starting up', 'server', {
    nodeVersion: process.version,
    platform: process.platform,
    pid: process.pid
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get('/api/events', (req, res) => {
    // Set proper headers for Server-Sent Events
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
    });
    debugStream.addClient(res);
});
app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse = undefined;
    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
    };
    res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
            let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
            if (capturedJsonResponse) {
                logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
            }
            if (logLine.length > 80) {
                logLine = logLine.slice(0, 79) + "…";
            }
            (0, vite_1.log)(logLine);
            // Enhanced logging
            enhanced_logger_js_1.enhancedLogger.logRequest(req.method, path, res.statusCode, duration, req.headers['user-id']);
            // Also send the log to the debug stream
            debugStream.broadcast({
                timestamp: new Date().toISOString(),
                message: logLine
            });
        }
    });
    next();
});
(async () => {
    try {
        enhanced_logger_js_1.enhancedLogger.info('Registering API routes', 'server');
        await (0, routes_1.registerRoutes)(app);
        enhanced_logger_js_1.enhancedLogger.info('Initializing real-time AI streaming', 'server');
        (0, real_time_streaming_1.initializeRealTimeAIStreaming)(server);
        enhanced_logger_js_1.enhancedLogger.info('Starting autopilot agent', 'autopilot');
        autopilot_agent_1.autopilotAgent.start();
        const selfImprovingSystem = (0, self_improving_ai_1.getSelfImprovingAISystem)();
        enhanced_logger_js_1.enhancedLogger.info('Starting self-improving AI system', 'ai');
        selfImprovingSystem.start();
        // Run a self-improvement cycle shortly after startup
        setTimeout(() => {
            enhanced_logger_js_1.enhancedLogger.info('Running initial self-improvement cycle', 'ai');
            selfImprovingSystem.runImprovementCycle();
        }, 10000);
        enhanced_logger_js_1.enhancedLogger.info('Server initialization completed successfully', 'server');
    }
    catch (error) {
        enhanced_logger_js_1.enhancedLogger.error('Failed to initialize server', 'server', undefined, error);
        process.exit(1);
    }
    app.use((err, _req, res, _next) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        // Enhanced error logging
        enhanced_logger_js_1.enhancedLogger.error(`HTTP Error ${status}: ${message}`, 'http', {
            status,
            url: _req.url,
            method: _req.method
        }, err);
        // Also send the error to the debug stream
        debugStream.broadcast({
            timestamp: new Date().toISOString(),
            error: message,
            status: status,
        });
        res.status(status).json({ message });
        throw err;
    });
    if (app.get("env") === "development") {
        await (0, vite_1.setupVite)(app, server);
    }
    else {
        (0, vite_1.serveStatic)(app);
    }
    const port = parseInt(process.env.PORT || '5000', 10);
    server.listen({
        port,
        host: "0.0.0.0",
        reusePort: true,
    }, async () => {
        (0, vite_1.log)(`🚀 Amrikyy server running on port ${port}`);
        enhanced_logger_js_1.enhancedLogger.info(`Amrikyy Server started on port ${port}`, 'server', {
            port,
            host: '0.0.0.0',
            environment: app.get('env')
        });
        // Initialize real-time AI streaming
        try {
            const streaming = await (0, real_time_streaming_1.initializeRealTimeAIStreaming)({
                port: port,
                path: '/ws',
                enableCompression: true
            });
            (0, vite_1.log)('✅ Real-time AI streaming initialized');
            enhanced_logger_js_1.enhancedLogger.info('Real-time AI streaming initialized successfully', 'streaming');
        }
        catch (error) {
            (0, vite_1.log)(`❌ Failed to initialize real-time AI streaming: ${error}`);
            enhanced_logger_js_1.enhancedLogger.error('Failed to initialize real-time AI streaming', 'streaming', undefined, error);
        }
    });
})();
