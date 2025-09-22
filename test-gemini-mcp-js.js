// Comprehensive Test Suite for Gemini MCP Integration (JavaScript)
import { geminiMCP, GeminiMCPError } from './server/gemini-mcp-protocol.js';

class GeminiTestSuite {
  constructor() {
    this.tests = [];
    this.results = {
      passed: 0,
      failed: 0,
      errors: [],
    };
  }

  addTest(name, test) {
    this.tests.push({ name, test });
  }

  async runTests() {
    console.log('🚀 Starting Gemini MCP Integration Tests\n');
    console.log('='.repeat(60));
    console.log(
      '🔑 Using Gemini API Key: AIzaSyAA01N65C8bwPf1WnNj9qsR7nHfmXYoLjU'
    );
    console.log('='.repeat(60));

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

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 GEMINI MCP TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(
      `📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`
    );

    if (this.results.errors.length > 0) {
      console.log('\n🔍 FAILED TESTS:');
      this.results.errors.forEach(({ test, error }) => {
        console.log(`   • ${test}: ${error}`);
      });
    }

    console.log('\n🎉 Gemini MCP test suite completed!');
  }
}

// Initialize test suite
const testSuite = new GeminiTestSuite();

// Test 1: Gemini API Connection
testSuite.addTest('Gemini API Connection', async () => {
  const config = geminiMCP.getConfig();

  if (!config.apiKey) {
    throw new Error('Gemini API key not configured');
  }

  if (config.apiKey !== 'AIzaSyAA01N65C8bwPf1WnNj9qsR7nHfmXYoLjU') {
    throw new Error('Incorrect API key');
  }

  if (!config.model) {
    throw new Error('Gemini model not configured');
  }

  console.log(`   📋 Model: ${config.model}`);
  console.log(`   🔑 API Key: ${config.apiKey.substring(0, 10)}...`);
});

// Test 2: Tool Registration
testSuite.addTest('Gemini Tool Registration', async () => {
  const tools = geminiMCP.getGeminiTools();

  if (tools.length === 0) {
    throw new Error('No Gemini tools registered');
  }

  const expectedTools = [
    'gemini_sentiment_analysis',
    'gemini_text_summarization',
    'gemini_translation',
    'gemini_code_explanation',
    'gemini_content_generation',
    'gemini_data_analysis',
    'gemini_question_answering',
    'gemini_text_enhancement',
  ];

  for (const expected of expectedTools) {
    const tool = tools.find(t => t.name === expected);
    if (!tool) {
      throw new Error(`Missing Gemini tool: ${expected}`);
    }
    if (!tool.usesGemini) {
      throw new Error(`Tool ${expected} should use Gemini`);
    }
  }

  console.log(`   📊 Total Gemini Tools: ${tools.length}`);
});

// Test 3: Sentiment Analysis
testSuite.addTest('Gemini Sentiment Analysis', async () => {
  const result = await geminiMCP.executeTool('gemini_sentiment_analysis', {
    text: 'I absolutely love this new AI system! It is amazing, wonderful, and fantastic. The features are incredible!',
    detail: 'simple',
    useCache: false,
  });

  if (!result.success) {
    throw new Error('Sentiment analysis failed');
  }

  if (!result.result) {
    throw new Error('No sentiment result');
  }

  if (typeof result.duration !== 'number') {
    throw new Error('Missing execution duration');
  }

  console.log(
    `   📊 Result: ${JSON.stringify(result.result).substring(0, 100)}...`
  );
  console.log(`   ⏱️ Duration: ${result.duration}ms`);
});

// Test 4: Text Summarization
testSuite.addTest('Gemini Text Summarization', async () => {
  const longText = `
    Artificial Intelligence (AI) has revolutionized numerous industries and continues to shape the future of technology. 
    From healthcare to finance, transportation to entertainment, AI applications are becoming increasingly sophisticated. 
    Machine learning algorithms can now process vast amounts of data to identify patterns and make predictions with remarkable accuracy. 
    Deep learning networks, inspired by the human brain, have achieved breakthroughs in image recognition, natural language processing, and autonomous systems. 
    The integration of AI into everyday devices and services is transforming how we work, communicate, and solve complex problems. 
    However, this rapid advancement also brings challenges related to ethics, privacy, and the need for responsible AI development. 
    As we move forward, it's crucial to balance innovation with considerations for societal impact and human welfare.
  `;

  const result = await geminiMCP.executeTool('gemini_text_summarization', {
    text: longText,
    maxLength: 50,
    style: 'concise',
    useCache: false,
  });

  if (!result.success) {
    throw new Error('Text summarization failed');
  }

  if (!result.result) {
    throw new Error('No summarization result');
  }

  console.log(
    `   📝 Summary: ${JSON.stringify(result.result).substring(0, 150)}...`
  );
});

