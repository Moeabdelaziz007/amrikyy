"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartMenuService = void 0;
exports.getSmartMenuService = getSmartMenuService;
const storage_js_1 = require("./storage.js");
class SmartMenuService {
    userContexts = new Map();
    constructor() {
        // Initialize with default contexts
    }
    // Get or create user context
    getUserContext(chatId, username) {
        if (!this.userContexts.has(chatId)) {
            this.userContexts.set(chatId, {
                chatId,
                username,
                lastActivity: new Date(),
                preferences: {
                    language: 'en',
                    timezone: 'UTC',
                    notifications: true
                },
                session: {
                    currentMenu: 'main',
                    lastCommand: '',
                    contextData: {}
                },
                stats: {
                    totalInteractions: 0,
                    favoriteCommands: []
                }
            });
        }
        return this.userContexts.get(chatId);
    }
    // Update user context
    updateUserContext(chatId, updates) {
        const context = this.getUserContext(chatId, '');
        Object.assign(context, updates);
        context.lastActivity = new Date();
        context.stats.totalInteractions++;
    }
    // Generate smart menu based on context
    async generateSmartMenu(chatId, username, menuType = 'main') {
        const context = this.getUserContext(chatId, username);
        this.updateUserContext(chatId, { session: { ...context.session, currentMenu: menuType } });
        switch (menuType) {
            case 'main':
                return await this.generateMainMenu(context);
            case 'posts':
                return await this.generatePostsMenu(context);
            case 'agents':
                return await this.generateAgentsMenu(context);
            case 'analytics':
                return await this.generateAnalyticsMenu(context);
            case 'settings':
                return await this.generateSettingsMenu(context);
            case 'quick_actions':
                return await this.generateQuickActionsMenu(context);
            case 'travel':
                return await this.generateTravelMenu(context);
            case 'food':
                return await this.generateFoodMenu(context);
            case 'shopping':
                return await this.generateShoppingMenu(context);
            default:
                return await this.generateMainMenu(context);
        }
    }
    // Main smart menu with context-aware options
    async generateMainMenu(context) {
        const timeOfDay = this.getTimeOfDay();
        const greeting = this.getGreeting(timeOfDay);
        // Get user stats for personalized experience
        const userStats = await storage_js_1.storage.getUserStats('user-1').catch(() => ({
            totalPosts: 0,
            activeAgents: 0,
            engagementRate: 0,
            automationsRun: 0
        }));
        const text = `${greeting} ${context.username}! 👋

🤖 Welcome to AuraOS Smart Assistant

📊 Your Dashboard:
• Posts: ${userStats.totalPosts}
• Active Agents: ${userStats.activeAgents}
• Engagement: ${userStats.engagementRate}%

🎯 What would you like to do today?`;
        // Generate context-aware menu options
        const menuOptions = await this.getContextualMenuOptions(context);
        const keyboard = {
            reply_markup: {
                inline_keyboard: this.organizeMenuOptions(menuOptions)
            }
        };
        return { text, keyboard };
    }
    // Posts management menu
    async generatePostsMenu(context) {
        const recentPosts = await storage_js_1.storage.getPostsWithAuthor(3).catch(() => []);
        const text = `📝 Content Management Center

📊 Recent Activity:
${recentPosts.length > 0 ?
            recentPosts.map((post, i) => `${i + 1}. ${post.content.substring(0, 30)}... (${post.likes} 👍)`).join('\n') :
            'No posts yet. Create your first one!'}

🎯 Choose an action:`;
        const menuOptions = [
            { text: '✍️ Create New Post', callback_data: 'create_post', icon: '✍️', priority: 1 },
            { text: '📅 Schedule Post', callback_data: 'schedule_post', icon: '📅', priority: 2 },
            { text: '📊 View All Posts', callback_data: 'view_all_posts', icon: '📊', priority: 3 },
            { text: '🤖 AI Content Generator', callback_data: 'ai_generator', icon: '🤖', priority: 4 },
            { text: '📈 Post Analytics', callback_data: 'post_analytics', icon: '📈', priority: 5 },
            { text: '🔙 Back to Main', callback_data: 'main_menu', icon: '🔙', priority: 6 }
        ];
        const keyboard = {
            reply_markup: {
                inline_keyboard: this.organizeMenuOptions(menuOptions)
            }
        };
        return { text, keyboard };
    }
    // AI Agents menu
    async generateAgentsMenu(context) {
        const templates = await storage_js_1.storage.getAgentTemplates().catch(() => []);
        const userAgents = await storage_js_1.storage.getUserAgents('user-1').catch(() => []);
        const text = `🤖 AI Agents Hub

📋 Available Templates: ${templates.length}
🚀 Active Agents: ${userAgents.filter(a => a.isActive).length}

🎯 Manage your AI workforce:`;
        const menuOptions = [
            { text: '🆕 Create Agent', callback_data: 'create_agent', icon: '🆕', priority: 1 },
            { text: '📋 Browse Templates', callback_data: 'browse_templates', icon: '📋', priority: 2 },
            { text: '⚡ Active Agents', callback_data: 'active_agents', icon: '⚡', priority: 3 },
            { text: '📊 Agent Performance', callback_data: 'agent_performance', icon: '📊', priority: 4 },
            { text: '🔧 Agent Settings', callback_data: 'agent_settings', icon: '🔧', priority: 5 },
            { text: '🔙 Back to Main', callback_data: 'main_menu', icon: '🔙', priority: 6 }
        ];
        const keyboard = {
            reply_markup: {
                inline_keyboard: this.organizeMenuOptions(menuOptions)
            }
        };
        return { text, keyboard };
    }
    // Analytics menu
    async generateAnalyticsMenu(context) {
        const userStats = await storage_js_1.storage.getUserStats('user-1').catch(() => ({
            totalPosts: 0,
            activeAgents: 0,
            engagementRate: 0,
            automationsRun: 0
        }));
        const text = `📊 Analytics Dashboard

📈 Key Metrics:
• Total Posts: ${userStats.totalPosts}
• Active Agents: ${userStats.activeAgents}
• Engagement Rate: ${userStats.engagementRate}%
• Automations Run: ${userStats.automationsRun}

🎯 Dive deeper into your data:`;
        const menuOptions = [
            { text: '📈 Performance Overview', callback_data: 'performance_overview', icon: '📈', priority: 1 },
            { text: '📊 Post Analytics', callback_data: 'post_analytics', icon: '📊', priority: 2 },
            { text: '🤖 Agent Performance', callback_data: 'agent_performance', icon: '🤖', priority: 3 },
            { text: '📅 Time-based Reports', callback_data: 'time_reports', icon: '📅', priority: 4 },
            { text: '🎯 Engagement Insights', callback_data: 'engagement_insights', icon: '🎯', priority: 5 },
            { text: '🔙 Back to Main', callback_data: 'main_menu', icon: '🔙', priority: 6 }
        ];
        const keyboard = {
            reply_markup: {
                inline_keyboard: this.organizeMenuOptions(menuOptions)
            }
        };
        return { text, keyboard };
    }
    // Settings menu
    async generateSettingsMenu(context) {
        const text = `⚙️ Settings & Preferences

🔧 Customize your AuraOS experience:

Current Settings:
• Language: ${context.preferences.language}
• Timezone: ${context.preferences.timezone}
• Notifications: ${context.preferences.notifications ? 'ON' : 'OFF'}

🎯 Adjust your preferences:`;
        const menuOptions = [
            { text: '🌍 Language', callback_data: 'set_language', icon: '🌍', priority: 1 },
            { text: '🕐 Timezone', callback_data: 'set_timezone', icon: '🕐', priority: 2 },
            { text: '🔔 Notifications', callback_data: 'toggle_notifications', icon: '🔔', priority: 3 },
            { text: '🎨 Theme', callback_data: 'set_theme', icon: '🎨', priority: 4 },
            { text: '🔐 Privacy', callback_data: 'privacy_settings', icon: '🔐', priority: 5 },
            { text: '🔙 Back to Main', callback_data: 'main_menu', icon: '🔙', priority: 6 }
        ];
        const keyboard = {
            reply_markup: {
                inline_keyboard: this.organizeMenuOptions(menuOptions)
            }
        };
        return { text, keyboard };
    }
    // Quick actions menu for power users
    async generateQuickActionsMenu(context) {
        const text = `⚡ Quick Actions

🚀 Fast access to your most-used features:

${context.stats.favoriteCommands.length > 0 ?
            `⭐ Your favorites: ${context.stats.favoriteCommands.join(', ')}` :
            '⭐ Start using commands to build your favorites!'}

🎯 Quick shortcuts:`;
        const menuOptions = [
            { text: '📝 Quick Post', callback_data: 'quick_post', icon: '📝', priority: 1 },
            { text: '🤖 Quick Agent', callback_data: 'quick_agent', icon: '🤖', priority: 2 },
            { text: '📊 Quick Stats', callback_data: 'quick_stats', icon: '📊', priority: 3 },
            { text: '🔄 Run Automation', callback_data: 'run_automation', icon: '🔄', priority: 4 },
            { text: '💬 AI Chat', callback_data: 'ai_chat', icon: '💬', priority: 5 },
            { text: '🔙 Back to Main', callback_data: 'main_menu', icon: '🔙', priority: 6 }
        ];
        const keyboard = {
            reply_markup: {
                inline_keyboard: this.organizeMenuOptions(menuOptions)
            }
        };
        return { text, keyboard };
    }
    // Get contextual menu options based on user behavior
    async getContextualMenuOptions(context) {
        const options = [];
        // Always include core options
        options.push({ text: '📝 Posts', callback_data: 'posts_menu', icon: '📝', priority: 1 }, { text: '🤖 Agents', callback_data: 'agents_menu', icon: '🤖', priority: 2 }, { text: '📊 Analytics', callback_data: 'analytics_menu', icon: '📊', priority: 3 }, { text: '✈️ Travel', callback_data: 'travel_menu', icon: '✈️', priority: 4 }, { text: '🍽️ Food', callback_data: 'food_menu', icon: '🍽️', priority: 5 }, { text: '🛒 Shopping', callback_data: 'shopping_menu', icon: '🛒', priority: 6 });
        // Add contextual options based on user behavior
        if (context.stats.totalInteractions > 10) {
            options.push({ text: '⚡ Quick Actions', callback_data: 'quick_actions_menu', icon: '⚡', priority: 4 });
        }
        if (context.stats.lastPostTime && this.isRecent(context.stats.lastPostTime)) {
            options.push({ text: '📈 View Performance', callback_data: 'view_performance', icon: '📈', priority: 5 });
        }
        // Add settings option
        options.push({ text: '⚙️ Settings', callback_data: 'settings_menu', icon: '⚙️', priority: 6 });
        // Add help option for new users
        if (context.stats.totalInteractions < 5) {
            options.push({ text: '❓ Help', callback_data: 'help_menu', icon: '❓', priority: 7 });
        }
        return options;
    }
    // Organize menu options into rows
    organizeMenuOptions(options) {
        const sortedOptions = options.sort((a, b) => a.priority - b.priority);
        const rows = [];
        for (let i = 0; i < sortedOptions.length; i += 2) {
            const row = sortedOptions.slice(i, i + 2).map(option => ({
                text: `${option.icon} ${option.text}`,
                callback_data: option.callback_data
            }));
            rows.push(row);
        }
        return rows;
    }
    // Travel Menu
    async generateTravelMenu(context) {
        const text = `✈️ Travel Services Hub

🎯 **AI-Powered Travel Solutions:**
• Smart flight booking with price optimization
• Hotel recommendations with amenity matching
• Car rental with route optimization
• Complete travel packages
• Activity booking and recommendations

🚀 **Smart Features:**
• Real-time price monitoring
• Deal detection and alerts
• Automated booking when criteria met
• Personalized recommendations
• Multi-service coordination

🎯 Choose your travel service:`;
        const menuOptions = [
            { text: '✈️ Flight Booking', callback_data: 'flight_booking', icon: '✈️', priority: 1 },
            { text: '🏨 Hotel Booking', callback_data: 'hotel_booking', icon: '🏨', priority: 2 },
            { text: '🚗 Car Rental', callback_data: 'car_rental', icon: '🚗', priority: 3 },
            { text: '📦 Travel Packages', callback_data: 'travel_packages', icon: '📦', priority: 4 },
            { text: '🎯 Activities', callback_data: 'travel_activities', icon: '🎯', priority: 5 },
            { text: '🤖 Travel Agents', callback_data: 'travel_agents', icon: '🤖', priority: 6 },
            { text: '🔙 Back to Main', callback_data: 'main_menu', icon: '🔙', priority: 7 }
        ];
        const keyboard = {
            reply_markup: {
                inline_keyboard: this.organizeMenuOptions(menuOptions)
            }
        };
        return { text, keyboard };
    }
    // Food Menu
    async generateFoodMenu(context) {
        const text = `🍽️ Food Services Hub

🎯 **AI-Powered Food Solutions:**
• Restaurant discovery with cuisine matching
• Food delivery optimization
• Grocery shopping automation
• Meal planning with nutrition optimization
• Catering coordination

🚀 **Smart Features:**
• Dietary preference learning
• Price comparison across platforms
• Automated repeat orders
• Nutritional analysis and optimization
• Group coordination

🎯 Choose your food service:`;
        const menuOptions = [
            { text: '🍴 Restaurant Discovery', callback_data: 'restaurant_discovery', icon: '🍴', priority: 1 },
            { text: '🚚 Food Delivery', callback_data: 'food_delivery', icon: '🚚', priority: 2 },
            { text: '🛒 Grocery Shopping', callback_data: 'grocery_shopping', icon: '🛒', priority: 3 },
            { text: '📋 Meal Planning', callback_data: 'meal_planning', icon: '📋', priority: 4 },
            { text: '🎉 Catering Services', callback_data: 'catering_services', icon: '🎉', priority: 5 },
            { text: '🤖 Food Agents', callback_data: 'food_agents', icon: '🤖', priority: 6 },
            { text: '🔙 Back to Main', callback_data: 'main_menu', icon: '🔙', priority: 7 }
        ];
        const keyboard = {
            reply_markup: {
                inline_keyboard: this.organizeMenuOptions(menuOptions)
            }
        };
        return { text, keyboard };
    }
    // Shopping Menu
    async generateShoppingMenu(context) {
        const text = `🛒 Smart Shopping Hub

🎯 **AI-Powered Shopping Solutions:**
• Universal price comparison
• Deal detection and alerts
• Automated purchasing
• Preference learning
• Budget optimization

🚀 **Smart Features:**
• Cross-platform price monitoring
• Deal aggregation and alerts
• Automated wishlist management
• Purchase timing optimization
• Budget tracking and optimization

🎯 Choose your shopping service:`;
        const menuOptions = [
            { text: '🔍 Price Comparison', callback_data: 'price_comparison', icon: '🔍', priority: 1 },
            { text: '💰 Deal Detection', callback_data: 'deal_detection', icon: '💰', priority: 2 },
            { text: '🤖 Auto-Purchase', callback_data: 'auto_purchase', icon: '🤖', priority: 3 },
            { text: '📋 Wishlist Manager', callback_data: 'wishlist_manager', icon: '📋', priority: 4 },
            { text: '📊 Budget Tracker', callback_data: 'budget_tracker', icon: '📊', priority: 5 },
            { text: '🤖 Shopping Agents', callback_data: 'shopping_agents', icon: '🤖', priority: 6 },
            { text: '🔙 Back to Main', callback_data: 'main_menu', icon: '🔙', priority: 7 }
        ];
        const keyboard = {
            reply_markup: {
                inline_keyboard: this.organizeMenuOptions(menuOptions)
            }
        };
        return { text, keyboard };
    }
    // Helper methods
    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 12)
            return 'morning';
        if (hour < 17)
            return 'afternoon';
        if (hour < 20)
            return 'evening';
        return 'night';
    }
    getGreeting(timeOfDay) {
        const greetings = {
            morning: 'Good morning',
            afternoon: 'Good afternoon',
            evening: 'Good evening',
            night: 'Good evening'
        };
        return greetings[timeOfDay] || 'Hello';
    }
    isRecent(date) {
        const now = new Date();
        const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
        return diffHours < 24;
    }
    // Update user preferences
    async updateUserPreferences(chatId, preferences) {
        const context = this.getUserContext(chatId, '');
        context.preferences = { ...context.preferences, ...preferences };
    }
    // Get user context for external use
    getUserContext(chatId) {
        return this.userContexts.get(chatId);
    }
    // Track command usage for smart suggestions
    trackCommandUsage(chatId, command) {
        const context = this.getUserContext(chatId, '');
        if (!context.stats.favoriteCommands.includes(command)) {
            context.stats.favoriteCommands.push(command);
            // Keep only top 5 favorites
            if (context.stats.favoriteCommands.length > 5) {
                context.stats.favoriteCommands = context.stats.favoriteCommands.slice(-5);
            }
        }
    }
}
exports.SmartMenuService = SmartMenuService;
// Export singleton instance
let smartMenuService = null;
function getSmartMenuService() {
    if (!smartMenuService) {
        smartMenuService = new SmartMenuService();
    }
    return smartMenuService;
}
