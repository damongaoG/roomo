import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AccommodationTypeOption =
  | 'share-house'
  | 'whole-property'
  | 'homestay'
  | 'student-accommodation';

export interface RegistrationState {
  minBudgetPerWeek: number | null;
  maxBudgetPerWeek: number | null;
  suburb: string;
  moveindate: string | null;
  accommodationType: AccommodationTypeOption | null;
}

const initialState: RegistrationState = {
  minBudgetPerWeek: null,
  maxBudgetPerWeek: null,
  suburb: '',
  moveindate: null,
  accommodationType: null,
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
    setAccommodationType: (
      state,
      action: PayloadAction<AccommodationTypeOption | null>
    ) => {
      state.accommodationType = action.payload;
    },
  },
  selectors: {
    selectHasBudgetRange: sliceState =>
      sliceState.minBudgetPerWeek != null &&
      sliceState.maxBudgetPerWeek != null,
    selectHasSuburbSelection: sliceState => sliceState.suburb.trim().length > 0,
    selectAccommodationType: sliceState => sliceState.accommodationType,
  },
});

export const {
  setBudgetRange,
  setSuburb,
  setMoveindate,
  setAccommodationType,
} = registrationSlice.actions;
export const {
  selectHasBudgetRange,
  selectHasSuburbSelection,
  selectAccommodationType,
} = registrationSlice.selectors;
export default registrationSlice.reducer;
