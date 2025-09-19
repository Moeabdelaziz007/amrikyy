"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autopilotAgent = exports.AutopilotAgent = void 0;
const advanced_ai_agents_js_1 = require("./advanced-ai-agents.js");
const firestore_1 = require("firebase-admin/firestore");
class AutopilotAgent {
    agentSystem;
    agent;
    db;
    debug;
    constructor(debug = false) {
        this.debug = debug;
        this.agentSystem = (0, advanced_ai_agents_js_1.getAdvancedAIAgentSystem)();
        this.agent = this.agentSystem.createAgent({
            name: 'Autopilot Agent',
            description: 'An advanced AI agent that autonomously manages and optimizes complex projects.',
            // ... (rest of the agent configuration)
        });
        try {
            this.db = (0, firestore_1.getFirestore)();
            if (this.debug) {
                console.log('Firestore initialized successfully.');
            }
        }
        catch (error) {
            console.error('Error initializing Firestore:', error);
        }
        if (this.debug) {
            console.log('Autopilot Agent initialized in debug mode.');
        }
    }
}
exports.AutopilotAgent = AutopilotAgent;
exports.autopilotAgent = new AutopilotAgent(process.env.NODE_ENV === 'development');
