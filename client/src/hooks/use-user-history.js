"use strict";
// React Hooks for User History Tracking
// Provides easy-to-use hooks for tracking user actions throughout the app
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserHistory = useUserHistory;
exports.usePageTracking = usePageTracking;
exports.useInteractionTracking = useInteractionTracking;
exports.useUserHistoryData = useUserHistoryData;
exports.useUserSessions = useUserSessions;
exports.useUserAnalytics = useUserAnalytics;
exports.useFormTracking = useFormTracking;
exports.useSearchTracking = useSearchTracking;
const react_1 = require("react");
const use_auth_1 = require("./use-auth");
const user_history_service_1 = require("../lib/user-history-service");
/**
 * Hook for tracking user actions
 */
function useUserHistory() {
    const { user } = (0, use_auth_1.useAuth)();
    const [isInitialized, setIsInitialized] = (0, react_1.useState)(false);
    const [currentSession, setCurrentSession] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    // Initialize history tracking when user logs in
    (0, react_1.useEffect)(() => {
        if (user && !isInitialized) {
            user_history_service_1.UserHistoryService.initialize(user.uid)
                .then(() => {
                setIsInitialized(true);
                setError(null);
            })
                .catch((err) => {
                setError(err.message);
                console.error('Failed to initialize user history:', err);
            });
        }
        else if (!user && isInitialized) {
            setIsInitialized(false);
            setCurrentSession(null);
        }
    }, [user, isInitialized]);
    // Track navigation
    const trackNavigation = (0, react_1.useCallback)((page, previousPage, duration) => {
        if (user && isInitialized) {
            user_history_service_1.UserHistoryService.trackNavigation(user.uid, page, previousPage, duration);
        }
    }, [user, isInitialized]);
    // Track content interaction
    const trackContentInteraction = (0, react_1.useCallback)((actionType, targetType, targetId, details) => {
        if (user && isInitialized) {
            user_history_service_1.UserHistoryService.trackContentInteraction(user.uid, actionType, targetType, targetId, details);
        }
    }, [user, isInitialized]);
    // Track AI interaction
    const trackAIInteraction = (0, react_1.useCallback)((actionType, agentId, details) => {
        if (user && isInitialized) {
            user_history_service_1.UserHistoryService.trackAIInteraction(user.uid, actionType, agentId, details);
        }
    }, [user, isInitialized]);
    // Track social interaction
    const trackSocialInteraction = (0, react_1.useCallback)((actionType, targetId, details) => {
        if (user && isInitialized) {
            user_history_service_1.UserHistoryService.trackSocialInteraction(user.uid, actionType, targetId, details);
        }
    }, [user, isInitialized]);
    // Track workflow interaction
    const trackWorkflowInteraction = (0, react_1.useCallback)((actionType, workflowId, details) => {
        if (user && isInitialized) {
            user_history_service_1.UserHistoryService.trackWorkflowInteraction(user.uid, actionType, workflowId, details);
        }
    }, [user, isInitialized]);
    // Track errors
    const trackError = (0, react_1.useCallback)((error, context, details) => {
        if (user && isInitialized) {
            user_history_service_1.UserHistoryService.trackError(user.uid, error, context, details);
        }
    }, [user, isInitialized]);
    return {
        isInitialized,
        currentSession,
        error,
        trackNavigation,
        trackContentInteraction,
        trackAIInteraction,
        trackSocialInteraction,
        trackWorkflowInteraction,
        trackError
    };
}
/**
 * Hook for tracking page views with automatic duration calculation
 */
function usePageTracking(pageName) {
    const { trackNavigation } = useUserHistory();
    const [previousPage, setPreviousPage] = (0, react_1.useState)(null);
    const startTimeRef = (0, react_1.useRef)(Date.now());
    // Track page entry
    (0, react_1.useEffect)(() => {
        const startTime = Date.now();
        startTimeRef.current = startTime;
        // Calculate duration for previous page
        if (previousPage) {
            const duration = startTime - startTimeRef.current;
            trackNavigation(pageName, previousPage, duration);
        }
        else {
            trackNavigation(pageName);
        }
        setPreviousPage(pageName);
        // Track page exit
        return () => {
            const duration = Date.now() - startTimeRef.current;
            if (duration > 1000) { // Only track if user spent more than 1 second
                trackNavigation(pageName, undefined, duration);
            }
        };
    }, [pageName, trackNavigation, previousPage]);
}
/**
 * Hook for tracking component interactions
 */
function useInteractionTracking(componentName) {
    const { trackContentInteraction } = useUserHistory();
    const trackClick = (0, react_1.useCallback)((targetId, details) => {
        trackContentInteraction('click', componentName, targetId, details);
    }, [trackContentInteraction, componentName]);
    const trackView = (0, react_1.useCallback)((targetId, details) => {
        trackContentInteraction('view', componentName, targetId, details);
    }, [trackContentInteraction, componentName]);
    const trackCreate = (0, react_1.useCallback)((targetId, details) => {
        trackContentInteraction('create', componentName, targetId, details);
    }, [trackContentInteraction, componentName]);
    const trackUpdate = (0, react_1.useCallback)((targetId, details) => {
        trackContentInteraction('update', componentName, targetId, details);
    }, [trackContentInteraction, componentName]);
    const trackDelete = (0, react_1.useCallback)((targetId, details) => {
        trackContentInteraction('delete', componentName, targetId, details);
    }, [trackContentInteraction, componentName]);
    return {
        trackClick,
        trackView,
        trackCreate,
        trackUpdate,
        trackDelete
    };
}
/**
 * Hook for getting user history data
 */
