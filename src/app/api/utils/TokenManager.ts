/**
 * Smart Token Manager
 * Handles token storage, refresh, validation, and synchronization
 */

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Timestamp when token expires
  role?: string;
  namaLengkap?: string;
}

interface StoredTokenData extends TokenData {
  storedAt: number; // Timestamp when token was stored
}

class TokenManagerClass {
  private static instance: TokenManagerClass;
  private tokenKey = 'puspadaya_token';
  private refreshThreshold = 60000; // Refresh 1 minute before expiry
  private refreshInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): TokenManagerClass {
    if (!TokenManagerClass.instance) {
      TokenManagerClass.instance = new TokenManagerClass();
    }
    return TokenManagerClass.instance;
  }

  /**
   * Save token to all storage (localStorage, sessionStorage, cookies)
   */
  public saveToken(tokenData: TokenData): void {
    const storedData: StoredTokenData = {
      ...tokenData,
      storedAt: Date.now(),
    };

    try {
      // Save to localStorage (persistent)
      localStorage.setItem(this.tokenKey, JSON.stringify(storedData));

      // Save to sessionStorage (session-based)
      sessionStorage.setItem('access_token', tokenData.accessToken);
      sessionStorage.setItem('refresh_token', tokenData.refreshToken);
      if (tokenData.role) {
        sessionStorage.setItem('user_role', tokenData.role);
      }
      if (tokenData.namaLengkap) {
        sessionStorage.setItem('nama_lengkap', tokenData.namaLengkap);
      }

      // Save to cookies (for middleware) - 7 days
      const cookieExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      document.cookie = `token=${tokenData.accessToken}; path=/; expires=${cookieExpiry.toUTCString()}; SameSite=Strict; Secure`;

      // Start auto-refresh
      this.startAutoRefresh();
    } catch (error) {
      console.error('Error saving token:', error);
      throw new Error('Gagal menyimpan token');
    }
  }

  /**
   * Get token from storage
   */
  public getToken(): TokenData | null {
    try {
      const stored = localStorage.getItem(this.tokenKey);
      if (!stored) {
        return null;
      }

      const tokenData: StoredTokenData = JSON.parse(stored);
      return {
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        expiresAt: tokenData.expiresAt,
        role: tokenData.role,
        namaLengkap: tokenData.namaLengkap,
      };
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Check if token is valid (not expired)
   */
  public isValid(): boolean {
    const tokenData = this.getToken();
    if (!tokenData) {
      return false;
    }

    const now = Date.now();
    const timeUntilExpiry = tokenData.expiresAt - now;

    // Token is valid if it expires in more than refreshThreshold
    return timeUntilExpiry > this.refreshThreshold;
  }

  /**
   * Check if token needs refresh
   */
  public needsRefresh(): boolean {
    const tokenData = this.getToken();
    if (!tokenData) {
      return true;
    }

    const now = Date.now();
    const timeUntilExpiry = tokenData.expiresAt - now;

    // Needs refresh if expires within refreshThreshold (1 minute)
    return timeUntilExpiry <= this.refreshThreshold;
  }

  /**
   * Check if token is expired
   */
  public isExpired(): boolean {
    const tokenData = this.getToken();
    if (!tokenData) {
      return true;
    }

    return Date.now() >= tokenData.expiresAt;
  }

  /**
   * Get access token (auto-refresh if needed)
   */
  public async getAccessToken(): Promise<string | null> {
    const tokenData = this.getToken();
    if (!tokenData) {
      return null;
    }

    // If token needs refresh, try to refresh it
    if (this.needsRefresh()) {
      // console.log('🔄 Token needs refresh, attempting to refresh...');
      // Note: Actual refresh logic should be handled by the app
      // This is just a placeholder
    }

    // If token is still valid, return it
    if (this.isValid()) {
      return tokenData.accessToken;
    }

    // Token is expired or invalid
    return null;
  }

  /**
   * Start auto-refresh mechanism
   */
  public startAutoRefresh(): void {
    // Clear existing interval
    this.stopAutoRefresh();

    // Check every 30 seconds if token needs refresh
    this.refreshInterval = setInterval(() => {
      if (this.needsRefresh() && !this.isExpired()) {
        // console.log('🔄 Auto-refreshing token...');
        // Emit event for app to handle refresh
        window.dispatchEvent(new CustomEvent('token:refreshNeeded'));
      } else if (this.isExpired()) {
        // console.log('⚠️ Token expired, logging out...');
        window.dispatchEvent(new CustomEvent('token:expired'));
        this.stopAutoRefresh();
      }
    }, 30000); // Check every 30 seconds

    // console.log('✅ Auto-refresh started');
  }

  /**
   * Stop auto-refresh mechanism
   */
  public stopAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  /**
   * Clear all token storage (logout)
   */
  public clearToken(): void {
    try {
      // Clear localStorage
      localStorage.removeItem(this.tokenKey);

      // Clear sessionStorage
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
      sessionStorage.removeItem('user_role');
      sessionStorage.removeItem('nama_lengkap');

      // Clear cookie
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';

      // Stop auto-refresh
      this.stopAutoRefresh();
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  }

  /**
   * Sync token across all storage
   */
  public syncStorage(): void {
    const tokenData = this.getToken();
    if (tokenData) {
      this.saveToken(tokenData);
    }
  }

  /**
   * Get token expiry time
   */
  public getExpiryTime(): number | null {
    const tokenData = this.getToken();
    return tokenData ? tokenData.expiresAt : null;
  }

  /**
   * Get time until token expires (in milliseconds)
   */
  public getTimeUntilExpiry(): number | null {
    const tokenData = this.getToken();
    if (!tokenData) {
      return null;
    }
    return tokenData.expiresAt - Date.now();
  }

  /**
   * Get user info from token
   */
  public getUserInfo(): { role?: string; namaLengkap?: string } | null {
    const tokenData = this.getToken();
    if (!tokenData) {
      return null;
    }
    return {
      role: tokenData.role,
      namaLengkap: tokenData.namaLengkap,
    };
  }
}

// Export singleton instance
export const TokenManager = TokenManagerClass.getInstance();
