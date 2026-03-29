/**
 * Retry Logic with Exponential Backoff
 * Smart retry mechanism for API calls
 */

export interface RetryConfig {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: any) => boolean;
}

const DEFAULT_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
  shouldRetry: (error: any) => {
    // Retry on network errors or 5xx server errors
    if (!error.response) return true; // Network error
    if (error.response?.status >= 500) return true; // Server error
    if (error.response?.status === 429) return true; // Rate limit
    return false;
  },
};

/**
 * Sleep utility
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry function with exponential backoff
 * 
 * @param fn - Function to retry
 * @param config - Retry configuration
 * @returns Promise that resolves with the result of fn
 * 
 * @example
 * ```typescript
 * const result = await withRetry(
 *   () => axios.get('/api/data'),
 *   { maxRetries: 3, initialDelay: 1000 }
 * );
 * ```
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const { maxRetries, initialDelay, maxDelay, backoffMultiplier, shouldRetry } = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  let lastError: any;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry if shouldRetry returns false
      if (attempt >= maxRetries || !shouldRetry(error)) {
        break;
      }
      
      // Wait before next retry
      await sleep(delay);
      
      // Increase delay for next retry (exponential backoff)
      delay = Math.min(delay * backoffMultiplier, maxDelay);
    }
  }

  // All retries failed
  throw lastError;
}

/**
 * Retry axios request with exponential backoff
 * 
 * @param axiosCall - Axios call to retry
 * @param config - Retry configuration
 * @returns Axios response
 * 
 * @example
 * ```typescript
 * const response = await retryAxiosRequest(
 *   () => axios.get('/api/data'),
 *   { maxRetries: 3 }
 * );
 * ```
 */
export async function retryAxiosRequest<T = any>(
  axiosCall: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  return withRetry(axiosCall, config);
}

/**
 * Circuit Breaker Pattern
 * Prevents repeated failures from overwhelming the system
 */
export class CircuitBreaker {
  private failureThreshold: number;
  private successThreshold: number;
  private timeout: number;
  private failureCount: number = 0;
  private successCount: number = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private nextAttempt: number = 0;

  constructor(
    failureThreshold: number = 5,
    successThreshold: number = 2,
    timeout: number = 30000 // 30 seconds
  ) {
    this.failureThreshold = failureThreshold;
    this.successThreshold = successThreshold;
    this.timeout = timeout;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.state = 'CLOSED';
        this.successCount = 0;
      }
    }
  }

  private onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }

  getState(): 'CLOSED' | 'OPEN' | 'HALF_OPEN' {
    return this.state;
  }
}

// Export singleton circuit breaker instance
export const apiCircuitBreaker = new CircuitBreaker(5, 2, 30000);
