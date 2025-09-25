#!/usr/bin/env node

/**
 * Firebase Admin SDK Test for User Data Storage
 * Uses Firebase Admin SDK to test data operations with proper permissions
 */

const admin = require('firebase-admin');
const fs = require('fs');

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

// Initialize Firebase Admin
let db;

async function initializeFirebaseAdmin() {
  try {
    console.log('🔧 Initializing Firebase Admin SDK...');
    
    // Check if service account key exists
    if (!fs.existsSync('./service-account-key.json')) {
      throw new Error('Service account key file not found');
    }

    const serviceAccount = require('./service-account-key.json');
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`,
      storageBucket: `${serviceAccount.project_id}.appspot.com`,
    });

    db = admin.firestore();
    console.log('✅ Firebase Admin SDK initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
    return false;
  }
}

// Test 1: Firestore Connection with Admin SDK
async function testFirestoreConnection() {
  console.log('\n🔗 Testing Firestore Connection with Admin SDK...');
  
  try {
    // Test basic connection by writing and reading a test document
    const testDocRef = db.collection('test_connection').doc('admin_test');
    await testDocRef.set({
      message: 'Admin SDK connection test',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      testId: 'admin_test_' + Date.now()
    });
    
    const testDoc = await testDocRef.get();
    if (testDoc.exists) {
      logTest('Firestore Admin Connection', true, 'Successfully connected and wrote test document');
      
      // Clean up test document
      await testDocRef.delete();
      logTest('Test Document Cleanup', true, 'Test document deleted');
    } else {
      logTest('Firestore Admin Connection', false, 'Test document not found after creation');
    }
    
    return true;
  } catch (error) {
    logTest('Firestore Admin Connection', false, error.message);
    return false;
  }
}

// Test 2: User Data Operations
async function testUserDataOperations() {
  console.log('\n👤 Testing User Data Operations...');
  
  try {
    const testUserId = 'test_user_' + Date.now();
    const userRef = db.collection('users').doc(testUserId);
    
    // Create user document
    const userData = {
      uid: testUserId,
      email: 'test@auraos-test.com',
      displayName: 'Test User',
      emailVerified: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en',
      },
      loginCount: 0,
      isActive: true
    };

    await userRef.set(userData);
    logTest('User Document Creation', true, `Created user document: ${testUserId}`);

    // Read user document
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      const retrievedData = userDoc.data();
      const dataMatches = 
        retrievedData.uid === testUserId &&
        retrievedData.email === 'test@auraos-test.com' &&
        retrievedData.displayName === 'Test User';
      
      logTest('User Document Retrieval', dataMatches, dataMatches ? 'Data matches stored values' : 'Data mismatch');
    } else {
      logTest('User Document Retrieval', false, 'User document not found');
    }

    // Update user document
    await userRef.update({
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      loginCount: admin.firestore.FieldValue.increment(1),
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en',
      }
    });
    logTest('User Document Update', true, 'User document updated successfully');

    // Verify update
    const updatedDoc = await userRef.get();
    if (updatedDoc.exists) {
      const updatedData = updatedDoc.data();
      const updateValid = updatedData.loginCount === 1 && updatedData.preferences.theme === 'dark';
      logTest('User Document Update Verification', updateValid, updateValid ? 'Update verified' : 'Update verification failed');
    }

    // Clean up
    await userRef.delete();
    logTest('User Document Cleanup', true, 'User document deleted');

    return testUserId;
  } catch (error) {
    logTest('User Data Operations', false, error.message);
    return null;
  }
}

// Test 3: Collection Structure Analysis
async function testCollectionStructure() {
  console.log('\n📊 Testing Collection Structure...');
  
  try {
    const collections = [
      'users',
      'posts', 
      'workflows',
      'agents',
      'chatMessages',
      'ai_tools',
      'ai_agents',
      'user_history',
      'user_sessions',
      'user_analytics'
    ];

    const collectionData = {};
    let existingCollections = 0;

    for (const collectionName of collections) {
      try {
        const collectionRef = db.collection(collectionName);
        const snapshot = await collectionRef.limit(1).get();
        
        collectionData[collectionName] = {
          exists: true,
          accessible: true,
          hasDocuments: !snapshot.empty
        };
        
        existingCollections++;
        logTest(`Collection ${collectionName}`, true, `Collection exists and is accessible`);
      } catch (error) {
        collectionData[collectionName] = {
          exists: false,
          accessible: false,
          error: error.message
        };
        logTest(`Collection ${collectionName}`, false, error.message);
      }
    }

    logTest('Collection Structure Analysis', existingCollections > 0, 
      `Found ${existingCollections}/${collections.length} accessible collections`);

    return collectionData;
  } catch (error) {
    logTest('Collection Structure Analysis', false, error.message);
    return {};
  }
}

// Test 4: Data Creation and Relationships
async function testDataCreationAndRelationships() {
  console.log('\n📝 Testing Data Creation and Relationships...');
  
  try {
    const testUserId = 'test_user_' + Date.now();
    const testData = {};

    // Create user document
    const userRef = db.collection('users').doc(testUserId);
    await userRef.set({
      uid: testUserId,
      email: 'test@auraos-test.com',
      displayName: 'Test User',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true
    });
    testData.userId = testUserId;
    logTest('User Creation', true, `Created user: ${testUserId}`);

    // Create post document
    const postRef = db.collection('posts').doc();
    await postRef.set({
      title: 'Test Post',
      content: 'This is a test post for data integrity testing',
      userId: testUserId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      tags: ['test', 'data-integrity'],
      likes: 0,
      comments: 0,
    });
    testData.postId = postRef.id;
    logTest('Post Creation', true, `Created post: ${postRef.id}`);

    // Create workflow document
    const workflowRef = db.collection('workflows').doc();
    await workflowRef.set({
      name: 'Test Workflow',
      description: 'A test workflow for data integrity',
      userId: testUserId,
      steps: [
        { id: 'step1', name: 'Start', type: 'trigger' },
        { id: 'step2', name: 'Process', type: 'action' },
        { id: 'step3', name: 'End', type: 'output' }
      ],
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    testData.workflowId = workflowRef.id;
    logTest('Workflow Creation', true, `Created workflow: ${workflowRef.id}`);

    // Create agent document
    const agentRef = db.collection('agents').doc();
    await agentRef.set({
      name: 'Test Agent',
      description: 'A test AI agent',
      userId: testUserId,
      type: 'assistant',
      capabilities: ['chat', 'analysis', 'automation'],
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    testData.agentId = agentRef.id;
    logTest('Agent Creation', true, `Created agent: ${agentRef.id}`);

    // Create chat message document
    const messageRef = db.collection('chatMessages').doc();
    await messageRef.set({
      userId: testUserId,
      agentId: agentRef.id,
      message: 'Hello, this is a test message',
      type: 'user',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      metadata: {
        sessionId: 'test-session',
        context: 'test-context'
      }
    });
    testData.messageId = messageRef.id;
    logTest('Chat Message Creation', true, `Created message: ${messageRef.id}`);

    // Test data relationships
    const userPostsQuery = db.collection('posts').where('userId', '==', testUserId);
    const userPostsSnapshot = await userPostsQuery.get();
    logTest('User-Posts Relationship', userPostsSnapshot.size > 0, 
      `Found ${userPostsSnapshot.size} posts for user ${testUserId}`);

    const userWorkflowsQuery = db.collection('workflows').where('userId', '==', testUserId);
    const userWorkflowsSnapshot = await userWorkflowsQuery.get();
    logTest('User-Workflows Relationship', userWorkflowsSnapshot.size > 0, 
      `Found ${userWorkflowsSnapshot.size} workflows for user ${testUserId}`);

    const userAgentsQuery = db.collection('agents').where('userId', '==', testUserId);
    const userAgentsSnapshot = await userAgentsQuery.get();
    logTest('User-Agents Relationship', userAgentsSnapshot.size > 0, 
      `Found ${userAgentsSnapshot.size} agents for user ${testUserId}`);

    const agentMessagesQuery = db.collection('chatMessages').where('agentId', '==', agentRef.id);
    const agentMessagesSnapshot = await agentMessagesQuery.get();
    logTest('Agent-Messages Relationship', agentMessagesSnapshot.size > 0, 
      `Found ${agentMessagesSnapshot.size} messages for agent ${agentRef.id}`);

    return testData;
  } catch (error) {
    logTest('Data Creation and Relationships', false, error.message);
    return null;
  }
}

// Test 5: Data Persistence and Recovery
async function testDataPersistence(testData) {
  console.log('\n💾 Testing Data Persistence and Recovery...');
  
  try {
    if (!testData) {
      logTest('Data Persistence', false, 'No test data provided');
      return false;
    }

    // Wait a moment to ensure data is persisted
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test user data persistence
    const userRef = db.collection('users').doc(testData.userId);
    const userDoc = await userRef.get();
    const userPersisted = userDoc.exists && userDoc.data().uid === testData.userId;
    logTest('User Data Persistence', userPersisted, userPersisted ? 'User data persisted correctly' : 'User data persistence issue');

    // Test post data persistence
    const postRef = db.collection('posts').doc(testData.postId);
    const postDoc = await postRef.get();
    const postPersisted = postDoc.exists && postDoc.data().userId === testData.userId;
    logTest('Post Data Persistence', postPersisted, postPersisted ? 'Post data persisted correctly' : 'Post data persistence issue');

    // Test workflow data persistence
    const workflowRef = db.collection('workflows').doc(testData.workflowId);
    const workflowDoc = await workflowRef.get();
    const workflowPersisted = workflowDoc.exists && workflowDoc.data().userId === testData.userId;
    logTest('Workflow Data Persistence', workflowPersisted, workflowPersisted ? 'Workflow data persisted correctly' : 'Workflow data persistence issue');

    // Test agent data persistence
    const agentRef = db.collection('agents').doc(testData.agentId);
    const agentDoc = await agentRef.get();
    const agentPersisted = agentDoc.exists && agentDoc.data().userId === testData.userId;
    logTest('Agent Data Persistence', agentPersisted, agentPersisted ? 'Agent data persisted correctly' : 'Agent data persistence issue');

    // Test message data persistence
    const messageRef = db.collection('chatMessages').doc(testData.messageId);
    const messageDoc = await messageRef.get();
    const messagePersisted = messageDoc.exists && messageDoc.data().userId === testData.userId;
    logTest('Message Data Persistence', messagePersisted, messagePersisted ? 'Message data persisted correctly' : 'Message data persistence issue');

    return true;
  } catch (error) {
    logTest('Data Persistence', false, error.message);
    return false;
  }
}

// Test 6: Query Operations
async function testQueryOperations(testData) {
  console.log('\n🔍 Testing Query Operations...');
  
  try {
    if (!testData) {
      logTest('Query Operations', false, 'No test data provided');
      return false;
    }

    // Test basic query
    const postsQuery = db.collection('posts').where('userId', '==', testData.userId);
    const postsSnapshot = await postsQuery.get();
    logTest('Basic Query', postsSnapshot.size > 0, `Found ${postsSnapshot.size} posts for user`);

    // Test limit query
    const limitedQuery = db.collection('posts').where('userId', '==', testData.userId).limit(1);
    const limitedSnapshot = await limitedQuery.get();
    logTest('Limit Query', limitedSnapshot.size <= 1, `Limited query returned ${limitedSnapshot.size} documents`);

    // Test order by query
    const orderedQuery = db.collection('posts').where('userId', '==', testData.userId).orderBy('createdAt', 'desc');
    const orderedSnapshot = await orderedQuery.get();
    logTest('Order By Query', orderedSnapshot.size > 0, `Ordered query returned ${orderedSnapshot.size} documents`);

    // Test compound query
    const compoundQuery = db.collection('posts')
      .where('userId', '==', testData.userId)
      .where('likes', '>=', 0)
      .orderBy('createdAt', 'desc')
      .limit(5);
    const compoundSnapshot = await compoundQuery.get();
    logTest('Compound Query', compoundSnapshot.size >= 0, `Compound query returned ${compoundSnapshot.size} documents`);

    return true;
  } catch (error) {
    logTest('Query Operations', false, error.message);
    return false;
  }
}

// Test 7: Batch Operations
async function testBatchOperations(testData) {
  console.log('\n📦 Testing Batch Operations...');
  
  try {
    if (!testData) {
      logTest('Batch Operations', false, 'No test data provided');
      return false;
    }

    const batch = db.batch();
    const batchTestData = [];

    // Create multiple documents in a batch
    for (let i = 0; i < 3; i++) {
      const docRef = db.collection('test_batch').doc();
      batch.set(docRef, {
        userId: testData.userId,
        batchIndex: i,
        message: `Batch test document ${i}`,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        testType: 'batch_operation'
      });
      batchTestData.push(docRef.id);
    }

    await batch.commit();
    logTest('Batch Write', true, `Created ${batchTestData.length} documents in batch`);

    // Verify batch operations
    const batchQuery = db.collection('test_batch').where('userId', '==', testData.userId);
    const batchSnapshot = await batchQuery.get();
    const batchVerified = batchSnapshot.size === batchTestData.length;
    logTest('Batch Verification', batchVerified, 
      `Expected ${batchTestData.length}, found ${batchSnapshot.size}`);

    // Clean up batch test data
    const deleteBatch = db.batch();
    batchSnapshot.docs.forEach(doc => {
      deleteBatch.delete(doc.ref);
    });
    await deleteBatch.commit();
    logTest('Batch Cleanup', true, 'Batch test data cleaned up');

    return true;
  } catch (error) {
    logTest('Batch Operations', false, error.message);
    return false;
  }
}

// Cleanup function
async function cleanupTestData(testData) {
  console.log('\n🧹 Cleaning up test data...');
  
  try {
    if (!testData) {
      logTest('Cleanup', false, 'No test data to clean up');
      return false;
    }

    // Delete user posts
    const userPostsQuery = db.collection('posts').where('userId', '==', testData.userId);
    const userPostsSnapshot = await userPostsQuery.get();
    
    const deleteBatch = db.batch();
    userPostsSnapshot.docs.forEach(doc => {
      deleteBatch.delete(doc.ref);
    });
    
    if (userPostsSnapshot.size > 0) {
      await deleteBatch.commit();
      logTest('Posts Cleanup', true, `Deleted ${userPostsSnapshot.size} posts`);
    }

    // Delete user workflows
    const userWorkflowsQuery = db.collection('workflows').where('userId', '==', testData.userId);
    const userWorkflowsSnapshot = await userWorkflowsQuery.get();
    
    const workflowDeleteBatch = db.batch();
    userWorkflowsSnapshot.docs.forEach(doc => {
      workflowDeleteBatch.delete(doc.ref);
    });
    
    if (userWorkflowsSnapshot.size > 0) {
      await workflowDeleteBatch.commit();
      logTest('Workflows Cleanup', true, `Deleted ${userWorkflowsSnapshot.size} workflows`);
    }

    // Delete user agents
    const userAgentsQuery = db.collection('agents').where('userId', '==', testData.userId);
    const userAgentsSnapshot = await userAgentsQuery.get();
    
    const agentDeleteBatch = db.batch();
    userAgentsSnapshot.docs.forEach(doc => {
      agentDeleteBatch.delete(doc.ref);
    });
    
    if (userAgentsSnapshot.size > 0) {
      await agentDeleteBatch.commit();
      logTest('Agents Cleanup', true, `Deleted ${userAgentsSnapshot.size} agents`);
    }

    // Delete user chat messages
    const userMessagesQuery = db.collection('chatMessages').where('userId', '==', testData.userId);
    const userMessagesSnapshot = await userMessagesQuery.get();
    
    const messageDeleteBatch = db.batch();
    userMessagesSnapshot.docs.forEach(doc => {
      messageDeleteBatch.delete(doc.ref);
    });
    
    if (userMessagesSnapshot.size > 0) {
      await messageDeleteBatch.commit();
      logTest('Messages Cleanup', true, `Deleted ${userMessagesSnapshot.size} messages`);
    }

    // Delete user document
    const userRef = db.collection('users').doc(testData.userId);
    await userRef.delete();
    logTest('User Document Cleanup', true, 'User document deleted');

    return true;
  } catch (error) {
    logTest('Cleanup', false, error.message);
    return false;
  }
}

// Generate comprehensive test report
function generateTestReport(collectionData) {
  console.log('\n📊 COMPREHENSIVE FIRESTORE ADMIN SDK TEST REPORT');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed} (${((testResults.passed / testResults.total) * 100).toFixed(1)}%)`);
  console.log(`Failed: ${testResults.failed} (${((testResults.failed / testResults.total) * 100).toFixed(1)}%)`);
  console.log('='.repeat(60));
  
  console.log('\n📋 DETAILED RESULTS:');
  testResults.details.forEach((result, index) => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${index + 1}. ${status} - ${result.testName}`);
    if (result.message) {
      console.log(`   ${result.message}`);
    }
  });

  console.log('\n📊 COLLECTION ANALYSIS:');
  Object.entries(collectionData).forEach(([collectionName, data]) => {
    if (data.accessible) {
      console.log(`✅ ${collectionName}: Accessible`);
    } else {
      console.log(`❌ ${collectionName}: ${data.error}`);
    }
  });

  console.log('\n🎯 SUMMARY:');
  if (testResults.failed === 0) {
    console.log('🎉 ALL TESTS PASSED! Firestore user data storage is working correctly with Admin SDK.');
    console.log('✅ Firestore Admin connection: WORKING');
    console.log('✅ User data operations: WORKING');
    console.log('✅ Collection structure: WORKING');
    console.log('✅ Data creation and relationships: WORKING');
    console.log('✅ Data persistence and recovery: WORKING');
    console.log('✅ Query operations: WORKING');
    console.log('✅ Batch operations: WORKING');
  } else {
    console.log('⚠️  SOME TESTS FAILED. Please review the failed tests above.');
    console.log('🔧 Recommendations:');
    console.log('   1. Check Firebase Admin SDK configuration');
    console.log('   2. Verify service account permissions');
    console.log('   3. Ensure Firestore is enabled in Firebase console');
    console.log('   4. Check network connectivity');
  }

  return {
    success: testResults.failed === 0,
    total: testResults.total,
    passed: testResults.passed,
    failed: testResults.failed,
    details: testResults.details,
    collectionData
  };
}

// Main test execution function
async function runAllTests() {
  console.log('🚀 Starting Firebase Admin SDK User Data Tests...');
  console.log('='.repeat(60));
  
  const startTime = Date.now();
  
  try {
    // Initialize Firebase Admin
    const initialized = await initializeFirebaseAdmin();
    if (!initialized) {
      throw new Error('Firebase Admin initialization failed');
    }

    // Run all tests
    await testFirestoreConnection();
    await testUserDataOperations();
    const collectionData = await testCollectionStructure();
    const testData = await testDataCreationAndRelationships();
    await testDataPersistence(testData);
    await testQueryOperations(testData);
    await testBatchOperations(testData);

    // Cleanup test data
    if (testData) {
      await cleanupTestData(testData);
    }

    // Generate report
    const report = generateTestReport(collectionData);
    
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
  initializeFirebaseAdmin,
  testFirestoreConnection,
  testUserDataOperations,
  testCollectionStructure,
  testDataCreationAndRelationships,
  testDataPersistence,
  testQueryOperations,
  testBatchOperations,
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
