// Comprehensive Test Suite for Improved MCP Protocol
import { improvedMCP, MCPError } from './server/improved-mcp-protocol.js';

class MCPTestSuite {
  private tests: Array<{ name: string; test: () => Promise<void> }> = [];
  private results: { passed: number; failed: number; errors: Array<{ test: string; error: string }> } = {
    passed: 0,
    failed: 0,
    errors: []
  };

  addTest(name: string, test: () => Promise<void>) {
    this.tests.push({ name, test });
  }

  async runTests(): Promise<void> {
    console.log('🚀 Starting Comprehensive MCP Protocol Tests\n');
    console.log('=' .repeat(60));

    for (const test of this.tests) {
      try {
        console.log(`\n🧪 Running: ${test.name}`);
        await test.test();
        console.log(`✅ PASSED: ${test.name}`);
        this.results.passed++;
      } catch (error) {
        console.log(`❌ FAILED: ${test.name}`);
        console.log(`   Error: ${error.message}`);
        this.results.failed++;
        this.results.errors.push({ test: test.name, error: error.message });
      }
    }

    this.printSummary();
  }

  private printSummary(): void {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('=' .repeat(60));
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);

    if (this.results.errors.length > 0) {
      console.log('\n🔍 FAILED TESTS:');
      this.results.errors.forEach(({ test, error }) => {
        console.log(`   • ${test}: ${error}`);
      });
    }

    console.log('\n🎉 Test suite completed!');
  }
}

// Initialize test suite
const testSuite = new MCPTestSuite();

// Test 1: Basic Tool Registration
testSuite.addTest('Tool Registration', async () => {
  const tools = improvedMCP.getTools();
  if (tools.length === 0) {
    throw new Error('No tools registered');
  }
  
  const toolNames = tools.map(t => t.name);
  const expectedTools = ['enhanced_sentiment_analysis', 'enhanced_translation', 'enhanced_web_scraping', 'enhanced_data_processing'];
  
  for (const expected of expectedTools) {
    if (!toolNames.includes(expected)) {
      throw new Error(`Missing tool: ${expected}`);
    }
  }
});

// Test 2: Enhanced Sentiment Analysis
testSuite.addTest('Enhanced Sentiment Analysis', async () => {
  const result = await improvedMCP.executeTool('enhanced_sentiment_analysis', {
    text: 'I love this amazing new AI system! It is wonderful and fantastic.',
    provider: 'fallback',
    useCache: false
  });

  if (!result.success) {
    throw new Error('Sentiment analysis failed');
  }

  if (!result.result.sentiment) {
    throw new Error('No sentiment result');
  }

  if (!['positive', 'negative', 'neutral'].includes(result.result.sentiment)) {
    throw new Error(`Invalid sentiment: ${result.result.sentiment}`);
  }

  if (typeof result.duration !== 'number') {
    throw new Error('Missing execution duration');
  }
});

// Test 3: Enhanced Translation
testSuite.addTest('Enhanced Translation', async () => {
  const result = await improvedMCP.executeTool('enhanced_translation', {
    text: 'Hello, how are you?',
    from: 'en',
    to: 'es',
    provider: 'libre',
    useCache: false
  });

  if (!result.success) {
    throw new Error('Translation failed');
  }

  if (!result.result.translation) {
    throw new Error('No translation result');
  }

  if (typeof result.result.translation !== 'string') {
    throw new Error('Invalid translation format');
  }
});

// Test 4: Enhanced Web Scraping
testSuite.addTest('Enhanced Web Scraping', async () => {
  const result = await improvedMCP.executeTool('enhanced_web_scraping', {
    url: 'https://httpbin.org/html',
    format: 'text',
    useCache: false,
    timeout: 10000
  });

  if (!result.success) {
    throw new Error('Web scraping failed');
  }

  if (!result.result.content) {
    throw new Error('No content scraped');
  }

  if (typeof result.result.content !== 'string') {
    throw new Error('Invalid content format');
  }
});

// Test 5: Enhanced Data Processing - JSON
testSuite.addTest('Enhanced Data Processing - JSON', async () => {
  const jsonData = '{"name": "AuraOS", "version": "1.0.0", "features": ["AI", "MCP"]}';
  
  const result = await improvedMCP.executeTool('enhanced_data_processing', {
    data: jsonData,
    format: 'json',
    operation: 'validate',
    useCache: false
  });

  if (!result.success) {
    throw new Error('JSON processing failed');
  }

  if (!result.result.valid) {
    throw new Error('JSON validation failed');
  }
});

// Test 6: Enhanced Data Processing - CSV
testSuite.addTest('Enhanced Data Processing - CSV', async () => {
  const csvData = 'Name,Age,City\nJohn,25,New York\nJane,30,Los Angeles\nBob,35,Chicago';
  
  const result = await improvedMCP.executeTool('enhanced_data_processing', {
    data: csvData,
    format: 'csv',
    operation: 'analyze',
    useCache: false
  });

  if (!result.success) {
    throw new Error('CSV processing failed');
  }

  if (typeof result.result.totalRows !== 'number') {
    throw new Error('Invalid CSV analysis result');
  }

  if (result.result.totalRows !== 3) {
    throw new Error(`Expected 3 rows, got ${result.result.totalRows}`);
  }
});

