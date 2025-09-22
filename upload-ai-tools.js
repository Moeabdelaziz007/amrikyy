import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  projectId: 'aios-97581',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// AI Tools data structure
const aiTools = [
  {
    id: 'web_search_tool',
    name: 'Web Search Tool',
    description: 'Search the web for real-time information',
    category: 'research',
    version: '1.0.0',
    capabilities: ['web_search', 'real_time_data'],
    parameters: [
      {
        name: 'query',
        type: 'string',
        required: true,
        description: 'Search query',
      },
      {
        name: 'limit',
        type: 'number',
        required: false,
        description: 'Number of results',
        default: 10,
      },
    ],
    // execute function removed for Firestore compatibility
    isActive: true,
    usage: {
      totalCalls: 0,
      successRate: 0,
      averageExecutionTime: 0,
      lastUsed: new Date(),
    },
  },
  {
    id: 'file_operations_tool',
    name: 'File Operations Tool',
    description: 'Perform file system operations',
    category: 'system',
    version: '1.0.0',
    capabilities: ['file_read', 'file_write', 'file_list'],
    parameters: [
      {
        name: 'operation',
        type: 'string',
        required: true,
        description: 'File operation',
        enum: ['read', 'write', 'list'],
      },
      {
        name: 'path',
        type: 'string',
        required: true,
        description: 'File or directory path',
      },
      {
        name: 'content',
        type: 'string',
        required: false,
        description: 'Content to write',
      },
    ],
    // execute function removed for Firestore compatibility
    isActive: true,
    usage: {
      totalCalls: 0,
      successRate: 0,
      averageExecutionTime: 0,
      lastUsed: new Date(),
    },
  },
  {
    id: 'ai_generation_tool',
    name: 'AI Generation Tool',
    description: 'Generate content using AI models',
    category: 'generation',
    version: '1.0.0',
    capabilities: ['text_generation', 'content_creation'],
    parameters: [
      {
        name: 'prompt',
        type: 'string',
        required: true,
        description: 'AI prompt',
      },
      {
        name: 'model',
        type: 'string',
        required: false,
        description: 'AI model to use',
        default: 'gpt-4',
      },
      {
        name: 'max_tokens',
        type: 'number',
        required: false,
        description: 'Maximum tokens',
        default: 1000,
      },
    ],
    // execute function removed for Firestore compatibility
    isActive: true,
    usage: {
      totalCalls: 0,
      successRate: 0,
      averageExecutionTime: 0,
      lastUsed: new Date(),
    },
  },
  {
    id: 'data_analysis_tool',
    name: 'Data Analysis Tool',
    description: 'Analyze data and generate insights',
    category: 'analytics',
    version: '1.0.0',
    capabilities: ['data_analysis', 'insights_generation'],
    parameters: [
      {
        name: 'data',
        type: 'array',
        required: true,
        description: 'Data to analyze',
      },
      {
        name: 'analysis_type',
        type: 'string',
        required: true,
        description: 'Type of analysis',
      },
      {
        name: 'parameters',
        type: 'object',
        required: false,
        description: 'Analysis parameters',
      },
    ],
    // execute function removed for Firestore compatibility
    isActive: true,
    usage: {
      totalCalls: 0,
      successRate: 0,
      averageExecutionTime: 0,
      lastUsed: new Date(),
    },
  },
  {
    id: 'automation_tool',
    name: 'Automation Tool',
    description: 'Automate repetitive tasks',
    category: 'automation',
    version: '1.0.0',
    capabilities: ['task_automation', 'workflow_management'],
    parameters: [
      {
        name: 'task',
        type: 'string',
        required: true,
        description: 'Task to automate',
      },
      {
        name: 'schedule',
        type: 'string',
        required: false,
        description: 'Schedule for automation',
      },
      {
        name: 'conditions',
        type: 'object',
        required: false,
        description: 'Automation conditions',
      },
    ],
    // execute function removed for Firestore compatibility
    isActive: true,
    usage: {
      totalCalls: 0,
      successRate: 0,
      averageExecutionTime: 0,
      lastUsed: new Date(),
    },
  },
];

// AI Agents data structure
const aiAgents = [
  {
    id: 'research_agent',
    name: 'Research Agent',
    description: 'Specialized in research and information gathering',
    type: 'specialist',
    capabilities: ['web_search', 'data_analysis', 'report_generation'],
    tools: ['web_search_tool', 'data_analysis_tool'],
    personality: {
      tone: 'professional',
      style: 'analytical',
      expertise: 'research',
    },
    knowledge: {
      domains: ['research', 'data_analysis'],
      sources: ['web', 'databases'],
      lastUpdated: new Date(),
    },
    memory: {
      capacity: 1000,
      retention: 30,
      currentUsage: 0,
    },
    status: 'active',
    performance: {
      accuracy: 0.95,
      speed: 0.8,
      reliability: 0.9,
    },
    createdAt: new Date(),
    lastActive: new Date(),
  },
  {
    id: 'content_agent',
    name: 'Content Generation Agent',
    description: 'Creates and generates various types of content',
    type: 'specialist',
    capabilities: ['content_generation', 'creative_writing', 'editing'],
    tools: ['ai_generation_tool', 'file_operations_tool'],
    personality: {
      tone: 'creative',
      style: 'engaging',
      expertise: 'content_creation',
    },
    knowledge: {
      domains: ['writing', 'content_creation'],
      sources: ['templates', 'examples'],
      lastUpdated: new Date(),
    },
    memory: {
      capacity: 2000,
      retention: 60,
      currentUsage: 0,
    },
    status: 'active',
    performance: {
      accuracy: 0.88,
      speed: 0.9,
      reliability: 0.85,
    },
    createdAt: new Date(),
    lastActive: new Date(),
  },
];

// Upload function
async function uploadAITools() {
  try {
    console.log('Starting AI Tools upload to Firestore...');

    // Upload AI Tools
    const toolsCollection = collection(db, 'ai_tools');
    for (const tool of aiTools) {
      await setDoc(doc(toolsCollection, tool.id), tool);
      console.log(`Uploaded AI Tool: ${tool.name}`);
    }

    // Upload AI Agents
    const agentsCollection = collection(db, 'ai_agents');
    for (const agent of aiAgents) {
      await setDoc(doc(agentsCollection, agent.id), agent);
      console.log(`Uploaded AI Agent: ${agent.name}`);
    }

    console.log(
      '✅ Successfully uploaded all AI tools and agents to Firestore!'
    );
  } catch (error) {
    console.error('❌ Error uploading to Firestore:', error);
  }
}

// Run the upload
uploadAITools();
