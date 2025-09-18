import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
  name?: string;
  email?: string;
  role?: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  isLoading: false,
  name: undefined,
  email: undefined,
  role: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    login: state => {
      state.isAuthenticated = true;
    },
    logout: state => {
      state.isAuthenticated = false;
      state.hasCompletedOnboarding = false;
      state.name = undefined;
      state.email = undefined;
      state.role = undefined;
    },
    completeOnboarding: state => {
      state.hasCompletedOnboarding = true;
    },
    setUserInfo: (
      state,
      action: PayloadAction<{ name: string; email: string; role: string }>
    ) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
  },
});

export const {
  setAuthenticated,
  login,
  logout,
  completeOnboarding,
  setUserInfo,
} = authSlice.actions;

export default authSlice.reducer;
