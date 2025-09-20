// نظام التعلم المستمر المتقدم
import { createHash } from 'crypto';

export interface LearningSession {
  id: string;
  userId: string;
  agentId: string;
  startTime: Date;
  endTime?: Date;
  interactions: LearningInteraction[];
  context: Record<string, any>;
  learningGoals: string[];
  achievements: string[];
  status: 'active' | 'completed' | 'paused' | 'abandoned';
}

export interface LearningInteraction {
  id: string;
  sessionId: string;
  type: 'question' | 'answer' | 'feedback' | 'correction' | 'explanation';
  content: string;
  timestamp: Date;
  metadata: Record<string, any>;
  learningValue: number;
}

export interface LearningProgress {
  id: string;
  userId: string;
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  progress: number; // 0-100
  masteryScore: number; // 0-100
  lastUpdated: Date;
  milestones: LearningMilestone[];
}

export interface LearningMilestone {
  id: string;
  progressId: string;
  name: string;
  description: string;
  achievedAt: Date;
  points: number;
  type: 'knowledge' | 'skill' | 'achievement' | 'certification';
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  topics: string[];
  prerequisites: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // in hours
  learningObjectives: string[];
  resources: LearningResource[];
  assessments: LearningAssessment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningResource {
  id: string;
  pathId: string;
  title: string;
  type: 'article' | 'video' | 'interactive' | 'quiz' | 'project';
  url: string;
  duration?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  learningOutcomes: string[];
}

export interface LearningAssessment {
  id: string;
  pathId: string;
  title: string;
  type: 'quiz' | 'project' | 'practical' | 'theoretical';
  questions: AssessmentQuestion[];
  passingScore: number;
  timeLimit?: number;
  attempts: number;
}

export interface AssessmentQuestion {
  id: string;
  assessmentId: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export class ContinuousLearningSystem {
  private sessions: Map<string, LearningSession> = new Map();
  private progress: Map<string, LearningProgress[]> = new Map();
  private paths: Map<string, LearningPath> = new Map();
  private interactions: Map<string, LearningInteraction[]> = new Map();
  private assessments: Map<string, any[]> = new Map();

  // إنشاء جلسة تعلم جديدة
  async createLearningSession(sessionData: {
    userId: string;
    agentId: string;
    learningGoals: string[];
    context?: Record<string, any>;
  }): Promise<LearningSession> {
    const session: LearningSession = {
      id: this.generateId(),
      userId: sessionData.userId,
      agentId: sessionData.agentId,
      startTime: new Date(),
      interactions: [],
      context: sessionData.context || {},
      learningGoals: sessionData.learningGoals,
      achievements: [],
      status: 'active',
    };

    this.sessions.set(session.id, session);
    this.interactions.set(session.id, []);

    return session;
  }

  // إضافة تفاعل تعليمي
  async addLearningInteraction(
    sessionId: string,
    interactionData: Omit<LearningInteraction, 'id' | 'sessionId' | 'timestamp'>
  ): Promise<LearningInteraction> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Learning session not found');

    const interaction: LearningInteraction = {
      id: this.generateId(),
      sessionId,
      timestamp: new Date(),
      ...interactionData,
    };

    session.interactions.push(interaction);
    this.sessions.set(sessionId, session);

    const sessionInteractions = this.interactions.get(sessionId) || [];
    sessionInteractions.push(interaction);
    this.interactions.set(sessionId, sessionInteractions);

    return interaction;
  }

  // إنهاء جلسة التعلم
  async endLearningSession(sessionId: string): Promise<LearningSession | null> {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    session.endTime = new Date();
    session.status = 'completed';

    // حساب التقدم
    await this.updateLearningProgress(session);

    this.sessions.set(sessionId, session);
    return session;
  }

  // تحديث تقدم التعلم
  private async updateLearningProgress(session: LearningSession): Promise<void> {
    const userProgress = this.progress.get(session.userId) || [];
    
    // تحليل التفاعلات لتحديد التقدم
    const interactions = session.interactions;
    const learningValue = interactions.reduce((sum, interaction) => sum + interaction.learningValue, 0);
    
    // تحديث التقدم لكل هدف تعليمي
    session.learningGoals.forEach(goal => {
      let progress = userProgress.find(p => p.topic === goal);
      
      if (!progress) {
        progress = {
          id: this.generateId(),
          userId: session.userId,
          topic: goal,
          level: 'beginner',
          progress: 0,
          masteryScore: 0,
          lastUpdated: new Date(),
          milestones: [],
        };
        userProgress.push(progress);
      }

      // تحديث التقدم
      const progressIncrease = Math.min(10, learningValue / 10); // زيادة تصل إلى 10%
      progress.progress = Math.min(100, progress.progress + progressIncrease);
      progress.masteryScore = Math.min(100, progress.masteryScore + progressIncrease * 0.8);
      progress.lastUpdated = new Date();

      // تحديث المستوى
      if (progress.progress >= 80 && progress.level === 'intermediate') {
        progress.level = 'advanced';
        progress.milestones.push({
          id: this.generateId(),
          progressId: progress.id,
          name: `Advanced ${goal}`,
          description: `Reached advanced level in ${goal}`,
          achievedAt: new Date(),
          points: 100,
          type: 'achievement',
        });
      } else if (progress.progress >= 50 && progress.level === 'beginner') {
        progress.level = 'intermediate';
        progress.milestones.push({
          id: this.generateId(),
          progressId: progress.id,
          name: `Intermediate ${goal}`,
          description: `Reached intermediate level in ${goal}`,
          achievedAt: new Date(),
          points: 50,
          type: 'achievement',
        });
      }
    });

    this.progress.set(session.userId, userProgress);
  }

