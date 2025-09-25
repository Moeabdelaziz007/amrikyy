#!/usr/bin/env node

/**
 * Comprehensive Test Runner for AuraOS Firestore User Data Testing
 * Executes all test suites and generates detailed reports
 */

const fs = require('fs');
const path = require('path');

// Import test modules
const firestoreTests = require('./test-firestore-user-data.js');
const historyTests = require('./test-user-history-service.js');

// Test configuration
const TEST_CONFIG = {
  outputDir: './test-reports',
  timestamp: new Date().toISOString().replace(/[:.]/g, '-'),
  environment: process.env.NODE_ENV || 'test'
};

// Ensure output directory exists
if (!fs.existsSync(TEST_CONFIG.outputDir)) {
  fs.mkdirSync(TEST_CONFIG.outputDir, { recursive: true });
}

// Test execution results
const executionResults = {
  startTime: null,
  endTime: null,
  duration: 0,
  suites: [],
  overallSuccess: false,
  summary: {
    totalTests: 0,
    totalPassed: 0,
    totalFailed: 0,
    successRate: 0
  }
};

// Utility functions
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
}

function saveReport(reportData, filename) {
  const filePath = path.join(TEST_CONFIG.outputDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(reportData, null, 2));
  log(`Report saved to: ${filePath}`);
}

