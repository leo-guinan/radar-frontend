import { useState } from 'react';
import { Send, Link } from 'lucide-react';

interface Props {
  onSend: (message: string, url?: string) => Promise<void>;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || disabled) return;
    
    await onSend(message, url || undefined);
    setMessage('');
    setUrl('');
    setShowUrlInput(false);
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
      <div className="space-y-4">
        {showUrlInput && (
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL (optional)"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <Link className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={disabled || !message}
            className="p-2 text-blue-500 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </form>
  );
} 