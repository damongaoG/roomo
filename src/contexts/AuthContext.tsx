import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";

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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const {isAuthenticated: auth0IsAuthenticated, loginWithRedirect, logout: auth0Logout} = useAuth0();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Check onboarding status from localStorage
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboarding_completed');
    if (onboardingCompleted === 'true') {
      setHasCompletedOnboarding(true);
    }
  }, []);

  const login = () => {
    loginWithRedirect();
  };

  const logout = () => {
    // Clear onboarding status when logging out
    localStorage.removeItem('onboarding_completed');
    setHasCompletedOnboarding(false);

    // Logout from Auth0
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('onboarding_completed', 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: auth0IsAuthenticated,
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
