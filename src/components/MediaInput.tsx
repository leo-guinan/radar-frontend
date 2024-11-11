import React, { useState } from 'react';
import { Send } from 'lucide-react';
import type { MediaInput as MediaInputType } from '../types';

interface MediaInputProps {
  onSubmit: (input: MediaInputType) => Promise<void>;
  disabled?: boolean;
}

export function MediaInput({ onSubmit, disabled }: MediaInputProps) {
  const [url, setUrl] = useState('');
  const [thought, setThought] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !thought || disabled) return;

    await onSubmit({
      url,
      initialThought: thought,
    });

    setUrl('');
    setThought('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50">
      <div className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            Media URL
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL (webpage, YouTube, or podcast)"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="thought" className="block text-sm font-medium text-gray-700">
            Your Insight
          </label>
          <textarea
            id="thought"
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="Share what you think this media represents..."
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={disabled}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
          {disabled ? 'Analyzing...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}