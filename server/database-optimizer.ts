// تحسين قاعدة البيانات والأداء
import { db } from './db';
import { sql } from 'drizzle-orm';
import {
  users,
  posts,
  workflows,
  agentTemplates,
  userAgents,
  chatMessages,
} from '@shared/schema';

// تحسين الاستعلامات
export class DatabaseOptimizer {
  // تحسين استعلام المستخدمين
  static async getUsersOptimized(limit: number = 50, offset: number = 0) {
    return await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        identityName: users.identityName,
        verified: users.verified,
        createdAt: users.createdAt,
      })
      .from(users)
      .limit(limit)
      .offset(offset)
      .orderBy(users.createdAt);
  }

  // تحسين استعلام المنشورات
  static async getPostsOptimized(limit: number = 20, offset: number = 0) {
    return await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        authorId: posts.authorId,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .limit(limit)
      .offset(offset)
      .orderBy(posts.createdAt);
  }

  // تحسين استعلام سير العمل
  static async getWorkflowsOptimized(limit: number = 20, offset: number = 0) {
    return await db
      .select({
        id: workflows.id,
        name: workflows.name,
        description: workflows.description,
        steps: workflows.steps,
        isActive: workflows.isActive,
        createdAt: workflows.createdAt,
        updatedAt: workflows.updatedAt,
      })
      .from(workflows)
      .limit(limit)
      .offset(offset)
      .orderBy(workflows.createdAt);
  }

  // تحسين استعلام قوالب الوكلاء
  static async getAgentTemplatesOptimized(
    limit: number = 20,
    offset: number = 0
  ) {
    return await db
      .select({
        id: agentTemplates.id,
        name: agentTemplates.name,
        description: agentTemplates.description,
        systemPrompt: agentTemplates.systemPrompt,
        capabilities: agentTemplates.capabilities,
        createdAt: agentTemplates.createdAt,
        updatedAt: agentTemplates.updatedAt,
      })
      .from(agentTemplates)
      .limit(limit)
      .offset(offset)
      .orderBy(agentTemplates.createdAt);
  }

  // تحسين استعلام وكلاء المستخدم
  static async getUserAgentsOptimized(limit: number = 20, offset: number = 0) {
    return await db
      .select({
        id: userAgents.id,
        name: userAgents.name,
        description: userAgents.description,
        templateId: userAgents.templateId,
        configuration: userAgents.configuration,
        isActive: userAgents.isActive,
        createdAt: userAgents.createdAt,
        updatedAt: userAgents.updatedAt,
      })
      .from(userAgents)
      .limit(limit)
      .offset(offset)
      .orderBy(userAgents.createdAt);
  }

  // تحسين استعلام رسائل الدردشة
  static async getChatMessagesOptimized(
    limit: number = 50,
    offset: number = 0
  ) {
    return await db
      .select({
        id: chatMessages.id,
        userId: chatMessages.userId,
        agentId: chatMessages.agentId,
        content: chatMessages.content,
        role: chatMessages.role,
        timestamp: chatMessages.timestamp,
      })
      .from(chatMessages)
      .limit(limit)
      .offset(offset)
      .orderBy(chatMessages.timestamp);
  }

  // تحسين البحث
  static async searchOptimized(
    query: string,
    table: 'users' | 'posts' | 'workflows' | 'agentTemplates' | 'userAgents',
    limit: number = 20
  ) {
    const searchTerm = `%${query}%`;

    switch (table) {
      case 'users':
        return await db
          .select()
          .from(users)
          .where(sql`username ILIKE ${searchTerm} OR email ILIKE ${searchTerm}`)
          .limit(limit);

      case 'posts':
        return await db
          .select()
          .from(posts)
          .where(sql`title ILIKE ${searchTerm} OR content ILIKE ${searchTerm}`)
          .limit(limit);

      case 'workflows':
        return await db
          .select()
          .from(workflows)
          .where(
            sql`name ILIKE ${searchTerm} OR description ILIKE ${searchTerm}`
          )
          .limit(limit);

      case 'agentTemplates':
        return await db
          .select()
          .from(agentTemplates)
          .where(
            sql`name ILIKE ${searchTerm} OR description ILIKE ${searchTerm}`
          )
          .limit(limit);

      case 'userAgents':
        return await db
          .select()
          .from(userAgents)
          .where(
            sql`name ILIKE ${searchTerm} OR description ILIKE ${searchTerm}`
          )
          .limit(limit);

      default:
        throw new Error(`Unsupported table: ${table}`);
    }
  }

  // تحسين الإحصائيات
  static async getStatsOptimized() {
    const [userCount, postCount, workflowCount, agentCount, messageCount] =
      await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(users),
        db.select({ count: sql<number>`count(*)` }).from(posts),
        db.select({ count: sql<number>`count(*)` }).from(workflows),
        db.select({ count: sql<number>`count(*)` }).from(userAgents),
        db.select({ count: sql<number>`count(*)` }).from(chatMessages),
      ]);

    return {
      users: userCount[0]?.count || 0,
      posts: postCount[0]?.count || 0,
      workflows: workflowCount[0]?.count || 0,
      agents: agentCount[0]?.count || 0,
      messages: messageCount[0]?.count || 0,
    };
  }

  // تحسين التحديثات المجمعة
  static async batchUpdateOptimized(
    table: 'users' | 'posts' | 'workflows' | 'agentTemplates' | 'userAgents',
    updates: Array<{ id: string; data: any }>
  ) {
    const results = [];

    for (const update of updates) {
      try {
        let result;
        switch (table) {
          case 'users':
            result = await db
              .update(users)
              .set(update.data)
              .where(sql`id = ${update.id}`);
            break;
          case 'posts':
            result = await db
              .update(posts)
              .set(update.data)
              .where(sql`id = ${update.id}`);
            break;
          case 'workflows':
            result = await db
              .update(workflows)
              .set(update.data)
              .where(sql`id = ${update.id}`);
            break;
          case 'agentTemplates':
            result = await db
              .update(agentTemplates)
              .set(update.data)
              .where(sql`id = ${update.id}`);
            break;
          case 'userAgents':
            result = await db
              .update(userAgents)
              .set(update.data)
              .where(sql`id = ${update.id}`);
            break;
          default:
            throw new Error(`Unsupported table: ${table}`);
        }
        results.push({ success: true, id: update.id, result });
      } catch (error) {
        results.push({ success: false, id: update.id, error });
      }
    }

    return results;
  }

  // تحسين الحذف المجمع
  static async batchDeleteOptimized(
    table: 'users' | 'posts' | 'workflows' | 'agentTemplates' | 'userAgents',
    ids: string[]
  ) {
    const results = [];

    for (const id of ids) {
      try {
        let result;
        switch (table) {
          case 'users':
            result = await db.delete(users).where(sql`id = ${id}`);
            break;
          case 'posts':
            result = await db.delete(posts).where(sql`id = ${id}`);
            break;
          case 'workflows':
            result = await db.delete(workflows).where(sql`id = ${id}`);
            break;
          case 'agentTemplates':
            result = await db.delete(agentTemplates).where(sql`id = ${id}`);
            break;
          case 'userAgents':
            result = await db.delete(userAgents).where(sql`id = ${id}`);
            break;
          default:
            throw new Error(`Unsupported table: ${table}`);
        }
        results.push({ success: true, id, result });
      } catch (error) {
        results.push({ success: false, id, error });
      }
    }

    return results;
  }
}

// تحسين التخزين المؤقت
export class CacheManager {
  private static cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();

  static set(key: string, data: any, ttl: number = 5 * 60 * 1000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  static get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  static delete(key: string) {
    this.cache.delete(key);
  }

  static clear() {
    this.cache.clear();
  }

  static size() {
    return this.cache.size;
  }
}

// تحسين الاتصال بقاعدة البيانات
export class ConnectionPool {
  private static connections: any[] = [];
  private static maxConnections = 10;
  private static currentConnections = 0;

  static async getConnection() {
    if (this.currentConnections < this.maxConnections) {
      this.currentConnections++;
      return db;
    }

    // انتظار الاتصال المتاح
    return new Promise(resolve => {
      const checkConnection = () => {
        if (this.currentConnections < this.maxConnections) {
          this.currentConnections++;
          resolve(db);
        } else {
          setTimeout(checkConnection, 100);
        }
      };
      checkConnection();
    });
  }

  static releaseConnection() {
    if (this.currentConnections > 0) {
      this.currentConnections--;
    }
  }
}
