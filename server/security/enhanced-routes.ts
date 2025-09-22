import { Express, Router } from 'express';
import {
  authenticateToken,
  authorize,
  requireAdmin,
  rateLimitPerUser,
  securityLogger,
} from './auth-middleware';
import {
  validateInput,
  validateQuery,
  validateEmail,
  validatePassword,
  validateFileUpload,
  rateLimit,
} from './input-validation';
import {
  securityHeaders,
  secureCORS,
  forceHTTPS,
  securityMonitoring,
  requestSizeLimit,
  ipFilter,
} from './security-headers';
import { validationSchemas } from './input-validation';

// Enhanced secure routes
export function setupSecureRoutes(app: Express) {
  // Apply global security middleware
  app.use([
    forceHTTPS(),
    securityHeaders(),
    secureCORS(),
    securityMonitoring(),
    requestSizeLimit(),
    ipFilter({
      blacklist: [], // Add known malicious IPs
      blockSuspiciousIPs: true,
    }),
    securityLogger,
  ]);

  // Rate limiting for all routes
  app.use(rateLimit(1000, 15 * 60 * 1000)); // 1000 requests per 15 minutes

  // =============================================================================
  // SECURE AUTHENTICATION ENDPOINTS
  // =============================================================================

  /**
   * Enhanced authentication status check
   */
  app.get(
    '/api/auth/status',
    authenticateToken,
    rateLimitPerUser(10, 60000), // 10 requests per minute per user
    (req, res) => {
      try {
        const user = req.user;

        res.json({
          authenticated: true,
          user: {
            id: user.uid,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
            sessionId: user.sessionId,
          },
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Auth status error:', error);
        res.status(500).json({
          error: 'Internal server error',
          message: 'Failed to check authentication status',
          code: 'AUTH_STATUS_ERROR',
        });
      }
    }
  );

  /**
   * Enhanced login endpoint with proper validation
   */
  app.post(
    '/api/auth/login',
    rateLimit(5, 15 * 60 * 1000), // 5 login attempts per 15 minutes
    validateInput(validationSchemas.user),
    validateEmail,
    validatePassword,
    async (req, res) => {
      try {
        const { email, password } = req.body;

        // In a real implementation, verify credentials against database
        // For now, we'll simulate successful authentication

        // Mock user data (replace with actual authentication logic)
        const mockUser = {
          uid: 'user_' + Date.now(),
          email: email,
          name: 'Authenticated User',
          role: 'user',
          emailVerified: true,
        };

        // Create session
        const session = createSession(mockUser, req);

        res.json({
          success: true,
          message: 'Login successful',
          user: {
            id: mockUser.uid,
            email: mockUser.email,
            name: mockUser.name,
            role: mockUser.role,
          },
          sessionId: session.sessionId,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
        });
      } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
          error: 'Login failed',
          message: 'An error occurred during login',
          code: 'LOGIN_ERROR',
        });
      }
    }
  );

  /**
   * Secure logout endpoint
   */
  app.post('/api/auth/logout', authenticateToken, async (req, res) => {
    try {
      const user = req.user;

      // Destroy session
      destroySession(user.uid);

      res.json({
        success: true,
        message: 'Logout successful',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: 'Logout failed',
        message: 'An error occurred during logout',
        code: 'LOGOUT_ERROR',
      });
    }
  });

  // =============================================================================
  // SECURE API ENDPOINTS
  // =============================================================================

  /**
   * Secure posts endpoints with proper authorization
   */
  app.get(
    '/api/posts',
    authenticateToken,
    authorize('posts', 'read'),
    rateLimitPerUser(100, 60000), // 100 requests per minute
    validateQuery(validationSchemas.search),
    async (req, res) => {
      try {
        const { query, limit, offset } = req.query;

        // Mock posts data (replace with actual database query)
        const posts = [
          {
            id: '1',
            title: 'Sample Post',
            content: 'This is a sample post content',
            author: req.user.email,
            createdAt: new Date().toISOString(),
          },
        ];

        res.json({
          posts,
          pagination: {
            limit,
            offset,
            total: posts.length,
            hasMore: false,
          },
        });
      } catch (error) {
        console.error('Posts fetch error:', error);
        res.status(500).json({
          error: 'Failed to fetch posts',
          message: 'An error occurred while fetching posts',
          code: 'POSTS_FETCH_ERROR',
        });
      }
    }
  );

  app.post(
    '/api/posts',
    authenticateToken,
    authorize('posts', 'create'),
    rateLimitPerUser(10, 60000), // 10 posts per minute
    validateInput(validationSchemas.post),
    async (req, res) => {
      try {
        const postData = req.body;

        // Create post with proper validation
        const newPost = {
          id: 'post_' + Date.now(),
          ...postData,
          author: req.user.email,
          authorId: req.user.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // In a real implementation, save to database

        res.status(201).json({
          success: true,
          message: 'Post created successfully',
          post: newPost,
        });
      } catch (error) {
        console.error('Post creation error:', error);
        res.status(500).json({
          error: 'Failed to create post',
          message: 'An error occurred while creating the post',
          code: 'POST_CREATE_ERROR',
        });
      }
    }
  );

  app.put(
    '/api/posts/:id',
    authenticateToken,
    authorize('posts', 'update'),
    rateLimitPerUser(20, 60000), // 20 updates per minute
    validateInput(validationSchemas.post),
    async (req, res) => {
      try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if user owns the post (in real implementation)
        // For now, we'll allow updates

        const updatedPost = {
          id,
          ...updateData,
          updatedAt: new Date().toISOString(),
        };

        res.json({
          success: true,
          message: 'Post updated successfully',
          post: updatedPost,
        });
      } catch (error) {
        console.error('Post update error:', error);
        res.status(500).json({
          error: 'Failed to update post',
          message: 'An error occurred while updating the post',
          code: 'POST_UPDATE_ERROR',
        });
      }
    }
  );

  app.delete(
    '/api/posts/:id',
    authenticateToken,
    authorize('posts', 'delete'),
    rateLimitPerUser(10, 60000), // 10 deletes per minute
    async (req, res) => {
      try {
        const { id } = req.params;

        // Check if user owns the post (in real implementation)
        // For now, we'll allow deletion

        res.json({
          success: true,
          message: 'Post deleted successfully',
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Post deletion error:', error);
        res.status(500).json({
          error: 'Failed to delete post',
          message: 'An error occurred while deleting the post',
          code: 'POST_DELETE_ERROR',
        });
      }
    }
  );

  // =============================================================================
  // SECURE USER MANAGEMENT ENDPOINTS
  // =============================================================================

  app.get(
    '/api/users/profile',
    authenticateToken,
    authorize('profile', 'read'),
    rateLimitPerUser(50, 60000), // 50 requests per minute
    async (req, res) => {
      try {
        const user = req.user;

        // Mock user profile data
        const profile = {
          id: user.uid,
          email: user.email,
          role: user.role,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        res.json(profile);
      } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
          error: 'Failed to fetch profile',
          message: 'An error occurred while fetching the profile',
          code: 'PROFILE_FETCH_ERROR',
        });
      }
    }
  );

  app.put(
    '/api/users/profile',
    authenticateToken,
    authorize('profile', 'update'),
    rateLimitPerUser(10, 60000), // 10 updates per minute
    validateInput(
      z.object({
        name: z.string().min(2).max(50).optional(),
        email: z.string().email().optional(),
      })
    ),
    async (req, res) => {
      try {
        const updateData = req.body;

        // Update user profile (in real implementation)
        const updatedProfile = {
          ...updateData,
          updatedAt: new Date().toISOString(),
        };

        res.json({
          success: true,
          message: 'Profile updated successfully',
          profile: updatedProfile,
        });
      } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
          error: 'Failed to update profile',
          message: 'An error occurred while updating the profile',
          code: 'PROFILE_UPDATE_ERROR',
        });
      }
    }
  );

  // =============================================================================
  // SECURE ADMIN ENDPOINTS
  // =============================================================================

  app.get(
    '/api/admin/users',
    authenticateToken,
    requireAdmin,
    rateLimitPerUser(100, 60000), // 100 requests per minute
    validateQuery(
      z.object({
        limit: z.number().int().min(1).max(100).default(10),
        offset: z.number().int().min(0).default(0),
        role: z.enum(['admin', 'user', 'moderator']).optional(),
      })
    ),
    async (req, res) => {
      try {
        const { limit, offset, role } = req.query;

        // Mock admin user list (in real implementation, query database)
        const users = [
          {
            id: 'user_1',
            email: 'user1@example.com',
            role: 'user',
            createdAt: new Date().toISOString(),
          },
        ];

        res.json({
          users,
          pagination: {
            limit,
            offset,
            total: users.length,
            hasMore: false,
          },
        });
      } catch (error) {
        console.error('Admin users fetch error:', error);
        res.status(500).json({
          error: 'Failed to fetch users',
          message: 'An error occurred while fetching users',
          code: 'ADMIN_USERS_FETCH_ERROR',
        });
      }
    }
  );

  // =============================================================================
  // SECURE FILE UPLOAD ENDPOINTS
  // =============================================================================

  app.post(
    '/api/upload',
    authenticateToken,
    rateLimitPerUser(5, 60000), // 5 uploads per minute
    validateFileUpload(
      ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      5 * 1024 * 1024
    ), // 5MB max
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({
            error: 'No file uploaded',
            message: 'Please select a file to upload',
            code: 'NO_FILE',
          });
        }

        const { filename, mimetype, size } = req.file;

        // Process file upload (in real implementation, save to cloud storage)
        const uploadedFile = {
          id: 'file_' + Date.now(),
          filename,
          mimetype,
          size,
          uploadedBy: req.user.uid,
          uploadedAt: new Date().toISOString(),
          url: `/uploads/${filename}`, // Mock URL
        };

        res.status(201).json({
          success: true,
          message: 'File uploaded successfully',
          file: uploadedFile,
        });
      } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({
          error: 'Failed to upload file',
          message: 'An error occurred while uploading the file',
          code: 'FILE_UPLOAD_ERROR',
        });
      }
    }
  );

  // =============================================================================
  // SECURE ANALYTICS ENDPOINTS
  // =============================================================================

  app.get(
    '/api/analytics/dashboard',
    authenticateToken,
    authorize('analytics', 'read'),
    rateLimitPerUser(50, 60000), // 50 requests per minute
    async (req, res) => {
      try {
        // Mock analytics data (in real implementation, query analytics database)
        const analytics = {
          totalUsers: 1250,
          totalPosts: 5670,
          totalViews: 125000,
          engagementRate: 12.5,
          topPosts: [],
          userGrowth: [],
          generatedAt: new Date().toISOString(),
        };

        res.json(analytics);
      } catch (error) {
        console.error('Analytics fetch error:', error);
        res.status(500).json({
          error: 'Failed to fetch analytics',
          message: 'An error occurred while fetching analytics data',
          code: 'ANALYTICS_FETCH_ERROR',
        });
      }
    }
  );

  // =============================================================================
  // HEALTH CHECK ENDPOINT
  // =============================================================================

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // =============================================================================
  // ERROR HANDLING MIDDLEWARE
  // =============================================================================

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.method} ${req.originalUrl} not found`,
      code: 'ROUTE_NOT_FOUND',
    });
  });

  // Global error handler
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Global error handler:', error);

    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';

    res.status(error.status || 500).json({
      error: 'Internal Server Error',
      message: isDevelopment ? error.message : 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
      ...(isDevelopment && { stack: error.stack }),
    });
  });
}

// Import required modules
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { createSession, destroySession } from './auth-middleware';
