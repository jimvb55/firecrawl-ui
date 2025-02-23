import express from 'express';
import { analyzeUserMessage, processBusinessInfo } from '../services/openai.js';
import { searchBusiness, extractBusinessInfo, scrapeImages } from '../services/firecrawl.js';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { validateRequest, rateLimiter, sanitizeResponse } from '../middleware/validateRequest.js';
import { 
  chatRequestSchema, 
  businessSearchSchema, 
  businessInfoSchema, 
  exportRequestSchema,
  ChatMessage 
} from '../types/schemas.js';
import { ValidationError, NotFoundError, ExternalAPIError } from '../types/errors.js';

export const setupFirecrawlRoutes = () => {
  const router = express.Router();

  // Apply global middleware
  router.use(sanitizeResponse());
  router.use(rateLimiter(100, 60 * 1000)); // 100 requests per minute

  // Chat endpoint
  router.post('/chat', validateRequest(chatRequestSchema), async (req, res, next) => {
    const { message, history } = req.body;

    try {
      // Convert chat history to OpenAI format
      const openAIHistory: ChatCompletionMessageParam[] = history.map((msg: ChatMessage) => ({
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
            
            // Get search results with pagination
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;
            const offset = (page - 1) * limit;
            
            const searchResults = await searchBusiness(searchQuery);
            const paginatedResults = searchResults.slice(offset, offset + limit);

            if (paginatedResults.length === 0) {
              throw new NotFoundError('No business information found');
            }

            // Process first result in detail
            const businessInfo = await extractBusinessInfo(paginatedResults[0].url);
            const images = await scrapeImages(paginatedResults[0].url);
            
            // Process the gathered information with OpenAI
            const processedInfo = await processBusinessInfo(
              { ...businessInfo, images },
              [...openAIHistory, { role: 'assistant', content: analysis.message || '' }]
            );

            return res.json({
              type: 'business_info',
              response: processedInfo.content,
              data: businessInfo,
              images: images,
              pagination: {
                total: searchResults.length,
                page,
                limit,
                hasMore: offset + limit < searchResults.length
              },
              alternativeResults: paginatedResults.slice(1).map(result => ({
                url: result.url,
                title: result.title,
                description: result.description
              }))
            });
          }

          case 'extract_business_info': {
            if (!analysis.arguments.url) {
              throw new ValidationError('URL is required for business info extraction');
            }

            const businessInfo = await extractBusinessInfo(analysis.arguments.url);
            return res.json({
              type: 'function_result',
              response: analysis.message,
              data: businessInfo
            });
          }

          default:
            throw new ValidationError(`Unsupported function: ${analysis.function}`);
        }
      }

      return res.json({
        type: 'message',
        response: analysis.type === 'message' ? analysis.content : analysis.message,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'OpenAIError') {
        throw new ExternalAPIError('Failed to process with OpenAI', { message: error.message });
      }
      throw error;
    }
  });

  // Export endpoint
  router.post('/export', validateRequest(exportRequestSchema), async (req, res, next) => {
    try {
      const { history, format } = req.body;

      let exportData: string;
      switch (format) {
        case 'json':
          exportData = JSON.stringify(history, null, 2);
          break;
        case 'markdown':
          exportData = history.map((msg: ChatMessage) => 
            `### ${msg.role.charAt(0).toUpperCase() + msg.role.slice(1)}\n${msg.content}\n`
          ).join('\n');
          break;
        case 'text':
          exportData = history.map((msg: ChatMessage) => 
            `${msg.role.toUpperCase()}: ${msg.content}`
          ).join('\n\n');
          break;
        default:
          throw new ValidationError('Unsupported export format');
      }

      res.json({ data: exportData });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
