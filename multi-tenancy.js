// Multi-Tenancy System for Enterprise Features
class MultiTenancySystem {
    constructor() {
        this.currentTenant = null;
        this.tenants = new Map();
        this.tenantData = new Map();
        this.isolationLevel = 'database'; // database, schema, row, or shared
        this.tenantCache = new Map();
        
        this.init();
    }

    init() {
        this.setupTenantDetection();
        this.loadTenants();
        this.setupTenantSwitching();
        this.setupDataIsolation();
        this.setupTenantManagement();
    }

    // Tenant Detection
    setupTenantDetection() {
        this.tenantDetectionMethods = {
            subdomain: this.detectBySubdomain.bind(this),
            path: this.detectByPath.bind(this),
            header: this.detectByHeader.bind(this),
            cookie: this.detectByCookie.bind(this),
            query: this.detectByQuery.bind(this)
        };
    }

    detectBySubdomain() {
        const hostname = window.location.hostname;
        const subdomain = hostname.split('.')[0];
        
        // Skip www and common non-tenant subdomains
        if (['www', 'api', 'admin', 'app'].includes(subdomain)) {
            return null;
        }
        
        return subdomain;
    }

    detectByPath() {
        const path = window.location.pathname;
        const pathParts = path.split('/').filter(part => part);
        
        // Check if first path segment is a tenant identifier
        if (pathParts.length > 0 && this.isValidTenantId(pathParts[0])) {
            return pathParts[0];
        }
        
        return null;
    }

    detectByHeader() {
        // This would be implemented server-side
        // For client-side, we'll use a custom header if available
        return null;
    }

    detectByCookie() {
        const tenantCookie = this.getCookie('tenant_id');
        return tenantCookie || null;
    }

