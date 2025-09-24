import { EventSchema } from '../services/messageBroker.js';
import { logger } from '../utils/logger.js';
import axios from 'axios';

export class AutopilotHandler {
  private autopilotApiUrl: string;
  private autopilotApiKey: string;

  constructor() {
    this.autopilotApiUrl = process.env.AUTOPILOT_API_URL || 'http://localhost:3000';
    this.autopilotApiKey = process.env.AUTOPILOT_API_KEY || 'default-key';
  }

  async handleEvent(event: EventSchema): Promise<void> {
    logger.info(`Autopilot Service: Processing event: ${event.event_id}`, { event });

    try {
      switch (event.type) {
        case 'task-execution':
          await this.handleTaskExecution(event);
          break;
        case 'workflow-trigger':
          await this.handleWorkflowTrigger(event);
          break;
        case 'ai-request':
          await this.handleAIRequest(event);
          break;
        case 'monitoring-alert':
          await this.handleMonitoringAlert(event);
          break;
        default:
          logger.warn(`Autopilot Service: Unknown event type: ${event.type}`);
      }
    } catch (error) {
      logger.error(`Autopilot Service: Error handling event ${event.event_id}:`, error);
      throw error;
    }
  }

  private async handleTaskExecution(event: EventSchema): Promise<void> {
    const { taskId, taskType, parameters } = event.payload;

    logger.info(`Autopilot Service: Executing task: ${taskId}`, { taskType, parameters });

    try {
      // Call Autopilot API to execute task
      const response = await axios.post(`${this.autopilotApiUrl}/api/tasks/execute`, {
        taskId,
        taskType,
        parameters,
        correlationId: event.correlation_id
      }, {
        headers: {
          'Authorization': `Bearer ${this.autopilotApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      logger.info(`Autopilot Service: Task executed successfully: ${taskId}`, { 
        status: response.status,
        result: response.data 
      });

      // Publish result event
      await this.publishResultEvent(event, 'task-completed', {
        taskId,
        status: 'success',
        result: response.data
      });

    } catch (error) {
      logger.error(`Autopilot Service: Task execution failed: ${taskId}`, error);
      
      // Publish error event
      await this.publishResultEvent(event, 'task-failed', {
        taskId,
        status: 'error',
        error: error.message
      });
    }
  }

  private async handleWorkflowTrigger(event: EventSchema): Promise<void> {
    const { workflowId, triggerData } = event.payload;

    logger.info(`Autopilot Service: Triggering workflow: ${workflowId}`, { triggerData });

    try {
      // Call Autopilot API to trigger workflow
      const response = await axios.post(`${this.autopilotApiUrl}/api/workflows/trigger`, {
        workflowId,
        triggerData,
        correlationId: event.correlation_id
      }, {
        headers: {
          'Authorization': `Bearer ${this.autopilotApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      logger.info(`Autopilot Service: Workflow triggered successfully: ${workflowId}`, { 
        status: response.status,
        result: response.data 
      });

      // Publish result event
      await this.publishResultEvent(event, 'workflow-triggered', {
        workflowId,
        status: 'success',
        result: response.data
      });

    } catch (error) {
      logger.error(`Autopilot Service: Workflow trigger failed: ${workflowId}`, error);
      
      // Publish error event
      await this.publishResultEvent(event, 'workflow-failed', {
        workflowId,
        status: 'error',
        error: error.message
      });
    }
  }

  private async handleAIRequest(event: EventSchema): Promise<void> {
    const { requestId, prompt, context } = event.payload;

    logger.info(`Autopilot Service: Processing AI request: ${requestId}`, { prompt, context });

    try {
      // Call Autopilot AI API
      const response = await axios.post(`${this.autopilotApiUrl}/api/ai/process`, {
        requestId,
        prompt,
        context,
        correlationId: event.correlation_id
      }, {
        headers: {
          'Authorization': `Bearer ${this.autopilotApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      logger.info(`Autopilot Service: AI request processed successfully: ${requestId}`, { 
        status: response.status,
        result: response.data 
      });

      // Publish result event
      await this.publishResultEvent(event, 'ai-response', {
        requestId,
        status: 'success',
        response: response.data
      });

    } catch (error) {
      logger.error(`Autopilot Service: AI request failed: ${requestId}`, error);
      
      // Publish error event
      await this.publishResultEvent(event, 'ai-error', {
        requestId,
        status: 'error',
        error: error.message
      });
    }
  }

  private async handleMonitoringAlert(event: EventSchema): Promise<void> {
    const { alertId, alertType, severity, message } = event.payload;

    logger.info(`Autopilot Service: Processing monitoring alert: ${alertId}`, { 
      alertType, 
      severity, 
      message 
    });

    try {
      // Process monitoring alert
      const response = await axios.post(`${this.autopilotApiUrl}/api/monitoring/alert`, {
        alertId,
        alertType,
        severity,
        message,
        correlationId: event.correlation_id
      }, {
        headers: {
          'Authorization': `Bearer ${this.autopilotApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      logger.info(`Autopilot Service: Monitoring alert processed: ${alertId}`, { 
        status: response.status,
        result: response.data 
      });

      // Publish result event
      await this.publishResultEvent(event, 'alert-processed', {
        alertId,
        status: 'success',
        result: response.data
      });

    } catch (error) {
      logger.error(`Autopilot Service: Monitoring alert failed: ${alertId}`, error);
      
      // Publish error event
      await this.publishResultEvent(event, 'alert-failed', {
        alertId,
        status: 'error',
        error: error.message
      });
    }
  }

  private async publishResultEvent(originalEvent: EventSchema, resultType: string, resultData: any): Promise<void> {
    try {
      const { messageBroker } = await import('../services/messageBroker.js');
      
      await messageBroker.publishEvent({
        source: 'autopilot-service',
        type: resultType,
        payload: resultData,
        correlation_id: originalEvent.correlation_id
      });

      logger.info(`Autopilot Service: Result event published: ${resultType}`);
    } catch (error) {
      logger.error('Autopilot Service: Failed to publish result event:', error);
    }
  }
}

export const autopilotHandler = new AutopilotHandler();
