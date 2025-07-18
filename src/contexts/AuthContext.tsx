import React, {createContext, ReactNode, useContext, useState} from "react";

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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setHasCompletedOnboarding(false);
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
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
