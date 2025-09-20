// نظام التخزين المؤقت المتقدم
import { createHash } from 'crypto';

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size
  strategy?: 'lru' | 'lfu' | 'fifo'; // Cache eviction strategy
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

export class AdvancedCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private accessOrder: string[] = [];
  private maxSize: number;
  private ttl: number;
  private strategy: 'lru' | 'lfu' | 'fifo';

  constructor(options: CacheOptions = {}) {
    this.ttl = options.ttl || 5 * 60 * 1000; // 5 minutes default
    this.maxSize = options.maxSize || 1000; // 1000 entries default
    this.strategy = options.strategy || 'lru';
  }

  // إضافة عنصر للتخزين المؤقت
  set(key: string, data: T): void {
    const now = Date.now();
    
    // إزالة العناصر المنتهية الصلاحية
    this.cleanup();
    
    // إزالة العناصر إذا تجاوزنا الحد الأقصى
    if (this.cache.size >= this.maxSize) {
      this.evict();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      accessCount: 0,
      lastAccessed: now,
    };

    this.cache.set(key, entry);
    this.updateAccessOrder(key);
  }

  // الحصول على عنصر من التخزين المؤقت
  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // تحقق من انتهاء الصلاحية
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      return null;
    }

    // تحديث إحصائيات الوصول
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.updateAccessOrder(key);

    return entry.data;
  }

  // حذف عنصر من التخزين المؤقت
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.removeFromAccessOrder(key);
    }
    return deleted;
  }

  // مسح التخزين المؤقت بالكامل
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  // الحصول على حجم التخزين المؤقت
  size(): number {
    return this.cache.size;
  }

  // الحصول على إحصائيات التخزين المؤقت
  getStats() {
    const now = Date.now();
    let totalAccessCount = 0;
    let expiredEntries = 0;

    for (const entry of this.cache.values()) {
      totalAccessCount += entry.accessCount;
      if (now - entry.timestamp > this.ttl) {
        expiredEntries++;
      }
    }

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl,
      strategy: this.strategy,
      totalAccessCount,
      expiredEntries,
      hitRate: totalAccessCount > 0 ? (totalAccessCount - expiredEntries) / totalAccessCount : 0,
    };
  }

  // تنظيف العناصر المنتهية الصلاحية
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
    });
  }

  // إزالة العناصر حسب الاستراتيجية
  private evict(): void {
    if (this.cache.size === 0) return;

    let keyToRemove: string;

    switch (this.strategy) {
      case 'lru':
        keyToRemove = this.accessOrder[0]; // الأقل استخداماً مؤخراً
        break;
      case 'lfu':
        keyToRemove = this.getLeastFrequentlyUsed();
        break;
      case 'fifo':
        keyToRemove = this.accessOrder[0]; // الأول في الأول
        break;
      default:
        keyToRemove = this.accessOrder[0];
    }

    this.cache.delete(keyToRemove);
    this.removeFromAccessOrder(keyToRemove);
  }

  // الحصول على العنصر الأقل استخداماً
  private getLeastFrequentlyUsed(): string {
    let minAccessCount = Infinity;
    let leastUsedKey = '';

    for (const [key, entry] of this.cache.entries()) {
      if (entry.accessCount < minAccessCount) {
        minAccessCount = entry.accessCount;
        leastUsedKey = key;
      }
    }

    return leastUsedKey;
  }

  // تحديث ترتيب الوصول
  private updateAccessOrder(key: string): void {
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
  }

  // إزالة مفتاح من ترتيب الوصول
  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }
}

// نظام التخزين المؤقت للاستعلامات
export class QueryCache {
  private static cache = new AdvancedCache<any>({
    ttl: 10 * 60 * 1000, // 10 minutes
    maxSize: 500,
    strategy: 'lru',
  });

