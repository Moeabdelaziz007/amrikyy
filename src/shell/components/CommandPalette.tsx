import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Terminal, Settings, FileText, Zap, Activity, List } from 'lucide-react';
import { kernel } from '../../core/kernel';
import { aiService } from '../../core/services/ai.service';
import { automationService } from '../../core/services/automation.service';
import { mcpService } from '../../core/services/mcp.service';

interface Command {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
  category: 'ai' | 'app' | 'system' | 'automation';
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const showResult = (message: string) => {
    setResult(message);
    setTimeout(() => setResult(null), 5000); // Auto-hide after 5 seconds
  };

  const commands: Command[] = [
    {
      id: 'summarize',
      title: 'Summarize this note',
      description: 'Use AI to summarize the current note',
      icon: Sparkles,
      category: 'ai',
      action: async () => {
        setLoading(true);
        try {
          const sampleText = "AuraOS is an advanced operating system with AI capabilities. It features a liquid intelligence UI, window management, and smart command processing.";
          const summary = await aiService.summarizeText(sampleText);
          showResult(`📝 Summary:\n\n${summary}`);
        } catch (error) {
          showResult(`❌ Error: ${error instanceof Error ? error.message : 'Failed to summarize'}`);
        } finally {
          setLoading(false);
        }
      }
    },
    {
      id: 'extract-actions',
      title: 'Extract action items',
      description: 'Find and extract action items from text',
      icon: Zap,
      category: 'ai',
      action: async () => {
        setLoading(true);
        try {
          const sampleText = "TODO: Implement user authentication\n- Add login page\n- Setup Firebase\nAction: Test the new features";
          const actions = await aiService.extractActionItems(sampleText);
          showResult(`✅ Action Items:\n\n${actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}`);
        } catch (error) {
          showResult(`❌ Error: ${error instanceof Error ? error.message : 'Failed to extract actions'}`);
        } finally {
          setLoading(false);
        }
      }
    },
    {
      id: 'system-status',
      title: 'Show system status',
      description: 'Display current system information',
      icon: Activity,
      category: 'system',
      action: async () => {
        setLoading(true);
        try {
          const status = await mcpService.getSystemStatus();
          const statusText = `System Status:
Uptime: ${Math.floor(status.uptime / 1000)}s
Memory: ${status.memory.used}MB / ${status.memory.total}MB (${status.memory.percentage}%)
CPU: ${status.cpu.usage}% (${status.cpu.cores} cores)
Services: ${status.services.length} running
Processes: ${status.processes.length} active`;
          showResult(statusText);
        } catch (error) {
          showResult(`❌ Error: ${error instanceof Error ? error.message : 'Failed to get status'}`);
        } finally {
          setLoading(false);
        }
      }
    },
    {
      id: 'list-services',
      title: 'List running services',
      description: 'Show all active system services',
      icon: List,
      category: 'system',
      action: async () => {
        setLoading(true);
        try {
          const status = await mcpService.getSystemStatus();
          const servicesText = `Active Services:\n\n${status.services.map(s => 
            `• ${s.name}: ${s.status} (${Math.floor(s.uptime / 1000)}s)`
          ).join('\n')}`;
          showResult(servicesText);
        } catch (error) {
          showResult(`❌ Error: ${error instanceof Error ? error.message : 'Failed to list services'}`);
        } finally {
          setLoading(false);
        }
      }
    },
    {
      id: 'open-terminal',
      title: 'Open Terminal',
      description: 'Launch the terminal application',
      icon: Terminal,
      category: 'app',
      action: () => {
        // Placeholder: integrate with processService.launch('terminal')
        console.log('Opening Terminal...');
        onClose();
      }
    },
    {
      id: 'open-settings',
      title: 'Open Settings',
      description: 'Launch the settings application',
      icon: Settings,
      category: 'app',
      action: () => {
        // Placeholder: integrate with processService.launch('settings')
        console.log('Opening Settings...');
        onClose();
      }
    },
    {
      id: 'create-automation',
      title: 'Create new automation',
      description: 'Start building a new workflow',
      icon: FileText,
      category: 'automation',
      action: () => {
        // Placeholder: integrate with automationService
        console.log('Creating new automation...');
        onClose();
      }
    }
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Command Palette */}
      <div className="relative w-full max-w-2xl mx-4">
        <div className="glass rounded-xl overflow-hidden">
          {/* Loading Indicator */}
          {loading && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00f6ff] to-[#ff00f4] animate-pulse" />
          )}
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-white/20">
            <Search className="w-5 h-5 text-white/70" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              className="flex-1 bg-transparent text-white placeholder-white/50 outline-none"
            />
            <kbd className="px-2 py-1 text-xs bg-white/10 text-white/70 rounded">ESC</kbd>
          </div>

          {/* Commands List */}
          <div className="max-h-80 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-4 text-center text-white/50">
                No commands found
              </div>
            ) : (
              filteredCommands.map((command, index) => {
                const Icon = command.icon;
                const isSelected = index === selectedIndex;
                
                return (
                  <button
                    key={command.id}
                    onClick={() => command.action()}
                    className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                      isSelected 
                        ? 'bg-white/10 glow-astro' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-white/70" />
                    <div className="flex-1">
                      <div className="text-white font-medium">{command.title}</div>
                      <div className="text-white/50 text-sm">{command.description}</div>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded ${
                      command.category === 'ai' ? 'bg-cyan-500/20 text-cyan-300' :
                      command.category === 'app' ? 'bg-blue-500/20 text-blue-300' :
                      command.category === 'automation' ? 'bg-purple-500/20 text-purple-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {command.category}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-white/20 text-xs text-white/50">
            <div className="flex items-center justify-between">
              <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
              <span>Powered by AuraOS AI</span>
            </div>
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className="mt-4 glass rounded-xl p-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#00f6ff] flex-shrink-0 mt-1" />
              <div className="flex-1">
                <pre className="text-white text-sm whitespace-pre-wrap font-mono">
                  {result}
                </pre>
              </div>
              <button
                onClick={() => setResult(null)}
                className="text-white/50 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommandPalette;
