export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public type: string = 'AppError',
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(400, message, 'ValidationError', details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, message, 'NotFoundError');
  }
}

export class ExternalAPIError extends AppError {
  constructor(message: string, details?: any) {
    super(502, message, 'ExternalAPIError', details);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string) {
    super(429, message, 'RateLimitError');
  }
}
