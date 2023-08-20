import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DEFAULT_LANGUAGE, MOBILE_MAX_WIDTH } from 'utilities/constants';

type PlatformState = {
  isMobile: boolean;
  language: string;
};

const isMobile = window.innerWidth <= MOBILE_MAX_WIDTH;
const platformLanguage =
  localStorage.getItem('platform.language') || DEFAULT_LANGUAGE;

const initialState: PlatformState = {
  isMobile,
  language: platformLanguage,
};

const platformSlice = createSlice({
  name: 'platform',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<{ language: string }>) => {
      localStorage.setItem('platform.language', action.payload.language);
      state.language = action.payload.language;
    },
    setMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
  },
});

export const { setLanguage, setMobile } = platformSlice.actions;
export default platformSlice.reducer;
