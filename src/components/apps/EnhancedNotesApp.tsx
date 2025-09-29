import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Define the Note type
interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export const EnhancedNotesApp: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'createdAt' | 'title'>('updatedAt');
  const [isEditing, setIsEditing] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteColor, setNoteColor] = useState('#3B82F6');

  // Fetch notes from the backend
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notes');
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getFilteredAndSortedNotes = (): Note[] => {
    let filtered = notes;

    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'updatedAt':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const handleCreateNewNote = () => {
    setSelectedNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteColor('#3B82F6');
    setIsEditing(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteColor(note.color);
    setIsEditing(true);
  };

  const handleSaveNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;

    const noteData = {
      title: noteTitle.trim(),
      content: noteContent.trim(),
      color: noteColor,
    };

    try {
      let response;
      if (selectedNote) {
        // Update existing note
        response = await fetch(`/api/notes/${selectedNote.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData),
        });
      } else {
        // Create new note
        response = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save note');
      }

      await fetchNotes(); // Re-fetch all notes to get the latest state
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const response = await fetch(`/api/notes/${noteId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete note');
        }
        await fetchNotes(); // Re-fetch notes
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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

  if (isEditing) {
    return (
      <div className="enhanced-notes-app note-editor-view">
        <div className="note-editor">
          <div className="editor-header">
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Note Title"
              className="editor-title-input"
            />
            <input
              type="color"
              value={noteColor}
              onChange={(e) => setNoteColor(e.target.value)}
              className="editor-color-picker"
            />
          </div>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Start writing..."
            className="editor-content-textarea"
          />
          <div className="editor-actions">
            <button onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSaveNote} className="btn-primary">Save Note</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-notes-app">
      <div className="notes-header">
        <h2>📝 Enhanced Notes</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="create-note-btn" onClick={handleCreateNewNote}>
          + New Note
        </button>
      </div>
      <div className="notes-controls">
        <label>Sort by:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
          <option value="updatedAt">Last Updated</option>
          <option value="createdAt">Date Created</option>
          <option value="title">Title</option>
        </select>
      </div>
      <div className="notes-content grid">
        {getFilteredAndSortedNotes().map(note => (
          <div
            key={note.id}
            className="note-card"
            style={{ borderLeftColor: note.color }}
            onClick={() => handleEditNote(note)}
          >
            <div className="note-header">
              <div className="note-title">{note.title}</div>
              <button
                className="action-btn delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNote(note.id);
                }}
                title="Delete"
              >
                🗑️
              </button>
            </div>
            <div className="note-content">
              <div className="note-preview">
                {note.content.length > 150 ? `${note.content.substring(0, 150)}...` : note.content}
              </div>
            </div>
            <div className="note-meta">
              <div className="note-date">
                <span>Updated: {formatDate(note.updatedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
