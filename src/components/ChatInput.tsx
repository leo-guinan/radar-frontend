import { useState, FormEvent } from 'react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isProcessing: boolean;
}

export default function ChatInput({ onSubmit, isProcessing }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isProcessing) return;
    
    onSubmit(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isProcessing ? "AI is thinking..." : "Type a message..."}
          className="flex-1 p-2 border rounded"
          disabled={isProcessing}
        />
        <button 
          type="submit" 
          className={`px-4 py-2 rounded text-white transition-colors ${
            isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={!message.trim() || isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Processing
            </span>
          ) : 'Send'}
        </button>
      </div>
    </form>
  );
} 