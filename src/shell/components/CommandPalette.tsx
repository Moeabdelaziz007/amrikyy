import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Terminal, Settings, FileText, Zap } from 'lucide-react';
import { kernel } from '../../core/kernel';
import { aiService } from '../../core/services/ai.service';
import { automationService } from '../../core/services/automation.service';

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
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: 'summarize',
      title: 'Summarize this note',
      description: 'Use AI to summarize the current note',
      icon: Sparkles,
      category: 'ai',
      action: async () => {
        // Placeholder: integrate with aiService.summarizeText()
        console.log('AI: Summarizing note...');
        onClose();
      }
    },
    {
      id: 'extract-actions',
      title: 'Extract action items',
      description: 'Find and extract action items from text',
      icon: Zap,
      category: 'ai',
      action: async () => {
        // Placeholder: integrate with aiService.extractActionItems()
        console.log('AI: Extracting action items...');
        onClose();
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
      </div>
    </div>
  );
};

export default CommandPalette;
