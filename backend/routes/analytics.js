const express = require('express');
const User = require('../models/User');
const Task = require('../models/Task');
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get user task statistics
    const taskStats = await Task.getTaskStats(userId);
    const overdueTasks = await Task.findOverdue(userId);
    
    // Get user profile
    const user = await User.findByUid(userId);
    
    // Calculate productivity metrics
    const productivityMetrics = {
      tasksCompleted: taskStats[0]?.completed || 0,
      totalTasks: taskStats[0]?.total || 0,
      completionRate: taskStats[0]?.total > 0 ? 
        Math.round((taskStats[0].completed / taskStats[0].total) * 100) : 0,
      avgTimeSpent: Math.round(taskStats[0]?.avgTimeSpent || 0),
      totalTimeSpent: taskStats[0]?.totalTimeSpent || 0,
      overdueCount: overdueTasks.length
    };

    // Calculate weekly progress (mock data for now)
    const weeklyProgress = [
      { day: 'Mon', tasks: 5, completed: 4 },
      { day: 'Tue', tasks: 8, completed: 6 },
      { day: 'Wed', tasks: 6, completed: 5 },
      { day: 'Thu', tasks: 7, completed: 7 },
      { day: 'Fri', tasks: 9, completed: 8 },
      { day: 'Sat', tasks: 4, completed: 3 },
      { day: 'Sun', tasks: 3, completed: 2 }
    ];

    // Calculate category distribution
    const categoryDistribution = await Task.aggregate([
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

    // Calculate priority distribution
    const priorityDistribution = await Task.aggregate([
      { $match: { userId, isArchived: false } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        productivity: productivityMetrics,
        weeklyProgress,
        categoryDistribution,
        priorityDistribution,
        userStats: user?.stats || {}
      }
    });
  } catch (error) {
    logger.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard analytics'
    });
  }
});

// @route   GET /api/analytics/productivity
// @desc    Get productivity analytics
// @access  Private
router.get('/productivity', async (req, res) => {
  try {
    const userId = req.userId;
    const { period = 'week' } = req.query;
    
    // Calculate date range based on period
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

    // Get tasks in period
    const tasksInPeriod = await Task.find({
      userId,
      createdAt: { $gte: startDate },
      isArchived: false
    });

    // Calculate productivity metrics
    const totalTasks = tasksInPeriod.length;
    const completedTasks = tasksInPeriod.filter(task => task.status === 'completed').length;
    const inProgressTasks = tasksInPeriod.filter(task => task.status === 'in-progress').length;
    const pendingTasks = tasksInPeriod.filter(task => task.status === 'pending').length;
    
    const totalTimeSpent = tasksInPeriod.reduce((sum, task) => sum + (task.actualTime || 0), 0);
    const totalEstimatedTime = tasksInPeriod.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const timeEfficiency = totalEstimatedTime > 0 ? 
      Math.round((totalEstimatedTime / totalTimeSpent) * 100) : 0;

    // Calculate daily productivity (mock data for now)
    const dailyProductivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayTasks = tasksInPeriod.filter(task => 
        task.createdAt.toDateString() === date.toDateString()
      );
      
      dailyProductivity.push({
        date: date.toISOString().split('T')[0],
        tasks: dayTasks.length,
        completed: dayTasks.filter(task => task.status === 'completed').length,
        timeSpent: dayTasks.reduce((sum, task) => sum + (task.actualTime || 0), 0)
      });
    }

    res.json({
      success: true,
      data: {
        period,
        metrics: {
          totalTasks,
          completedTasks,
          inProgressTasks,
          pendingTasks,
          completionRate,
          totalTimeSpent,
          totalEstimatedTime,
          timeEfficiency
        },
        dailyProductivity
      }
    });
  } catch (error) {
    logger.error('Get productivity analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching productivity analytics'
    });
  }
});

