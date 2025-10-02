export interface INodeInput {
  name: string;
  type: string;
  required?: boolean;
}

export interface INodeOutput {
  name: string;
  type: string;
}

export interface IConnection {
  fromNodeId: string;
  fromOutput: string;
  toNodeId: string;
  toInput: string;
}

export interface INodeContext {
  // Placeholder for services access (fs, http, secrets, etc.)
  [key: string]: unknown;
}

export interface INode {
  id: string;
  type: string;
  label?: string;
  inputs: INodeInput[];
  outputs: INodeOutput[];
  execute(payload: Record<string, unknown>, ctx?: INodeContext): Promise<Record<string, unknown>> | Record<string, unknown>;
}

export interface IWorkflow {
  id: string;
  name: string;
  nodes: INode[];
  connections: IConnection[];
  createdAt?: number;
  updatedAt?: number;
}


