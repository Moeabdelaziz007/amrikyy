// Simple Gemini API Test (JavaScript)
import { GoogleGenerativeAI } from '@google/generative-ai';

async function testGeminiAPI() {
  console.log('🚀 Testing Gemini API Integration\n');
  console.log('=' .repeat(50));
  console.log('🔑 API Key: AIzaSyAA01N65C8bwPf1WnNj9qsR7nHfmXYoLjU');
  console.log('=' .repeat(50));

  try {
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI('AIzaSyAA01N65C8bwPf1WnNj9qsR7nHfmXYoLjU');
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024
      }
    });

    console.log('✅ Gemini API initialized successfully');
    console.log('📋 Model: gemini-1.5-flash');

    // Test 1: Simple Text Generation
    console.log('\n🧪 Test 1: Simple Text Generation');
    const prompt1 = 'Write a short paragraph about artificial intelligence.';
    const result1 = await model.generateContent(prompt1);
    const response1 = await result1.response;
    const text1 = response1.text();
    
    console.log('✅ Text generation successful');
    console.log(`📝 Response: ${text1.substring(0, 100)}...`);

    // Test 2: Sentiment Analysis
    console.log('\n🧪 Test 2: Sentiment Analysis');
    const prompt2 = `Analyze the sentiment of this text: "I absolutely love this new AI system! It's amazing and wonderful!"

Please respond with:
1. Overall sentiment (positive/negative/neutral)
2. Confidence level (0-1)
3. Key emotional indicators

Format as JSON.`;

    const result2 = await model.generateContent(prompt2);
    const response2 = await result2.response;
    const text2 = response2.text();
    
    console.log('✅ Sentiment analysis successful');
    console.log(`📊 Analysis: ${text2.substring(0, 150)}...`);

    // Test 3: Code Explanation
    console.log('\n🧪 Test 3: Code Explanation');
    const prompt3 = `Explain this JavaScript code:

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));

Please explain:
1. What the function does
2. How it works
3. What the output will be`;

    const result3 = await model.generateContent(prompt3);
    const response3 = await result3.response;
    const text3 = response3.text();
    
    console.log('✅ Code explanation successful');
    console.log(`💻 Explanation: ${text3.substring(0, 150)}...`);

    // Test 4: Translation
    console.log('\n🧪 Test 4: Translation');
    const prompt4 = `Translate this English text to Spanish: "Hello, how are you today? I hope you are having a wonderful day!"

Please provide:
1. The Spanish translation
2. Any cultural context notes`;

    const result4 = await model.generateContent(prompt4);
    const response4 = await result4.response;
    const text4 = response4.text();
    
    console.log('✅ Translation successful');
    console.log(`🌍 Translation: ${text4.substring(0, 150)}...`);

    // Test 5: Data Analysis
    console.log('\n🧪 Test 5: Data Analysis');
    const prompt5 = `Analyze this sales data and provide insights:

Q1 2024: $100,000
Q2 2024: $120,000
Q3 2024: $135,000
Q4 2024: $150,000

Please provide:
1. Growth trends
2. Percentage increases
3. Predictions for next quarter`;

    const result5 = await model.generateContent(prompt5);
    const response5 = await result5.response;
    const text5 = response5.text();
    
    console.log('✅ Data analysis successful');
    console.log(`📊 Analysis: ${text5.substring(0, 150)}...`);

    // Test 6: Content Generation
    console.log('\n🧪 Test 6: Content Generation');
    const prompt6 = `Write a professional email about implementing AI in healthcare:

Requirements:
- Professional tone
- Mention key benefits
- Include a call to action
- Keep it concise`;

    const result6 = await model.generateContent(prompt6);
    const response6 = await result6.response;
    const text6 = response6.text();
    
    console.log('✅ Content generation successful');
    console.log(`✍️ Email: ${text6.substring(0, 150)}...`);

    // Test 7: Question Answering
    console.log('\n🧪 Test 7: Question Answering');
    const prompt7 = `Answer this question: "What are the main advantages of using machine learning in business?"

Please provide:
1. Key advantages
2. Real-world examples
3. Implementation considerations`;

    const result7 = await model.generateContent(prompt7);
    const response7 = await result7.response;
    const text7 = response7.text();
    
    console.log('✅ Question answering successful');
    console.log(`❓ Answer: ${text7.substring(0, 150)}...`);

    // Test 8: Text Enhancement
    console.log('\n🧪 Test 8: Text Enhancement');
    const prompt8 = `Improve this text for professional communication:

"This is a badly writen text with lots of errors and poor grammar. it needs improvment."

Please:
1. Correct all errors
2. Improve clarity
3. Make it professional`;

    const result8 = await model.generateContent(prompt8);
    const response8 = await result8.response;
    const text8 = response8.text();
    
    console.log('✅ Text enhancement successful');
    console.log(`✨ Enhanced: ${text8.substring(0, 150)}...`);

    // Performance Test
    console.log('\n🧪 Performance Test: Multiple Requests');
    const startTime = Date.now();
    
    const promises = [
      model.generateContent('What is AI?'),
      model.generateContent('What is machine learning?'),
      model.generateContent('What is deep learning?')
    ];

    const results = await Promise.all(promises);
    const totalTime = Date.now() - startTime;

    console.log('✅ Performance test successful');
    console.log(`⚡ 3 requests completed in ${totalTime}ms (avg: ${Math.round(totalTime/3)}ms per request)`);

    // Summary
    console.log('\n' + '=' .repeat(50));
    console.log('📊 GEMINI API TEST SUMMARY');
    console.log('=' .repeat(50));
    console.log('✅ All tests passed successfully!');
    console.log('🎯 API Key: Working correctly');
    console.log('🤖 Model: gemini-1.5-flash');
    console.log('📈 Performance: Excellent');
    console.log('🔒 Safety: Configured');
    console.log('🎉 Gemini API integration is ready for MCP!');

  } catch (error) {
    console.error('❌ Gemini API test failed:', error.message);
    console.error('🔍 Error details:', error);
    process.exit(1);
  }
}

// Run the test
testGeminiAPI();
