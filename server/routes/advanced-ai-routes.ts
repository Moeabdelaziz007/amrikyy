/**
 * 🎯 Advanced AI Routes for AuraOS
 * مسارات الذكاء الاصطناعي المتقدم
 */

import { Router } from 'express';
import { getAdvancedGeminiIntegration } from '../advanced-ai-integration.js';
import { getAdvancedAIToolsManager } from '../advanced-ai-integration.js';
import { getMultiModalAIEngine } from '../multi-modal-ai-engine.js';
import { getAdvancedAutomationEngine } from '../advanced-automation-engine.js';
import { getIntelligentWorkflowOrchestrator } from '../intelligent-workflow-orchestrator.js';
import { getAutopilotAgent } from '../autopilot-agent.js';
import { getLogger } from '../enhanced-logger.js';

const router = Router();
const logger = getLogger();

// Advanced Gemini AI Routes
router.post('/gemini/generate-content', async (req, res) => {
  try {
    const { prompt, model } = req.body;
    const gemini = getAdvancedGeminiIntegration();
    const result = await gemini.generateContent(prompt, model);
    
    logger.info('Content generated via Gemini', 'api', { prompt: prompt.substring(0, 100) });
    res.json({ success: true, content: result });
  } catch (error) {
    logger.error('Failed to generate content', 'api', {}, error as Error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.post('/gemini/generate-post', async (req, res) => {
  try {
    const { topic, mood } = req.body;
    const gemini = getAdvancedGeminiIntegration();
    const result = await gemini.generatePostContent(topic, mood);
    
    logger.info('Social media post generated', 'api', { topic, mood });
    res.json({ success: true, post: result });
  } catch (error) {
    logger.error('Failed to generate post', 'api', {}, error as Error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.post('/gemini/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const gemini = getAdvancedGeminiIntegration();
    const result = await gemini.chatWithAssistant(messages);
    
    logger.info('Chat response generated', 'api', { messageCount: messages.length });
    res.json({ success: true, response: result });
  } catch (error) {
    logger.error('Failed to generate chat response', 'api', {}, error as Error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.post('/gemini/analyze-workflow', async (req, res) => {
  try {
    const { workflowConfig } = req.body;
    const gemini = getAdvancedGeminiIntegration();
    const result = await gemini.analyzeWorkflow(workflowConfig);
    
    logger.info('Workflow analyzed', 'api', { workflowId: workflowConfig.id });
    res.json({ success: true, analysis: result });
  } catch (error) {
    logger.error('Failed to analyze workflow', 'api', {}, error as Error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Advanced AI Tools Routes
router.get('/tools', async (req, res) => {
  try {
    const toolsManager = getAdvancedAIToolsManager();
    const tools = toolsManager.getAllTools();
    
    res.json({ success: true, tools });
  } catch (error) {
    logger.error('Failed to get tools', 'api', {}, error as Error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.get('/tools/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const toolsManager = getAdvancedAIToolsManager();
    const tools = toolsManager.getToolsByCategory(category);
    
    res.json({ success: true, tools });
  } catch (error) {
    logger.error('Failed to get tools by category', 'api', {}, error as Error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.post('/tools/:toolId/execute', async (req, res) => {
  try {
    const { toolId } = req.params;
    const { params } = req.body;
    const toolsManager = getAdvancedAIToolsManager();
    const result = await toolsManager.runTool(toolId, params);
    
    logger.info('Tool executed', 'api', { toolId, params });
    res.json({ success: true, result });
  } catch (error) {
    logger.error('Failed to execute tool', 'api', {}, error as Error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Multi-Modal AI Routes
router.get('/models', async (req, res) => {
  try {
    const multiModalEngine = getMultiModalAIEngine();
    const models = multiModalEngine.getAllModels();
    
    res.json({ success: true, models });
  } catch (error) {
    logger.error('Failed to get models', 'api', {}, error as Error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.post('/process-multimodal', async (req, res) => {
  try {
    const { input, modelId } = req.body;
    const multiModalEngine = getMultiModalAIEngine();
    const result = await multiModalEngine.processMultiModal(input, modelId);
    
    logger.info('Multi-modal input processed', 'api', { type: input.type, modelId });
    res.json({ success: true, result });
  } catch (error) {
    logger.error('Failed to process multi-modal input', 'api', {}, error as Error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.post('/streaming/start', async (req, res) => {
  try {
    const { userId, modelId } = req.body;
    const multiModalEngine = getMultiModalAIEngine();
    const sessionId = await multiModalEngine.startStreamingSession(userId, modelId);
    
    logger.info('Streaming session started', 'api', { userId, modelId, sessionId });
    res.json({ success: true, sessionId });
  } catch (error) {
    logger.error('Failed to start streaming session', 'api', {}, error as Error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Automation Engine Routes
router.get('/automation/stats', async (req, res) => {
  try {
    const automationEngine = getAdvancedAutomationEngine();
    const stats = automationEngine.getAutomationStats();
    
    res.json({ success: true, stats });
  } catch (error) {
    logger.error('Failed to get automation stats', 'api', {}, error as Error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.get('/automation/status', async (req, res) => {
  try {
    const automationEngine = getAdvancedAutomationEngine();
    const status = automationEngine.getLiveStatus();
    
    res.json({ success: true, status });
  } catch (error) {
    logger.error('Failed to get automation status', 'api', {}, error as Error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.post('/automation/emergency-stop', async (req, res) => {
  try {
    const { stop } = req.body;
    const automationEngine = getAdvancedAutomationEngine();
    automationEngine.setEmergencyStop(stop);
    
    logger.info('Emergency stop toggled', 'api', { stop });
    res.json({ success: true, message: `Emergency stop ${stop ? 'activated' : 'deactivated'}` });
  } catch (error) {
    logger.error('Failed to toggle emergency stop', 'api', {}, error as Error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Workflow Orchestrator Routes
router.get('/workflows', async (req, res) => {
  try {
    const orchestrator = getIntelligentWorkflowOrchestrator();
    const stats = orchestrator.getWorkflowStats();
    
    res.json({ success: true, workflows: stats });
  } catch (error) {
    logger.error('Failed to get workflows', 'api', {}, error as Error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.post('/workflows/create', async (req, res) => {
  try {
    const { name, type, steps, triggers } = req.body;
    const orchestrator = getIntelligentWorkflowOrchestrator();
    const workflow = await orchestrator.createCustomWorkflow(name, type, steps, triggers);
    
    logger.info('Custom workflow created', 'api', { workflowId: workflow.id, name });
    res.json({ success: true, workflow });
  } catch (error) {
    logger.error('Failed to create workflow', 'api', {}, error as Error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.post('/workflows/:workflowId/pause', async (req, res) => {
  try {
    const { workflowId } = req.params;
    const orchestrator = getIntelligentWorkflowOrchestrator();
    const success = orchestrator.pauseWorkflow(workflowId);
    
    if (success) {
      logger.info('Workflow paused', 'api', { workflowId });
      res.json({ success: true, message: 'Workflow paused successfully' });
    } else {
      res.status(404).json({ success: false, error: 'Workflow not found' });
    }
  } catch (error) {
    logger.error('Failed to pause workflow', 'api', {}, error as Error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.post('/workflows/:workflowId/resume', async (req, res) => {
  try {
    const { workflowId } = req.params;
    const orchestrator = getIntelligentWorkflowOrchestrator();
    const success = orchestrator.resumeWorkflow(workflowId);
    
    if (success) {
      logger.info('Workflow resumed', 'api', { workflowId });
      res.json({ success: true, message: 'Workflow resumed successfully' });
    } else {
      res.status(404).json({ success: false, error: 'Workflow not found' });
    }
  } catch (error) {
    logger.error('Failed to resume workflow', 'api', {}, error as Error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Autopilot Agent Routes
router.get('/autopilot/status', async (req, res) => {
  try {
    const autopilot = getAutopilotAgent();
    const status = autopilot.getStatus();
    
    res.json({ success: true, status });
  } catch (error) {
    logger.error('Failed to get autopilot status', 'api', {}, error as Error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.post('/autopilot/configure', async (req, res) => {
  try {
    const { settings } = req.body;
    const autopilot = getAutopilotAgent();
    autopilot.configure(settings);
    
    logger.info('Autopilot configured', 'api', { settings });
    res.json({ success: true, message: 'Autopilot configured successfully' });
  } catch (error) {
    logger.error('Failed to configure autopilot', 'api', {}, error as Error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;
