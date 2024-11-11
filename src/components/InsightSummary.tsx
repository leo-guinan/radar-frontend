import React from 'react';
import { Share2, Download } from 'lucide-react';
import type { InsightDocument } from '../types';

interface InsightSummaryProps {
  insight: InsightDocument;
  onShare: () => Promise<void>;
  onExport: () => void;
}

export function InsightSummary({ insight, onShare, onExport }: InsightSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Analysis Summary</h2>
        <div className="flex gap-2">
          <button
            onClick={onShare}
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Source URL</h3>
          <a href={insight.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {insight.url}
          </a>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">User's Initial Insight</h3>
          <p className="mt-1 text-gray-900">{insight.userInsight}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">AI Analysis</h3>
          <p className="mt-1 text-gray-900">{insight.aiAnalysis}</p>
        </div>
      </div>
    </div>
  );
}