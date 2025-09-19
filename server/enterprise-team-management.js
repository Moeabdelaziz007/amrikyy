"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseTeamManager = void 0;
exports.getEnterpriseTeamManager = getEnterpriseTeamManager;
class EnterpriseTeamManager {
    teams = new Map();
    organizations = new Map();
    roles = new Map();
    auditLog = [];
    constructor() {
        this.initializeDefaultRoles();
        this.initializeDefaultOrganization();
    }
    initializeDefaultRoles() {
        // Admin Role
        this.roles.set('admin', {
            id: 'admin',
            name: 'Administrator',
            level: 100,
            permissions: [
                'manage_team',
                'manage_users',
                'create_workflows',
                'modify_workflows',
                'delete_workflows',
                'view_analytics',
                'manage_integrations',
                'access_advanced_features',
                'export_data',
                'manage_automation'
            ],
            description: 'Full access to all team features',
            isCustom: false
        });
        // Manager Role
        this.roles.set('manager', {
            id: 'manager',
            name: 'Manager',
            level: 80,
            permissions: [
                'manage_users',
                'create_workflows',
                'modify_workflows',
                'view_analytics',
                'manage_integrations',
                'export_data'
            ],
            description: 'Manage team members and workflows',
            isCustom: false
        });
        // Developer Role
        this.roles.set('developer', {
            id: 'developer',
            name: 'Developer',
            level: 60,
            permissions: [
                'create_workflows',
                'modify_workflows',
                'manage_integrations',
                'access_advanced_features'
            ],
            description: 'Create and modify workflows',
            isCustom: false
        });
        // User Role
        this.roles.set('user', {
            id: 'user',
            name: 'User',
            level: 40,
            permissions: [
                'create_workflows',
                'modify_workflows'
            ],
            description: 'Basic workflow access',
            isCustom: false
        });
        // Viewer Role
        this.roles.set('viewer', {
            id: 'viewer',
            name: 'Viewer',
            level: 20,
            permissions: [
                'view_analytics'
            ],
            description: 'Read-only access',
            isCustom: false
        });
    }
    initializeDefaultOrganization() {
        const defaultOrg = {
            id: 'default_org',
            name: 'Default Organization',
            domain: 'auraos.com',
            settings: {
                ssoEnabled: false,
                requireEmailVerification: true,
                allowSelfRegistration: true,
                defaultTeamSettings: {
                    allowGuestAccess: false,
                    requireApprovalForJoins: true,
                    maxMembers: 50,
                    defaultPermissions: ['create_workflows', 'modify_workflows'],
                    notificationSettings: {
                        emailNotifications: true,
                        slackNotifications: false,
                        webhookNotifications: false
                    },
                    collaborationSettings: {
                        allowRealTimeEditing: true,
                        enableVersionControl: true,
                        requireCommentsOnChanges: false
                    }
                },
                securitySettings: {
                    passwordPolicy: {
                        minLength: 8,
                        requireUppercase: true,
                        requireNumbers: true,
                        requireSpecialChars: false
                    },
                    sessionTimeout: 3600000, // 1 hour
                    requireMFA: false
                }
            },
            teams: [],
            users: [],
            createdAt: new Date(),
            subscription: {
                plan: 'enterprise',
                features: [
                    'team_collaboration',
                    'admin_dashboard',
                    'advanced_analytics',
                    'custom_roles',
                    'audit_logging',
                    'sso_integration'
                ],
                limits: {
                    maxTeams: 100,
                    maxUsers: 1000,
                    maxWorkflows: 10000,
                    maxAutomations: 5000
                }
            }
        };
        this.organizations.set(defaultOrg.id, defaultOrg);
    }
    // Team Management Methods
    async createTeam(name, description, organizationId = 'default_org', creatorId) {
        const organization = this.organizations.get(organizationId);
        if (!organization) {
            throw new Error('Organization not found');
        }
        if (organization.teams.length >= organization.subscription.limits.maxTeams) {
            throw new Error('Team limit exceeded for organization');
        }
        const team = {
            id: `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            description,
            organizationId,
            settings: {
                ...organization.settings.defaultTeamSettings,
                allowGuestAccess: false,
                requireApprovalForJoins: true,
                maxMembers: 50,
                defaultPermissions: ['create_workflows', 'modify_workflows'],
                notificationSettings: {
                    emailNotifications: true,
                    slackNotifications: false,
                    webhookNotifications: false
                },
                collaborationSettings: {
                    allowRealTimeEditing: true,
                    enableVersionControl: true,
                    requireCommentsOnChanges: false
                }
            },
            members: [],
            permissions: {
                canCreateWorkflows: true,
                canModifyWorkflows: true,
                canDeleteWorkflows: false,
                canManageTeam: false,
                canViewAnalytics: false,
                canManageIntegrations: false,
                canAccessAdvancedFeatures: false,
                canExportData: false,
                canManageAutomation: false
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'active'
        };
        // Add creator as admin
        const creatorMember = {
            id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: creatorId,
            email: 'admin@auraos.com',
            name: 'Team Creator',
            role: this.roles.get('admin'),
            permissions: this.roles.get('admin').permissions,
            joinedAt: new Date(),
            lastActiveAt: new Date(),
            status: 'active',
            metadata: {}
        };
        team.members.push(creatorMember);
        this.teams.set(team.id, team);
        organization.teams.push(team.id);
        // Log team creation
        this.logAuditEvent({
            type: 'team_created',
            teamId: team.id,
            userId: creatorId,
            timestamp: new Date(),
            details: { teamName: name, organizationId }
        });
        console.log(`🏢 Team created: ${name} (ID: ${team.id})`);
        return team;
    }
    async addTeamMember(teamId, userId, email, name, roleId, metadata = {}) {
        const team = this.teams.get(teamId);
        if (!team) {
            throw new Error('Team not found');
        }
        const role = this.roles.get(roleId);
        if (!role) {
            throw new Error('Role not found');
        }
        if (team.members.length >= team.settings.maxMembers) {
            throw new Error('Team member limit exceeded');
        }
        const member = {
            id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId,
            email,
            name,
            role,
            permissions: role.permissions,
            joinedAt: new Date(),
            lastActiveAt: new Date(),
            status: team.settings.requireApprovalForJoins ? 'pending' : 'active',
            metadata
        };
        team.members.push(member);
        team.updatedAt = new Date();
        // Log member addition
        this.logAuditEvent({
            type: 'member_added',
            teamId,
            userId,
            timestamp: new Date(),
            details: { memberEmail: email, role: role.name }
        });
        console.log(`👤 Team member added: ${name} to ${team.name}`);
        return member;
    }
    async removeTeamMember(teamId, memberId, removedBy) {
        const team = this.teams.get(teamId);
        if (!team) {
            throw new Error('Team not found');
        }
        const memberIndex = team.members.findIndex(m => m.id === memberId);
        if (memberIndex === -1) {
            throw new Error('Member not found');
        }
        const member = team.members[memberIndex];
        team.members.splice(memberIndex, 1);
        team.updatedAt = new Date();
        // Log member removal
        this.logAuditEvent({
            type: 'member_removed',
            teamId,
            userId: removedBy,
            timestamp: new Date(),
            details: { memberEmail: member.email, memberName: member.name }
        });
        console.log(`👤 Team member removed: ${member.name} from ${team.name}`);
        return true;
    }
    async updateMemberRole(teamId, memberId, newRoleId, updatedBy) {
        const team = this.teams.get(teamId);
        if (!team) {
            throw new Error('Team not found');
        }
        const role = this.roles.get(newRoleId);
        if (!role) {
            throw new Error('Role not found');
        }
        const member = team.members.find(m => m.id === memberId);
        if (!member) {
            throw new Error('Member not found');
        }
        const oldRole = member.role.name;
        member.role = role;
        member.permissions = role.permissions;
        team.updatedAt = new Date();
        // Log role update
        this.logAuditEvent({
            type: 'member_role_updated',
            teamId,
            userId: updatedBy,
            timestamp: new Date(),
            details: {
                memberEmail: member.email,
                oldRole,
                newRole: role.name
            }
        });
        console.log(`👤 Member role updated: ${member.name} from ${oldRole} to ${role.name}`);
        return true;
    }
    // Role Management Methods
    async createCustomRole(name, permissions, description, organizationId = 'default_org') {
        const role = {
            id: `role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            level: 50, // Custom role level
            permissions,
            description,
            isCustom: true
        };
        this.roles.set(role.id, role);
        // Log custom role creation
        this.logAuditEvent({
            type: 'custom_role_created',
            organizationId,
            timestamp: new Date(),
            details: { roleName: name, permissions }
        });
        console.log(`🎭 Custom role created: ${name}`);
        return role;
    }
    // Permission and Access Control Methods
    async checkPermission(userId, teamId, permission) {
        const team = this.teams.get(teamId);
        if (!team) {
            return false;
        }
        const member = team.members.find(m => m.userId === userId && m.status === 'active');
        if (!member) {
            return false;
        }
        return member.permissions.includes(permission);
    }
    async getUserTeams(userId) {
        const userTeams = [];
        for (const team of this.teams.values()) {
            const member = team.members.find(m => m.userId === userId);
            if (member && member.status === 'active') {
                userTeams.push(team);
            }
        }
        return userTeams;
    }
    async getTeamMembers(teamId) {
        const team = this.teams.get(teamId);
        return team ? team.members : [];
    }
    async getTeamAnalytics(teamId) {
        const team = this.teams.get(teamId);
        if (!team) {
            throw new Error('Team not found');
        }
        const analytics = {
            totalMembers: team.members.length,
            activeMembers: team.members.filter(m => m.status === 'active').length,
            pendingMembers: team.members.filter(m => m.status === 'pending').length,
            roleDistribution: {},
            recentActivity: this.auditLog.filter(log => log.teamId === teamId &&
                new Date(log.timestamp).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 // Last 7 days
            ).length,
            memberActivity: team.members.map(member => ({
                name: member.name,
                email: member.email,
                role: member.role.name,
                lastActive: member.lastActiveAt,
                status: member.status
            }))
        };
        // Calculate role distribution
        team.members.forEach(member => {
            const roleName = member.role.name;
            analytics.roleDistribution[roleName] = (analytics.roleDistribution[roleName] || 0) + 1;
        });
        return analytics;
    }
    // Audit and Logging Methods
    logAuditEvent(event) {
        this.auditLog.push(event);
        // Keep only last 10000 events
        if (this.auditLog.length > 10000) {
            this.auditLog = this.auditLog.slice(-10000);
        }
    }
    async getAuditLog(teamId, userId, startDate, endDate) {
        let filteredLog = this.auditLog;
        if (teamId) {
            filteredLog = filteredLog.filter(log => log.teamId === teamId);
        }
        if (userId) {
            filteredLog = filteredLog.filter(log => log.userId === userId);
        }
        if (startDate) {
            filteredLog = filteredLog.filter(log => new Date(log.timestamp) >= startDate);
        }
        if (endDate) {
            filteredLog = filteredLog.filter(log => new Date(log.timestamp) <= endDate);
        }
        return filteredLog.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    // Utility Methods
    async getTeam(teamId) {
        return this.teams.get(teamId) || null;
    }
    async getAllTeams(organizationId = 'default_org') {
        const organization = this.organizations.get(organizationId);
        if (!organization) {
            return [];
        }
        return organization.teams.map(teamId => this.teams.get(teamId)).filter(Boolean);
    }
    async getAvailableRoles() {
        return Array.from(this.roles.values());
    }
    async updateTeamSettings(teamId, settings, updatedBy) {
        const team = this.teams.get(teamId);
        if (!team) {
            throw new Error('Team not found');
        }
        team.settings = { ...team.settings, ...settings };
        team.updatedAt = new Date();
        // Log settings update
        this.logAuditEvent({
            type: 'team_settings_updated',
            teamId,
            userId: updatedBy,
            timestamp: new Date(),
            details: { settings }
        });
        console.log(`⚙️ Team settings updated for: ${team.name}`);
        return true;
    }
}
exports.EnterpriseTeamManager = EnterpriseTeamManager;
// Export singleton instance
let enterpriseTeamManager = null;
function getEnterpriseTeamManager() {
    if (!enterpriseTeamManager) {
        enterpriseTeamManager = new EnterpriseTeamManager();
    }
    return enterpriseTeamManager;
}
