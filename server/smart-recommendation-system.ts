// نظام التوصيات الذكي المتقدم
import { createHash } from 'crypto';

export interface RecommendationItem {
  id: string;
  type: 'content' | 'workflow' | 'agent' | 'action' | 'resource';
  title: string;
  description: string;
  category: string;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  preferences: {
    categories: string[];
    tags: string[];
    languages: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    timePreference: 'short' | 'medium' | 'long';
  };
  behavior: {
    clickHistory: string[];
    searchHistory: string[];
    interactionHistory: string[];
    timeSpent: Record<string, number>;
    completionRate: Record<string, number>;
  };
  demographics: {
    age?: number;
    location?: string;
    occupation?: string;
    interests: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Recommendation {
  id: string;
  userId: string;
  itemId: string;
  score: number;
  reason: string;
  confidence: number;
  algorithm: string;
  metadata: Record<string, any>;
  timestamp: Date;
  feedback?: 'positive' | 'negative' | 'neutral';
}

export interface RecommendationAlgorithm {
  id: string;
  name: string;
  type: 'collaborative' | 'content_based' | 'hybrid' | 'deep_learning';
  parameters: Record<string, any>;
  accuracy: number;
  coverage: number;
  diversity: number;
  status: 'active' | 'inactive' | 'training';
  createdAt: Date;
  updatedAt: Date;
}

export class SmartRecommendationSystem {
  private items: Map<string, RecommendationItem> = new Map();
  private userProfiles: Map<string, UserProfile> = new Map();
  private recommendations: Map<string, Recommendation[]> = new Map();
  private algorithms: Map<string, RecommendationAlgorithm> = new Map();
  private interactions: Map<string, any[]> = new Map();

  // إنشاء عنصر توصية
  async createItem(itemData: Omit<RecommendationItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<RecommendationItem> {
    const item: RecommendationItem = {
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...itemData,
    };

    this.items.set(item.id, item);
    return item;
  }

  // إنشاء ملف تعريف المستخدم
  async createUserProfile(userId: string, profileData?: Partial<UserProfile>): Promise<UserProfile> {
    const profile: UserProfile = {
      id: this.generateId(),
      userId,
      preferences: profileData?.preferences || {
        categories: [],
        tags: [],
        languages: ['en'],
        difficulty: 'intermediate',
        timePreference: 'medium',
      },
      behavior: profileData?.behavior || {
        clickHistory: [],
        searchHistory: [],
        interactionHistory: [],
        timeSpent: {},
        completionRate: {},
      },
      demographics: profileData?.demographics || {
        interests: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.userProfiles.set(profile.id, profile);
    this.recommendations.set(userId, []);
    this.interactions.set(userId, []);

    return profile;
  }

  // تحديث ملف تعريف المستخدم
  async updateUserProfile(profileId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const profile = this.userProfiles.get(profileId);
    if (!profile) return null;

    const updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date(),
    };

    this.userProfiles.set(profileId, updatedProfile);
    return updatedProfile;
  }

  // تسجيل تفاعل المستخدم
  async recordInteraction(
    userId: string,
    itemId: string,
    interactionType: 'view' | 'click' | 'like' | 'dislike' | 'complete' | 'share',
    metadata?: Record<string, any>
  ): Promise<void> {
    const interaction = {
      id: this.generateId(),
      userId,
      itemId,
      type: interactionType,
      timestamp: new Date(),
      metadata: metadata || {},
    };

    const userInteractions = this.interactions.get(userId) || [];
    userInteractions.push(interaction);
    this.interactions.set(userId, userInteractions);

    // تحديث ملف تعريف المستخدم
    const profile = this.getUserProfileByUserId(userId);
    if (profile) {
      profile.behavior.interactionHistory.push(itemId);
      
      if (interactionType === 'click') {
        profile.behavior.clickHistory.push(itemId);
      }
      
      if (interactionType === 'complete') {
        profile.behavior.completionRate[itemId] = 1;
      }
      
      profile.updatedAt = new Date();
      this.userProfiles.set(profile.id, profile);
    }
  }

  // إنشاء خوارزمية توصية
  async createAlgorithm(algorithmData: {
    name: string;
    type: RecommendationAlgorithm['type'];
    parameters?: Record<string, any>;
  }): Promise<RecommendationAlgorithm> {
    const algorithm: RecommendationAlgorithm = {
      id: this.generateId(),
      name: algorithmData.name,
      type: algorithmData.type,
      parameters: algorithmData.parameters || {},
      accuracy: 0,
      coverage: 0,
      diversity: 0,
      status: 'training',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.algorithms.set(algorithm.id, algorithm);
    return algorithm;
  }

  // توليد التوصيات
  async generateRecommendations(
    userId: string,
    algorithmId?: string,
    limit: number = 10
  ): Promise<Recommendation[]> {
    const profile = this.getUserProfileByUserId(userId);
    if (!profile) {
      throw new Error('User profile not found');
    }

    let algorithm: RecommendationAlgorithm | null = null;
    
    if (algorithmId) {
      algorithm = this.algorithms.get(algorithmId) || null;
    }

    if (!algorithm) {
      // استخدام أفضل خوارزمية متاحة
      algorithm = this.getBestAlgorithm();
    }

    if (!algorithm) {
      throw new Error('No algorithm available');
    }

    // توليد التوصيات بناءً على نوع الخوارزمية
    let recommendations: Recommendation[] = [];

    switch (algorithm.type) {
      case 'collaborative':
        recommendations = await this.generateCollaborativeRecommendations(userId, algorithm, limit);
        break;
      case 'content_based':
        recommendations = await this.generateContentBasedRecommendations(userId, algorithm, limit);
        break;
      case 'hybrid':
        recommendations = await this.generateHybridRecommendations(userId, algorithm, limit);
        break;
      case 'deep_learning':
        recommendations = await this.generateDeepLearningRecommendations(userId, algorithm, limit);
        break;
    }

    // حفظ التوصيات
    const userRecommendations = this.recommendations.get(userId) || [];
    userRecommendations.push(...recommendations);
    this.recommendations.set(userId, userRecommendations);

    return recommendations;
  }

  // التوصيات التعاونية
  private async generateCollaborativeRecommendations(
    userId: string,
    algorithm: RecommendationAlgorithm,
    limit: number
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];
    const userInteractions = this.interactions.get(userId) || [];
    const allInteractions = Array.from(this.interactions.values()).flat();

    // العثور على مستخدمين مشابهين
    const similarUsers = this.findSimilarUsers(userId, allInteractions);

    // العثور على العناصر المفضلة للمستخدمين المشابهين
    const recommendedItems = new Map<string, number>();

    similarUsers.forEach(({ userId: similarUserId, similarity }) => {
      const similarUserInteractions = this.interactions.get(similarUserId) || [];
      const userItems = new Set(userInteractions.map(i => i.itemId));

      similarUserInteractions.forEach(interaction => {
        if (!userItems.has(interaction.itemId)) {
          const currentScore = recommendedItems.get(interaction.itemId) || 0;
          recommendedItems.set(interaction.itemId, currentScore + similarity);
        }
      });
    });

    // تحويل إلى توصيات
    Array.from(recommendedItems.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .forEach(([itemId, score]) => {
        const item = this.items.get(itemId);
        if (item) {
          recommendations.push({
            id: this.generateId(),
            userId,
            itemId,
            score: Math.min(1, score),
            reason: 'Users with similar preferences also liked this',
            confidence: 0.7 + Math.random() * 0.2,
            algorithm: algorithm.name,
            metadata: { similarity: score },
            timestamp: new Date(),
          });
        }
      });

    return recommendations;
  }

  // التوصيات القائمة على المحتوى
  private async generateContentBasedRecommendations(
    userId: string,
    algorithm: RecommendationAlgorithm,
    limit: number
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];
    const profile = this.getUserProfileByUserId(userId);
    if (!profile) return recommendations;

    const userInteractions = this.interactions.get(userId) || [];
    const userItems = new Set(userInteractions.map(i => i.itemId));

    // العثور على العناصر المشابهة للمحتوى المفضل
    const recommendedItems = new Map<string, number>();

    userItems.forEach(itemId => {
      const item = this.items.get(itemId);
      if (!item) return;

      // العثور على عناصر مشابهة
      Array.from(this.items.values()).forEach(candidateItem => {
        if (candidateItem.id !== itemId && !userItems.has(candidateItem.id)) {
          const similarity = this.calculateContentSimilarity(item, candidateItem);
          if (similarity > 0.3) {
            const currentScore = recommendedItems.get(candidateItem.id) || 0;
            recommendedItems.set(candidateItem.id, currentScore + similarity);
          }
        }
      });
    });

    // تحويل إلى توصيات
    Array.from(recommendedItems.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .forEach(([itemId, score]) => {
        recommendations.push({
          id: this.generateId(),
          userId,
          itemId,
          score: Math.min(1, score),
          reason: 'Similar to content you liked',
          confidence: 0.6 + Math.random() * 0.3,
          algorithm: algorithm.name,
          metadata: { contentSimilarity: score },
          timestamp: new Date(),
        });
      });

    return recommendations;
  }

  // التوصيات المختلطة
  private async generateHybridRecommendations(
    userId: string,
    algorithm: RecommendationAlgorithm,
    limit: number
  ): Promise<Recommendation[]> {
    // دمج التوصيات التعاونية والقائمة على المحتوى
    const collaborativeRecs = await this.generateCollaborativeRecommendations(userId, algorithm, limit);
    const contentBasedRecs = await this.generateContentBasedRecommendations(userId, algorithm, limit);

    // دمج التوصيات
    const combinedRecs = new Map<string, Recommendation>();

    collaborativeRecs.forEach(rec => {
      combinedRecs.set(rec.itemId, rec);
    });

    contentBasedRecs.forEach(rec => {
      const existing = combinedRecs.get(rec.itemId);
      if (existing) {
        // دمج النقاط
        existing.score = (existing.score + rec.score) / 2;
        existing.confidence = Math.max(existing.confidence, rec.confidence);
        existing.reason = 'Combined collaborative and content-based recommendation';
      } else {
        combinedRecs.set(rec.itemId, rec);
      }
    });

    return Array.from(combinedRecs.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // التوصيات بالتعلم العميق
  private async generateDeepLearningRecommendations(
    userId: string,
    algorithm: RecommendationAlgorithm,
    limit: number
  ): Promise<Recommendation[]> {
    // محاكاة التوصيات بالتعلم العميق
    const recommendations: Recommendation[] = [];
    const userInteractions = this.interactions.get(userId) || [];
    const userItems = new Set(userInteractions.map(i => i.itemId));

    // محاكاة نموذج التعلم العميق
    const candidateItems = Array.from(this.items.values())
      .filter(item => !userItems.has(item.id))
      .slice(0, limit * 2);

    candidateItems.forEach(item => {
      // محاكاة النتيجة من نموذج التعلم العميق
      const score = 0.5 + Math.random() * 0.4; // 0.5 - 0.9
      const confidence = 0.7 + Math.random() * 0.2; // 0.7 - 0.9

      recommendations.push({
        id: this.generateId(),
        userId,
        itemId: item.id,
        score,
        reason: 'Deep learning model prediction',
        confidence,
        algorithm: algorithm.name,
        metadata: { modelVersion: '1.0', features: ['user_behavior', 'item_content', 'context'] },
        timestamp: new Date(),
      });
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // العثور على مستخدمين مشابهين
  private findSimilarUsers(userId: string, allInteractions: any[]): Array<{ userId: string; similarity: number }> {
    const userInteractions = this.interactions.get(userId) || [];
    const userItems = new Set(userInteractions.map(i => i.itemId));
    const similarities: Array<{ userId: string; similarity: number }> = [];

    // تجميع التفاعلات حسب المستخدم
    const userInteractionMap = new Map<string, Set<string>>();
    allInteractions.forEach(interaction => {
      if (interaction.userId !== userId) {
        const items = userInteractionMap.get(interaction.userId) || new Set();
        items.add(interaction.itemId);
        userInteractionMap.set(interaction.userId, items);
      }
    });

    // حساب التشابه
    userInteractionMap.forEach((items, otherUserId) => {
      const intersection = new Set([...userItems].filter(item => items.has(item)));
      const union = new Set([...userItems, ...items]);
      const similarity = intersection.size / union.size;

      if (similarity > 0.1) {
        similarities.push({ userId: otherUserId, similarity });
      }
    });

    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 10);
  }

  // حساب تشابه المحتوى
  private calculateContentSimilarity(item1: RecommendationItem, item2: RecommendationItem): number {
    let similarity = 0;

    // تشابه الفئة
    if (item1.category === item2.category) {
      similarity += 0.4;
    }

    // تشابه العلامات
    const commonTags = item1.tags.filter(tag => item2.tags.includes(tag));
    const totalTags = new Set([...item1.tags, ...item2.tags]).size;
    if (totalTags > 0) {
      similarity += (commonTags.length / totalTags) * 0.3;
    }

    // تشابه العنوان والوصف
    const titleSimilarity = this.calculateTextSimilarity(item1.title, item2.title);
    const descriptionSimilarity = this.calculateTextSimilarity(item1.description, item2.description);
    similarity += (titleSimilarity + descriptionSimilarity) * 0.15;

    return Math.min(1, similarity);
  }

  // حساب تشابه النص
  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(' ');
    const words2 = text2.toLowerCase().split(' ');
    
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    
    const intersection = new Set([...set1].filter(word => set2.has(word)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  // الحصول على أفضل خوارزمية
  private getBestAlgorithm(): RecommendationAlgorithm | null {
    const algorithms = Array.from(this.algorithms.values())
      .filter(algo => algo.status === 'active')
      .sort((a, b) => b.accuracy - a.accuracy);
    
    return algorithms.length > 0 ? algorithms[0] : null;
  }

  // تحديث التغذية الراجعة
  async updateFeedback(recommendationId: string, feedback: 'positive' | 'negative' | 'neutral'): Promise<boolean> {
    // البحث عن التوصية في جميع المستخدمين
    for (const [userId, recommendations] of this.recommendations.entries()) {
      const recommendation = recommendations.find(r => r.id === recommendationId);
      if (recommendation) {
        recommendation.feedback = feedback;
        
        // تحديث دقة الخوارزمية
        const algorithm = this.algorithms.get(recommendation.algorithm);
        if (algorithm) {
          // محاكاة تحديث الدقة
          if (feedback === 'positive') {
            algorithm.accuracy = Math.min(0.95, algorithm.accuracy + 0.01);
          } else if (feedback === 'negative') {
            algorithm.accuracy = Math.max(0.1, algorithm.accuracy - 0.01);
          }
          
          algorithm.updatedAt = new Date();
          this.algorithms.set(algorithm.id, algorithm);
        }
        
        return true;
      }
    }
    
    return false;
  }

  // تحليل أداء النظام
  analyzeSystemPerformance(): {
    totalUsers: number;
    totalItems: number;
    totalRecommendations: number;
    averageAccuracy: number;
    averageCoverage: number;
    averageDiversity: number;
  } {
    const algorithms = Array.from(this.algorithms.values());
    const totalUsers = this.userProfiles.size;
    const totalItems = this.items.size;
    const totalRecommendations = Array.from(this.recommendations.values()).flat().length;

    const averageAccuracy = algorithms.length > 0 
      ? algorithms.reduce((sum, algo) => sum + algo.accuracy, 0) / algorithms.length 
      : 0;

    const averageCoverage = algorithms.length > 0 
      ? algorithms.reduce((sum, algo) => sum + algo.coverage, 0) / algorithms.length 
      : 0;

    const averageDiversity = algorithms.length > 0 
      ? algorithms.reduce((sum, algo) => sum + algo.diversity, 0) / algorithms.length 
      : 0;

    return {
      totalUsers,
      totalItems,
      totalRecommendations,
      averageAccuracy,
      averageCoverage,
      averageDiversity,
    };
  }

  // الحصول على ملف تعريف المستخدم
  getUserProfileByUserId(userId: string): UserProfile | null {
    for (const profile of this.userProfiles.values()) {
      if (profile.userId === userId) {
        return profile;
      }
    }
    return null;
  }

  // الحصول على التوصيات للمستخدم
  getUserRecommendations(userId: string, limit: number = 20): Recommendation[] {
    const recommendations = this.recommendations.get(userId) || [];
    return recommendations
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // تصدير بيانات النظام
  exportRecommendationData(): {
    items: RecommendationItem[];
    userProfiles: UserProfile[];
    recommendations: Recommendation[];
    algorithms: RecommendationAlgorithm[];
  } {
    return {
      items: Array.from(this.items.values()),
      userProfiles: Array.from(this.userProfiles.values()),
      recommendations: Array.from(this.recommendations.values()).flat(),
      algorithms: Array.from(this.algorithms.values()),
    };
  }

  // إنشاء ID فريد
  private generateId(): string {
    return createHash('md5').update(Date.now().toString() + Math.random().toString()).digest('hex');
  }
}
