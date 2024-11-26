import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Link, Type } from 'lucide-react';
import { Block as BlockType } from '../store/canvasStore';

interface DraggableBlockProps {
  block: BlockType;
}

export function DraggableBlock({ block }: DraggableBlockProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `template-${block.id}`,
    data: {
      type: block.type,
      content: block.content,
      isTemplate: true,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`
        bg-white border rounded-lg p-3 cursor-move
        ${isDragging ? 'opacity-50' : 'hover:border-blue-500'}
        transition-colors duration-200
      `}
    >
      <div className="flex items-center gap-2 mb-1 text-slate-600">
        {block.type === 'text' ? (
          <Type className="w-4 h-4" />
        ) : (
          <Link className="w-4 h-4" />
        )}
        <span className="text-xs font-medium uppercase">
          {block.type}
        </span>
      </div>
      <div className="text-sm truncate">
        {block.content}
      </div>
    </div>
  );
}