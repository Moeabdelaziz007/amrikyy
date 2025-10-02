import { IService, ServiceInitOptions } from './types/os';
import { automationService } from './services/automation.service';
import { LogNode } from './automation/nodes/core/Log.node';
import { aiService } from './services/ai.service';

export class Kernel {
  private static instance: Kernel | null = null;
  private services: Map<string, IService> = new Map();
  private started = false;

  private constructor() {}

  public static getInstance(): Kernel {
    if (!Kernel.instance) Kernel.instance = new Kernel();
    return Kernel.instance;
  }

  public registerService(service: IService): void {
    if (this.services.has(service.name)) return;
    this.services.set(service.name, service);
  }

  public getService<T extends IService = IService>(name: string): T {
    const svc = this.services.get(name);
    if (!svc) throw new Error(`Service not found: ${name}`);
    return svc as T;
  }

  public async start(_options?: ServiceInitOptions): Promise<void> {
    if (this.started) return;
    // Pre-register known services
    this.registerService(automationService);
    this.registerService(aiService);
    for (const service of this.services.values()) {
      await service.start?.();
    }
    // Register core nodes
    try {
      automationService.registerNode(LogNode);
    } catch {}
    this.started = true;
  }
}

export const kernel = Kernel.getInstance();


