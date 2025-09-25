#!/usr/bin/env node

/**
 * Firestore Data Structure and Read Operations Test
 * Tests existing data and read operations without authentication
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, getDoc, query, where, orderBy, limit } = require('firebase/firestore');

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
let db;

async function initializeFirebase() {
  try {
    console.log('🔧 Initializing Firebase...');
    
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);

    console.log('✅ Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    return false;
  }
}

// Test 1: Firestore Connection
async function testFirestoreConnection() {
  console.log('\n🔗 Testing Firestore Connection...');
  
  try {
    // Test basic connection by trying to read a collection
    const testCollection = collection(db, 'test_connection');
    const snapshot = await getDocs(testCollection);
    
    logTest('Firestore Connection', true, `Connected successfully, found ${snapshot.size} documents in test collection`);
    return true;
  } catch (error) {
    logTest('Firestore Connection', false, error.message);
    return false;
  }
}

// Test 2: Collection Structure Analysis
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

    for (const collectionName of collections) {
      try {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        
        collectionData[collectionName] = {
          exists: true,
          documentCount: snapshot.size,
          documents: snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
          }))
        };
        
        logTest(`Collection ${collectionName}`, true, `Found ${snapshot.size} documents`);
      } catch (error) {
        collectionData[collectionName] = {
          exists: false,
          error: error.message
        };
        logTest(`Collection ${collectionName}`, false, error.message);
      }
    }

    return collectionData;
  } catch (error) {
    logTest('Collection Structure Analysis', false, error.message);
    return {};
  }
}

// Test 3: Data Schema Validation
async function testDataSchemaValidation(collectionData) {
  console.log('\n🔍 Testing Data Schema Validation...');
  
  try {
    let schemaTestsPassed = 0;
    let schemaTestsTotal = 0;

    // Test users collection schema
    if (collectionData.users && collectionData.users.exists && collectionData.users.documents.length > 0) {
      schemaTestsTotal++;
      const userDoc = collectionData.users.documents[0];
      const userSchema = {
        uid: 'string',
        email: 'string',
        displayName: 'string',
        createdAt: 'object',
        preferences: 'object'
      };

      const userSchemaValid = Object.keys(userSchema).every(key => 
        userDoc.data.hasOwnProperty(key) && 
        typeof userDoc.data[key] === userSchema[key].replace('object', 'object')
      );

      if (userSchemaValid) {
        schemaTestsPassed++;
        logTest('Users Schema Validation', true, 'User document schema is valid');
      } else {
        logTest('Users Schema Validation', false, 'User document schema is invalid');
      }
    }

    // Test posts collection schema
    if (collectionData.posts && collectionData.posts.exists && collectionData.posts.documents.length > 0) {
      schemaTestsTotal++;
      const postDoc = collectionData.posts.documents[0];
      const postSchema = {
        title: 'string',
        content: 'string',
        userId: 'string',
        createdAt: 'object',
        tags: 'object'
      };

      const postSchemaValid = Object.keys(postSchema).every(key => 
        postDoc.data.hasOwnProperty(key)
      );

      if (postSchemaValid) {
        schemaTestsPassed++;
        logTest('Posts Schema Validation', true, 'Post document schema is valid');
      } else {
        logTest('Posts Schema Validation', false, 'Post document schema is invalid');
      }
    }

    // Test workflows collection schema
    if (collectionData.workflows && collectionData.workflows.exists && collectionData.workflows.documents.length > 0) {
      schemaTestsTotal++;
      const workflowDoc = collectionData.workflows.documents[0];
      const workflowSchema = {
        name: 'string',
        description: 'string',
        userId: 'string',
        steps: 'object',
        isActive: 'boolean'
      };

      const workflowSchemaValid = Object.keys(workflowSchema).every(key => 
        workflowDoc.data.hasOwnProperty(key)
      );

      if (workflowSchemaValid) {
        schemaTestsPassed++;
        logTest('Workflows Schema Validation', true, 'Workflow document schema is valid');
      } else {
        logTest('Workflows Schema Validation', false, 'Workflow document schema is invalid');
      }
    }

    // Test agents collection schema
    if (collectionData.agents && collectionData.agents.exists && collectionData.agents.documents.length > 0) {
      schemaTestsTotal++;
      const agentDoc = collectionData.agents.documents[0];
      const agentSchema = {
        name: 'string',
        description: 'string',
        userId: 'string',
        type: 'string',
        capabilities: 'object',
        isActive: 'boolean'
      };

      const agentSchemaValid = Object.keys(agentSchema).every(key => 
        agentDoc.data.hasOwnProperty(key)
      );

      if (agentSchemaValid) {
        schemaTestsPassed++;
        logTest('Agents Schema Validation', true, 'Agent document schema is valid');
      } else {
        logTest('Agents Schema Validation', false, 'Agent document schema is invalid');
      }
    }

    // Test chatMessages collection schema
    if (collectionData.chatMessages && collectionData.chatMessages.exists && collectionData.chatMessages.documents.length > 0) {
      schemaTestsTotal++;
      const messageDoc = collectionData.chatMessages.documents[0];
      const messageSchema = {
        userId: 'string',
        agentId: 'string',
        message: 'string',
        type: 'string',
        timestamp: 'object'
      };

      const messageSchemaValid = Object.keys(messageSchema).every(key => 
        messageDoc.data.hasOwnProperty(key)
      );

      if (messageSchemaValid) {
        schemaTestsPassed++;
        logTest('Chat Messages Schema Validation', true, 'Chat message document schema is valid');
      } else {
        logTest('Chat Messages Schema Validation', false, 'Chat message document schema is invalid');
      }
    }

    const schemaSuccessRate = schemaTestsTotal > 0 ? (schemaTestsPassed / schemaTestsTotal) * 100 : 0;
    logTest('Overall Schema Validation', schemaSuccessRate >= 80, 
      `${schemaTestsPassed}/${schemaTestsTotal} schemas valid (${schemaSuccessRate.toFixed(1)}%)`);

    return { schemaTestsPassed, schemaTestsTotal, schemaSuccessRate };
  } catch (error) {
    logTest('Data Schema Validation', false, error.message);
    return { schemaTestsPassed: 0, schemaTestsTotal: 0, schemaSuccessRate: 0 };
  }
}

// Test 4: Query Operations
async function testQueryOperations() {
  console.log('\n🔍 Testing Query Operations...');
  
  try {
    let queryTestsPassed = 0;
    let queryTestsTotal = 0;

    // Test basic collection query
    try {
      queryTestsTotal++;
      const postsCollection = collection(db, 'posts');
      const postsSnapshot = await getDocs(postsCollection);
      queryTestsPassed++;
      logTest('Basic Collection Query', true, `Retrieved ${postsSnapshot.size} posts`);
    } catch (error) {
      logTest('Basic Collection Query', false, error.message);
    }

    // Test limit query
    try {
      queryTestsTotal++;
      const postsCollection = collection(db, 'posts');
      const limitedQuery = query(postsCollection, limit(5));
      const limitedSnapshot = await getDocs(limitedQuery);
      queryTestsPassed++;
      logTest('Limit Query', true, `Retrieved ${limitedSnapshot.size} posts (limited to 5)`);
    } catch (error) {
      logTest('Limit Query', false, error.message);
    }

    // Test order by query
    try {
      queryTestsTotal++;
      const postsCollection = collection(db, 'posts');
      const orderedQuery = query(postsCollection, orderBy('createdAt', 'desc'), limit(3));
      const orderedSnapshot = await getDocs(orderedQuery);
      queryTestsPassed++;
      logTest('Order By Query', true, `Retrieved ${orderedSnapshot.size} posts ordered by createdAt`);
    } catch (error) {
      logTest('Order By Query', false, error.message);
    }

    // Test where query (if there are documents with userId)
    try {
      queryTestsTotal++;
      const postsCollection = collection(db, 'posts');
      const whereQuery = query(postsCollection, where('userId', '!=', ''), limit(3));
      const whereSnapshot = await getDocs(whereQuery);
      queryTestsPassed++;
      logTest('Where Query', true, `Retrieved ${whereSnapshot.size} posts with userId filter`);
    } catch (error) {
      logTest('Where Query', false, error.message);
    }

    const querySuccessRate = queryTestsTotal > 0 ? (queryTestsPassed / queryTestsTotal) * 100 : 0;
    logTest('Overall Query Operations', querySuccessRate >= 75, 
      `${queryTestsPassed}/${queryTestsTotal} queries successful (${querySuccessRate.toFixed(1)}%)`);

    return { queryTestsPassed, queryTestsTotal, querySuccessRate };
  } catch (error) {
    logTest('Query Operations', false, error.message);
    return { queryTestsPassed: 0, queryTestsTotal: 0, querySuccessRate: 0 };
  }
}

// Test 5: Data Relationships
async function testDataRelationships() {
  console.log('\n🔗 Testing Data Relationships...');
  
  try {
    let relationshipTestsPassed = 0;
    let relationshipTestsTotal = 0;

    // Test user-posts relationship
    try {
      relationshipTestsTotal++;
      const postsCollection = collection(db, 'posts');
      const postsSnapshot = await getDocs(postsCollection);
      
      let validUserPosts = 0;
      postsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.userId && typeof data.userId === 'string' && data.userId.length > 0) {
          validUserPosts++;
        }
      });

      const userPostsValid = validUserPosts > 0;
      if (userPostsValid) {
        relationshipTestsPassed++;
        logTest('User-Posts Relationship', true, `Found ${validUserPosts} posts with valid userId`);
      } else {
        logTest('User-Posts Relationship', false, 'No posts with valid userId found');
      }
    } catch (error) {
      logTest('User-Posts Relationship', false, error.message);
    }

    // Test user-workflows relationship
    try {
      relationshipTestsTotal++;
      const workflowsCollection = collection(db, 'workflows');
      const workflowsSnapshot = await getDocs(workflowsCollection);
      
      let validUserWorkflows = 0;
      workflowsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.userId && typeof data.userId === 'string' && data.userId.length > 0) {
          validUserWorkflows++;
        }
      });

      const userWorkflowsValid = validUserWorkflows > 0;
      if (userWorkflowsValid) {
        relationshipTestsPassed++;
        logTest('User-Workflows Relationship', true, `Found ${validUserWorkflows} workflows with valid userId`);
      } else {
        logTest('User-Workflows Relationship', false, 'No workflows with valid userId found');
      }
    } catch (error) {
      logTest('User-Workflows Relationship', false, error.message);
    }

    // Test user-agents relationship
    try {
      relationshipTestsTotal++;
      const agentsCollection = collection(db, 'agents');
      const agentsSnapshot = await getDocs(agentsCollection);
      
      let validUserAgents = 0;
      agentsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.userId && typeof data.userId === 'string' && data.userId.length > 0) {
          validUserAgents++;
        }
      });

      const userAgentsValid = validUserAgents > 0;
      if (userAgentsValid) {
        relationshipTestsPassed++;
        logTest('User-Agents Relationship', true, `Found ${validUserAgents} agents with valid userId`);
      } else {
        logTest('User-Agents Relationship', false, 'No agents with valid userId found');
      }
    } catch (error) {
      logTest('User-Agents Relationship', false, error.message);
    }

    // Test agent-messages relationship
    try {
      relationshipTestsTotal++;
      const messagesCollection = collection(db, 'chatMessages');
      const messagesSnapshot = await getDocs(messagesCollection);
      
      let validAgentMessages = 0;
      messagesSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.agentId && typeof data.agentId === 'string' && data.agentId.length > 0) {
          validAgentMessages++;
        }
      });

      const agentMessagesValid = validAgentMessages > 0;
      if (agentMessagesValid) {
        relationshipTestsPassed++;
        logTest('Agent-Messages Relationship', true, `Found ${validAgentMessages} messages with valid agentId`);
      } else {
        logTest('Agent-Messages Relationship', false, 'No messages with valid agentId found');
      }
    } catch (error) {
      logTest('Agent-Messages Relationship', false, error.message);
    }

    const relationshipSuccessRate = relationshipTestsTotal > 0 ? (relationshipTestsPassed / relationshipTestsTotal) * 100 : 0;
    logTest('Overall Data Relationships', relationshipSuccessRate >= 50, 
      `${relationshipTestsPassed}/${relationshipTestsTotal} relationships valid (${relationshipSuccessRate.toFixed(1)}%)`);

    return { relationshipTestsPassed, relationshipTestsTotal, relationshipSuccessRate };
  } catch (error) {
    logTest('Data Relationships', false, error.message);
    return { relationshipTestsPassed: 0, relationshipTestsTotal: 0, relationshipSuccessRate: 0 };
  }
}

// Test 6: Performance and Scalability
async function testPerformanceAndScalability() {
  console.log('\n⚡ Testing Performance and Scalability...');
  
  try {
    const startTime = Date.now();

    // Test bulk read performance
    const collections = ['posts', 'workflows', 'agents', 'chatMessages'];
    let totalDocuments = 0;
    let successfulReads = 0;

    for (const collectionName of collections) {
      try {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        totalDocuments += snapshot.size;
        successfulReads++;
      } catch (error) {
        console.log(`Failed to read ${collectionName}: ${error.message}`);
      }
    }

    const endTime = Date.now();
    const duration = endTime - startTime;
    const avgTimePerCollection = duration / collections.length;

    logTest('Bulk Read Performance', duration < 5000, 
      `Read ${successfulReads}/${collections.length} collections in ${duration}ms (avg: ${avgTimePerCollection.toFixed(2)}ms per collection)`);

    // Test query performance
    const queryStartTime = Date.now();
    try {
      const postsCollection = collection(db, 'posts');
      const queryRef = query(postsCollection, limit(10));
      const querySnapshot = await getDocs(queryRef);
      const queryDuration = Date.now() - queryStartTime;
      
      logTest('Query Performance', queryDuration < 2000, 
        `Query completed in ${queryDuration}ms, retrieved ${querySnapshot.size} documents`);
    } catch (error) {
      logTest('Query Performance', false, error.message);
    }

    return { totalDocuments, successfulReads, duration, avgTimePerCollection };
  } catch (error) {
    logTest('Performance and Scalability', false, error.message);
    return { totalDocuments: 0, successfulReads: 0, duration: 0, avgTimePerCollection: 0 };
  }
}

// Generate comprehensive test report
function generateTestReport(collectionData, schemaResults, queryResults, relationshipResults, performanceResults) {
  console.log('\n📊 COMPREHENSIVE FIRESTORE DATA TEST REPORT');
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
    if (data.exists) {
      console.log(`✅ ${collectionName}: ${data.documentCount} documents`);
    } else {
      console.log(`❌ ${collectionName}: ${data.error}`);
    }
  });

  console.log('\n🎯 SUMMARY:');
  if (testResults.failed === 0) {
    console.log('🎉 ALL TESTS PASSED! Firestore data structure and operations are working correctly.');
    console.log('✅ Firestore connection: WORKING');
    console.log('✅ Collection structure: WORKING');
    console.log('✅ Data schema validation: WORKING');
    console.log('✅ Query operations: WORKING');
    console.log('✅ Data relationships: WORKING');
    console.log('✅ Performance and scalability: WORKING');
  } else {
    console.log('⚠️  SOME TESTS FAILED. Please review the failed tests above.');
    console.log('🔧 Recommendations:');
    console.log('   1. Check Firebase project configuration');
    console.log('   2. Verify Firestore security rules');
    console.log('   3. Ensure collections exist and have proper structure');
    console.log('   4. Check network connectivity');
  }

  return {
    success: testResults.failed === 0,
    total: testResults.total,
    passed: testResults.passed,
    failed: testResults.failed,
    details: testResults.details,
    collectionData,
    schemaResults,
    queryResults,
    relationshipResults,
    performanceResults
  };
}

// Main test execution function
async function runAllTests() {
  console.log('🚀 Starting Firestore Data Structure and Operations Tests...');
  console.log('='.repeat(70));
  
  const startTime = Date.now();
  
  try {
    // Initialize Firebase
    const initialized = await initializeFirebase();
    if (!initialized) {
      throw new Error('Firebase initialization failed');
    }

    // Run all tests
    await testFirestoreConnection();
    const collectionData = await testCollectionStructure();
    const schemaResults = await testDataSchemaValidation(collectionData);
    const queryResults = await testQueryOperations();
    const relationshipResults = await testDataRelationships();
    const performanceResults = await testPerformanceAndScalability();

    // Generate report
    const report = generateTestReport(collectionData, schemaResults, queryResults, relationshipResults, performanceResults);
    
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
  testFirestoreConnection,
  testCollectionStructure,
  testDataSchemaValidation,
  testQueryOperations,
  testDataRelationships,
  testPerformanceAndScalability,
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
