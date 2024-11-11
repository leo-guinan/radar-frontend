import type { MediaInput, InsightDocument, Message } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function analyzeMedia(input: MediaInput): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  
  if (!response.ok) {
    throw new Error('Failed to analyze media');
  }
  
  return response.json();
}

export async function getConversation(conversationId: string): Promise<Message[]> {
  const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch conversation');
  }
  
  return response.json();
}

export async function createShareableInsight(conversationId: string): Promise<{ shareUrl: string }> {
  const response = await fetch(`${API_BASE_URL}/share`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create shareable insight');
  }
  
  return response.json();
}