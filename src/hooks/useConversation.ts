import { useState, useCallback } from 'react';
import { Message } from '../types';
import { api } from '../lib/api';

export function useConversation(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedMessages = await api.getConversation(conversationId);
      setMessages(fetchedMessages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  const addMessage = useCallback(async (content: string, url?: string) => {
    try {
      setProcessing(true);
      const response = await api.sendMessage(conversationId, content, url);
      
      if (response && Array.isArray(response.messages)) {
        setMessages(prevMessages => [...prevMessages, ...response.messages]);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setProcessing(false);
    }
  }, [conversationId]);

  return {
    messages,
    loading,
    processing,
    error,
    fetchMessages,
    addMessage
  };
} 