export class OpenAIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OpenAIError';
  }
}

export class FirecrawlError extends Error {
  constructor(
    message: string,
    public details?: {
      status?: number;
      retryAfter?: number;
      originalError?: Error;
      details?: unknown;
    }
  ) {
    super(message);
    this.name = 'FirecrawlError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public details?: {
      path?: string;
      waitTime?: number;
      [key: string]: unknown;
    }
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
