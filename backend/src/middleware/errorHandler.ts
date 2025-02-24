import { Request, Response, NextFunction } from 'express';
import { FirecrawlError, ValidationError, OpenAIError } from '../types/errors.js';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', error);

  if (error instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: error.message
    });
  }

  if (error instanceof FirecrawlError) {
    const status = error.details?.status || 500;
    return res.status(status).json({
      success: false,
      error: 'FireCrawl Error',
      message: error.message,
      details: error.details
    });
  }

  if (error instanceof OpenAIError) {
    return res.status(500).json({
      success: false,
      error: 'OpenAI Error',
      message: error.message
    });
  }

  // Default error
  return res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: error.message
  });
}
