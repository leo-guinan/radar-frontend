import React from 'react';
import { Message } from '../lib/api';

interface Props {
  message: Message;
}

export function ChatMessage({ message }: Props) {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] rounded-lg p-4 ${
        message.role === 'user' 
          ? 'bg-blue-500 text-white ml-4' 
          : 'bg-gray-100 text-gray-900 mr-4'
      }`}>
        <p className="text-sm">{message.content}</p>
        <span className="text-xs opacity-70 mt-1 block">
          {new Date(message.timestamp).toLocaleString()}
        </span>
      </div>
    </div>
  );
}