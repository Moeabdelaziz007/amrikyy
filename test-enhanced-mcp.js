// Test script for Enhanced MCP Protocol with Free Tools
import { enhancedMCP } from './server/enhanced-mcp-protocol.js';

async function testEnhancedMCPTools() {
  console.log('🚀 Testing Enhanced MCP Protocol with Free Tools\n');

  // Test 1: Sentiment Analysis
  console.log('1. Testing Sentiment Analysis Tool:');
  try {
    const sentimentResult = await enhancedMCP.executeTool('sentiment_analysis_tool', {
      text: 'I love this new AI system! It is amazing and wonderful.',
      provider: 'fallback'
    });
    console.log('✅ Sentiment Analysis Result:', sentimentResult);
  } catch (error) {
    console.log('❌ Sentiment Analysis Error:', error.message);
  }

  // Test 2: Text Summarization
  console.log('\n2. Testing Text Summarization Tool:');
  try {
    const summaryResult = await enhancedMCP.executeTool('text_summarization_tool', {
      text: 'Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines that can perform tasks that typically require human intelligence. These tasks include learning, reasoning, problem-solving, perception, and language understanding. AI has applications in various fields including healthcare, finance, transportation, and entertainment. The development of AI has accelerated in recent years due to advances in machine learning, deep learning, and neural networks.',
      maxLength: 50
    });
    console.log('✅ Text Summarization Result:', summaryResult);
  } catch (error) {
    console.log('❌ Text Summarization Error:', error.message);
  }

  // Test 3: Translation
  console.log('\n3. Testing Translation Tool:');
  try {
    const translationResult = await enhancedMCP.executeTool('translation_tool', {
      text: 'Hello, how are you?',
      from: 'en',
      to: 'es',
      provider: 'libre'
    });
    console.log('✅ Translation Result:', translationResult);
  } catch (error) {
    console.log('❌ Translation Error:', error.message);
  }

  // Test 4: Keyword Extraction
  console.log('\n4. Testing Keyword Extraction Tool:');
  try {
    const keywordsResult = await enhancedMCP.executeTool('keyword_extraction_tool', {
      text: 'Machine learning is a subset of artificial intelligence that focuses on algorithms and statistical models. Deep learning uses neural networks with multiple layers to process data.',
      maxKeywords: 5
    });
    console.log('✅ Keyword Extraction Result:', keywordsResult);
  } catch (error) {
    console.log('❌ Keyword Extraction Error:', error.message);
  }

  // Test 5: QR Code Generation
  console.log('\n5. Testing QR Code Generation Tool:');
  try {
    const qrResult = await enhancedMCP.executeTool('qr_code_generator_tool', {
      text: 'https://auraos.dev',
      size: 200,
      format: 'png'
    });
    console.log('✅ QR Code Generation Result:', qrResult);
  } catch (error) {
    console.log('❌ QR Code Generation Error:', error.message);
  }

  // Test 6: Password Generation
  console.log('\n6. Testing Password Generation Tool:');
  try {
    const passwordResult = await enhancedMCP.executeTool('password_generator_tool', {
      length: 16,
      includeSymbols: true,
      includeNumbers: true,
      includeUppercase: true,
      includeLowercase: true
    });
    console.log('✅ Password Generation Result:', passwordResult);
  } catch (error) {
    console.log('❌ Password Generation Error:', error.message);
  }

  // Test 7: Hash Generation
  console.log('\n7. Testing Hash Generation Tool:');
  try {
    const hashResult = await enhancedMCP.executeTool('hash_generator_tool', {
      text: 'Hello World',
      algorithm: 'sha256'
    });
    console.log('✅ Hash Generation Result:', hashResult);
  } catch (error) {
    console.log('❌ Hash Generation Error:', error.message);
  }

  // Test 8: JSON Validation
  console.log('\n8. Testing JSON Validation Tool:');
  try {
    const jsonResult = await enhancedMCP.executeTool('json_validator_tool', {
      jsonData: '{"name": "AuraOS", "version": "1.0.0", "features": ["AI", "MCP"]}',
      operation: 'validate'
    });
    console.log('✅ JSON Validation Result:', jsonResult);
  } catch (error) {
    console.log('❌ JSON Validation Error:', error.message);
  }

  // Test 9: CSV Processing
  console.log('\n9. Testing CSV Processing Tool:');
  try {
    const csvResult = await enhancedMCP.executeTool('csv_parser_tool', {
      csvData: 'Name,Age,City\nJohn,25,New York\nJane,30,Los Angeles\nBob,35,Chicago',
      operation: 'stats'
    });
    console.log('✅ CSV Processing Result:', csvResult);
  } catch (error) {
    console.log('❌ CSV Processing Error:', error.message);
  }

  // Test 10: Web Scraping
  console.log('\n10. Testing Web Scraping Tool:');
  try {
    const scrapingResult = await enhancedMCP.executeTool('web_scraping_tool', {
      url: 'https://httpbin.org/html',
      format: 'text'
    });
    console.log('✅ Web Scraping Result:', scrapingResult);
  } catch (error) {
    console.log('❌ Web Scraping Error:', error.message);
  }

  // Display tool statistics
  console.log('\n📊 Tool Statistics:');
  const allTools = enhancedMCP.getTools();
  const freeTools = enhancedMCP.getFreeTools();
  const toolsByCategory = {
    text: enhancedMCP.getToolsByCategory('text').length,
    image: enhancedMCP.getToolsByCategory('image').length,
    web: enhancedMCP.getToolsByCategory('web').length,
    data: enhancedMCP.getToolsByCategory('data').length,
    utility: enhancedMCP.getToolsByCategory('utility').length,
    ai: enhancedMCP.getToolsByCategory('ai').length
  };

  console.log(`Total Tools: ${allTools.length}`);
  console.log(`Free Tools: ${freeTools.length}`);
  console.log(`Tools by Category:`, toolsByCategory);

  console.log('\n🎉 Enhanced MCP Protocol testing completed!');
}

// Run the tests
testEnhancedMCPTools().catch(console.error);
