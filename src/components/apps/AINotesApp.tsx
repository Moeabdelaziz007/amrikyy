import { useState } from "react";
import { Plus, Search, FileText, Trash2, Edit3, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const AINotesApp = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Welcome to AI Notes",
      content: "This is your first AI-powered note. You can create, edit, and organize your thoughts here with intelligent assistance.",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote);
    setIsEditing(true);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(notes.find(note => note.id !== noteId) || null);
    }
  };

  const saveNote = () => {
    if (!selectedNote) return;
    
    const updatedNote = {
      ...selectedNote,
      title: editTitle,
      content: editContent,
      updatedAt: new Date()
    };
    
    setNotes(prev => prev.map(note => 
      note.id === selectedNote.id ? updatedNote : note
    ));
    setSelectedNote(updatedNote);
    setIsEditing(false);
  };

  const startEditing = () => {
    if (!selectedNote) return;
    setIsEditing(true);
    setEditTitle(selectedNote.title);
    setEditContent(selectedNote.content);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex bg-gradient-to-br from-purple-900/20 to-pink-900/20">
      {/* Sidebar */}
      <div className="w-80 glass border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">AI Notes</h2>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={createNote}
              size="sm"
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </div>
          
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass border-white/20 bg-white/5"
            />
          </div>
        </div>

        {/* Notes List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={cn(
                  "p-3 rounded-lg cursor-pointer transition-all hover:bg-white/10",
                  selectedNote?.id === note.id && "bg-primary/20 border border-primary/30"
                )}
              >
                <h3 className="font-medium text-sm truncate">{note.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {note.content || "No content"}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {note.updatedAt.toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            {/* Note Header */}
            <div className="p-4 border-b border-white/10 glass flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-lg font-semibold bg-transparent border-none p-0 focus:ring-0"
                  />
                ) : (
                  <h1 className="text-lg font-semibold">{selectedNote.title}</h1>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button
                      onClick={saveNote}
                      size="sm"
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
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

            {/* Note Content */}
            <div className="flex-1 p-4">
              {isEditing ? (
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Start writing your note..."
                  className="h-full resize-none glass border-white/20 bg-white/5"
                />
              ) : (
                <div className="h-full glass border border-white/20 rounded-lg p-4 bg-white/5">
                  <div className="prose prose-invert max-w-none">
                    {selectedNote.content ? (
                      <div className="whitespace-pre-wrap">{selectedNote.content}</div>
                    ) : (
                      <p className="text-muted-foreground italic">No content yet. Click edit to start writing.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No note selected</h3>
              <p className="text-muted-foreground">Choose a note from the sidebar or create a new one.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
