import type { INode } from '../../types';

export const LogNode: INode = {
  id: 'core.log',
  type: 'core.log',
  label: 'Log',
  inputs: [
    { name: 'message', type: 'string', required: true }
  ],
  outputs: [
    { name: 'result', type: 'void' }
  ],
  async execute(payload) {
    const message = String(payload?.message ?? '');
    // eslint-disable-next-line no-console
    console.log('[LogNode]:', message);
    return { result: undefined };
  }
};


