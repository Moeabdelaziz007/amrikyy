/**
 * Main entry point for AuraOS Automation Engine
 */

import 'dotenv/config';
import app from './api';

console.log('AuraOS Automation Engine starting...');

// Start the server
const startServer = async () => {
  try {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 AuraOS Automation API running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📋 Available endpoints:`);
      console.log(`   GET  /health - Health check`);
      console.log(`   GET  /task-types - Available task types`);
      console.log(`   POST /tasks - Create new task`);
      console.log(`   GET  /tasks/:id - Get task by ID`);
      console.log(`   POST /tasks/:id/execute - Execute task`);
      console.log(`   GET  /executions/:id - Get execution by ID`);
      console.log(`   GET  /tasks/:id/executions - Get task executions`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
