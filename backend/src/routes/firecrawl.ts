import express from 'express';
import { redis } from '../index';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  history: ChatMessage[];
}

interface ExportRequest {
  history: ChatMessage[];
  format: 'json' | 'markdown' | 'text';
}

interface ChatResponse {
  response: string;
  type: string;
  timestamp: string;
}

interface ExportResponse {
  data: string;
}

export const setupFirecrawlRoutes = () => {
  const router = express.Router();

  // Chat endpoint
  router.post('/chat', (req, res, next) => {
    const { message, history } = req.body as ChatRequest;
    
    handleChat(message, history)
      .then(response => res.json(response))
      .catch(next);
  });

  // Export chat history
  router.post('/export', (req, res, next) => {
    const { history, format } = req.body as ExportRequest;
    
    handleExport(history, format)
      .then(data => res.json({ data }))
      .catch(next);
  });

  return router;
};

async function handleChat(message: string, history: ChatMessage[]): Promise<ChatResponse> {
  // Check cache first
  const cacheKey = `chat:${JSON.stringify({ message, history })}`;
  const cachedResponse = await redis.get(cacheKey);
  
  if (cachedResponse) {
    return JSON.parse(cachedResponse);
  }

  // Process the message using FireCrawl MCP
  const response = await processFirecrawlRequest(message, history);
  
  // Cache the response
  await redis.setex(cacheKey, 3600, JSON.stringify(response));
  
  return response;
}

async function handleExport(history: ChatMessage[], format: 'json' | 'markdown' | 'text'): Promise<string> {
  return exportChatHistory(history, format);
}

async function processFirecrawlRequest(message: string, history: ChatMessage[]): Promise<ChatResponse> {
  // TODO: Implement FireCrawl MCP integration
  // This will be implemented once we set up the frontend and can test the integration
  return {
    response: "FireCrawl integration pending",
    type: "text",
    timestamp: new Date().toISOString()
  };
}

async function exportChatHistory(history: ChatMessage[], format: 'json' | 'markdown' | 'text'): Promise<string> {
  switch (format) {
    case 'json':
      return JSON.stringify(history, null, 2);
    case 'markdown':
      return history.map(msg => 
        `### ${msg.role}\n${msg.content}\n`
      ).join('\n');
    case 'text':
      return history.map(msg => 
        `[${msg.role}]: ${msg.content}`
      ).join('\n\n');
    default:
      throw new Error('Unsupported export format');
  }
}
