import {
  type AuthChangeEvent,
  type AuthError,
  type AuthResponse,
  createClient,
  type Session,
  type User,
} from '@supabase/supabase-js';
import { Preferences } from '@capacitor/preferences';
// import { Capacitor } from '@capacitor/core';
// import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
export const SUPABASE_ANON_KEY = import.meta.env
  .VITE_SUPABASE_ANON_KEY as string;

// type AsyncStorage = {
//   getItem: (key: string) => Promise<string | null>;
//   setItem: (key: string, value: string) => Promise<void>;
//   removeItem: (key: string) => Promise<void>;
// };

// const createSecureStorageAdapter = (): AsyncStorage => {
//   return {
//     getItem: async (key: string) => {
//       try {
//         const { value } = await SecureStoragePlugin.get({ key });
//         return value ?? null;
//       } catch {
//         return null;
//       }
//     },
//     setItem: async (key: string, value: string) => {
//       await SecureStoragePlugin.set({ key, value });
//     },
//     removeItem: async (key: string) => {
//       try {
//         await SecureStoragePlugin.remove({ key });
//       } catch {
//         // no-op if key does not exist
//       }
//     },
//   };
// };

// const createWebStorageAdapter = (): AsyncStorage => {
//   return {
//     getItem: async (key: string) => {
//       try {
//         return window.localStorage.getItem(key);
//       } catch {
//         return null;
//       }
//     },
//     setItem: async (key: string, value: string) => {
//       window.localStorage.setItem(key, value);
//     },
//     removeItem: async (key: string) => {
//       window.localStorage.removeItem(key);
//     },
//   };
// };

// const platform = Capacitor.getPlatform();
// const usingNativeSecureStorage = platform === 'ios' || platform === 'android';
// const storage: AsyncStorage = usingNativeSecureStorage
//   ? createSecureStorageAdapter()
//   : createWebStorageAdapter();

export const AUTH_STORAGE_KEY = 'roomo.supabase.auth';
const hasSupabaseConfig = Boolean(SUPABASE_URL) && Boolean(SUPABASE_ANON_KEY);

export const getSupabaseConfigStatus = () => ({
  hasSupabaseConfig,
  supabaseUrlPresent: Boolean(SUPABASE_URL),
  supabaseAnonKeyPresent: Boolean(SUPABASE_ANON_KEY),
});

type SupabaseAuthLike = {
  onAuthStateChange: (
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) => { data: { subscription: { unsubscribe: () => void } } };
  signOut: () => Promise<{ error: AuthError | null }>;
  signUp: (params: {
    email: string;
    password: string;
  }) => Promise<AuthResponse>;
  signInWithPassword: (params: {
    email: string;
    password: string;
  }) => Promise<AuthResponse>;
  getSession: () => Promise<{
    data: { session: Session | null };
    error: AuthError | null;
  }>;
  getUser: () => Promise<{
    data: { user: User | null };
    error: AuthError | null;
  }>;
};

type PostgrestQueryResult = {
  data: unknown;
  error: { message: string } | null;
  count: number | null;
};

type PostgrestInsertSelectResult = {
  data: unknown;
  error: { message: string } | null;
};

type PostgrestInsertBuilder = {
  select: (columns?: string) => Promise<PostgrestInsertSelectResult>;
};

type PostgrestSelectBuilder = {
  select: (
    columns?: string,
    options?: { count?: 'exact' | 'planned' | 'estimated'; head?: boolean }
  ) => PostgrestSelectBuilder;
  eq: (column: string, value: unknown) => PostgrestSelectBuilder;
  limit: (count: number) => Promise<PostgrestQueryResult>;
};

type PostgrestFromBuilder = PostgrestSelectBuilder & {
  insert: (
    values: Record<string, unknown> | Record<string, unknown>[]
  ) => PostgrestInsertBuilder;
};

export type SupabaseClientLike = {
  auth: SupabaseAuthLike;
  from: (table: string) => PostgrestFromBuilder;
};

const createStubAuth = (): SupabaseAuthLike => {
  return {
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
    signOut: async () => ({ error: null }),
    signUp: async () => ({
      data: { user: null, session: null },
      error: {
        name: 'AuthError',
        message:
          'Supabase credentials are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
        status: 400,
      } as AuthError,
    }),
    signInWithPassword: async () => ({
      data: { user: null, session: null },
      error: {
        name: 'AuthError',
        message:
          'Supabase credentials are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
        status: 400,
      } as AuthError,
    }),
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
  };
};

const createStubFrom = (): ((table: string) => PostgrestFromBuilder) => {
  return () => {
    const builder: PostgrestFromBuilder = {
      select: () => builder,
      eq: () => builder,
      limit: async () => ({ data: [], error: null, count: 0 }),
      insert: () => ({ select: async () => ({ data: [], error: null }) }),
    };
    return builder;
  };
};

export const supabase: SupabaseClientLike = hasSupabaseConfig
  ? (createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: AUTH_STORAGE_KEY,
        storage: {
          getItem: async (key: string): Promise<string | null> => {
            const { value } = await Preferences.get({ key });
            return value ?? null;
          },
          setItem: async (key: string, value: string): Promise<void> => {
            await Preferences.set({ key, value });
          },
          removeItem: async (key: string): Promise<void> => {
            await Preferences.remove({ key });
          },
        },
      },
      global: {
        fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
          try {
            return await fetch(input, { ...init });
          } catch (e) {
            console.warn('[Net] fetch error', e);
            throw e;
          }
        },
      },
      realtime: { params: { eventsPerSecond: 2 } },
    }) as unknown as SupabaseClientLike)
  : { auth: createStubAuth(), from: createStubFrom() };

export const hasStoredSession = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getSession();
    return Boolean((data as { session: Session | null }).session);
  } catch {
    return false;
  }
};
