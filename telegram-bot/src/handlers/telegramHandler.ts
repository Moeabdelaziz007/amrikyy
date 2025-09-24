import { EventSchema } from '../services/messageBroker.js';
import { logger } from '../utils/logger.js';
import TelegramBot from 'node-telegram-bot-api';

export class TelegramHandler {
  private bot: TelegramBot;

  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || '', { polling: false });
  }

  async handleEvent(event: EventSchema): Promise<void> {
    logger.info(`Telegram Bot: Processing event: ${event.event_id}`, { event });

    try {
      switch (event.type) {
        case 'send-message':
          await this.handleSendMessage(event);
          break;
        case 'send-notification':
          await this.handleSendNotification(event);
          break;
        case 'send-alert':
          await this.handleSendAlert(event);
          break;
        case 'send-report':
          await this.handleSendReport(event);
          break;
        case 'ai-response':
          await this.handleAIResponse(event);
          break;
        case 'task-completed':
          await this.handleTaskCompleted(event);
          break;
        case 'workflow-triggered':
          await this.handleWorkflowTriggered(event);
          break;
        default:
          logger.warn(`Telegram Bot: Unknown event type: ${event.type}`);
      }
    } catch (error) {
      logger.error(`Telegram Bot: Error handling event ${event.event_id}:`, error);
      throw error;
    }
  }

  private async handleSendMessage(event: EventSchema): Promise<void> {
    const { chatId, message, messageType = 'text', options = {} } = event.payload;

    logger.info(`Telegram Bot: Sending message to ${chatId}`, { messageType });

    try {
      let sentMessage;
      switch (messageType) {
        case 'text':
          sentMessage = await this.bot.sendMessage(chatId, message, options);
          break;
        case 'photo':
          sentMessage = await this.bot.sendPhoto(chatId, message, options);
          break;
        case 'document':
          sentMessage = await this.bot.sendDocument(chatId, message, options);
          break;
        case 'video':
          sentMessage = await this.bot.sendVideo(chatId, message, options);
          break;
        case 'audio':
          sentMessage = await this.bot.sendAudio(chatId, message, options);
          break;
        default:
          sentMessage = await this.bot.sendMessage(chatId, message, options);
      }

      logger.info(`Telegram Bot: Message sent successfully`, { 
        chatId, 
        messageId: sentMessage.message_id 
      });

      // Publish confirmation event
      await this.publishConfirmationEvent(event, 'message-sent', {
        chatId,
        messageId: sentMessage.message_id,
        status: 'success'
      });

    } catch (error) {
      logger.error(`Telegram Bot: Failed to send message to ${chatId}:`, error);
      
      // Publish error event
      await this.publishConfirmationEvent(event, 'message-failed', {
        chatId,
        status: 'error',
        error: error.message
      });
    }
  }

  private async handleSendNotification(event: EventSchema): Promise<void> {
    const { chatId, title, message, priority = 'normal' } = event.payload;

    logger.info(`Telegram Bot: Sending notification to ${chatId}`, { title, priority });

    try {
      const notificationText = `🔔 *${title}*\n\n${message}`;
      
      const sentMessage = await this.bot.sendMessage(chatId, notificationText, {
        parse_mode: 'Markdown',
        disable_notification: priority === 'low'
      });

      logger.info(`Telegram Bot: Notification sent successfully`, { 
        chatId, 
        messageId: sentMessage.message_id 
      });

      // Publish confirmation event
      await this.publishConfirmationEvent(event, 'notification-sent', {
        chatId,
        messageId: sentMessage.message_id,
        status: 'success'
      });

    } catch (error) {
      logger.error(`Telegram Bot: Failed to send notification to ${chatId}:`, error);
      
      // Publish error event
      await this.publishConfirmationEvent(event, 'notification-failed', {
        chatId,
        status: 'error',
        error: error.message
      });
    }
  }

  private async handleSendAlert(event: EventSchema): Promise<void> {
    const { chatId, alertType, severity, message, details } = event.payload;

    logger.info(`Telegram Bot: Sending alert to ${chatId}`, { alertType, severity });

    try {
      const severityEmoji = this.getSeverityEmoji(severity);
      const alertText = `${severityEmoji} *ALERT: ${alertType}*\n\n${message}\n\n${details || ''}`;
      
      const sentMessage = await this.bot.sendMessage(chatId, alertText, {
        parse_mode: 'Markdown',
        disable_notification: false
      });

      logger.info(`Telegram Bot: Alert sent successfully`, { 
        chatId, 
        messageId: sentMessage.message_id 
      });

      // Publish confirmation event
      await this.publishConfirmationEvent(event, 'alert-sent', {
        chatId,
        messageId: sentMessage.message_id,
        status: 'success'
      });

    } catch (error) {
      logger.error(`Telegram Bot: Failed to send alert to ${chatId}:`, error);
      
      // Publish error event
      await this.publishConfirmationEvent(event, 'alert-failed', {
        chatId,
        status: 'error',
        error: error.message
      });
    }
  }

  private async handleSendReport(event: EventSchema): Promise<void> {
    const { chatId, reportType, data, format = 'text' } = event.payload;

    logger.info(`Telegram Bot: Sending report to ${chatId}`, { reportType, format });

    try {
      let reportContent;
      if (format === 'json') {
        reportContent = `📊 *${reportType} Report*\n\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``;
      } else {
        reportContent = `📊 *${reportType} Report*\n\n${this.formatReportData(data)}`;
      }
      
      const sentMessage = await this.bot.sendMessage(chatId, reportContent, {
        parse_mode: 'Markdown'
      });

      logger.info(`Telegram Bot: Report sent successfully`, { 
        chatId, 
        messageId: sentMessage.message_id 
      });

      // Publish confirmation event
      await this.publishConfirmationEvent(event, 'report-sent', {
        chatId,
        messageId: sentMessage.message_id,
        status: 'success'
      });

    } catch (error) {
      logger.error(`Telegram Bot: Failed to send report to ${chatId}:`, error);
      
      // Publish error event
      await this.publishConfirmationEvent(event, 'report-failed', {
        chatId,
        status: 'error',
        error: error.message
      });
    }
  }

  private async handleAIResponse(event: EventSchema): Promise<void> {
    const { chatId, response, context } = event.payload;

    logger.info(`Telegram Bot: Sending AI response to ${chatId}`);

    try {
      const responseText = `🤖 *AI Response*\n\n${response}\n\n${context ? `*Context:* ${context}` : ''}`;
      
      const sentMessage = await this.bot.sendMessage(chatId, responseText, {
        parse_mode: 'Markdown'
      });

      logger.info(`Telegram Bot: AI response sent successfully`, { 
        chatId, 
        messageId: sentMessage.message_id 
      });

      // Publish confirmation event
      await this.publishConfirmationEvent(event, 'ai-response-sent', {
        chatId,
        messageId: sentMessage.message_id,
        status: 'success'
      });

    } catch (error) {
      logger.error(`Telegram Bot: Failed to send AI response to ${chatId}:`, error);
      
      // Publish error event
      await this.publishConfirmationEvent(event, 'ai-response-failed', {
        chatId,
        status: 'error',
        error: error.message
      });
    }
  }

  private async handleTaskCompleted(event: EventSchema): Promise<void> {
    const { chatId, taskId, result, status } = event.payload;

    logger.info(`Telegram Bot: Sending task completion notification to ${chatId}`, { taskId, status });

    try {
      const statusEmoji = status === 'success' ? '✅' : '❌';
      const completionText = `${statusEmoji} *Task Completed*\n\n*Task ID:* ${taskId}\n*Status:* ${status}\n*Result:* ${result}`;
      
      const sentMessage = await this.bot.sendMessage(chatId, completionText, {
        parse_mode: 'Markdown'
      });

      logger.info(`Telegram Bot: Task completion notification sent successfully`, { 
        chatId, 
        messageId: sentMessage.message_id 
      });

      // Publish confirmation event
      await this.publishConfirmationEvent(event, 'task-notification-sent', {
        chatId,
        messageId: sentMessage.message_id,
        status: 'success'
      });

    } catch (error) {
      logger.error(`Telegram Bot: Failed to send task completion notification to ${chatId}:`, error);
      
      // Publish error event
      await this.publishConfirmationEvent(event, 'task-notification-failed', {
        chatId,
        status: 'error',
        error: error.message
      });
    }
  }

  private async handleWorkflowTriggered(event: EventSchema): Promise<void> {
    const { chatId, workflowId, result } = event.payload;

    logger.info(`Telegram Bot: Sending workflow trigger notification to ${chatId}`, { workflowId });

    try {
      const workflowText = `🔄 *Workflow Triggered*\n\n*Workflow ID:* ${workflowId}\n*Result:* ${result}`;
      
      const sentMessage = await this.bot.sendMessage(chatId, workflowText, {
        parse_mode: 'Markdown'
      });

      logger.info(`Telegram Bot: Workflow trigger notification sent successfully`, { 
        chatId, 
        messageId: sentMessage.message_id 
      });

      // Publish confirmation event
      await this.publishConfirmationEvent(event, 'workflow-notification-sent', {
        chatId,
        messageId: sentMessage.message_id,
        status: 'success'
      });

    } catch (error) {
      logger.error(`Telegram Bot: Failed to send workflow trigger notification to ${chatId}:`, error);
      
      // Publish error event
      await this.publishConfirmationEvent(event, 'workflow-notification-failed', {
        chatId,
        status: 'error',
        error: error.message
      });
    }
  }

  private getSeverityEmoji(severity: string): string {
    switch (severity.toLowerCase()) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '🔶';
      case 'low': return 'ℹ️';
      default: return '📢';
    }
  }

  private formatReportData(data: any): string {
    if (typeof data === 'object') {
      return Object.entries(data)
        .map(([key, value]) => `*${key}:* ${value}`)
        .join('\n');
    }
    return String(data);
  }

  private async publishConfirmationEvent(originalEvent: EventSchema, confirmationType: string, confirmationData: any): Promise<void> {
    try {
      const { messageBroker } = await import('../services/messageBroker.js');
      
      await messageBroker.publishEvent({
        source: 'telegram-bot',
        type: confirmationType,
        payload: confirmationData,
        correlation_id: originalEvent.correlation_id
      });

      logger.info(`Telegram Bot: Confirmation event published: ${confirmationType}`);
    } catch (error) {
      logger.error('Telegram Bot: Failed to publish confirmation event:', error);
    }
  }
}

export const telegramHandler = new TelegramHandler();
