import React, { useState } from 'react';
import Canvas from './components/Canvas';
import { automationService } from '../../core/services/automation.service';
import { LogNode } from '../../core/automation/nodes/core/Log.node';
import type { IWorkflow } from '../../core/automation/types';

const AutomationsApp: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const runExample = async () => {
    setRunning(true);
    setResult(null);
    automationService.registerNode(LogNode);
    const wf: IWorkflow = {
      id: 'example-log',
      name: 'Example Log',
      nodes: [
        LogNode,
      ],
      connections: [],
    };
    const res = await automationService.executeWorkflow(wf);
    setResult(res);
    setRunning(false);
  };
  return (
    <div className="aura-automations h-full w-full">
      <header className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">Workflow Editor</h1>
          <button className="px-3 py-1 rounded border border-border" onClick={runExample} disabled={running}>
            {running ? 'Running...' : 'Run Example'}
          </button>
        </div>
      </header>
      <main className="h-[calc(100%-56px)]">
        <Canvas />
        {result && (
          <pre className="p-3 text-xs opacity-80">{JSON.stringify(result, null, 2)}</pre>
        )}
      </main>
    </div>
  );
};

export default AutomationsApp;


