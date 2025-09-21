-- AuraOS Automation Platform - Database Initialization Script

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create database if it doesn't exist (this will be handled by Docker)
-- CREATE DATABASE auraos_automation;

-- Connect to the database
\c auraos_automation;

-- Create custom types/enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'user', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_type AS ENUM ('workflow', 'trigger', 'action', 'condition', 'ai', 'mcp');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_category AS ENUM ('social_media', 'email', 'data', 'ai', 'integration', 'notification');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('active', 'inactive', 'draft', 'error', 'running', 'paused');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE execution_status AS ENUM ('pending', 'running', 'completed', 'failed', 'cancelled', 'retrying');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE log_level AS ENUM ('info', 'warning', 'error', 'debug');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

CREATE INDEX IF NOT EXISTS idx_workspaces_owner ON workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_public ON workspaces(is_public);
CREATE INDEX IF NOT EXISTS idx_workspaces_created ON workspaces(created_at);

CREATE INDEX IF NOT EXISTS idx_tasks_workspace ON automation_tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON automation_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON automation_tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_type ON automation_tasks(type);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON automation_tasks(category);
CREATE INDEX IF NOT EXISTS idx_tasks_created ON automation_tasks(created_at);

CREATE INDEX IF NOT EXISTS idx_executions_task ON task_executions(task_id);
CREATE INDEX IF NOT EXISTS idx_executions_user ON task_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_executions_status ON task_executions(status);
CREATE INDEX IF NOT EXISTS idx_executions_started ON task_executions(started_at);

CREATE INDEX IF NOT EXISTS idx_logs_execution ON execution_logs(execution_id);
CREATE INDEX IF NOT EXISTS idx_logs_level ON execution_logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON execution_logs(timestamp);

CREATE INDEX IF NOT EXISTS idx_mcp_tools_category ON mcp_tools(category);
CREATE INDEX IF NOT EXISTS idx_mcp_tools_status ON mcp_tools(status);
CREATE INDEX IF NOT EXISTS idx_mcp_tools_official ON mcp_tools(is_official);

CREATE INDEX IF NOT EXISTS idx_suggestions_user ON workflow_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_category ON workflow_suggestions(category);
CREATE INDEX IF NOT EXISTS idx_suggestions_applied ON workflow_suggestions(applied);

CREATE INDEX IF NOT EXISTS idx_templates_user ON workflow_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_public ON workflow_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_templates_official ON workflow_templates(is_official);

CREATE INDEX IF NOT EXISTS idx_health_timestamp ON system_health(timestamp);
CREATE INDEX IF NOT EXISTS idx_metrics_name ON monitoring_metrics(name);
CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON monitoring_metrics(timestamp);

CREATE INDEX IF NOT EXISTS idx_alerts_type ON system_alerts(type);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON system_alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_alerts_timestamp ON system_alerts(timestamp);

-- Insert default admin user (password: admin123)
INSERT INTO users (id, email, name, role, permissions, is_active, created_at, updated_at)
VALUES (
    uuid_generate_v4(),
    'admin@auraos.com',
    'AuraOS Admin',
    'admin',
    ARRAY['read', 'write', 'delete', 'admin'],
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert sample workspace
INSERT INTO workspaces (id, name, description, color, icon, is_public, is_default, owner_id, task_count, tags, settings, created_at, updated_at)
SELECT 
    uuid_generate_v4(),
    'Default Workspace',
    'Default workspace for getting started with automation',
    '#3B82F6',
    '🏠',
    false,
    true,
    u.id,
    0,
    ARRAY['default', 'getting-started'],
    '{
        "autoSave": true,
        "notifications": true,
        "theme": "light",
        "layout": "grid",
        "sortBy": "name",
        "groupBy": "none"
    }'::jsonb,
    NOW(),
    NOW()
FROM users u 
WHERE u.email = 'admin@auraos.com'
ON CONFLICT DO NOTHING;

