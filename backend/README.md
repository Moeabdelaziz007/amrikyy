# Amrikyy AIOS Backend API

A comprehensive backend API server for the Amrikyy AIOS System, built with Node.js, Express.js, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Task Management**: Complete CRUD operations for tasks with subtasks, comments, and collaboration
- **User Management**: User profiles, preferences, and statistics
- **File Management**: File upload, download, and management system
- **Real-time Features**: WebSocket integration for live updates and notifications
- **Analytics & Insights**: Comprehensive analytics and AI-powered insights
- **Automation**: Rule-based automation system
- **AI Integration**: AI assistant, voice commands, and intelligent recommendations
- **Notification System**: Multi-channel notifications (email, push, desktop)
- **Security**: Rate limiting, CORS, helmet, and input validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **File Upload**: Multer
- **Email**: Nodemailer
- **Logging**: Winston
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration values.

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/amrikyy-aios
REDIS_URL=redis://localhost:6379

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./public/uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# AI Services
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# External APIs
WEATHER_API_KEY=your-weather-api-key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify JWT token
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics
- `PUT /api/users/preferences` - Update user preferences
- `DELETE /api/users/account` - Delete user account

### Tasks
- `GET /api/tasks` - Get user's tasks (with filtering and pagination)
- `GET /api/tasks/stats` - Get task statistics
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/subtasks` - Add subtask
- `PUT /api/tasks/:id/subtasks/:subtaskId` - Update subtask
- `POST /api/tasks/:id/comments` - Add comment
- `POST /api/tasks/:id/share` - Share task with another user

### Files
- `POST /api/files/upload` - Upload single file
- `POST /api/files/upload-multiple` - Upload multiple files
- `GET /api/files` - Get user's files
- `GET /api/files/:filename` - Get file information
- `DELETE /api/files/:filename` - Delete file

### Notifications
- `GET /api/notifications` - Get user's notifications
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/stats` - Get notification statistics

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics
- `GET /api/analytics/productivity` - Get productivity analytics
- `GET /api/analytics/performance` - Get performance analytics
- `GET /api/analytics/insights` - Get AI-powered insights

### Automation
- `GET /api/automation/rules` - Get automation rules
- `POST /api/automation/rules` - Create automation rule
- `PUT /api/automation/rules/:id` - Update automation rule
- `DELETE /api/automation/rules/:id` - Delete automation rule
- `POST /api/automation/rules/:id/execute` - Execute automation rule
- `GET /api/automation/logs` - Get automation logs
- `GET /api/automation/templates` - Get automation templates
- `GET /api/automation/stats` - Get automation statistics

### AI
- `POST /api/ai/chat` - Send message to AI assistant
- `GET /api/ai/sessions` - Get AI chat sessions
- `GET /api/ai/sessions/:id` - Get specific AI session
- `DELETE /api/ai/sessions/:id` - Delete AI session
- `POST /api/ai/insights` - Generate AI insights
- `GET /api/ai/insights` - Get AI insights
- `POST /api/ai/recommendations` - Get AI recommendations
- `POST /api/ai/voice-command` - Process voice command

## WebSocket Events

### Client to Server
- `authenticate` - Authenticate user
- `task:update` - Update task
- `task:comment` - Add task comment
- `collaboration:join` - Join task collaboration
- `collaboration:leave` - Leave task collaboration
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator
- `notification:mark-read` - Mark notification as read
- `presence:update` - Update user presence

### Server to Client
- `authenticated` - Authentication successful
- `task:updated` - Task updated
- `task:commented` - Task commented
- `collaboration:user-joined` - User joined collaboration
- `collaboration:user-left` - User left collaboration
- `typing:started` - User started typing
- `typing:stopped` - User stopped typing
- `notification:new` - New notification
- `notification:marked-read` - Notification marked as read
- `presence:updated` - User presence updated

## Database Models

### User
- User profile information
- Preferences and settings
- Statistics and activity tracking
- Subscription information

### Task
- Task details and metadata
- Subtasks and comments
- Collaboration and sharing
- Automation rules
- Time tracking

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevent abuse with request rate limiting
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers and protection
- **Input Validation**: Comprehensive input validation and sanitization
- **File Upload Security**: File type and size restrictions
- **Role-based Access Control**: User role and permission management

## Error Handling

- Comprehensive error handling middleware
- Structured error responses
- Logging and monitoring
- Graceful error recovery

## Logging

- Winston-based logging system
- Multiple log levels (error, warn, info, debug)
- File and console output
- Request/response logging
- Error tracking and monitoring

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Deployment

### Docker
```bash
# Build Docker image
docker build -t amrikyy-aios-backend .

# Run Docker container
docker run -p 3001:3001 amrikyy-aios-backend
```

### PM2
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name "amrikyy-aios-backend"

# Monitor application
pm2 monit
```

## Monitoring

- Health check endpoint: `GET /health`
- Application metrics and statistics
- Performance monitoring
- Error tracking and alerting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please contact the development team or create an issue in the repository.
