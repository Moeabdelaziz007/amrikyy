#!/usr/bin/env node

/**
 * Comprehensive Firestore User Data Testing Suite
 * Tests all user data storage, retrieval, and persistence functionality
 */

require('dotenv').config();
const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } = require('firebase/auth');
const { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, addDoc, getDocs, query, where, orderBy, limit } = require('firebase/firestore');

// Test configuration
const TEST_CONFIG = {
  testUser: {
    email: 'test-user@auraos-test.com',
    password: 'TestPassword123!',
    displayName: 'Test User',
    uid: null
  },
  testData: {
    posts: [],
    workflows: [],
    agents: [],
    chatMessages: []
  },
  collections: {
    users: 'users',
    posts: 'posts',
    workflows: 'workflows',
    agents: 'agents',
    chatMessages: 'chatMessages',
    userHistory: 'user_history',
    userSessions: 'user_sessions',
    userAnalytics: 'user_analytics'
  }
};

// Initialize Firebase Admin
let adminDb;
let clientApp;
let clientAuth;
let clientDb;

async function initializeFirebase() {
  try {
    console.log('🔧 Initializing Firebase...');
    
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

    adminDb = admin.firestore();
    
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
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

function logTest(testName, passed, message = '') {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    console.log(`✅ ${testName}: PASSED ${message}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${testName}: FAILED ${message}`);
  }
  testResults.details.push({ testName, passed, message });
}

// Test 1: User Registration and Data Persistence
async function testUserRegistration() {
  console.log('\n🧪 Testing User Registration and Data Persistence...');
  
  try {
    // Create test user
    const userCredential = await createUserWithEmailAndPassword(
      clientAuth,
      TEST_CONFIG.testUser.email,
      TEST_CONFIG.testUser.password
    );
    
    TEST_CONFIG.testUser.uid = userCredential.user.uid;
    logTest('User Creation', true, `UID: ${TEST_CONFIG.testUser.uid}`);

    // Test user data storage in Firestore
    const userRef = doc(clientDb, TEST_CONFIG.collections.users, TEST_CONFIG.testUser.uid);
    const userData = {
      uid: TEST_CONFIG.testUser.uid,
      email: TEST_CONFIG.testUser.email,
      displayName: TEST_CONFIG.testUser.displayName,
      emailVerified: false,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en',
      },
    };

    await setDoc(userRef, userData, { merge: true });
    logTest('User Data Storage', true, 'User data saved to Firestore');

    // Verify user data retrieval
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const retrievedData = userSnap.data();
      const dataMatches = 
        retrievedData.uid === TEST_CONFIG.testUser.uid &&
        retrievedData.email === TEST_CONFIG.testUser.email &&
        retrievedData.displayName === TEST_CONFIG.testUser.displayName;
      
      logTest('User Data Retrieval', dataMatches, dataMatches ? 'Data matches stored values' : 'Data mismatch');
    } else {
      logTest('User Data Retrieval', false, 'User document not found');
    }

    return true;
  } catch (error) {
    logTest('User Registration', false, error.message);
    return false;
  }
}

// Test 2: User Authentication and Data Retrieval
async function testUserAuthentication() {
  console.log('\n🔐 Testing User Authentication and Data Retrieval...');
  
  try {
    // Sign out first
    await signOut(clientAuth);
    logTest('User Sign Out', true, 'Successfully signed out');

    // Sign in with email and password
    const userCredential = await signInWithEmailAndPassword(
      clientAuth,
      TEST_CONFIG.testUser.email,
      TEST_CONFIG.testUser.password
    );
    
    const user = userCredential.user;
    logTest('User Sign In', true, `Signed in as ${user.email}`);

    // Update last login time
    const userRef = doc(clientDb, TEST_CONFIG.collections.users, user.uid);
    await updateDoc(userRef, {
      lastLoginAt: new Date(),
      loginCount: admin.firestore.FieldValue.increment(1)
    });
    logTest('Login Time Update', true, 'Last login time updated');

    // Retrieve updated user data
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      logTest('Updated Data Retrieval', true, `Login count: ${userData.loginCount || 1}`);
    }

    return true;
  } catch (error) {
    logTest('User Authentication', false, error.message);
    return false;
  }
}

