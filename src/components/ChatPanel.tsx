import React, { useState } from 'react';
import { MessageSquare, ChevronRight, ChevronLeft, Library, Send } from 'lucide-react';
import { Block as BlockType } from '../store/canvasStore';
import { DraggableBlock } from './DraggableBlock';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatPanelProps {
  blocks: BlockType[];
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

export function ChatPanel({ blocks, isOpen, onToggle }: ChatPanelProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'library'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatRef = React.useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const aiMessage: Message = {
        id: Math.random().toString(36).substring(7),
        content: "I've analyzed your request. Would you like me to help you explore this topic further? I can suggest related concepts or help you find relevant resources.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out z-[999] flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ width: '320px' }}
    >
      <button
        onClick={() => onToggle(!isOpen)}
        className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-r-lg shadow-lg z-[999]"
        aria-label={isOpen ? 'Close panel' : 'Open panel'}
      >
        {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 p-4 flex items-center justify-center gap-2 ${
            activeTab === 'chat' ? 'border-b-2 border-blue-500' : ''
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>AI Chat</span>
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 p-4 flex items-center justify-center gap-2 ${
            activeTab === 'library' ? 'border-b-2 border-blue-500' : ''
          }`}
        >
          <Library className="w-5 h-5" />
          <span>Library</span>
        </button>
      </div>

      {activeTab === 'chat' ? (
        <>
          <div 
            ref={chatRef}
            className="flex-1 p-4 space-y-4 overflow-y-auto"
          >
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Start a conversation to analyze links and explore topics!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about a topic or analyze a link..."
                className="flex-1 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {blocks.map((block) => (
            <DraggableBlock key={block.id} block={block} />
          ))}
          {blocks.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No blocks available yet. Create some blocks in the canvas!
            </div>
          )}
        </div>
      )}
    </div>
  );
}