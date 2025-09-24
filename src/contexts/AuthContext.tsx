import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  useAppDispatch,
  useAppSelector,
  setAuthenticated,
  login as loginAction,
  logout as logoutAction,
  completeOnboarding as completeOnboardingAction,
  setUserInfo,
} from '../store';
import { useApiService } from '../service/api';

interface AuthContextType {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  login: () => void;
  logout: () => void;
  completeOnboarding: () => void;
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
  const { isAuthenticated: auth0IsAuthenticated, logout: auth0Logout } =
    useAuth0();

  const dispatch = useAppDispatch();
  const { isAuthenticated, hasCompletedOnboarding } = useAppSelector(
    state => state.auth
  );

  const { getUserInfo } = useApiService();

  // Watch Auth0 authentication state
  useEffect(() => {
    dispatch(setAuthenticated(auth0IsAuthenticated));
  }, [auth0IsAuthenticated, dispatch]);

  // When authenticated (login or refresh), fetch user profile and store in Redux
  useEffect(() => {
    const maybeFetchUserInfo = async () => {
      if (!auth0IsAuthenticated) return;
      const res = await getUserInfo();
      if (res.success && res.data) {
        const { name, email, role, registrationStep } = res.data;
        if (name && email && role) {
          dispatch(setUserInfo({ name, email, role, registrationStep }));
        }
      }
    };
    maybeFetchUserInfo();
  }, [auth0IsAuthenticated]);

  const login = () => {
    dispatch(loginAction());
  };

  const logout = () => {
    // Clear all authentication state via Redux
    dispatch(logoutAction());

    // Logout from Auth0
    if (auth0IsAuthenticated) {
      auth0Logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    }
  };

  const completeOnboarding = () => {
    dispatch(completeOnboardingAction());
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        hasCompletedOnboarding,
        login,
        logout,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
