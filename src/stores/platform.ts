import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_LANGUAGE } from 'utilities/constants';

type PlatformState = {
  language: string;
};

const platformLanguage = localStorage.getItem('platform.language');

const initialState: PlatformState = {
  language: platformLanguage || DEFAULT_LANGUAGE,
};

const platformSlice = createSlice({
  name: 'platform',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<{ language: string }>) => {
      localStorage.setItem('platform.language', action.payload.language);
      state.language = action.payload.language;
    },
  },
});

export const setLanguage = platformSlice.actions.setLanguage;
export default platformSlice.reducer;