-- Insert sample MCP tools
INSERT INTO mcp_tools (id, name, description, category, icon, version, status, capabilities, usage, last_used, performance, settings, dependencies, integrations, documentation, examples, is_official, is_verified, rating, downloads, author, created_at, updated_at)
VALUES 
(
    uuid_generate_v4(),
    'Database Query Tool',
    'Execute SQL queries and manage database connections',
    'database',
    '🗄️',
    '1.0.0',
    'active',
    ARRAY['sql_execution', 'data_export', 'schema_analysis'],
    0,
    NOW(),
    '{
        "avgResponseTime": 150,
        "successRate": 0.98,
        "errorRate": 0.02,
        "uptime": 0.999,
        "resourceUsage": {
            "cpu": 5,
            "memory": 128,
            "storage": 1024
        }
    }'::jsonb,
    '{
        "autoUpdate": true,
        "notifications": true,
        "logging": true,
        "rateLimit": 100,
        "timeout": 30000,
        "retryAttempts": 3,
        "security": {
            "encryption": true,
            "authentication": true,
            "authorization": true
        }
    }'::jsonb,
    ARRAY['postgresql', 'mysql'],
    ARRAY[]::jsonb,
    'Execute SQL queries safely with built-in security features.',
    ARRAY[]::jsonb,
    true,
    true,
    4.8,
    1250,
    '{
        "id": "auraos-team",
        "name": "AuraOS Team",
        "avatar": "https://avatars.githubusercontent.com/u/auraos",
        "verified": true
    }'::jsonb,
    NOW(),
    NOW()
),
(
    uuid_generate_v4(),
    'Webhook Trigger',
    'Trigger workflows from external webhook calls',
    'web',
    '🔗',
    '1.0.0',
    'active',
    ARRAY['webhook_reception', 'payload_parsing', 'custom_headers'],
    0,
    NOW(),
    '{
        "avgResponseTime": 50,
        "successRate": 0.99,
        "errorRate": 0.01,
        "uptime": 0.999,
        "resourceUsage": {
            "cpu": 2,
            "memory": 64,
            "storage": 512
        }
    }'::jsonb,
    '{
        "autoUpdate": true,
        "notifications": true,
        "logging": true,
        "rateLimit": 1000,
        "timeout": 5000,
        "retryAttempts": 1,
        "security": {
            "encryption": true,
            "authentication": false,
            "authorization": false
        }
    }'::jsonb,
    ARRAY[]::text,
    ARRAY[]::jsonb,
    'Receive webhook calls and trigger automation workflows.',
    ARRAY[]::jsonb,
    true,
    true,
    4.9,
    2100,
    '{
        "id": "auraos-team",
        "name": "AuraOS Team",
        "avatar": "https://avatars.githubusercontent.com/u/auraos",
        "verified": true
    }'::jsonb,
    NOW(),
    NOW()
);

-- Create function to update task count in workspaces
CREATE OR REPLACE FUNCTION update_workspace_task_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE workspaces 
        SET task_count = task_count + 1 
        WHERE id = NEW.workspace_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE workspaces 
        SET task_count = GREATEST(task_count - 1, 0) 
        WHERE id = OLD.workspace_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update workspace task counts
DROP TRIGGER IF EXISTS trigger_update_workspace_task_count ON automation_tasks;
CREATE TRIGGER trigger_update_workspace_task_count
    AFTER INSERT OR DELETE ON automation_tasks
    FOR EACH ROW EXECUTE FUNCTION update_workspace_task_count();

-- Create function to clean up old logs
CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM execution_logs 
    WHERE timestamp < NOW() - INTERVAL '30 days';
    
    DELETE FROM system_health 
    WHERE timestamp < NOW() - INTERVAL '7 days';
    
    DELETE FROM monitoring_metrics 
    WHERE timestamp < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- Set timezone
SET timezone = 'UTC';

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'AuraOS Automation Platform database initialized successfully!';
END $$;
