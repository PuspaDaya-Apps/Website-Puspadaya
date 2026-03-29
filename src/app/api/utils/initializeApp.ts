/**
 * App Initialization
 * Setup global interceptors and token management
 */

'use client';

import { setupAxiosInterceptors, setRefreshTokenCallback } from '@/app/api/utils/axiosInterceptor';
import { TokenManager } from '@/app/api/utils/TokenManager';
import { refreshToken } from '@/app/api/token/refreshToken'; // We'll create this

/**
 * Initialize app-wide services
 * Call this once in your root layout or app entry point
 */
export const initializeApp = () => {
  // Setup axios interceptors
  setupAxiosInterceptors();

  // Set token refresh callback
  setRefreshTokenCallback(async () => {
    try {
      const tokenData = TokenManager.getToken();
      if (!tokenData) {
        return null;
      }

      // Call refresh token API
      const newToken = await refreshToken(tokenData.refreshToken);
      
      if (newToken) {
        // Update token with new expiry
        TokenManager.saveToken({
          ...tokenData,
          accessToken: newToken,
          expiresAt: Date.now() + (60 * 60 * 1000), // Extend 1 hour
        });
        return newToken;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Token refresh callback failed:', error);
      return null;
    }
  });

  // Start token auto-refresh if user is logged in
  if (TokenManager.getToken()) {
    TokenManager.startAutoRefresh();
  }
};
