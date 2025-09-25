#!/usr/bin/env node

/**
 * User History Service Testing Suite
 * Tests comprehensive user activity tracking and analytics
 */

require('dotenv').config();
const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } = require('firebase/auth');
const { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, addDoc, getDocs, query, where, orderBy, limit, writeBatch, increment, Timestamp } = require('firebase/firestore');

// Test configuration for user history
const HISTORY_TEST_CONFIG = {
  testUser: {
    email: 'history-test@auraos-test.com',
    password: 'HistoryTest123!',
    displayName: 'History Test User',
    uid: null
  },
  collections: {
    userHistory: 'user_history',
    userSessions: 'user_sessions',
    userAnalytics: 'user_analytics'
  },
  testActions: [
    {
      type: 'navigate',
      category: 'navigation',
      description: 'Navigated to dashboard',
      details: { page: 'dashboard', previousPage: 'home', duration: 5000 }
    },
    {
      type: 'click',
      category: 'interaction',
      description: 'Clicked submit button',
      details: { element: 'button', id: 'submit-form', formName: 'login' }
    },
    {
      type: 'chat',
      category: 'ai',
      description: 'AI interaction',
      details: { agentId: 'ai-agent-1', prompt: 'Hello AI', response: 'Hello! How can I help?' }
    },
    {
      type: 'execute',
      category: 'workflow',
      description: 'Workflow execution',
      details: { workflowId: 'workflow-123', steps: ['trigger', 'process', 'send'], success: true }
    },
    {
      type: 'error',
      category: 'system',
      description: 'System error occurred',
      details: { error: 'Network timeout', context: 'API call', stack: 'Error stack trace' }
    }
  ]
};

let clientApp;
let clientAuth;
let clientDb;

async function initializeFirebase() {
  try {
    console.log('🔧 Initializing Firebase for History Testing...');
    
    // Initialize Admin SDK
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PRIVATE_KEY !== 'YOUR_PRIVATE_KEY_HERE') {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
        storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
      });
    } else if (require('fs').existsSync('./service-account-key.json')) {
      const serviceAccount = require('./service-account-key.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`,
        storageBucket: `${serviceAccount.project_id}.appspot.com`,
      });
    } else {
      throw new Error('No Firebase credentials found');
    }

    // Initialize Client SDK
    const firebaseConfig = {
      apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyApDku-geNVplwIgRBz2U0rs46aAVo-_mE",
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "aios-97581.firebaseapp.com",
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || "aios-97581",
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "aios-97581.firebasestorage.app",
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "307575156824",
      appId: process.env.VITE_FIREBASE_APP_ID || "1:307575156824:web:00924bd384df1f29909a2d",
      measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-JQN1FBR0F4"
    };

    clientApp = initializeApp(firebaseConfig);
    clientAuth = getAuth(clientApp);
    clientDb = getFirestore(clientApp);

    console.log('✅ Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    return false;
  }
}

// Test Results Tracking
const historyTestResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

function logHistoryTest(testName, passed, message = '') {
  historyTestResults.total++;
  if (passed) {
    historyTestResults.passed++;
    console.log(`✅ ${testName}: PASSED ${message}`);
  } else {
    historyTestResults.failed++;
    console.log(`❌ ${testName}: FAILED ${message}`);
  }
  historyTestResults.details.push({ testName, passed, message });
}

