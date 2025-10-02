import { IService } from '../types/os';

export class AIService implements IService {
  public readonly name = 'ai';

  start(): void {}

  async summarizeText(text: string): Promise<string> {
    return `Summary: ${text.slice(0, 120)}${text.length > 120 ? '…' : ''}`;
  }

  async extractActionItems(text: string): Promise<string[]> {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    return lines.filter(l => /^(todo:|action:|-)/i.test(l));
  }

  async getEmbeddings(_text: string): Promise<number[]> {
    return [0.1, 0.2, 0.3, 0.4];
  }
}

export const aiService = new AIService();


