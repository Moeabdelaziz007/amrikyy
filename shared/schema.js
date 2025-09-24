"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertChatMessageSchema = exports.insertUserAgentSchema = exports.insertAgentTemplateSchema = exports.insertWorkflowSchema = exports.insertPostSchema = exports.insertUserSchema = exports.insertTenantSchema = exports.chatMessages = exports.userAgents = exports.agentTemplates = exports.workflows = exports.posts = exports.users = exports.tenants = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
exports.tenants = (0, pg_core_1.pgTable)('tenants', {
    id: (0, pg_core_1.varchar)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)('name').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.varchar)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    tenantId: (0, pg_core_1.varchar)('tenant_id')
        .notNull()
        .references(() => exports.tenants.id),
    username: (0, pg_core_1.text)('username').notNull().unique(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    password: (0, pg_core_1.text)('password').notNull(),
    identityName: (0, pg_core_1.text)('identity_name').notNull(),
    identityIcon: (0, pg_core_1.text)('identity_icon'),
    identityType: (0, pg_core_1.text)('identity_type').default('personal').notNull(),
    verified: (0, pg_core_1.boolean)('verified').default(false).notNull(),
    persona: (0, pg_core_1.jsonb)('persona').$type(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.posts = (0, pg_core_1.pgTable)('posts', {
    id: (0, pg_core_1.varchar)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    tenantId: (0, pg_core_1.varchar)('tenant_id')
        .notNull()
        .references(() => exports.tenants.id),
    authorId: (0, pg_core_1.varchar)('author_id')
        .notNull()
        .references(() => exports.users.id),
    content: (0, pg_core_1.text)('content').notNull(),
    imageUrl: (0, pg_core_1.text)('image_url'),
    isAiGenerated: (0, pg_core_1.boolean)('is_ai_generated').default(false).notNull(),
    likes: (0, pg_core_1.integer)('likes').default(0).notNull(),
    shares: (0, pg_core_1.integer)('shares').default(0).notNull(),
    comments: (0, pg_core_1.integer)('comments').default(0).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.workflows = (0, pg_core_1.pgTable)('workflows', {
    id: (0, pg_core_1.varchar)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    tenantId: (0, pg_core_1.varchar)('tenant_id')
        .notNull()
        .references(() => exports.tenants.id),
    userId: (0, pg_core_1.varchar)('user_id')
        .notNull()
        .references(() => exports.users.id),
    name: (0, pg_core_1.text)('name').notNull(),
    description: (0, pg_core_1.text)('description'),
    nodes: (0, pg_core_1.jsonb)('nodes').notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').default(false).notNull(),
    runCount: (0, pg_core_1.integer)('run_count').default(0).notNull(),
    lastRun: (0, pg_core_1.timestamp)('last_run'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.agentTemplates = (0, pg_core_1.pgTable)('agent_templates', {
    id: (0, pg_core_1.varchar)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    tenantId: (0, pg_core_1.varchar)('tenant_id').references(() => exports.tenants.id),
    name: (0, pg_core_1.text)('name').notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    category: (0, pg_core_1.text)('category').notNull(),
    icon: (0, pg_core_1.text)('icon').notNull(),
    config: (0, pg_core_1.jsonb)('config').notNull(),
    usageCount: (0, pg_core_1.integer)('usage_count').default(0).notNull(),
    isPopular: (0, pg_core_1.boolean)('is_popular').default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.userAgents = (0, pg_core_1.pgTable)('user_agents', {
    id: (0, pg_core_1.varchar)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    tenantId: (0, pg_core_1.varchar)('tenant_id')
        .notNull()
        .references(() => exports.tenants.id),
    userId: (0, pg_core_1.varchar)('user_id')
        .notNull()
        .references(() => exports.users.id),
    templateId: (0, pg_core_1.varchar)('template_id')
        .notNull()
        .references(() => exports.agentTemplates.id),
    name: (0, pg_core_1.text)('name').notNull(),
    config: (0, pg_core_1.jsonb)('config').notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    lastRun: (0, pg_core_1.timestamp)('last_run'),
    runCount: (0, pg_core_1.integer)('run_count').default(0).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.chatMessages = (0, pg_core_1.pgTable)('chat_messages', {
    id: (0, pg_core_1.varchar)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    tenantId: (0, pg_core_1.varchar)('tenant_id')
        .notNull()
        .references(() => exports.tenants.id),
    userId: (0, pg_core_1.varchar)('user_id')
        .notNull()
        .references(() => exports.users.id),
    message: (0, pg_core_1.text)('message').notNull(),
    response: (0, pg_core_1.text)('response').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.insertTenantSchema = (0, drizzle_zod_1.createInsertSchema)(exports.tenants).omit({
    id: true,
    createdAt: true,
});
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).omit({
    id: true,
    createdAt: true,
});
exports.insertPostSchema = (0, drizzle_zod_1.createInsertSchema)(exports.posts).omit({
    id: true,
    createdAt: true,
    likes: true,
    shares: true,
    comments: true,
});
exports.insertWorkflowSchema = (0, drizzle_zod_1.createInsertSchema)(exports.workflows).omit({
    id: true,
    createdAt: true,
    runCount: true,
    lastRun: true,
});
exports.insertAgentTemplateSchema = (0, drizzle_zod_1.createInsertSchema)(exports.agentTemplates).omit({
    id: true,
    createdAt: true,
    usageCount: true,
});
exports.insertUserAgentSchema = (0, drizzle_zod_1.createInsertSchema)(exports.userAgents).omit({
    id: true,
    createdAt: true,
    runCount: true,
    lastRun: true,
});
exports.insertChatMessageSchema = (0, drizzle_zod_1.createInsertSchema)(exports.chatMessages).omit({
    id: true,
    createdAt: true,
});
//# sourceMappingURL=schema.js.map