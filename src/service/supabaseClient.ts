import { createClient } from '@supabase/supabase-js';
import { Capacitor } from '@capacitor/core';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

type AsyncStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const createSecureStorageAdapter = (): AsyncStorage => {
  return {
    getItem: async (key: string) => {
      try {
        const { value } = await SecureStoragePlugin.get({ key });
        return value ?? null;
      } catch {
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      await SecureStoragePlugin.set({ key, value });
    },
    removeItem: async (key: string) => {
      try {
        await SecureStoragePlugin.remove({ key });
      } catch {
        // no-op if key does not exist
      }
    },
  };
};

const createWebStorageAdapter = (): AsyncStorage => {
  return {
    getItem: async (key: string) => {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      window.localStorage.setItem(key, value);
    },
    removeItem: async (key: string) => {
      window.localStorage.removeItem(key);
    },
  };
};

const storage: AsyncStorage = Capacitor.isNativePlatform()
  ? createSecureStorageAdapter()
  : createWebStorageAdapter();

export const AUTH_STORAGE_KEY = 'roomo.supabase.auth';
const hasSupabaseConfig = Boolean(supabaseUrl) && Boolean(supabaseAnonKey);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: any = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage,
        storageKey: AUTH_STORAGE_KEY,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : {
      auth: {
        onAuthStateChange: () => {
          return { data: { subscription: { unsubscribe: () => {} } } };
        },
        // no-op signOut to avoid runtime errors when env is missing
        signOut: async () => {},
      },
    };

export const hasStoredSession = async (): Promise<boolean> => {
  try {
    const value = await storage.getItem(AUTH_STORAGE_KEY);
    return value != null && value.length > 0;
  } catch {
    return false;
  }
};