  // إنشاء مسار تعليمي
  async createLearningPath(pathData: Omit<LearningPath, 'id' | 'createdAt' | 'updatedAt'>): Promise<LearningPath> {
    const path: LearningPath = {
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...pathData,
    };

    this.paths.set(path.id, path);
    return path;
  }

  // إضافة مورد تعليمي
  async addLearningResource(
    pathId: string,
    resourceData: Omit<LearningResource, 'id' | 'pathId'>
  ): Promise<LearningResource> {
    const path = this.paths.get(pathId);
    if (!path) throw new Error('Learning path not found');

    const resource: LearningResource = {
      id: this.generateId(),
      pathId,
      ...resourceData,
    };

    path.resources.push(resource);
    path.updatedAt = new Date();
    this.paths.set(pathId, path);

    return resource;
  }

  // إضافة تقييم تعليمي
  async addLearningAssessment(
    pathId: string,
    assessmentData: Omit<LearningAssessment, 'id' | 'pathId'>
  ): Promise<LearningAssessment> {
    const path = this.paths.get(pathId);
    if (!path) throw new Error('Learning path not found');

    const assessment: LearningAssessment = {
      id: this.generateId(),
      pathId,
      ...assessmentData,
    };

    path.assessments.push(assessment);
    path.updatedAt = new Date();
    this.paths.set(pathId, path);

    return assessment;
  }

  // الحصول على التوصيات التعليمية
  async getLearningRecommendations(userId: string, limit: number = 5): Promise<{
    paths: LearningPath[];
    resources: LearningResource[];
    assessments: LearningAssessment[];
  }> {
    const userProgress = this.progress.get(userId) || [];
    const userSessions = Array.from(this.sessions.values()).filter(s => s.userId === userId);
    
    // تحليل نقاط القوة والضعف
    const strengths = userProgress.filter(p => p.masteryScore > 70).map(p => p.topic);
    const weaknesses = userProgress.filter(p => p.masteryScore < 30).map(p => p.topic);
    
    // العثور على المسارات المناسبة
    const recommendedPaths = Array.from(this.paths.values())
      .filter(path => {
        // مسارات تناسب نقاط الضعف
        return weaknesses.some(weakness => path.topics.includes(weakness)) ||
               // مسارات جديدة لم يتم استكشافها
               !path.topics.some(topic => userProgress.some(p => p.topic === topic));
      })
      .sort((a, b) => {
        // ترتيب حسب الصعوبة المناسبة
        const userLevel = this.getUserOverallLevel(userProgress);
        const aMatch = this.getDifficultyMatch(a.difficulty, userLevel);
        const bMatch = this.getDifficultyMatch(b.difficulty, userLevel);
        return bMatch - aMatch;
      })
      .slice(0, limit);

    // العثور على الموارد المناسبة
    const recommendedResources: LearningResource[] = [];
    recommendedPaths.forEach(path => {
      recommendedResources.push(...path.resources.slice(0, 2));
    });

    // العثور على التقييمات المناسبة
    const recommendedAssessments: LearningAssessment[] = [];
    recommendedPaths.forEach(path => {
      recommendedAssessments.push(...path.assessments.slice(0, 1));
    });

    return {
      paths: recommendedPaths,
      resources: recommendedResources.slice(0, limit),
      assessments: recommendedAssessments.slice(0, limit),
    };
  }

  // تحديد المستوى العام للمستخدم
  private getUserOverallLevel(userProgress: LearningProgress[]): 'beginner' | 'intermediate' | 'advanced' {
    if (userProgress.length === 0) return 'beginner';
    
    const averageMastery = userProgress.reduce((sum, p) => sum + p.masteryScore, 0) / userProgress.length;
    
    if (averageMastery >= 70) return 'advanced';
    if (averageMastery >= 40) return 'intermediate';
    return 'beginner';
  }

