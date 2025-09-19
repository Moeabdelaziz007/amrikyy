"use strict";
// React Hooks for Workflow Automation
// Easy-to-use hooks for workflow templates and marketplace
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkflowMarketplace = useWorkflowMarketplace;
exports.useWorkflowTemplate = useWorkflowTemplate;
exports.useWorkflowExecution = useWorkflowExecution;
exports.useIntelligentWorkflowRecommendations = useIntelligentWorkflowRecommendations;
exports.useUserWorkflows = useUserWorkflows;
exports.useWorkflowAnalytics = useWorkflowAnalytics;
exports.useWorkflowBuilder = useWorkflowBuilder;
exports.useWorkflowTesting = useWorkflowTesting;
const react_1 = require("react");
const use_auth_1 = require("./use-auth");
const workflow_automation_1 = require("../lib/workflow-automation");
/**
 * Hook for workflow marketplace
 */
function useWorkflowMarketplace(filters) {
    const { user } = (0, use_auth_1.useAuth)();
    const [marketplace, setMarketplace] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const loadMarketplace = (0, react_1.useCallback)(async (marketplaceFilters) => {
        try {
            setLoading(true);
            setError(null);
            const data = await workflow_automation_1.WorkflowAutomationEngine.getMarketplace(marketplaceFilters);
            setMarketplace(data);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }, []);
    // Load marketplace when filters change
    (0, react_1.useEffect)(() => {
        loadMarketplace(filters);
    }, [loadMarketplace, filters]);
    // Search templates
    const searchTemplates = (0, react_1.useCallback)(async (query, searchFilters) => {
        try {
            setLoading(true);
            setError(null);
            const results = await workflow_automation_1.WorkflowAutomationEngine.searchTemplates(query, searchFilters);
            setMarketplace(prev => prev ? { ...prev, searchResults: results } : null);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }, []);
    return {
        marketplace,
        loading,
        error,
        loadMarketplace,
        searchTemplates,
        refresh: () => loadMarketplace(filters)
    };
}
/**
 * Hook for workflow template management
 */
function useWorkflowTemplate(templateId) {
    const { user } = (0, use_auth_1.useAuth)();
    const [template, setTemplate] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const loadTemplate = (0, react_1.useCallback)(async (id) => {
        try {
            setLoading(true);
            setError(null);
            const data = await workflow_automation_1.WorkflowAutomationEngine.getTemplate(id);
            setTemplate(data);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }, []);
    // Load template when ID changes
    (0, react_1.useEffect)(() => {
        if (templateId) {
            loadTemplate(templateId);
        }
    }, [templateId, loadTemplate]);
    // Create workflow from template
    const createWorkflow = (0, react_1.useCallback)(async (templateId, customizations) => {
        if (!user)
            throw new Error('User not authenticated');
        try {
            setLoading(true);
            setError(null);
            const workflowId = await workflow_automation_1.WorkflowAutomationEngine.createWorkflowFromTemplate(templateId, user.uid, customizations);
            return workflowId;
        }
        catch (err) {
            setError(err.message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [user]);
    return {
        template,
        loading,
        error,
        loadTemplate,
        createWorkflow,
        refresh: () => templateId && loadTemplate(templateId)
    };
}
/**
 * Hook for workflow execution
 */
function useWorkflowExecution(workflowId) {
    const { user } = (0, use_auth_1.useAuth)();
    const [executions, setExecutions] = (0, react_1.useState)([]);
    const [currentExecution, setCurrentExecution] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    // Execute workflow
    const executeWorkflow = (0, react_1.useCallback)(async (workflowId, variables) => {
        if (!user)
            throw new Error('User not authenticated');
        try {
            setLoading(true);
            setError(null);
            const execution = await workflow_automation_1.WorkflowAutomationEngine.executeWorkflow(workflowId, user.uid, variables);
            setCurrentExecution(execution);
            setExecutions(prev => [execution, ...prev]);
            return execution;
        }
        catch (err) {
            setError(err.message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [user]);
    // Get execution status
    const getExecutionStatus = (0, react_1.useCallback)(async (executionId) => {
        try {
            setLoading(true);
            setError(null);
            const status = await workflow_automation_1.WorkflowAutomationEngine.getExecutionStatus(executionId);
            if (status) {
                setCurrentExecution(status);
                setExecutions(prev => prev.map(exec => exec.id === executionId ? status : exec));
            }
            return status;
        }
        catch (err) {
            setError(err.message);
            return null;
        }
        finally {
            setLoading(false);
        }
    }, []);
    return {
        executions,
        currentExecution,
        loading,
        error,
        executeWorkflow,
        getExecutionStatus
    };
}
/**
 * Hook for intelligent workflow recommendations
 */
function useIntelligentWorkflowRecommendations(limit = 5) {
    const { user } = (0, use_auth_1.useAuth)();
    const [recommendations, setRecommendations] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const loadRecommendations = (0, react_1.useCallback)(async (recommendationLimit = limit) => {
        if (!user)
            return;
        try {
            setLoading(true);
            setError(null);
            const recs = await workflow_automation_1.WorkflowAutomationEngine.getIntelligentRecommendations(user.uid, recommendationLimit);
            setRecommendations(recs);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }, [user, limit]);
    // Load recommendations when user changes
    (0, react_1.useEffect)(() => {
        if (user) {
            loadRecommendations();
        }
    }, [user, loadRecommendations]);
    return {
        recommendations,
        loading,
        error,
        loadRecommendations,
        refresh: () => loadRecommendations(limit)
    };
}
/**
 * Hook for user's custom workflows
 */
function useUserWorkflows() {
    const { user } = (0, use_auth_1.useAuth)();
    const [workflows, setWorkflows] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const loadWorkflows = (0, react_1.useCallback)(async () => {
        if (!user)
            return;
        try {
            setLoading(true);
            setError(null);
            const userWorkflows = await workflow_automation_1.WorkflowAutomationEngine.getUserWorkflows(user.uid);
            setWorkflows(userWorkflows);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }, [user]);
    // Load workflows when user changes
    (0, react_1.useEffect)(() => {
        if (user) {
            loadWorkflows();
        }
    }, [user, loadWorkflows]);
    // Publish workflow template
    const publishTemplate = (0, react_1.useCallback)(async (template) => {
        if (!user)
            throw new Error('User not authenticated');
        try {
            setLoading(true);
            setError(null);
            const templateId = await workflow_automation_1.WorkflowAutomationEngine.publishTemplate(template, user.uid);
            // Refresh workflows after publishing
            await loadWorkflows();
            return templateId;
        }
        catch (err) {
            setError(err.message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [user, loadWorkflows]);
    return {
        workflows,
        loading,
        error,
        loadWorkflows,
        publishTemplate,
        refresh: loadWorkflows
    };
}
/**
 * Hook for workflow analytics
 */
function useWorkflowAnalytics(workflowId) {
    const [analytics, setAnalytics] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const loadAnalytics = (0, react_1.useCallback)(async (id) => {
        try {
            setLoading(true);
            setError(null);
            const data = await workflow_automation_1.WorkflowAutomationEngine.getWorkflowAnalytics(id);
            setAnalytics(data);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }, []);
    // Load analytics when workflow ID changes
    (0, react_1.useEffect)(() => {
        if (workflowId) {
            loadAnalytics(workflowId);
        }
    }, [workflowId, loadAnalytics]);
    return {
        analytics,
        loading,
        error,
        loadAnalytics,
        refresh: () => workflowId && loadAnalytics(workflowId)
    };
}
/**
 * Hook for workflow builder
 */
function useWorkflowBuilder() {
    const [workflow, setWorkflow] = (0, react_1.useState)({});
    const [isDirty, setIsDirty] = (0, react_1.useState)(false);
    const [saving, setSaving] = (0, react_1.useState)(false);
    // Update workflow
    const updateWorkflow = (0, react_1.useCallback)((updates) => {
        setWorkflow(prev => ({ ...prev, ...updates }));
        setIsDirty(true);
    }, []);
    // Add step to workflow
    const addStep = (0, react_1.useCallback)((step) => {
        setWorkflow(prev => ({
            ...prev,
            steps: [...(prev.steps || []), step]
        }));
        setIsDirty(true);
    }, []);
    // Update step
    const updateStep = (0, react_1.useCallback)((stepId, updates) => {
        setWorkflow(prev => ({
            ...prev,
            steps: prev.steps?.map(step => step.id === stepId ? { ...step, ...updates } : step) || []
        }));
        setIsDirty(true);
    }, []);
    // Remove step
    const removeStep = (0, react_1.useCallback)((stepId) => {
        setWorkflow(prev => ({
            ...prev,
            steps: prev.steps?.filter(step => step.id !== stepId) || []
        }));
        setIsDirty(true);
    }, []);
    // Save workflow
    const saveWorkflow = (0, react_1.useCallback)(async () => {
        try {
            setSaving(true);
            // In a real implementation, this would save to the backend
            console.log('Saving workflow:', workflow);
            setIsDirty(false);
        }
        catch (error) {
            console.error('Error saving workflow:', error);
            throw error;
        }
        finally {
            setSaving(false);
        }
    }, [workflow]);
    // Reset workflow
    const resetWorkflow = (0, react_1.useCallback)(() => {
        setWorkflow({});
        setIsDirty(false);
    }, []);
    return {
        workflow,
        isDirty,
        saving,
        updateWorkflow,
        addStep,
        updateStep,
        removeStep,
        saveWorkflow,
        resetWorkflow
    };
}
/**
 * Hook for workflow testing
 */
function useWorkflowTesting(workflowId) {
    const { executeWorkflow } = useWorkflowExecution();
    const [testResults, setTestResults] = (0, react_1.useState)([]);
    const [testing, setTesting] = (0, react_1.useState)(false);
    // Test workflow with sample data
    const testWorkflow = (0, react_1.useCallback)(async (testData, workflowIdToTest) => {
        const targetWorkflowId = workflowIdToTest || workflowId;
        if (!targetWorkflowId)
            throw new Error('No workflow ID provided');
        try {
            setTesting(true);
            const results = [];
            for (const data of testData) {
                const execution = await executeWorkflow(targetWorkflowId, data);
                results.push({
                    input: data,
                    execution,
                    success: execution.status === 'completed'
                });
            }
            setTestResults(results);
            return results;
        }
        catch (error) {
            console.error('Error testing workflow:', error);
            throw error;
        }
        finally {
            setTesting(false);
        }
    }, [executeWorkflow, workflowId]);
    return {
        testResults,
        testing,
        testWorkflow
    };
}
exports.default = useWorkflowMarketplace;
