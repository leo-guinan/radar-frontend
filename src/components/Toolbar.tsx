import React from 'react';
import { Type, Link } from 'lucide-react';
import { BlockType } from '../store/canvasStore';

interface ToolbarProps {
  onAddBlock: (type: BlockType) => void;
}

export function Toolbar({ onAddBlock }: ToolbarProps) {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-3 flex gap-4 z-40">
      <button
        onClick={() => onAddBlock('text')}
        className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-slate-50 transition-colors"
      >
        <Type className="w-5 h-5" />
        <span>Text</span>
      </button>
      <button
        onClick={() => onAddBlock('link')}
        className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-slate-50 transition-colors"
      >
        <Link className="w-5 h-5" />
        <span>Link</span>
      </button>
    </div>
  );
}