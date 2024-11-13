import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useConversation } from '../hooks/useConversation';
import ChatInput from './ChatInput';
import MessageList from './MessageList';

interface ConversationProps {
  onShare?: () => void;
}

export default function Conversation({ onShare }: ConversationProps) {
  const { id } = useParams<{ id: string }>();
  const { messages, loading, processing, error, fetchMessages, addMessage } = useConversation(id!);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSend = async (message: string) => {
    try {
      await addMessage(message);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (loading) return <div>Loading conversation...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} isProcessing={processing} />
      <ChatInput onSubmit={handleSend} isProcessing={processing} />
    </div>
  );
} 