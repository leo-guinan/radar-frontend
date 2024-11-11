import { useState, useEffect } from 'react';
import { api, Message } from '../lib/api';

export function useConversation(id?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (!id) return;

    let mounted = true;
    const loadMessages = async () => {
      try {
        setLoading(true);
        const data = await api.getConversation(id);
        if (mounted) {
          setMessages(data);
          setError(undefined);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load conversation'));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadMessages();
    return () => { mounted = false; };
  }, [id]);

  const addMessages = (newMessages: Message[]) => {
    setMessages(prev => [...prev, ...newMessages]);
  };

  return { messages, loading, error, addMessages };
} 