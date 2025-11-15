import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ParkingOption = 'yes' | 'no' | 'on-street';

export type RoomType = 'private' | 'shared';
export type RoomFurnishingOption = 'flexible' | 'furnished' | 'unfurnished';
export type RoomBathroomOption = 'own' | 'shared' | 'en-suite';
export type RoomBedSizeOption = 'single' | 'double' | 'queen' | 'king' | 'none';
export type RoomFeatureOption =
  | 'lamp'
  | 'couch'
  | 'kitchenette'
  | 'rug'
  | 'plants'
  | 'doorLocks'
  | 'chair'
  | 'tv'
  | 'drawers'
  | 'bedSideTable'
  | 'wardrobe';

export interface ListerPropertyState {
  property_type: string | null;
  bedrooms_number: number | null;
  bathrooms_number: number | null;
  parking: ParkingOption | null;
  number_of_people_living: number | null;
  accessibility_features: string[];
  room_name: string;
  room_type: RoomType | null;
  room_furnishing: RoomFurnishingOption | null;
  room_bathroom: RoomBathroomOption | null;
  room_bed_size: RoomBedSizeOption | null;
  room_features: RoomFeatureOption[];
  weekly_rent_per_week: number | null;
  bills_included_in_rent: boolean | null;
  available_from_date: string | null;
}

const initialState: ListerPropertyState = {
  property_type: null,
  bedrooms_number: null,
  bathrooms_number: null,
  parking: null,
  number_of_people_living: null,
  accessibility_features: [],
  room_name: '',
  room_type: null,
  room_furnishing: null,
  room_bathroom: null,
  room_bed_size: null,
  room_features: [],
  weekly_rent_per_week: null,
  bills_included_in_rent: null,
  available_from_date: null,
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
    setAccessibilityFeatures(state, action: PayloadAction<string[]>) {
      state.accessibility_features = action.payload;
    },
    setRoomName(state, action: PayloadAction<string>) {
      state.room_name = action.payload;
    },
    setRoomType(state, action: PayloadAction<RoomType | null>) {
      state.room_type = action.payload;
    },
    setRoomFurnishing(
      state,
      action: PayloadAction<RoomFurnishingOption | null>
    ) {
      state.room_furnishing = action.payload;
    },
    setRoomBathroom(state, action: PayloadAction<RoomBathroomOption | null>) {
      state.room_bathroom = action.payload;
    },
    setRoomBedSize(state, action: PayloadAction<RoomBedSizeOption | null>) {
      state.room_bed_size = action.payload;
    },
    toggleRoomFeature(state, action: PayloadAction<RoomFeatureOption>) {
      const feature = action.payload;
      if (state.room_features.includes(feature)) {
        state.room_features = state.room_features.filter(
          item => item !== feature
        );
      } else {
        state.room_features.push(feature);
      }
    },
    setRoomFeatures(state, action: PayloadAction<RoomFeatureOption[]>) {
      state.room_features = action.payload;
    },
    setWeeklyRentPerWeek(state, action: PayloadAction<number | null>) {
      state.weekly_rent_per_week = action.payload;
    },
    setBillsIncludedInRent(state, action: PayloadAction<boolean | null>) {
      state.bills_included_in_rent = action.payload;
    },
    setAvailableFromDate(state, action: PayloadAction<string | null>) {
      state.available_from_date = action.payload;
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
    selectAccessibilityFeatures: sliceState =>
      sliceState.accessibility_features,
    selectRoomName: sliceState => sliceState.room_name,
    selectRoomType: sliceState => sliceState.room_type,
    selectRoomFurnishing: sliceState => sliceState.room_furnishing,
    selectRoomBathroom: sliceState => sliceState.room_bathroom,
    selectRoomBedSize: sliceState => sliceState.room_bed_size,
    selectRoomFeatures: sliceState => sliceState.room_features,
    selectWeeklyRentPerWeek: sliceState => sliceState.weekly_rent_per_week,
    selectBillsIncludedInRent: sliceState => sliceState.bills_included_in_rent,
    selectAvailableFromDate: sliceState => sliceState.available_from_date,
  },
});

export const {
  setPropertyType,
  setBedroomsNumber,
  setBathroomsNumber,
  setParking,
  setNumberOfPeopleLiving,
  setAccessibilityFeatures,
  setRoomName,
  setRoomType,
  setRoomFurnishing,
  setRoomBathroom,
  setRoomBedSize,
  toggleRoomFeature,
  setRoomFeatures,
  setWeeklyRentPerWeek,
  setBillsIncludedInRent,
  setAvailableFromDate,
  resetListerProperty,
} = listerPropertySlice.actions;

export const {
  selectPropertyType,
  selectBedroomsNumber,
  selectBathroomsNumber,
  selectParking,
  selectNumberOfPeopleLiving,
  selectAccessibilityFeatures,
  selectRoomName,
  selectRoomType,
  selectRoomFurnishing,
  selectRoomBathroom,
  selectRoomBedSize,
  selectRoomFeatures,
  selectWeeklyRentPerWeek,
  selectBillsIncludedInRent,
  selectAvailableFromDate,
} = listerPropertySlice.selectors;

export default listerPropertySlice.reducer;
