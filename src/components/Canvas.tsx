import React, { useState, useRef, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Block } from './Block';
import { Canvas as CanvasType } from '../store/canvasStore';
import { ZoomControls } from './ZoomControls';

interface CanvasProps {
  canvas: CanvasType;
  onContentChange: (id: string, content: string) => void;
}

interface Transform {
  scale: number;
  translateX: number;
  translateY: number;
}

export function Canvas({ canvas, onContentChange }: CanvasProps) {
  const { setNodeRef } = useDroppable({ id: canvas.id });
  const [transform, setTransform] = useState<Transform>({ scale: 1, translateX: 0, translateY: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [selectedBlocks, setSelectedBlocks] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(transform.scale * delta, 0.1), 5);
      
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;
      
      const scaleChange = newScale - transform.scale;
      const translateX = transform.translateX - (cursorX - transform.translateX) * (scaleChange / transform.scale);
      const translateY = transform.translateY - (cursorY - transform.translateY) * (scaleChange / transform.scale);
      
      setTransform({ scale: newScale, translateX, translateY });
    }
  }, [transform]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.target === containerRef.current)) {
      setIsDragging(true);
      setStartPan({ x: e.clientX - transform.translateX, y: e.clientY - transform.translateY });
      if (!e.shiftKey) {
        setSelectedBlocks(new Set());
      }
    }
  }, [transform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      const newTranslateX = e.clientX - startPan.x;
      const newTranslateY = e.clientY - startPan.y;
      setTransform(prev => ({ ...prev, translateX: newTranslateX, translateY: newTranslateY }));
    }
  }, [isDragging, startPan]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleBlockSelect = useCallback((blockId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedBlocks(prev => {
      const newSelection = new Set(prev);
      if (event.shiftKey) {
        if (newSelection.has(blockId)) {
          newSelection.delete(blockId);
        } else {
          newSelection.add(blockId);
        }
      } else {
        newSelection.clear();
        newSelection.add(blockId);
      }
      return newSelection;
    });
  }, []);

  const zoomIn = useCallback(() => {
    setTransform(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, 5) }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform(prev => ({ ...prev, scale: Math.max(prev.scale * 0.8, 0.1) }));
  }, []);

  const resetZoom = useCallback(() => {
    setTransform({ scale: 1, translateX: 0, translateY: 0 });
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-slate-100 cursor-grab"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        ref={setNodeRef}
        className="absolute inset-0 origin-top-left"
        style={{
          transform: `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale})`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        <div className="relative w-full h-full">
          {canvas.blocks.map((block) => (
            <Block
              key={block.id}
              block={block}
              onContentChange={onContentChange}
              scale={transform.scale}
              isSelected={selectedBlocks.has(block.id)}
              onSelect={handleBlockSelect}
            />
          ))}
        </div>
      </div>
      <ZoomControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetZoom}
        scale={transform.scale}
      />
    </div>
  );
}