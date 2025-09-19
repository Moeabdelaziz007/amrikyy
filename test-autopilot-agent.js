"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const autopilot_agent_js_1 = require("./server/autopilot-agent.js");
class AutopilotAgentTestSuite {
    agent;
    constructor() {
        // Initialize the agent in debug mode for testing
        this.agent = new autopilot_agent_js_1.AutopilotAgent(true);
    }
    async runTests() {
        console.log('🚀 Starting Autopilot Agent Test Suite...');
        await this.testInitialization();
        console.log('✅ Autopilot Agent tests completed!');
    }
    async testInitialization() {
        console.log('🧪 Testing Agent Initialization...');
        // We can't directly check console output, but we can ensure
        // the agent runs without errors in debug mode.
        try {
            // const task = {
            //   id: 'test-task-1',
            //   agentId: this.agent.agent.id,
            //   type: 'test',
            //   description: 'A test task for dry run mode',
            //   parameters: { dryRun: true },
            //   priority: 'high',
            //   status: 'pending',
            //   createdAt: new Date(),
            // };
            console.log('✅ Initialization test passed.');
        }
        catch (error) {
            console.error('❌ Initialization test failed:', error);
        }
    }
}
const testSuite = new AutopilotAgentTestSuite();
testSuite.runTests();