  // حساب مطابقة الصعوبة
  private getDifficultyMatch(pathDifficulty: string, userLevel: string): number {
    const difficultyMap = { beginner: 1, intermediate: 2, advanced: 3 };
    const userLevelNum = difficultyMap[userLevel as keyof typeof difficultyMap];
    const pathDifficultyNum = difficultyMap[pathDifficulty as keyof typeof difficultyMap];
    
    // أفضل مطابقة عندما تكون الصعوبة أعلى بقليل من مستوى المستخدم
    return 1 - Math.abs(userLevelNum - pathDifficultyNum) / 3;
  }

  // تحليل أداء التعلم
  analyzeLearningPerformance(userId: string): {
    totalSessions: number;
    totalInteractions: number;
    averageSessionDuration: number;
    learningVelocity: number;
    masteryDistribution: Record<string, number>;
    achievements: number;
    recommendations: string[];
  } {
    const userSessions = Array.from(this.sessions.values()).filter(s => s.userId === userId);
    const userProgress = this.progress.get(userId) || [];
    
    const totalSessions = userSessions.length;
    const totalInteractions = userSessions.reduce((sum, session) => sum + session.interactions.length, 0);
    
    const averageSessionDuration = userSessions.length > 0
      ? userSessions.reduce((sum, session) => {
          const duration = session.endTime 
            ? session.endTime.getTime() - session.startTime.getTime()
            : 0;
          return sum + duration;
        }, 0) / userSessions.length / (1000 * 60) // تحويل إلى دقائق
      : 0;

    const learningVelocity = userProgress.length > 0
      ? userProgress.reduce((sum, p) => sum + p.progress, 0) / userProgress.length
      : 0;

    const masteryDistribution = {
      beginner: userProgress.filter(p => p.level === 'beginner').length,
      intermediate: userProgress.filter(p => p.level === 'intermediate').length,
      advanced: userProgress.filter(p => p.level === 'advanced').length,
      expert: userProgress.filter(p => p.level === 'expert').length,
    };

    const achievements = userProgress.reduce((sum, p) => sum + p.milestones.length, 0);

    // توليد التوصيات
    const recommendations: string[] = [];
    
    if (learningVelocity < 30) {
      recommendations.push('Consider increasing study frequency');
    }
    
    if (masteryDistribution.beginner > masteryDistribution.advanced) {
      recommendations.push('Focus on advancing to intermediate level');
    }
    
    if (averageSessionDuration < 15) {
      recommendations.push('Try longer study sessions for better retention');
    }

    return {
      totalSessions,
      totalInteractions,
      averageSessionDuration,
      learningVelocity,
      masteryDistribution,
      achievements,
      recommendations,
    };
  }

  // إنشاء تقرير تعليمي
  generateLearningReport(userId: string): {
    summary: any;
    progress: LearningProgress[];
    sessions: LearningSession[];
    recommendations: any;
    achievements: LearningMilestone[];
  } {
    const userProgress = this.progress.get(userId) || [];
    const userSessions = Array.from(this.sessions.values()).filter(s => s.userId === userId);
    const performance = this.analyzeLearningPerformance(userId);
    const recommendations = this.getLearningRecommendations(userId);
    
    const allAchievements = userProgress.flatMap(p => p.milestones);

    return {
      summary: performance,
      progress: userProgress,
      sessions: userSessions,
      recommendations,
      achievements: allAchievements,
    };
  }

  // الحصول على جلسة التعلم
  getLearningSession(sessionId: string): LearningSession | null {
    return this.sessions.get(sessionId) || null;
  }

  // الحصول على تقدم المستخدم
  getUserProgress(userId: string): LearningProgress[] {
    return this.progress.get(userId) || [];
  }

  // الحصول على مسار التعلم
  getLearningPath(pathId: string): LearningPath | null {
    return this.paths.get(pathId) || null;
  }

  // الحصول على جميع المسارات
  getAllLearningPaths(): LearningPath[] {
    return Array.from(this.paths.values());
  }

  // حذف جلسة التعلم
  async deleteLearningSession(sessionId: string): Promise<boolean> {
    const deleted = this.sessions.delete(sessionId);
    if (deleted) {
      this.interactions.delete(sessionId);
    }
    return deleted;
  }

  // تصدير بيانات التعلم
  exportLearningData(): {
    sessions: LearningSession[];
    progress: LearningProgress[];
    paths: LearningPath[];
    interactions: LearningInteraction[];
  } {
    return {
      sessions: Array.from(this.sessions.values()),
      progress: Array.from(this.progress.values()).flat(),
      paths: Array.from(this.paths.values()),
      interactions: Array.from(this.interactions.values()).flat(),
    };
  }

  // إنشاء ID فريد
  private generateId(): string {
    return createHash('md5').update(Date.now().toString() + Math.random().toString()).digest('hex');
  }
}