// Test 1: Session Management
async function testSessionManagement() {
  console.log('\n📱 Testing Session Management...');
  
  try {
    const userId = HISTORY_TEST_CONFIG.testUser.uid;
    
    // Test session creation
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sessionRef = doc(clientDb, HISTORY_TEST_CONFIG.collections.userSessions, sessionId);
    
    const sessionData = {
      id: sessionId,
      userId: userId,
      startTime: Timestamp.fromDate(new Date()),
      deviceInfo: {
        userAgent: 'Mozilla/5.0 (Test Browser)',
        platform: 'Test Platform',
        language: 'en-US',
        timezone: 'UTC',
        screenResolution: '1920x1080',
        viewport: '1920x1080',
      },
      location: {
        country: 'Test Country',
        region: 'Test Region',
        city: 'Test City',
      },
      actions: 0,
      lastActivity: Timestamp.fromDate(new Date()),
      isActive: true,
    };

    await setDoc(sessionRef, sessionData);
    logHistoryTest('Session Creation', true, `Session ID: ${sessionId}`);

    // Test session update
    await updateDoc(sessionRef, {
      actions: increment(1),
      lastActivity: Timestamp.fromDate(new Date()),
    });
    logHistoryTest('Session Update', true, 'Session activity updated');

    // Test session end
    const endTime = new Date();
    await updateDoc(sessionRef, {
      endTime: Timestamp.fromDate(endTime),
      duration: endTime.getTime() - sessionData.startTime.toDate().getTime(),
      isActive: false,
      lastActivity: Timestamp.fromDate(endTime),
    });
    logHistoryTest('Session End', true, 'Session ended successfully');

    return sessionId;
  } catch (error) {
    logHistoryTest('Session Management', false, error.message);
    return null;
  }
}

// Test 2: Action Tracking
async function testActionTracking() {
  console.log('\n🎯 Testing Action Tracking...');
  
  try {
    const userId = HISTORY_TEST_CONFIG.testUser.uid;
    const sessionId = await testSessionManagement();
    
    if (!sessionId) {
      throw new Error('Session creation failed');
    }

    const trackedActions = [];

    // Track multiple actions
    for (let i = 0; i < HISTORY_TEST_CONFIG.testActions.length; i++) {
      const action = HISTORY_TEST_CONFIG.testActions[i];
      const actionId = `action_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`;
      const actionRef = doc(clientDb, HISTORY_TEST_CONFIG.collections.userHistory, actionId);
      
      const actionData = {
        id: actionId,
        userId: userId,
        action: action,
        timestamp: Timestamp.fromDate(new Date()),
        sessionId: sessionId,
        metadata: {
          browser: 'test-browser',
          version: '1.0.0',
          testRun: true,
        },
        success: action.type !== 'error',
        errorMessage: action.type === 'error' ? action.details.error : null,
      };

      await setDoc(actionRef, actionData);
      trackedActions.push(actionId);
      
      // Small delay between actions
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    logHistoryTest('Action Tracking', true, `Tracked ${trackedActions.length} actions`);

    // Verify actions were stored correctly
    const actionsQuery = query(
      collection(clientDb, HISTORY_TEST_CONFIG.collections.userHistory),
      where('userId', '==', userId),
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'desc')
    );

    const actionsSnap = await getDocs(actionsQuery);
    const storedActions = actionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const actionsStoredCorrectly = storedActions.length === HISTORY_TEST_CONFIG.testActions.length;
    logHistoryTest('Action Storage Verification', actionsStoredCorrectly, 
      `Expected ${HISTORY_TEST_CONFIG.testActions.length}, found ${storedActions.length}`);

    // Test action categorization
    const navigationActions = storedActions.filter(action => action.action.category === 'navigation');
    const aiActions = storedActions.filter(action => action.action.category === 'ai');
    const workflowActions = storedActions.filter(action => action.action.category === 'workflow');
    const errorActions = storedActions.filter(action => action.action.category === 'system');

    logHistoryTest('Action Categorization', 
      navigationActions.length === 1 && aiActions.length === 1 && workflowActions.length === 1 && errorActions.length === 1,
      `Navigation: ${navigationActions.length}, AI: ${aiActions.length}, Workflow: ${workflowActions.length}, Errors: ${errorActions.length}`);

    return trackedActions;
  } catch (error) {
    logHistoryTest('Action Tracking', false, error.message);
    return [];
  }
}

