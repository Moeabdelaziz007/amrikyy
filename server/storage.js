"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.MemStorage = void 0;
const crypto_1 = require("crypto");
class MemStorage {
    users = new Map();
    posts = new Map();
    workflows = new Map();
    agentTemplates = new Map();
    userAgents = new Map();
    chatMessages = new Map();
    constructor() {
        this.seedData();
    }
    seedData() {
        // Create default user
        const defaultUser = {
            id: "user-1",
            username: "sarah_chen",
            email: "sarah@aiflow.com",
            password: "hashed_password",
            identityName: "Sarah Chen",
            identityIcon: "https://pixabay.com/get/g011ff5f5c9bd65a7bc140f57f12d8cfdf70bb92b9dd19ca90dce3197ce111976f37bb58b61f09efdc75e86cdc7ecbb61d7c6632c241ef7517650a98d2e8a979e_1280.jpg",
            identityType: "personal",
            verified: true,
            createdAt: new Date()
        };
        this.users.set(defaultUser.id, defaultUser);
        // Create sample agent templates
        const templates = [
            {
                id: "template-1",
                name: "Content Curator",
                description: "Finds and curates trending content in your niche",
                category: "Content",
                icon: "fas fa-magic",
                config: {
                    triggers: ["trending_topic", "keyword_mention"],
                    actions: ["create_post", "schedule_post"]
                },
                usageCount: 2300,
                isPopular: true,
                createdAt: new Date()
            },
            {
                id: "template-2",
                name: "Reply Assistant",
                description: "Auto-responds to comments and mentions",
                category: "Engagement",
                icon: "fas fa-comments",
                config: {
                    triggers: ["new_comment", "mention"],
                    actions: ["generate_reply", "send_notification"]
                },
                usageCount: 892,
                isPopular: false,
                createdAt: new Date()
            },
            {
                id: "template-3",
                name: "Trend Analyzer",
                description: "Analyzes trends and suggests content ideas",
                category: "Analytics",
                icon: "fas fa-chart-line",
                config: {
                    triggers: ["daily_schedule"],
                    actions: ["analyze_trends", "suggest_content"]
                },
                usageCount: 1500,
                isPopular: false,
                createdAt: new Date()
            }
        ];
        templates.forEach(template => {
            this.agentTemplates.set(template.id, template);
        });
        // Create sample posts
        const posts = [
            {
                id: "post-1",
                authorId: "user-1",
                content: "Just launched my new AI-powered workflow automation! 🤖 It automatically generates social media content based on trending topics and schedules posts at optimal times. The results have been incredible - 300% increase in engagement! #AIAutomation #SocialMedia #ProductivityHack",
                imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
                isAiGenerated: true,
                likes: 247,
                shares: 18,
                comments: 32,
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
            },
            {
                id: "post-2",
                authorId: "user-1",
                content: "Sharing my top 5 AI agent templates that have transformed my content strategy! These automation workflows handle everything from research to publishing. Who else is using AI to scale their social presence? 🚀",
                imageUrl: null,
                isAiGenerated: false,
                likes: 156,
                shares: 12,
                comments: 23,
                createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
            }
        ];
        posts.forEach(post => {
            this.posts.set(post.id, post);
        });
        // Create sample workflow
        const workflow = {
            id: "workflow-1",
            userId: "user-1",
            name: "Auto Engagement Responder",
            description: "Automatically responds to mentions with AI-generated replies",
            nodes: [
                {
                    id: "trigger-1",
                    type: "trigger",
                    position: { x: 100, y: 100 },
                    data: { type: "new_mention" }
                },
                {
                    id: "ai-1",
                    type: "ai",
                    position: { x: 300, y: 100 },
                    data: { type: "sentiment_analysis" }
                },
                {
                    id: "action-1",
                    type: "action",
                    position: { x: 500, y: 100 },
                    data: { type: "auto_reply" }
                }
            ],
            isActive: true,
            runCount: 12,
            lastRun: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
            createdAt: new Date()
        };
        this.workflows.set(workflow.id, workflow);
    }
    async getUser(id) {
        return this.users.get(id);
    }
    async getUserByUsername(username) {
        return Array.from(this.users.values()).find(user => user.username === username);
    }
    async getUserByEmail(email) {
        return Array.from(this.users.values()).find(user => user.email === email);
    }
    async createUser(insertUser) {
        const id = (0, crypto_1.randomUUID)();
        const user = {
            ...insertUser,
            id,
            identityIcon: insertUser.identityIcon || null,
            identityType: insertUser.identityType || "personal",
            verified: false,
            createdAt: new Date()
        };
        this.users.set(id, user);
        return user;
    }
    async createPost(insertPost) {
        const id = (0, crypto_1.randomUUID)();
        const post = {
            ...insertPost,
            id,
            imageUrl: insertPost.imageUrl || null,
            isAiGenerated: insertPost.isAiGenerated || false,
            likes: 0,
            shares: 0,
            comments: 0,
            createdAt: new Date()
        };
        this.posts.set(id, post);
        return post;
    }
    async getPostsWithAuthor(limit = 10) {
        const posts = Array.from(this.posts.values())
            .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
            .slice(0, limit);
        return posts.map(post => {
            const author = this.users.get(post.authorId);
            if (!author)
                throw new Error('Post author not found');
            return { ...post, author };
        });
    }
    async getPost(id) {
        return this.posts.get(id);
    }
    async updatePostStats(id, likes, shares, comments) {
        const post = this.posts.get(id);
        if (post) {
            this.posts.set(id, { ...post, likes, shares, comments });
        }
    }
    async createWorkflow(insertWorkflow) {
        const id = (0, crypto_1.randomUUID)();
        const workflow = {
            ...insertWorkflow,
            id,
            description: insertWorkflow.description || null,
            isActive: insertWorkflow.isActive ?? false,
            runCount: 0,
            lastRun: null,
            createdAt: new Date()
        };
        this.workflows.set(id, workflow);
        return workflow;
    }
    async getWorkflowsByUser(userId) {
        return Array.from(this.workflows.values()).filter(w => w.userId === userId);
    }
    async getWorkflow(id) {
        return this.workflows.get(id);
    }
    async updateWorkflow(id, updates) {
        const workflow = this.workflows.get(id);
        if (workflow) {
            this.workflows.set(id, { ...workflow, ...updates });
        }
    }
    async deleteWorkflow(id) {
        this.workflows.delete(id);
    }
    async getAgentTemplates() {
        return Array.from(this.agentTemplates.values());
    }
    async getAgentTemplate(id) {
        return this.agentTemplates.get(id);
    }
    async createAgentTemplate(insertTemplate) {
        const id = (0, crypto_1.randomUUID)();
        const template = {
            ...insertTemplate,
            id,
            usageCount: 0,
            isPopular: insertTemplate.isPopular ?? false,
            createdAt: new Date()
        };
        this.agentTemplates.set(id, template);
        return template;
    }
    async incrementTemplateUsage(id) {
        const template = this.agentTemplates.get(id);
        if (template) {
            this.agentTemplates.set(id, {
                ...template,
                usageCount: template.usageCount + 1
            });
        }
    }
    async createUserAgent(insertAgent) {
        const id = (0, crypto_1.randomUUID)();
        const agent = {
            ...insertAgent,
            id,
            isActive: insertAgent.isActive ?? true,
            runCount: 0,
            lastRun: null,
            createdAt: new Date()
        };
        this.userAgents.set(id, agent);
        return agent;
    }
    async getUserAgents(userId) {
        return Array.from(this.userAgents.values()).filter(a => a.userId === userId);
    }
    async getUserAgent(id) {
        return this.userAgents.get(id);
    }
    async updateUserAgent(id, updates) {
        const agent = this.userAgents.get(id);
        if (agent) {
            this.userAgents.set(id, { ...agent, ...updates });
        }
    }
    async deleteUserAgent(id) {
        this.userAgents.delete(id);
    }
    async createChatMessage(insertMessage) {
        const id = (0, crypto_1.randomUUID)();
        const message = {
            ...insertMessage,
            id,
            createdAt: new Date()
        };
        this.chatMessages.set(id, message);
        return message;
    }
    async getChatMessages(userId, limit = 50) {
        return Array.from(this.chatMessages.values())
            .filter(m => m.userId === userId)
            .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
            .slice(0, limit);
    }
    async getUserStats(userId) {
        const userPosts = Array.from(this.posts.values()).filter(p => p.authorId === userId);
        const userAgents = Array.from(this.userAgents.values()).filter(a => a.userId === userId && a.isActive);
        const userWorkflows = Array.from(this.workflows.values()).filter(w => w.userId === userId);
        const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);
        const totalPosts = userPosts.length;
        const engagementRate = totalPosts > 0 ? (totalLikes / totalPosts) / 100 : 0;
        const automationsRun = userWorkflows.reduce((sum, w) => sum + w.runCount, 0);
        return {
            totalPosts,
            activeAgents: userAgents.length,
            engagementRate: Math.round(engagementRate * 100) / 100,
            automationsRun
        };
    }
}
exports.MemStorage = MemStorage;
exports.storage = new MemStorage();
