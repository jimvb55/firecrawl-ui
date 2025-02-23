import express, { Request, Response, NextFunction } from 'express';
import { analyzeUserMessage, processBusinessInfo } from '../services/openai.js';
import { searchBusiness, extractBusinessInfo, scrapeImages } from '../services/firecrawl.js';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  history: ChatMessage[];
}

export const setupFirecrawlRoutes = () => {
  const router = express.Router();

  // Chat endpoint
  router.post('/chat', async (req: Request<{}, {}, ChatRequest>, res: Response, next: NextFunction) => {
    try {
      const { message, history } = req.body;

      // Convert chat history to OpenAI format
      const openAIHistory: ChatCompletionMessageParam[] = history.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Analyze user message with OpenAI
      const analysis = await analyzeUserMessage(message, openAIHistory);

      if (analysis.type === 'function_call') {
        switch (analysis.function) {
          case 'analyze_business_query': {
            const { business_name, location } = analysis.arguments;
            const searchQuery = location ? `${business_name} ${location}` : business_name;
            const searchResults = await searchBusiness(searchQuery);

            if (searchResults.length > 0) {
              const businessInfo = await extractBusinessInfo(searchResults[0].url);
              const images = await scrapeImages(searchResults[0].url);
              
              // Process the gathered information with OpenAI
              const processedInfo = await processBusinessInfo(
                { ...businessInfo, images },
                [...openAIHistory, { role: 'assistant', content: analysis.message || '' }]
              );

              return res.json({
                type: 'business_info',
                response: processedInfo.content,
                data: businessInfo,
                images: images
              });
            }
            break;
          }

          case 'extract_business_info': {
            // Handle direct business info extraction
            return res.json({
              type: 'function_result',
              response: analysis.message,
              data: analysis.arguments
            });
          }
        }
      }

      // Default response if no function was called
      return res.json({
        type: 'message',
        response: analysis.type === 'message' ? analysis.content : analysis.message,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