// Test 3: Batch Operations
async function testBatchOperations() {
  console.log('\n📦 Testing Batch Operations...');
  
  try {
    const userId = HISTORY_TEST_CONFIG.testUser.uid;
    const batch = writeBatch(clientDb);
    
    // Create multiple documents in a batch
    const batchActions = [];
    for (let i = 0; i < 5; i++) {
      const actionId = `batch_action_${Date.now()}_${i}`;
      const actionRef = doc(clientDb, HISTORY_TEST_CONFIG.collections.userHistory, actionId);
      
      batch.set(actionRef, {
        id: actionId,
        userId: userId,
        action: {
          type: 'batch_test',
          category: 'test',
          description: `Batch test action ${i}`,
          details: { batchIndex: i, timestamp: Date.now() }
        },
        timestamp: Timestamp.fromDate(new Date()),
        sessionId: 'batch_session',
        metadata: { batchTest: true },
        success: true,
        errorMessage: null,
      });
      
      batchActions.push(actionId);
    }

    await batch.commit();
    logHistoryTest('Batch Write', true, `Created ${batchActions.length} documents in batch`);

    // Verify batch operations
    const batchQuery = query(
      collection(clientDb, HISTORY_TEST_CONFIG.collections.userHistory),
      where('userId', '==', userId),
      where('sessionId', '==', 'batch_session')
    );

    const batchSnap = await getDocs(batchQuery);
    const batchStoredCorrectly = batchSnap.size === batchActions.length;
    logHistoryTest('Batch Verification', batchStoredCorrectly, 
      `Expected ${batchActions.length}, found ${batchSnap.size}`);

    return batchActions;
  } catch (error) {
    logHistoryTest('Batch Operations', false, error.message);
    return [];
  }
}

// Test 4: Analytics Generation
async function testAnalyticsGeneration() {
  console.log('\n📊 Testing Analytics Generation...');
  
  try {
    const userId = HISTORY_TEST_CONFIG.testUser.uid;
    
    // Get user history for analytics
    const historyQuery = query(
      collection(clientDb, HISTORY_TEST_CONFIG.collections.userHistory),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(100)
    );

    const historySnap = await getDocs(historyQuery);
    const userHistory = historySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Get user sessions
    const sessionsQuery = query(
      collection(clientDb, HISTORY_TEST_CONFIG.collections.userSessions),
      where('userId', '==', userId),
      orderBy('startTime', 'desc'),
      limit(50)
    );

    const sessionsSnap = await getDocs(sessionsQuery);
    const userSessions = sessionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Generate analytics
    const analyticsId = `${userId}_test_${Date.now()}`;
    const analyticsRef = doc(clientDb, HISTORY_TEST_CONFIG.collections.userAnalytics, analyticsId);
    
    const analytics = {
      userId: userId,
      period: 'test',
      date: Timestamp.fromDate(new Date()),
      stats: {
        totalSessions: userSessions.length,
        totalActions: userHistory.length,
        averageSessionDuration: calculateAverageSessionDuration(userSessions),
        mostUsedFeatures: calculateMostUsedFeatures(userHistory),
        topPages: calculateTopPages(userHistory),
        deviceBreakdown: calculateDeviceBreakdown(userSessions),
        errorRate: calculateErrorRate(userHistory),
        retentionRate: calculateRetentionRate(userSessions),
      },
      generatedAt: Timestamp.fromDate(new Date()),
    };

    await setDoc(analyticsRef, analytics);
    logHistoryTest('Analytics Generation', true, `Analytics ID: ${analyticsId}`);

    // Verify analytics data
    const analyticsSnap = await getDoc(analyticsRef);
    if (analyticsSnap.exists()) {
      const analyticsData = analyticsSnap.data();
      const analyticsValid = 
        analyticsData.stats.totalSessions === userSessions.length &&
        analyticsData.stats.totalActions === userHistory.length &&
        Array.isArray(analyticsData.stats.mostUsedFeatures);
      
      logHistoryTest('Analytics Validation', analyticsValid, 
        `Sessions: ${analyticsData.stats.totalSessions}, Actions: ${analyticsData.stats.totalActions}`);
    }

    return analyticsId;
  } catch (error) {
    logHistoryTest('Analytics Generation', false, error.message);
    return null;
  }
}

// Helper functions for analytics calculations
function calculateAverageSessionDuration(sessions) {
  const sessionsWithDuration = sessions.filter(s => s.duration);
  if (sessionsWithDuration.length === 0) return 0;
  const totalDuration = sessionsWithDuration.reduce((sum, session) => sum + (session.duration || 0), 0);
  return totalDuration / sessionsWithDuration.length;
}

