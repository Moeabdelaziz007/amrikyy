// =============================================================================
// 🚀 AuraOS Service Initializer
// =============================================================================
// 
// Centralized service initialization and management
// Handles dependency injection and service lifecycle
//
// =============================================================================

import { getLogger } from './lib/advanced-logger.js';

// Import all services
import { initializeTelegramBot, getTelegramService } from './telegram.js';
import { initializeSmartTelegramBot, getSmartTelegramBot } from './smart-telegram-bot.js';
import { getTravelFoodServiceManager } from './travel-food-services.js';
import { getSmartLearningAI } from './smart-learning-ai.js';
import { getMCPProtocol, initializeMCP } from './mcp-protocol.js';
import { getAdvancedAIToolsManager } from './advanced-ai-tools.js';
import { getAdvancedAIAgentSystem } from './advanced-ai-agents.js';
import { getAdvancedAutomationEngine } from './advanced-automation.js';
import { getIntelligentWorkflowOrchestrator } from './intelligent-workflow.js';
import { initializeMultiModalAI, getMultiModalAIEngine } from './multi-modal-ai.js';
import { initializeRealTimeAIStreaming, getRealTimeAIStreaming } from './real-time-streaming.js';
import { initializeAIModelManagement, getAIModelManagementSystem } from './ai-model-management.js';
import { initializeLearningSystem, getLearningSystem } from './learning-automation.js';
import { getEnterpriseTeamManager } from './enterprise-team-management.js';
import { getEnterpriseAdminDashboard } from './enterprise-admin-dashboard.js';
import { getEnterpriseCollaborationSystem } from './enterprise-collaboration.js';
import { getEnhancedTravelAgency } from './enhanced-travel-agency.js';
import { getTravelDashboard } from './travel-dashboard.js';
import { getN8nNodeSystem } from './n8n-node-system.js';

// =============================================================================
// 🔧 Service Registry
// =============================================================================

interface ServiceRegistry {
  telegramBot: any;
  smartTelegramBot: any;
  travelFoodService: any;
  smartLearningAI: any;
  mcpProtocol: any;
  advancedAITools: any;
  advancedAIAgents: any;
  advancedAutomation: any;
  intelligentWorkflow: any;
  multiModalAI: any;
  realTimeAIStreaming: any;
  aiModelManagement: any;
  learningSystem: any;
  enterpriseTeamManager: any;
  enterpriseAdminDashboard: any;
  enterpriseCollaboration: any;
  enhancedTravelAgency: any;
  travelDashboard: any;
  n8nNodeSystem: any;
}

class ServiceManager {
  private services: Partial<ServiceRegistry> = {};
  private logger = getLogger();
  private isInitialized = false;

  // =============================================================================
  // 🚀 Initialize All Services
  // =============================================================================

  async initializeServices(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('Services already initialized');
      return;
    }

    this.logger.info('Starting service initialization...');

