import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SessionState {
  hasStoredSession: boolean;
  profileExists: boolean;
}

const initialState: SessionState = {
  hasStoredSession: false,
  profileExists: false,
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
  },
  selectors: {
    selectHasStoredSession: sliceState => sliceState.hasStoredSession,
    selectProfileExists: sliceState => sliceState.profileExists,
  },
});

export const { setHasStoredSession, setProfileExists } = sessionSlice.actions;
export const { selectHasStoredSession, selectProfileExists } =
  sessionSlice.selectors;

export default sessionSlice.reducer;