// Test 5: Translation
testSuite.addTest('Gemini Translation', async () => {
  const result = await geminiMCP.executeTool('gemini_translation', {
    text: 'Hello, how are you today? I hope you are having a wonderful day!',
    from: 'en',
    to: 'es',
    context: 'casual conversation',
    useCache: false,
  });

  if (!result.success) {
    throw new Error('Translation failed');
  }

  if (!result.result) {
    throw new Error('No translation result');
  }

  console.log(
    `   🌍 Translation: ${JSON.stringify(result.result).substring(0, 100)}...`
  );
});

// Test 6: Code Explanation
testSuite.addTest('Gemini Code Explanation', async () => {
  const code = `
    function fibonacci(n) {
      if (n <= 1) return n;
      return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    console.log(fibonacci(10));
  `;

  const result = await geminiMCP.executeTool('gemini_code_explanation', {
    code: code,
    language: 'javascript',
    detail: 'detailed',
    includeExamples: true,
    useCache: false,
  });

  if (!result.success) {
    throw new Error('Code explanation failed');
  }

  if (!result.result) {
    throw new Error('No code explanation result');
  }

  console.log(
    `   💻 Explanation: ${JSON.stringify(result.result).substring(0, 150)}...`
  );
});

// Test 7: Content Generation
testSuite.addTest('Gemini Content Generation', async () => {
  const result = await geminiMCP.executeTool('gemini_content_generation', {
    prompt: 'Write about the benefits of artificial intelligence in healthcare',
    type: 'article',
    length: 'short',
    tone: 'professional',
    useCache: false,
  });

  if (!result.success) {
    throw new Error('Content generation failed');
  }

  if (!result.result) {
    throw new Error('No content generation result');
  }

  console.log(
    `   ✍️ Generated Content: ${JSON.stringify(result.result).substring(0, 150)}...`
  );
});

// Test 8: Data Analysis
testSuite.addTest('Gemini Data Analysis', async () => {
  const data = `
    Sales Data:
    Q1 2024: $100,000
    Q2 2024: $120,000
    Q3 2024: $135,000
    Q4 2024: $150,000
    
    Customer Growth:
    Q1 2024: 1,000 customers
    Q2 2024: 1,200 customers
    Q3 2024: 1,350 customers
    Q4 2024: 1,500 customers
  `;

  const result = await geminiMCP.executeTool('gemini_data_analysis', {
    data: data,
    analysisType: 'trends',
    context: 'Quarterly business performance',
    format: 'text',
    useCache: false,
  });

  if (!result.success) {
    throw new Error('Data analysis failed');
  }

  if (!result.result) {
    throw new Error('No data analysis result');
  }

  console.log(
    `   📊 Analysis: ${JSON.stringify(result.result).substring(0, 150)}...`
  );
});

// Test 9: Question Answering
testSuite.addTest('Gemini Question Answering', async () => {
  const result = await geminiMCP.executeTool('gemini_question_answering', {
    question:
      'What are the main advantages of using machine learning in business?',
    context: 'Business applications and automation',
    detail: 'detailed',
    includeSources: false,
    useCache: false,
  });

  if (!result.success) {
    throw new Error('Question answering failed');
  }

  if (!result.result) {
    throw new Error('No question answering result');
  }

  console.log(
    `   ❓ Answer: ${JSON.stringify(result.result).substring(0, 150)}...`
  );
});

// Test 10: Text Enhancement
testSuite.addTest('Gemini Text Enhancement', async () => {
  const text =
    'this is a badly writen text with lots of errors and poor grammar. it needs improvment.';

  const result = await geminiMCP.executeTool('gemini_text_enhancement', {
    text: text,
    enhancement: 'all',
    targetAudience: 'professional',
    preserveOriginal: true,
    useCache: false,
  });

  if (!result.success) {
    throw new Error('Text enhancement failed');
  }

  if (!result.result) {
    throw new Error('No text enhancement result');
  }

  console.log(
    `   ✨ Enhanced Text: ${JSON.stringify(result.result).substring(0, 150)}...`
  );
});

