require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
  errorLogsRef,
  debugSessionsRef,
} = require('./firebase-admin-setup.cjs');

class GeminiAIIntegration {
  constructor() {
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY not found in environment variables');
    }

    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    console.log('🤖 Gemini AI initialized');
  }

  async analyzeError(errorData) {
    try {
      const prompt = `
            Analyze this AuraOS error and provide a comprehensive solution:
            
            Error Type: ${errorData.type}
            Error Message: ${errorData.message}
            Stack Trace: ${errorData.stack}
            Timestamp: ${errorData.timestamp}
            
            Please provide:
            1. Root cause analysis
            2. Immediate fix steps
            3. Prevention strategies
            4. Code improvements
            5. Testing recommendations
            
            Focus on AuraOS-specific solutions and best practices.
            `;

      const result = await this.model.generateContent(prompt);
      const analysis = result.response.text();

      // تسجيل التحليل في Firestore
      if (debugSessionsRef()) {
        await debugSessionsRef().add({
          issue: errorData.message,
          analysis: analysis,
          timestamp: new Date().toISOString(),
          source: 'gemini-ai',
          resolved: false,
          autoFixAttempted: false,
        });
      }

      return analysis;
    } catch (error) {
      console.error('❌ Gemini analysis failed:', error.message);
      throw new Error('AI analysis failed');
    }
  }

  async generateFix(errorData, analysis) {
    try {
      const prompt = `
            Based on this error analysis, generate specific code fixes:
            
            Error: ${errorData.message}
            Analysis: ${analysis}
            
            Generate:
            1. Specific code changes needed
            2. Configuration updates
            3. Dependencies to add/remove
            4. Environment variable changes
            5. Testing code to verify the fix
            
            Provide executable code snippets.
            `;

      const result = await this.model.generateContent(prompt);
      const fix = result.response.text();

      return fix;
    } catch (error) {
      console.error('❌ Fix generation failed:', error.message);
      throw new Error('Fix generation failed');
    }
  }

  async chatWithGemini(message, context = '') {
    try {
      const prompt = `
            You are AuraOS AI assistant. Help users with their operating system tasks.
            
            Context: ${context}
            User Message: ${message}
            
            Provide helpful, accurate, and concise responses.
            `;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      return response;
    } catch (error) {
      console.error('❌ Gemini chat failed:', error.message);
      throw new Error('Chat failed');
    }
  }

  async chatInArabic(message) {
    try {
      const prompt = `
            أنت مساعد AuraOS الذكي. أجب باللغة العربية بطريقة مفيدة ومهنية.
            
            رسالة المستخدم: ${message}
            `;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      return response;
    } catch (error) {
      console.error('❌ Arabic chat failed:', error.message);
      throw new Error('Arabic chat failed');
    }
  }

  async analyzeBuildFailure(buildData) {
    try {
      const prompt = `
            Analyze this AuraOS build failure:
            
            Build Type: ${buildData.type}
            Error Output: ${buildData.errors}
            Build Output: ${buildData.output}
            
            Provide:
            1. Build failure diagnosis
            2. Specific fix commands
            3. Dependency issues
            4. Configuration problems
            5. Alternative build strategies
            `;

      const result = await this.model.generateContent(prompt);
      const analysis = result.response.text();

      return analysis;
    } catch (error) {
      console.error('❌ Build analysis failed:', error.message);
      throw new Error('Build analysis failed');
    }
  }
}

module.exports = GeminiAIIntegration;
