'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = MCPToolsPage;
const react_1 = require('react');
const card_1 = require('@/components/ui/card');
const button_1 = require('@/components/ui/button');
const badge_1 = require('@/components/ui/badge');
const input_1 = require('@/components/ui/input');
const textarea_1 = require('@/components/ui/textarea');
const select_1 = require('@/components/ui/select');
const tabs_1 = require('@/components/ui/tabs');
const alert_1 = require('@/components/ui/alert');
const lucide_react_1 = require('lucide-react');
const mcpTools = [
  {
    id: 'cursor_cli',
    name: 'Cursor CLI',
    description:
      'Execute commands to LLMs via Cursor CLI with advanced capabilities',
    category: 'Development',
    icon: <lucide_react_1.Code className="w-5 h-5" />,
    parameters: [
      {
        name: 'command',
        type: 'string',
        required: true,
        description: 'The command to execute in the Cursor CLI',
      },
      {
        name: 'model',
        type: 'string',
        required: false,
        description: 'The LLM model to use',
        options: ['claude-3.5-sonnet', 'gpt-4', 'claude-3-opus'],
      },
      {
        name: 'operation_type',
        type: 'string',
        required: false,
        description: 'Type of operation',
        options: [
          'explain',
          'refactor',
          'debug',
          'optimize',
          'generate',
          'review',
          'test',
        ],
      },
      {
        name: 'context',
        type: 'string',
        required: false,
        description: 'Additional context for the command',
      },
      {
        name: 'file_path',
        type: 'string',
        required: false,
        description: 'Path to the file to operate on',
      },
    ],
    examples: [
      {
        title: 'Code Explanation',
        params: {
          command: 'explain this React component',
          operation_type: 'explain',
          model: 'claude-3.5-sonnet',
        },
        description: 'Get detailed explanation of code functionality',
      },
      {
        title: 'Code Refactoring',
        params: {
          command: 'refactor this function to use async/await',
          operation_type: 'refactor',
          model: 'claude-3.5-sonnet',
        },
        description: 'Get refactoring suggestions and implementations',
      },
      {
        title: 'Debug Analysis',
        params: {
          command: 'debug this null reference error',
          operation_type: 'debug',
          model: 'claude-3.5-sonnet',
        },
        description: 'Analyze and debug code issues',
      },
    ],
  },
  {
    id: 'comet_chrome',
    name: 'Comet Chrome',
    description:
      'Integrate with Comet Chrome extension for AI-powered web browsing and content analysis',
    category: 'Web Analysis',
    icon: <lucide_react_1.Globe className="w-5 h-5" />,
    parameters: [
      {
        name: 'action',
        type: 'string',
        required: true,
        description: 'Action to perform with Comet',
        options: [
          'analyze_page',
          'extract_content',
          'summarize_article',
          'find_similar',
          'translate_content',
          'generate_questions',
          'create_outline',
          'extract_links',
          'analyze_sentiment',
          'get_keywords',
        ],
      },
      {
        name: 'url',
        type: 'string',
        required: false,
        description: 'URL of the webpage to analyze',
      },
      {
        name: 'content',
        type: 'string',
        required: false,
        description: 'Content to analyze',
      },
      {
        name: 'language',
        type: 'string',
        required: false,
        description: 'Target language for translation',
      },
      {
        name: 'max_results',
        type: 'number',
        required: false,
        description: 'Maximum number of results to return',
      },
      {
        name: 'context',
        type: 'string',
        required: false,
        description: 'Additional context for the analysis',
      },
    ],
    examples: [
      {
        title: 'Page Analysis',
        params: { action: 'analyze_page', url: 'https://example.com' },
        description: 'Analyze webpage structure, SEO, and content quality',
      },
      {
        title: 'Content Summarization',
        params: {
          action: 'summarize_article',
          url: 'https://example.com/article',
        },
        description: 'Generate a summary of article content',
      },
      {
        title: 'Sentiment Analysis',
        params: {
          action: 'analyze_sentiment',
          content: 'This is great content!',
        },
        description: 'Analyze sentiment and emotional tone of content',
      },
    ],
  },
  {
    id: 'web_scraper',
    name: 'Web Scraper',
    description: 'Scrape web content from any URL (free, no API key required)',
    category: 'Web Analysis',
    icon: <lucide_react_1.Search className="w-5 h-5" />,
    parameters: [
      {
        name: 'url',
        type: 'string',
        required: true,
        description: 'The URL to scrape',
      },
      {
        name: 'selector',
        type: 'string',
        required: false,
        description: 'CSS selector to extract specific content',
      },
      {
        name: 'extract_text',
        type: 'boolean',
        required: false,
        description: 'Whether to extract only text content',
      },
    ],
    examples: [
      {
        title: 'Basic Scraping',
        params: { url: 'https://example.com', extract_text: true },
        description: 'Extract text content from a webpage',
      },
      {
        title: 'Selective Scraping',
        params: { url: 'https://example.com', selector: '.article-content' },
        description: 'Extract specific content using CSS selector',
      },
    ],
  },
  {
    id: 'data_analyzer',
    name: 'Data Analyzer',
    description: 'Analyze data using free statistical methods',
    category: 'Analytics',
    icon: <lucide_react_1.BarChart3 className="w-5 h-5" />,
    parameters: [
      {
        name: 'data',
        type: 'array',
        required: true,
        description: 'Array of data points to analyze',
      },
      {
        name: 'analysis_type',
        type: 'string',
        required: true,
        description: 'Type of analysis to perform',
        options: ['descriptive', 'correlation', 'trend', 'outliers'],
      },
    ],
    examples: [
      {
        title: 'Descriptive Analysis',
        params: { data: [1, 2, 3, 4, 5], analysis_type: 'descriptive' },
        description: 'Get basic statistics (mean, median, std dev)',
      },
      {
        title: 'Trend Analysis',
        params: { data: [10, 15, 20, 25, 30], analysis_type: 'trend' },
        description: 'Analyze trends in data over time',
      },
    ],
  },
  {
    id: 'text_processor',
    name: 'Text Processor',
    description: 'Process text with various free NLP operations',
    category: 'Text Processing',
    icon: <lucide_react_1.FileText className="w-5 h-5" />,
    parameters: [
      {
        name: 'text',
        type: 'string',
        required: true,
        description: 'Text to process',
      },
      {
        name: 'operation',
        type: 'string',
        required: true,
        description: 'Text processing operation',
        options: [
          'summarize',
          'extract_keywords',
          'sentiment',
          'translate',
          'clean',
        ],
      },
      {
        name: 'language',
        type: 'string',
        required: false,
        description: 'Target language for translation',
      },
    ],
    examples: [
      {
        title: 'Text Summarization',
        params: { text: 'Long article text...', operation: 'summarize' },
        description: 'Generate a summary of the text',
      },
      {
        title: 'Keyword Extraction',
        params: {
          text: 'Article about AI and machine learning',
          operation: 'extract_keywords',
        },
        description: 'Extract key terms and phrases',
      },
      {
        title: 'Sentiment Analysis',
        params: { text: 'I love this product!', operation: 'sentiment' },
        description: 'Analyze emotional tone of text',
      },
    ],
  },
  {
    id: 'ai_generation_tool',
    name: 'AI Generator',
    description: 'Generate content using AI models',
    category: 'AI',
    icon: <lucide_react_1.Brain className="w-5 h-5" />,
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
      },
      {
        name: 'max_tokens',
        type: 'number',
        required: false,
        description: 'Maximum tokens',
      },
    ],
    examples: [
      {
        title: 'Content Generation',
        params: {
          prompt: 'Write a blog post about AI',
          model: 'gpt-4',
          max_tokens: 1000,
        },
        description: 'Generate creative content using AI',
      },
      {
        title: 'Code Generation',
        params: {
          prompt: 'Create a React component for user login',
          model: 'claude-3.5-sonnet',
        },
        description: 'Generate code snippets and components',
      },
    ],
  },
  {
    id: 'file_operations',
    name: 'File Operations',
    description: 'Perform file operations (read, write, convert)',
    category: 'File Management',
    icon: <lucide_react_1.File className="w-5 h-5" />,
    parameters: [
      {
        name: 'operation',
        type: 'string',
        required: true,
        description: 'File operation to perform',
        options: ['read', 'write', 'convert', 'compress', 'extract'],
      },
      {
        name: 'file_path',
        type: 'string',
        required: true,
        description: 'Path to the file',
      },
      {
        name: 'content',
        type: 'string',
        required: false,
        description: 'Content to write (for write operation)',
      },
      {
        name: 'format',
        type: 'string',
        required: false,
        description: 'Target format for conversion',
      },
    ],
    examples: [
      {
        title: 'Read File',
        params: { operation: 'read', file_path: '/path/to/file.txt' },
        description: 'Read content from a file',
      },
      {
        title: 'Write File',
        params: {
          operation: 'write',
          file_path: '/path/to/output.txt',
          content: 'Hello World!',
        },
        description: 'Write content to a file',
      },
    ],
  },
  {
    id: 'image_processor',
    name: 'Image Processor',
    description: 'Process images using free libraries',
    category: 'Media',
    icon: <lucide_react_1.Image className="w-5 h-5" />,
    parameters: [
      {
        name: 'image_path',
        type: 'string',
        required: true,
        description: 'Path to the image file',
      },
      {
        name: 'operation',
        type: 'string',
        required: true,
        description: 'Image processing operation',
        options: [
          'resize',
          'crop',
          'rotate',
          'filter',
          'extract_text',
          'analyze',
        ],
      },
      {
        name: 'width',
        type: 'number',
        required: false,
        description: 'Target width for resize operation',
      },
      {
        name: 'height',
        type: 'number',
        required: false,
        description: 'Target height for resize operation',
      },
      {
        name: 'angle',
        type: 'number',
        required: false,
        description: 'Rotation angle in degrees',
      },
    ],
    examples: [
      {
        title: 'Resize Image',
        params: {
          image_path: '/path/to/image.jpg',
          operation: 'resize',
          width: 800,
          height: 600,
        },
        description: 'Resize an image to specific dimensions',
      },
      {
        title: 'Rotate Image',
        params: {
          image_path: '/path/to/image.jpg',
          operation: 'rotate',
          angle: 90,
        },
        description: 'Rotate an image by specified angle',
      },
    ],
  },
  {
    id: 'database_operations',
    name: 'Database Operations',
    description: 'Perform database operations on Firestore',
    category: 'Database',
    icon: <lucide_react_1.Database className="w-5 h-5" />,
    parameters: [
      {
        name: 'operation',
        type: 'string',
        required: true,
        description: 'Database operation to perform',
        options: ['query', 'insert', 'update', 'delete', 'aggregate'],
      },
      {
        name: 'collection',
        type: 'string',
        required: true,
        description: 'Firestore collection name',
      },
      {
        name: 'data',
        type: 'object',
        required: false,
        description: 'Data to insert/update',
      },
      {
        name: 'filters',
        type: 'object',
        required: false,
        description: 'Query filters',
      },
    ],
    examples: [
      {
        title: 'Query Collection',
        params: {
          operation: 'query',
          collection: 'users',
          filters: { status: 'active' },
        },
        description: 'Query documents from a collection',
      },
      {
        title: 'Insert Document',
        params: {
          operation: 'insert',
          collection: 'users',
          data: { name: 'John Doe', email: 'john@example.com' },
        },
        description: 'Insert a new document into collection',
      },
    ],
  },
  {
    id: 'api_tester',
    name: 'API Tester',
    description: 'Test APIs and webhooks (free)',
    category: 'Testing',
    icon: <lucide_react_1.Flask className="w-5 h-5" />,
    parameters: [
      {
        name: 'url',
        type: 'string',
        required: true,
        description: 'API endpoint URL',
      },
      {
        name: 'method',
        type: 'string',
        required: true,
        description: 'HTTP method',
        options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      },
      {
        name: 'headers',
        type: 'object',
        required: false,
        description: 'HTTP headers',
      },
      {
        name: 'body',
        type: 'object',
        required: false,
        description: 'Request body',
      },
    ],
    examples: [
      {
        title: 'GET Request',
        params: { url: 'https://api.example.com/users', method: 'GET' },
        description: 'Test a GET API endpoint',
      },
      {
        title: 'POST Request',
        params: {
          url: 'https://api.example.com/users',
          method: 'POST',
          body: { name: 'John Doe' },
        },
        description: 'Test a POST API endpoint',
      },
    ],
  },
  {
    id: 'code_generator',
    name: 'Code Generator',
    description: 'Generate code snippets and templates',
    category: 'Development',
    icon: <lucide_react_1.Code2 className="w-5 h-5" />,
    parameters: [
      {
        name: 'language',
        type: 'string',
        required: true,
        description: 'Programming language',
        options: [
          'javascript',
          'typescript',
          'python',
          'react',
          'vue',
          'html',
          'css',
        ],
      },
      {
        name: 'template',
        type: 'string',
        required: true,
        description: 'Code template type',
        options: ['component', 'function', 'class', 'api', 'database', 'test'],
      },
      {
        name: 'description',
        type: 'string',
        required: true,
        description: 'Description of what the code should do',
      },
      {
        name: 'framework',
        type: 'string',
        required: false,
        description: 'Framework (optional)',
      },
    ],
    examples: [
      {
        title: 'React Component',
        params: {
          language: 'react',
          template: 'component',
          description: 'A user profile card component',
        },
        description: 'Generate a React component',
      },
      {
        title: 'API Function',
        params: {
          language: 'typescript',
          template: 'api',
          description: 'A function to fetch user data',
        },
        description: 'Generate an API function',
      },
    ],
  },
  {
    id: 'data_visualizer',
    name: 'Data Visualizer',
    description: 'Create data visualizations and charts',
    category: 'Analytics',
    icon: <lucide_react_1.PieChart className="w-5 h-5" />,
    parameters: [
      {
        name: 'data',
        type: 'array',
        required: true,
        description: 'Data to visualize',
      },
      {
        name: 'chart_type',
        type: 'string',
        required: true,
        description: 'Type of chart to create',
        options: ['line', 'bar', 'pie', 'scatter', 'histogram', 'heatmap'],
      },
      {
        name: 'title',
        type: 'string',
        required: false,
        description: 'Chart title',
      },
      {
        name: 'output_format',
        type: 'string',
        required: false,
        description: 'Output format',
        options: ['svg', 'png', 'html'],
      },
    ],
    examples: [
      {
        title: 'Line Chart',
        params: {
          data: '[{x: 1, y: 10}, {x: 2, y: 20}]',
          chart_type: 'line',
          title: 'Sales Trend',
        },
        description: 'Create a line chart visualization',
      },
      {
        title: 'Bar Chart',
        params: {
          data: '[{name: "A", value: 10}, {name: "B", value: 20}]',
          chart_type: 'bar',
          title: 'Category Comparison',
        },
        description: 'Create a bar chart visualization',
      },
    ],
  },
  {
    id: 'automation',
    name: 'Automation',
    description: 'Automate repetitive tasks',
    category: 'Automation',
    icon: <lucide_react_1.Cog className="w-5 h-5" />,
    parameters: [
      {
        name: 'task_type',
        type: 'string',
        required: true,
        description: 'Type of automation task',
        options: [
          'file_processing',
          'data_migration',
          'email_sending',
          'social_media',
          'backup',
        ],
      },
      {
        name: 'config',
        type: 'object',
        required: true,
        description: 'Task configuration',
      },
      {
        name: 'schedule',
        type: 'string',
        required: false,
        description: 'Cron expression for scheduling (optional)',
      },
    ],
    examples: [
      {
        title: 'File Processing',
        params: {
          task_type: 'file_processing',
          config: { source_dir: '/input', target_dir: '/output' },
        },
        description: 'Automate file processing tasks',
      },
      {
        title: 'Data Migration',
        params: {
          task_type: 'data_migration',
          config: { source_db: 'old_db', target_db: 'new_db' },
        },
        description: 'Automate data migration between databases',
      },
    ],
  },
  {
    id: 'knowledge_base',
    name: 'Knowledge Base',
    description: 'Query a knowledge base for information',
    category: 'Information',
    icon: <lucide_react_1.BookOpen className="w-5 h-5" />,
    parameters: [
      {
        name: 'query',
        type: 'string',
        required: true,
        description: 'The query to search for in the knowledge base',
      },
    ],
    examples: [
      {
        title: 'Search Knowledge',
        params: { query: 'How to implement authentication?' },
        description: 'Search for information in the knowledge base',
      },
      {
        title: 'Get Documentation',
        params: { query: 'API documentation for user management' },
        description: 'Retrieve documentation from knowledge base',
      },
    ],
  },
  {
    id: 'system_info',
    name: 'System Info',
    description: 'Get information about the system',
    category: 'System',
    icon: <lucide_react_1.Info className="w-5 h-5" />,
    parameters: [],
    examples: [
      {
        title: 'Get System Info',
        params: {},
        description: 'Retrieve system information and status',
      },
    ],
  },
  {
    id: 'code_formatter',
    name: 'Code Formatter',
    description: 'Format code snippets',
    category: 'Development',
    icon: <lucide_react_1.AlignLeft className="w-5 h-5" />,
    parameters: [
      {
        name: 'code',
        type: 'string',
        required: true,
        description: 'The code to format',
      },
      {
        name: 'language',
        type: 'string',
        required: true,
        description: 'The programming language of the code',
      },
    ],
    examples: [
      {
        title: 'Format JavaScript',
        params: {
          code: 'function test(){return "hello";}',
          language: 'javascript',
        },
        description: 'Format JavaScript code',
      },
      {
        title: 'Format Python',
        params: { code: 'def test():\nreturn "hello"', language: 'python' },
        description: 'Format Python code',
      },
    ],
  },
  {
    id: 'multilingual_assistant',
    name: 'Multilingual Assistant',
    description: 'AI assistant with Arabic and English support',
    category: 'AI',
    icon: <lucide_react_1.Languages className="w-5 h-5" />,
    parameters: [
      {
        name: 'message',
        type: 'string',
        required: true,
        description: 'The message to send to the assistant',
      },
      {
        name: 'language',
        type: 'string',
        required: false,
        description: 'Language preference',
        options: ['auto', 'arabic', 'english'],
      },
      {
        name: 'user_profile',
        type: 'object',
        required: false,
        description: 'User profile information',
      },
      {
        name: 'context',
        type: 'string',
        required: false,
        description: 'Additional context',
      },
    ],
    examples: [
      {
        title: 'Arabic Support',
        params: { message: 'صمم لي نظام إدارة', language: 'arabic' },
        description: 'Get assistance in Arabic',
      },
      {
        title: 'English Support',
        params: {
          message: 'Design a management system for me',
          language: 'english',
        },
        description: 'Get assistance in English',
      },
    ],
  },
  {
    id: 'system_designer',
    name: 'System Designer',
    description: 'Design system architecture and components',
    category: 'Architecture',
    icon: <lucide_react_1.Compass className="w-5 h-5" />,
    parameters: [
      {
        name: 'requirements',
        type: 'string',
        required: true,
        description: 'System requirements',
      },
      {
        name: 'technology_stack',
        type: 'object',
        required: false,
        description: 'Preferred technology stack',
      },
      {
        name: 'complexity',
        type: 'string',
        required: false,
        description: 'System complexity level',
        options: ['simple', 'medium', 'complex', 'enterprise'],
      },
      {
        name: 'context',
        type: 'string',
        required: false,
        description: 'Additional context',
      },
    ],
    examples: [
      {
        title: 'Web Application',
        params: {
          requirements: 'E-commerce platform with user management',
          complexity: 'medium',
        },
        description: 'Design a web application architecture',
      },
      {
        title: 'API System',
        params: {
          requirements: 'RESTful API for mobile app backend',
          complexity: 'simple',
        },
        description: 'Design an API system architecture',
      },
    ],
  },
  {
    id: 'educational_tutor',
    name: 'Educational Tutor',
    description: 'AI tutor for learning and education',
    category: 'Education',
    icon: <lucide_react_1.GraduationCap className="w-5 h-5" />,
    parameters: [
      {
        name: 'topic',
        type: 'string',
        required: true,
        description: 'Learning topic',
      },
      {
        name: 'difficulty_level',
        type: 'string',
        required: false,
        description: 'Difficulty level',
        options: ['beginner', 'intermediate', 'advanced'],
      },
      {
        name: 'learning_style',
        type: 'string',
        required: false,
        description: 'Learning style preference',
        options: ['visual', 'auditory', 'kinesthetic', 'reading'],
      },
      {
        name: 'context',
        type: 'string',
        required: false,
        description: 'Additional context',
      },
    ],
    examples: [
      {
        title: 'Learn Programming',
        params: {
          topic: 'JavaScript fundamentals',
          difficulty_level: 'beginner',
          learning_style: 'visual',
        },
        description: 'Get programming lessons',
      },
      {
        title: 'Study Math',
        params: {
          topic: 'Calculus derivatives',
          difficulty_level: 'intermediate',
          learning_style: 'reading',
        },
        description: 'Get math tutoring',
      },
    ],
  },
  {
    id: 'wellness_coach',
    name: 'Wellness Coach',
    description: 'AI wellness coach for mental health support',
    category: 'Wellness',
    icon: <lucide_react_1.Heart className="w-5 h-5" />,
    parameters: [
      {
        name: 'mood',
        type: 'string',
        required: false,
        description: 'Current mood',
      },
      {
        name: 'stress_level',
        type: 'string',
        required: false,
        description: 'Stress level',
        options: ['low', 'medium', 'high'],
      },
      {
        name: 'goals',
        type: 'array',
        required: false,
        description: 'Wellness goals',
      },
      {
        name: 'context',
        type: 'string',
        required: false,
        description: 'Additional context',
      },
    ],
    examples: [
      {
        title: 'Mood Check',
        params: { mood: 'anxious', stress_level: 'high' },
        description: 'Get wellness support and guidance',
      },
      {
        title: 'Goal Setting',
        params: {
          goals: ['better sleep', 'reduce stress'],
          stress_level: 'medium',
        },
        description: 'Set and track wellness goals',
      },
    ],
  },
];
function MCPToolsPage() {
  const [selectedTool, setSelectedTool] = (0, react_1.useState)(null);
  const [testParams, setTestParams] = (0, react_1.useState)({});
  const [testResults, setTestResults] = (0, react_1.useState)(null);
  const [isLoading, setIsLoading] = (0, react_1.useState)(false);
  const [activeTab, setActiveTab] = (0, react_1.useState)('overview');

  // Get tool parameter from URL
  const urlParams = new URLSearchParams(window.location.search);
  const toolParam = urlParams.get('tool');

  // Auto-select tool if specified in URL
  (0, react_1.useEffect)(() => {
    if (toolParam) {
      const tool = mcpTools.find(t => t.id === toolParam);
      if (tool) {
        setSelectedTool(tool);
        setActiveTab('test');
      }
    }
  }, [toolParam]);
  const handleToolSelect = (tool: any) => {
    setSelectedTool(tool);
    setTestParams({});
    setTestResults(null);
    setActiveTab('test');
  };
  const handleTestRun = async () => {
    if (!selectedTool) return;
    setIsLoading(true);
    try {
      // Simulate MCP tool execution
      await new Promise(resolve =>
        setTimeout(resolve, Math.random() * 2000 + 1000)
      );
      // Generate realistic test results based on tool type
      const mockResults = generateMockResults(selectedTool.id, testParams);
      setTestResults(mockResults);
    } catch (error) {
      setTestResults({
        success: false,
        error: 'Failed to execute tool',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };
  const generateMockResults = (toolId: any, params: any) => {
    const baseResult = {
      success: true,
      tool: toolId,
      params,
      timestamp: new Date().toISOString(),
      execution_time_ms: Math.floor(Math.random() * 3000) + 500,
    };
    switch (toolId) {
      case 'cursor_cli':
        return {
          ...baseResult,
          output: `**Code Analysis Results**\n\nCommand: ${params.command}\nOperation: ${params.operation_type || 'explain'}\nModel: ${params.model || 'claude-3.5-sonnet'}\n\n**Analysis:**\nThe code appears to be implementing a ${params.operation_type || 'explain'} operation. Here's what it does:\n\n1. **Purpose**: The code is designed to ${params.command.toLowerCase()}\n2. **Key Components**: \n   - Main logic handles the core functionality\n   - Error handling ensures robustness\n   - Performance optimizations are in place\n\n**Recommendations:**\n- Consider adding more detailed comments\n- Implement additional error handling for edge cases\n- Add unit tests for better coverage`,
          suggestions: [
            'Consider implementing the suggested improvements',
            'Run tests to verify functionality',
            'Review the generated code for your specific use case',
          ],
        };
      case 'comet_chrome':
        return {
          ...baseResult,
          output: `**Comet Analysis Results**\n\nAction: ${params.action}\nURL: ${params.url || 'Content provided'}\n\n**Analysis:**\n${getCometAnalysisOutput(params.action, params.url)}\n\n**Features Used:**\n- AI-powered content analysis\n- Real-time web browsing assistance\n- Multi-language support`,
          comet_features: [
            'AI-powered content analysis',
            'Real-time web browsing assistance',
            'Multi-language support',
            'Advanced text processing',
          ],
        };
      case 'web_scraper':
        return {
          ...baseResult,
          output: `**Web Scraping Results**\n\nURL: ${params.url}\nSelector: ${params.selector || 'All content'}\n\n**Extracted Content:**\nSample extracted content from the webpage. This includes the main text content, headings, and key information that was successfully extracted.\n\n**Statistics:**\n- Word Count: ${Math.floor(Math.random() * 2000) + 500}\n- Character Count: ${Math.floor(Math.random() * 10000) + 2000}\n- Links Found: ${Math.floor(Math.random() * 50) + 10}\n- Images Found: ${Math.floor(Math.random() * 20) + 5}`,
          content_length: Math.floor(Math.random() * 5000) + 1000,
        };
      case 'data_analyzer':
        return {
          ...baseResult,
          output: `**Data Analysis Results**\n\nAnalysis Type: ${params.analysis_type}\nData Points: ${params.data?.length || 0}\n\n**Results:**\n- Count: ${params.data?.length || 0}\n- Mean: ${(Math.random() * 100).toFixed(2)}\n- Median: ${(Math.random() * 100).toFixed(2)}\n- Standard Deviation: ${(Math.random() * 20).toFixed(2)}\n- Min: ${(Math.random() * 50).toFixed(2)}\n- Max: ${(Math.random() * 100 + 50).toFixed(2)}`,
          analysis_type: params.analysis_type,
        };
      case 'text_processor':
        return {
          ...baseResult,
          output: `**Text Processing Results**\n\nOperation: ${params.operation}\nText Length: ${params.text?.length || 0} characters\n\n**Results:**\n${getTextProcessingOutput(params.operation, params.text)}`,
          operation: params.operation,
        };
      case 'ai_generation_tool':
        return {
          ...baseResult,
          output: `**AI Generation Results**\n\nPrompt: ${params.prompt}\nModel: ${params.model || 'gpt-4'}\nMax Tokens: ${params.max_tokens || 1000}\n\n**Generated Content:**\nThis is AI-generated content based on your prompt. The content has been created using advanced language models and includes relevant information, examples, and insights related to your request.\n\n**Features:**\n- Creative content generation\n- Context-aware responses\n- Multiple output formats\n- Quality optimization`,
          tokens_used: Math.floor(Math.random() * 500) + 200,
        };
      default:
        return {
          ...baseResult,
          output: `**Tool Execution Results**\n\nTool: ${toolId}\nParameters: ${JSON.stringify(params, null, 2)}\n\n**Result:**\nTool executed successfully with the provided parameters.`,
          message: 'Tool executed successfully',
        };
    }
  };
  const getCometAnalysisOutput = (action: any, url: any) => {
    switch (action) {
      case 'analyze_page':
        return `**Page Analysis:**\n- Title: Sample Web Page\n- Content Quality: 85/100\n- SEO Score: 78/100\n- Accessibility: 82/100\n- Performance: 75/100`;
      case 'summarize_article':
        return `**Article Summary:**\nThis article discusses modern web development practices and AI integration. Key points include performance optimization, user experience enhancement, and implementation strategies.`;
      case 'analyze_sentiment':
        return `**Sentiment Analysis:**\n- Overall Sentiment: Positive\n- Sentiment Score: 0.75\n- Confidence: 87%\n- Emotional Tone: Optimistic and informative`;
      default:
        return `**Analysis Complete:**\nSuccessfully performed ${action} on ${url || 'provided content'}.`;
    }
  };
  const getTextProcessingOutput = (operation: any, text: any) => {
    switch (operation) {
      case 'summarize':
        return `**Summary:**\nGenerated summary of the provided text, highlighting key points and main ideas.`;
      case 'extract_keywords':
        return `**Keywords:**\n- AI (15 occurrences)\n- Web Development (12 occurrences)\n- Performance (8 occurrences)\n- User Experience (6 occurrences)`;
      case 'sentiment':
        return `**Sentiment Analysis:**\n- Sentiment: Positive\n- Score: 0.65\n- Confidence: 82%`;
      default:
        return `**Processed Text:**\nSuccessfully processed text using ${operation} operation.`;
    }
  };
  const categories = [...new Set(mcpTools.map(tool => tool.category))];
  return (
    <div className="flex h-screen overflow-hidden bg-background carbon-texture">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border/50">
          <h1 className="text-3xl font-bold neon-text">MCP Tools</h1>
          <p className="text-muted-foreground mt-2">
            Test and interact with all available Model Context Protocol tools
          </p>
        </div>

        <div className="flex-1 overflow-auto cyber-scrollbar">
          <div className="p-6 max-w-7xl mx-auto">
            <tabs_1.Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <tabs_1.TabsList className="grid w-full grid-cols-3">
                <tabs_1.TabsTrigger value="overview">
                  Overview
                </tabs_1.TabsTrigger>
                <tabs_1.TabsTrigger value="test">Test Tools</tabs_1.TabsTrigger>
                <tabs_1.TabsTrigger value="documentation">
                  Documentation
                </tabs_1.TabsTrigger>
              </tabs_1.TabsList>

              <tabs_1.TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map(category => (
                    <card_1.Card key={category} className="glass-card">
                      <card_1.CardHeader>
                        <card_1.CardTitle className="flex items-center gap-2">
                          <lucide_react_1.Zap className="w-5 h-5 text-primary" />
                          {category}
                        </card_1.CardTitle>
                      </card_1.CardHeader>
                      <card_1.CardContent>
                        <div className="space-y-3">
                          {mcpTools
                            .filter(tool => tool.category === category)
                            .map(tool => (
                              <div
                                key={tool.id}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer"
                                onClick={() => handleToolSelect(tool)}
                              >
                                <div className="flex items-center gap-3">
                                  {tool.icon}
                                  <div>
                                    <p className="font-medium">{tool.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {tool.description.substring(0, 50)}...
                                    </p>
                                  </div>
                                </div>
                                <button_1.Button size="sm" variant="ghost">
                                  <lucide_react_1.Play className="w-4 h-4" />
                                </button_1.Button>
                              </div>
                            ))}
                        </div>
                      </card_1.CardContent>
                    </card_1.Card>
                  ))}
                </div>

                <card_1.Card className="glass-card">
                  <card_1.CardHeader>
                    <card_1.CardTitle className="flex items-center gap-2">
                      <lucide_react_1.Info className="w-5 h-5 text-primary" />
                      MCP Tools Overview
                    </card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-primary/10">
                        <div className="text-2xl font-bold text-primary">
                          {mcpTools.length}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Tools
                        </div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-accent/10">
                        <div className="text-2xl font-bold text-accent">
                          {categories.length}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Categories
                        </div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-green-500/10">
                        <div className="text-2xl font-bold text-green-500">
                          100%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Success Rate
                        </div>
                      </div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>
              </tabs_1.TabsContent>

              <tabs_1.TabsContent value="test" className="space-y-6">
                {selectedTool ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <card_1.Card className="glass-card">
                      <card_1.CardHeader>
                        <card_1.CardTitle className="flex items-center gap-2">
                          {selectedTool.icon}
                          {selectedTool.name}
                        </card_1.CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {selectedTool.description}
                        </p>
                      </card_1.CardHeader>
                      <card_1.CardContent className="space-y-4">
                        {selectedTool.parameters.map(param => (
                          <div key={param.name} className="space-y-2">
                            <label className="text-sm font-medium">
                              {param.name}
                              {param.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </label>
                            {param.type === 'string' && param.options ? (
                              <select_1.Select
                                value={testParams[param.name] || ''}
                                onValueChange={value =>
                                  setTestParams(prev => ({
                                    ...prev,
                                    [param.name]: value,
                                  }))
                                }
                              >
                                <select_1.SelectTrigger>
                                  <select_1.SelectValue
                                    placeholder={`Select ${param.name}`}
                                  />
                                </select_1.SelectTrigger>
                                <select_1.SelectContent>
                                  {param.options.map(option => (
                                    <select_1.SelectItem
                                      key={option}
                                      value={option}
                                    >
                                      {option}
                                    </select_1.SelectItem>
                                  ))}
                                </select_1.SelectContent>
                              </select_1.Select>
                            ) : param.type === 'boolean' ? (
                              <select_1.Select
                                value={testParams[param.name]?.toString() || ''}
                                onValueChange={value =>
                                  setTestParams(prev => ({
                                    ...prev,
                                    [param.name]: value === 'true',
                                  }))
                                }
                              >
                                <select_1.SelectTrigger>
                                  <select_1.SelectValue
                                    placeholder={`Select ${param.name}`}
                                  />
                                </select_1.SelectTrigger>
                                <select_1.SelectContent>
                                  <select_1.SelectItem value="true">
                                    True
                                  </select_1.SelectItem>
                                  <select_1.SelectItem value="false">
                                    False
                                  </select_1.SelectItem>
                                </select_1.SelectContent>
                              </select_1.Select>
                            ) : param.type === 'number' ? (
                              <input_1.Input
                                type="number"
                                placeholder={`Enter ${param.name}`}
                                value={testParams[param.name] || ''}
                                onChange={e =>
                                  setTestParams(prev => ({
                                    ...prev,
                                    [param.name]: Number(e.target.value),
                                  }))
                                }
                              />
                            ) : param.name === 'data' ? (
                              <textarea_1.Textarea
                                placeholder="Enter data as JSON array, e.g., [1, 2, 3, 4, 5]"
                                value={testParams[param.name] || ''}
                                onChange={e => {
                                  try {
                                    const data = JSON.parse(e.target.value);
                                    setTestParams(prev => ({
                                      ...prev,
                                      [param.name]: data,
                                    }));
                                  } catch {
                                    setTestParams(prev => ({
                                      ...prev,
                                      [param.name]: e.target.value,
                                    }));
                                  }
                                }}
                              />
                            ) : (
                              <input_1.Input
                                placeholder={`Enter ${param.name}`}
                                value={testParams[param.name] || ''}
                                onChange={e =>
                                  setTestParams(prev => ({
                                    ...prev,
                                    [param.name]: e.target.value,
                                  }))
                                }
                              />
                            )}
                            <p className="text-xs text-muted-foreground">
                              {param.description}
                            </p>
                          </div>
                        ))}

                        <button_1.Button
                          onClick={handleTestRun}
                          disabled={isLoading}
                          className="w-full gradient-cyber-primary hover:gradient-cyber-secondary"
                        >
                          {isLoading ? (
                            <>
                              <lucide_react_1.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Testing...
                            </>
                          ) : (
                            <>
                              <lucide_react_1.Play className="w-4 h-4 mr-2" />
                              Test Tool
                            </>
                          )}
                        </button_1.Button>
                      </card_1.CardContent>
                    </card_1.Card>

                    <card_1.Card className="glass-card">
                      <card_1.CardHeader>
                        <card_1.CardTitle className="flex items-center gap-2">
                          {testResults?.success ? (
                            <lucide_react_1.CheckCircle className="w-5 h-5 text-green-500" />
                          ) : testResults ? (
                            <lucide_react_1.XCircle className="w-5 h-5 text-red-500" />
                          ) : (
                            <lucide_react_1.Info className="w-5 h-5 text-muted-foreground" />
                          )}
                          Test Results
                        </card_1.CardTitle>
                      </card_1.CardHeader>
                      <card_1.CardContent>
                        {testResults ? (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <badge_1.Badge
                                variant={
                                  testResults.success
                                    ? 'default'
                                    : 'destructive'
                                }
                              >
                                {testResults.success ? 'Success' : 'Error'}
                              </badge_1.Badge>
                              <span className="text-sm text-muted-foreground">
                                {testResults.execution_time_ms}ms
                              </span>
                            </div>

                            <div className="bg-muted/50 p-4 rounded-lg">
                              <pre className="text-sm whitespace-pre-wrap">
                                {testResults.output || testResults.error}
                              </pre>
                            </div>

                            {testResults.suggestions && (
                              <div>
                                <h4 className="font-medium mb-2">
                                  Suggestions:
                                </h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  {testResults.suggestions.map(
                                    (suggestion, index) => (
                                      <li key={index}>{suggestion}</li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground py-8">
                            <lucide_react_1.Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>Run a test to see results here</p>
                          </div>
                        )}
                      </card_1.CardContent>
                    </card_1.Card>
                  </div>
                ) : (
                  <card_1.Card className="glass-card">
                    <card_1.CardContent className="text-center py-12">
                      <lucide_react_1.Info className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-medium mb-2">
                        Select a Tool to Test
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Choose a tool from the overview to start testing its
                        functionality
                      </p>
                      <button_1.Button onClick={() => setActiveTab('overview')}>
                        Browse Tools
                      </button_1.Button>
                    </card_1.CardContent>
                  </card_1.Card>
                )}

                {/* Quick Examples */}
                <card_1.Card className="glass-card">
                  <card_1.CardHeader>
                    <card_1.CardTitle>Quick Examples</card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mcpTools.map(tool => (
                        <div key={tool.id} className="space-y-2">
                          <h4 className="font-medium flex items-center gap-2">
                            {tool.icon}
                            {tool.name}
                          </h4>
                          <div className="space-y-1">
                            {tool.examples.slice(0, 2).map((example, index) => (
                              <button_1.Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start text-left h-auto p-2"
                                onClick={() => {
                                  setSelectedTool(tool);
                                  setTestParams(example.params);
                                  setTestResults(null);
                                }}
                              >
                                <div>
                                  <div className="font-medium">
                                    {example.title}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {example.description}
                                  </div>
                                </div>
                              </button_1.Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </card_1.CardContent>
                </card_1.Card>
              </tabs_1.TabsContent>

              <tabs_1.TabsContent value="documentation" className="space-y-6">
                <card_1.Card className="glass-card">
                  <card_1.CardHeader>
                    <card_1.CardTitle>MCP Tools Documentation</card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        What are MCP Tools?
                      </h3>
                      <p className="text-muted-foreground">
                        Model Context Protocol (MCP) tools are AI-powered
                        utilities that can be integrated into your applications
                        to provide advanced functionality. These tools leverage
                        various AI models and APIs to perform complex tasks like
                        code analysis, web scraping, data processing, and
                        content generation.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Available Tools
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mcpTools.map(tool => (
                          <div key={tool.id} className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              {tool.icon}
                              <h4 className="font-medium">{tool.name}</h4>
                              <badge_1.Badge variant="outline">
                                {tool.category}
                              </badge_1.Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {tool.description}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              <strong>Parameters:</strong>{' '}
                              {tool.parameters.length}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <alert_1.Alert>
                      <lucide_react_1.Info className="h-4 w-4" />
                      <alert_1.AlertDescription>
                        All MCP tools are currently running in simulation mode.
                        In production, these tools would connect to real APIs
                        and services to provide actual functionality.
                      </alert_1.AlertDescription>
                    </alert_1.Alert>
                  </card_1.CardContent>
                </card_1.Card>
              </tabs_1.TabsContent>
            </tabs_1.Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
