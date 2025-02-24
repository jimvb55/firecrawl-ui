import { Router } from 'express';
import { searchBusiness, extractBusinessInfo, scrapeImages } from '../services/firecrawl.js';
import { ValidationError } from '../types/errors.js';

export function setupFirecrawlRoutes() {
  const router = Router();

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
