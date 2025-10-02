import React, { useState, useRef, useEffect } from 'react';
import { aiService } from '../../core/services/ai.service';
import { mcpService } from '../../core/services/mcp.service';

interface TerminalOutput {
  id: string;
  type: 'command' | 'output' | 'error' | 'ai';
  content: string;
  timestamp: number;
}

const Terminal: React.FC = () => {
  const [command, setCommand] = useState('');
  const [outputs, setOutputs] = useState<TerminalOutput[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState('~/auraos');
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add welcome message
    addOutput('output', 'Welcome to AuraOS AI Terminal\nType "help" for available commands or ask me anything!');
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputs]);

  const addOutput = (type: TerminalOutput['type'], content: string) => {
    const output: TerminalOutput = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: Date.now()
    };
    setOutputs(prev => [...prev, output]);
  };

  /**
   * Handle intelligent command processing
   * This function demonstrates the AI-powered command flow:
   * 1. Send command to AI service for analysis
   * 2. Execute structured commands via appropriate services
   * 3. Display results in terminal
   */
  const handleCommand = async (cmd: string) => {
    if (!cmd.trim()) return;

    // Add command to output
    addOutput('command', `${currentPath} $ ${cmd}`);
    setCommand('');
    setLoading(true);

    try {
      // Step 1: Send command to AI service for analysis and structuring
      // The AI will analyze the natural language command and convert it to structured actions
      const aiAnalysis = await analyzeCommandWithAI(cmd);
      
      // Step 2: Execute the structured commands through appropriate services
      const results = await executeStructuredCommands(aiAnalysis);
      
      // Step 3: Display the final results in the terminal output area
      addOutput('output', results);
      
    } catch (error) {
      addOutput('error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Analyze command using AI service
   * This function sends the user's natural language command to the AI service
   * which will parse it and return structured commands that can be executed
   */
  const analyzeCommandWithAI = async (command: string): Promise<any> => {
    try {
      // Send command to AI service for analysis
      // The AI will understand the intent and return structured actions
      const analysis = await aiService.analyzeCommand(command);
      
      // Log AI analysis for debugging
      addOutput('ai', `AI Analysis: ${JSON.stringify(analysis, null, 2)}`);
      
      return analysis;
    } catch (error) {
      // Fallback to basic command parsing if AI service fails
      return parseBasicCommand(command);
    }
  };

  /**
   * Execute structured commands through appropriate services
   * This function takes the AI-analyzed commands and executes them via
   * the correct services (notes, process, automation, etc.)
   */
  const executeStructuredCommands = async (analysis: any): Promise<string> => {
    try {
      // Route commands to appropriate services based on analysis
      if (analysis.type === 'system') {
        // Execute system commands via MCP service
        const result = await mcpService.executeCommand(analysis.command);
        return result.output;
        
      } else if (analysis.type === 'notes') {
        // Execute notes-related commands via notes service
        // This would integrate with the Aura Notes app
        return `Notes command: ${analysis.command}\n[Would execute via notes service]`;
        
      } else if (analysis.type === 'automation') {
        // Execute automation commands via automation service
        // This would integrate with the Automations app
        return `Automation command: ${analysis.command}\n[Would execute via automation service]`;
        
      } else if (analysis.type === 'ai') {
        // Execute AI-powered commands
        const result = await aiService.processCommand(analysis.command);
        return result;
        
      } else {
        // Default command execution
        return `Executed: ${analysis.command}`;
      }
    } catch (error) {
      throw new Error(`Command execution failed: ${error}`);
    }
  };

  /**
   * Basic command parsing fallback
   * This provides simple command parsing when AI service is unavailable
   */
  const parseBasicCommand = (command: string) => {
    const cmd = command.toLowerCase().trim();
    
    if (cmd === 'help') {
      return {
        type: 'system',
        command: 'help',
        description: 'Show available commands'
      };
    } else if (cmd.startsWith('status')) {
      return {
        type: 'system',
        command: 'status',
        description: 'Show system status'
      };
    } else if (cmd.startsWith('notes')) {
      return {
        type: 'notes',
        command: command,
        description: 'Notes operation'
      };
    } else {
      return {
        type: 'ai',
        command: command,
        description: 'AI processing'
      };
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(command);
    }
  };

  const getOutputIcon = (type: TerminalOutput['type']) => {
    switch (type) {
      case 'command': return '> ';
      case 'output': return '✓ ';
      case 'error': return '✗ ';
      case 'ai': return '🤖 ';
      default: return '';
    }
  };

  const getOutputColor = (type: TerminalOutput['type']) => {
    switch (type) {
      case 'command': return 'text-cyan-400';
      case 'output': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'ai': return 'text-purple-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="aura-terminal h-full w-full bg-black text-green-400 font-mono">
      {/* Header */}
      <header className="p-3 border-b border-green-400/20 bg-gray-900">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-cyan-400 rounded flex items-center justify-center text-black font-bold">
            >
          </div>
          <div>
            <h1 className="text-sm font-semibold text-green-400">AuraOS AI Terminal</h1>
            <p className="text-xs text-green-400/70">Intelligent command processing</p>
          </div>
        </div>
      </header>

      {/* Terminal Output */}
      <div 
        ref={outputRef}
        className="flex-1 p-4 overflow-y-auto bg-black"
        style={{ height: 'calc(100% - 120px)' }}
      >
        {outputs.map((output) => (
          <div key={output.id} className="mb-2">
            <div className="flex items-start gap-2">
              <span className="text-green-400/50 text-xs mt-1">
                {getOutputIcon(output.type)}
              </span>
              <div className="flex-1">
                <pre className={`text-sm whitespace-pre-wrap ${getOutputColor(output.type)}`}>
                  {output.content}
                </pre>
                <div className="text-xs text-green-400/30 mt-1">
                  {new Date(output.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex items-center gap-2 text-green-400/70">
            <div className="animate-spin w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full" />
            <span className="text-sm">Processing command...</span>
          </div>
        )}
      </div>

      {/* Command Input */}
      <div className="p-4 border-t border-green-400/20 bg-gray-900">
        <div className="flex items-center gap-2">
          <span className="text-green-400 font-semibold">
            {currentPath} $
          </span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter command or ask AI..."
            className="flex-1 bg-transparent text-green-400 placeholder-green-400/50 border-none outline-none"
            disabled={loading}
            autoFocus
          />
          {loading && (
            <div className="animate-spin w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full" />
          )}
        </div>
        <div className="text-xs text-green-400/50 mt-1">
          Try: <code className="bg-gray-800 px-1 rounded">help</code>, 
          <code className="bg-gray-800 px-1 rounded ml-1">status</code>, 
          <code className="bg-gray-800 px-1 rounded ml-1">create note</code>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
