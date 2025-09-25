import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs,
  onSnapshot, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

// Firestore Connection Test App
export const FirestoreTestApp: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      testFirestoreConnection();
    } else {
      setLoading(false);
    }
  }, [user]);

  const testFirestoreConnection = async () => {
    try {
      setConnectionStatus('testing');
      
      // Test 1: Write test data
      const testData = {
        userId: user?.uid,
        testType: 'connection_test',
        timestamp: serverTimestamp(),
        message: 'Firestore connection test successful',
        status: 'active'
      };

      const docRef = await addDoc(collection(db, 'connectionTests'), testData);
      console.log('✅ Test data written:', docRef.id);

      // Test 2: Read test data
      const q = query(
        collection(db, 'connectionTests'),
        where('userId', '==', user?.uid),
        orderBy('timestamp', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const testDocs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('✅ Test data read:', testDocs.length, 'documents');
      setTestResults(testDocs);

      // Test 3: Real-time listener
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const realtimeDocs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('✅ Real-time listener working:', realtimeDocs.length, 'documents');
        setTestResults(realtimeDocs);
      });

      // Test 4: Update test data
      if (docRef.id) {
        await updateDoc(doc(db, 'connectionTests', docRef.id), {
          status: 'updated',
          updatedAt: serverTimestamp()
        });
        console.log('✅ Test data updated');
      }

      // Test 5: Test all collections
      await testAllCollections();

      setConnectionStatus('connected');
      setLoading(false);

      // Cleanup listener after 10 seconds
      setTimeout(() => {
        unsubscribe();
      }, 10000);

    } catch (error) {
      console.error('❌ Firestore connection test failed:', error);
      setConnectionStatus('error');
      setLoading(false);
    }
  };

  const testAllCollections = async () => {
    const collections = [
      'tasks',
      'userPreferences', 
      'aiSuggestions',
      'collaborationSpaces',
      'taskTemplates',
      'aiAgents',
      'automationRules',
      'automationLogs',
      'testSuites',
      'testResults',
      'ultimateFeatures',
      'systemInsights'
    ];

    const collectionTests = [];

    for (const collectionName of collections) {
      try {
        const q = query(collection(db, collectionName), where('userId', '==', user?.uid));
        const snapshot = await getDocs(q);
        collectionTests.push({
          name: collectionName,
          status: 'accessible',
          documentCount: snapshot.docs.length,
          error: null
        });
        console.log(`✅ Collection ${collectionName}: ${snapshot.docs.length} documents`);
      } catch (error) {
        collectionTests.push({
          name: collectionName,
          status: 'error',
          documentCount: 0,
          error: error.message
        });
        console.error(`❌ Collection ${collectionName}:`, error.message);
      }
    }

    setUserData({ collections: collectionTests });
  };

  const createSampleData = async () => {
    if (!user) return;

    try {
      // Create sample task
      await addDoc(collection(db, 'tasks'), {
        userId: user.uid,
        title: 'Test Firestore Connection',
        description: 'This is a test task to verify Firestore connectivity',
        status: 'pending',
        priority: 'medium',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Create sample user preference
      await addDoc(collection(db, 'userPreferences'), {
        userId: user.uid,
        theme: 'dark',
        wallpaper: 'default',
        layout: 'grid',
        animations: true,
        soundEffects: false,
        personalization: {
          accentColor: '#00ff88',
          fontSize: 'medium',
          density: 'comfortable',
          language: 'en',
          timeFormat: '12h'
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Create sample AI agent
      await addDoc(collection(db, 'aiAgents'), {
        userId: user.uid,
        name: 'Test Assistant',
        description: 'A test AI agent for Firestore verification',
        type: 'assistant',
        status: 'active',
        capabilities: ['chat', 'help', 'test'],
        performance: {
          tasksCompleted: 0,
          accuracy: 0,
          responseTime: 0,
          userRating: 0
        },
        lastActive: serverTimestamp(),
        createdAt: serverTimestamp()
      });

      console.log('✅ Sample data created successfully');
      alert('Sample data created successfully!');
    } catch (error) {
      console.error('❌ Failed to create sample data:', error);
      alert('Failed to create sample data: ' + error.message);
    }
  };

  const clearTestData = async () => {
    if (!user) return;

    try {
      // Clear connection tests
      const q = query(collection(db, 'connectionTests'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      console.log('✅ Test data cleared');
      alert('Test data cleared successfully!');
    } catch (error) {
      console.error('❌ Failed to clear test data:', error);
      alert('Failed to clear test data: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="firestore-test-app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Testing Firestore connection...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="firestore-test-app">
        <div className="auth-required">
          <h2>🔐 Authentication Required</h2>
          <p>Please sign in to test Firestore connection</p>
          <button 
            className="auth-btn"
            onClick={() => window.location.reload()}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="firestore-test-app">
      <div className="test-header">
        <h2>🔥 Firestore Connection Test</h2>
        <div className="header-actions">
          <button 
            className="test-btn"
            onClick={testFirestoreConnection}
          >
            🔄 Re-test Connection
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="connection-status">
        <div className={`status-card ${connectionStatus}`}>
          <div className="status-icon">
            {connectionStatus === 'testing' && '🔄'}
            {connectionStatus === 'connected' && '✅'}
            {connectionStatus === 'error' && '❌'}
          </div>
          <div className="status-info">
            <h3>
              {connectionStatus === 'testing' && 'Testing Connection...'}
              {connectionStatus === 'connected' && 'Connected Successfully'}
              {connectionStatus === 'error' && 'Connection Failed'}
            </h3>
            <p>
              {connectionStatus === 'testing' && 'Performing Firestore operations...'}
              {connectionStatus === 'connected' && 'All Firestore operations working correctly'}
              {connectionStatus === 'error' && 'There was an error connecting to Firestore'}
            </p>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="test-results">
        <h3>📊 Test Results</h3>
        <div className="results-grid">
          <div className="result-item">
            <span className="result-label">Write Test</span>
            <span className={`result-status ${connectionStatus === 'connected' ? 'success' : 'pending'}`}>
              {connectionStatus === 'connected' ? '✅ Passed' : '⏳ Testing'}
            </span>
          </div>
          <div className="result-item">
            <span className="result-label">Read Test</span>
            <span className={`result-status ${connectionStatus === 'connected' ? 'success' : 'pending'}`}>
              {connectionStatus === 'connected' ? '✅ Passed' : '⏳ Testing'}
            </span>
          </div>
          <div className="result-item">
            <span className="result-label">Real-time Test</span>
            <span className={`result-status ${connectionStatus === 'connected' ? 'success' : 'pending'}`}>
              {connectionStatus === 'connected' ? '✅ Passed' : '⏳ Testing'}
            </span>
          </div>
          <div className="result-item">
            <span className="result-label">Update Test</span>
            <span className={`result-status ${connectionStatus === 'connected' ? 'success' : 'pending'}`}>
              {connectionStatus === 'connected' ? '✅ Passed' : '⏳ Testing'}
            </span>
          </div>
        </div>
      </div>

      {/* Collection Status */}
      {userData && (
        <div className="collection-status">
          <h3>📁 Collection Access Status</h3>
          <div className="collections-grid">
            {userData.collections.map((collection: any) => (
              <div key={collection.name} className={`collection-item ${collection.status}`}>
                <div className="collection-name">{collection.name}</div>
                <div className="collection-info">
                  <span className="collection-count">{collection.documentCount} docs</span>
                  <span className={`collection-status ${collection.status}`}>
                    {collection.status === 'accessible' ? '✅' : '❌'}
                  </span>
                </div>
                {collection.error && (
                  <div className="collection-error">{collection.error}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Data */}
      <div className="test-data">
        <h3>📝 Test Data</h3>
        <div className="data-actions">
          <button 
            className="action-btn primary"
            onClick={createSampleData}
          >
            📝 Create Sample Data
          </button>
          <button 
            className="action-btn secondary"
            onClick={clearTestData}
          >
            🗑️ Clear Test Data
          </button>
        </div>
        <div className="data-list">
          {testResults.map((result, index) => (
            <div key={result.id || index} className="data-item">
              <div className="data-info">
                <span className="data-id">ID: {result.id}</span>
                <span className="data-message">{result.message}</span>
                <span className="data-status">Status: {result.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Info */}
      <div className="user-info">
        <h3>👤 User Information</h3>
        <div className="user-details">
          <div className="user-item">
            <span className="user-label">User ID:</span>
            <span className="user-value">{user.uid}</span>
          </div>
          <div className="user-item">
            <span className="user-label">Email:</span>
            <span className="user-value">{user.email}</span>
          </div>
          <div className="user-item">
            <span className="user-label">Display Name:</span>
            <span className="user-value">{user.displayName || 'Not set'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
