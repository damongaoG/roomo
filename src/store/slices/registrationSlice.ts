import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RegistrationState {
  minBudgetPerWeek: number | null;
  maxBudgetPerWeek: number | null;
  suburb: string;
}

const initialState: RegistrationState = {
  minBudgetPerWeek: null,
  maxBudgetPerWeek: null,
  suburb: '',
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
    setSuburb: (state, action: PayloadAction<string>) => {
      state.suburb = action.payload;
    },
  },
});

export const { setBudgetRange, setSuburb } = registrationSlice.actions;
export default registrationSlice.reducer;
