import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Link, Type } from 'lucide-react';
import { Block as BlockType } from '../store/canvasStore';

interface BlockProps {
  block: BlockType;
  onContentChange: (id: string, content: string) => void;
  scale: number;
  isSelected: boolean;
  onSelect: (id: string, event: React.MouseEvent) => void;
}

export function Block({ block, onContentChange, scale, isSelected, onSelect }: BlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: block.id,
    data: {
      type: block.type,
      content: block.content,
      isTemplate: false,
    }
  });

  const style = transform ? {
    position: 'absolute',
    left: `${block.position.x}px`,
    top: `${block.position.y}px`,
    transform: `translate3d(${transform.x / scale}px, ${transform.y / scale}px, 0)`,
    width: '200px',
    touchAction: 'none',
    zIndex: isDragging ? 999 : (isSelected ? 100 : 1),
    willChange: 'transform',
  } : {
    position: 'absolute',
    left: `${block.position.x}px`,
    top: `${block.position.y}px`,
    width: '200px',
    touchAction: 'none',
    zIndex: isSelected ? 100 : 1,
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(block.id, e);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style as React.CSSProperties}
      className={`
        bg-white rounded-lg shadow-lg p-4 
        ${isDragging ? 'shadow-2xl opacity-95' : 'hover:shadow-xl'}
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        transition-all duration-200
      `}
      onMouseDown={handleMouseDown}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-2 mb-2 text-slate-600">
        {block.type === 'text' ? (
          <Type className="w-4 h-4" />
        ) : (
          <Link className="w-4 h-4" />
        )}
        <span className="text-xs font-medium uppercase">
          {block.type}
        </span>
      </div>
      {isEditing ? (
        <input
          type="text"
          value={block.content}
          onChange={(e) => onContentChange(block.id, e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full p-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      ) : (
        <div 
          onDoubleClick={handleDoubleClick} 
          className="min-h-[24px] p-1 rounded hover:bg-slate-50"
        >
          {block.type === 'link' ? (
            <a
              href={block.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {block.content}
            </a>
          ) : (
            <span className="break-words">{block.content}</span>
          )}
        </div>
      )}
    </div>
  );
}