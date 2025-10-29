import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RegistrationState {
  minBudgetPerWeek: number | null;
  maxBudgetPerWeek: number | null;
  suburb: string;
  moveindate: string | null;
}

const initialState: RegistrationState = {
  minBudgetPerWeek: null,
  maxBudgetPerWeek: null,
  suburb: '',
  moveindate: null,
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
    setMoveindate: (state, action: PayloadAction<string | null>) => {
      state.moveindate = action.payload;
    },
  },
});

export const { setBudgetRange, setSuburb, setMoveindate } =
  registrationSlice.actions;
export default registrationSlice.reducer;
