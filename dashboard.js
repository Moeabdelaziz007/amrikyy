// Dashboard JavaScript Functionality

class DashboardManager {
    constructor() {
        this.currentSection = 'overview';
        this.user = null;
        this.sessionStartTime = Date.now();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
        this.startSessionTimer();
        this.setupOfflineDetection();
    }

    setupEventListeners() {
        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });

        // User menu toggle
        const userMenuToggle = document.getElementById('userMenuToggle');
        const userDropdown = document.getElementById('userDropdown');
        
        userMenuToggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                userDropdown.classList.remove('show');
            }
        });

        // Profile management
        const editProfileBtn = document.getElementById('editProfileBtn');
        const cancelEditBtn = document.getElementById('cancelEditBtn');
        const updateProfileForm = document.getElementById('updateProfileForm');
        const avatarUploadBtn = document.getElementById('avatarUploadBtn');

        editProfileBtn?.addEventListener('click', () => this.toggleProfileEdit(true));
        cancelEditBtn?.addEventListener('click', () => this.toggleProfileEdit(false));
        updateProfileForm?.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        avatarUploadBtn?.addEventListener('click', () => this.handleAvatarUpload());

        // Settings
        this.setupSettingsListeners();

        // Quick actions
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.handleLogout());
    }

    setupSettingsListeners() {
        // Toggle switches
        const toggles = document.querySelectorAll('.toggle-switch input');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.handleSettingChange(e.target.id, e.target.checked);
            });
        });

        // Setting buttons
        document.getElementById('setup2FABtn')?.addEventListener('click', () => this.setupTwoFactorAuth());
        document.getElementById('manageSessionsBtn')?.addEventListener('click', () => this.manageSessions());
        document.getElementById('exportDataBtn')?.addEventListener('click', () => this.exportUserData());
        document.getElementById('deleteAccountBtn')?.addEventListener('click', () => this.deleteAccount());
    }

    async loadUserData() {
        try {
            // Get current user from Firebase
            const currentUser = firebase.auth().currentUser;
            if (currentUser) {
                this.user = {
                    uid: currentUser.uid,
                    email: currentUser.email,
                    displayName: currentUser.displayName || 'User',
                    photoURL: currentUser.photoURL,
                    isGuest: currentUser.isAnonymous
                };

                // Update UI with user data
                this.updateUserInterface();
                
                // Load additional user data from Firestore
                await this.loadUserProfile();
                await this.loadUserStats();
                await this.loadRecentActivity();
            } else {
                // Redirect to login if no user
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            this.showToast('Error loading user data', 'error');
        }
    }

    updateUserInterface() {
        if (!this.user) return;

        // Update navigation user info
        const navUserName = document.getElementById('navUserName');
        const navUserAvatar = document.getElementById('navUserAvatar');
        
        if (navUserName) navUserName.textContent = this.user.displayName;
        if (navUserAvatar) {
            const img = navUserAvatar.querySelector('img');
            if (img) img.src = this.user.photoURL || 'https://via.placeholder.com/40';
        }

        // Update profile section
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileAvatar = document.getElementById('profileAvatar');
        
        if (profileName) profileName.textContent = this.user.displayName;
        if (profileEmail) profileEmail.textContent = this.user.email;
        if (profileAvatar) {
            profileAvatar.src = this.user.photoURL || 'https://via.placeholder.com/120';
        }

        // Update form fields
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');
        
        if (firstName) firstName.value = this.user.displayName.split(' ')[0] || '';
        if (lastName) lastName.value = this.user.displayName.split(' ')[1] || '';
        if (email) email.value = this.user.email;
    }

    async loadUserProfile() {
        try {
            const userDoc = await firebase.firestore()
                .collection('users')
                .doc(this.user.uid)
                .get();

            if (userDoc.exists) {
                const userData = userDoc.data();
                this.user = { ...this.user, ...userData };
                
                // Update bio and location if available
                const bio = document.getElementById('bio');
                const location = document.getElementById('location');
                
                if (bio && userData.bio) bio.value = userData.bio;
                if (location && userData.location) location.value = userData.location;
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    async loadUserStats() {
        try {
            const statsDoc = await firebase.firestore()
                .collection('userStats')
                .doc(this.user.uid)
                .get();

            if (statsDoc.exists) {
                const stats = statsDoc.data();
                this.updateStatsDisplay(stats);
            }
        } catch (error) {
            console.error('Error loading user stats:', error);
        }
    }

    updateStatsDisplay(stats) {
        const sessionTime = document.getElementById('sessionTime');
        const chatSessions = document.getElementById('chatSessions');
        const downloads = document.getElementById('downloads');
        const rating = document.getElementById('rating');

        if (sessionTime) sessionTime.textContent = this.formatTime(stats.sessionTime || 0);
        if (chatSessions) chatSessions.textContent = stats.chatSessions || 0;
        if (downloads) downloads.textContent = stats.downloads || 0;
        if (rating) rating.textContent = stats.rating || '4.9';
    }

    async loadRecentActivity() {
        try {
            const activitySnapshot = await firebase.firestore()
                .collection('userActivity')
                .doc(this.user.uid)
                .collection('activities')
                .orderBy('timestamp', 'desc')
                .limit(10)
                .get();

            const activities = [];
            activitySnapshot.forEach(doc => {
                activities.push({ id: doc.id, ...doc.data() });
            });

            this.updateActivityDisplay(activities);
        } catch (error) {
            console.error('Error loading recent activity:', error);
        }
    }

    updateActivityDisplay(activities) {
        const activityList = document.getElementById('recentActivity');
        if (!activityList) return;

        if (activities.length === 0) {
            activityList.innerHTML = '<p class="text-gray-500">No recent activity</p>';
            return;
        }

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas ${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.description}</p>
                    <span class="activity-time">${this.formatTimeAgo(activity.timestamp?.toDate())}</span>
                </div>
            </div>
        `).join('');
    }

    getActivityIcon(type) {
        const icons = {
            'login': 'fa-sign-in-alt',
            'chat': 'fa-comment',
            'download': 'fa-download',
            'profile_update': 'fa-user-edit',
            'settings_change': 'fa-cog'
        };
        return icons[type] || 'fa-circle';
    }

    switchSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        this.currentSection = section;
    }

    toggleProfileEdit(show) {
        const profileForm = document.getElementById('profileForm');
        const editBtn = document.getElementById('editProfileBtn');
        
        if (show) {
            profileForm.style.display = 'block';
            editBtn.textContent = 'Cancel';
        } else {
            profileForm.style.display = 'none';
            editBtn.textContent = 'Edit Profile';
        }
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const updates = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            bio: formData.get('bio'),
            location: formData.get('location')
        };

        try {
            this.showLoading(true);
            
            // Update Firebase Auth profile
            await firebase.auth().currentUser.updateProfile({
                displayName: `${updates.firstName} ${updates.lastName}`
            });

            // Update Firestore user document
            await firebase.firestore()
                .collection('users')
                .doc(this.user.uid)
                .update(updates);

            // Update local user object
            this.user = { ...this.user, ...updates };
            this.updateUserInterface();
            
            this.toggleProfileEdit(false);
            this.showToast('Profile updated successfully!', 'success');
            
            // Log activity
            await this.logActivity('profile_update', 'Updated profile information');
            
        } catch (error) {
            console.error('Error updating profile:', error);
            this.showToast('Error updating profile', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    handleAvatarUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                this.showLoading(true);
                
                // Upload to Firebase Storage (simplified - would need proper setup)
                const storageRef = firebase.storage().ref();
                const avatarRef = storageRef.child(`avatars/${this.user.uid}`);
                
                await avatarRef.put(file);
                const downloadURL = await avatarRef.getDownloadURL();
                
                // Update user profile
                await firebase.auth().currentUser.updateProfile({
                    photoURL: downloadURL
                });
                
                this.user.photoURL = downloadURL;
                this.updateUserInterface();
                
                this.showToast('Avatar updated successfully!', 'success');
                
            } catch (error) {
                console.error('Error uploading avatar:', error);
                this.showToast('Error uploading avatar', 'error');
            } finally {
                this.showLoading(false);
            }
        };
        
        input.click();
    }

    handleSettingChange(settingId, value) {
        // Save setting to Firestore
        firebase.firestore()
            .collection('users')
            .doc(this.user.uid)
            .update({
                [`settings.${settingId}`]: value
            })
            .then(() => {
                this.showToast('Setting updated', 'success');
            })
            .catch(error => {
                console.error('Error updating setting:', error);
                this.showToast('Error updating setting', 'error');
            });
    }

    handleQuickAction(action) {
        switch (action) {
            case 'chat':
                window.open('/#chatbot', '_blank');
                break;
            case 'download':
                window.open('/#download', '_blank');
                break;
            case 'settings':
                this.switchSection('settings');
                break;
            case 'support':
                this.switchSection('support');
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    setupTwoFactorAuth() {
        this.showToast('Two-factor authentication setup coming soon!', 'info');
    }

    manageSessions() {
        this.showToast('Session management coming soon!', 'info');
    }

    async exportUserData() {
        try {
            this.showLoading(true);
            
            // Collect user data
            const userData = {
                profile: this.user,
                settings: await this.getUserSettings(),
                activity: await this.getUserActivity()
            };
            
            // Create and download JSON file
            const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `auraos-data-${Date.now()}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
            this.showToast('Data exported successfully!', 'success');
            
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showToast('Error exporting data', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    deleteAccount() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            this.showToast('Account deletion coming soon!', 'warning');
        }
    }

    async handleLogout() {
        try {
            await firebase.auth().signOut();
            window.location.href = '/';
        } catch (error) {
            console.error('Error signing out:', error);
            this.showToast('Error signing out', 'error');
        }
    }

    startSessionTimer() {
        setInterval(() => {
            const sessionTime = Date.now() - this.sessionStartTime;
            const sessionTimeElement = document.getElementById('sessionTime');
            if (sessionTimeElement) {
                sessionTimeElement.textContent = this.formatTime(sessionTime);
            }
        }, 1000);
    }

    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.showToast('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            this.showToast('You are offline', 'warning');
        });
    }

    // Utility functions
    formatTime(milliseconds) {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    }

    formatTimeAgo(date) {
        if (!date) return 'Unknown time';
        
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    async logActivity(type, description) {
        try {
            await firebase.firestore()
                .collection('userActivity')
                .doc(this.user.uid)
                .collection('activities')
                .add({
                    type,
                    description,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
        } catch (error) {
            console.error('Error logging activity:', error);
        }
    }

    async getUserSettings() {
        try {
            const userDoc = await firebase.firestore()
                .collection('users')
                .doc(this.user.uid)
                .get();
            
            return userDoc.exists ? userDoc.data().settings || {} : {};
        } catch (error) {
            console.error('Error getting user settings:', error);
            return {};
        }
    }

    async getUserActivity() {
        try {
            const activitySnapshot = await firebase.firestore()
                .collection('userActivity')
                .doc(this.user.uid)
                .collection('activities')
                .orderBy('timestamp', 'desc')
                .limit(100)
                .get();

            const activities = [];
            activitySnapshot.forEach(doc => {
                activities.push({ id: doc.id, ...doc.data() });
            });

            return activities;
        } catch (error) {
            console.error('Error getting user activity:', error);
            return [];
        }
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is authenticated
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            new DashboardManager();
        } else {
            window.location.href = '/';
        }
    });
});

// Service Worker registration for dashboard
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker registered for dashboard:', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    });
}