    try {
      // Initialize core services
      await this.initializeCoreServices();
      
      // Initialize AI services
      await this.initializeAIServices();
      
      // Initialize automation services
      await this.initializeAutomationServices();
      
      // Initialize enterprise services
      await this.initializeEnterpriseServices();
      
      // Initialize travel services
      await this.initializeTravelServices();

      this.isInitialized = true;
      this.logger.info('All services initialized successfully');

    } catch (error) {
      this.logger.error('Service initialization failed', { error });
      throw error;
    }
  }

  // =============================================================================
  // 🔧 Core Services
  // =============================================================================

  private async initializeCoreServices(): Promise<void> {
    this.logger.info('Initializing core services...');

    try {
      // Initialize Telegram Bot
      await initializeTelegramBot();
      this.services.telegramBot = getTelegramService();
      this.logger.info('Telegram Bot service initialized');

      // Initialize Smart Telegram Bot
      await initializeSmartTelegramBot();
      this.services.smartTelegramBot = getSmartTelegramBot();
      this.logger.info('Smart Telegram Bot service initialized');

      // Initialize MCP Protocol
      await initializeMCP();
      this.services.mcpProtocol = getMCPProtocol();
      this.logger.info('MCP Protocol service initialized');

    } catch (error) {
      this.logger.error('Core services initialization failed', { error });
      throw error;
    }
  }

  // =============================================================================
  // 🤖 AI Services
  // =============================================================================

  private async initializeAIServices(): Promise<void> {
    this.logger.info('Initializing AI services...');

    try {
      // Initialize Multi-Modal AI
      await initializeMultiModalAI();
      this.services.multiModalAI = getMultiModalAIEngine();
      this.logger.info('Multi-Modal AI service initialized');

      // Initialize Real-Time AI Streaming
      await initializeRealTimeAIStreaming();
      this.services.realTimeAIStreaming = getRealTimeAIStreaming();
      this.logger.info('Real-Time AI Streaming service initialized');

      // Initialize AI Model Management
      await initializeAIModelManagement();
      this.services.aiModelManagement = getAIModelManagementSystem();
      this.logger.info('AI Model Management service initialized');

      // Initialize Learning System
      await initializeLearningSystem();
      this.services.learningSystem = getLearningSystem();
      this.logger.info('Learning System service initialized');

      // Initialize other AI services
      this.services.smartLearningAI = getSmartLearningAI();
      this.services.advancedAITools = getAdvancedAIToolsManager();
      this.services.advancedAIAgents = getAdvancedAIAgentSystem();

      this.logger.info('AI services initialized successfully');

    } catch (error) {
      this.logger.error('AI services initialization failed', { error });
      throw error;
    }
  }

  // =============================================================================
  // ⚙️ Automation Services
  // =============================================================================

  private async initializeAutomationServices(): Promise<void> {
    this.logger.info('Initializing automation services...');

    try {
      this.services.advancedAutomation = getAdvancedAutomationEngine();
      this.services.intelligentWorkflow = getIntelligentWorkflowOrchestrator();
      this.services.n8nNodeSystem = getN8nNodeSystem();

      this.logger.info('Automation services initialized successfully');

    } catch (error) {
      this.logger.error('Automation services initialization failed', { error });
      throw error;
    }
  }

  // =============================================================================
  // 🏢 Enterprise Services
  // =============================================================================

  private async initializeEnterpriseServices(): Promise<void> {
    this.logger.info('Initializing enterprise services...');

    try {
      this.services.enterpriseTeamManager = getEnterpriseTeamManager();
      this.services.enterpriseAdminDashboard = getEnterpriseAdminDashboard();
      this.services.enterpriseCollaboration = getEnterpriseCollaborationSystem();

      this.logger.info('Enterprise services initialized successfully');

    } catch (error) {
      this.logger.error('Enterprise services initialization failed', { error });
      throw error;
    }
  }

  // =============================================================================
  // ✈️ Travel Services
  // =============================================================================

  private async initializeTravelServices(): Promise<void> {
    this.logger.info('Initializing travel services...');

    try {
      this.services.travelFoodService = getTravelFoodServiceManager();
      this.services.enhancedTravelAgency = getEnhancedTravelAgency();
      this.services.travelDashboard = getTravelDashboard();

      this.logger.info('Travel services initialized successfully');

    } catch (error) {
      this.logger.error('Travel services initialization failed', { error });
      throw error;
    }
  }

  // =============================================================================
  // 📋 Service Access Methods
  // =============================================================================

  getService<T extends keyof ServiceRegistry>(serviceName: T): ServiceRegistry[T] {
    if (!this.isInitialized) {
      throw new Error('Services not initialized. Call initializeServices() first.');
    }

    const service = this.services[serviceName];
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }

    return service;
  }

  getAllServices(): Partial<ServiceRegistry> {
    if (!this.isInitialized) {
      throw new Error('Services not initialized. Call initializeServices() first.');
    }

    return { ...this.services };
  }

  // =============================================================================
  // 🔄 Service Health Check
  // =============================================================================

  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; services: Record<string, boolean> }> {
    const services: Record<string, boolean> = {};
    let allHealthy = true;

    for (const [serviceName, service] of Object.entries(this.services)) {
      try {
        // Check if service has health check method
        if (typeof service === 'object' && service !== null && 'healthCheck' in service) {
          const health = await (service as any).healthCheck();
          services[serviceName] = health.status === 'healthy';
        } else {
          // Basic check - if service exists, consider it healthy
          services[serviceName] = !!service;
        }

        if (!services[serviceName]) {
          allHealthy = false;
        }
      } catch (error) {
        this.logger.error(`Health check failed for service ${serviceName}`, { error });
        services[serviceName] = false;
        allHealthy = false;
      }
    }

    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      services,
    };
  }

  // =============================================================================
  // 🔄 Service Cleanup
  // =============================================================================

  async cleanup(): Promise<void> {
    this.logger.info('Cleaning up services...');

    for (const [serviceName, service] of Object.entries(this.services)) {
      try {
        // Check if service has cleanup method
        if (typeof service === 'object' && service !== null && 'cleanup' in service) {
          await (service as any).cleanup();
        }
        this.logger.info(`Service ${serviceName} cleaned up`);
      } catch (error) {
        this.logger.error(`Cleanup failed for service ${serviceName}`, { error });
      }
    }

    this.services = {};
    this.isInitialized = false;
    this.logger.info('All services cleaned up');
  }
}

// =============================================================================
// 🚀 Singleton Instance
// =============================================================================

let serviceManagerInstance: ServiceManager | null = null;

export function getServiceManager(): ServiceManager {
  if (!serviceManagerInstance) {
    serviceManagerInstance = new ServiceManager();
  }
  return serviceManagerInstance;
}

export async function initializeServices(): Promise<void> {
  const serviceManager = getServiceManager();
  await serviceManager.initializeServices();
}

export function getService<T extends keyof ServiceRegistry>(serviceName: T): ServiceRegistry[T] {
  const serviceManager = getServiceManager();
  return serviceManager.getService(serviceName);
}

export function getAllServices(): Partial<ServiceRegistry> {
  const serviceManager = getServiceManager();
  return serviceManager.getAllServices();
}

export async function healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; services: Record<string, boolean> }> {
  const serviceManager = getServiceManager();
  return await serviceManager.healthCheck();
}

export async function cleanupServices(): Promise<void> {
  const serviceManager = getServiceManager();
  await serviceManager.cleanup();
}

export default ServiceManager;
