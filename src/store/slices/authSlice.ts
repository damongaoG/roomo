import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    login: state => {
      state.isAuthenticated = true;
    },
    logout: state => {
      state.isAuthenticated = false;
      state.hasCompletedOnboarding = false;
    },
    completeOnboarding: state => {
      state.hasCompletedOnboarding = true;
    },
    resetAuth: () => initialState,
  },
});

export const {
  setAuthenticated,
  setLoading,
  login,
  logout,
  completeOnboarding,
  resetAuth,
} = authSlice.actions;

export default authSlice.reducer;