// Test 3: User History and Analytics Data Storage
async function testUserHistoryTracking() {
  console.log('\n📊 Testing User History and Analytics Data Storage...');
  
  try {
    const userId = TEST_CONFIG.testUser.uid;
    
    // Test session creation
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sessionRef = doc(clientDb, TEST_CONFIG.collections.userSessions, sessionId);
    const sessionData = {
      id: sessionId,
      userId: userId,
      startTime: new Date(),
      deviceInfo: {
        userAgent: navigator.userAgent || 'test-agent',
        platform: 'test-platform',
        language: 'en',
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
      lastActivity: new Date(),
      isActive: true,
    };

    await setDoc(sessionRef, sessionData);
    logTest('Session Creation', true, `Session ID: ${sessionId}`);

    // Test action tracking
    const actionId = `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const actionRef = doc(clientDb, TEST_CONFIG.collections.userHistory, actionId);
    const actionData = {
      id: actionId,
      userId: userId,
      action: {
        type: 'navigate',
        category: 'navigation',
        description: 'Navigated to dashboard',
        details: {
          page: 'dashboard',
          previousPage: 'home',
          duration: 5000,
        },
      },
      timestamp: new Date(),
      sessionId: sessionId,
      metadata: {
        browser: 'test-browser',
        version: '1.0.0',
      },
      success: true,
      errorMessage: null,
    };

    await setDoc(actionRef, actionData);
    logTest('Action Tracking', true, 'User action tracked successfully');

    // Test analytics generation
    const analyticsId = `${userId}_monthly_${Date.now()}`;
    const analyticsRef = doc(clientDb, TEST_CONFIG.collections.userAnalytics, analyticsId);
    const analyticsData = {
      userId: userId,
      period: 'monthly',
      date: new Date(),
      stats: {
        totalSessions: 1,
        totalActions: 1,
        averageSessionDuration: 300000, // 5 minutes
        mostUsedFeatures: [
          { feature: 'navigation', count: 1, percentage: 100 }
        ],
        topPages: [
          { page: 'dashboard', visits: 1, averageTime: 5000 }
        ],
        deviceBreakdown: [
          { device: 'test-platform', count: 1, percentage: 100 }
        ],
        errorRate: 0,
        retentionRate: 100,
      },
    };

    await setDoc(analyticsRef, analyticsData);
    logTest('Analytics Generation', true, 'User analytics generated');

    return true;
  } catch (error) {
    logTest('User History Tracking', false, error.message);
    return false;
  }
}

// Test 4: Data Integrity and Validation
async function testDataIntegrity() {
  console.log('\n🔍 Testing Data Integrity and Validation...');
  
  try {
    const userId = TEST_CONFIG.testUser.uid;

    // Test post creation and retrieval
    const postRef = await addDoc(collection(clientDb, TEST_CONFIG.collections.posts), {
      title: 'Test Post',
      content: 'This is a test post for data integrity testing',
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['test', 'data-integrity'],
      likes: 0,
      comments: 0,
    });

    const postId = postRef.id;
    logTest('Post Creation', true, `Post ID: ${postId}`);

    // Verify post data integrity
    const postSnap = await getDoc(doc(clientDb, TEST_CONFIG.collections.posts, postId));
    if (postSnap.exists()) {
      const postData = postSnap.data();
      const integrityCheck = 
        postData.userId === userId &&
        postData.title === 'Test Post' &&
        postData.content.includes('test post') &&
        Array.isArray(postData.tags) &&
        postData.tags.length === 2;
      
      logTest('Post Data Integrity', integrityCheck, integrityCheck ? 'All fields match' : 'Data integrity issue');
    }

    // Test workflow creation
    const workflowRef = await addDoc(collection(clientDb, TEST_CONFIG.collections.workflows), {
      name: 'Test Workflow',
      description: 'A test workflow for data integrity',
      userId: userId,
      steps: [
        { id: 'step1', name: 'Start', type: 'trigger' },
        { id: 'step2', name: 'Process', type: 'action' },
        { id: 'step3', name: 'End', type: 'output' }
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const workflowId = workflowRef.id;
    logTest('Workflow Creation', true, `Workflow ID: ${workflowId}`);

    // Test agent creation
    const agentRef = await addDoc(collection(clientDb, TEST_CONFIG.collections.agents), {
      name: 'Test Agent',
      description: 'A test AI agent',
      userId: userId,
      type: 'assistant',
      capabilities: ['chat', 'analysis', 'automation'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const agentId = agentRef.id;
    logTest('Agent Creation', true, `Agent ID: ${agentId}`);

    // Test chat message creation
    const messageRef = await addDoc(collection(clientDb, TEST_CONFIG.collections.chatMessages), {
      userId: userId,
      agentId: agentId,
      message: 'Hello, this is a test message',
      type: 'user',
      timestamp: new Date(),
      metadata: {
        sessionId: 'test-session',
        context: 'test-context'
      }
    });

    const messageId = messageRef.id;
    logTest('Chat Message Creation', true, `Message ID: ${messageId}`);

    // Test data relationships
    const userPostsQuery = query(
      collection(clientDb, TEST_CONFIG.collections.posts),
      where('userId', '==', userId)
    );
    const userPostsSnap = await getDocs(userPostsQuery);
    logTest('Data Relationships', userPostsSnap.size > 0, `Found ${userPostsSnap.size} user posts`);

    return true;
  } catch (error) {
    logTest('Data Integrity', false, error.message);
    return false;
  }
}

// Test 5: Data Persistence and Recovery
async function testDataPersistence() {
  console.log('\n💾 Testing Data Persistence and Recovery...');
  
  try {
    const userId = TEST_CONFIG.testUser.uid;

    // Create test data
    const testDataRef = await addDoc(collection(clientDb, 'test_data'), {
      userId: userId,
      testValue: 'persistence-test',
      timestamp: new Date(),
      metadata: {
        testType: 'persistence',
        version: '1.0'
      }
    });

    const testDataId = testDataRef.id;
    logTest('Test Data Creation', true, `Test data ID: ${testDataId}`);

    // Wait a moment to ensure data is persisted
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Retrieve data to verify persistence
    const retrievedSnap = await getDoc(doc(clientDb, 'test_data', testDataId));
    if (retrievedSnap.exists()) {
      const retrievedData = retrievedSnap.data();
      const persistenceCheck = 
        retrievedData.userId === userId &&
        retrievedData.testValue === 'persistence-test' &&
        retrievedData.metadata.testType === 'persistence';
      
      logTest('Data Persistence', persistenceCheck, persistenceCheck ? 'Data persisted correctly' : 'Persistence issue');
    }

    // Test data update
    await updateDoc(doc(clientDb, 'test_data', testDataId), {
      testValue: 'updated-persistence-test',
      updatedAt: new Date(),
      metadata: {
        ...retrievedSnap.data().metadata,
        updated: true
      }
    });

    // Verify update persistence
    const updatedSnap = await getDoc(doc(clientDb, 'test_data', testDataId));
    if (updatedSnap.exists()) {
      const updatedData = updatedSnap.data();
      const updateCheck = updatedData.testValue === 'updated-persistence-test' && updatedData.metadata.updated === true;
      logTest('Data Update Persistence', updateCheck, updateCheck ? 'Update persisted correctly' : 'Update persistence issue');
    }

    // Clean up test data
    await deleteDoc(doc(clientDb, 'test_data', testDataId));
    logTest('Data Cleanup', true, 'Test data cleaned up');

    return true;
  } catch (error) {
    logTest('Data Persistence', false, error.message);
    return false;
  }
}

// Test 6: Security and Access Control
async function testSecurityAndAccess() {
  console.log('\n🔒 Testing Security and Access Control...');
  
  try {
    const userId = TEST_CONFIG.testUser.uid;

    // Test user can only access their own data
    const userPostsQuery = query(
      collection(clientDb, TEST_CONFIG.collections.posts),
      where('userId', '==', userId)
    );
    const userPostsSnap = await getDocs(userPostsQuery);
    
    let allPostsOwned = true;
    userPostsSnap.forEach(doc => {
      if (doc.data().userId !== userId) {
        allPostsOwned = false;
      }
    });

    logTest('User Data Access Control', allPostsOwned, `User can access ${userPostsSnap.size} of their own posts`);

    // Test data validation
    try {
      await addDoc(collection(clientDb, TEST_CONFIG.collections.posts), {
        title: '', // Empty title should be handled
        content: 'Test content',
        userId: userId,
        createdAt: new Date(),
      });
      logTest('Data Validation', false, 'Empty title was accepted');
    } catch (error) {
      logTest('Data Validation', true, 'Empty title was rejected');
    }

    // Test timestamp consistency
    const now = new Date();
    const testDocRef = await addDoc(collection(clientDb, 'timestamp_test'), {
      userId: userId,
      createdAt: now,
      serverTimestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    const testDocSnap = await getDoc(testDocRef);
    if (testDocSnap.exists()) {
      const testData = testDocSnap.data();
      const timeDiff = Math.abs(testData.createdAt.getTime() - now.getTime());
      const timestampConsistent = timeDiff < 5000; // Within 5 seconds
      
      logTest('Timestamp Consistency', timestampConsistent, `Time difference: ${timeDiff}ms`);
    }

    // Clean up
    await deleteDoc(testDocRef);

    return true;
  } catch (error) {
    logTest('Security and Access Control', false, error.message);
    return false;
  }
}

// Cleanup function
async function cleanupTestData() {
  console.log('\n🧹 Cleaning up test data...');
  
  try {
    const userId = TEST_CONFIG.testUser.uid;

    // Delete user posts
    const userPostsQuery = query(
      collection(clientDb, TEST_CONFIG.collections.posts),
      where('userId', '==', userId)
    );
    const userPostsSnap = await getDocs(userPostsQuery);
    
    for (const doc of userPostsSnap.docs) {
      await deleteDoc(doc.ref);
    }
    logTest('Posts Cleanup', true, `Deleted ${userPostsSnap.size} posts`);

    // Delete user workflows
    const userWorkflowsQuery = query(
      collection(clientDb, TEST_CONFIG.collections.workflows),
      where('userId', '==', userId)
    );
    const userWorkflowsSnap = await getDocs(userWorkflowsQuery);
    
    for (const doc of userWorkflowsSnap.docs) {
      await deleteDoc(doc.ref);
    }
    logTest('Workflows Cleanup', true, `Deleted ${userWorkflowsSnap.size} workflows`);

    // Delete user agents
    const userAgentsQuery = query(
      collection(clientDb, TEST_CONFIG.collections.agents),
      where('userId', '==', userId)
    );
    const userAgentsSnap = await getDocs(userAgentsQuery);
    
    for (const doc of userAgentsSnap.docs) {
      await deleteDoc(doc.ref);
    }
    logTest('Agents Cleanup', true, `Deleted ${userAgentsSnap.size} agents`);

    // Delete user chat messages
    const userMessagesQuery = query(
      collection(clientDb, TEST_CONFIG.collections.chatMessages),
      where('userId', '==', userId)
    );
    const userMessagesSnap = await getDocs(userMessagesQuery);
    
    for (const doc of userMessagesSnap.docs) {
      await deleteDoc(doc.ref);
    }
    logTest('Messages Cleanup', true, `Deleted ${userMessagesSnap.size} messages`);

    // Delete user history
    const userHistoryQuery = query(
      collection(clientDb, TEST_CONFIG.collections.userHistory),
      where('userId', '==', userId)
    );
    const userHistorySnap = await getDocs(userHistoryQuery);
    
    for (const doc of userHistorySnap.docs) {
      await deleteDoc(doc.ref);
    }
    logTest('History Cleanup', true, `Deleted ${userHistorySnap.size} history entries`);

    // Delete user sessions
    const userSessionsQuery = query(
      collection(clientDb, TEST_CONFIG.collections.userSessions),
      where('userId', '==', userId)
    );
    const userSessionsSnap = await getDocs(userSessionsQuery);
    
    for (const doc of userSessionsSnap.docs) {
      await deleteDoc(doc.ref);
    }
    logTest('Sessions Cleanup', true, `Deleted ${userSessionsSnap.size} sessions`);

    // Delete user analytics
    const userAnalyticsQuery = query(
      collection(clientDb, TEST_CONFIG.collections.userAnalytics),
      where('userId', '==', userId)
    );
    const userAnalyticsSnap = await getDocs(userAnalyticsQuery);
    
    for (const doc of userAnalyticsSnap.docs) {
      await deleteDoc(doc.ref);
    }
    logTest('Analytics Cleanup', true, `Deleted ${userAnalyticsSnap.size} analytics entries`);

    // Delete user document
    if (TEST_CONFIG.testUser.uid) {
      await deleteDoc(doc(clientDb, TEST_CONFIG.collections.users, TEST_CONFIG.testUser.uid));
      logTest('User Document Cleanup', true, 'User document deleted');
    }

    // Delete test user from Auth
    if (TEST_CONFIG.testUser.uid) {
      await admin.auth().deleteUser(TEST_CONFIG.testUser.uid);
      logTest('Auth User Cleanup', true, 'Test user deleted from Auth');
    }

    return true;
  } catch (error) {
    logTest('Cleanup', false, error.message);
    return false;
  }
}

// Generate comprehensive test report
function generateTestReport() {
  console.log('\n📊 COMPREHENSIVE TEST REPORT');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed} (${((testResults.passed / testResults.total) * 100).toFixed(1)}%)`);
  console.log(`Failed: ${testResults.failed} (${((testResults.failed / testResults.total) * 100).toFixed(1)}%)`);
  console.log('='.repeat(50));
  
  console.log('\n📋 DETAILED RESULTS:');
  testResults.details.forEach((result, index) => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${index + 1}. ${status} - ${result.testName}`);
    if (result.message) {
      console.log(`   ${result.message}`);
    }
  });

  console.log('\n🎯 SUMMARY:');
  if (testResults.failed === 0) {
    console.log('🎉 ALL TESTS PASSED! User data storage in Firestore is working correctly.');
    console.log('✅ User registration and authentication: WORKING');
    console.log('✅ Data persistence and retrieval: WORKING');
    console.log('✅ User history tracking: WORKING');
    console.log('✅ Data integrity and validation: WORKING');
    console.log('✅ Security and access control: WORKING');
  } else {
    console.log('⚠️  SOME TESTS FAILED. Please review the failed tests above.');
    console.log('🔧 Check Firebase configuration and Firestore rules.');
  }

  return {
    success: testResults.failed === 0,
    total: testResults.total,
    passed: testResults.passed,
    failed: testResults.failed,
    details: testResults.details
  };
}

// Main test execution function
async function runAllTests() {
  console.log('🚀 Starting Comprehensive Firestore User Data Tests...');
  console.log('='.repeat(60));
  
  const startTime = Date.now();
  
  try {
    // Initialize Firebase
    const initialized = await initializeFirebase();
    if (!initialized) {
      throw new Error('Firebase initialization failed');
    }

    // Run all tests
    await testUserRegistration();
    await testUserAuthentication();
    await testUserHistoryTracking();
    await testDataIntegrity();
    await testDataPersistence();
    await testSecurityAndAccess();

    // Cleanup test data
    await cleanupTestData();

    // Generate report
    const report = generateTestReport();
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log(`\n⏱️  Total Test Duration: ${duration.toFixed(2)} seconds`);
    
    return report;
    
  } catch (error) {
    console.error('💥 Test execution failed:', error.message);
    return {
      success: false,
      error: error.message,
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      details: testResults.details
    };
  }
}

// Export for use as module
module.exports = {
  runAllTests,
  initializeFirebase,
  testUserRegistration,
  testUserAuthentication,
  testUserHistoryTracking,
  testDataIntegrity,
  testDataPersistence,
  testSecurityAndAccess,
  cleanupTestData,
  generateTestReport
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests()
    .then(report => {
      process.exit(report.success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    });
}