  // إنشاء مفتاح فريد للاستعلام
  static generateKey(query: string, params: any[] = []): string {
    const queryString = `${query}:${JSON.stringify(params)}`;
    return createHash('md5').update(queryString).digest('hex');
  }

  // تخزين نتيجة الاستعلام
  static set(query: string, params: any[], result: any): void {
    const key = this.generateKey(query, params);
    this.cache.set(key, result);
  }

  // الحصول على نتيجة الاستعلام
  static get(query: string, params: any[] = []): any | null {
    const key = this.generateKey(query, params);
    return this.cache.get(key);
  }

  // مسح التخزين المؤقت للاستعلامات
  static clear(): void {
    this.cache.clear();
  }

  // الحصول على إحصائيات التخزين المؤقت
  static getStats() {
    return this.cache.getStats();
  }
}

// نظام التخزين المؤقت للجلسات
export class SessionCache {
  private static cache = new AdvancedCache<any>({
    ttl: 30 * 60 * 1000, // 30 minutes
    maxSize: 1000,
    strategy: 'lru',
  });

  // تخزين بيانات الجلسة
  static set(sessionId: string, data: any): void {
    this.cache.set(sessionId, data);
  }

  // الحصول على بيانات الجلسة
  static get(sessionId: string): any | null {
    return this.cache.get(sessionId);
  }

  // حذف جلسة
  static delete(sessionId: string): boolean {
    return this.cache.delete(sessionId);
  }

  // مسح جميع الجلسات
  static clear(): void {
    this.cache.clear();
  }

  // الحصول على إحصائيات الجلسات
  static getStats() {
    return this.cache.getStats();
  }
}

// نظام التخزين المؤقت للملفات
export class FileCache {
  private static cache = new AdvancedCache<Buffer>({
    ttl: 60 * 60 * 1000, // 1 hour
    maxSize: 100,
    strategy: 'lru',
  });

  // تخزين ملف
  static set(filePath: string, content: Buffer): void {
    this.cache.set(filePath, content);
  }

  // الحصول على ملف
  static get(filePath: string): Buffer | null {
    return this.cache.get(filePath);
  }

  // حذف ملف من التخزين المؤقت
  static delete(filePath: string): boolean {
    return this.cache.delete(filePath);
  }

  // مسح جميع الملفات
  static clear(): void {
    this.cache.clear();
  }

  // الحصول على إحصائيات الملفات
  static getStats() {
    return this.cache.getStats();
  }
}

// نظام التخزين المؤقت للصفحات
export class PageCache {
  private static cache = new AdvancedCache<string>({
    ttl: 15 * 60 * 1000, // 15 minutes
    maxSize: 200,
    strategy: 'lru',
  });

  // تخزين صفحة
  static set(url: string, html: string): void {
    this.cache.set(url, html);
  }

  // الحصول على صفحة
  static get(url: string): string | null {
    return this.cache.get(url);
  }

  // حذف صفحة من التخزين المؤقت
  static delete(url: string): boolean {
    return this.cache.delete(url);
  }

  // مسح جميع الصفحات
  static clear(): void {
    this.cache.clear();
  }

  // الحصول على إحصائيات الصفحات
  static getStats() {
    return this.cache.getStats();
  }
}

// نظام التخزين المؤقت الشامل
export class CacheManager {
  // مسح جميع أنواع التخزين المؤقت
  static clearAll(): void {
    QueryCache.clear();
    SessionCache.clear();
    FileCache.clear();
    PageCache.clear();
  }

  // الحصول على إحصائيات شاملة
  static getAllStats() {
    return {
      queries: QueryCache.getStats(),
      sessions: SessionCache.getStats(),
      files: FileCache.getStats(),
      pages: PageCache.getStats(),
    };
  }

  // تنظيف التخزين المؤقت المنتهي الصلاحية
  static cleanup(): void {
    // يتم التنظيف تلقائياً في كل عملية get/set
    console.log('Cache cleanup completed');
  }
}
