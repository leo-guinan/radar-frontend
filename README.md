# AI Insight Analysis Platform

This platform allows users to analyze media content (web pages, videos, podcasts) and generate AI-powered insights through interactive conversations.

## Backend API Requirements

### Required Endpoints

1. **Media Analysis** - `/api/analyze`
   - Method: POST
   - Purpose: Initiates media analysis and conversation
   - Request Body:
     ```typescript
     {
       url: string;
       initialThought: string;
     }
     ```
   - Response: Conversation ID (string)

2. **Conversation** - `/api/conversations/:id`
   - Method: GET
   - Purpose: Retrieves conversation history
   - Response: Array of messages

3. **Share** - `/api/share`
   - Method: POST
   - Purpose: Creates shareable insight document
   - Request Body:
     ```typescript
     {
       conversationId: string;
     }
     ```
   - Response: 
     ```typescript
     {
       shareUrl: string;
     }
     ```

### Required Services

1. **Media Processing Service**
   - Web page scraping
   - YouTube video transcription
   - Podcast audio transcription
   - Content extraction and preprocessing

2. **LLM Integration**
   - API key configuration
   - Prompt engineering
   - Response streaming
   - Context management

3. **Webhook Service**
   - Webhook configuration storage
   - Event dispatching
   - Retry logic
   - Payload formatting

### Configuration

Create a `.env` file with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api

# LLM Configuration
LLM_API_KEY=your_llm_api_key
LLM_MODEL=gpt-4

# Media Processing
YOUTUBE_API_KEY=your_youtube_api_key
PODCAST_API_KEY=your_podcast_api_key

# Database
DATABASE_URL=your_database_url

# Webhooks
WEBHOOK_SECRET=your_webhook_secret
```

### Database Schema

```sql
-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  url TEXT NOT NULL,
  media_type TEXT NOT NULL,
  user_insight TEXT NOT NULL,
  ai_analysis TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Webhooks
CREATE TABLE webhooks (
  id UUID PRIMARY KEY,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  events TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```