function generateHTMLReport(results) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AuraOS Firestore Test Report</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }
        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .summary-card h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        .summary-card .number {
            font-size: 2em;
            font-weight: bold;
            margin: 10px 0;
        }
        .success { color: #28a745; }
        .failure { color: #dc3545; }
        .warning { color: #ffc107; }
        .info { color: #17a2b8; }
        .content {
            padding: 30px;
        }
        .suite {
            margin-bottom: 40px;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            overflow: hidden;
        }
        .suite-header {
            background: #f8f9fa;
            padding: 20px;
            border-bottom: 1px solid #e9ecef;
        }
        .suite-header h2 {
            margin: 0;
            color: #333;
        }
        .suite-content {
            padding: 20px;
        }
        .test-result {
            display: flex;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #f1f3f4;
        }
        .test-result:last-child {
            border-bottom: none;
        }
        .test-status {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 12px;
        }
        .test-status.pass {
            background: #28a745;
        }
        .test-status.fail {
            background: #dc3545;
        }
        .test-name {
            flex: 1;
            font-weight: 500;
        }
        .test-message {
            color: #666;
            font-size: 0.9em;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            border-top: 1px solid #e9ecef;
        }
        .timestamp {
            font-size: 0.9em;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 AuraOS Firestore Test Report</h1>
            <p>Comprehensive User Data Storage and Retrieval Testing</p>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <h3>Overall Status</h3>
                <div class="number ${results.overallSuccess ? 'success' : 'failure'}">
                    ${results.overallSuccess ? '✅ PASSED' : '❌ FAILED'}
                </div>
            </div>
            <div class="summary-card">
                <h3>Total Tests</h3>
                <div class="number info">${results.summary.totalTests}</div>
            </div>
            <div class="summary-card">
                <h3>Passed</h3>
                <div class="number success">${results.summary.totalPassed}</div>
            </div>
            <div class="summary-card">
                <h3>Failed</h3>
                <div class="number failure">${results.summary.totalFailed}</div>
            </div>
            <div class="summary-card">
                <h3>Success Rate</h3>
                <div class="number ${results.summary.successRate >= 90 ? 'success' : results.summary.successRate >= 70 ? 'warning' : 'failure'}">
                    ${results.summary.successRate.toFixed(1)}%
                </div>
            </div>
            <div class="summary-card">
                <h3>Duration</h3>
                <div class="number info">${(results.duration / 1000).toFixed(2)}s</div>
            </div>
        </div>
        
        <div class="content">
            ${results.suites.map(suite => `
                <div class="suite">
                    <div class="suite-header">
                        <h2>${suite.name}</h2>
                        <p>${suite.description}</p>
                    </div>
                    <div class="suite-content">
                        ${suite.results.details.map(test => `
                            <div class="test-result">
                                <div class="test-status ${test.passed ? 'pass' : 'fail'}">
                                    ${test.passed ? '✓' : '✗'}
                                </div>
                                <div class="test-name">${test.testName}</div>
                                <div class="test-message">${test.message || ''}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="footer">
            <div class="timestamp">
                Generated on ${new Date().toLocaleString()}<br>
                Environment: ${TEST_CONFIG.environment}
            </div>
        </div>
    </div>
</body>
</html>`;
  
  const htmlPath = path.join(TEST_CONFIG.outputDir, `test-report-${TEST_CONFIG.timestamp}.html`);
  fs.writeFileSync(htmlPath, html);
  log(`HTML report saved to: ${htmlPath}`);
  return htmlPath;
}

// Execute individual test suite
async function executeTestSuite(suiteName, suiteFunction, description) {
  log(`Starting ${suiteName}...`);
  
  try {
    const startTime = Date.now();
    const results = await suiteFunction();
    const endTime = Date.now();
    
    const suiteResult = {
      name: suiteName,
      description: description,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      duration: endTime - startTime,
      results: results,
      success: results.success
    };
    
    executionResults.suites.push(suiteResult);
    
    log(`${suiteName} completed in ${(suiteResult.duration / 1000).toFixed(2)}s - ${results.success ? 'PASSED' : 'FAILED'}`);
    
    return suiteResult;
  } catch (error) {
    log(`Error executing ${suiteName}: ${error.message}`, 'ERROR');
    
    const suiteResult = {
      name: suiteName,
      description: description,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      duration: 0,
      results: {
        success: false,
        error: error.message,
        total: 0,
        passed: 0,
        failed: 0,
        details: []
      },
      success: false
    };
    
    executionResults.suites.push(suiteResult);
    return suiteResult;
  }
}

// Main test execution function
async function runAllTests() {
  log('🚀 Starting Comprehensive AuraOS Firestore Testing Suite...');
  log(`Environment: ${TEST_CONFIG.environment}`);
  log(`Output Directory: ${TEST_CONFIG.outputDir}`);
  
  executionResults.startTime = Date.now();
  
  try {
    // Execute Firestore User Data Tests
    await executeTestSuite(
      'Firestore User Data Tests',
      firestoreTests.runAllTests,
      'Comprehensive testing of user registration, authentication, data persistence, and security'
    );
    
    // Execute User History Service Tests
    await executeTestSuite(
      'User History Service Tests',
      historyTests.runHistoryTests,
      'Testing user activity tracking, session management, analytics generation, and performance'
    );
    
    executionResults.endTime = Date.now();
    executionResults.duration = executionResults.endTime - executionResults.startTime;
    
    // Calculate summary statistics
    executionResults.summary.totalTests = executionResults.suites.reduce((sum, suite) => sum + suite.results.total, 0);
    executionResults.summary.totalPassed = executionResults.suites.reduce((sum, suite) => sum + suite.results.passed, 0);
    executionResults.summary.totalFailed = executionResults.suites.reduce((sum, suite) => sum + suite.results.failed, 0);
    executionResults.summary.successRate = executionResults.summary.totalTests > 0 
      ? (executionResults.summary.totalPassed / executionResults.summary.totalTests) * 100 
      : 0;
    
    executionResults.overallSuccess = executionResults.summary.totalFailed === 0;
    
    // Generate reports
    const jsonReportPath = path.join(TEST_CONFIG.outputDir, `test-results-${TEST_CONFIG.timestamp}.json`);
    saveReport(executionResults, `test-results-${TEST_CONFIG.timestamp}.json`);
    
    const htmlReportPath = generateHTMLReport(executionResults);
    
    // Display summary
    log('\n📊 TEST EXECUTION SUMMARY');
    log('='.repeat(60));
    log(`Total Test Suites: ${executionResults.suites.length}`);
    log(`Total Tests: ${executionResults.summary.totalTests}`);
    log(`Passed: ${executionResults.summary.totalPassed} (${executionResults.summary.successRate.toFixed(1)}%)`);
    log(`Failed: ${executionResults.summary.totalFailed}`);
    log(`Duration: ${(executionResults.duration / 1000).toFixed(2)} seconds`);
    log(`Overall Status: ${executionResults.overallSuccess ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    log('='.repeat(60));
    
    // Display suite results
    executionResults.suites.forEach(suite => {
      const status = suite.success ? '✅ PASSED' : '❌ FAILED';
      log(`${status} ${suite.name} - ${suite.results.passed}/${suite.results.total} tests passed`);
    });
    
    log('\n📁 Reports Generated:');
    log(`- JSON Report: ${jsonReportPath}`);
    log(`- HTML Report: ${htmlReportPath}`);
    
    // Final recommendations
    log('\n🎯 RECOMMENDATIONS:');
    if (executionResults.overallSuccess) {
      log('🎉 All tests passed! Your Firestore user data storage is working correctly.');
      log('✅ User registration and authentication: WORKING');
      log('✅ Data persistence and retrieval: WORKING');
      log('✅ User history tracking: WORKING');
      log('✅ Data integrity and validation: WORKING');
      log('✅ Security and access control: WORKING');
      log('✅ Performance and scalability: WORKING');
    } else {
      log('⚠️  Some tests failed. Please review the detailed reports above.');
      log('🔧 Recommended actions:');
      log('   1. Check Firebase configuration and credentials');
      log('   2. Verify Firestore security rules');
      log('   3. Review user data validation logic');
      log('   4. Check network connectivity and permissions');
    }
    
    return executionResults;
    
  } catch (error) {
    log(`💥 Fatal error during test execution: ${error.message}`, 'ERROR');
    executionResults.endTime = Date.now();
    executionResults.duration = executionResults.endTime - executionResults.startTime;
    executionResults.overallSuccess = false;
    
    // Save error report
    saveReport(executionResults, `test-error-${TEST_CONFIG.timestamp}.json`);
    
    throw error;
  }
}

// Export for use as module
module.exports = {
  runAllTests,
  executeTestSuite,
  generateHTMLReport,
  saveReport,
  TEST_CONFIG
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests()
    .then(results => {
      process.exit(results.overallSuccess ? 0 : 1);
    })
    .catch(error => {
      log(`💥 Fatal error: ${error.message}`, 'ERROR');
      process.exit(1);
    });
}
