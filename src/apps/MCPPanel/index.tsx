import React, { useState, useEffect } from 'react';
import { mcpService, type SystemStatus, type CommandResult } from '../../core/services/mcp.service';

const MCPPanel: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [command, setCommand] = useState('');
  const [results, setResults] = useState<CommandResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSystemStatus();
  }, []);

  const loadSystemStatus = async () => {
    try {
      const systemStatus = await mcpService.getSystemStatus();
      setStatus(systemStatus);
    } catch (error) {
      console.error('Failed to load system status:', error);
    }
  };

  const handleCommand = async () => {
    if (!command.trim()) return;

    setLoading(true);
    try {
      const result = await mcpService.executeCommand(command);
      setResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
      setCommand('');
    } catch (error) {
      console.error('Command execution failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand();
    }
  };

  return (
    <div className="aura-mcp h-full w-full bg-gray-900 text-white">
      {/* Header */}
      <header className="p-4 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            ⚙️
          </div>
          <div>
            <h1 className="text-lg font-semibold">Master Control Program</h1>
            <p className="text-sm text-white/70">System monitoring and control</p>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100%-80px)]">
        {/* System Status Panel */}
        <div className="w-1/2 p-4 border-r border-white/20">
          <h2 className="text-md font-semibold mb-4 text-cyan-400">System Status</h2>
          
          {status ? (
            <div className="space-y-4">
              {/* Uptime */}
              <div className="glass rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/70">Uptime</span>
                  <span className="font-mono text-cyan-400">
                    {Math.floor(status.uptime / 1000)}s
                  </span>
                </div>
              </div>

              {/* Memory */}
              <div className="glass rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/70">Memory</span>
                  <span className="font-mono text-cyan-400">
                    {status.memory.used}MB / {status.memory.total}MB
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${status.memory.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-white/50 mt-1">
                  {status.memory.percentage}% used
                </div>
              </div>

              {/* CPU */}
              <div className="glass rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/70">CPU Usage</span>
                  <span className="font-mono text-cyan-400">
                    {status.cpu.usage}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${status.cpu.usage}%` }}
                  />
                </div>
                <div className="text-xs text-white/50 mt-1">
                  {status.cpu.cores} cores
                </div>
              </div>

              {/* Services */}
              <div className="glass rounded-lg p-3">
                <h3 className="text-sm font-semibold mb-2 text-cyan-400">Services</h3>
                <div className="space-y-1">
                  {status.services.map((service, index) => (
                    <div key={index} className="flex justify-between items-center text-xs">
                      <span className="text-white/70">{service.name}</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          service.status === 'running' ? 'bg-green-400' : 
                          service.status === 'error' ? 'bg-red-400' : 'bg-yellow-400'
                        }`} />
                        <span className="text-white/50">
                          {Math.floor(service.uptime / 1000)}s
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Processes */}
              <div className="glass rounded-lg p-3">
                <h3 className="text-sm font-semibold mb-2 text-cyan-400">Processes</h3>
                <div className="space-y-1">
                  {status.processes.map((process, index) => (
                    <div key={index} className="flex justify-between items-center text-xs">
                      <span className="text-white/70">{process.name}</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          process.status === 'active' ? 'bg-green-400' : 
                          process.status === 'error' ? 'bg-red-400' : 'bg-yellow-400'
                        }`} />
                        <span className="text-white/50">{process.memory}MB</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass rounded-lg p-4 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-white/70">Loading system status...</p>
            </div>
          )}
        </div>

        {/* Command Interface */}
        <div className="w-1/2 p-4">
          <h2 className="text-md font-semibold mb-4 text-cyan-400">Command Interface</h2>
          
          {/* Command Input */}
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter MCP command..."
                className="flex-1 px-3 py-2 bg-gray-800 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                disabled={loading}
              />
              <button
                onClick={handleCommand}
                disabled={loading || !command.trim()}
                className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold rounded-lg hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? '⏳' : '▶️'}
              </button>
            </div>
            <div className="mt-2 text-xs text-white/50">
              Try: <code className="bg-gray-800 px-1 rounded">status</code>, 
              <code className="bg-gray-800 px-1 rounded ml-1">services</code>, 
              <code className="bg-gray-800 px-1 rounded ml-1">processes</code>
            </div>
          </div>

          {/* Command Results */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div key={index} className="glass rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      result.success ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    <span className="text-xs text-white/70">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <span className="text-xs text-white/50">
                    {result.executionTime}ms
                  </span>
                </div>
                <div className="font-mono text-sm text-white">
                  {result.output || result.error}
                </div>
              </div>
            ))}
          </div>

          {results.length === 0 && (
            <div className="glass rounded-lg p-4 text-center text-white/50">
              <p>No commands executed yet</p>
              <p className="text-xs mt-1">Enter a command above to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MCPPanel;
