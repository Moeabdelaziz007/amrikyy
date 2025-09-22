# AuraOS Automation Server

Backend API server for the AuraOS Automation Platform - a professional workflow automation system better than n8n.

## Features

- **RESTful API** with TypeScript and Express
- **Database Integration** with PostgreSQL and Drizzle ORM
- **Real-time Monitoring** with system health checks
- **MCP Tools Integration** for Model Context Protocol
- **AI Workflow Optimization** with intelligent suggestions
- **Workspace Management** with collaborative features
- **Task Execution Engine** with scheduling and monitoring
- **Security** with authentication, authorization, and rate limiting

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for caching)

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Set up the database:**

```bash
# Create PostgreSQL database
createdb auraos_automation

# Run migrations (when available)
npm run migrate
```

4. **Start the development server:**

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check

- `GET /health` - Server health status

### Workspaces

- `GET /api/v1/workspaces` - List workspaces
- `POST /api/v1/workspaces` - Create workspace
- `GET /api/v1/workspaces/:id` - Get workspace
- `PUT /api/v1/workspaces/:id` - Update workspace
- `DELETE /api/v1/workspaces/:id` - Delete workspace

### Automation Tasks

- `GET /api/v1/tasks` - List tasks
- `POST /api/v1/tasks` - Create task
- `GET /api/v1/tasks/:id` - Get task
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task
- `POST /api/v1/tasks/:id/execute` - Execute task
- `PATCH /api/v1/tasks/:id/pause` - Pause task
- `PATCH /api/v1/tasks/:id/resume` - Resume task

### MCP Tools

- `GET /api/v1/mcp-tools` - List MCP tools
- `GET /api/v1/mcp-tools/:id` - Get MCP tool
- `POST /api/v1/mcp-tools/:id/install` - Install tool
- `DELETE /api/v1/mcp-tools/:id/uninstall` - Uninstall tool
- `PUT /api/v1/mcp-tools/:id/configure` - Configure tool
- `POST /api/v1/mcp-tools/:id/execute` - Execute tool

### System Monitoring

- `GET /api/v1/system/health` - System health status
- `GET /api/v1/system/metrics` - System metrics
- `GET /api/v1/system/alerts` - System alerts
- `PATCH /api/v1/system/alerts/:id/resolve` - Resolve alert

### Analytics

- `GET /api/v1/analytics` - General analytics
- `GET /api/v1/analytics/tasks/:id` - Task analytics
- `GET /api/v1/analytics/workspaces/:id` - Workspace analytics

## Database Schema

The server uses PostgreSQL with the following main tables:

- `users` - User accounts and authentication
- `workspaces` - Workspace management
- `workspace_members` - Workspace membership
- `automation_tasks` - Automation tasks and workflows
- `task_executions` - Task execution history
- `execution_logs` - Detailed execution logs
- `mcp_tools` - MCP tool definitions
- `tool_integrations` - Tool integration configurations
- `workflow_suggestions` - AI-generated suggestions
- `optimization_results` - Optimization analysis results
- `workflow_templates` - Reusable workflow templates
- `system_health` - System health monitoring
- `monitoring_metrics` - Performance metrics
- `system_alerts` - System alerts and notifications

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Project Structure

```
server/
├── api/
│   └── automation/
│       ├── types.ts          # TypeScript interfaces
│       ├── schema.ts         # Database schema
│       ├── database.ts       # Database connection
│       └── routes.ts         # API routes
├── dist/                     # Built files
├── index.ts                  # Main server file
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Variables

Key environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `CLIENT_URL` - Frontend URL for CORS

## Security Features

- **Helmet.js** for security headers
- **CORS** configuration
- **Rate limiting** (configurable)
- **JWT authentication**
- **Input validation** with Zod
- **SQL injection protection** with Drizzle ORM
- **Error handling** with proper status codes

## Monitoring

The server includes comprehensive monitoring:

- **Health checks** at `/health`
- **System metrics** collection
- **Alert management**
- **Performance monitoring**
- **Error tracking**

## Integration

The server is designed to work seamlessly with the AuraOS frontend:

- **Real-time data** synchronization
- **WebSocket support** for live updates
- **File upload** handling
- **Export/Import** functionality
- **API versioning** support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
