import React, {
  createContext,
  ReactNode,
  useCallback,
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
  setAuthSession,
  selectHasStoredSession,
  selectProfileExists,
  setUserRole,
  selectUserRole,
} from '../store/slices/sessionSlice';
import { getCurrentUserProfile } from '../service/userProfileApi';
import type { UserRole } from '../service/userProfileApi';

interface AuthContextType {
  // Derived booleans
  isAuthenticated: boolean;
  hasStoredSession: boolean;
  profileExists: boolean;
  loading: boolean;
  userId: string | null;
  userRole: UserRole | null;

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
  const userRole = useAppSelector(selectUserRole);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const syncProfileState = useCallback(
    async (session: Session | null) => {
      if (!session?.access_token) {
        dispatch(setProfileExists(false));
        dispatch(setUserRole(null));
        return;
      }

      try {
        const { data } = await getCurrentUserProfile(session.access_token);
        const hasProfile = Boolean(data);
        dispatch(setProfileExists(hasProfile));
        dispatch(setUserRole(data?.role ?? null));
      } catch (error) {
        console.warn('[Auth] Failed to sync user profile', error);
        dispatch(setProfileExists(false));
        dispatch(setUserRole(null));
      }
    },
    [dispatch]
  );

  // Initialize auth & onboarding
  useEffect(() => {
    const init = async () => {
      const exists = await hasStoredSession();
      dispatch(setHasStoredSession(exists));
      if (!exists) {
        setIsAuthenticated(false);
        dispatch(setProfileExists(false));
        dispatch(setAuthSession(null));
        dispatch(setUserRole(null));
        setLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      const session = (data as { session: Session | null }).session;
      console.log('[Auth] init: session present?', !!session);
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id ?? null);
      dispatch(setAuthSession(session ?? null));

      if (session?.user?.id) {
        console.log('[Auth] init: session detected for user', session.user.id);
      } else {
        dispatch(setProfileExists(false));
        dispatch(setUserRole(null));
      }
    };
    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        console.log('[Auth] onAuthStateChange: session present?', !!session);
        setIsAuthenticated(!!session);
        dispatch(setHasStoredSession(!!session));
        setUserId(session?.user?.id ?? null);
        dispatch(setAuthSession(session ?? null));
        if (session?.user?.id) {
          console.log(
            '[Auth] onAuthStateChange: syncing profile for user',
            session.user.id
          );
          await syncProfileState(session);
        } else {
          dispatch(setProfileExists(false));
          dispatch(setUserRole(null));
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch, syncProfileState]);

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
    dispatch(setAuthSession(null));
    dispatch(setUserRole(null));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        hasStoredSession: storedSession,
        profileExists,
        loading,
        userId,
        userRole,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
