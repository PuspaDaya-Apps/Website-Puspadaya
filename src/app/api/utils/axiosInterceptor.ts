/**
 * Global Axios Interceptors
 * Handles token injection, auto-refresh, and error handling
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { TokenManager } from './TokenManager';
import { apiCircuitBreaker, retryAxiosRequest } from './retry';

// Store reference to refresh token function (will be set by app)
let refreshTokenCallback: (() => Promise<string | null>) | null = null;

/**
 * Set the refresh token callback
 * This should be called during app initialization
 */
export const setRefreshTokenCallback = (
  callback: () => Promise<string | null>
) => {
  refreshTokenCallback = callback;
};

/**
 * Request Interceptor
 * - Injects authorization token
 * - Shows loading state (optional)
 */
const requestInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  try {
    // Get token from TokenManager
    const token = await TokenManager.getAccessToken();

    if (token) {
      // Inject token into headers
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for timeout tracking
    (config as any).metadata = { startTime: Date.now() };

    return config;
  } catch (error) {
    return config;
  }
};

/**
 * Response Interceptor
 * - Handles 401 errors (auto token refresh)
 * - Handles network errors (retry logic)
 * - Handles circuit breaker
 */
const responseInterceptor = async <T>(response: any): Promise<T> => {
  // Reset failure count on success
  if (response.config?.url) {
    // Could track success metrics here
  }
  return response;
};

/**
 * Error Interceptor
 * - Handles token expiration
 * - Implements retry logic
 * - Handles circuit breaker
 */
const errorInterceptor = async (error: AxiosError): Promise<any> => {
  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean;
    _retryCount?: number;
  };

  // Handle network errors or other issues
  if (!error.response && !error.request) {
    return Promise.reject(error);
  }

  // Handle 401 Unauthorized (Token expired or invalid)
  if (error.response?.status === 401 && !originalRequest._retry) {
    if (originalRequest._retry) {
      // Already retried, token refresh failed
      TokenManager.clearToken();
      
      // Dispatch logout event
      window.dispatchEvent(new CustomEvent('auth:logout'));
      
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = '/auth/signin';
      }, 1000);
      
      return Promise.reject(new Error('Session expired'));
    }

    originalRequest._retry = true;

    // Try to refresh token
    if (refreshTokenCallback) {
      try {
        const newToken = await refreshTokenCallback();
        
        if (newToken) {
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        TokenManager.clearToken();
        window.dispatchEvent(new CustomEvent('auth:logout'));
        setTimeout(() => {
          window.location.href = '/auth/signin';
        }, 1000);
        return Promise.reject(refreshError);
      }
    } else {
      // No refresh callback, just logout
      TokenManager.clearToken();
      window.dispatchEvent(new CustomEvent('auth:logout'));
      setTimeout(() => {
        window.location.href = '/auth/signin';
      }, 1000);
      return Promise.reject(new Error('Session expired'));
    }
  }

  // Handle 5xx Server Errors with retry
  if (error.response && error.response.status >= 500) {
    originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
    
    if (originalRequest._retryCount <= 3) {
      // console.log(`⚠️ Server error ${error.response.status}. Retry ${originalRequest._retryCount}/3`);
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, originalRequest._retryCount - 1) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return axios(originalRequest);
    }
  }

  // Handle Circuit Breaker
  if (error.message === 'Circuit breaker is OPEN') {
    return Promise.reject(new Error('Service temporarily unavailable'));
  }

  return Promise.reject(error);
};

/**
 * Setup global axios interceptors
 * Call this once during app initialization
 */
export const setupAxiosInterceptors = () => {
  // Add request interceptor
  axios.interceptors.request.use(requestInterceptor, (error) => {
    return Promise.reject(error);
  });

  // Add response interceptor
  axios.interceptors.response.use(responseInterceptor, errorInterceptor);
};

/**
 * Axios instance with retry and circuit breaker
 * Use this for API calls that need extra resilience
 */
export const resilientAxios = axios.create();

// Setup interceptors for resilient instance too
resilientAxios.interceptors.request.use(
  async (config) => {
    const token = await TokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

resilientAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Use circuit breaker for resilience
    return apiCircuitBreaker.execute(() => {
      return retryAxiosRequest(() => Promise.reject(error), {
        maxRetries: 3,
        initialDelay: 1000,
      });
    });
  }
);
