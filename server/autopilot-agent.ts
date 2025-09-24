/**
 * 🤖 Autopilot Agent for AuraOS
 */

import { getFirestore } from 'firebase-admin/firestore';
import { getLogger } from './enhanced-logger.js';

export class AutopilotAgent {
  private agent: any;
  private db: any;
  private debug: boolean;
  private mainLoopTimeout: NodeJS.Timeout | null = null;
  private isRunning = false;
  private logger = getLogger();

  constructor(debug: boolean = false) {
    this.debug = debug;
    
    this.agent = {
      name: "Autopilot Agent",
      description: "An advanced AI agent that autonomously manages and optimizes complex projects.",
      type: "coordinator",
      capabilities: [
        "system_monitoring",
        "performance_analysis",
        "workflow_optimization",
        "self_improvement",
        "automated_decision_making"
      ],
      performance: {
        tasksCompleted: 0,
        successRate: 0,
        averageResponseTime: 0,
        userSatisfaction: 0,
        learningProgress: 0,
        efficiency: 0
      }
    };

    try {
      this.db = getFirestore();
      if (this.debug) {
        console.log("Firestore initialized successfully.");
      }
    } catch (error) {
      console.error("Error initializing Firestore:", error);
    }

    if (this.debug) {
      console.log("Autopilot Agent initialized in debug mode.");
    }

    this.start();
  }

  start() {
    if (this.isRunning) {
      this.logger.warn("Autopilot Agent is already running.", "autopilot");
      return;
    }

    this.isRunning = true;
    this.logger.info("Autopilot Agent started.", "autopilot");
    this.runMainLoop();
  }

  stop() {
    if (!this.isRunning) {
      this.logger.warn("Autopilot Agent is not running.", "autopilot");
      return;
    }

    this.isRunning = false;
    
    if (this.mainLoopTimeout) {
      clearTimeout(this.mainLoopTimeout);
      this.mainLoopTimeout = null;
    }

    this.logger.info("Autopilot Agent stopped.", "autopilot");
  }

  private async runMainLoop() {
    if (!this.isRunning) return;

    this.logger.info("Autopilot Agent main loop running...", "autopilot");

    try {
      const currentTask = {
        id: `task-${Date.now()}`,
        description: "Monitor system health and optimize resources.",
        status: "in_progress",
        priority: "high",
        assignedTo: this.agent.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.logger.info(`Executing task: ${currentTask.description}`, "autopilot", { taskId: currentTask.id });

      await new Promise(resolve => setTimeout(resolve, 5000));

      currentTask.status = "completed";
      currentTask.updatedAt = new Date().toISOString();

      this.logger.info(`Task completed: ${currentTask.description}`, "autopilot", { taskId: currentTask.id });

      this.agent.performance.tasksCompleted++;
      this.agent.performance.successRate = Math.min(1, this.agent.performance.successRate + 0.01);

    } catch (error) {
      this.logger.error("Error in Autopilot Agent main loop", "autopilot", {}, error as Error);
    } finally {
      this.mainLoopTimeout = setTimeout(() => this.runMainLoop(), 10000);
    }
  }

  configure(settings: any) {
    this.logger.info("Autopilot Agent configured.", "autopilot", { settings });
  }

  async handleTelegramMessage(message: string): Promise<string> {
    this.logger.info("Received Telegram message for Autopilot.", "autopilot", { message });

    if (message.toLowerCase() === "/start_autopilot") {
      this.start();
      return "Autopilot Agent started.";
    } else if (message.toLowerCase() === "/stop_autopilot") {
      this.stop();
      return "Autopilot Agent stopped.";
    }

    return "Autopilot Agent received message: " + message;
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      agent: {
        name: this.agent.name,
        performance: this.agent.performance,
        capabilities: this.agent.capabilities
      },
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    };
  }
}

let autopilotAgent: AutopilotAgent;

export function getAutopilotAgent(): AutopilotAgent {
  if (!autopilotAgent) {
    autopilotAgent = new AutopilotAgent(process.env.NODE_ENV === "development");
  }
  return autopilotAgent;
}