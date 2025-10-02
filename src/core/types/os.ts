// Core OS type definitions for AuraOS kernel and services

export interface IService {
  readonly name: string;
  start(): Promise<void> | void;
  stop?(): Promise<void> | void;
}

export interface ServiceInitOptions {
  // Placeholder for future dependency injection/config
}

export interface IAppManifest {
  id: string;
  name: string;
  icon?: string;
  permissions?: string[];
  entry?: () => Promise<unknown>;
}

export type ProcessId = string;

export interface IProcess {
  pid: ProcessId;
  appId: string;
  startedAt: number;
  metadata?: Record<string, unknown>;
}


