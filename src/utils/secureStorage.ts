import { Preferences } from '@capacitor/preferences';
import { ICache } from '@auth0/auth0-react';
import { an } from 'vitest/dist/reporters-5f784f42';

export class SecureTokenCache implements ICache {
  private readonly keyPrefix = 'auth0_secure_';

  async set<T = any>(key: string, entry: T): Promise<void> {
    try {
      const value = typeof entry === 'string' ? entry : JSON.stringify(entry);
      await Preferences.set({
        key: this.keyPrefix + key,
        value: value,
      });
    } catch (error) {
      console.error('SecureTokenCache: Failed to set value', error);
      throw error;
    }
  }

  async get<T = any>(key: string): Promise<T | undefined> {
    try {
      const result = await Preferences.get({
        key: this.keyPrefix + key,
      });

      if (!result.value) {
        return undefined;
      }

      try {
        return JSON.parse(result.value) as T;
      } catch {
        return result.value as T;
      }
    } catch (error) {
      console.error('SecureTokenCache: Failed to get value', error);
      return undefined;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await Preferences.remove({
        key: this.keyPrefix + key,
      });
    } catch (error) {
      console.error('SecureTokenCache: Failed to remove value', error);
      throw error;
    }
  }

  async allKeys(): Promise<string[]> {
    try {
      const { keys } = await Preferences.keys();
      return keys
        .filter(key => key.startsWith(this.keyPrefix))
        .map(key => key.replace(this.keyPrefix, ''));
    } catch (error) {
      console.error('SecureTokenCache: Failed to get all keys', error);
      return [];
    }
  }
}

export const secureStorage = {
  async setIdToken(token: string): Promise<void> {
    await Preferences.set({
      key: 'auth0_id_token',
      value: token,
    });
  },

  async getIdToken(): Promise<string | null> {
    const result = await Preferences.get({
      key: 'auth0_id_token',
    });
    return result.value;
  },

  async setAccessToken(token: string): Promise<void> {
    await Preferences.set({
      key: 'auth0_access_token',
      value: token,
    });
  },

  async getAccessToken(): Promise<string | null> {
    const result = await Preferences.get({
      key: 'auth0_access_token',
    });
    return result.value;
  },

  async setRefreshToken(token: string): Promise<void> {
    await Preferences.set({
      key: 'auth0_refresh_token',
      value: token,
    });
  },

  async getRefreshToken(): Promise<string | null> {
    const result = await Preferences.get({
      key: 'auth0_refresh_token',
    });
    return result.value;
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      Preferences.remove({ key: 'auth0_id_token' }),
      Preferences.remove({ key: 'auth0_access_token' }),
      Preferences.remove({ key: 'auth0_refresh_token' }),
    ]);
  },

  async hasValidTokens(): Promise<boolean> {
    const [idToken, accessToken] = await Promise.all([
      this.getIdToken(),
      this.getAccessToken(),
    ]);
    return !!(idToken && accessToken);
  },
};
