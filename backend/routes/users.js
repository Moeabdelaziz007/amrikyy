const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findByUid(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  body('displayName').optional().trim().isLength({ min: 2, max: 50 }),
  body('profile.firstName').optional().trim().isLength({ max: 50 }),
  body('profile.lastName').optional().trim().isLength({ max: 50 }),
  body('profile.bio').optional().trim().isLength({ max: 500 }),
  body('profile.location').optional().trim().isLength({ max: 100 }),
  body('profile.website').optional().isURL(),
  body('preferences.theme').optional().isIn(['light', 'dark', 'auto']),
  body('preferences.language').optional().isLength({ min: 2, max: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findByUid(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user profile
    if (req.body.displayName) user.displayName = req.body.displayName;
    if (req.body.profile) {
      Object.assign(user.profile, req.body.profile);
    }
    if (req.body.preferences) {
      Object.assign(user.preferences, req.body.preferences);
    }

    await user.save();

    logger.info(`User profile updated: ${user.email}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const user = await User.findByUid(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        stats: user.stats,
        accountAge: user.accountAge,
        fullName: user.fullName
      }
    });
  } catch (error) {
    logger.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user statistics'
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', [
  body('theme').optional().isIn(['light', 'dark', 'auto']),
  body('language').optional().isLength({ min: 2, max: 5 }),
  body('notifications.email').optional().isBoolean(),
  body('notifications.push').optional().isBoolean(),
  body('notifications.desktop').optional().isBoolean(),
  body('privacy.profileVisibility').optional().isIn(['public', 'private', 'friends']),
  body('privacy.dataSharing').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findByUid(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update preferences
    Object.assign(user.preferences, req.body);
    await user.save();

    logger.info(`User preferences updated: ${user.email}`);

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: { preferences: user.preferences }
    });
  } catch (error) {
    logger.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating preferences'
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', async (req, res) => {
  try {
    const user = await User.findByUid(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete by deactivating account
    user.isActive = false;
    await user.save();

    logger.info(`User account deactivated: ${user.email}`);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    logger.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting account'
    });
  }
});

module.exports = router;
