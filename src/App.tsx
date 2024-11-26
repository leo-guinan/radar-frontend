import React, { useState } from 'react';
import { DndContext, DragEndEvent, MouseSensor, useSensor, useSensors, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { ChatPanel } from './components/ChatPanel';
import { useCanvasStore, BlockType } from './store/canvasStore';

export default function App() {
  const { canvases, activeCanvasId, addBlock, updateBlockPosition, updateBlockContent } = useCanvasStore();
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 3,
    },
  });
  const sensors = useSensors(mouseSensor);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;

    const isTemplate = (active.id as string).startsWith('template-');
    
    if (isTemplate) {
      const { type, content } = active.data.current as { type: BlockType; content: string };
      const position = {
        x: event.delta.x + window.innerWidth / 2 - 100,
        y: event.delta.y + window.innerHeight / 2 - 50,
      };
      addBlock(activeCanvasId, type, position, content);
      return;
    }
    
    const block = canvases
      .find(canvas => canvas.blocks.some(b => b.id === active.id))
      ?.blocks.find(b => b.id === active.id);
    
    if (!block) return;
    
    const newPosition = {
      x: block.position.x + event.delta.x,
      y: block.position.y + event.delta.y,
    };
    
    updateBlockPosition(active.id as string, newPosition);
  };

  const handleAddBlock = (type: BlockType) => {
    const position = {
      x: window.innerWidth / 2 - 100,
      y: window.innerHeight / 2 - 50,
    };
    addBlock(activeCanvasId, type, position);
  };

  const activeCanvas = canvases.find((canvas) => canvas.id === activeCanvasId);
  if (!activeCanvas) return null;

  const allBlocks = canvases.flatMap(canvas => canvas.blocks);

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-100">
      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <ChatPanel 
          blocks={allBlocks} 
          isOpen={isPanelOpen} 
          onToggle={(open) => setIsPanelOpen(open)} 
        />
        <div 
          className={`h-full transition-all duration-300 ease-in-out ${
            isPanelOpen ? 'ml-[320px] w-[calc(100%-320px)]' : 'w-full'
          }`}
        >
          <Toolbar onAddBlock={handleAddBlock} />
          <Canvas
            canvas={activeCanvas}
            onContentChange={updateBlockContent}
          />
        </div>
      </DndContext>
    </div>
  );
}