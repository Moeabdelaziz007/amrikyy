#!/usr/bin/env node

/**
 * Simplified Firestore User Data Test
 * Uses existing Firebase configuration from the codebase
 */

const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } = require('firebase/auth');
const { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, addDoc, getDocs, query, where, orderBy, limit } = require('firebase/firestore');

// Use the existing Firebase configuration from the codebase
const firebaseConfig = {
  apiKey: "AIzaSyApDku-geNVplwIgRBz2U0rs46aAVo-_mE",
  authDomain: "aios-97581.firebaseapp.com",
  projectId: "aios-97581",
  storageBucket: "aios-97581.firebasestorage.app",
  messagingSenderId: "307575156824",
  appId: "1:307575156824:web:00924bd384df1f29909a2d",
  measurementId: "G-JQN1FBR0F4"
};

// Test configuration
const TEST_CONFIG = {
  testUser: {
    email: `test-user-${Date.now()}@auraos-test.com`,
    password: 'TestPassword123!',
    displayName: 'Test User',
    uid: null
  },
  collections: {
    users: 'users',
    posts: 'posts',
    workflows: 'workflows',
    agents: 'agents',
    chatMessages: 'chatMessages'
  }
};

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

// Initialize Firebase
let app;
let auth;
let db;

async function initializeFirebase() {
  try {
    console.log('🔧 Initializing Firebase...');
    
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    console.log('✅ Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    return false;
  }
}

// Test 1: User Registration and Data Storage
async function testUserRegistration() {
  console.log('\n🧪 Testing User Registration and Data Storage...');
  
  try {
    // Create test user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      TEST_CONFIG.testUser.email,
      TEST_CONFIG.testUser.password
    );
    
    TEST_CONFIG.testUser.uid = userCredential.user.uid;
    logTest('User Creation', true, `UID: ${TEST_CONFIG.testUser.uid}`);

    // Test user data storage in Firestore
    const userRef = doc(db, TEST_CONFIG.collections.users, TEST_CONFIG.testUser.uid);
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
    await signOut(auth);
    logTest('User Sign Out', true, 'Successfully signed out');

    // Sign in with email and password
    const userCredential = await signInWithEmailAndPassword(
      auth,
      TEST_CONFIG.testUser.email,
      TEST_CONFIG.testUser.password
    );
    
    const user = userCredential.user;
    logTest('User Sign In', true, `Signed in as ${user.email}`);

    // Update last login time
    const userRef = doc(db, TEST_CONFIG.collections.users, user.uid);
    await updateDoc(userRef, {
      lastLoginAt: new Date(),
      loginCount: 1
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

// Test 3: Data Creation and Retrieval
async function testDataCreation() {
  console.log('\n📝 Testing Data Creation and Retrieval...');
  
  try {
    const userId = TEST_CONFIG.testUser.uid;

    // Test post creation
    const postRef = await addDoc(collection(db, TEST_CONFIG.collections.posts), {
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
    const postSnap = await getDoc(doc(db, TEST_CONFIG.collections.posts, postId));
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
    const workflowRef = await addDoc(collection(db, TEST_CONFIG.collections.workflows), {
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
    const agentRef = await addDoc(collection(db, TEST_CONFIG.collections.agents), {
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
    const messageRef = await addDoc(collection(db, TEST_CONFIG.collections.chatMessages), {
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
      collection(db, TEST_CONFIG.collections.posts),
      where('userId', '==', userId)
    );
    const userPostsSnap = await getDocs(userPostsQuery);
    logTest('Data Relationships', userPostsSnap.size > 0, `Found ${userPostsSnap.size} user posts`);

    return { postId, workflowId, agentId, messageId };
  } catch (error) {
    logTest('Data Creation', false, error.message);
    return null;
  }
}

// Test 4: Data Persistence and Recovery
async function testDataPersistence() {
  console.log('\n💾 Testing Data Persistence and Recovery...');
  
  try {
    const userId = TEST_CONFIG.testUser.uid;

    // Create test data
    const testDataRef = await addDoc(collection(db, 'test_data'), {
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
    const retrievedSnap = await getDoc(doc(db, 'test_data', testDataId));
    if (retrievedSnap.exists()) {
      const retrievedData = retrievedSnap.data();
      const persistenceCheck = 
        retrievedData.userId === userId &&
        retrievedData.testValue === 'persistence-test' &&
        retrievedData.metadata.testType === 'persistence';
      
      logTest('Data Persistence', persistenceCheck, persistenceCheck ? 'Data persisted correctly' : 'Persistence issue');
    }

    // Test data update
    await updateDoc(doc(db, 'test_data', testDataId), {
      testValue: 'updated-persistence-test',
      updatedAt: new Date(),
      metadata: {
        ...retrievedSnap.data().metadata,
        updated: true
      }
    });

    // Verify update persistence
    const updatedSnap = await getDoc(doc(db, 'test_data', testDataId));
    if (updatedSnap.exists()) {
      const updatedData = updatedSnap.data();
      const updateCheck = updatedData.testValue === 'updated-persistence-test' && updatedData.metadata.updated === true;
      logTest('Data Update Persistence', updateCheck, updateCheck ? 'Update persisted correctly' : 'Update persistence issue');
    }

    // Clean up test data
    await deleteDoc(doc(db, 'test_data', testDataId));
    logTest('Data Cleanup', true, 'Test data cleaned up');

    return true;
  } catch (error) {
    logTest('Data Persistence', false, error.message);
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
      collection(db, TEST_CONFIG.collections.posts),
      where('userId', '==', userId)
    );
    const userPostsSnap = await getDocs(userPostsQuery);
    
    for (const doc of userPostsSnap.docs) {
      await deleteDoc(doc.ref);
    }
    logTest('Posts Cleanup', true, `Deleted ${userPostsSnap.size} posts`);

    // Delete user workflows
    const userWorkflowsQuery = query(
      collection(db, TEST_CONFIG.collections.workflows),
      where('userId', '==', userId)
    );
    const userWorkflowsSnap = await getDocs(userWorkflowsQuery);
    
    for (const doc of userWorkflowsSnap.docs) {
      await deleteDoc(doc.ref);
    }
    logTest('Workflows Cleanup', true, `Deleted ${userWorkflowsSnap.size} workflows`);

    // Delete user agents
    const userAgentsQuery = query(
      collection(db, TEST_CONFIG.collections.agents),
      where('userId', '==', userId)
    );
    const userAgentsSnap = await getDocs(userAgentsQuery);
    
    for (const doc of userAgentsSnap.docs) {
      await deleteDoc(doc.ref);
    }
    logTest('Agents Cleanup', true, `Deleted ${userAgentsSnap.size} agents`);

    // Delete user chat messages
    const userMessagesQuery = query(
      collection(db, TEST_CONFIG.collections.chatMessages),
      where('userId', '==', userId)
    );
    const userMessagesSnap = await getDocs(userMessagesQuery);
    
    for (const doc of userMessagesSnap.docs) {
      await deleteDoc(doc.ref);
    }
    logTest('Messages Cleanup', true, `Deleted ${userMessagesSnap.size} messages`);

    // Delete user document
    if (TEST_CONFIG.testUser.uid) {
      await deleteDoc(doc(db, TEST_CONFIG.collections.users, TEST_CONFIG.testUser.uid));
      logTest('User Document Cleanup', true, 'User document deleted');
    }

    return true;
  } catch (error) {
    logTest('Cleanup', false, error.message);
    return false;
  }
}

// Generate test report
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
    console.log('✅ Data integrity and validation: WORKING');
    console.log('✅ Data relationships: WORKING');
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
  console.log('🚀 Starting Simplified Firestore User Data Tests...');
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
    await testDataCreation();
    await testDataPersistence();

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
  testDataCreation,
  testDataPersistence,
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
