import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ParkingOption = 'yes' | 'no' | 'on-street';

export interface ListerPropertyState {
  property_type: string | null;
  bedrooms_number: number | null;
  bathrooms_number: number | null;
  parking: ParkingOption | null;
  number_of_people_living: number | null;
}

const initialState: ListerPropertyState = {
  property_type: null,
  bedrooms_number: null,
  bathrooms_number: null,
  parking: null,
  number_of_people_living: null,
};

const listerPropertySlice = createSlice({
  name: 'listerProperty',
  initialState,
  reducers: {
    setPropertyType(state, action: PayloadAction<string | null>) {
      state.property_type = action.payload;
    },
    setBedroomsNumber(state, action: PayloadAction<number | null>) {
      state.bedrooms_number = action.payload;
    },
    setBathroomsNumber(state, action: PayloadAction<number | null>) {
      state.bathrooms_number = action.payload;
    },
    setParking(state, action: PayloadAction<ParkingOption | null>) {
      state.parking = action.payload;
    },
    setNumberOfPeopleLiving(state, action: PayloadAction<number | null>) {
      state.number_of_people_living = action.payload;
    },
    resetListerProperty(state) {
      Object.assign(state, initialState);
    },
  },
  selectors: {
    selectPropertyType: sliceState => sliceState.property_type,
    selectBedroomsNumber: sliceState => sliceState.bedrooms_number,
    selectBathroomsNumber: sliceState => sliceState.bathrooms_number,
    selectParking: sliceState => sliceState.parking,
    selectNumberOfPeopleLiving: sliceState =>
      sliceState.number_of_people_living,
  },
});

export const {
  setPropertyType,
  setBedroomsNumber,
  setBathroomsNumber,
  setParking,
  setNumberOfPeopleLiving,
  resetListerProperty,
} = listerPropertySlice.actions;

export const {
  selectPropertyType,
  selectBedroomsNumber,
  selectBathroomsNumber,
  selectParking,
  selectNumberOfPeopleLiving,
} = listerPropertySlice.selectors;

export default listerPropertySlice.reducer;
