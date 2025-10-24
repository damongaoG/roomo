import { Capacitor } from '@capacitor/core';
import { secureStorage } from './secureStorage';

export class TokenManager {
  static async getIdToken(): Promise<string | null> {
    try {
      if (Capacitor.isNativePlatform()) {
        const storedToken = await secureStorage.getIdToken();
        if (storedToken) {
          return storedToken;
        }
      }

      return null;
    } catch (error) {
      console.error('TokenManager: Failed to get ID token', error);
      return null;
    }
  }

  static async getAccessToken(): Promise<string | null> {
    try {
      if (Capacitor.isNativePlatform()) {
        const storedToken = await secureStorage.getAccessToken();
        if (storedToken) {
          return storedToken;
        }
      }

      return null;
    } catch (error) {
      console.error('TokenManager: Failed to get access token', error);
      return null;
    }
  }

  static async clearTokens(): Promise<void> {
    try {
      await secureStorage.clearTokens();
    } catch (error) {
      console.error('TokenManager: Failed to clear tokens', error);
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      return await secureStorage.hasValidTokens();
    } catch (error) {
      console.error(
        'TokenManager: Failed to check authentication state',
        error
      );
      return false;
    }
  }
}

export const useTokenManager = () => {
  const getIdToken = async (): Promise<string | null> => {
    try {
      if (Capacitor.isNativePlatform()) {
        // First check secure storage
        const storedToken = await secureStorage.getIdToken();
        if (storedToken) {
          return storedToken;
        }
      }

      return null;
    } catch (error) {
      console.error('useTokenManager: Failed to get ID token', error);
      return null;
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    try {
      if (Capacitor.isNativePlatform()) {
        // First check secure storage
        const storedToken = await secureStorage.getAccessToken();
        if (storedToken) {
          return storedToken;
        }
      }

      return null;
    } catch (error) {
      console.error('useTokenManager: Failed to get access token', error);
      return null;
    }
  };

  const secureLogout = async (): Promise<void> => {
    try {
      // Clear secure storage first
      await secureStorage.clearTokens();
    } catch (error) {
      console.error('useTokenManager: Failed to logout securely', error);
    }
  };

  return {
    getIdToken,
    getAccessToken,
    secureLogout,
    isAuthenticated: async () => false,
  };
};
