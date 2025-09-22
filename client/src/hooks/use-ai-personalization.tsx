'use strict';
// React Hooks for AI Personalization
// Easy-to-use hooks for machine learning-based personalization
Object.defineProperty(exports, '__esModule', { value: true });
exports.useAIPersonalization = useAIPersonalization;
exports.usePersonalizedRecommendations = usePersonalizedRecommendations;
exports.usePersonalizationInsights = usePersonalizationInsights;
exports.usePersonalizedTracking = usePersonalizedTracking;
exports.useSmartSuggestions = useSmartSuggestions;
exports.useAdaptiveUI = useAdaptiveUI;
const react_1 = require('react');
const use_auth_1 = require('./use-auth');
const ai_personalization_1 = require('../lib/ai-personalization');
/**
 * Hook for AI-powered personalization
 */
function useAIPersonalization() {
  const { user } = (0, use_auth_1.useAuth)();
  const [profile, setProfile] = (0, react_1.useState)(null);
  const [loading, setLoading] = (0, react_1.useState)(false);
  const [error, setError] = (0, react_1.useState)(null);
  // Analyze user behavior and generate profile
  const analyzeBehavior = (0, react_1.useCallback)(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const userProfile =
        await ai_personalization_1.AIPersonalizationEngine.analyzeUserBehavior(
          user.uid
        );
      setProfile(userProfile);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);
  // Learn from user feedback
  const learnFromFeedback = (0, react_1.useCallback)(
    async (itemId, feedback, context) => {
      if (!user) return;
      try {
        await ai_personalization_1.AIPersonalizationEngine.learnFromFeedback(
          user.uid,
          itemId,
          feedback,
          context
        );
        // Refresh profile after learning
        await analyzeBehavior();
      } catch (err) {
        setError(err.message);
      }
    },
    [user, analyzeBehavior]
  );
  // Auto-analyze when user changes
  (0, react_1.useEffect)(() => {
    if (user && !profile) {
      analyzeBehavior();
    }
  }, [user, profile, analyzeBehavior]);
  return {
    profile,
    loading,
    error,
    analyzeBehavior,
    learnFromFeedback,
    refresh: analyzeBehavior,
  };
}
/**
 * Hook for personalized recommendations
 */
