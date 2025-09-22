#!/usr/bin/env node

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * 🚀 Task Dispatcher System
 * توزيع المهام على MCP Agents المتخصصة
 * إدارة الوكلاء وتوازن الأحمال
 */
class TaskDispatcher {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    this.agents = new Map();
    this.taskQueue = [];
    this.activeTasks = new Map();
    this.agentStats = new Map();
    this.loadBalancer = new Map();

    this.initializeAgents();
    this.startDispatcher();
    this.startLoadBalancing();

    console.log('🚀 Task Dispatcher initialized with MCP Agents');
  }

  /**
   * تهيئة الوكلاء المتخصصة
   */
  initializeAgents() {
    // Gemini AI Agent - للتحليل الذكي والمهام المعقدة
    this.agents.set('gemini_ai', {
      name: 'Gemini AI Agent',
      type: 'ai_analysis',
      capabilities: [
        'text_analysis',
        'data_processing',
        'content_generation',
        'translation',
        'summarization',
        'question_answering',
      ],
      status: 'online',
      load: 0,
      maxConcurrentTasks: 5,
      efficiency: 0.95,
      responseTime: 2000,
      language: ['ar', 'en'],
    });

    // HTTPie Agent - لاستخراج البيانات والـ API calls
    this.agents.set('httpie_agent', {
      name: 'HTTPie Web Agent',
      type: 'web_automation',
      capabilities: [
        'web_scraping',
        'api_calls',
        'http_requests',
        'data_extraction',
        'website_monitoring',
      ],
      status: 'online',
      load: 0,
      maxConcurrentTasks: 3,
      efficiency: 0.9,
      responseTime: 5000,
      language: ['ar', 'en'],
    });

    // JQ Agent - لمعالجة البيانات
    this.agents.set('jq_agent', {
      name: 'JQ Data Processing Agent',
      type: 'data_processing',
      capabilities: [
        'json_processing',
        'data_filtering',
        'data_transformation',
        'data_validation',
      ],
      status: 'online',
      load: 0,
      maxConcurrentTasks: 10,
      efficiency: 0.98,
      responseTime: 1000,
      language: ['ar', 'en'],
    });

    // Automation Agent - لأتمتة المهام
    this.agents.set('automation_agent', {
      name: 'Automation Agent',
      type: 'automation',
      capabilities: [
        'task_automation',
        'workflow_execution',
        'system_commands',
        'process_automation',
      ],
      status: 'online',
      load: 0,
      maxConcurrentTasks: 2,
      efficiency: 0.85,
      responseTime: 10000,
      language: ['ar', 'en'],
    });

    // File Agent - لإدارة الملفات
    this.agents.set('file_agent', {
      name: 'File Management Agent',
      type: 'file_operations',
      capabilities: [
        'file_operations',
        'directory_management',
        'file_processing',
        'backup_operations',
      ],
      status: 'online',
      load: 0,
      maxConcurrentTasks: 5,
      efficiency: 0.92,
      responseTime: 3000,
      language: ['ar', 'en'],
    });

    // Voice Processing Agent - لمعالجة الصوت
    this.agents.set('voice_processing_agent', {
      name: 'Voice Processing Agent',
      type: 'voice_processing',
      capabilities: [
        'speech_to_text',
        'text_to_speech',
        'voice_analysis',
        'audio_processing',
      ],
      status: 'online',
      load: 0,
      maxConcurrentTasks: 3,
      efficiency: 0.88,
      responseTime: 8000,
      language: ['ar', 'en'],
    });

    // Image Processing Agent - لمعالجة الصور
    this.agents.set('image_processing_agent', {
      name: 'Image Processing Agent',
      type: 'image_processing',
      capabilities: [
        'image_analysis',
        'ocr',
        'image_generation',
        'image_enhancement',
        'object_detection',
      ],
      status: 'online',
      load: 0,
      maxConcurrentTasks: 4,
      efficiency: 0.9,
      responseTime: 6000,
      language: ['ar', 'en'],
    });

    console.log(`✅ Initialized ${this.agents.size} specialized MCP Agents`);
  }

  /**
   * بدء نظام التوزيع
   */
  startDispatcher() {
    // معالجة المهام كل ثانيتين
    this.dispatcherInterval = setInterval(() => {
      this.processTaskQueue();
    }, 2000);

    // تحديث إحصائيات الوكلاء كل 30 ثانية
    this.statsInterval = setInterval(() => {
      this.updateAgentStats();
    }, 30000);

    // فحص صحة الوكلاء كل دقيقة
    this.healthInterval = setInterval(() => {
      this.checkAgentHealth();
    }, 60000);

    console.log('🔄 Task Dispatcher started');
  }

  /**
   * بدء نظام توازن الأحمال
   */
  startLoadBalancing() {
    this.loadBalancerInterval = setInterval(() => {
      this.balanceLoad();
    }, 10000);

    console.log('⚖️ Load balancer started');
  }

  /**
   * معالجة قائمة المهام
   */
  async processTaskQueue() {
    if (this.taskQueue.length === 0) return;

    // ترتيب المهام حسب الأولوية
    this.taskQueue.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    // معالجة المهام
    for (let i = this.taskQueue.length - 1; i >= 0; i--) {
      const task = this.taskQueue[i];
      const agent = this.selectBestAgent(task);

      if (agent && this.canAgentHandleTask(agent, task)) {
        this.taskQueue.splice(i, 1);
        await this.executeTask(task, agent);
      }
    }
  }

  /**
   * اختيار أفضل وكيل للمهمة
   */
  selectBestAgent(task) {
    const analysis = task.analysis || {};
    const requiredAgents = analysis.required_agents || [task.assignedAgent];

    let bestAgent = null;
    let bestScore = -1;

    for (const agentName of requiredAgents) {
      const agent = this.agents.get(agentName);
      if (!agent || agent.status !== 'online') continue;

      const score = this.calculateAgentScore(agent, task);
      if (score > bestScore) {
        bestScore = score;
        bestAgent = agentName;
      }
    }

    // إذا لم يتم العثور على وكيل مناسب، استخدم Gemini AI كبديل
    return bestAgent || 'gemini_ai';
  }

  /**
   * حساب نقاط الوكيل
   */
  calculateAgentScore(agent, task) {
    let score = 100; // النقاط الأساسية

    // تقليل النقاط حسب الحمولة الحالية
    const loadRatio = agent.load / agent.maxConcurrentTasks;
    score -= loadRatio * 40;

    // زيادة النقاط للمطابقة مع القدرات
    const analysis = task.analysis || {};
    const category = analysis.category || 'general';

    const categoryMatch = {
      data_analysis: ['gemini_ai', 'jq_agent'],
      web_scraping: ['httpie_agent'],
      automation: ['automation_agent'],
      ai_task: ['gemini_ai'],
      file_operations: ['file_agent'],
      voice: ['voice_processing_agent'],
      image: ['image_processing_agent'],
      document: ['file_agent'],
      general: ['gemini_ai'],
    };

    if (
      categoryMatch[category] &&
      categoryMatch[category].includes(
        agent.name.toLowerCase().replace(/\s+/g, '_')
      )
    ) {
      score += 30;
    }

    // زيادة النقاط للكفاءة العالية
    score += agent.efficiency * 20;

    // زيادة النقاط للاستجابة السريعة
    if (agent.responseTime < 3000) {
      score += 10;
    }

    // زيادة النقاط لدعم اللغة
    if (task.language && agent.language.includes(task.language)) {
      score += 15;
    }

    return Math.max(0, score);
  }

  /**
   * فحص إمكانية الوكيل على معالجة المهمة
   */
  canAgentHandleTask(agentName, task) {
    const agent = this.agents.get(agentName);
    if (!agent) return false;

    // فحص الحمولة
    if (agent.load >= agent.maxConcurrentTasks) return false;

    // فحص الحالة
    if (agent.status !== 'online') return false;

    // فحص القدرات
    const analysis = task.analysis || {};
    const requiredCapabilities = analysis.resources_needed || [];

    for (const capability of requiredCapabilities) {
      if (!agent.capabilities.includes(capability)) {
        return false;
      }
    }

    return true;
  }

  /**
   * تنفيذ المهمة
   */
  async executeTask(task, agentName) {
    try {
      console.log(`🎯 Executing task ${task.id} with ${agentName}`);

      // تحديث حالة المهمة
      task.status = 'executing';
      task.executingAgent = agentName;
      task.startTime = new Date().toISOString();

      // إضافة للمهام النشطة
      this.activeTasks.set(task.id, task);

      // تحديث حمولة الوكيل
      this.agents.get(agentName).load++;

      // تنفيذ المهمة حسب نوع الوكيل
      const result = await this.executeWithAgent(task, agentName);

      // تحديث المهمة بالنتيجة
      task.status = result.success ? 'completed' : 'failed';
      task.endTime = new Date().toISOString();
      task.result = result;
      task.duration = this.calculateDuration(task.startTime, task.endTime);

      // تحديث حمولة الوكيل
      this.agents.get(agentName).load--;

      // نقل للمكتملة
      this.activeTasks.delete(task.id);

      // تحديث الإحصائيات
      this.updateTaskStats(task, agentName);

      console.log(`✅ Task ${task.id} completed in ${task.duration}`);

      // إرسال النتيجة لنظام التغذية الراجعة
      if (this.feedbackLoop) {
        await this.feedbackLoop.sendTaskFeedback(task);
      }
    } catch (error) {
      console.error(`❌ Task ${task.id} execution failed:`, error);

      task.status = 'failed';
      task.error = error.message;
      task.endTime = new Date().toISOString();

      this.agents.get(agentName).load--;
      this.activeTasks.delete(task.id);

      // إرسال الخطأ لنظام التصحيح الذاتي
      if (this.selfDebugging) {
        await this.selfDebugging.handleTaskError(task, error);
      }
    }
  }

  /**
   * تنفيذ المهمة مع الوكيل المحدد
   */
  async executeWithAgent(task, agentName) {
    const agent = this.agents.get(agentName);

    switch (agent.type) {
      case 'ai_analysis':
        return await this.executeGeminiTask(task);

      case 'web_automation':
        return await this.executeHttpieTask(task);

      case 'data_processing':
        return await this.executeJQTask(task);

      case 'automation':
        return await this.executeAutomationTask(task);

      case 'file_operations':
        return await this.executeFileTask(task);

      case 'voice_processing':
        return await this.executeVoiceTask(task);

      case 'image_processing':
        return await this.executeImageTask(task);

      default:
        return await this.executeGeminiTask(task);
    }
  }

  /**
   * تنفيذ مهمة Gemini AI
   */
  async executeGeminiTask(task) {
    try {
      const language = task.language === 'ar' ? 'arabic' : 'english';

      const prompt = `
            Execute this task using your AI capabilities in ${language}:

            Task: ${task.content}
            Type: ${task.type}
            Analysis: ${JSON.stringify(task.analysis)}
            Language: ${task.language}

            Provide a comprehensive response with:
            1. Task execution details
            2. Results or findings
            3. Recommendations if applicable
            4. Any relevant data or insights

            Format your response as a structured analysis in ${language}.
            `;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      return {
        success: true,
        message: `Task completed successfully with Gemini AI (${language})`,
        data: {
          response: response,
          agent: 'gemini_ai',
          language: task.language,
          timestamp: new Date().toISOString(),
        },
        agent: 'gemini_ai',
        executionTime: Date.now() - new Date(task.startTime).getTime(),
      };
    } catch (error) {
      return {
        success: false,
        message: `Gemini AI execution failed: ${error.message}`,
        error: error.message,
        agent: 'gemini_ai',
      };
    }
  }

  /**
   * تنفيذ مهمة HTTPie
   */
  async executeHttpieTask(task) {
    // محاكاة تنفيذ وكيل HTTPie
    return {
      success: true,
      message: 'Web scraping/API call completed',
      data: {
        result: 'HTTP request executed successfully',
        agent: 'httpie_agent',
        timestamp: new Date().toISOString(),
      },
      agent: 'httpie_agent',
      executionTime: 5000,
    };
  }

  /**
   * تنفيذ مهمة JQ
   */
  async executeJQTask(task) {
    // محاكاة تنفيذ وكيل JQ
    return {
      success: true,
      message: 'Data processing completed',
      data: {
        result: 'JSON data processed successfully',
        agent: 'jq_agent',
        timestamp: new Date().toISOString(),
      },
      agent: 'jq_agent',
      executionTime: 1000,
    };
  }

  /**
   * تنفيذ مهمة الأتمتة
   */
  async executeAutomationTask(task) {
    // محاكاة تنفيذ وكيل الأتمتة
    return {
      success: true,
      message: 'Automation task completed',
      data: {
        result: 'Automation workflow executed',
        agent: 'automation_agent',
        timestamp: new Date().toISOString(),
      },
      agent: 'automation_agent',
      executionTime: 10000,
    };
  }

  /**
   * تنفيذ مهمة الملفات
   */
  async executeFileTask(task) {
    // محاكاة تنفيذ وكيل الملفات
    return {
      success: true,
      message: 'File operation completed',
      data: {
        result: 'File operation executed successfully',
        agent: 'file_agent',
        timestamp: new Date().toISOString(),
      },
      agent: 'file_agent',
      executionTime: 3000,
    };
  }

  /**
   * تنفيذ مهمة الصوت
   */
  async executeVoiceTask(task) {
    // محاكاة تنفيذ وكيل الصوت
    return {
      success: true,
      message: 'Voice processing completed',
      data: {
        result: 'Voice message processed successfully',
        agent: 'voice_processing_agent',
        timestamp: new Date().toISOString(),
      },
      agent: 'voice_processing_agent',
      executionTime: 8000,
    };
  }

  /**
   * تنفيذ مهمة الصور
   */
  async executeImageTask(task) {
    // محاكاة تنفيذ وكيل الصور
    return {
      success: true,
      message: 'Image processing completed',
      data: {
        result: 'Image analyzed successfully',
        agent: 'image_processing_agent',
        timestamp: new Date().toISOString(),
      },
      agent: 'image_processing_agent',
      executionTime: 6000,
    };
  }

  /**
   * تحديث إحصائيات المهام
   */
  updateTaskStats(task, agentName) {
    if (!this.agentStats.has(agentName)) {
      this.agentStats.set(agentName, {
        totalTasks: 0,
        completedTasks: 0,
        failedTasks: 0,
        totalDuration: 0,
        averageSatisfaction: 0,
      });
    }

    const stats = this.agentStats.get(agentName);
    stats.totalTasks++;

    if (task.status === 'completed') {
      stats.completedTasks++;
    } else {
      stats.failedTasks++;
    }

    if (task.duration) {
      const durationMs = this.parseDuration(task.duration);
      stats.totalDuration += durationMs;
    }
  }

  /**
   * تحديث إحصائيات الوكلاء
   */
  updateAgentStats() {
    console.log('📊 Agent Statistics:');
    this.agentStats.forEach((stats, agentName) => {
      const successRate =
        stats.totalTasks > 0
          ? ((stats.completedTasks / stats.totalTasks) * 100).toFixed(1)
          : 0;

      console.log(
        `  ${agentName}: ${stats.completedTasks}/${stats.totalTasks} (${successRate}%)`
      );
    });
  }

  /**
   * فحص صحة الوكلاء
   */
  checkAgentHealth() {
    this.agents.forEach((agent, name) => {
      // فحص الحمولة الزائدة
      if (agent.load > agent.maxConcurrentTasks * 0.9) {
        console.warn(
          `⚠️ Agent ${name} is overloaded: ${agent.load}/${agent.maxConcurrentTasks}`
        );
      }

      // فحص الكفاءة المنخفضة
      if (agent.efficiency < 0.7) {
        console.warn(
          `⚠️ Agent ${name} has low efficiency: ${agent.efficiency}`
        );
      }
    });
  }

  /**
   * توازن الأحمال
   */
  balanceLoad() {
    const overloadedAgents = [];
    const underloadedAgents = [];

    this.agents.forEach((agent, name) => {
      const loadRatio = agent.load / agent.maxConcurrentTasks;

      if (loadRatio > 0.8) {
        overloadedAgents.push({ name, agent, loadRatio });
      } else if (loadRatio < 0.3) {
        underloadedAgents.push({ name, agent, loadRatio });
      }
    });

    // إعادة توزيع المهام من الوكلاء المحملة للوكلاء الخفيفة
    if (overloadedAgents.length > 0 && underloadedAgents.length > 0) {
      console.log('⚖️ Load balancing: redistributing tasks');
      // تنفيذ إعادة التوزيع
    }
  }

  /**
   * حساب مدة التنفيذ
   */
  calculateDuration(start, end) {
    if (!start || !end) return 'N/A';
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime;

    if (diffMs < 1000) return `${diffMs}ms`;
    if (diffMs < 60000) return `${Math.floor(diffMs / 1000)}s`;
    return `${Math.floor(diffMs / 60000)}m ${Math.floor((diffMs % 60000) / 1000)}s`;
  }

  /**
   * تحليل مدة التنفيذ إلى ميلي ثانية
   */
  parseDuration(duration) {
    if (!duration || duration === 'N/A') return 0;

    if (duration.includes('ms')) return parseInt(duration);
    if (duration.includes('s')) return parseInt(duration) * 1000;
    if (duration.includes('m')) {
      const parts = duration.split('m');
      const minutes = parseInt(parts[0]);
      const seconds = parts[1] ? parseInt(parts[1].replace('s', '')) : 0;
      return (minutes * 60 + seconds) * 1000;
    }
    return 0;
  }

  /**
   * إضافة مهمة للقائمة
   */
  addTask(task) {
    this.taskQueue.push(task);
    console.log(
      `📥 Task ${task.id} added to dispatcher queue (${this.taskQueue.length} in queue)`
    );
  }

  /**
   * الحصول على حالة الوكلاء
   */
  getAgentStatus() {
    const status = {};
    this.agents.forEach((agent, name) => {
      status[name] = {
        status: agent.status,
        load: agent.load,
        maxLoad: agent.maxConcurrentTasks,
        capabilities: agent.capabilities,
        efficiency: agent.efficiency,
        responseTime: agent.responseTime,
      };
    });
    return status;
  }

  /**
   * الحصول على إحصائيات المهام
   */
  getTaskStats() {
    return {
      queued: this.taskQueue.length,
      active: this.activeTasks.size,
      agents: this.getAgentStatus(),
      stats: Object.fromEntries(this.agentStats),
    };
  }

  /**
   * ربط نظام التغذية الراجعة
   */
  setFeedbackLoop(feedbackLoop) {
    this.feedbackLoop = feedbackLoop;
  }

  /**
   * ربط نظام التصحيح الذاتي
   */
  setSelfDebugging(selfDebugging) {
    this.selfDebugging = selfDebugging;
  }

  /**
   * إيقاف النظام
   */
  stop() {
    if (this.dispatcherInterval) clearInterval(this.dispatcherInterval);
    if (this.statsInterval) clearInterval(this.statsInterval);
    if (this.healthInterval) clearInterval(this.healthInterval);
    if (this.loadBalancerInterval) clearInterval(this.loadBalancerInterval);

    console.log('🛑 Task Dispatcher stopped');
  }
}

module.exports = TaskDispatcher;
