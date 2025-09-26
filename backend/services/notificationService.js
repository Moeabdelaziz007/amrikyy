const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const socketService = require('./socketService');

class NotificationService {
  constructor() {
    this.transporter = null;
    this.initializeEmailService();
  }

  initializeEmailService() {
    try {
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      logger.info('Email service initialized');
    } catch (error) {
      logger.error('Failed to initialize email service:', error);
    }
  }

  // Send email notification
  async sendEmailNotification(userEmail, subject, message, htmlContent = null) {
    try {
      if (!this.transporter) {
        throw new Error('Email service not initialized');
      }

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: userEmail,
        subject: subject,
        text: message,
        html: htmlContent || message
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${userEmail}: ${result.messageId}`);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      logger.error('Failed to send email notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Send push notification (mock implementation)
  async sendPushNotification(userId, title, message, data = {}) {
    try {
      // In a real implementation, this would integrate with FCM, APNs, or similar
      logger.info(`Push notification sent to user ${userId}: ${title}`);
      return { success: true };
    } catch (error) {
      logger.error('Failed to send push notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Send desktop notification via WebSocket
  async sendDesktopNotification(userId, notification) {
    try {
      socketService.sendNotificationToUser(userId, {
        id: Date.now().toString(),
        userId,
        title: notification.title,
        message: notification.message,
        type: notification.type || 'info',
        actionUrl: notification.actionUrl,
        read: false,
        createdAt: new Date()
      });

      logger.info(`Desktop notification sent to user ${userId}: ${notification.title}`);
      return { success: true };
    } catch (error) {
      logger.error('Failed to send desktop notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Send notification to multiple channels
  async sendNotification(userId, userEmail, notification, channels = ['desktop']) {
    const results = {};

    try {
      // Send desktop notification
      if (channels.includes('desktop')) {
        results.desktop = await this.sendDesktopNotification(userId, notification);
      }

      // Send email notification
      if (channels.includes('email') && userEmail) {
        results.email = await this.sendEmailNotification(
          userEmail,
          notification.title,
          notification.message,
          notification.htmlContent
        );
      }

      // Send push notification
      if (channels.includes('push')) {
        results.push = await this.sendPushNotification(
          userId,
          notification.title,
          notification.message,
          notification.data
        );
      }

      logger.info(`Notifications sent to user ${userId} via channels: ${channels.join(', ')}`);
      return { success: true, results };
    } catch (error) {
      logger.error('Failed to send notifications:', error);
      return { success: false, error: error.message, results };
    }
  }

  // Send task reminder
  async sendTaskReminder(userId, userEmail, task) {
    const notification = {
      title: 'Task Reminder',
      message: `Your task "${task.title}" is due soon`,
      type: 'warning',
      actionUrl: `/tasks/${task._id}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">Task Reminder</h2>
          <p>Your task <strong>"${task.title}"</strong> is due soon.</p>
          <p><strong>Due Date:</strong> ${new Date(task.dueDate).toLocaleString()}</p>
          <p><strong>Priority:</strong> ${task.priority}</p>
          <p><strong>Category:</strong> ${task.category}</p>
          ${task.description ? `<p><strong>Description:</strong> ${task.description}</p>` : ''}
          <a href="${process.env.FRONTEND_URL}/tasks/${task._id}" 
             style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">
            View Task
          </a>
        </div>
      `
    };

    return await this.sendNotification(userId, userEmail, notification, ['email', 'desktop']);
  }

  // Send task completion notification
  async sendTaskCompletionNotification(userId, userEmail, task) {
    const notification = {
      title: 'Task Completed!',
      message: `Congratulations! You've completed "${task.title}"`,
      type: 'success',
      actionUrl: `/tasks/${task._id}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Task Completed!</h2>
          <p>Congratulations! You've successfully completed your task <strong>"${task.title}"</strong>.</p>
          <p><strong>Completed:</strong> ${new Date(task.completedAt).toLocaleString()}</p>
          <p><strong>Time Spent:</strong> ${task.actualTime || 0} minutes</p>
          <a href="${process.env.FRONTEND_URL}/tasks/${task._id}" 
             style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">
            View Task
          </a>
        </div>
      `
    };

    return await this.sendNotification(userId, userEmail, notification, ['desktop']);
  }

  // Send overdue task notification
  async sendOverdueTaskNotification(userId, userEmail, task) {
    const notification = {
      title: 'Overdue Task Alert',
      message: `Your task "${task.title}" is overdue`,
      type: 'error',
      actionUrl: `/tasks/${task._id}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Overdue Task Alert</h2>
          <p>Your task <strong>"${task.title}"</strong> is overdue.</p>
          <p><strong>Due Date:</strong> ${new Date(task.dueDate).toLocaleString()}</p>
          <p><strong>Days Overdue:</strong> ${Math.ceil((new Date() - new Date(task.dueDate)) / (1000 * 60 * 60 * 24))}</p>
          <a href="${process.env.FRONTEND_URL}/tasks/${task._id}" 
             style="background-color: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">
            View Task
          </a>
        </div>
      `
    };

    return await this.sendNotification(userId, userEmail, notification, ['email', 'desktop']);
  }

  // Send weekly progress report
  async sendWeeklyProgressReport(userId, userEmail, reportData) {
    const notification = {
      title: 'Weekly Progress Report',
      message: 'Your weekly productivity report is ready',
      type: 'info',
      actionUrl: '/analytics',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Weekly Progress Report</h2>
          <p>Here's your productivity summary for this week:</p>
          <ul>
            <li><strong>Tasks Completed:</strong> ${reportData.tasksCompleted}</li>
            <li><strong>Total Tasks:</strong> ${reportData.totalTasks}</li>
            <li><strong>Completion Rate:</strong> ${reportData.completionRate}%</li>
            <li><strong>Time Spent:</strong> ${reportData.totalTimeSpent} minutes</li>
          </ul>
          <a href="${process.env.FRONTEND_URL}/analytics" 
             style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">
            View Full Report
          </a>
        </div>
      `
    };

    return await this.sendNotification(userId, userEmail, notification, ['email', 'desktop']);
  }

  // Send system notification
  async sendSystemNotification(userId, userEmail, notification) {
    return await this.sendNotification(userId, userEmail, notification, ['desktop']);
  }

  // Send bulk notifications
  async sendBulkNotifications(notifications) {
    const results = [];
    
    for (const notification of notifications) {
      try {
        const result = await this.sendNotification(
          notification.userId,
          notification.userEmail,
          notification.notification,
          notification.channels
        );
        results.push({ userId: notification.userId, ...result });
      } catch (error) {
        logger.error(`Failed to send bulk notification to user ${notification.userId}:`, error);
        results.push({ 
          userId: notification.userId, 
          success: false, 
          error: error.message 
        });
      }
    }

    return results;
  }
}

module.exports = new NotificationService();