// Test 7: Input Validation
testSuite.addTest('Input Validation', async () => {
  try {
    await improvedMCP.executeTool('enhanced_sentiment_analysis', {
      // Missing required 'text' parameter
      provider: 'fallback'
    });
    throw new Error('Should have thrown validation error');
  } catch (error) {
    if (!(error instanceof MCPError)) {
      throw new Error('Expected MCPError');
    }
    if (error.code !== 'VALIDATION_ERROR') {
      throw new Error(`Expected VALIDATION_ERROR, got ${error.code}`);
    }
  }
});

// Test 8: URL Validation
testSuite.addTest('URL Validation', async () => {
  try {
    await improvedMCP.executeTool('enhanced_web_scraping', {
      url: 'javascript:alert("xss")',
      format: 'text'
    });
    throw new Error('Should have thrown URL validation error');
  } catch (error) {
    if (!(error instanceof MCPError)) {
      throw new Error('Expected MCPError');
    }
    if (error.code !== 'INVALID_URL') {
      throw new Error(`Expected INVALID_URL, got ${error.code}`);
    }
  }
});

// Test 9: Caching
testSuite.addTest('Caching Mechanism', async () => {
  const params = {
    text: 'This is a test for caching',
    provider: 'fallback',
    useCache: true
  };

  // First call
  const result1 = await improvedMCP.executeTool('enhanced_sentiment_analysis', params);
  
  // Second call (should use cache)
  const result2 = await improvedMCP.executeTool('enhanced_sentiment_analysis', params);

  if (!result1.success || !result2.success) {
    throw new Error('Caching test failed');
  }

  if (!result2.fromCache) {
    throw new Error('Second call should have used cache');
  }

  if (result2.duration >= result1.duration) {
    throw new Error('Cached result should be faster');
  }
});

// Test 10: Error Handling
testSuite.addTest('Error Handling', async () => {
  try {
    await improvedMCP.executeTool('enhanced_web_scraping', {
      url: 'https://invalid-url-that-does-not-exist-12345.com',
      format: 'text',
      timeout: 1000
    });
    throw new Error('Should have thrown error for invalid URL');
  } catch (error) {
    if (!(error instanceof MCPError)) {
      throw new Error('Expected MCPError');
    }
    if (!error.retryable) {
      throw new Error('Web scraping errors should be retryable');
    }
  }
});

// Test 11: Metrics Collection
testSuite.addTest('Metrics Collection', async () => {
  // Execute a few operations
  await improvedMCP.executeTool('enhanced_sentiment_analysis', {
    text: 'Test metrics',
    provider: 'fallback',
    useCache: false
  });

  const metrics = improvedMCP.getMetrics();
  
  if (typeof metrics.tool_executions !== 'number') {
    throw new Error('Missing tool_executions metric');
  }

  if (metrics.tool_executions < 1) {
    throw new Error('Tool executions metric not incremented');
  }
});

// Test 12: Configuration Management
testSuite.addTest('Configuration Management', async () => {
  const config = improvedMCP.getConfig();
  
  if (!config.apis) {
    throw new Error('Missing APIs configuration');
  }

  if (!config.limits) {
    throw new Error('Missing limits configuration');
  }

  if (!config.cache) {
    throw new Error('Missing cache configuration');
  }

  if (typeof config.limits.defaultRateLimit !== 'number') {
    throw new Error('Invalid defaultRateLimit configuration');
  }
});

// Test 13: Tool Categories
testSuite.addTest('Tool Categories', async () => {
  const tools = improvedMCP.getTools();
  
  const categories = new Set(tools.map(t => t.category));
  const expectedCategories = ['text', 'web', 'data'];
  
  for (const category of expectedCategories) {
    if (!categories.has(category)) {
      throw new Error(`Missing category: ${category}`);
    }
  }
});

// Test 14: Rate Limiting
testSuite.addTest('Rate Limiting', async () => {
  const tool = improvedMCP.getTool('enhanced_sentiment_analysis');
  
  if (!tool || !tool.rateLimit) {
    throw new Error('Tool should have rate limit');
  }

  // This test would need to be more sophisticated in a real scenario
  // For now, just verify the rate limit is set
  if (tool.rateLimit <= 0) {
    throw new Error('Rate limit should be positive');
  }
});

// Test 15: Text Sanitization
testSuite.addTest('Text Sanitization', async () => {
  const maliciousText = 'Hello <script>alert("xss")</script> world';
  
  const result = await improvedMCP.executeTool('enhanced_sentiment_analysis', {
    text: maliciousText,
    provider: 'fallback',
    useCache: false
  });

  if (!result.success) {
    throw new Error('Sanitization test failed');
  }

  // The text should be processed without errors
  if (!result.result.sentiment) {
    throw new Error('Sentiment analysis should work on sanitized text');
  }
});

// Run all tests
async function runAllTests() {
  try {
    await testSuite.runTests();
  } catch (error) {
    console.error('Test suite failed:', error);
    process.exit(1);
  }
}

// Execute tests
runAllTests();
