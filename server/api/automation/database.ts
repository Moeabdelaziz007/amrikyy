// Database Configuration and Connection
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV !== 'production';

// Database connection configuration
let connectionString: string;
let db: any;

if (isDevelopment) {
  // Use SQLite for development
  connectionString = 'sqlite:./dev.db';
} else {
  // Use PostgreSQL for production
  connectionString =
    process.env.DATABASE_URL || 'postgresql://localhost:5432/auraos_automation';

  // Create postgres client
  const client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  // Create drizzle database instance
  db = drizzle(client, { schema });
}

// For development, we'll use a simple mock database
if (isDevelopment) {
  // Mock database for development
  const mockData = {
    workspaces: [],
    tasks: [],
    executions: [],
    users: [],
  };

  db = {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: () => mockData,
        }),
      }),
    }),
    insert: () => ({
      values: () => ({
        returning: () => [],
      }),
    }),
    update: () => ({
      set: () => ({
        where: () => ({
          returning: () => [],
        }),
      }),
    }),
    delete: () => ({
      where: () => ({
        returning: () => [],
      }),
    }),
  };
}

// Create drizzle database instance
export { db };

// Database health check
export async function checkDatabaseHealth(): Promise<boolean> {
  if (isDevelopment) {
    // In development, always return true for mock database
    return true;
  }

  try {
    await client`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Database connection pool management
export class DatabaseManager {
  private static instance: DatabaseManager;
  private isConnected = false;
  private connectionCount = 0;

  private constructor() {}

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        await checkDatabaseHealth();
        this.isConnected = true;
        console.log('✅ Database connected successfully');
      } catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      try {
        await client.end();
        this.isConnected = false;
        console.log('✅ Database disconnected successfully');
      } catch (error) {
        console.error('❌ Database disconnection failed:', error);
        throw error;
      }
    }
  }

  public getConnectionCount(): number {
    return this.connectionCount;
  }

  public isHealthy(): boolean {
    return this.isConnected;
  }
}

// Database utilities
export class DatabaseUtils {
  // Generate UUID
  public static generateId(): string {
    return crypto.randomUUID();
  }

  // Format date for database
  public static formatDate(date: Date): string {
    return date.toISOString();
  }

  // Parse date from database
  public static parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  // Escape SQL strings
  public static escapeString(str: string): string {
    return str.replace(/'/g, "''");
  }

  // Build pagination query
  public static buildPaginationQuery(
    page: number = 1,
    limit: number = 10
  ): { offset: number; limit: number } {
    const offset = (page - 1) * limit;
    return { offset, limit };
  }

  // Build search query
  public static buildSearchQuery(searchTerm: string, fields: string[]): string {
    if (!searchTerm || fields.length === 0) return '';

    const conditions = fields
      .map(field => `${field} ILIKE '%${this.escapeString(searchTerm)}%'`)
      .join(' OR ');

    return `WHERE ${conditions}`;
  }

  // Build filter query
  public static buildFilterQuery(filters: Record<string, any>): string {
    if (!filters || Object.keys(filters).length === 0) return '';

    const conditions = Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key} IN (${value.map(v => `'${this.escapeString(String(v))}'`).join(', ')})`;
        }
        return `${key} = '${this.escapeString(String(value))}'`;
      })
      .join(' AND ');

    return conditions ? `WHERE ${conditions}` : '';
  }

  // Build sort query
  public static buildSortQuery(
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): string {
    const validSortFields = [
      'createdAt',
      'updatedAt',
      'name',
      'status',
      'priority',
      'executionCount',
      'successRate',
      'avgDuration',
    ];

    if (!validSortFields.includes(sortBy)) {
      sortBy = 'createdAt';
    }

    return `ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
  }

  // Execute transaction
  public static async executeTransaction<T>(
    operations: (db: typeof db) => Promise<T>[]
  ): Promise<T[]> {
    try {
      const results: T[] = [];

      // Note: For actual transaction support, you'd need to use a transaction method
      // This is a simplified version for demonstration
      for (const operation of operations) {
        const result = await operation(db);
        results.push(result);
      }

      return results;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  // Batch operations
  public static async batchInsert<T>(table: any, data: T[]): Promise<void> {
    try {
      // Split into batches of 1000 records
      const batchSize = 1000;
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        await db.insert(table).values(batch);
      }
    } catch (error) {
      console.error('Batch insert failed:', error);
      throw error;
    }
  }

  // Soft delete
  public static async softDelete(table: any, id: string): Promise<void> {
    try {
      await db
        .update(table)
        .set({
          deletedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(table.id, id));
    } catch (error) {
      console.error('Soft delete failed:', error);
      throw error;
    }
  }

  // Restore soft deleted record
  public static async restore(table: any, id: string): Promise<void> {
    try {
      await db
        .update(table)
        .set({
          deletedAt: null,
          updatedAt: new Date(),
        })
        .where(eq(table.id, id));
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  }
}

// Database middleware for error handling
export function withDatabaseErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Database operation failed:', error);

      // Handle specific database errors
      if (error instanceof Error) {
        if (error.message.includes('duplicate key')) {
          throw new Error('Record already exists');
        }
        if (error.message.includes('foreign key')) {
          throw new Error('Referenced record not found');
        }
        if (error.message.includes('not null')) {
          throw new Error('Required field is missing');
        }
      }

      throw error;
    }
  };
}

// Export database manager instance
export const dbManager = DatabaseManager.getInstance();
