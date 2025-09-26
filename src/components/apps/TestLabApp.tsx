import { db } from '../../lib/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDocs,
  onSnapshot, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

interface TestSuite {
  id: string;
  name: string;
  description: string;
  type: 'unit' | 'integration' | 'e2e' | 'performance';
  status: 'running' | 'passed' | 'failed' | 'pending';
  tests: Array<{
    name: string;
    status: 'passed' | 'failed' | 'skipped';
    duration: number;
    error?: string;
  }>;
  coverage: number;
  lastRun: Date | null;
  createdAt: Date;
}

interface TestResult {
  id: string;
  suiteId: string;
  suiteName: string;
  status: 'passed' | 'failed';
  duration: number;
  testsPassed: number;
  testsFailed: number;
  testsSkipped: number;
  coverage: number;
  timestamp: Date;
  error?: string;
}

export const TestLabApp: React.FC = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('suites');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set());
  const [newSuite, setNewSuite] = useState({
    name: '',
    description: '',
    type: 'unit' as 'unit' | 'integration' | 'e2e' | 'performance'
  });
  const { user } = useAuth();

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    if (user) {
      loadTestData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadTestData = () => {
    if (!user) return;
    
    // Load test suites
    const suitesRef = collection(db, 'testSuites');
    const suitesQuery = query(suitesRef, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    
    const unsubscribeSuites = onSnapshot(suitesQuery, (snapshot) => {
      const suitesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastRun: doc.data().lastRun?.toDate(),
        createdAt: doc.data().createdAt?.toDate()
      })) as TestSuite[];
      setTestSuites(suitesData);
    }, (error) => {
      console.error('Failed to load test suites:', error);
    });

    // Load test results
    const resultsRef = collection(db, 'testResults');
    const resultsQuery = query(resultsRef, where('userId', '==', user.uid), orderBy('timestamp', 'desc'));
    
    const unsubscribeResults = onSnapshot(resultsQuery, (snapshot) => {
      const resultsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      })) as TestResult[];
      setTestResults(resultsData);
      setLoading(false);
    }, (error) => {
      console.error('Failed to load test results:', error);
      setLoading(false);
    });

    return () => {
      unsubscribeSuites();
      unsubscribeResults();
    };
  };

  const createTestSuite = async () => {
    if (!newSuite.name.trim() || !user) return;

    try {
      const suiteData = {
        ...newSuite,
        userId: user.uid,
        status: 'pending',
        tests: [],
        coverage: 0,
        lastRun: null,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'testSuites'), suiteData);
      setShowCreateForm(false);
      setNewSuite({ name: '', description: '', type: 'unit' });
    } catch (error) {
      console.error('Failed to create test suite:', error);
    }
  };

  const runTestSuite = async (suiteId: string) => {
    if (!user) return;

    setRunningTests(prev => new Set(prev).add(suiteId));

    try {
      // Update suite status to running
      const suiteRef = doc(db, 'testSuites', suiteId);
      await updateDoc(suiteRef, {
        status: 'running',
        lastRun: serverTimestamp()
      });

      // Generate mock test results
      const mockTests = generateMockTests();
      const passedTests = mockTests.filter(t => t.status === 'passed').length;
      const failedTests = mockTests.filter(t => t.status === 'failed').length;
      const skippedTests = mockTests.filter(t => t.status === 'skipped').length;
      const coverage = Math.floor(Math.random() * 40) + 60; // 60-100%
      const duration = Math.floor(Math.random() * 5000) + 1000; // 1-6 seconds

      // Simulate test execution
      setTimeout(async () => {
        const suite = testSuites.find(s => s.id === suiteId);
        if (!suite) return;

        const finalStatus = failedTests > 0 ? 'failed' : 'passed';

        // Update suite with results
        await updateDoc(suiteRef, {
          status: finalStatus,
          tests: mockTests,
          coverage
        });

        // Create test result record
        const resultData = {
          suiteId: suite.id,
          suiteName: suite.name,
          status: finalStatus,
          duration,
          testsPassed: passedTests,
          testsFailed: failedTests,
          testsSkipped: skippedTests,
          coverage,
          timestamp: serverTimestamp(),
          userId: user.uid
        };

        await addDoc(collection(db, 'testResults'), resultData);

        setRunningTests(prev => {
          const newSet = new Set(prev);
          newSet.delete(suiteId);
          return newSet;
        });
      }, duration);
    } catch (error) {
      console.error('Failed to run test suite:', error);
      setRunningTests(prev => {
        const newSet = new Set(prev);
        newSet.delete(suiteId);
        return newSet;
      });
    }
  };

  const generateMockTests = () => {
    const testNames = [
      'User authentication test',
      'Data validation test',
      'API endpoint test',
      'Database connection test',
      'UI component test',
      'Performance test',
      'Security test',
      'Integration test'
    ];

    return testNames.map(name => ({
      name,
      status: Math.random() > 0.2 ? 'passed' : (Math.random() > 0.5 ? 'failed' : 'skipped'),
      duration: Math.floor(Math.random() * 1000) + 100,
      error: Math.random() > 0.8 ? 'Mock error message' : undefined
    }));
  };

  const deleteTestSuite = async (suiteId: string) => {
    try {
      await deleteDoc(doc(db, 'testSuites', suiteId));
    } catch (error) {
      console.error('Failed to delete test suite:', error);
    }
  };

  const getTestTypeIcon = (type: string) => {
    switch (type) {
      case 'unit': return '🧪';
      case 'integration': return '🔗';
      case 'e2e': return '🎯';
      case 'performance': return '⚡';
      default: return '🧪';
    }
  };

  const getTestTypeColor = (type: string) => {
    switch (type) {
      case 'unit': return 'blue';
      case 'integration': return 'green';
      case 'e2e': return 'purple';
      case 'performance': return 'orange';
      default: return 'blue';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-400 bg-green-900/20';
      case 'failed': return 'text-red-400 bg-red-900/20';
      case 'running': return 'text-yellow-400 bg-yellow-900/20';
      case 'pending': return 'text-gray-400 bg-gray-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getOverallStats = () => {
    const totalSuites = testSuites.length;
    const passedSuites = testSuites.filter(s => s.status === 'passed').length;
    const failedSuites = testSuites.filter(s => s.status === 'failed').length;
    const runningSuites = testSuites.filter(s => s.status === 'running').length;
    const avgCoverage = testSuites.length > 0 
      ? testSuites.reduce((sum, suite) => sum + suite.coverage, 0) / testSuites.length 
      : 0;

    return {
      totalSuites,
      passedSuites,
      failedSuites,
      runningSuites,
      avgCoverage
    };
  };

  if (loading) {
    return (
      <div className="test-lab-app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading test lab...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="test-lab-app">
        <div className="auth-required">
          <h2>🔐 Authentication Required</h2>
          <p>Please sign in to access test lab</p>
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

  const stats = getOverallStats();

  return (
    <div className="test-lab-app">
      <div className="test-lab-header">
        <h2>🧪 Test Lab</h2>
        <div className="header-actions">
          <button 
            className="create-suite-btn"
            onClick={() => setShowCreateForm(true)}
          >
            + New Test Suite
          </button>
        </div>
      </div>

      {/* Test Statistics */}
      <div className="test-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h4>Total Suites</h4>
            <span className="stat-value">{stats.totalSuites}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h4>Passed</h4>
            <span className="stat-value">{stats.passedSuites}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <h4>Failed</h4>
            <span className="stat-value">{stats.failedSuites}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-info">
            <h4>Running</h4>
            <span className="stat-value">{stats.runningSuites}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h4>Avg Coverage</h4>
            <span className="stat-value">{stats.avgCoverage.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'suites' ? 'active' : ''}`}
          onClick={() => setActiveTab('suites')}
        >
          🧪 Test Suites
        </button>
        <button 
          className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          📋 Test Results
        </button>
      </div>

      {/* Create Test Suite Form */}
      {showCreateForm && (
        <div className="create-suite-overlay">
          <div className="create-suite-form">
            <h3>Create Test Suite</h3>
            <input
              type="text"
              placeholder="Suite Name"
              value={newSuite.name}
              onChange={(e) => setNewSuite(prev => ({ ...prev, name: e.target.value }))}
            />
            <textarea aria-label="Text area"
              placeholder="Suite Description"
              value={newSuite.description}
              onChange={(e) => setNewSuite(prev => ({ ...prev, description: e.target.value }))}
            ></textarea>
            <select aria-label="Select option"
              value={newSuite.type}
              onChange={(e) => setNewSuite(prev => ({ ...prev, type: e.target.value as any }))}
            >
              <option value="unit">Unit Tests</option>
              <option value="integration">Integration Tests</option>
              <option value="e2e">End-to-End Tests</option>
              <option value="performance">Performance Tests</option>
            </select>
            <div className="form-actions">
              <button onClick={createTestSuite} className="submit-btn">Create Suite</button>
              <button onClick={() => setShowCreateForm(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Test Suites Tab */}
      {activeTab === 'suites' && (
        <div className="suites-section">
          <div className="suites-grid">
            {testSuites.map(suite => (
              <div key={suite.id} className="suite-card">
                <div className="suite-header">
                  <div className="suite-info">
                    <h4>{suite.name}</h4>
                    <p>{suite.description}</p>
                  </div>
                  <div className="suite-type">
                    <span className={`type-icon ${getTestTypeColor(suite.type)}`}>
                      {getTestTypeIcon(suite.type)}
                    </span>
                    <span className={`suite-status ${getStatusColor(suite.status)}`}>
                      {suite.status}
                    </span>
                  </div>
                </div>
                <div className="suite-details">
                  <div className="suite-stats">
                    <span>Tests: {suite.tests.length}</span>
                    <span>Coverage: {suite.coverage}%</span>
                    <span>Last Run: {suite.lastRun?.toLocaleDateString() || 'Never'}</span>
                  </div>
                  {suite.tests.length > 0 && (
                    <div className="test-results">
                      <div className="test-passed">✅ {suite.tests.filter(t => t.status === 'passed').length}</div>
                      <div className="test-failed">❌ {suite.tests.filter(t => t.status === 'failed').length}</div>
                      <div className="test-skipped">⏭️ {suite.tests.filter(t => t.status === 'skipped').length}</div>
                    </div>
                  )}
                </div>
                <div className="suite-actions">
                  <button 
                    onClick={() => runTestSuite(suite.id)}
                    className="action-btn primary"
                    disabled={runningTests.has(suite.id)}
                  >
                    {runningTests.has(suite.id) ? '🔄 Running...' : '▶️ Run Tests'}
                  </button>
                  <button 
                    onClick={() => deleteTestSuite(suite.id)}
                    className="action-btn danger"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Results Tab */}
      {activeTab === 'results' && (
        <div className="results-section">
          <div className="results-list">
            {testResults.map(result => (
              <div key={result.id} className="result-item">
                <div className="result-header">
                  <h4>{result.suiteName}</h4>
                  <span className={`result-status ${getStatusColor(result.status)}`}>
                    {result.status}
                  </span>
                </div>
                <div className="result-details">
                  <div className="result-stats">
                    <span>Duration: {result.duration}ms</span>
                    <span>Coverage: {result.coverage}%</span>
                    <span>{result.timestamp.toLocaleString()}</span>
                  </div>
                  <div className="result-tests">
                    <span className="test-passed">✅ {result.testsPassed}</span>
                    <span className="test-failed">❌ {result.testsFailed}</span>
                    <span className="test-skipped">⏭️ {result.testsSkipped}</span>
                  </div>
                </div>
                {result.error && (
                  <div className="result-error">
                    <p>Error: {result.error}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
