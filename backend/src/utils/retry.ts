interface RetryOptions {
  maxAttempts: number;
  initialDelay?: number;
  maxDelay?: number;
  retryableErrors?: Array<string | RegExp>;
}

const defaultOptions: RetryOptions = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  retryableErrors: []
};

function isRetryableError(error: Error, patterns: Array<string | RegExp>): boolean {
  return patterns.some(pattern => {
    if (typeof pattern === 'string') {
      return error.message.includes(pattern) || error.name.includes(pattern);
    }
    return pattern.test(error.message) || pattern.test(error.name);
  });
}

function calculateDelay(attempt: number, initialDelay: number, maxDelay: number): number {
  const delay = initialDelay * Math.pow(2, attempt - 1);
  return Math.min(delay, maxDelay);
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = defaultOptions
): Promise<T> {
  const { maxAttempts, initialDelay = 1000, maxDelay = 10000, retryableErrors = [] } = options;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxAttempts || !isRetryableError(lastError, retryableErrors)) {
        throw lastError;
      }

      const delay = calculateDelay(attempt, initialDelay, maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // This should never be reached due to the throw in the catch block
  throw lastError || new Error('Retry failed');
}
