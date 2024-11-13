export type MessageRole = 'ai' | 'human';

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface InsightDocument {
  id: string;
  url: string;
  mediaType: 'webpage' | 'video' | 'podcast';
  userInsight: string;
  aiAnalysis: string;
  conversationId: string;
  createdAt: Date;
}

export interface MediaInput {
  url: string;
  initialThought: string;
}