    detectByQuery() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('tenant') || null;
    }

    async detectCurrentTenant() {
        // Try different detection methods in order of preference
        const methods = ['subdomain', 'path', 'cookie', 'query'];
        
        for (const method of methods) {
            const tenantId = this.tenantDetectionMethods[method]();
            if (tenantId && await this.validateTenant(tenantId)) {
                return tenantId;
            }
        }
        
        return 'default'; // Default tenant
    }

    async validateTenant(tenantId) {
        try {
            const tenant = await this.getTenant(tenantId);
            return tenant && tenant.active;
        } catch (error) {
            console.error('Error validating tenant:', error);
            return false;
        }
    }

    // Tenant Management
    async loadTenants() {
        try {
            const tenantsSnapshot = await firebase.firestore()
                .collection('tenants')
                .get();
            
            tenantsSnapshot.forEach(doc => {
                const tenantData = doc.data();
                this.tenants.set(doc.id, tenantData);
            });
            
            // Detect current tenant
            this.currentTenant = await this.detectCurrentTenant();
            await this.switchToTenant(this.currentTenant);
            
        } catch (error) {
            console.error('Error loading tenants:', error);
            this.currentTenant = 'default';
        }
    }

    async getTenant(tenantId) {
        // Check cache first
        if (this.tenantCache.has(tenantId)) {
            return this.tenantCache.get(tenantId);
        }
        
        try {
            const tenantDoc = await firebase.firestore()
                .collection('tenants')
                .doc(tenantId)
                .get();
            
            if (tenantDoc.exists) {
                const tenantData = { id: tenantDoc.id, ...tenantDoc.data() };
                this.tenantCache.set(tenantId, tenantData);
                return tenantData;
            }
            
            return null;
        } catch (error) {
            console.error('Error fetching tenant:', error);
            return null;
        }
    }

    async createTenant(tenantData) {
        try {
            const tenantId = this.generateTenantId(tenantData.name);
            
            const newTenant = {
                ...tenantData,
                id: tenantId,
                active: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                settings: {
                    theme: 'light',
                    branding: {
                        logo: null,
                        primaryColor: '#6366f1',
                        secondaryColor: '#8b5cf6'
                    },
                    features: {
                        analytics: true,
                        api: true,
                        customDomain: false,
                        whiteLabel: false
                    },
                    limits: {
                        maxUsers: 100,
                        maxStorage: 1024, // MB
                        maxApiCalls: 10000
                    }
                }
            };
            
            await firebase.firestore()
                .collection('tenants')
                .doc(tenantId)
                .set(newTenant);
            
            this.tenants.set(tenantId, newTenant);
            this.tenantCache.set(tenantId, newTenant);
            
            return newTenant;
        } catch (error) {
            console.error('Error creating tenant:', error);
            throw error;
        }
    }

    async updateTenant(tenantId, updates) {
        try {
            await firebase.firestore()
                .collection('tenants')
                .doc(tenantId)
                .update({
                    ...updates,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            
            // Update cache
            const currentTenant = this.tenants.get(tenantId);
            if (currentTenant) {
                const updatedTenant = { ...currentTenant, ...updates };
                this.tenants.set(tenantId, updatedTenant);
                this.tenantCache.set(tenantId, updatedTenant);
            }
            
            // If updating current tenant, apply changes
            if (tenantId === this.currentTenant) {
                await this.applyTenantSettings(updatedTenant);
            }
            
        } catch (error) {
            console.error('Error updating tenant:', error);
            throw error;
        }
    }

    async deleteTenant(tenantId) {
        try {
            // Deactivate instead of delete for data integrity
            await this.updateTenant(tenantId, { active: false, deletedAt: firebase.firestore.FieldValue.serverTimestamp() });
            
            // Remove from cache
            this.tenants.delete(tenantId);
            this.tenantCache.delete(tenantId);
            
        } catch (error) {
            console.error('Error deleting tenant:', error);
            throw error;
        }
    }

    generateTenantId(name) {
        // Generate URL-friendly tenant ID from name
        return name.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    // Tenant Switching
    setupTenantSwitching() {
        this.tenantSwitchCallbacks = [];
        this.tenantSwitchHandlers = {
            'database': this.switchDatabaseTenant.bind(this),
            'schema': this.switchSchemaTenant.bind(this),
            'row': this.switchRowTenant.bind(this),
            'shared': this.switchSharedTenant.bind(this)
        };
    }

    async switchToTenant(tenantId) {
        if (tenantId === this.currentTenant) {
            return; // Already on this tenant
        }
        
        const previousTenant = this.currentTenant;
        this.currentTenant = tenantId;
        
        try {
            // Get tenant data
            const tenant = await this.getTenant(tenantId);
            if (!tenant) {
                throw new Error('Tenant not found');
            }
            
            // Switch based on isolation level
            await this.tenantSwitchHandlers[this.isolationLevel](tenant);
            
            // Apply tenant settings
            await this.applyTenantSettings(tenant);
            
            // Notify callbacks
            this.notifyTenantSwitch(tenantId, previousTenant);
            
        } catch (error) {
            console.error('Error switching tenant:', error);
            this.currentTenant = previousTenant; // Revert on error
            throw error;
        }
    }

    async switchDatabaseTenant(tenant) {
        // For database-level isolation, switch the database connection
        // This would be implemented with separate Firebase projects or databases
        console.log(`Switching to database for tenant: ${tenant.id}`);
    }

    async switchSchemaTenant(tenant) {
        // For schema-level isolation, switch the schema/namespace
        // This would be implemented with Firestore subcollections
        console.log(`Switching to schema for tenant: ${tenant.id}`);
    }

    async switchRowTenant(tenant) {
        // For row-level isolation, add tenant filter to all queries
        // This is the most common approach for multi-tenant SaaS
        console.log(`Switching to row-level isolation for tenant: ${tenant.id}`);
    }

    async switchSharedTenant(tenant) {
        // For shared isolation, no switching needed
        console.log(`Using shared resources for tenant: ${tenant.id}`);
    }

    async applyTenantSettings(tenant) {
        // Apply tenant-specific settings to the UI
        const settings = tenant.settings || {};
        
        // Apply theme
        if (settings.theme) {
            document.documentElement.setAttribute('data-theme', settings.theme);
        }
        
        // Apply branding
        if (settings.branding) {
            this.applyBranding(settings.branding);
        }
        
        // Apply feature flags
        if (settings.features) {
            this.applyFeatureFlags(settings.features);
        }
        
        // Store tenant data
        this.tenantData.set(this.currentTenant, tenant);
    }

    applyBranding(branding) {
        const root = document.documentElement;
        
        if (branding.primaryColor) {
            root.style.setProperty('--primary-color', branding.primaryColor);
        }
        
        if (branding.secondaryColor) {
            root.style.setProperty('--secondary-color', branding.secondaryColor);
        }
        
        if (branding.logo) {
            // Update logo in UI
            const logoElements = document.querySelectorAll('.logo, .brand-logo');
            logoElements.forEach(logo => {
                logo.src = branding.logo;
            });
        }
    }

    applyFeatureFlags(features) {
        // Show/hide features based on tenant settings
        Object.entries(features).forEach(([feature, enabled]) => {
            const elements = document.querySelectorAll(`[data-feature="${feature}"]`);
            elements.forEach(element => {
                element.style.display = enabled ? '' : 'none';
            });
        });
    }

    // Data Isolation
    setupDataIsolation() {
        this.dataIsolationRules = {
            users: this.isolateUserData.bind(this),
            analytics: this.isolateAnalyticsData.bind(this),
            content: this.isolateContentData.bind(this),
            settings: this.isolateSettingsData.bind(this)
        };
    }

    isolateUserData(query) {
        // Add tenant filter to user queries
        if (this.isolationLevel === 'row') {
            return query.where('tenantId', '==', this.currentTenant);
        }
        return query;
    }

    isolateAnalyticsData(query) {
        // Add tenant filter to analytics queries
        if (this.isolationLevel === 'row') {
            return query.where('tenantId', '==', this.currentTenant);
        }
        return query;
    }

    isolateContentData(query) {
        // Add tenant filter to content queries
        if (this.isolationLevel === 'row') {
            return query.where('tenantId', '==', this.currentTenant);
        }
        return query;
    }

    isolateSettingsData(query) {
        // Add tenant filter to settings queries
        if (this.isolationLevel === 'row') {
            return query.where('tenantId', '==', this.currentTenant);
        }
        return query;
    }

    // Tenant Management UI
    setupTenantManagement() {
        this.createTenantSwitcher();
        this.createTenantManagementUI();
    }

    createTenantSwitcher() {
        // Create tenant switcher dropdown
        const switcher = document.createElement('div');
        switcher.className = 'tenant-switcher';
        switcher.innerHTML = `
            <div class="tenant-current" id="currentTenantDisplay">
                <span class="tenant-name">Loading...</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="tenant-dropdown" id="tenantDropdown" style="display: none;">
                <div class="tenant-list" id="tenantList">
                    <!-- Tenants will be populated here -->
                </div>
                <div class="tenant-actions">
                    <button class="btn btn-sm btn-primary" id="createTenantBtn">
                        <i class="fas fa-plus"></i>
                        Create Tenant
                    </button>
                    <button class="btn btn-sm btn-outline" id="manageTenantsBtn">
                        <i class="fas fa-cog"></i>
                        Manage
                    </button>
                </div>
            </div>
        `;
        
        // Add to admin navigation if available
        const navControls = document.querySelector('.nav-controls');
        if (navControls) {
            navControls.insertBefore(switcher, navControls.firstChild);
        }
        
        // Add event listeners
        this.setupTenantSwitcherEvents();
    }

    setupTenantSwitcherEvents() {
        const currentDisplay = document.getElementById('currentTenantDisplay');
        const dropdown = document.getElementById('tenantDropdown');
        const tenantList = document.getElementById('tenantList');
        const createBtn = document.getElementById('createTenantBtn');
        const manageBtn = document.getElementById('manageTenantsBtn');
        
        // Toggle dropdown
        currentDisplay?.addEventListener('click', () => {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.tenant-switcher')) {
                dropdown.style.display = 'none';
            }
        });
        
        // Create tenant
        createBtn?.addEventListener('click', () => {
            this.showCreateTenantModal();
        });
        
        // Manage tenants
        manageBtn?.addEventListener('click', () => {
            this.showTenantManagementModal();
        });
        
        // Populate tenant list
        this.populateTenantList();
    }

    populateTenantList() {
        const tenantList = document.getElementById('tenantList');
        if (!tenantList) return;
        
        const tenants = Array.from(this.tenants.values()).filter(tenant => tenant.active);
        
        tenantList.innerHTML = tenants.map(tenant => `
            <div class="tenant-item ${tenant.id === this.currentTenant ? 'active' : ''}" 
                 data-tenant-id="${tenant.id}">
                <div class="tenant-info">
                    <div class="tenant-name">${tenant.name}</div>
                    <div class="tenant-domain">${tenant.domain || tenant.id}.auraos.com</div>
                </div>
                <div class="tenant-status">
                    <span class="status-dot ${tenant.active ? 'active' : 'inactive'}"></span>
                </div>
            </div>
        `).join('');
        
        // Add click handlers for tenant switching
        tenantList.querySelectorAll('.tenant-item').forEach(item => {
            item.addEventListener('click', () => {
                const tenantId = item.dataset.tenantId;
                if (tenantId !== this.currentTenant) {
                    this.switchToTenant(tenantId);
                    dropdown.style.display = 'none';
                }
            });
        });
    }

    updateCurrentTenantDisplay() {
        const currentDisplay = document.getElementById('currentTenantDisplay');
        if (!currentDisplay) return;
        
        const tenant = this.tenants.get(this.currentTenant);
        if (tenant) {
            const tenantName = currentDisplay.querySelector('.tenant-name');
            if (tenantName) {
                tenantName.textContent = tenant.name;
            }
        }
    }

    createTenantManagementUI() {
        // This would create a comprehensive tenant management interface
        // For now, we'll create modals for tenant operations
        this.createTenantModals();
    }

    createTenantModals() {
        // Create modal for tenant creation
        const createModal = document.createElement('div');
        createModal.id = 'createTenantModal';
        createModal.className = 'modal';
        createModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Create New Tenant</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="createTenantForm">
                        <div class="form-group">
                            <label for="tenantName">Tenant Name</label>
                            <input type="text" id="tenantName" required>
                        </div>
                        <div class="form-group">
                            <label for="tenantDomain">Custom Domain (optional)</label>
                            <input type="text" id="tenantDomain" placeholder="example.com">
                        </div>
                        <div class="form-group">
                            <label for="tenantEmail">Contact Email</label>
                            <input type="email" id="tenantEmail" required>
                        </div>
                        <div class="form-group">
                            <label for="tenantPlan">Plan</label>
                            <select id="tenantPlan">
                                <option value="basic">Basic</option>
                                <option value="pro">Pro</option>
                                <option value="enterprise">Enterprise</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').style.display='none'">Cancel</button>
                    <button class="btn btn-primary" id="submitCreateTenant">Create Tenant</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(createModal);
        
        // Add form submission handler
        document.getElementById('submitCreateTenant')?.addEventListener('click', async () => {
            await this.handleCreateTenant();
        });
        
        // Close modal handlers
        createModal.querySelector('.modal-close')?.addEventListener('click', () => {
            createModal.style.display = 'none';
        });
    }

    showCreateTenantModal() {
        const modal = document.getElementById('createTenantModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    async handleCreateTenant() {
        try {
            const form = document.getElementById('createTenantForm');
            const formData = new FormData(form);
            
            const tenantData = {
                name: document.getElementById('tenantName').value,
                domain: document.getElementById('tenantDomain').value,
                email: document.getElementById('tenantEmail').value,
                plan: document.getElementById('tenantPlan').value,
                createdBy: firebase.auth().currentUser?.uid
            };
            
            const newTenant = await this.createTenant(tenantData);
            
            // Close modal
            document.getElementById('createTenantModal').style.display = 'none';
            
            // Show success message
            if (window.Analytics) {
                window.Analytics.showToast('Tenant created successfully', 'success');
            }
            
            // Refresh tenant list
            this.populateTenantList();
            
        } catch (error) {
            console.error('Error creating tenant:', error);
            if (window.Analytics) {
                window.Analytics.showToast('Error creating tenant: ' + error.message, 'error');
            }
        }
    }

    showTenantManagementModal() {
        // This would show a comprehensive tenant management interface
        if (window.Analytics) {
            window.Analytics.showToast('Tenant management interface coming soon', 'info');
        }
    }

    // Tenant Callbacks
    onTenantSwitch(callback) {
        this.tenantSwitchCallbacks.push(callback);
    }

    notifyTenantSwitch(newTenant, previousTenant) {
        this.tenantSwitchCallbacks.forEach(callback => {
            try {
                callback(newTenant, previousTenant);
            } catch (error) {
                console.error('Error in tenant switch callback:', error);
            }
        });
        
        // Update UI
        this.updateCurrentTenantDisplay();
        this.populateTenantList();
    }

    // Utility Methods
    getCurrentTenant() {
        return this.currentTenant;
    }

    getCurrentTenantData() {
        return this.tenantData.get(this.currentTenant);
    }

    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    setCookie(name, value, days = 30) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    isValidTenantId(tenantId) {
        // Validate tenant ID format
        return /^[a-z0-9-]+$/.test(tenantId) && tenantId.length >= 3 && tenantId.length <= 50;
    }

    // Tenant Analytics
    async getTenantAnalytics(tenantId = this.currentTenant) {
        try {
            const analyticsSnapshot = await firebase.firestore()
                .collection('analytics')
                .where('tenantId', '==', tenantId)
                .orderBy('timestamp', 'desc')
                .limit(1000)
                .get();
            
            const analytics = [];
            analyticsSnapshot.forEach(doc => {
                analytics.push({ id: doc.id, ...doc.data() });
            });
            
            return this.processTenantAnalytics(analytics);
        } catch (error) {
            console.error('Error fetching tenant analytics:', error);
            return null;
        }
    }

    processTenantAnalytics(data) {
        return {
            totalEvents: data.length,
            uniqueUsers: new Set(data.map(item => item.userId)).size,
            topEvents: this.getTopEvents(data),
            timeDistribution: this.getTimeDistribution(data),
            tenantMetrics: {
                activeUsers: 0,
                pageViews: 0,
                sessionDuration: 0
            }
        };
    }

    getTopEvents(data) {
        const eventCounts = {};
        data.forEach(item => {
            const eventType = item.eventName || 'unknown';
            eventCounts[eventType] = (eventCounts[eventType] || 0) + 1;
        });
        
        return Object.entries(eventCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([event, count]) => ({ event, count }));
    }

    getTimeDistribution(data) {
        const hourly = new Array(24).fill(0);
        data.forEach(item => {
            const hour = new Date(item.timestamp?.toDate()).getHours();
            hourly[hour]++;
        });
        
        return hourly;
    }

    // Tenant Limits and Usage
    async checkTenantLimits(tenantId = this.currentTenant) {
        try {
            const tenant = await this.getTenant(tenantId);
            if (!tenant || !tenant.settings?.limits) {
                return { withinLimits: true };
            }
            
            const limits = tenant.settings.limits;
            const usage = await this.getTenantUsage(tenantId);
            
            return {
                withinLimits: this.checkUsageAgainstLimits(usage, limits),
                usage,
                limits,
                warnings: this.generateUsageWarnings(usage, limits)
            };
        } catch (error) {
            console.error('Error checking tenant limits:', error);
            return { withinLimits: true };
        }
    }

    async getTenantUsage(tenantId) {
        try {
            // Get user count
            const usersSnapshot = await firebase.firestore()
                .collection('users')
                .where('tenantId', '==', tenantId)
                .get();
            
            // Get storage usage (simulated)
            const storageUsage = Math.random() * 100; // MB
            
            // Get API call count (from analytics)
            const apiCallsSnapshot = await firebase.firestore()
                .collection('analytics')
                .where('tenantId', '==', tenantId)
                .where('category', '==', 'api_call')
                .get();
            
            return {
                users: usersSnapshot.size,
                storage: storageUsage,
                apiCalls: apiCallsSnapshot.size
            };
        } catch (error) {
            console.error('Error getting tenant usage:', error);
            return { users: 0, storage: 0, apiCalls: 0 };
        }
    }

    checkUsageAgainstLimits(usage, limits) {
        return usage.users <= limits.maxUsers &&
               usage.storage <= limits.maxStorage &&
               usage.apiCalls <= limits.maxApiCalls;
    }

    generateUsageWarnings(usage, limits) {
        const warnings = [];
        
        if (usage.users / limits.maxUsers > 0.8) {
            warnings.push('User limit is 80% full');
        }
        
        if (usage.storage / limits.maxStorage > 0.8) {
            warnings.push('Storage limit is 80% full');
        }
        
        if (usage.apiCalls / limits.maxApiCalls > 0.8) {
            warnings.push('API call limit is 80% full');
        }
        
        return warnings;
    }
}

// Initialize multi-tenancy system when DOM is loaded
let multiTenancy = null;

document.addEventListener('DOMContentLoaded', () => {
    multiTenancy = new MultiTenancySystem();
    
    // Make multi-tenancy available globally
    window.MultiTenancy = multiTenancy;
    
    // Integrate with admin panel
    if (window.adminPanel) {
        window.adminPanel.multiTenancy = multiTenancy;
    }
});

// Export for global access
window.MultiTenancySystem = MultiTenancySystem;
