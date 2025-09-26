const logger = require('../utils/logger');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
  }

  initialize(io) {
    this.io = io;
    
    io.on('connection', (socket) => {
      logger.info(`User connected: ${socket.id}`);

      // Handle user authentication
      socket.on('authenticate', (data) => {
        if (data.userId) {
          this.connectedUsers.set(socket.id, {
            userId: data.userId,
            socketId: socket.id,
            connectedAt: new Date()
          });
          
          // Join user to their personal room
          socket.join(`user:${data.userId}`);
          
          logger.info(`User authenticated: ${data.userId}`);
          
          socket.emit('authenticated', {
            success: true,
            message: 'Authentication successful'
          });
        }
      });

      // Handle task updates
      socket.on('task:update', (data) => {
        const user = this.connectedUsers.get(socket.id);
        if (user) {
          // Broadcast to all users who have access to this task
          socket.to(`task:${data.taskId}`).emit('task:updated', {
            taskId: data.taskId,
            updates: data.updates,
            updatedBy: user.userId,
            timestamp: new Date()
          });
        }
      });

      // Handle task comments
      socket.on('task:comment', (data) => {
        const user = this.connectedUsers.get(socket.id);
        if (user) {
          socket.to(`task:${data.taskId}`).emit('task:commented', {
            taskId: data.taskId,
            comment: data.comment,
            commentedBy: user.userId,
            timestamp: new Date()
          });
        }
      });

      // Handle real-time collaboration
      socket.on('collaboration:join', (data) => {
        const user = this.connectedUsers.get(socket.id);
        if (user && data.taskId) {
          socket.join(`task:${data.taskId}`);
          socket.to(`task:${data.taskId}`).emit('collaboration:user-joined', {
            userId: user.userId,
            taskId: data.taskId
          });
        }
      });

      socket.on('collaboration:leave', (data) => {
        const user = this.connectedUsers.get(socket.id);
        if (user && data.taskId) {
          socket.leave(`task:${data.taskId}`);
          socket.to(`task:${data.taskId}`).emit('collaboration:user-left', {
            userId: user.userId,
            taskId: data.taskId
          });
        }
      });

      // Handle typing indicators
      socket.on('typing:start', (data) => {
        const user = this.connectedUsers.get(socket.id);
        if (user) {
          socket.to(`task:${data.taskId}`).emit('typing:started', {
            userId: user.userId,
            taskId: data.taskId
          });
        }
      });

      socket.on('typing:stop', (data) => {
        const user = this.connectedUsers.get(socket.id);
        if (user) {
          socket.to(`task:${data.taskId}`).emit('typing:stopped', {
            userId: user.userId,
            taskId: data.taskId
          });
        }
      });

      // Handle notifications
      socket.on('notification:mark-read', (data) => {
        const user = this.connectedUsers.get(socket.id);
        if (user) {
          // Emit to user's personal room
          socket.emit('notification:marked-read', {
            notificationId: data.notificationId,
            userId: user.userId
          });
        }
      });

      // Handle presence updates
      socket.on('presence:update', (data) => {
        const user = this.connectedUsers.get(socket.id);
        if (user) {
          // Broadcast presence to all connected users
          socket.broadcast.emit('presence:updated', {
            userId: user.userId,
            status: data.status,
            timestamp: new Date()
          });
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        const user = this.connectedUsers.get(socket.id);
        if (user) {
          this.connectedUsers.delete(socket.id);
          
          // Broadcast user offline status
          socket.broadcast.emit('presence:updated', {
            userId: user.userId,
            status: 'offline',
            timestamp: new Date()
          });
          
          logger.info(`User disconnected: ${user.userId}`);
        }
      });
    });

    logger.info('Socket service initialized');
  }

  // Send notification to specific user
  sendNotificationToUser(userId, notification) {
    if (this.io) {
      this.io.to(`user:${userId}`).emit('notification:new', notification);
    }
  }

  // Send notification to multiple users
  sendNotificationToUsers(userIds, notification) {
    if (this.io) {
      userIds.forEach(userId => {
        this.io.to(`user:${userId}`).emit('notification:new', notification);
      });
    }
  }

  // Broadcast to all connected users
  broadcastToAll(event, data) {
    if (this.io) {
      this.io.emit(event, data);
    }
  }

  // Send to specific room
  sendToRoom(room, event, data) {
    if (this.io) {
      this.io.to(room).emit(event, data);
    }
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  // Get connected users list
  getConnectedUsers() {
    return Array.from(this.connectedUsers.values());
  }

  // Check if user is online
  isUserOnline(userId) {
    return Array.from(this.connectedUsers.values()).some(user => user.userId === userId);
  }
}

module.exports = new SocketService();
