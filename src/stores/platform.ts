import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import UAParser from 'ua-parser-js';

import { PlatformEnum } from 'models/local-storage';
import { DEFAULT_LANGUAGE, MOBILE_MAX_WIDTH } from 'utilities/constants';

export enum Device {
    Android,
    iOS,
    PC,
}

type PlatformState = {
    countdownTimer: number;
    isMobile: boolean;
    language: string;
    isMobileDrawerOpen: boolean;
    device: Device;
};

const countdownTimer = Number(
    localStorage.getItem(PlatformEnum.COUNTDOWN_TIMER),
);
const isMobile = window.innerWidth <= MOBILE_MAX_WIDTH;
const platformLanguage =
    localStorage.getItem(PlatformEnum.LANGUAGE) || DEFAULT_LANGUAGE;

const parser = new UAParser(window.navigator.userAgent);
let device: Device;
const osName = parser.getOS().name?.toLowerCase();
if (osName?.includes('android')) device = Device.Android;
else if (osName?.includes('ios')) device = Device.iOS;
device = Device.PC;

const initialState: PlatformState = {
    countdownTimer,
    isMobile,
    language: platformLanguage,
    isMobileDrawerOpen: false,
    device,
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
            localStorage.setItem(
                PlatformEnum.LANGUAGE,
                action.payload.language,
            );
            state.language = action.payload.language;
        },
        setMobileDrawerOpen: (
            state,
            action: PayloadAction<{ isMobileDrawerOpen: boolean }>,
        ) => {
            state.isMobileDrawerOpen = action.payload.isMobileDrawerOpen;
        },
    },
});

export const {
    setCountdownTimer,
    setMobile,
    setLanguage,
    setMobileDrawerOpen,
} = platformSlice.actions;
export default platformSlice.reducer;