// @route   GET /api/analytics/performance
// @desc    Get performance analytics
// @access  Private
router.get('/performance', async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get user tasks
    const tasks = await Task.find({ userId, isArchived: false });
    
    // Calculate performance metrics
    const performanceMetrics = {
      averageTaskCompletionTime: 0,
      fastestTaskCompletion: 0,
      slowestTaskCompletion: 0,
      tasksCompletedOnTime: 0,
      tasksCompletedLate: 0,
      averageTimeEstimationAccuracy: 0
    };

    if (tasks.length > 0) {
      const completedTasks = tasks.filter(task => task.status === 'completed');
      
      if (completedTasks.length > 0) {
        // Calculate completion times
        const completionTimes = completedTasks.map(task => {
          if (task.completedAt && task.createdAt) {
            return (task.completedAt - task.createdAt) / (1000 * 60 * 60); // hours
          }
          return 0;
        }).filter(time => time > 0);

        if (completionTimes.length > 0) {
          performanceMetrics.averageTaskCompletionTime = 
            Math.round(completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length);
          performanceMetrics.fastestTaskCompletion = Math.min(...completionTimes);
          performanceMetrics.slowestTaskCompletion = Math.max(...completionTimes);
        }

        // Calculate on-time completion
        const onTimeTasks = completedTasks.filter(task => {
          if (task.dueDate && task.completedAt) {
            return task.completedAt <= task.dueDate;
          }
          return true; // No due date means on time
        });

        performanceMetrics.tasksCompletedOnTime = onTimeTasks.length;
        performanceMetrics.tasksCompletedLate = completedTasks.length - onTimeTasks.length;

        // Calculate estimation accuracy
        const tasksWithEstimates = completedTasks.filter(task => 
          task.estimatedTime && task.actualTime
        );

        if (tasksWithEstimates.length > 0) {
          const accuracyScores = tasksWithEstimates.map(task => {
            const accuracy = Math.abs(task.estimatedTime - task.actualTime) / task.estimatedTime;
            return Math.max(0, 1 - accuracy); // 1 = perfect accuracy, 0 = no accuracy
          });

          performanceMetrics.averageTimeEstimationAccuracy = 
            Math.round(accuracyScores.reduce((sum, score) => sum + score, 0) / accuracyScores.length * 100);
        }
      }
    }

    // Calculate monthly performance (mock data for now)
    const monthlyPerformance = [
      { month: 'Jan', tasks: 45, completed: 42, onTime: 38 },
      { month: 'Feb', tasks: 52, completed: 48, onTime: 44 },
      { month: 'Mar', tasks: 38, completed: 35, onTime: 32 },
      { month: 'Apr', tasks: 41, completed: 39, onTime: 36 },
      { month: 'May', tasks: 47, completed: 45, onTime: 41 },
      { month: 'Jun', tasks: 43, completed: 40, onTime: 37 }
    ];

    res.json({
      success: true,
      data: {
        metrics: performanceMetrics,
        monthlyPerformance
      }
    });
  } catch (error) {
    logger.error('Get performance analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching performance analytics'
    });
  }
});

// @route   GET /api/analytics/insights
// @desc    Get AI-powered insights
// @access  Private
router.get('/insights', async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get user data
    const user = await User.findByUid(userId);
    const taskStats = await Task.getTaskStats(userId);
    const tasks = await Task.find({ userId, isArchived: false });
    
    // Generate insights (mock AI insights for now)
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

    // Peak hours insight (mock data)
    insights.push({
      type: 'success',
      title: 'Peak Productivity Hours',
      message: 'You are most productive between 9 AM and 11 AM. Schedule your most important tasks during this time.',
      action: 'Optimize your schedule',
      priority: 'medium'
    });

    // Recommendations
    const recommendations = [
      {
        title: 'Break Down Large Tasks',
        description: 'Consider splitting tasks that take more than 4 hours into smaller subtasks.',
        impact: 'high',
        effort: 'low'
      },
      {
        title: 'Set Realistic Deadlines',
        description: 'Your time estimates could be more accurate. Try using historical data to improve estimates.',
        impact: 'medium',
        effort: 'medium'
      },
      {
        title: 'Use Time Blocking',
        description: 'Allocate specific time slots for different types of tasks to improve focus.',
        impact: 'high',
        effort: 'medium'
      }
    ];

    res.json({
      success: true,
      data: {
        insights,
        recommendations,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    logger.error('Get insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching insights'
    });
  }
});

module.exports = router;
