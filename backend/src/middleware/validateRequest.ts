import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { ValidationError } from '../types/errors.js';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request against schema
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      next();
    } catch (error: any) {
      // Transform Zod validation errors into our ValidationError format
      const details = error.errors?.map((err: any) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      
      next(new ValidationError('Invalid request data', { details }));
    }
  };
};

// Rate limiting middleware
export const rateLimiter = (
  maxRequests: number,
  windowMs: number
) => {
  const requests = new Map<string, number[]>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const ip = req.ip || req.socket.remoteAddress || 'unknown';

    // Get existing requests for this IP
    const userRequests = requests.get(ip) || [];
    
    // Remove requests outside the time window
    const recentRequests = userRequests.filter(
      timestamp => now - timestamp < windowMs
    );

    if (recentRequests.length >= maxRequests) {
      const oldestRequest = recentRequests[0] || now;
      const waitTime = Math.ceil((windowMs - (now - oldestRequest)) / 1000);
      next(new ValidationError(`Too many requests. Please try again in ${waitTime} seconds.`, { waitTime }));
      return;
    }

    // Add current request
    recentRequests.push(now);
    requests.set(ip, recentRequests);

    // Cleanup old entries periodically
    if (Math.random() < 0.1) { // 10% chance to run cleanup
      for (const [ip, timestamps] of requests.entries()) {
        const validTimestamps = timestamps.filter(ts => now - ts < windowMs);
        if (validTimestamps.length === 0) {
          requests.delete(ip);
        } else {
          requests.set(ip, validTimestamps);
        }
      }
    }

    next();
  };
};

// Sanitize response data to prevent sensitive info leakage
export const sanitizeResponse = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.json;
    res.json = function (body: any) {
      // Remove sensitive fields
      if (body && typeof body === 'object') {
        const sanitized = { ...body };
        delete sanitized.apiKey;
        delete sanitized.password;
        delete sanitized.token;
        delete sanitized.secret;
        return originalSend.call(this, sanitized);
      }
      return originalSend.call(this, body);
    };
    next();
  };
};