function useUserHistoryData(options = {}) {
    const { user } = (0, use_auth_1.useAuth)();
    const [history, setHistory] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [hasMore, setHasMore] = (0, react_1.useState)(true);
    const [lastDoc, setLastDoc] = (0, react_1.useState)(null);
    const loadHistory = (0, react_1.useCallback)(async (reset = false) => {
        if (!user)
            return;
        try {
            setLoading(true);
            setError(null);
            const result = await user_history_service_1.UserHistoryService.getUserHistory(user.uid, {
                ...options,
                startAfter: reset ? undefined : lastDoc
            });
            if (reset) {
                setHistory(result.history);
            }
            else {
                setHistory(prev => [...prev, ...result.history]);
            }
            setLastDoc(result.lastDoc);
            setHasMore(result.history.length === (options.limit || 50));
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }, [user, options, lastDoc]);
    const loadMore = (0, react_1.useCallback)(() => {
        if (!loading && hasMore) {
            loadHistory(false);
        }
    }, [loading, hasMore, loadHistory]);
    const refresh = (0, react_1.useCallback)(() => {
        setLastDoc(null);
        setHasMore(true);
        loadHistory(true);
    }, [loadHistory]);
    (0, react_1.useEffect)(() => {
        loadHistory(true);
    }, [user]);
    return {
        history,
        loading,
        error,
        hasMore,
        loadMore,
        refresh
    };
}
/**
 * Hook for getting user sessions
 */
function useUserSessions() {
    const { user } = (0, use_auth_1.useAuth)();
    const [sessions, setSessions] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const loadSessions = (0, react_1.useCallback)(async () => {
        if (!user)
            return;
        try {
            setLoading(true);
            setError(null);
            const data = await user_history_service_1.UserHistoryService.getUserSessions(user.uid);
            setSessions(data);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }, [user]);
    (0, react_1.useEffect)(() => {
        loadSessions();
    }, [loadSessions]);
    return {
        sessions,
        loading,
        error,
        refresh: loadSessions
    };
}
/**
 * Hook for user analytics
 */
function useUserAnalytics(period = 'monthly') {
    const { user } = (0, use_auth_1.useAuth)();
    const [analytics, setAnalytics] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const generateAnalytics = (0, react_1.useCallback)(async () => {
        if (!user)
            return;
        try {
            setLoading(true);
            setError(null);
            const data = await user_history_service_1.UserHistoryService.generateUserAnalytics(user.uid, period);
            setAnalytics(data);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }, [user, period]);
    (0, react_1.useEffect)(() => {
        generateAnalytics();
    }, [generateAnalytics]);
    return {
        analytics,
        loading,
        error,
        refresh: generateAnalytics
    };
}
/**
 * Hook for tracking form interactions
 */
function useFormTracking(formName) {
    const { trackContentInteraction } = useUserHistory();
    const [formStartTime, setFormStartTime] = (0, react_1.useState)(null);
    const [fieldInteractions, setFieldInteractions] = (0, react_1.useState)({});
    const trackFormStart = (0, react_1.useCallback)(() => {
        setFormStartTime(Date.now());
        trackContentInteraction('view', 'form', formName, { action: 'form_start' });
    }, [trackContentInteraction, formName]);
    const trackFieldFocus = (0, react_1.useCallback)((fieldName) => {
        setFieldInteractions(prev => ({
            ...prev,
            [fieldName]: (prev[fieldName] || 0) + 1
        }));
        trackContentInteraction('click', 'form_field', fieldName, {
            form: formName,
            action: 'field_focus'
        });
    }, [trackContentInteraction, formName]);
    const trackFormSubmit = (0, react_1.useCallback)((success, fieldData) => {
        const duration = formStartTime ? Date.now() - formStartTime : 0;
        trackContentInteraction('create', 'form', formName, {
            action: 'form_submit',
            success,
            duration,
            fieldInteractions,
            fieldData
        });
    }, [trackContentInteraction, formName, formStartTime, fieldInteractions]);
    const trackFormAbandon = (0, react_1.useCallback)(() => {
        const duration = formStartTime ? Date.now() - formStartTime : 0;
        trackContentInteraction('navigate', 'form', formName, {
            action: 'form_abandon',
            duration,
            fieldInteractions
        });
    }, [trackContentInteraction, formName, formStartTime, fieldInteractions]);
    return {
        trackFormStart,
        trackFieldFocus,
        trackFormSubmit,
        trackFormAbandon
    };
}
/**
 * Hook for tracking search behavior
 */
function useSearchTracking() {
    const { trackContentInteraction } = useUserHistory();
    const trackSearch = (0, react_1.useCallback)((query, resultsCount, filters) => {
        trackContentInteraction('search', 'search', 'query', {
            query,
            resultsCount,
            filters
        });
    }, [trackContentInteraction]);
    const trackSearchResultClick = (0, react_1.useCallback)((resultId, position, query) => {
        trackContentInteraction('click', 'search_result', resultId, {
            position,
            query
        });
    }, [trackContentInteraction]);
    return {
        trackSearch,
        trackSearchResultClick
    };
}
exports.default = useUserHistory;
