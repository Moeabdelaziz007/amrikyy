import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Save, 
  Brain, 
  Sparkles, 
  Star,
  Archive,
  MoreVertical,
  Lightbulb,
  Zap,
  BookOpen,
  Target,
  CheckCircle,
  Clock,
  Filter,
  SortAsc
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Note: DropdownMenu components will be implemented inline for now
import { cn } from '@/lib/utils';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  isStarred: boolean;
  isArchived: boolean;
  aiInsights?: {
    summary?: string;
    keyPoints?: string[];
    sentiment?: 'positive' | 'neutral' | 'negative';
    topics?: string[];
    suggestions?: string[];
  };
  wordCount: number;
  readingTime: number; // in minutes
}

interface AISuggestion {
  id: string;
  type: 'improve' | 'expand' | 'summarize' | 'translate' | 'organize';
  title: string;
  description: string;
  action: () => void;
}

type SortOption = 'date' | 'title' | 'priority' | 'wordCount';
type FilterOption = 'all' | 'starred' | 'archived' | 'recent';

export const AINotesApp = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Welcome to AI Notes',
      content:
        'This is your first AI-powered note. You can create, edit, and organize your thoughts here with intelligent assistance. The AI can help you improve your writing, suggest topics, and organize your ideas.',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['welcome', 'getting-started'],
      priority: 'medium',
      isStarred: true,
      isArchived: false,
      wordCount: 28,
      readingTime: 1,
      aiInsights: {
        summary: 'Welcome message introducing AI-powered note-taking features',
        keyPoints: ['AI assistance', 'Note organization', 'Writing improvement'],
        sentiment: 'positive',
        topics: ['productivity', 'AI', 'note-taking'],
        suggestions: ['Try creating a new note', 'Explore AI suggestions', 'Organize with tags']
      }
    },
  ]);
  
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Utility functions
  const calculateWordCount = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const calculateReadingTime = (wordCount: number): number => {
    return Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute
  };

  const generateAIInsights = async (content: string): Promise<Note['aiInsights']> => {
    if (!content.trim()) return undefined;
    
    setIsLoadingAI(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const words = content.toLowerCase().split(/\s+/);
      const topics = ['productivity', 'ideas', 'notes', 'planning', 'thoughts'];
      const detectedTopics = topics.filter(topic => 
        words.some(word => word.includes(topic))
      );

      return {
        summary: content.length > 100 ? `${content.substring(0, 100)}...` : content,
        keyPoints: content.split('.').slice(0, 3).map(point => point.trim()).filter(Boolean),
        sentiment: content.includes('!') || content.includes('amazing') || content.includes('great') ? 'positive' : 'neutral',
        topics: detectedTopics.length > 0 ? detectedTopics : ['general'],
        suggestions: [
          'Consider adding more details',
          'Try organizing with bullet points',
          'Add relevant tags for better organization'
        ]
      };
    } catch (error) {
      console.error('AI insights generation failed:', error);
      return undefined;
    } finally {
      setIsLoadingAI(false);
    }
  };

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      priority: 'medium',
      isStarred: false,
      isArchived: false,
      wordCount: 0,
      readingTime: 0,
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote);
    setIsEditing(true);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setEditTags(newNote.tags);
    setEditPriority(newNote.priority);
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(notes.find(note => note.id !== noteId) || null);
    }
  };

  const saveNote = async () => {
    if (!selectedNote) return;

    const wordCount = calculateWordCount(editContent);
    const readingTime = calculateReadingTime(wordCount);
    const aiInsights = await generateAIInsights(editContent);

    const updatedNote = {
      ...selectedNote,
      title: editTitle,
      content: editContent,
      tags: editTags,
      priority: editPriority,
      updatedAt: new Date(),
      wordCount,
      readingTime,
      aiInsights,
    };

    setNotes(prev =>
      prev.map(note => (note.id === selectedNote.id ? updatedNote : note))
    );
    setSelectedNote(updatedNote);
    setIsEditing(false);
  };

  const startEditing = () => {
    if (!selectedNote) return;
    setIsEditing(true);
    setEditTitle(selectedNote.title);
    setEditContent(selectedNote.content);
    setEditTags(selectedNote.tags);
    setEditPriority(selectedNote.priority);
  };

  const toggleStar = (noteId: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === noteId ? { ...note, isStarred: !note.isStarred } : note
      )
    );
  };

  const toggleArchive = (noteId: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === noteId ? { ...note, isArchived: !note.isArchived } : note
      )
    );
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !editTags.includes(tag.trim())) {
      setEditTags(prev => [...prev, tag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const generateAISuggestions = useCallback(async (content: string) => {
    if (!content.trim()) {
      setAiSuggestions([]);
      return;
    }

    setIsLoadingAI(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const suggestions: AISuggestion[] = [
        {
          id: '1',
          type: 'improve',
          title: 'Improve Writing',
          description: 'Enhance clarity and structure',
          action: () => {
            // Simulate AI improvement
            const improved = content + '\n\n[AI Enhanced: Added structure and clarity]';
            setEditContent(improved);
          }
        },
        {
          id: '2',
          type: 'summarize',
          title: 'Create Summary',
          description: 'Generate a concise summary',
          action: () => {
            const summary = `Summary: ${content.substring(0, 100)}...`;
            setEditContent(content + '\n\n' + summary);
          }
        },
        {
          id: '3',
          type: 'organize',
          title: 'Organize Content',
          description: 'Structure with bullet points',
          action: () => {
            const organized = content.split('.').map(point => 
              point.trim() ? `• ${point.trim()}` : ''
            ).filter(Boolean).join('\n');
            setEditContent(organized);
          }
        }
      ];

      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('AI suggestions generation failed:', error);
    } finally {
      setIsLoadingAI(false);
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (isEditing && editContent) {
      const timer = setTimeout(() => {
        generateAISuggestions(editContent);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [editContent, isEditing, generateAISuggestions]);

  // Filtering and sorting logic
  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      switch (filterBy) {
        case 'starred':
          return matchesSearch && note.isStarred;
        case 'archived':
          return matchesSearch && note.isArchived;
        case 'recent':
          return matchesSearch && (Date.now() - note.updatedAt.getTime()) < 7 * 24 * 60 * 60 * 1000; // Last 7 days
        default:
          return matchesSearch && !note.isArchived;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'wordCount':
          return b.wordCount - a.wordCount;
        default: // date
          return b.updatedAt.getTime() - a.updatedAt.getTime();
      }
    });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="h-full flex bg-gradient-to-br from-purple-900/20 to-pink-900/20">
      {/* Sidebar */}
      <div className="w-80 glass border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">AI Notes</h2>
            <Badge variant="secondary" className="ml-auto text-xs">
              {filteredNotes.length} notes
            </Badge>
          </div>

          <div className="flex gap-2 mb-3">
            <Button
              onClick={createNote}
              size="sm"
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
            <Button
              onClick={() => setShowAIPanel(!showAIPanel)}
              size="sm"
              variant="outline"
              className="glass border-white/20"
            >
              <Sparkles className="w-4 h-4" />
            </Button>
          </div>

          {/* Filters and Sort */}
          <div className="flex gap-2 mb-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 glass border-white/20"
              onClick={() => {
                const filters = ['all', 'starred', 'recent', 'archived'];
                const currentIndex = filters.indexOf(filterBy);
                const nextIndex = (currentIndex + 1) % filters.length;
                setFilterBy(filters[nextIndex] as FilterOption);
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              {filterBy}
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 glass border-white/20"
              onClick={() => {
                const sorts = ['date', 'title', 'priority', 'wordCount'];
                const currentIndex = sorts.indexOf(sortBy);
                const nextIndex = (currentIndex + 1) % sorts.length;
                setSortBy(sorts[nextIndex] as SortOption);
              }}
            >
              <SortAsc className="w-4 h-4 mr-2" />
              {sortBy}
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notes, tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 glass border-white/20 bg-white/5"
            />
          </div>
        </div>

        {/* Notes List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={cn(
                  'p-3 rounded-lg cursor-pointer transition-all hover:bg-white/10 group',
                  selectedNote?.id === note.id &&
                    'bg-primary/20 border border-primary/30'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm truncate flex-1">{note.title}</h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(note.id);
                      }}
                    >
                      <Star className={cn(
                        "w-3 h-3",
                        note.isStarred ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      )} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleArchive(note.id);
                      }}
                      title={note.isArchived ? 'Unarchive' : 'Archive'}
                    >
                      <Archive className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {note.content || 'No content'}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-xs px-2 py-0", getPriorityColor(note.priority))}>
                      {note.priority}
                    </Badge>
                    {note.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {note.readingTime}m
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">
                  {note.updatedAt.toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          {selectedNote ? (
            <>
              {/* Note Header */}
              <div className="p-4 border-b border-white/10 glass flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {isEditing ? (
                    <Input
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="text-lg font-semibold bg-transparent border-none p-0 focus:ring-0 flex-1"
                      placeholder="Note title..."
                    />
                  ) : (
                    <div className="flex items-center gap-3 flex-1">
                      <h1 className="text-lg font-semibold truncate">
                        {selectedNote.title}
                      </h1>
                      <div className="flex items-center gap-2">
                        {selectedNote.isStarred && (
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        )}
                        <Badge className={cn("text-xs", getPriorityColor(selectedNote.priority))}>
                          {selectedNote.priority}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={saveNote}
                        size="sm"
                        className="bg-gradient-primary hover:opacity-90"
                        disabled={isLoadingAI}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isLoadingAI ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        size="sm"
                        className="glass border-white/20"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={startEditing}
                        variant="outline"
                        size="sm"
                        className="glass border-white/20"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => toggleStar(selectedNote.id)}
                        variant="outline"
                        size="sm"
                        className="glass border-white/20"
                      >
                        <Star className={cn(
                          "w-4 h-4",
                          selectedNote.isStarred ? "fill-yellow-400 text-yellow-400" : ""
                        )} />
                      </Button>
                      <Button
                        onClick={() => deleteNote(selectedNote.id)}
                        variant="outline"
                        size="sm"
                        className="glass border-destructive/30 hover:bg-destructive/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Note Metadata */}
              {!isEditing && (
                <div className="px-4 py-2 border-b border-white/5 glass bg-white/5">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>{selectedNote.wordCount} words</span>
                      <span>{selectedNote.readingTime} min read</span>
                      <span>Updated {selectedNote.updatedAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedNote.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Note Content */}
              <div className="flex-1 p-4">
                {isEditing ? (
                  <div className="h-full flex flex-col gap-4">
                    {/* Tags and Priority Editor */}
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-sm font-medium mb-2 block">Tags</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {editTags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                              <button
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:text-destructive"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={newTag}
                            onChange={e => setNewTag(e.target.value)}
                            placeholder="Add tag..."
                            className="flex-1"
                            onKeyPress={e => {
                              if (e.key === 'Enter') {
                                addTag(newTag);
                              }
                            }}
                          />
                          <Button
                            onClick={() => addTag(newTag)}
                            size="sm"
                            variant="outline"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Priority</label>
                        <Button 
                          variant="outline" 
                          className="w-32"
                          onClick={() => {
                            const priorities = ['low', 'medium', 'high'];
                            const currentIndex = priorities.indexOf(editPriority);
                            const nextIndex = (currentIndex + 1) % priorities.length;
                            setEditPriority(priorities[nextIndex] as 'low' | 'medium' | 'high');
                          }}
                        >
                          {editPriority}
                        </Button>
                      </div>
                    </div>

                    {/* Content Editor */}
                    <div className="flex-1">
                      <Textarea
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        placeholder="Start writing your note..."
                        className="h-full resize-none glass border-white/20 bg-white/5"
                      />
                    </div>

                    {/* AI Suggestions */}
                    {aiSuggestions.length > 0 && (
                      <div className="border-t border-white/10 pt-4">
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          AI Suggestions
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {aiSuggestions.map(suggestion => (
                            <Card key={suggestion.id} className="glass border-white/20">
                              <CardContent className="p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  {suggestion.type === 'improve' && <Zap className="w-4 h-4 text-yellow-400" />}
                                  {suggestion.type === 'summarize' && <BookOpen className="w-4 h-4 text-blue-400" />}
                                  {suggestion.type === 'organize' && <Target className="w-4 h-4 text-green-400" />}
                                  <h5 className="text-sm font-medium">{suggestion.title}</h5>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">
                                  {suggestion.description}
                                </p>
                                <Button
                                  onClick={suggestion.action}
                                  size="sm"
                                  variant="outline"
                                  className="w-full"
                                >
                                  Apply
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col gap-4">
                    <div className="flex-1 glass border border-white/20 rounded-lg p-4 bg-white/5">
                      <div className="prose prose-invert max-w-none">
                        {selectedNote.content ? (
                          <div className="whitespace-pre-wrap">
                            {selectedNote.content}
                          </div>
                        ) : (
                          <p className="text-muted-foreground italic">
                            No content yet. Click edit to start writing.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* AI Insights */}
                    {selectedNote.aiInsights && (
                      <div className="glass border border-white/20 rounded-lg p-4 bg-white/5">
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <Brain className="w-4 h-4 text-primary" />
                          AI Insights
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedNote.aiInsights.summary && (
                            <div>
                              <h5 className="text-xs font-medium text-muted-foreground mb-1">Summary</h5>
                              <p className="text-sm">{selectedNote.aiInsights.summary}</p>
                            </div>
                          )}
                          {selectedNote.aiInsights.keyPoints && selectedNote.aiInsights.keyPoints.length > 0 && (
                            <div>
                              <h5 className="text-xs font-medium text-muted-foreground mb-1">Key Points</h5>
                              <ul className="text-sm space-y-1">
                                {selectedNote.aiInsights.keyPoints.map((point, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {selectedNote.aiInsights.topics && selectedNote.aiInsights.topics.length > 0 && (
                            <div>
                              <h5 className="text-xs font-medium text-muted-foreground mb-1">Topics</h5>
                              <div className="flex flex-wrap gap-1">
                                {selectedNote.aiInsights.topics.map(topic => (
                                  <Badge key={topic} variant="outline" className="text-xs">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {selectedNote.aiInsights.sentiment && (
                            <div>
                              <h5 className="text-xs font-medium text-muted-foreground mb-1">Sentiment</h5>
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "text-xs",
                                  selectedNote.aiInsights.sentiment === 'positive' && "text-green-400 border-green-400/30",
                                  selectedNote.aiInsights.sentiment === 'negative' && "text-red-400 border-red-400/30",
                                  selectedNote.aiInsights.sentiment === 'neutral' && "text-gray-400 border-gray-400/30"
                                )}
                              >
                                {selectedNote.aiInsights.sentiment}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No note selected</h3>
                <p className="text-muted-foreground mb-4">
                  Choose a note from the sidebar or create a new one.
                </p>
                <Button onClick={createNote} className="bg-gradient-primary hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Note
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant Panel */}
        {showAIPanel && (
          <div className="w-80 glass border-l border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">AI Assistant</h3>
              </div>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <Card className="glass border-white/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      onClick={createNote}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Note
                    </Button>
                    <Button
                      onClick={() => setFilterBy('starred')}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      View Starred
                    </Button>
                    <Button
                      onClick={() => setFilterBy('recent')}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Recent Notes
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass border-white/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Brain className="w-4 h-4 text-primary" />
                      AI Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-xs text-muted-foreground">
                      <p>• Auto-generate summaries</p>
                      <p>• Extract key points</p>
                      <p>• Analyze sentiment</p>
                      <p>• Suggest improvements</p>
                      <p>• Organize content</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-white/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-400" />
                      Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Total Notes:</span>
                      <span>{notes.length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Starred:</span>
                      <span>{notes.filter(n => n.isStarred).length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Total Words:</span>
                      <span>{notes.reduce((sum, n) => sum + n.wordCount, 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Reading Time:</span>
                      <span>{notes.reduce((sum, n) => sum + n.readingTime, 0)}m</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};
