"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningAutomationSystem = void 0;
exports.getLearningSystem = getLearningSystem;
exports.initializeLearningSystem = initializeLearningSystem;
const events_1 = require("events");
const uuid_1 = require("uuid");
class LearningAutomationSystem extends events_1.EventEmitter {
    activities = new Map();
    userProgress = new Map();
    badges = new Map();
    achievements = new Map();
    recommendations = new Map();
    challenges = new Map();
    // Learning multipliers based on user level
    levelMultipliers = {
        1: 1.0,
        2: 1.1,
        3: 1.2,
        4: 1.3,
        5: 1.5,
        10: 2.0,
        20: 2.5,
        50: 3.0
    };
    constructor() {
        super();
        this.initializeDefaultBadges();
        this.initializeDefaultAchievements();
        this.initializeDefaultChallenges();
    }
    /**
     * Record a learning activity and update user progress
     */
    async recordActivity(activity) {
        const learningActivity = {
            ...activity,
            id: (0, uuid_1.v4)(),
            timestamp: new Date()
        };
        // Store activity
        if (!this.activities.has(activity.userId)) {
            this.activities.set(activity.userId, []);
        }
        this.activities.get(activity.userId).push(learningActivity);
        // Update user progress
        await this.updateUserProgress(activity.userId, learningActivity);
        // Check for badge/achievement unlocks
        await this.checkBadgeUnlocks(activity.userId);
        await this.checkAchievementUnlocks(activity.userId);
        // Generate new recommendations
        await this.generateRecommendations(activity.userId);
        this.emit('activityRecorded', learningActivity);
        return learningActivity;
    }
    /**
     * Update user progress based on activity
     */
    async updateUserProgress(userId, activity) {
        let progress = this.userProgress.get(userId);
        if (!progress) {
            progress = this.initializeUserProgress(userId);
        }
        // Calculate points with level multiplier
        const multiplier = this.getLevelMultiplier(progress.level);
        const earnedPoints = Math.floor(activity.points * multiplier);
        // Update progress
        progress.totalPoints += earnedPoints;
        progress.experience += earnedPoints;
        progress.lastActivityDate = new Date();
        // Update learning streak
        const today = new Date().toDateString();
        const lastActivity = progress.lastActivityDate.toDateString();
        if (today === lastActivity) {
            // Same day, maintain streak
        }
        else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastActivity === yesterday.toDateString()) {
                progress.learningStreak += 1;
            }
            else {
                progress.learningStreak = 1;
            }
        }
        // Update skill points
        if (!progress.skillPoints[activity.category]) {
            progress.skillPoints[activity.category] = 0;
        }
        progress.skillPoints[activity.category] += earnedPoints;
        // Check for level up
        const newLevel = this.calculateLevel(progress.experience);
        if (newLevel > progress.level) {
            progress.level = newLevel;
            this.emit('levelUp', { userId, oldLevel: newLevel - 1, newLevel });
        }
        this.userProgress.set(userId, progress);
    }
    /**
     * Get user progress
     */
    getUserProgress(userId) {
        return this.userProgress.get(userId) || null;
    }
    /**
     * Get user activities
     */
    getUserActivities(userId, limit = 50) {
        const activities = this.activities.get(userId) || [];
        return activities
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, limit);
    }
    /**
     * Get learning recommendations for user
     */
    getUserRecommendations(userId) {
        const recommendations = this.recommendations.get(userId) || [];
        return recommendations.sort((a, b) => b.priority - a.priority);
    }
    /**
     * Generate personalized learning recommendations
     */
    async generateRecommendations(userId) {
        const progress = this.getUserProgress(userId);
        if (!progress)
            return;
        const recommendations = [];
        // Analyze user's skill gaps
        const skillCategories = Object.keys(progress.skillPoints);
        const avgSkillPoints = Object.values(progress.skillPoints).reduce((a, b) => a + b, 0) / skillCategories.length;
        // Recommend features user hasn't used much
        for (const [category, points] of Object.entries(progress.skillPoints)) {
            if (points < avgSkillPoints * 0.5) {
                recommendations.push({
                    id: (0, uuid_1.v4)(),
                    userId,
                    type: 'feature_tutorial',
                    title: `Master ${category}`,
                    description: `Improve your ${category} skills with guided tutorials`,
                    difficulty: progress.level < 5 ? 'beginner' : progress.level < 15 ? 'intermediate' : 'advanced',
                    estimatedTime: 15,
                    points: 100,
                    prerequisites: [],
                    category,
                    priority: Math.floor(avgSkillPoints / points),
                    createdAt: new Date()
                });
            }
        }
        // AI interaction recommendations
        if (!skillCategories.includes('ai_interaction')) {
            recommendations.push({
                id: (0, uuid_1.v4)(),
                userId,
                type: 'ai_prompt',
                title: 'Explore AI Features',
                description: 'Try advanced AI prompts to unlock new capabilities',
                difficulty: 'intermediate',
                estimatedTime: 20,
                points: 150,
                prerequisites: [],
                category: 'ai_interaction',
                priority: 8,
                createdAt: new Date()
            });
        }
        // Automation recommendations
        if (progress.skillPoints.automation_creation < 200) {
            recommendations.push({
                id: (0, uuid_1.v4)(),
                userId,
                type: 'automation_template',
                title: 'Create Your First Automation',
                description: 'Build an automation workflow to save time',
                difficulty: 'beginner',
                estimatedTime: 25,
                points: 200,
                prerequisites: [],
                category: 'automation_creation',
                priority: 9,
                createdAt: new Date()
            });
        }
        this.recommendations.set(userId, recommendations.slice(0, 10)); // Keep top 10
    }
    /**
     * Check for badge unlocks
     */
    async checkBadgeUnlocks(userId) {
        const progress = this.getUserProgress(userId);
        if (!progress)
            return;
        for (const [badgeId, badge] of Array.from(this.badges.entries())) {
            if (progress.badges.includes(badgeId))
                continue; // Already unlocked
            let unlocked = true;
            for (const requirement of badge.requirements) {
                const activities = this.getUserActivities(userId, 1000);
                const filteredActivities = this.filterActivitiesByTimeframe(activities, requirement.timeframe);
                const count = filteredActivities.filter(a => a.type === requirement.type).length;
                if (count < requirement.threshold) {
                    unlocked = false;
                    break;
                }
            }
            if (unlocked) {
                progress.badges.push(badgeId);
                this.emit('badgeUnlocked', { userId, badgeId, badge });
            }
        }
    }
    /**
     * Check for achievement unlocks
     */
    async checkAchievementUnlocks(userId) {
        const progress = this.getUserProgress(userId);
        if (!progress)
            return;
        // Level achievements
        if (progress.level >= 10 && !progress.achievements.find(a => a.id === 'level_10')) {
            const achievement = this.achievements.get('level_10');
            if (achievement) {
                progress.achievements.push({
                    ...achievement,
                    unlockedAt: new Date()
                });
                this.emit('achievementUnlocked', { userId, achievement });
            }
        }
        // Streak achievements
        if (progress.learningStreak >= 7 && !progress.achievements.find(a => a.id === 'week_streak')) {
            const achievement = this.achievements.get('week_streak');
            if (achievement) {
                progress.achievements.push({
                    ...achievement,
                    unlockedAt: new Date()
                });
                this.emit('achievementUnlocked', { userId, achievement });
            }
        }
        // Points achievements
        if (progress.totalPoints >= 1000 && !progress.achievements.find(a => a.id === 'points_1000')) {
            const achievement = this.achievements.get('points_1000');
            if (achievement) {
                progress.achievements.push({
                    ...achievement,
                    unlockedAt: new Date()
                });
                this.emit('achievementUnlocked', { userId, achievement });
            }
        }
    }
    /**
     * Initialize default badges
     */
    initializeDefaultBadges() {
        const defaultBadges = [
            {
                id: 'first_ai_interaction',
                name: 'AI Explorer',
                description: 'First AI interaction',
                icon: '🤖',
                category: 'ai',
                requirements: [{ type: 'ai_interaction', threshold: 1 }],
                rarity: 'bronze'
            },
            {
                id: 'automation_master',
                name: 'Automation Master',
                description: 'Created 10 automations',
                icon: '⚙️',
                category: 'automation',
                requirements: [{ type: 'automation_created', threshold: 10 }],
                rarity: 'gold'
            },
            {
                id: 'social_butterfly',
                name: 'Social Butterfly',
                description: 'Posted 50 social media updates',
                icon: '📱',
                category: 'social',
                requirements: [{ type: 'social_post', threshold: 50 }],
                rarity: 'silver'
            },
            {
                id: 'workflow_wizard',
                name: 'Workflow Wizard',
                description: 'Completed 25 workflows',
                icon: '🪄',
                category: 'workflow',
                requirements: [{ type: 'workflow_completed', threshold: 25 }],
                rarity: 'gold'
            },
            {
                id: 'daily_learner',
                name: 'Daily Learner',
                description: 'Active for 30 consecutive days',
                icon: '📚',
                category: 'consistency',
                requirements: [{ type: 'feature_usage', threshold: 30, timeframe: '30_days' }],
                rarity: 'platinum'
            }
        ];
        defaultBadges.forEach(badge => {
            this.badges.set(badge.id, badge);
        });
    }
    /**
     * Initialize default achievements
     */
    initializeDefaultAchievements() {
        const defaultAchievements = [
            {
                id: 'level_10',
                name: 'Rising Star',
                description: 'Reached level 10',
                icon: '⭐',
                category: 'progression',
                points: 500,
                rarity: 'rare',
                unlockedAt: new Date(),
                metadata: {}
            },
            {
                id: 'week_streak',
                name: 'Dedicated Learner',
                description: '7-day learning streak',
                icon: '🔥',
                category: 'consistency',
                points: 300,
                rarity: 'rare',
                unlockedAt: new Date(),
                metadata: {}
            },
            {
                id: 'points_1000',
                name: 'Knowledge Seeker',
                description: 'Earned 1000 points',
                icon: '🎯',
                category: 'milestone',
                points: 200,
                rarity: 'epic',
                unlockedAt: new Date(),
                metadata: {}
            }
        ];
        defaultAchievements.forEach(achievement => {
            this.achievements.set(achievement.id, achievement);
        });
    }
    /**
     * Initialize default challenges
     */
    initializeDefaultChallenges() {
        const weeklyChallenge = {
            id: 'weekly_automation',
            title: 'Weekly Automation Challenge',
            description: 'Create 3 new automations this week',
            type: 'weekly',
            category: 'automation',
            requirements: [{ type: 'automation_created', threshold: 3, timeframe: '7_days' }],
            rewards: {
                points: 500,
                badges: [],
                achievements: []
            },
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            participants: [],
            isActive: true
        };
        this.challenges.set(weeklyChallenge.id, weeklyChallenge);
    }
    /**
     * Helper methods
     */
    initializeUserProgress(userId) {
        return {
            userId,
            totalPoints: 0,
            level: 1,
            experience: 0,
            badges: [],
            achievements: [],
            learningStreak: 0,
            lastActivityDate: new Date(),
            skillPoints: {},
            weeklyGoal: 500,
            monthlyGoal: 2000
        };
    }
    getLevelMultiplier(level) {
        for (const [threshold, multiplier] of Object.entries(this.levelMultipliers).reverse()) {
            if (level >= parseInt(threshold)) {
                return multiplier;
            }
        }
        return 1.0;
    }
    calculateLevel(experience) {
        // Exponential leveling curve
        return Math.floor(Math.sqrt(experience / 100)) + 1;
    }
    filterActivitiesByTimeframe(activities, timeframe) {
        if (!timeframe)
            return activities;
        const now = new Date();
        const cutoff = new Date();
        switch (timeframe) {
            case '7_days':
                cutoff.setDate(now.getDate() - 7);
                break;
            case '30_days':
                cutoff.setDate(now.getDate() - 30);
                break;
            case '90_days':
                cutoff.setDate(now.getDate() - 90);
                break;
            default:
                return activities;
        }
        return activities.filter(activity => activity.timestamp >= cutoff);
    }
    /**
     * Get leaderboard data
     */
    getLeaderboard(limit = 10) {
        const allProgress = Array.from(this.userProgress.values());
        return allProgress
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .slice(0, limit)
            .map(progress => ({
            userId: progress.userId,
            points: progress.totalPoints,
            level: progress.level,
            badges: progress.badges.length
        }));
    }
    /**
     * Get available challenges
     */
    getActiveChallenges() {
        return Array.from(this.challenges.values()).filter(challenge => challenge.isActive);
    }
}
exports.LearningAutomationSystem = LearningAutomationSystem;
// Singleton instance
let learningSystem = null;
function getLearningSystem() {
    if (!learningSystem) {
        learningSystem = new LearningAutomationSystem();
    }
    return learningSystem;
}
function initializeLearningSystem() {
    const system = getLearningSystem();
    // Set up event listeners for WebSocket broadcasting
    system.on('activityRecorded', (activity) => {
        // Broadcast to connected clients
        console.log(`📊 Activity recorded: ${activity.type} for user ${activity.userId} (+${activity.points} points)`);
    });
    system.on('levelUp', ({ userId, oldLevel, newLevel }) => {
        console.log(`🎉 Level up! User ${userId} reached level ${newLevel}`);
    });
    system.on('badgeUnlocked', ({ userId, badgeId, badge }) => {
        console.log(`🏆 Badge unlocked! User ${userId} earned: ${badge.name}`);
    });
    system.on('achievementUnlocked', ({ userId, achievement }) => {
        console.log(`🏅 Achievement unlocked! User ${userId} earned: ${achievement.name}`);
    });
    return system;
}
