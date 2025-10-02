import React, { useState } from 'react';
import Editor from './components/Editor';

interface Note {
  id: string;
  title: string;
  content: string;
}

const AuraNotesApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeNote = notes.find(n => n.id === activeId) || null;

  const createNote = () => {
    const id = String(Date.now());
    const newNote: Note = { id, title: 'Untitled', content: '' };
    setNotes([newNote, ...notes]);
    setActiveId(id);
  };

  const updateActive = (patch: Partial<Note>) => {
    if (!activeId) return;
    setNotes(prev => prev.map(n => n.id === activeId ? { ...n, ...patch } : n));
  };

  return (
    <div className="h-full w-full grid grid-cols-[260px_1fr]">
      <aside className="border-r border-border p-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Aura Notes</h2>
          <button className="px-2 py-1 text-sm border rounded" onClick={createNote}>New</button>
        </div>
        <div className="flex-1 overflow-auto">
          {notes.length === 0 ? (
            <div className="text-xs opacity-70">No notes yet</div>
          ) : (
            <ul className="space-y-1">
              {notes.map(n => (
                <li key={n.id}>
                  <button
                    className={`w-full text-left px-2 py-1 rounded ${n.id === activeId ? 'bg-muted' : ''}`}
                    onClick={() => setActiveId(n.id)}
                  >
                    {n.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
      <main className="h-full">
        {activeNote ? (
          <Editor
            title={activeNote.title}
            content={activeNote.content}
            onChangeTitle={(title) => updateActive({ title })}
            onChangeContent={(content) => updateActive({ content })}
          />
        ) : (
          <div className="h-full grid place-items-center text-sm opacity-70">Select or create a note</div>
        )}
      </main>
    </div>
  );
};

export default AuraNotesApp;