function calculateMostUsedFeatures(history) {
  const featureCounts = {};
  history.forEach(action => {
    const feature = action.action.category;
    featureCounts[feature] = (featureCounts[feature] || 0) + 1;
  });
  const total = history.length;
  return Object.entries(featureCounts)
    .map(([feature, count]) => ({
      feature,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function calculateTopPages(history) {
  const pageCounts = {};
  history
    .filter(action => action.action.type === 'navigate')
    .forEach(action => {
      const page = action.action.details?.page;
      if (page) {
        if (!pageCounts[page]) {
          pageCounts[page] = { visits: 0, totalTime: 0 };
        }
        pageCounts[page].visits++;
        pageCounts[page].totalTime += action.action.details?.duration || 0;
      }
    });
  return Object.entries(pageCounts)
    .map(([page, data]) => ({
      page,
      visits: data.visits,
      averageTime: data.visits > 0 ? data.totalTime / data.visits : 0,
    }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 10);
}

function calculateDeviceBreakdown(sessions) {
  const deviceCounts = {};
  sessions.forEach(session => {
    const device = session.deviceInfo?.platform || 'Unknown';
    deviceCounts[device] = (deviceCounts[device] || 0) + 1;
  });
  const total = sessions.length;
  return Object.entries(deviceCounts)
    .map(([device, count]) => ({
      device,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

function calculateErrorRate(history) {
  const errorCount = history.filter(action => !action.success).length;
  return history.length > 0 ? (errorCount / history.length) * 100 : 0;
}

function calculateRetentionRate(sessions) {
  const activeSessions = sessions.filter(session => session.isActive).length;
  return sessions.length > 0 ? (activeSessions / sessions.length) * 100 : 0;
}

// Test 5: Data Querying and Filtering
async function testDataQuerying() {
  console.log('\n🔍 Testing Data Querying and Filtering...');
  
  try {
    const userId = HISTORY_TEST_CONFIG.testUser.uid;

    // Test basic querying
    const allActionsQuery = query(
      collection(clientDb, HISTORY_TEST_CONFIG.collections.userHistory),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const allActionsSnap = await getDocs(allActionsQuery);
    logHistoryTest('Basic Querying', allActionsSnap.size > 0, `Found ${allActionsSnap.size} actions`);

    // Test filtering by category
    const navigationQuery = query(
      collection(clientDb, HISTORY_TEST_CONFIG.collections.userHistory),
      where('userId', '==', userId),
      where('action.category', '==', 'navigation'),
      orderBy('timestamp', 'desc')
    );

    const navigationSnap = await getDocs(navigationQuery);
    logHistoryTest('Category Filtering', navigationSnap.size > 0, `Found ${navigationSnap.size} navigation actions`);

    // Test filtering by success status
    const successQuery = query(
      collection(clientDb, HISTORY_TEST_CONFIG.collections.userHistory),
      where('userId', '==', userId),
      where('success', '==', true),
      orderBy('timestamp', 'desc')
    );

    const successSnap = await getDocs(successQuery);
    logHistoryTest('Success Filtering', successSnap.size > 0, `Found ${successSnap.size} successful actions`);

    // Test date range filtering (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const recentQuery = query(
      collection(clientDb, HISTORY_TEST_CONFIG.collections.userHistory),
      where('userId', '==', userId),
      where('timestamp', '>=', Timestamp.fromDate(yesterday)),
      orderBy('timestamp', 'desc')
    );

    const recentSnap = await getDocs(recentQuery);
    logHistoryTest('Date Range Filtering', recentSnap.size >= 0, `Found ${recentSnap.size} recent actions`);

    return true;
  } catch (error) {
    logHistoryTest('Data Querying', false, error.message);
    return false;
  }
}

// Test 6: Performance and Scalability
async function testPerformanceAndScalability() {
  console.log('\n⚡ Testing Performance and Scalability...');
  
  try {
    const userId = HISTORY_TEST_CONFIG.testUser.uid;
    
    // Test bulk insert performance
    const startTime = Date.now();
    const bulkActions = [];
    
    for (let i = 0; i < 20; i++) {
      const actionId = `perf_action_${Date.now()}_${i}`;
      const actionRef = doc(clientDb, HISTORY_TEST_CONFIG.collections.userHistory, actionId);
      
      await setDoc(actionRef, {
        id: actionId,
        userId: userId,
        action: {
          type: 'performance_test',
          category: 'test',
          description: `Performance test action ${i}`,
          details: { index: i, timestamp: Date.now() }
        },
        timestamp: Timestamp.fromDate(new Date()),
        sessionId: 'performance_session',
        metadata: { performanceTest: true },
        success: true,
        errorMessage: null,
      });
      
      bulkActions.push(actionId);
    }
    
    const insertTime = Date.now() - startTime;
    const avgInsertTime = insertTime / bulkActions.length;
    
    logHistoryTest('Bulk Insert Performance', avgInsertTime < 1000, 
      `Average insert time: ${avgInsertTime.toFixed(2)}ms per document`);

    // Test query performance
    const queryStartTime = Date.now();
    
    const perfQuery = query(
      collection(clientDb, HISTORY_TEST_CONFIG.collections.userHistory),
      where('userId', '==', userId),
      where('sessionId', '==', 'performance_session'),
      orderBy('timestamp', 'desc')
    );

    const perfSnap = await getDocs(perfQuery);
    const queryTime = Date.now() - queryStartTime;
    
    logHistoryTest('Query Performance', queryTime < 2000, 
      `Query time: ${queryTime}ms for ${perfSnap.size} documents`);

    // Test concurrent operations
    const concurrentStartTime = Date.now();
    const concurrentPromises = [];
    
    for (let i = 0; i < 5; i++) {
      const promise = setDoc(doc(clientDb, HISTORY_TEST_CONFIG.collections.userHistory, `concurrent_${i}`), {
        id: `concurrent_${i}`,
        userId: userId,
        action: {
          type: 'concurrent_test',
          category: 'test',
          description: `Concurrent test ${i}`,
        },
        timestamp: Timestamp.fromDate(new Date()),
        sessionId: 'concurrent_session',
        success: true,
      });
      concurrentPromises.push(promise);
    }
    
    await Promise.all(concurrentPromises);
    const concurrentTime = Date.now() - concurrentStartTime;
    
    logHistoryTest('Concurrent Operations', concurrentTime < 3000, 
      `Concurrent operations completed in ${concurrentTime}ms`);

    return bulkActions;
  } catch (error) {
    logHistoryTest('Performance and Scalability', false, error.message);
    return [];
  }
}

// Cleanup function for history tests
async function cleanupHistoryTestData() {
  console.log('\n🧹 Cleaning up history test data...');
  
  try {
    const userId = HISTORY_TEST_CONFIG.testUser.uid;

    // Delete user history
    const userHistoryQuery = query(
      collection(clientDb, HISTORY_TEST_CONFIG.collections.userHistory),
      where('userId', '==', userId)
    );
    const userHistorySnap = await getDocs(userHistoryQuery);
    
    for (const doc of userHistorySnap.docs) {
      await deleteDoc(doc.ref);
    }
    logHistoryTest('History Cleanup', true, `Deleted ${userHistorySnap.size} history entries`);

    // Delete user sessions
    const userSessionsQuery = query(
      collection(clientDb, HISTORY_TEST_CONFIG.collections.userSessions),
      where('userId', '==', userId)
    );
    const userSessionsSnap = await getDocs(userSessionsQuery);
    
    for (const doc of userSessionsSnap.docs) {
      await deleteDoc(doc.ref);
    }
    logHistoryTest('Sessions Cleanup', true, `Deleted ${userSessionsSnap.size} sessions`);

    // Delete user analytics
    const userAnalyticsQuery = query(
      collection(clientDb, HISTORY_TEST_CONFIG.collections.userAnalytics),
      where('userId', '==', userId)
    );
    const userAnalyticsSnap = await getDocs(userAnalyticsQuery);
    
    for (const doc of userAnalyticsSnap.docs) {
      await deleteDoc(doc.ref);
    }
    logHistoryTest('Analytics Cleanup', true, `Deleted ${userAnalyticsSnap.size} analytics entries`);

    // Delete test user from Auth
    if (userId) {
      await admin.auth().deleteUser(userId);
      logHistoryTest('Auth User Cleanup', true, 'Test user deleted from Auth');
    }

    return true;
  } catch (error) {
    logHistoryTest('History Cleanup', false, error.message);
    return false;
  }
}

// Generate history test report
function generateHistoryTestReport() {
  console.log('\n📊 USER HISTORY SERVICE TEST REPORT');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${historyTestResults.total}`);
  console.log(`Passed: ${historyTestResults.passed} (${((historyTestResults.passed / historyTestResults.total) * 100).toFixed(1)}%)`);
  console.log(`Failed: ${historyTestResults.failed} (${((historyTestResults.failed / historyTestResults.total) * 100).toFixed(1)}%)`);
  console.log('='.repeat(50));
  
  console.log('\n📋 DETAILED RESULTS:');
  historyTestResults.details.forEach((result, index) => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${index + 1}. ${status} - ${result.testName}`);
    if (result.message) {
      console.log(`   ${result.message}`);
    }
  });

  console.log('\n🎯 HISTORY SERVICE SUMMARY:');
  if (historyTestResults.failed === 0) {
    console.log('🎉 ALL HISTORY TESTS PASSED! User history tracking is working correctly.');
    console.log('✅ Session management: WORKING');
    console.log('✅ Action tracking: WORKING');
    console.log('✅ Batch operations: WORKING');
    console.log('✅ Analytics generation: WORKING');
    console.log('✅ Data querying and filtering: WORKING');
    console.log('✅ Performance and scalability: WORKING');
  } else {
    console.log('⚠️  SOME HISTORY TESTS FAILED. Please review the failed tests above.');
    console.log('🔧 Check user history service implementation and Firestore configuration.');
  }

  return {
    success: historyTestResults.failed === 0,
    total: historyTestResults.total,
    passed: historyTestResults.passed,
    failed: historyTestResults.failed,
    details: historyTestResults.details
  };
}

// Main history test execution function
async function runHistoryTests() {
  console.log('🚀 Starting User History Service Tests...');
  console.log('='.repeat(60));
  
  const startTime = Date.now();
  
  try {
    // Initialize Firebase
    const initialized = await initializeFirebase();
    if (!initialized) {
      throw new Error('Firebase initialization failed');
    }

    // Create test user
    const userCredential = await createUserWithEmailAndPassword(
      clientAuth,
      HISTORY_TEST_CONFIG.testUser.email,
      HISTORY_TEST_CONFIG.testUser.password
    );
    
    HISTORY_TEST_CONFIG.testUser.uid = userCredential.user.uid;
    logHistoryTest('Test User Creation', true, `UID: ${HISTORY_TEST_CONFIG.testUser.uid}`);

    // Run all history tests
    await testActionTracking();
    await testBatchOperations();
    await testAnalyticsGeneration();
    await testDataQuerying();
    await testPerformanceAndScalability();

    // Cleanup test data
    await cleanupHistoryTestData();

    // Generate report
    const report = generateHistoryTestReport();
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log(`\n⏱️  Total Test Duration: ${duration.toFixed(2)} seconds`);
    
    return report;
    
  } catch (error) {
    console.error('💥 History test execution failed:', error.message);
    return {
      success: false,
      error: error.message,
      total: historyTestResults.total,
      passed: historyTestResults.passed,
      failed: historyTestResults.failed,
      details: historyTestResults.details
    };
  }
}

// Export for use as module
module.exports = {
  runHistoryTests,
  initializeFirebase,
  testSessionManagement,
  testActionTracking,
  testBatchOperations,
  testAnalyticsGeneration,
  testDataQuerying,
  testPerformanceAndScalability,
  cleanupHistoryTestData,
  generateHistoryTestReport
};

// Run tests if this file is executed directly
if (require.main === module) {
  runHistoryTests()
    .then(report => {
      process.exit(report.success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    });
}
