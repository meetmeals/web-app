import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PlatformEnum } from 'models/local-storage';
import { DEFAULT_LANGUAGE, MOBILE_MAX_WIDTH } from 'utilities/constants';

type PlatformState = {
  countdownTimer: number;
  isMobile: boolean;
  language: string;
};

const countdownTimer = Number(
  localStorage.getItem(PlatformEnum.COUNTDOWN_TIMER),
);
const isMobile = window.innerWidth <= MOBILE_MAX_WIDTH;
const platformLanguage =
  localStorage.getItem(PlatformEnum.LANGUAGE) || DEFAULT_LANGUAGE;

const initialState: PlatformState = {
  countdownTimer,
  isMobile,
  language: platformLanguage,
};

const platformSlice = createSlice({
  name: 'platform',
  initialState,
  reducers: {
    setCountdownTimer: (state, action: PayloadAction<number>) => {
      localStorage.setItem(
        PlatformEnum.COUNTDOWN_TIMER,
        action.payload.toString(),
      );
      state.countdownTimer = action.payload;
    },
    setMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    setLanguage: (state, action: PayloadAction<{ language: string }>) => {
      localStorage.setItem(PlatformEnum.LANGUAGE, action.payload.language);
      state.language = action.payload.language;
    },
  },
});

export const { setCountdownTimer, setMobile, setLanguage } =
  platformSlice.actions;
export default platformSlice.reducer;
