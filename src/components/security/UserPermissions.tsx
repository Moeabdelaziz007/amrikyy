import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  Shield, 
  Key, 
  Settings, 
  UserPlus, 
  UserMinus, 
  Crown, 
  Lock, 
  Unlock,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Database,
  Wifi,
  Smartphone
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'moderator' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  permissions: Permission[];
  lastActive: Date;
  joinedDate: Date;
  location: string;
  device: string;
}

interface Permission {
  id: string;
  name: string;
  category: 'system' | 'data' | 'user' | 'security' | 'analytics';
  description: string;
  level: 'read' | 'write' | 'admin' | 'none';
  granted: boolean;
  grantedBy: string;
  grantedDate: Date;
  expires?: Date;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
  icon: string;
}

interface PermissionRequest {
  id: string;
  userId: string;
  permissionId: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedDate: Date;
  reviewedBy?: string;
  reviewedDate?: Date;
}

export const UserPermissions: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions' | 'requests'>('users');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data - in production, this would come from Firebase
  const [users] = useState<User[]>([
    {
      id: '1',
      email: 'admin@amrikyy.com',
      name: 'Admin User',
      role: 'admin',
      status: 'active',
      permissions: [],
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      joinedDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      location: 'New York, US',
      device: 'Chrome on MacBook Pro'
    },
    {
      id: '2',
      email: 'moderator@amrikyy.com',
      name: 'Moderator User',
      role: 'moderator',
      status: 'active',
      permissions: [],
      lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000),
      joinedDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      location: 'California, US',
      device: 'Safari on iPhone'
    },
    {
      id: '3',
      email: 'user@amrikyy.com',
      name: 'Regular User',
      role: 'user',
      status: 'active',
      permissions: [],
      lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000),
      joinedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      location: 'Texas, US',
      device: 'Chrome on Windows'
    },
    {
      id: '4',
      email: 'guest@amrikyy.com',
      name: 'Guest User',
      role: 'guest',
      status: 'pending',
      permissions: [],
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
      joinedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      location: 'Unknown',
      device: 'Unknown'
    }
  ]);

  const [roles] = useState<Role[]>([
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full system access and control',
      permissions: ['all'],
      color: 'red',
      icon: '👑'
    },
    {
      id: 'moderator',
      name: 'Moderator',
      description: 'Content and user management',
      permissions: ['user_management', 'content_moderation', 'analytics_view'],
      color: 'blue',
      icon: '🛡️'
    },
    {
      id: 'user',
      name: 'User',
      description: 'Standard user access',
      permissions: ['basic_access', 'file_upload', 'profile_edit'],
      color: 'green',
      icon: '👤'
    },
    {
      id: 'guest',
      name: 'Guest',
      description: 'Limited read-only access',
      permissions: ['read_only'],
      color: 'gray',
      icon: '👥'
    }
  ]);

  const [permissions] = useState<Permission[]>([
    {
      id: 'system_admin',
      name: 'System Administration',
      category: 'system',
      description: 'Full system control and configuration',
      level: 'admin',
      granted: true,
      grantedBy: 'system',
      grantedDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'user_management',
      name: 'User Management',
      category: 'user',
      description: 'Create, edit, and manage user accounts',
      level: 'write',
      granted: true,
      grantedBy: 'admin',
      grantedDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'data_access',
      name: 'Data Access',
      category: 'data',
      description: 'Access to user data and analytics',
      level: 'read',
      granted: true,
      grantedBy: 'admin',
      grantedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'security_settings',
      name: 'Security Settings',
      category: 'security',
      description: 'Configure security and privacy settings',
      level: 'write',
      granted: false,
      grantedBy: '',
      grantedDate: new Date()
    }
  ]);

  const [permissionRequests] = useState<PermissionRequest[]>([
    {
      id: '1',
      userId: '3',
      permissionId: 'security_settings',
      reason: 'Need to configure security settings for my team',
      status: 'pending',
      requestedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      userId: '2',
      permissionId: 'data_access',
      reason: 'Required for generating team reports',
      status: 'approved',
      requestedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      reviewedBy: 'admin',
      reviewedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getRoleColor = (role: string) => {
    const roleData = roles.find(r => r.id === role);
    return roleData?.color || 'gray';
  };

  const getRoleIcon = (role: string) => {
    const roleData = roles.find(r => r.id === role);
    return roleData?.icon || '👤';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'inactive': return 'text-gray-500';
      case 'suspended': return 'text-red-500';
      case 'pending': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive': return <Clock className="w-4 h-4 text-gray-500" />;
      case 'suspended': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPermissionLevelColor = (level: string) => {
    switch (level) {
      case 'admin': return 'text-red-500';
      case 'write': return 'text-blue-500';
      case 'read': return 'text-green-500';
      case 'none': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system': return <Settings className="w-4 h-4" />;
      case 'data': return <Database className="w-4 h-4" />;
      case 'user': return <Users className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'analytics': return <FileText className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    // In production, this would update the user's role
    console.log('Changing role for user:', userId, 'to:', newRole);
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    // In production, this would update the user's status
    console.log('Changing status for user:', userId, 'to:', newStatus);
  };

  const handlePermissionRequest = (requestId: string, action: 'approve' | 'reject') => {
    // In production, this would handle the permission request
    console.log('Handling permission request:', requestId, 'action:', action);
  };

  const inviteUser = () => {
    // In production, this would send an invitation
    console.log('Inviting new user...');
  };

  if (loading) {
    return (
      <div className="user-permissions">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading user permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-permissions">
      <div className="permissions-header">
        <div className="header-content">
          <div className="header-title">
            <Users className="header-icon" />
            <h1>User Permissions</h1>
          </div>
          <div className="header-controls">
            <button className="action-button" onClick={inviteUser}>
              <UserPlus className="button-icon" />
              Invite User
            </button>
          </div>
        </div>
      </div>

      <div className="permissions-tabs">
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users className="tab-icon" />
          Users
        </button>
        <button 
          className={`tab ${activeTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          <Crown className="tab-icon" />
          Roles
        </button>
        <button 
          className={`tab ${activeTab === 'permissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('permissions')}
        >
          <Key className="tab-icon" />
          Permissions
        </button>
        <button 
          className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          <FileText className="tab-icon" />
          Requests
        </button>
      </div>

      <div className="permissions-content">
        {activeTab === 'users' && (
          <div className="users-tab">
            <div className="users-header">
              <div className="search-filters">
                <div className="search-box">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="filter-select"
                  title="Filter by role"
                  aria-label="Filter users by role"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="user">User</option>
                  <option value="guest">Guest</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  title="Filter by status"
                  aria-label="Filter users by status"
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="users-list">
              {filteredUsers.map((user) => (
                <div key={user.id} className="user-item">
                  <div className="user-avatar">
                    <div className="avatar-circle">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        <span className="avatar-initial">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="user-info">
                    <div className="user-header">
                      <h4 className="user-name">{user.name}</h4>
                      <div className="user-badges">
                        <span className={`role-badge ${getRoleColor(user.role)}`}>
                          {getRoleIcon(user.role)} {user.role}
                        </span>
                        <span className={`status-badge ${getStatusColor(user.status)}`}>
                          {getStatusIcon(user.status)}
                          {user.status}
                        </span>
                      </div>
                    </div>
                    <div className="user-details">
                      <span className="user-email">{user.email}</span>
                      <span>Last Active: {user.lastActive.toLocaleString()}</span>
                      <span>Joined: {user.joinedDate.toLocaleDateString()}</span>
                      <span>Location: {user.location}</span>
                      <span>Device: {user.device}</span>
                    </div>
                  </div>
                  <div className="user-actions">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="role-select"
                      title={`Change role for ${user.name}`}
                      aria-label={`Change role for ${user.name}`}
                    >
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                      <option value="user">User</option>
                      <option value="guest">Guest</option>
                    </select>
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user.id, e.target.value)}
                      className="status-select"
                      title={`Change status for ${user.name}`}
                      aria-label={`Change status for ${user.name}`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </select>
                    <button className="action-button small" title="Edit user" aria-label="Edit user permissions">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="action-button small danger" title="Delete user" aria-label="Delete user">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="roles-tab">
            <div className="roles-list">
              <h3>System Roles</h3>
              {roles.map((role) => (
                <div key={role.id} className="role-item">
                  <div className="role-icon">
                    <span className="role-emoji">{role.icon}</span>
                  </div>
                  <div className="role-info">
                    <div className="role-header">
                      <h4 className="role-name">{role.name}</h4>
                      <span className={`role-color ${role.color}`}>
                        {role.color}
                      </span>
                    </div>
                    <p className="role-description">{role.description}</p>
                    <div className="role-permissions">
                      <h5>Permissions:</h5>
                      <div className="permissions-list">
                        {role.permissions.map((permission, index) => (
                          <span key={index} className="permission-tag">
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="role-actions">
                    <button className="action-button">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="action-button">
                      <Settings className="w-4 h-4" />
                      Configure
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="permissions-tab">
            <div className="permissions-list">
              <h3>System Permissions</h3>
              {permissions.map((permission) => (
                <div key={permission.id} className="permission-item">
                  <div className="permission-icon">
                    {getCategoryIcon(permission.category)}
                  </div>
                  <div className="permission-info">
                    <div className="permission-header">
                      <h4 className="permission-name">{permission.name}</h4>
                      <div className="permission-badges">
                        <span className={`level-badge ${getPermissionLevelColor(permission.level)}`}>
                          {permission.level}
                        </span>
                        <span className="category-badge">
                          {permission.category}
                        </span>
                        {permission.granted && (
                          <span className="granted-badge">
                            <CheckCircle className="w-3 h-3" />
                            Granted
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="permission-description">{permission.description}</p>
                    <div className="permission-details">
                      <span>Granted by: {permission.grantedBy}</span>
                      <span>Date: {permission.grantedDate.toLocaleDateString()}</span>
                      {permission.expires && (
                        <span>Expires: {permission.expires.toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="permission-actions">
                    {permission.granted ? (
                      <button className="revoke-button">
                        <Lock className="w-4 h-4" />
                        Revoke
                      </button>
                    ) : (
                      <button className="grant-button">
                        <Unlock className="w-4 h-4" />
                        Grant
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="requests-tab">
            <div className="requests-list">
              <h3>Permission Requests</h3>
              {permissionRequests.map((request) => {
                const userData = users.find(u => u.id === request.userId);
                const permissionData = permissions.find(p => p.id === request.permissionId);
                
                return (
                  <div key={request.id} className={`request-item ${request.status}`}>
                    <div className="request-icon">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="request-info">
                      <div className="request-header">
                        <h4 className="request-title">
                          {userData?.name} requests {permissionData?.name}
                        </h4>
                        <span className={`status-badge ${request.status}`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="request-reason">{request.reason}</p>
                      <div className="request-details">
                        <span>User: {userData?.email}</span>
                        <span>Permission: {permissionData?.name}</span>
                        <span>Requested: {request.requestedDate.toLocaleString()}</span>
                        {request.reviewedBy && (
                          <span>Reviewed by: {request.reviewedBy}</span>
                        )}
                        {request.reviewedDate && (
                          <span>Reviewed: {request.reviewedDate.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="request-actions">
                      {request.status === 'pending' && (
                        <>
                          <button 
                            className="approve-button"
                            onClick={() => handlePermissionRequest(request.id, 'approve')}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button 
                            className="reject-button"
                            onClick={() => handlePermissionRequest(request.id, 'reject')}
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
