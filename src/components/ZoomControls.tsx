import React from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  scale: number;
}

export function ZoomControls({ onZoomIn, onZoomOut, onReset, scale }: ZoomControlsProps) {
  return (
    <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-white rounded-lg shadow-lg p-2 z-[999]">
      <button
        onClick={onZoomOut}
        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        title="Zoom out"
      >
        <ZoomOut className="w-5 h-5" />
      </button>
      <div className="px-2 min-w-[60px] text-center">
        {Math.round(scale * 100)}%
      </div>
      <button
        onClick={onZoomIn}
        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        title="Zoom in"
      >
        <ZoomIn className="w-5 h-5" />
      </button>
      <div className="w-px h-6 bg-slate-200" />
      <button
        onClick={onReset}
        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        title="Reset zoom"
      >
        <Maximize2 className="w-5 h-5" />
      </button>
    </div>
  );
}