import { useState, useEffect, useRef } from 'react';
import { useConversation } from '../hooks/useConversation';
import { api } from '../lib/api';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Share } from 'lucide-react';

interface Props {
  id?: string;
}

export function Conversation({ id }: Props) {
  const { messages, loading, error, addMessages } = useConversation(id);
  const [shareUrl, setShareUrl] = useState<string>();
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleShare = async () => {
    if (!id) return;
    try {
      const response = await api.share(id);
      setShareUrl(response.shareUrl);
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  const handleSend = async (message: string, url?: string) => {
    if (!id) return;
    try {
      setIsSending(true);
      const response = await api.sendMessage(id, message, url);
      addMessages(response.messages);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-red-500 p-4 bg-red-50 rounded-lg">
        Error: {error.message}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-semibold">Conversation</h1>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 text-blue-500 hover:text-blue-700"
        >
          <Share className="h-5 w-5" />
          Share
        </button>
      </div>

      {shareUrl && (
        <div className="bg-blue-50 p-4 flex justify-between items-center">
          <span>Share URL: {shareUrl}</span>
          <button
            onClick={() => navigator.clipboard.writeText(shareUrl)}
            className="text-blue-500 hover:text-blue-700"
          >
            Copy
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet</div>
        ) : (
          messages?.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={handleSend} disabled={isSending} />
    </div>
  );
} 