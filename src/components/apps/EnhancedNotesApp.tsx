import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  orderBy
} from 'firebase/firestore';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  characterCount: number;
}

interface NoteTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
}

export const EnhancedNotesApp: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title'>('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState<string[]>([]);
  const [noteColor, setNoteColor] = useState('#3B82F6');
  const [newTag, setNewTag] = useState('');

  // Mock notes for demonstration
  const mockNotes: Note[] = [
    {
      id: '1',
      title: 'Project Ideas',
      content: '# Project Ideas\n\n## Web Applications\n- AI-powered task manager\n- Real-time collaboration tool\n- Smart home automation\n\n## Mobile Apps\n- Fitness tracking app\n- Language learning platform\n- Expense tracker\n\n## Desktop Software\n- Code editor with AI\n- Design tool\n- System monitor',
      tags: ['work', 'ideas', 'planning'],
      color: '#3B82F6',
      isPinned: true,
      isArchived: false,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-25'),
      wordCount: 45,
      characterCount: 280
    },
    {
      id: '2',
      title: 'Meeting Notes',
      content: '## Team Meeting - January 25, 2024\n\n### Attendees\n- John Smith\n- Jane Doe\n- Mike Johnson\n\n### Agenda\n1. Project status update\n2. Q1 goals review\n3. Resource allocation\n4. Next steps\n\n### Action Items\n- [ ] Complete user research\n- [ ] Update project timeline\n- [ ] Schedule client meeting',
      tags: ['meeting', 'work', 'team'],
      color: '#10B981',
      isPinned: false,
      isArchived: false,
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25'),
      wordCount: 38,
      characterCount: 320
    },
    {
      id: '3',
      title: 'Shopping List',
      content: '## Grocery Shopping\n\n### Produce\n- [ ] Apples\n- [ ] Bananas\n- [ ] Spinach\n- [ ] Tomatoes\n\n### Dairy\n- [ ] Milk\n- [ ] Cheese\n- [ ] Yogurt\n\n### Pantry\n- [ ] Bread\n- [ ] Rice\n- [ ] Pasta\n- [ ] Olive oil',
      tags: ['personal', 'shopping'],
      color: '#F59E0B',
      isPinned: false,
      isArchived: false,
      createdAt: new Date('2024-01-24'),
      updatedAt: new Date('2024-01-24'),
      wordCount: 25,
      characterCount: 180
    }
  ];

  const noteTemplates: NoteTemplate[] = [
    {
      id: '1',
      name: 'Meeting Notes',
      content: '## Meeting Title\n\n### Date: [Date]\n### Attendees: [List attendees]\n\n### Agenda\n1. [Agenda item 1]\n2. [Agenda item 2]\n3. [Agenda item 3]\n\n### Discussion\n[Key discussion points]\n\n### Action Items\n- [ ] [Action item 1]\n- [ ] [Action item 2]\n- [ ] [Action item 3]\n\n### Next Meeting\n[Date and time]',
      category: 'work'
    },
    {
      id: '2',
      name: 'Project Plan',
      content: '# Project: [Project Name]\n\n## Overview\n[Project description]\n\n## Goals\n- [Goal 1]\n- [Goal 2]\n- [Goal 3]\n\n## Timeline\n- Week 1: [Tasks]\n- Week 2: [Tasks]\n- Week 3: [Tasks]\n\n## Resources\n- [Resource 1]\n- [Resource 2]\n\n## Risks\n- [Risk 1]\n- [Risk 2]',
      category: 'work'
    },
    {
      id: '3',
      name: 'Daily Journal',
      content: '# [Date]\n\n## What I accomplished today\n- [Accomplishment 1]\n- [Accomplishment 2]\n\n## What I learned\n[Learning points]\n\n## Challenges faced\n[Challenges and how you overcame them]\n\n## Tomorrow\'s priorities\n- [Priority 1]\n- [Priority 2]\n\n## Gratitude\n[What you\'re grateful for today]',
      category: 'personal'
    }
  ];

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Load notes from Firestore
    const loadNotes = async () => {
      try {
        // For demo purposes, use mock data
        setNotes(mockNotes);
        setLoading(false);
      } catch (error) {
        console.error('Error loading notes:', error);
        setLoading(false);
      }
    };

    loadNotes();
  }, [user]);

  const getFilteredNotes = (): Note[] => {
    let filtered = notes.filter(note => !note.isArchived);
    
    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (filterTag !== 'all') {
      filtered = filtered.filter(note => note.tags.includes(filterTag));
    }
    
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      switch (sortBy) {
        case 'updated':
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        case 'created':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const getAllTags = (): string[] => {
    const allTags = notes.flatMap(note => note.tags);
    return Array.from(new Set(allTags)).sort();
  };

  const createNewNote = () => {
    setSelectedNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteTags([]);
    setNoteColor('#3B82F6');
    setIsEditing(true);
    setShowCreateNote(true);
  };

  const editNote = (note: Note) => {
    setSelectedNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteTags([...note.tags]);
    setNoteColor(note.color);
    setIsEditing(true);
    setShowCreateNote(true);
  };

  const saveNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;

    try {
      const noteData = {
        title: noteTitle.trim(),
        content: noteContent.trim(),
        tags: noteTags,
        color: noteColor,
        isPinned: false,
        isArchived: false,
        wordCount: noteContent.trim().split(/\s+/).length,
        characterCount: noteContent.trim().length,
        updatedAt: serverTimestamp()
      };

      if (selectedNote) {
        // Update existing note
        await updateDoc(doc(db, 'notes', selectedNote.id), noteData);
      } else {
        // Create new note
        await addDoc(collection(db, 'notes'), {
          ...noteData,
          userId: user?.uid,
          createdAt: serverTimestamp()
        });
      }

      setShowCreateNote(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const deleteNote = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteDoc(doc(db, 'notes', noteId));
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const togglePin = async (noteId: string) => {
    try {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        await updateDoc(doc(db, 'notes', noteId), {
          isPinned: !note.isPinned,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const archiveNote = async (noteId: string) => {
    try {
      await updateDoc(doc(db, 'notes', noteId), {
        isArchived: true,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error archiving note:', error);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !noteTags.includes(newTag.trim())) {
      setNoteTags([...noteTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNoteTags(noteTags.filter(tag => tag !== tagToRemove));
  };

  const useTemplate = (template: NoteTemplate) => {
    setNoteTitle(template.name);
    setNoteContent(template.content);
    setNoteTags([template.category]);
    setShowTemplates(false);
    setShowCreateNote(true);
    setIsEditing(true);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="enhanced-notes-app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading notes...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="enhanced-notes-app">
        <div className="auth-required">
          <h2>🔐 Authentication Required</h2>
          <p>Please sign in to access notes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-notes-app">
      {/* Header */}
      <div className="notes-header">
        <div className="header-left">
          <h2>📝 Enhanced Notes</h2>
          <div className="stats">
            <span>{notes.length} notes</span>
            <span>{notes.filter(n => n.isPinned).length} pinned</span>
          </div>
        </div>

        <div className="header-center">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="header-right">
          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⊞
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              ☰
            </button>
          </div>

          <button 
            className="template-btn"
            onClick={() => setShowTemplates(true)}
          >
            📋 Templates
          </button>

          <button className="create-note-btn" onClick={createNewNote}>
            + New Note
          </button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="notes-controls">
        <div className="filter-group">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="updated">Last Updated</option>
            <option value="created">Date Created</option>
            <option value="title">Title</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by tag:</label>
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
          >
            <option value="all">All Tags</option>
            {getAllTags().map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        <div className="tag-cloud">
          {getAllTags().map(tag => (
            <button
              key={tag}
              className={`tag-btn ${filterTag === tag ? 'active' : ''}`}
              onClick={() => setFilterTag(filterTag === tag ? 'all' : tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid/List */}
      <div className={`notes-content ${viewMode}`}>
        {getFilteredNotes().map(note => (
          <div
            key={note.id}
            className={`note-card ${note.isPinned ? 'pinned' : ''}`}
            style={{ borderLeftColor: note.color }}
            onClick={() => editNote(note)}
          >
            <div className="note-header">
              <div className="note-title">{note.title}</div>
              <div className="note-actions">
                <button
                  className="action-btn pin-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePin(note.id);
                  }}
                  title={note.isPinned ? 'Unpin' : 'Pin'}
                >
                  {note.isPinned ? '📌' : '📍'}
                </button>
                <button
                  className="action-btn archive-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    archiveNote(note.id);
                  }}
                  title="Archive"
                >
                  📦
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>

            <div className="note-content">
              <div className="note-preview">
                {note.content.length > 200 
                  ? note.content.substring(0, 200) + '...'
                  : note.content
                }
              </div>
            </div>

            <div className="note-tags">
              {note.tags.map(tag => (
                <span key={tag} className="note-tag">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="note-meta">
              <div className="note-stats">
                <span>{note.wordCount} words</span>
                <span>{note.characterCount} chars</span>
              </div>
              <div className="note-date">
                <span>{formatDate(note.updatedAt)}</span>
                <span>{formatTime(note.updatedAt)}</span>
              </div>
            </div>
          </div>
        ))}

        {getFilteredNotes().length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No notes found</h3>
            <p>
              {searchQuery 
                ? `No notes match "${searchQuery}"`
                : 'Create your first note to get started'
              }
            </p>
            <button 
              className="empty-action-btn"
              onClick={createNewNote}
            >
              Create Note
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Note Modal */}
      {showCreateNote && (
        <div className="note-modal-overlay">
          <div className="note-modal">
            <div className="modal-header">
              <h3>{selectedNote ? 'Edit Note' : 'Create New Note'}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCreateNote(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Note title..."
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="note-title-input"
                />
              </div>

              <div className="form-group">
                <textarea
                  placeholder="Start writing your note..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="note-content-textarea"
                  rows={15}
                />
              </div>

              <div className="form-group">
                <label>Color:</label>
                <div className="color-picker">
                  {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'].map(color => (
                    <button
                      key={color}
                      className={`color-btn ${noteColor === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNoteColor(color)}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Tags:</label>
                <div className="tags-input">
                  <div className="tags-list">
                    {noteTags.map(tag => (
                      <span key={tag} className="tag-item">
                        #{tag}
                        <button 
                          className="remove-tag"
                          onClick={() => removeTag(tag)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="add-tag">
                    <input
                      type="text"
                      placeholder="Add tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <button onClick={addTag}>Add</button>
                  </div>
                </div>
              </div>

              <div className="note-stats">
                <span>Words: {noteContent.trim().split(/\s+/).length}</span>
                <span>Characters: {noteContent.trim().length}</span>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="save-btn"
                onClick={saveNote}
                disabled={!noteTitle.trim() || !noteContent.trim()}
              >
                Save Note
              </button>
              <button 
                className="cancel-btn"
                onClick={() => setShowCreateNote(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <div className="templates-modal-overlay">
          <div className="templates-modal">
            <div className="modal-header">
              <h3>Note Templates</h3>
              <button 
                className="modal-close"
                onClick={() => setShowTemplates(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="templates-grid">
                {noteTemplates.map(template => (
                  <div
                    key={template.id}
                    className="template-card"
                    onClick={() => useTemplate(template)}
                  >
                    <div className="template-header">
                      <h4>{template.name}</h4>
                      <span className="template-category">{template.category}</span>
                    </div>
                    <div className="template-preview">
                      {template.content.substring(0, 150)}...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
