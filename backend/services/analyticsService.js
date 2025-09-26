const logger = require('../utils/logger');
const Task = require('../models/Task');
const User = require('../models/User');

class AnalyticsService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Get cached data or fetch from database
  async getCachedData(key, fetchFunction) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const data = await fetchFunction();
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });

    return data;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get user productivity metrics
  async getUserProductivityMetrics(userId, period = 'week') {
    const cacheKey = `productivity_${userId}_${period}`;
    
    return await this.getCachedData(cacheKey, async () => {
      try {
        const now = new Date();
        let startDate;

        switch (period) {
          case 'day':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          default:
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }

        const tasks = await Task.find({
          userId,
          createdAt: { $gte: startDate },
          isArchived: false
        });

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'completed').length;
        const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
        const pendingTasks = tasks.filter(task => task.status === 'pending').length;
        
        const totalTimeSpent = tasks.reduce((sum, task) => sum + (task.actualTime || 0), 0);
        const totalEstimatedTime = tasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);
        
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        const timeEfficiency = totalEstimatedTime > 0 ? 
          Math.round((totalEstimatedTime / totalTimeSpent) * 100) : 0;

        return {
          totalTasks,
          completedTasks,
          inProgressTasks,
          pendingTasks,
          completionRate,
          totalTimeSpent,
          totalEstimatedTime,
          timeEfficiency,
          period
        };
      } catch (error) {
        logger.error('Error calculating productivity metrics:', error);
        throw error;
      }
    });
  }

  // Get task category distribution
  async getTaskCategoryDistribution(userId) {
    const cacheKey = `category_distribution_${userId}`;
    
    return await this.getCachedData(cacheKey, async () => {
      try {
        const distribution = await Task.aggregate([
          { $match: { userId, isArchived: false } },
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 },
              completed: {
                $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
              }
            }
          },
          { $sort: { count: -1 } }
        ]);

        return distribution.map(item => ({
          category: item._id,
          total: item.count,
          completed: item.completed,
          completionRate: item.count > 0 ? Math.round((item.completed / item.count) * 100) : 0
        }));
      } catch (error) {
        logger.error('Error calculating category distribution:', error);
        throw error;
      }
    });
  }

  // Get priority distribution
  async getPriorityDistribution(userId) {
    const cacheKey = `priority_distribution_${userId}`;
    
    return await this.getCachedData(cacheKey, async () => {
      try {
        const distribution = await Task.aggregate([
          { $match: { userId, isArchived: false } },
          {
            $group: {
              _id: '$priority',
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ]);

        return distribution.map(item => ({
          priority: item._id,
          count: item.count
        }));
      } catch (error) {
        logger.error('Error calculating priority distribution:', error);
        throw error;
      }
    });
  }

  // Get time-based analytics
  async getTimeBasedAnalytics(userId, period = 'week') {
    const cacheKey = `time_analytics_${userId}_${period}`;
    
    return await this.getCachedData(cacheKey, async () => {
      try {
        const now = new Date();
        let startDate, groupBy;

        switch (period) {
          case 'day':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            groupBy = { $hour: '$createdAt' };
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            groupBy = { $dayOfWeek: '$createdAt' };
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            groupBy = { $dayOfMonth: '$createdAt' };
            break;
          case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            groupBy = { $month: '$createdAt' };
            break;
          default:
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            groupBy = { $dayOfWeek: '$createdAt' };
        }

        const analytics = await Task.aggregate([
          { $match: { userId, createdAt: { $gte: startDate }, isArchived: false } },
          {
            $group: {
              _id: groupBy,
              tasks: { $sum: 1 },
              completed: {
                $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
              },
              timeSpent: { $sum: '$actualTime' }
            }
          },
          { $sort: { _id: 1 } }
        ]);

        return analytics.map(item => ({
          period: item._id,
          tasks: item.tasks,
          completed: item.completed,
          timeSpent: item.timeSpent
        }));
      } catch (error) {
        logger.error('Error calculating time-based analytics:', error);
        throw error;
      }
    });
  }

  // Get performance metrics
  async getPerformanceMetrics(userId) {
    const cacheKey = `performance_${userId}`;
    
    return await this.getCachedData(cacheKey, async () => {
      try {
        const tasks = await Task.find({ userId, isArchived: false });
        const completedTasks = tasks.filter(task => task.status === 'completed');
        
        let metrics = {
          averageTaskCompletionTime: 0,
          fastestTaskCompletion: 0,
          slowestTaskCompletion: 0,
          tasksCompletedOnTime: 0,
          tasksCompletedLate: 0,
          averageTimeEstimationAccuracy: 0
        };

        if (completedTasks.length > 0) {
          // Calculate completion times
          const completionTimes = completedTasks.map(task => {
            if (task.completedAt && task.createdAt) {
              return (task.completedAt - task.createdAt) / (1000 * 60 * 60); // hours
            }
            return 0;
          }).filter(time => time > 0);

          if (completionTimes.length > 0) {
            metrics.averageTaskCompletionTime = 
              Math.round(completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length);
            metrics.fastestTaskCompletion = Math.min(...completionTimes);
            metrics.slowestTaskCompletion = Math.max(...completionTimes);
          }

          // Calculate on-time completion
          const onTimeTasks = completedTasks.filter(task => {
            if (task.dueDate && task.completedAt) {
              return task.completedAt <= task.dueDate;
            }
            return true; // No due date means on time
          });

          metrics.tasksCompletedOnTime = onTimeTasks.length;
          metrics.tasksCompletedLate = completedTasks.length - onTimeTasks.length;

          // Calculate estimation accuracy
          const tasksWithEstimates = completedTasks.filter(task => 
            task.estimatedTime && task.actualTime
          );

          if (tasksWithEstimates.length > 0) {
            const accuracyScores = tasksWithEstimates.map(task => {
              const accuracy = Math.abs(task.estimatedTime - task.actualTime) / task.estimatedTime;
              return Math.max(0, 1 - accuracy); // 1 = perfect accuracy, 0 = no accuracy
            });

            metrics.averageTimeEstimationAccuracy = 
              Math.round(accuracyScores.reduce((sum, score) => sum + score, 0) / accuracyScores.length * 100);
          }
        }

        return metrics;
      } catch (error) {
        logger.error('Error calculating performance metrics:', error);
        throw error;
      }
    });
  }

  // Get user insights
  async getUserInsights(userId) {
    const cacheKey = `insights_${userId}`;
    
    return await this.getCachedData(cacheKey, async () => {
      try {
        const user = await User.findByUid(userId);
        const taskStats = await Task.getTaskStats(userId);
        const tasks = await Task.find({ userId, isArchived: false });
        
        const insights = [];
        
        // Productivity insight
        const completionRate = taskStats[0]?.total > 0 ? 
          (taskStats[0].completed / taskStats[0].total) * 100 : 0;
        
        if (completionRate > 80) {
          insights.push({
            type: 'success',
            title: 'Excellent Productivity!',
            message: `You've completed ${Math.round(completionRate)}% of your tasks. Keep up the great work!`,
            action: 'Continue your current workflow',
            priority: 'low'
          });
        } else if (completionRate < 50) {
          insights.push({
            type: 'warning',
            title: 'Productivity Improvement Needed',
            message: `You've only completed ${Math.round(completionRate)}% of your tasks. Consider breaking down larger tasks into smaller ones.`,
            action: 'Review your task management approach',
            priority: 'high'
          });
        }

        // Time management insight
        const avgTimeSpent = taskStats[0]?.avgTimeSpent || 0;
        if (avgTimeSpent > 120) { // More than 2 hours per task
          insights.push({
            type: 'info',
            title: 'Time Management Tip',
            message: 'Your average task completion time is quite high. Consider using time-blocking techniques.',
            action: 'Try the Pomodoro Technique',
            priority: 'medium'
          });
        }

        // Category insight
        const categoryStats = await Task.aggregate([
          { $match: { userId, isArchived: false } },
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]);

        if (categoryStats.length > 0) {
          const topCategory = categoryStats[0];
          insights.push({
            type: 'info',
            title: 'Focus Area',
            message: `Most of your tasks are in the ${topCategory._id} category. Consider balancing your workload.`,
            action: 'Diversify your task categories',
            priority: 'low'
          });
        }

        return insights;
      } catch (error) {
        logger.error('Error generating user insights:', error);
        throw error;
      }
    });
  }

  // Get system-wide analytics (admin only)
  async getSystemAnalytics() {
    const cacheKey = 'system_analytics';
    
    return await this.getCachedData(cacheKey, async () => {
      try {
        const userStats = await User.getUserStats();
        const totalTasks = await Task.countDocuments({ isArchived: false });
        const completedTasks = await Task.countDocuments({ status: 'completed', isArchived: false });
        
        return {
          users: userStats[0] || {
            totalUsers: 0,
            activeUsers: 0,
            verifiedUsers: 0,
            avgTasksCompleted: 0,
            avgTimeSpent: 0
          },
          tasks: {
            total: totalTasks,
            completed: completedTasks,
            completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
          }
        };
      } catch (error) {
        logger.error('Error calculating system analytics:', error);
        throw error;
      }
    });
  }

  // Generate report
  async generateReport(userId, type = 'weekly') {
    try {
      const report = {
        userId,
        type,
        generatedAt: new Date(),
        data: {}
      };

      switch (type) {
        case 'weekly':
          report.data = {
            productivity: await this.getUserProductivityMetrics(userId, 'week'),
            categoryDistribution: await this.getTaskCategoryDistribution(userId),
            timeAnalytics: await this.getTimeBasedAnalytics(userId, 'week'),
            performance: await this.getPerformanceMetrics(userId),
            insights: await this.getUserInsights(userId)
          };
          break;
        case 'monthly':
          report.data = {
            productivity: await this.getUserProductivityMetrics(userId, 'month'),
            categoryDistribution: await this.getTaskCategoryDistribution(userId),
            timeAnalytics: await this.getTimeBasedAnalytics(userId, 'month'),
            performance: await this.getPerformanceMetrics(userId),
            insights: await this.getUserInsights(userId)
          };
          break;
        default:
          throw new Error('Invalid report type');
      }

      return report;
    } catch (error) {
      logger.error('Error generating report:', error);
      throw error;
    }
  }
}

module.exports = new AnalyticsService();
