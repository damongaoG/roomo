import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase, hasStoredSession } from '../service/supabaseClient';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setHasStoredSession,
  setProfileExists,
  selectHasStoredSession,
  selectProfileExists,
} from '../store/slices/sessionSlice';
import { checkUserProfileExists } from '../service/supabaseClient';

interface AuthContextType {
  // Derived booleans
  isAuthenticated: boolean;
  hasStoredSession: boolean;
  profileExists: boolean;
  loading: boolean;
  userId: string | null;

  // Actions
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useAppDispatch();
  const storedSession = useAppSelector(selectHasStoredSession);
  const profileExists = useAppSelector(selectProfileExists);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Initialize auth & onboarding
  useEffect(() => {
    const init = async () => {
      const exists = await hasStoredSession();
      dispatch(setHasStoredSession(exists));
      if (!exists) {
        setIsAuthenticated(false);
        dispatch(setProfileExists(false));
        setLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      const session = (data as { session: Session | null }).session;
      console.log('[Auth] init: session present?', !!session);
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id ?? null);

      if (session?.user?.id) {
        console.log('[Auth] init: checking profile for user', session.user.id);
        const hasProfile = await checkUserProfileExists(session.user.id);
        dispatch(setProfileExists(hasProfile));
      } else {
        dispatch(setProfileExists(false));
      }
      setLoading(false);
    };
    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        console.log('[Auth] onAuthStateChange: session present?', !!session);
        setIsAuthenticated(!!session);
        dispatch(setHasStoredSession(!!session));
        setUserId(session?.user?.id ?? null);
        if (session?.user?.id) {
          console.log(
            '[Auth] onAuthStateChange: checking profile for user',
            session.user.id
          );
          const hasProfile = await checkUserProfileExists(session.user.id);
          dispatch(setProfileExists(hasProfile));
        } else {
          dispatch(setProfileExists(false));
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Profile fetching happens in onAuthStateChange when session is present

  const login = () => {
    setIsAuthenticated(true);
    dispatch(setHasStoredSession(true));
  };

  const logout = async () => {
    setIsAuthenticated(false);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      // Ensure we do not swallow errors silently to satisfy linter and aid debugging
      console.warn('[Auth] signOut failed', error);
    }
    dispatch(setHasStoredSession(false));
    dispatch(setProfileExists(false));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        hasStoredSession: storedSession,
        profileExists,
        loading,
        userId,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
