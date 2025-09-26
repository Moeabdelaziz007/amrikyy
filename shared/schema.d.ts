import { z } from 'zod';
export declare const tenants: any;
export declare const users: any;
export declare const posts: any;
export declare const workflows: any;
export declare const agentTemplates: any;
export declare const userAgents: any;
export declare const chatMessages: any;
export declare const insertTenantSchema: any;
export declare const insertUserSchema: any;
export declare const insertPostSchema: any;
export declare const insertWorkflowSchema: any;
export declare const insertAgentTemplateSchema: any;
export declare const insertUserAgentSchema: any;
export declare const insertChatMessageSchema: any;
export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type DigitalIdentity = typeof users.$inferSelect;
export type User = DigitalIdentity;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;
export type AgentTemplate = typeof agentTemplates.$inferSelect;
export type InsertAgentTemplate = z.infer<typeof insertAgentTemplateSchema>;
export type UserAgent = typeof userAgents.$inferSelect;
export type InsertUserAgent = z.infer<typeof insertUserAgentSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type PostWithAuthor = Post & {
    author: User;
};
export type WorkflowNode = {
    id: string;
    type: 'trigger' | 'ai' | 'action';
    position: {
        x: number;
        y: number;
    };
    data: Record<string, any>;
};
//# sourceMappingURL=schema.d.ts.map