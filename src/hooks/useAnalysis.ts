import { useState } from 'react';
import type { MediaInput, Message, InsightDocument } from '../types';
import * as api from '../services/api';

export function useAnalysis() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insight, setInsight] = useState<InsightDocument | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (input: MediaInput) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const conversationId = await api.analyzeMedia(input);
      const conversation = await api.getConversation(conversationId);
      
      setMessages(conversation);
      // Last AI message contains the insight summary
      const aiInsight = conversation
        .filter(m => m.role === 'ai')
        .pop();
        
      if (aiInsight) {
        setInsight({
          id: conversationId,
          url: input.url,
          mediaType: 'webpage', // TODO: Detect from URL
          userInsight: input.initialThought,
          aiAnalysis: aiInsight.content,
          conversationId,
          createdAt: new Date(),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const share = async () => {
    if (!insight) return;
    
    try {
      const { shareUrl } = await api.createShareableInsight(insight.conversationId);
      return shareUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share insight');
      return null;
    }
  };

  return {
    messages,
    isAnalyzing,
    insight,
    error,
    analyze,
    share,
  };
}