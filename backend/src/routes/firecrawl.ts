import { Router } from 'express';
import { searchBusiness, extractBusinessInfo, scrapeImages } from '../services/firecrawl.js';
import { analyzeUserMessage } from '../services/openai.js';
import { ValidationError } from '../types/errors.js';

interface AnalysisResponse {
  type: 'function_call' | 'message';
  function?: string;
  arguments?: {
    business_name?: string;
    business_details?: {
      name: string;
      address?: string;
      business_type?: string;
    };
  };
  content?: string;
  message?: string;
}

export function setupFirecrawlRoutes() {
  const router = Router();

  router.post('/chat', async (req, res, next) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string') {
        throw new ValidationError('Message is required and must be a string');
      }

      const analysis = await analyzeUserMessage(message, history || []) as AnalysisResponse;
      
      if (analysis.type === 'function_call' && analysis.arguments) {
        let result;
        switch (analysis.function) {
          case 'analyze_business_query':
            if (!analysis.arguments.business_name) {
              throw new ValidationError('Business name is required for search');
            }
            const searchResults = await searchBusiness(analysis.arguments.business_name);
            result = {
              type: 'search_results',
              response: 'Here are the search results:',
              data: searchResults
            };
            break;
          case 'extract_business_info':
            if (!analysis.arguments.business_details?.name) {
              throw new ValidationError('Business name is required for extraction');
            }
            const businessInfo = await extractBusinessInfo(analysis.arguments.business_details.name);
            result = {
              type: 'business_info',
              response: 'Here is the business information:',
              data: businessInfo
            };
            break;
          default:
            throw new ValidationError(`Unknown function: ${analysis.function}`);
        }
        res.json(result);
      } else {
        res.json({
          type: 'message',
          response: analysis.content
        });
      }
    } catch (error) {
      next(error);
    }
  });

  router.post('/search', async (req, res, next) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string') {
        throw new ValidationError('Query parameter is required and must be a string');
      }

      const results = await searchBusiness(query);
      res.json({ success: true, data: results });
    } catch (error) {
      next(error);
    }
  });

  router.post('/extract', async (req, res, next) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string') {
        throw new ValidationError('URL parameter is required and must be a string');
      }

      const businessInfo = await extractBusinessInfo(url);
      res.json({ success: true, data: businessInfo });
    } catch (error) {
      next(error);
    }
  });

  router.post('/images', async (req, res, next) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string') {
        throw new ValidationError('URL parameter is required and must be a string');
      }

      const images = await scrapeImages(url);
      res.json({ success: true, data: images });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