function usePersonalizedRecommendations(type) {
  const { user } = (0, use_auth_1.useAuth)();
  const [recommendations, setRecommendations] = (0, react_1.useState)([]);
  const [loading, setLoading] = (0, react_1.useState)(false);
  const [error, setError] = (0, react_1.useState)(null);
  const loadRecommendations = (0, react_1.useCallback)(
    async (recommendationType = 'content', limit = 10) => {
      if (!user) return;
      try {
        setLoading(true);
        setError(null);
        const recs =
          await ai_personalization_1.AIPersonalizationEngine.generateRecommendations(
            user.uid,
            recommendationType,
            limit
          );
        setRecommendations(recs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );
  // Load recommendations when type changes
  (0, react_1.useEffect)(() => {
    if (user && type) {
      loadRecommendations(type);
    }
  }, [user, type, loadRecommendations]);
  return {
    recommendations,
    loading,
    error,
    loadRecommendations,
    refresh: () => type && loadRecommendations(type),
  };
}
/**
 * Hook for personalization insights
 */
function usePersonalizationInsights() {
  const { user } = (0, use_auth_1.useAuth)();
  const [insights, setInsights] = (0, react_1.useState)([]);
  const [loading, setLoading] = (0, react_1.useState)(false);
  const [error, setError] = (0, react_1.useState)(null);
  const loadInsights = (0, react_1.useCallback)(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const userInsights =
        await ai_personalization_1.AIPersonalizationEngine.generateInsights(
          user.uid
        );
      setInsights(userInsights);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);
  // Load insights when user changes
  (0, react_1.useEffect)(() => {
    if (user) {
      loadInsights();
    }
  }, [user, loadInsights]);
  return {
    insights,
    loading,
    error,
    loadInsights,
    refresh: loadInsights,
  };
}
/**
 * Hook for user behavior tracking with personalization
 */
function usePersonalizedTracking() {
  const { user } = (0, use_auth_1.useAuth)();
  const { learnFromFeedback } = useAIPersonalization();
  // Track interaction with personalization learning
  const trackInteraction = (0, react_1.useCallback)(
    async (itemId, action, context) => {
      if (!user) return;
      try {
        // Determine feedback based on action
        let feedback = 'neutral';
        switch (action) {
          case 'like':
          case 'share':
          case 'complete':
            feedback = 'positive';
            break;
          case 'view':
          case 'click':
            feedback = 'neutral';
            break;
          default:
            feedback = 'neutral';
        }
        // Learn from the interaction
        await learnFromFeedback(itemId, feedback, {
          action,
          ...context,
        });
      } catch (error) {
        console.error('Error tracking personalized interaction:', error);
      }
    },
    [user, learnFromFeedback]
  );
  // Track content engagement
  const trackContentEngagement = (0, react_1.useCallback)(
    async (contentId, engagementType, metadata) => {
      await trackInteraction(contentId, engagementType, {
        contentType: 'content',
        engagementType,
        ...metadata,
      });
    },
    [trackInteraction]
  );
  // Track feature usage
  const trackFeatureUsage = (0, react_1.useCallback)(
    async (featureId, usageType, metadata) => {
      await trackInteraction(featureId, usageType, metadata);
    },
    [trackInteraction]
  );
  // Track workflow interaction
  const trackWorkflowInteraction = (0, react_1.useCallback)(
    async (workflowId, interactionType, metadata) => {
      await trackInteraction(workflowId, interactionType, {
        contentType: 'workflow',
        interactionType,
        ...metadata,
      });
    },
    [trackInteraction]
  );
  return {
    trackInteraction,
    trackContentEngagement,
    trackFeatureUsage,
    trackWorkflowInteraction,
  };
}
/**
 * Hook for smart content suggestions
 */
function useSmartSuggestions() {
  const { recommendations, loading, error } =
    usePersonalizedRecommendations('content');
  const { trackContentEngagement } = usePersonalizedTracking();
  // Get suggestions for specific context
  const getContextualSuggestions = (0, react_1.useCallback)(
    context => {
      return recommendations.filter(
        rec => rec.metadata?.context === context || rec.category === context
      );
    },
    [recommendations]
  );
  // Track suggestion interaction
  const trackSuggestionInteraction = (0, react_1.useCallback)(
    async (suggestionId, action, metadata) => {
      await trackContentEngagement(suggestionId, action, {
        suggestionType: 'ai_generated',
        ...metadata,
      });
    },
    [trackContentEngagement]
  );
  return {
    suggestions: recommendations,
    loading,
    error,
    getContextualSuggestions,
    trackSuggestionInteraction,
  };
}
/**
 * Hook for adaptive UI personalization
 */
function useAdaptiveUI() {
  const { profile } = useAIPersonalization();
  const [uiPreferences, setUIPreferences] = (0, react_1.useState)({});
  // Generate UI preferences based on user profile
  (0, react_1.useEffect)(() => {
    if (!profile) return;
    const preferences = {};
    // Analyze personality traits for UI customization
    profile.personalityTraits.forEach(trait => {
      if (trait.trait === 'Tech-Savvy' && trait.score > 0.7) {
        preferences.showAdvancedFeatures = true;
        preferences.defaultView = 'detailed';
        preferences.animationLevel = 'minimal';
      } else if (trait.trait === 'Social' && trait.score > 0.6) {
        preferences.showSocialFeatures = true;
        preferences.defaultView = 'social';
        preferences.animationLevel = 'standard';
      } else if (trait.trait === 'Efficiency-Focused' && trait.score > 0.6) {
        preferences.showQuickActions = true;
        preferences.defaultView = 'compact';
        preferences.animationLevel = 'minimal';
      }
    });
    // Analyze interests for feature prioritization
    profile.interests.forEach(interest => {
      if (interest.score > 0.7) {
        preferences.prioritizedFeatures = [
          ...(preferences.prioritizedFeatures || []),
          interest.topic,
        ];
      }
    });
    // Analyze behavior patterns for layout preferences
    profile.behaviorPatterns.forEach(pattern => {
      if (pattern.pattern.includes('frequently') && pattern.confidence > 0.8) {
        preferences.frequentActions = [
          ...(preferences.frequentActions || []),
          pattern.pattern,
        ];
      }
    });
    setUIPreferences(preferences);
  }, [profile]);
  // Get personalized layout configuration
  const getLayoutConfig = (0, react_1.useCallback)(() => {
    return {
      sidebar: {
        showAdvancedFeatures: uiPreferences.showAdvancedFeatures || false,
        prioritizedItems: uiPreferences.prioritizedFeatures || [],
      },
      dashboard: {
        defaultView: uiPreferences.defaultView || 'standard',
        showQuickActions: uiPreferences.showQuickActions || false,
        showSocialFeatures: uiPreferences.showSocialFeatures || false,
      },
      animations: {
        level: uiPreferences.animationLevel || 'standard',
      },
    };
  }, [uiPreferences]);
  // Get personalized theme configuration
  const getThemeConfig = (0, react_1.useCallback)(() => {
    if (!profile) return {};
    const themeConfig = {};
    // Adjust theme based on usage patterns
    const nightUsage = profile.behaviorPatterns.some(
      p => p.timeOfDay === 'night' && p.confidence > 0.7
    );
    if (nightUsage) {
      themeConfig.autoDarkMode = true;
      themeConfig.preferredTheme = 'dark';
    }
    return themeConfig;
  }, [profile]);
  return {
    uiPreferences,
    getLayoutConfig,
    getThemeConfig,
    isAdaptive: Object.keys(uiPreferences).length > 0,
  };
}
exports.default = useAIPersonalization;
