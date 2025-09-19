"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseCollaborationSystem = void 0;
exports.getEnterpriseCollaborationSystem = getEnterpriseCollaborationSystem;
const enterprise_team_management_js_1 = require("./enterprise-team-management.js");
class EnterpriseCollaborationSystem {
    sessions = new Map();
    comments = new Map();
    changes = new Map();
    invitations = new Map();
    notifications = new Map();
    activeConnections = new Map();
    subscribers = new Set();
    constructor() {
        this.startCollaborationMonitoring();
    }
    startCollaborationMonitoring() {
        console.log('🤝 Enterprise Collaboration System started');
        // Clean up expired sessions every 5 minutes
        setInterval(() => {
            this.cleanupExpiredSessions();
        }, 300000);
        // Clean up expired invitations every minute
        setInterval(() => {
            this.cleanupExpiredInvitations();
        }, 60000);
    }
    // Session Management
    async createCollaborationSession(type, resourceId, resourceName, teamId, creatorId, permissions) {
        const teamManager = (0, enterprise_team_management_js_1.getEnterpriseTeamManager)();
        const team = await teamManager.getTeam(teamId);
        if (!team) {
            throw new Error('Team not found');
        }
        // Check if user has permission to create collaboration sessions
        const canCreate = await teamManager.checkPermission(creatorId, teamId, 'create_workflows');
        if (!canCreate) {
            throw new Error('Insufficient permissions to create collaboration session');
        }
        const session = {
            id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            resourceId,
            resourceName,
            teamId,
            participants: [],
            permissions,
            createdAt: new Date(),
            lastActivity: new Date(),
            status: 'active',
            metadata: {
                version: 1,
                autoSave: true,
                conflictResolution: 'last_write_wins'
            }
        };
        // Add creator as first participant
        const creator = await this.addParticipantToSession(session.id, creatorId, teamId, permissions);
        session.participants.push(creator);
        this.sessions.set(session.id, session);
        this.comments.set(session.id, []);
        this.changes.set(session.id, []);
        this.invitations.set(session.id, []);
        console.log(`🤝 Collaboration session created: ${resourceName} (${type})`);
        this.broadcastSessionUpdate(session);
        return session;
    }
    async joinCollaborationSession(sessionId, userId, teamId) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error('Collaboration session not found');
        }
        if (session.status !== 'active') {
            throw new Error('Collaboration session is not active');
        }
        // Check if user is already a participant
        const existingParticipant = session.participants.find(p => p.userId === userId);
        if (existingParticipant) {
            existingParticipant.lastSeen = new Date();
            existingParticipant.isActive = true;
            this.broadcastParticipantUpdate(session, existingParticipant);
            return existingParticipant;
        }
        // Check team membership and permissions
        const teamManager = (0, enterprise_team_management_js_1.getEnterpriseTeamManager)();
        const canJoin = await teamManager.checkPermission(userId, teamId, 'create_workflows');
        if (!canJoin) {
            throw new Error('Insufficient permissions to join collaboration session');
        }
        // Add as new participant
        const participant = await this.addParticipantToSession(sessionId, userId, teamId, session.permissions);
        session.participants.push(participant);
        session.lastActivity = new Date();
        console.log(`👤 User joined collaboration session: ${userId}`);
        this.broadcastParticipantUpdate(session, participant);
        this.broadcastSessionUpdate(session);
        return participant;
    }
    async leaveCollaborationSession(sessionId, userId) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error('Collaboration session not found');
        }
        const participantIndex = session.participants.findIndex(p => p.userId === userId);
        if (participantIndex === -1) {
            throw new Error('User is not a participant in this session');
        }
        session.participants[participantIndex].isActive = false;
        session.participants[participantIndex].lastSeen = new Date();
        session.lastActivity = new Date();
        console.log(`👤 User left collaboration session: ${userId}`);
        this.broadcastParticipantUpdate(session, session.participants[participantIndex]);
        // If no active participants, pause session
        const activeParticipants = session.participants.filter(p => p.isActive);
        if (activeParticipants.length === 0) {
            session.status = 'paused';
            this.broadcastSessionUpdate(session);
        }
        return true;
    }
    async addParticipantToSession(sessionId, userId, teamId, permissions) {
        const teamManager = (0, enterprise_team_management_js_1.getEnterpriseTeamManager)();
        const team = await teamManager.getTeam(teamId);
        const member = team?.members.find(m => m.userId === userId);
        return {
            userId,
            name: member?.name || 'Unknown User',
            email: member?.email || 'unknown@example.com',
            role: member?.role.name || 'user',
            joinedAt: new Date(),
            lastSeen: new Date(),
            isActive: true,
            permissions: member?.permissions || []
        };
    }
    // Real-time Collaboration Features
    async updateCursorPosition(sessionId, userId, position) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            return false;
        }
        const participant = session.participants.find(p => p.userId === userId);
        if (!participant) {
            return false;
        }
        participant.cursorPosition = position;
        participant.lastSeen = new Date();
        // Broadcast cursor update to other participants
        this.broadcastCursorUpdate(session, participant);
        return true;
    }
    async makeChange(sessionId, userId, change) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error('Collaboration session not found');
        }
        const participant = session.participants.find(p => p.userId === userId);
        if (!participant) {
            throw new Error('User is not a participant in this session');
        }
        // Check edit permissions
        if (!session.permissions.canEdit && !participant.permissions.includes('modify_workflows')) {
            throw new Error('Insufficient permissions to make changes');
        }
        const sessionChanges = this.changes.get(sessionId) || [];
        const newVersion = sessionChanges.length + 1;
        const collaborationChange = {
            id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            sessionId,
            userId,
            userName: participant.name,
            version: newVersion,
            timestamp: new Date(),
            ...change
        };
        sessionChanges.push(collaborationChange);
        this.changes.set(sessionId, sessionChanges);
        session.lastActivity = new Date();
        session.metadata.version = newVersion;
        console.log(`✏️ Change made in collaboration session: ${session.resourceName}`);
        this.broadcastChangeUpdate(session, collaborationChange);
        this.broadcastSessionUpdate(session);
        return collaborationChange;
    }
    // Comments and Discussions
    async addComment(sessionId, userId, content, type = 'comment', position) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error('Collaboration session not found');
        }
        const participant = session.participants.find(p => p.userId === userId);
        if (!participant) {
            throw new Error('User is not a participant in this session');
        }
        // Check comment permissions
        if (!session.permissions.canComment && !participant.permissions.includes('modify_workflows')) {
            throw new Error('Insufficient permissions to add comments');
        }
        const sessionComments = this.comments.get(sessionId) || [];
        const comment = {
            id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            sessionId,
            userId,
            userName: participant.name,
            content,
            position,
            type,
            status: 'open',
            createdAt: new Date(),
            updatedAt: new Date(),
            replies: []
        };
        sessionComments.push(comment);
        this.comments.set(sessionId, sessionComments);
        session.lastActivity = new Date();
        console.log(`💬 Comment added to collaboration session: ${session.resourceName}`);
        this.broadcastCommentUpdate(session, comment);
        // Create notification for other participants
        this.createNotificationForParticipants(session, {
            type: 'comment',
            title: 'New Comment',
            message: `${participant.name} added a ${type}`,
            sessionId,
            metadata: { commentId: comment.id }
        });
        return comment;
    }
    async replyToComment(commentId, userId, content) {
        const sessionComments = Array.from(this.comments.values()).flat();
        const comment = sessionComments.find(c => c.id === commentId);
        if (!comment) {
            throw new Error('Comment not found');
        }
        const session = this.sessions.get(comment.sessionId);
        const participant = session?.participants.find(p => p.userId === userId);
        if (!participant) {
            throw new Error('User is not a participant in this session');
        }
        const reply = {
            id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            commentId,
            userId,
            userName: participant.name,
            content,
            createdAt: new Date()
        };
        comment.replies.push(reply);
        comment.updatedAt = new Date();
        console.log(`💬 Reply added to comment: ${commentId}`);
        this.broadcastReplyUpdate(comment, reply);
        return reply;
    }
    // Invitations
    async inviteToSession(sessionId, invitedUserEmail, invitedBy, permissions, message) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error('Collaboration session not found');
        }
        const inviter = session.participants.find(p => p.userId === invitedBy);
        if (!inviter) {
            throw new Error('User is not a participant in this session');
        }
        // Check invite permissions
        if (!session.permissions.canInvite && !inviter.permissions.includes('manage_team')) {
            throw new Error('Insufficient permissions to invite users');
        }
        const invitation = {
            id: `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            sessionId,
            invitedUserId: '', // Will be set when user accepts
            invitedUserEmail,
            invitedBy,
            permissions,
            message,
            status: 'pending',
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        };
        const sessionInvitations = this.invitations.get(sessionId) || [];
        sessionInvitations.push(invitation);
        this.invitations.set(sessionId, sessionInvitations);
        console.log(`📧 Invitation sent to: ${invitedUserEmail}`);
        // Create notification for invited user
        this.createNotification({
            userId: invitedUserEmail, // Using email as userId for now
            type: 'invitation',
            title: 'Collaboration Invitation',
            message: `You've been invited to collaborate on ${session.resourceName}`,
            sessionId,
            metadata: { invitationId: invitation.id }
        });
        return invitation;
    }
    // Notifications
    createNotification(notificationData) {
        const notification = {
            id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            read: false,
            createdAt: new Date(),
            ...notificationData
        };
        const userNotifications = this.notifications.get(notification.userId) || [];
        userNotifications.push(notification);
        this.notifications.set(notification.userId, userNotifications);
        this.broadcastNotification(notification);
    }
    createNotificationForParticipants(session, notificationData) {
        session.participants.forEach(participant => {
            this.createNotification({
                ...notificationData,
                userId: participant.userId
            });
        });
    }
    // Utility Methods
    cleanupExpiredSessions() {
        const now = Date.now();
        const expiredTime = 30 * 60 * 1000; // 30 minutes
        for (const [sessionId, session] of this.sessions.entries()) {
            if (now - session.lastActivity.getTime() > expiredTime && session.status === 'active') {
                session.status = 'paused';
                console.log(`⏸️ Session paused due to inactivity: ${session.resourceName}`);
                this.broadcastSessionUpdate(session);
            }
        }
    }
    cleanupExpiredInvitations() {
        const now = Date.now();
        for (const [sessionId, invitations] of this.invitations.entries()) {
            const activeInvitations = invitations.filter(invite => {
                if (invite.expiresAt.getTime() < now && invite.status === 'pending') {
                    invite.status = 'expired';
                    return false;
                }
                return true;
            });
            this.invitations.set(sessionId, activeInvitations);
        }
    }
    // Public API Methods
    async getSession(sessionId) {
        return this.sessions.get(sessionId) || null;
    }
    async getUserSessions(userId) {
        const userSessions = [];
        for (const session of this.sessions.values()) {
            const participant = session.participants.find(p => p.userId === userId);
            if (participant) {
                userSessions.push(session);
            }
        }
        return userSessions;
    }
    async getSessionComments(sessionId) {
        return this.comments.get(sessionId) || [];
    }
    async getSessionChanges(sessionId) {
        return this.changes.get(sessionId) || [];
    }
    async getUserNotifications(userId) {
        return this.notifications.get(userId) || [];
    }
    async markNotificationAsRead(userId, notificationId) {
        const notifications = this.notifications.get(userId);
        if (!notifications) {
            return false;
        }
        const notification = notifications.find(n => n.id === notificationId);
        if (!notification) {
            return false;
        }
        notification.read = true;
        return true;
    }
    // Subscription Methods
    subscribeToUpdates(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }
    broadcastSessionUpdate(session) {
        const update = {
            type: 'session_update',
            data: session,
            timestamp: Date.now()
        };
        this.subscribers.forEach(callback => {
            try {
                callback(update);
            }
            catch (error) {
                console.error('Error broadcasting session update:', error);
            }
        });
    }
    broadcastParticipantUpdate(session, participant) {
        const update = {
            type: 'participant_update',
            data: { sessionId: session.id, participant },
            timestamp: Date.now()
        };
        this.subscribers.forEach(callback => {
            try {
                callback(update);
            }
            catch (error) {
                console.error('Error broadcasting participant update:', error);
            }
        });
    }
    broadcastCursorUpdate(session, participant) {
        const update = {
            type: 'cursor_update',
            data: { sessionId: session.id, participant },
            timestamp: Date.now()
        };
        this.subscribers.forEach(callback => {
            try {
                callback(update);
            }
            catch (error) {
                console.error('Error broadcasting cursor update:', error);
            }
        });
    }
    broadcastChangeUpdate(session, change) {
        const update = {
            type: 'change_update',
            data: { sessionId: session.id, change },
            timestamp: Date.now()
        };
        this.subscribers.forEach(callback => {
            try {
                callback(update);
            }
            catch (error) {
                console.error('Error broadcasting change update:', error);
            }
        });
    }
    broadcastCommentUpdate(session, comment) {
        const update = {
            type: 'comment_update',
            data: { sessionId: session.id, comment },
            timestamp: Date.now()
        };
        this.subscribers.forEach(callback => {
            try {
                callback(update);
            }
            catch (error) {
                console.error('Error broadcasting comment update:', error);
            }
        });
    }
    broadcastReplyUpdate(comment, reply) {
        const update = {
            type: 'reply_update',
            data: { commentId: comment.id, reply },
            timestamp: Date.now()
        };
        this.subscribers.forEach(callback => {
            try {
                callback(update);
            }
            catch (error) {
                console.error('Error broadcasting reply update:', error);
            }
        });
    }
    broadcastNotification(notification) {
        const update = {
            type: 'notification',
            data: notification,
            timestamp: Date.now()
        };
        this.subscribers.forEach(callback => {
            try {
                callback(update);
            }
            catch (error) {
                console.error('Error broadcasting notification:', error);
            }
        });
    }
}
exports.EnterpriseCollaborationSystem = EnterpriseCollaborationSystem;
// Export singleton instance
let enterpriseCollaborationSystem = null;
function getEnterpriseCollaborationSystem() {
    if (!enterpriseCollaborationSystem) {
        enterpriseCollaborationSystem = new EnterpriseCollaborationSystem();
    }
    return enterpriseCollaborationSystem;
}
