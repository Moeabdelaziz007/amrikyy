'use strict';
// React Hooks for Firestore Integration
Object.defineProperty(exports, '__esModule', { value: true });
exports.useAuth = useAuth;
exports.usePosts = usePosts;
exports.usePostsRealtime = usePostsRealtime;
exports.useWorkflows = useWorkflows;
exports.useAgents = useAgents;
exports.useChatMessages = useChatMessages;
exports.useUserStats = useUserStats;
exports.usePostSearch = usePostSearch;
exports.useBatchOperations = useBatchOperations;
exports.useDataExport = useDataExport;
const react_1 = require('react');
const firebase_1 = require('./firebase');
/**
 * Hook for managing user authentication state
 */
function useAuth() {
  const [user, setUser] = (0, react_1.useState)(null);
  const [loading, setLoading] = (0, react_1.useState)(true);
  const [error, setError] = (0, react_1.useState)(null);
  (0, react_1.useEffect)(() => {
    const unsubscribe = firebase_1.AuthService.onAuthStateChanged(
      user => {
        setUser(user);
        setLoading(false);
        setError(null);
      },
      error => {
        setError(error.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);
  const signInWithGoogle = (0, react_1.useCallback)(async () => {
    try {
      setLoading(true);
      setError(null);
      await firebase_1.AuthService.signInWithGoogle();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);
  const signOut = (0, react_1.useCallback)(async () => {
    try {
      setLoading(true);
      setError(null);
      await firebase_1.AuthService.signOut();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut,
  };
}
/**
 * Hook for managing posts with real-time updates
 */
function usePosts(userId, options = {}) {
  const [posts, setPosts] = (0, react_1.useState)([]);
  const [loading, setLoading] = (0, react_1.useState)(true);
  const [error, setError] = (0, react_1.useState)(null);
  const [hasMore, setHasMore] = (0, react_1.useState)(true);
  const [lastDoc, setLastDoc] = (0, react_1.useState)(null);
  const loadPosts = (0, react_1.useCallback)(
    async (reset = false) => {
      try {
        setLoading(true);
        setError(null);
        const result = await firebase_1.FirestoreService.getPosts(
          userId,
          options.limit || 10,
          reset ? null : lastDoc
        );
        if (reset) {
          setPosts(result.posts);
        } else {
          setPosts(prev => [...prev, ...result.posts]);
        }
        setLastDoc(result.lastDoc);
        setHasMore(result.posts.length === (options.limit || 10));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [userId, options.limit, lastDoc]
  );
  const loadMore = (0, react_1.useCallback)(() => {
    if (!loading && hasMore) {
      loadPosts(false);
    }
  }, [loading, hasMore, loadPosts]);
  const refresh = (0, react_1.useCallback)(() => {
    setLastDoc(null);
    setHasMore(true);
    loadPosts(true);
  }, [loadPosts]);
  (0, react_1.useEffect)(() => {
    loadPosts(true);
  }, [userId]);
  return {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    createPost: firebase_1.FirestoreService.createPost,
    updatePost: firebase_1.FirestoreService.updatePost,
    deletePost: firebase_1.FirestoreService.deletePost,
    likePost: firebase_1.FirestoreService.likePost,
    unlikePost: firebase_1.FirestoreService.unlikePost,
  };
}
/**
 * Hook for real-time posts updates
 */
function usePostsRealtime(userId) {
  const [posts, setPosts] = (0, react_1.useState)([]);
  const [loading, setLoading] = (0, react_1.useState)(true);
  const [error, setError] = (0, react_1.useState)(null);
  (0, react_1.useEffect)(() => {
    if (!userId) return;
    setLoading(true);
    const unsubscribe = firebase_1.FirestoreService.getPostsRealtime(
      userId,
      newPosts => {
        setPosts(newPosts);
        setLoading(false);
        setError(null);
      }
    );
    return unsubscribe;
  }, [userId]);
  return { posts, loading, error };
}
/**
 * Hook for managing workflows
 */
function useWorkflows(userId) {
  const [workflows, setWorkflows] = (0, react_1.useState)([]);
  const [loading, setLoading] = (0, react_1.useState)(true);
  const [error, setError] = (0, react_1.useState)(null);
  const loadWorkflows = (0, react_1.useCallback)(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await firebase_1.FirestoreService.getWorkflows(userId);
      setWorkflows(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  (0, react_1.useEffect)(() => {
    if (userId) {
      loadWorkflows();
    }
  }, [userId, loadWorkflows]);
  return {
    workflows,
    loading,
    error,
    refresh: loadWorkflows,
    createWorkflow: firebase_1.FirestoreService.createWorkflow,
    updateWorkflowStatus: firebase_1.FirestoreService.updateWorkflowStatus,
    incrementWorkflowExecutions:
      firebase_1.FirestoreService.incrementWorkflowExecutions,
  };
}
/**
 * Hook for managing AI agents
 */
function useAgents(userId) {
  const [agents, setAgents] = (0, react_1.useState)([]);
  const [loading, setLoading] = (0, react_1.useState)(true);
  const [error, setError] = (0, react_1.useState)(null);
  const loadAgents = (0, react_1.useCallback)(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await firebase_1.FirestoreService.getAgents(userId);
      setAgents(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  (0, react_1.useEffect)(() => {
    if (userId) {
      loadAgents();
    }
  }, [userId, loadAgents]);
  return {
    agents,
    loading,
    error,
    refresh: loadAgents,
    createAgent: firebase_1.FirestoreService.createAgent,
    updateAgentStatus: firebase_1.FirestoreService.updateAgentStatus,
    incrementAgentInteractions:
      firebase_1.FirestoreService.incrementAgentInteractions,
  };
}
/**
 * Hook for managing chat messages with real-time updates
 */
function useChatMessages(userId) {
  const [messages, setMessages] = (0, react_1.useState)([]);
  const [loading, setLoading] = (0, react_1.useState)(true);
  const [error, setError] = (0, react_1.useState)(null);
  const loadMessages = (0, react_1.useCallback)(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await firebase_1.FirestoreService.getChatMessages(userId);
      setMessages(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  (0, react_1.useEffect)(() => {
    if (!userId) return;
    setLoading(true);
    const unsubscribe = firebase_1.FirestoreService.getChatMessagesRealtime(
      userId,
      newMessages => {
        setMessages(newMessages);
        setLoading(false);
        setError(null);
      }
    );
    return unsubscribe;
  }, [userId]);
  return {
    messages,
    loading,
    error,
    refresh: loadMessages,
    createMessage: firebase_1.FirestoreService.createChatMessage,
    markAsRead: firebase_1.FirestoreService.markMessageAsRead,
  };
}
/**
 * Hook for user statistics
 */
function useUserStats(userId) {
  const [stats, setStats] = (0, react_1.useState)(null);
  const [loading, setLoading] = (0, react_1.useState)(true);
  const [error, setError] = (0, react_1.useState)(null);
  const loadStats = (0, react_1.useCallback)(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await firebase_1.FirestoreService.getUserStats(userId);
      setStats(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  (0, react_1.useEffect)(() => {
    if (userId) {
      loadStats();
    }
  }, [userId, loadStats]);
  return {
    stats,
    loading,
    error,
    refresh: loadStats,
  };
}
/**
 * Hook for searching posts
 */
function usePostSearch(options = {}) {
  const [posts, setPosts] = (0, react_1.useState)([]);
  const [loading, setLoading] = (0, react_1.useState)(false);
  const [error, setError] = (0, react_1.useState)(null);
  const search = (0, react_1.useCallback)(
    async searchTerm => {
      try {
        setLoading(true);
        setError(null);
        const data = await firebase_1.FirestoreService.searchPosts(
          searchTerm,
          options.userId
        );
        setPosts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [options.userId]
  );
  return {
    posts,
    loading,
    error,
    search,
  };
}
/**
 * Hook for batch operations
 */
function useBatchOperations() {
  const [loading, setLoading] = (0, react_1.useState)(false);
  const [error, setError] = (0, react_1.useState)(null);
  const batchCreatePosts = (0, react_1.useCallback)(
    async (userId, postsData) => {
      try {
        setLoading(true);
        setError(null);
        const result = await firebase_1.FirestoreService.batchCreatePosts(
          userId,
          postsData
        );
        return result;
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  const batchDeletePosts = (0, react_1.useCallback)(async postIds => {
    try {
      setLoading(true);
      setError(null);
      await firebase_1.FirestoreService.batchDeletePosts(postIds);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    error,
    batchCreatePosts,
    batchDeletePosts,
  };
}
/**
 * Hook for data export
 */
function useDataExport() {
  const [loading, setLoading] = (0, react_1.useState)(false);
  const [error, setError] = (0, react_1.useState)(null);
  const exportData = (0, react_1.useCallback)(async userId => {
    try {
      setLoading(true);
      setError(null);
      const data = await firebase_1.FirestoreService.exportUserData(userId);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    error,
    exportData,
  };
}
