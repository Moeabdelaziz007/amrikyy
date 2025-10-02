import React from 'react';

interface Props {
  title: string;
  content: string;
  onChangeTitle: (v: string) => void;
  onChangeContent: (v: string) => void;
}

const Editor: React.FC<Props> = ({ title, content, onChangeTitle, onChangeContent }) => {
  return (
    <div className="h-full grid grid-rows-[48px_1fr]">
      <div className="border-b border-border p-2 flex items-center gap-2">
        <input
          className="px-2 py-1 border rounded w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
        />
      </div>
      <textarea
        className="w-full h-full p-3 outline-none"
        placeholder="Write your note..."
        value={content}
        onChange={(e) => onChangeContent(e.target.value)}
      />
    </div>
  );
};

export default Editor;


