import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Session } from '@supabase/supabase-js';

export interface SessionState {
  hasStoredSession: boolean;
  profileExists: boolean;
  authSession: Session | null;
}

const initialState: SessionState = {
  hasStoredSession: false,
  profileExists: false,
  authSession: null,
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
  },
  selectors: {
    selectHasStoredSession: sliceState => sliceState.hasStoredSession,
    selectProfileExists: sliceState => sliceState.profileExists,
    selectAuthSession: sliceState => sliceState.authSession,
  },
});

export const { setHasStoredSession, setProfileExists, setAuthSession } =
  sessionSlice.actions;
export const { selectHasStoredSession, selectProfileExists, selectAuthSession } =
  sessionSlice.selectors;

export default sessionSlice.reducer;