// Test 11: Caching Mechanism
testSuite.addTest('Gemini Caching Mechanism', async () => {
  const params = {
    text: 'This is a test for Gemini caching',
    detail: 'simple',
    useCache: true,
  };

  // First call
  const result1 = await geminiMCP.executeTool(
    'gemini_sentiment_analysis',
    params
  );

  // Second call (should use cache)
  const result2 = await geminiMCP.executeTool(
    'gemini_sentiment_analysis',
    params
  );

  if (!result1.success || !result2.success) {
    throw new Error('Caching test failed');
  }

  if (!result2.fromCache) {
    throw new Error('Second call should have used cache');
  }

  console.log(
    `   💾 Cache Test: First call ${result1.duration}ms, Second call ${result2.duration}ms`
  );
});

// Test 12: Error Handling
testSuite.addTest('Gemini Error Handling', async () => {
  try {
    await geminiMCP.executeTool('gemini_sentiment_analysis', {
      // Missing required 'text' parameter
      detail: 'simple',
    });
    throw new Error('Should have thrown validation error');
  } catch (error) {
    if (!(error instanceof GeminiMCPError)) {
      throw new Error('Expected GeminiMCPError');
    }
    console.log(`   🛡️ Error Handling: ${error.code} - ${error.message}`);
  }
});

// Test 13: Rate Limiting
testSuite.addTest('Gemini Rate Limiting', async () => {
  const tool = geminiMCP.getTool('gemini_sentiment_analysis');

  if (!tool || !tool.rateLimit) {
    throw new Error('Tool should have rate limit');
  }

  if (tool.rateLimit <= 0) {
    throw new Error('Rate limit should be positive');
  }

  console.log(`   🚦 Rate Limit: ${tool.rateLimit} requests per minute`);
});

// Test 14: Metrics Collection
testSuite.addTest('Gemini Metrics Collection', async () => {
  // Execute a few operations
  await geminiMCP.executeTool('gemini_sentiment_analysis', {
    text: 'Test metrics collection',
    detail: 'simple',
    useCache: false,
  });

  const metrics = geminiMCP.getMetrics();

  if (typeof metrics.gemini_api_calls !== 'number') {
    throw new Error('Missing gemini_api_calls metric');
  }

  if (metrics.gemini_api_calls < 1) {
    throw new Error('Gemini API calls metric not incremented');
  }

  console.log(
    `   📈 Metrics: ${Object.keys(metrics).length} metrics collected`
  );
  console.log(`   🔢 API Calls: ${metrics.gemini_api_calls || 0}`);
});

// Test 15: Configuration Validation
testSuite.addTest('Gemini Configuration Validation', async () => {
  const config = geminiMCP.getConfig();

  if (!config.apiKey) {
    throw new Error('Missing API key configuration');
  }

  if (!config.model) {
    throw new Error('Missing model configuration');
  }

  if (!config.safetySettings) {
    throw new Error('Missing safety settings configuration');
  }

  if (!config.generationConfig) {
    throw new Error('Missing generation config');
  }

  console.log(
    `   ⚙️ Config: Model=${config.model}, Safety=${config.safetySettings.length} settings`
  );
});

// Test 16: Performance Test
testSuite.addTest('Gemini Performance Test', async () => {
  const startTime = Date.now();

  const promises = [
    geminiMCP.executeTool('gemini_sentiment_analysis', {
      text: 'Performance test 1',
      detail: 'simple',
      useCache: false,
    }),
    geminiMCP.executeTool('gemini_sentiment_analysis', {
      text: 'Performance test 2',
      detail: 'simple',
      useCache: false,
    }),
    geminiMCP.executeTool('gemini_sentiment_analysis', {
      text: 'Performance test 3',
      detail: 'simple',
      useCache: false,
    }),
  ];

  const results = await Promise.all(promises);
  const totalTime = Date.now() - startTime;

  for (const result of results) {
    if (!result.success) {
      throw new Error('Performance test failed');
    }
  }

  console.log(
    `   ⚡ Performance: 3 operations in ${totalTime}ms (avg: ${Math.round(totalTime / 3)}ms per operation)`
  );
});

// Run all tests
async function runGeminiTests() {
  try {
    await testSuite.runTests();
  } catch (error) {
    console.error('Gemini test suite failed:', error);
    process.exit(1);
  }
}

// Execute tests
runGeminiTests();
