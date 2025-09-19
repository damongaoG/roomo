import { useAuth0 } from '@auth0/auth0-react';
import { Capacitor } from '@capacitor/core';
import { secureStorage } from './secureStorage';
import { useAppDispatch, logout as logoutAction } from '../store';

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
  const { getIdTokenClaims, getAccessTokenSilently, logout, isAuthenticated } =
    useAuth0();
  const dispatch = useAppDispatch();

  const getIdToken = async (): Promise<string | null> => {
    try {
      if (Capacitor.isNativePlatform()) {
        // First check secure storage
        const storedToken = await secureStorage.getIdToken();
        if (storedToken) {
          return storedToken;
        }
      }

      // Get fresh token from Auth0 and store
      const claims = await getIdTokenClaims();
      if (claims && claims.__raw) {
        const token = claims.__raw;

        // Store for mobile apps
        if (Capacitor.isNativePlatform()) {
          await secureStorage.setIdToken(token);
        }

        return token;
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

      // Get fresh token from Auth0 and store
      const token = await getAccessTokenSilently();

      if (Capacitor.isNativePlatform()) {
        await secureStorage.setAccessToken(token);
      }

      return token;
    } catch (error) {
      console.error('useTokenManager: Failed to get access token', error);
      return null;
    }
  };

  const secureLogout = async (): Promise<void> => {
    try {
      // Clear secure storage first
      await secureStorage.clearTokens();

      // Update Redux auth state
      dispatch(logoutAction());

      // Logout from Auth0
      logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    } catch (error) {
      console.error('useTokenManager: Failed to logout securely', error);
    }
  };

  return {
    getIdToken,
    getAccessToken,
    secureLogout,
    isAuthenticated,
  };
};
