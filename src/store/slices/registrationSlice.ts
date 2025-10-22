import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RegistrationState {
  minBudgetPerWeek: number | null;
  maxBudgetPerWeek: number | null;
}

const initialState: RegistrationState = {
  minBudgetPerWeek: null,
  maxBudgetPerWeek: null,
};

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setBudgetRange: (
      state,
      action: PayloadAction<{
        minBudgetPerWeek: number;
        maxBudgetPerWeek: number;
      }>
    ) => {
      state.minBudgetPerWeek = action.payload.minBudgetPerWeek;
      state.maxBudgetPerWeek = action.payload.maxBudgetPerWeek;
    },
  },
});

export const { setBudgetRange } = registrationSlice.actions;
export default registrationSlice.reducer;
