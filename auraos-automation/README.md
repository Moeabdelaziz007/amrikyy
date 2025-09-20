# AuraOS Task Automation Engine

A powerful task automation engine with Firestore persistence and REST API.

## Features

- 🔧 **Task Types**: HTTP requests, database queries, file operations, notifications
- 📊 **Firestore Integration**: Persistent storage for tasks, executions, and schedules
- 🚀 **REST API**: Complete API for task management and execution
- ⚡ **Real-time Execution**: Execute tasks with detailed monitoring
- 🎯 **TypeScript**: Full type safety and modern development experience

## Quick Start

### Prerequisites

- Node.js 18+
- Firebase project with Firestore enabled
- Service account credentials

### Installation

```bash
# Clone and install dependencies
cd auraos-automation
npm install

# Copy environment file
cp env.example .env

# Configure your Firebase credentials in .env
```

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Generate a service account key:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file as `serviceAccount.json` in the project root
4. Update `.env` with your credentials:

```env
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json
PORT=3000
NODE_ENV=development
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## API Endpoints

### Health Check
```
GET /health
```

### Task Management
```
GET    /task-types              # Get available task types
POST   /tasks                   # Create new task
GET    /tasks/:id               # Get task by ID
POST   /tasks/:id/execute       # Execute task
GET    /tasks/:id/executions    # Get task executions
```

### Execution Management
```
GET    /executions/:id          # Get execution by ID
```

## Usage Examples

### Create an HTTP Request Task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fetch User Data",
    "type": "http_request",
    "config": {
      "url": "https://jsonplaceholder.typicode.com/users/1",
      "method": "GET"
    },
    "metadata": {
      "description": "Fetch user data from API",
      "tags": ["api", "users"]
    }
  }'
```

### Execute a Task

```bash
curl -X POST http://localhost:3000/tasks/{taskId}/execute \
  -H "Content-Type: application/json" \
  -d '{
    "input": {}
  }'
```

## Supported Task Types

- **http_request**: Make HTTP requests
- **database_query**: Execute database queries
- **file_operation**: File system operations
- **email_send**: Send emails
- **telegram_notify**: Send Telegram messages
- **slack_notify**: Send Slack messages
- **custom_script**: Execute custom scripts

## Project Structure

```
src/
├── types/
│   └── task.ts                 # Type definitions
├── adapters/
│   └── firestoreAdapter.ts     # Firestore integration
├── taskAutomationEngine.ts     # Core engine
├── api.ts                      # Express API
└── index.ts                    # Entry point
```

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (coming soon)

### Environment Variables

See `env.example` for all available configuration options.

## Next Steps (Sprint 1)

- [ ] Full persistence layer
- [ ] React dashboard
- [ ] WebSocket real-time updates
- [ ] Task scheduling with cron
- [ ] Worker management

## License

ISC
