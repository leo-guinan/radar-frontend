export interface AnalyzeRequest {
  url: string;
  initialThought: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ShareResponse {
  shareUrl: string;
}

export interface SendMessageResponse {
  messages: Message[];
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  async analyze(request: AnalyzeRequest): Promise<string> {
    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error(`Analysis failed: ${await response.text()}`);
    }
    const conversationId = await response.text();
    return conversationId.replace(/['"]/g, '');
  },

  async getConversation(id: string): Promise<Message[]> {
    const cleanId = id.replace(/['"]/g, '');
    const response = await fetch(`${API_BASE}/conversations/${cleanId}`);
    if (!response.ok) {
      throw new Error(`Failed to get conversation: ${await response.text()}`);
    }
    return await response.json();
  },

  async sendMessage(conversationId: string, message: string, url?: string): Promise<SendMessageResponse> {
    const response = await fetch(`${API_BASE}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, url }),
    });
    return await response.json();
  },

  async share(conversationId: string): Promise<ShareResponse> {
    const response = await fetch(`${API_BASE}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId: conversationId.replace(/['"]/g, '') }),
    });
    return await response.json();
  },
}; 