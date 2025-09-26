module.exports = {
  apps: [{
    name: 'auraos-backend',
    script: 'dist/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3002,
      DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost:5432/auraos',
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
      GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
      REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3002
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
