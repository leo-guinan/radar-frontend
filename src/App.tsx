import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { AnalyzeForm } from './components/AnalyzeForm';
import { Conversation } from './components/Conversation';
import { api } from './lib/api';
import type { MediaInput } from './types';
import { useState } from 'react';
function AnalyzePage() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async (input: MediaInput) => {
    try {
      setIsAnalyzing(true);
      const conversationId = await api.analyze({
        url: input.url,
        initialThought: input.initialThought,
      });
      navigate(`/conversations/${conversationId}`);
    } catch (error) {
      console.error('Analysis failed:', error);
      // You might want to show an error toast/message here
    } finally {
      setIsAnalyzing(false);
    }
  };

  return <AnalyzeForm onSubmit={handleSubmit} disabled={isAnalyzing} />;
}

function ConversationPage() {
  const { id } = useParams();
  return <Conversation id={id} />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AnalyzePage />} />
        <Route path="/conversations/:id" element={<ConversationPage />} />
      </Routes>
    </BrowserRouter>
  );
}