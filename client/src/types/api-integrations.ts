/**
 * أنواع البيانات لتكامل APIs
 * API Integration Types
 */

export interface ApiCredentials {
  id: string;
  name: string;
  type: ApiProvider;
  credentials: Record<string, string>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum ApiProvider {
  SLACK = 'slack',
  DISCORD = 'discord',
  GITHUB_ACTIONS = 'github_actions',
  TELEGRAM = 'telegram',
  EMAIL = 'email',
  WEBHOOK = 'webhook'
}

export interface ApiAction {
  id: string;
  name: string;
  provider: ApiProvider;
  actionType: string;
  parameters: Record<string, any>;
  retryConfig?: RetryConfig;
  timeout?: number;
}

export interface RetryConfig {
  maxRetries: number;
  delay: number;
  backoffMultiplier: number;
  maxDelay: number;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  statusCode?: number;
  timestamp: Date;
}

export interface ApiIntegrationConfig {
  baseUrl?: string;
  timeout: number;
  retryConfig: RetryConfig;
  rateLimitConfig?: RateLimitConfig;
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  burstLimit: number;
}

// Slack Types
export interface SlackConfig {
  botToken: string;
  appToken?: string;
  signingSecret: string;
  channelId?: string;
  workspaceId?: string;
}

export interface SlackMessage {
  channel: string;
  text: string;
  blocks?: any[];
  attachments?: any[];
  thread_ts?: string;
  reply_broadcast?: boolean;
}

export interface SlackChannel {
  id: string;
  name: string;
  is_private: boolean;
  is_archived: boolean;
  members?: string[];
}

// Discord Types
export interface DiscordConfig {
  botToken: string;
  clientId: string;
  guildId?: string;
  channelId?: string;
}

export interface DiscordMessage {
  content: string;
  embeds?: DiscordEmbed[];
  components?: any[];
  files?: any[];
  tts?: boolean;
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: DiscordEmbedField[];
  footer?: DiscordEmbedFooter;
  timestamp?: string;
}

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbedFooter {
  text: string;
  icon_url?: string;
}

// GitHub Actions Types
export interface GitHubActionsConfig {
  token: string;
  owner: string;
  repo: string;
  workflowId?: string;
}

export interface GitHubWorkflowRun {
  id: number;
  name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required';
  created_at: string;
  updated_at: string;
  run_number: number;
  workflow_id: number;
}

export interface GitHubWorkflowDispatch {
  ref: string;
  inputs?: Record<string, string>;
}

// Telegram Types
export interface TelegramConfig {
  botToken: string;
  chatId?: string;
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
}

export interface TelegramMessage {
  chat_id: string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  reply_markup?: any;
  disable_web_page_preview?: boolean;
}

// Webhook Types
export interface WebhookConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  timeout?: number;
}

export interface WebhookPayload {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
}

// Email Types
export interface EmailConfig {
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  from: string;
}

export interface EmailMessage {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: any[];
}

// Execution Context
export interface ExecutionContext {
  workflowId: string;
  nodeId: string;
  executionId: string;
  variables: Record<string, any>;
  credentials: Record<string, ApiCredentials>;
}

// Error Types
export interface ApiError extends Error {
  provider: ApiProvider;
  statusCode?: number;
  response?: any;
  retryable: boolean;
}

export interface ValidationError extends Error {
  field: string;
  value: any;
  rule: string;
}
