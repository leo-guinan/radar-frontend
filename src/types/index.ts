export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface MediaInput {
  url: string;
  initialThought: string;
}

export interface InsightDocument {
  id: string;
  url: string;
  mediaType: string;
  userInsight: string;
  aiAnalysis: string;
  conversationId: string;
  createdAt: Date;
}