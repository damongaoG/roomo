import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLocalAuthenticated: boolean;
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
  const {
    isAuthenticated: auth0IsAuthenticated,
    logout: auth0Logout,
    isLoading: auth0IsLoading,
  } = useAuth0();
  const [isLocalAuthenticated, setIsLocalAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Check onboarding status from localStorage
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboarding_completed');
    if (onboardingCompleted === 'true') {
      setHasCompletedOnboarding(true);
    }
  }, []);

  // Watch Auth0 authentication state
  useEffect(() => {
    if (!auth0IsLoading && auth0IsAuthenticated) {
      setIsLocalAuthenticated(true);
    }
  }, [auth0IsAuthenticated, auth0IsLoading]);

  const login = () => {
    setIsLocalAuthenticated(true);
  };

  const logout = () => {
    // Clear local authentication state
    setIsLocalAuthenticated(false);

    // Clear onboarding status when logging out
    localStorage.removeItem('onboarding_completed');
    setHasCompletedOnboarding(false);

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
    setHasCompletedOnboarding(true);
    localStorage.setItem('onboarding_completed', 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: auth0IsAuthenticated,
        isLocalAuthenticated,
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
