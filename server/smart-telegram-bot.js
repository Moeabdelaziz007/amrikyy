"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartLearningTelegramBot = void 0;
exports.initializeSmartTelegramBot = initializeSmartTelegramBot;
exports.getSmartTelegramBot = getSmartTelegramBot;
const telegraf_1 = require("telegraf");
const smart_learning_ai_js_1 = require("./smart-learning-ai.js");
const advanced_ai_tools_js_1 = require("./advanced-ai-tools.js");
const advanced_ai_agents_js_1 = require("./advanced-ai-agents.js");
const mcp_protocol_js_1 = require("./mcp-protocol.js");
// ... (rest of the interfaces remain the same)
class SmartLearningTelegramBot {
    // ... (rest of the properties remain the same)
    constructor(token) {
        this.bot = new telegraf_1.Telegraf(token);
        this.smartLearningAI = (0, smart_learning_ai_js_1.getSmartLearningAI)();
        this.aiToolsManager = (0, advanced_ai_tools_js_1.getAdvancedAIToolsManager)();
        this.aiAgentSystem = (0, advanced_ai_agents_js_1.getAdvancedAIAgentSystem)();
        this.mcpProtocol = (0, mcp_protocol_js_1.getMCPProtocol)();
        this.setupBot();
        this.initializeLearningCapabilities();
    }
    setupBot() {
        // ... (rest of the commands remain the same)
        this.bot.command('test_learning', this.handleTestLearningCommand.bind(this));
        // ... (rest of the message handlers remain the same)
    }
    // ... (rest of the functions remain the same)
    async handleTestLearningCommand(ctx) {
        const chatId = ctx.chat.id;
        const userContext = this.userContexts.get(chatId);
        if (!userContext) {
            await ctx.reply('Please start the bot first with /start');
            return;
        }
        await ctx.reply('Initiating learning loop test...');
        try {
            const testContext = {
                userId: userContext.userId,
                sessionId: `telegram_${userContext.chatId}`,
                taskType: 'test_scenario',
                inputData: 'This is a test of the learning loop.',
                expectedOutput: 'A successful test confirmation.',
                timestamp: new Date(),
                metadata: {
                    platform: 'telegram',
                    testName: 'learning_loop_verification'
                }
            };
            const result = await this.smartLearningAI.processLearningRequest(testContext);
            await ctx.reply(`Learning loop test completed!\n\nResult:\n- Success: ${result.success}\n- Confidence: ${result.confidence.toFixed(2)}\n- Strategy: ${result.strategy}\n- Explanation: ${result.explanation}\n\nThe AI processed the test scenario and updated its learning state.`);
        }
        catch (error) {
            await ctx.reply(`Learning loop test failed: ${error.message}`);
        }
    }
    async handleTextMessage(ctx) {
        const chatId = ctx.chat.id;
        const userContext = this.userContexts.get(chatId);
        const messageText = ctx.message?.text || '';
        if (!userContext) {
            await ctx.reply('Please start the bot first with /start');
            return;
        }
        try {
            // Process message with AI
            const response = await this.processMessageWithAI(userContext, messageText);
            // Send response
            await ctx.reply(response.text, {
                reply_markup: response.keyboard ? { inline_keyboard: response.keyboard } : undefined
            });
            // Store interaction
            await this.storeInteraction(userContext, 'text', 'user', messageText);
            await this.storeInteraction(userContext, 'text', 'bot', response.text);
            // Learn from interaction
            await this.learnFromInteraction(userContext, messageText, response);
        }
        catch (error) {
            await ctx.reply('An error occurred while processing your message. Please try again later.');
            console.error('Error in handleTextMessage:', error);
        }
    }
}
exports.SmartLearningTelegramBot = SmartLearningTelegramBot;
// Export singleton instance
let smartTelegramBot = null;
function initializeSmartTelegramBot(token) {
    if (!smartTelegramBot) {
        smartTelegramBot = new SmartLearningTelegramBot(token);
    }
    return smartTelegramBot;
}
function getSmartTelegramBot() {
    return smartTelegramBot;
}
