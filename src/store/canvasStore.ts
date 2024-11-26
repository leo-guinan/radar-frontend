import { create } from 'zustand';

export type BlockType = 'text' | 'link';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  position: { x: number; y: number };
  canvasId: string;
}

export interface Canvas {
  id: string;
  blocks: Block[];
  parentBlockId?: string;
}

interface CanvasStore {
  canvases: Canvas[];
  activeCanvasId: string;
  addCanvas: (parentBlockId?: string) => string;
  addBlock: (canvasId: string, type: BlockType, position: { x: number; y: number }, content?: string) => void;
  updateBlockPosition: (blockId: string, position: { x: number; y: number }) => void;
  updateBlockContent: (blockId: string, content: string) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  canvases: [{ id: 'root', blocks: [] }],
  activeCanvasId: 'root',

  addCanvas: (parentBlockId) => {
    const newCanvasId = Math.random().toString(36).substring(7);
    set((state) => ({
      canvases: [...state.canvases, { id: newCanvasId, blocks: [], parentBlockId }],
    }));
    return newCanvasId;
  },

  addBlock: (canvasId, type, position, content) => {
    const newBlock: Block = {
      id: Math.random().toString(36).substring(7),
      type,
      content: content || (type === 'text' ? 'New Text' : 'https://'),
      position,
      canvasId,
    };

    set((state) => ({
      canvases: state.canvases.map((canvas) =>
        canvas.id === canvasId
          ? { ...canvas, blocks: [...canvas.blocks, newBlock] }
          : canvas
      ),
    }));
  },

  updateBlockPosition: (blockId, position) => {
    set((state) => ({
      canvases: state.canvases.map((canvas) => ({
        ...canvas,
        blocks: canvas.blocks.map((block) =>
          block.id === blockId ? { ...block, position } : block
        ),
      })),
    }));
  },

  updateBlockContent: (blockId, content) => {
    set((state) => ({
      canvases: state.canvases.map((canvas) => ({
        ...canvas,
        blocks: canvas.blocks.map((block) =>
          block.id === blockId ? { ...block, content } : block
        ),
      })),
    }));
  },
}));