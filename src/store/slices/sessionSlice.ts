import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Session } from '@supabase/supabase-js';
import type { UserRole } from '../../service/userProfileApi';

export interface SessionState {
  hasStoredSession: boolean;
  profileExists: boolean;
  authSession: Session | null;
  role: UserRole | null;
}

const initialState: SessionState = {
  hasStoredSession: false,
  profileExists: false,
  authSession: null,
  role: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setHasStoredSession(state, action: PayloadAction<boolean>) {
      state.hasStoredSession = action.payload;
    },
    setProfileExists(state, action: PayloadAction<boolean>) {
      state.profileExists = action.payload;
    },
    setAuthSession(state, action: PayloadAction<Session | null>) {
      state.authSession = action.payload;
    },
    setUserRole(state, action: PayloadAction<UserRole | null>) {
      state.role = action.payload;
    },
  },
  selectors: {
    selectHasStoredSession: sliceState => sliceState.hasStoredSession,
    selectProfileExists: sliceState => sliceState.profileExists,
    selectAuthSession: sliceState => sliceState.authSession,
    selectUserRole: sliceState => sliceState.role,
  },
});

export const {
  setHasStoredSession,
  setProfileExists,
  setAuthSession,
  setUserRole,
} = sessionSlice.actions;
export const {
  selectHasStoredSession,
  selectProfileExists,
  selectAuthSession,
  selectUserRole,
} = sessionSlice.selectors;

export default sessionSlice.reducer;
