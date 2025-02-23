import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/errors.js';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        type: err.type,
        message: err.message,
        details: err.details,
        status: err.statusCode
      }
    });
  }

  // Handle axios errors
  if (err.name === 'AxiosError') {
    const axiosError = err as any;
    return res.status(502).json({
      error: {
        type: 'ExternalAPIError',
        message: 'External API request failed',
        details: {
          message: axiosError.message,
          response: axiosError.response?.data
        },
        status: 502
      }
    });
  }

  // Handle OpenAI API errors
  if (err.name === 'OpenAIError') {
    return res.status(502).json({
      error: {
        type: 'ExternalAPIError',
        message: 'OpenAI API request failed',
        details: {
          message: err.message
        },
        status: 502
      }
    });
  }

  // Default error response
  res.status(500).json({
    error: {
      type: 'InternalServerError',
      message: 'An unexpected error occurred',
      status: 500
    }
  });
};

// Catch-all for unhandled promise rejections
process.on('unhandledRejection', (reason: any) => {
  console.error('Unhandled Rejection:', reason);
  // Let the process continue instead of crashing
});
