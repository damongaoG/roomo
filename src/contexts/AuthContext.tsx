import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
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
  setSearchPreferences,
  setPropertyInformation,
} from '../store/slices/sessionSlice';
import { getCurrentUserProfile } from '../service/userProfileApi';
import type { UserRole } from '../service/userProfileApi';

interface AuthContextType {
  // Derived booleans
  isAuthenticated: boolean;
  hasStoredSession: boolean;
  profileExists: boolean;
  loading: boolean;
  profileSyncing: boolean;
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
  const [profileSyncing, setProfileSyncing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const lastSyncedTokenRef = useRef<string | null>(null);

  const syncProfileState = useCallback(
    async (session: Session | null) => {
      const accessToken = session?.access_token ?? null;

      if (!accessToken) {
        console.log('[Auth] syncProfileState skipped: no access token');
        setProfileSyncing(false);
        lastSyncedTokenRef.current = null;
        dispatch(setProfileExists(false));
        dispatch(setUserRole(null));
        dispatch(setSearchPreferences(null));
        dispatch(setPropertyInformation(null));
        return;
      }

      if (lastSyncedTokenRef.current === accessToken) {
        console.log(
          '[Auth] syncProfileState skipped: already synced for token'
        );
        setProfileSyncing(false);
        return;
      }

      console.log('[Auth] syncProfileState fetching user profile');
      setProfileSyncing(true);

      try {
        const { data } = await getCurrentUserProfile(accessToken);
        const userProfile = data?.user_profile ?? null;
        const searchPreferences = data?.search_preferences ?? null;
        const propertyInformation = data?.property_information ?? null;
        const hasProfile = Boolean(userProfile);
        console.log('[Auth] syncProfileState result', {
          hasProfile,
          role: userProfile?.role ?? null,
          hasSearchPreferences: searchPreferences != null,
          hasPropertyInformation: propertyInformation != null,
        });
        dispatch(setProfileExists(hasProfile));
        dispatch(setUserRole(userProfile?.role ?? null));
        dispatch(setSearchPreferences(searchPreferences));
        dispatch(setPropertyInformation(propertyInformation));
        lastSyncedTokenRef.current = accessToken;
      } catch (error) {
        console.warn('[Auth] Failed to sync user profile', error);
        dispatch(setProfileExists(false));
        dispatch(setUserRole(null));
        dispatch(setSearchPreferences(null));
        dispatch(setPropertyInformation(null));
        lastSyncedTokenRef.current = null;
      } finally {
        setProfileSyncing(false);
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
        dispatch(setSearchPreferences(null));
        lastSyncedTokenRef.current = null;
        setProfileSyncing(false);
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
        await syncProfileState(session);
      } else {
        dispatch(setProfileExists(false));
        dispatch(setUserRole(null));
        dispatch(setSearchPreferences(null));
        dispatch(setPropertyInformation(null));
        lastSyncedTokenRef.current = null;
        setProfileSyncing(false);
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
          dispatch(setSearchPreferences(null));
          dispatch(setPropertyInformation(null));
          lastSyncedTokenRef.current = null;
          setProfileSyncing(false);
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
    dispatch(setSearchPreferences(null));
    dispatch(setPropertyInformation(null));
    lastSyncedTokenRef.current = null;
    setProfileSyncing(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        hasStoredSession: storedSession,
        profileExists,
        loading,
        profileSyncing,
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
