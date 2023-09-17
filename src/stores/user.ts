import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthStep, UserInterface } from 'models/common';

import { UserEnum } from 'models/local-storage';
import { DEFAULT_NATIONALITY } from 'utilities/constants';

type UserState = {
    authenticationStep: AuthStep;
    selectedNationality: string;
    tempEmail: string;
    isLoggedIn: boolean;
    token: string;
    info: UserInterface;
};

const selectedNationality =
    localStorage.getItem(UserEnum.SELECTED_NATIONALITY) || DEFAULT_NATIONALITY;

const isLoggedIn = localStorage.getItem(UserEnum.IS_LOGGED_IN) === '1';
const token = localStorage.getItem(UserEnum.TOKEN) || '';

const infoString = localStorage.getItem(UserEnum.INFO);
const info = infoString ? JSON.parse(infoString) : {};

const initialState: UserState = {
    authenticationStep: AuthStep.NONE,
    selectedNationality,
    tempEmail: '',
    isLoggedIn,
    token,
    info,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setSelectedNationality: (
            state,
            action: PayloadAction<{ selectedNationality: string }>,
        ) => {
            localStorage.setItem(
                UserEnum.SELECTED_NATIONALITY,
                action.payload.selectedNationality,
            );
            state.selectedNationality = action.payload.selectedNationality;
        },
        setAuthenticating: (
            state,
            action: PayloadAction<{ authStep: AuthStep }>,
        ) => {
            state.authenticationStep = action.payload.authStep;
        },
        setTempEmail: (state, action: PayloadAction<{ tempEmail: string }>) => {
            state.tempEmail = action.payload.tempEmail;
        },
        setLoggedIn: (
            state,
            action: PayloadAction<{
                isLoggedIn: boolean;
                token?: string;
                info?: object;
            }>,
        ) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.tempEmail = '';
            localStorage.setItem(
                UserEnum.IS_LOGGED_IN,
                action.payload.isLoggedIn ? '1' : '0',
            );
            if (action.payload.token) {
                state.token = action.payload.token;
                localStorage.setItem(UserEnum.TOKEN, action.payload.token);
            } else {
                state.token = '';
                localStorage.removeItem(UserEnum.TOKEN);
            }
            if (action.payload.info) {
                state.info = action.payload.info;
                localStorage.setItem(
                    UserEnum.INFO,
                    JSON.stringify(action.payload.info),
                );
            } else {
                state.info = {};
                localStorage.removeItem(UserEnum.INFO);
            }
        },
    },
});

export const {
    setAuthenticating,
    setSelectedNationality,
    setTempEmail,
    setLoggedIn,
} = userSlice.actions;
export default userSlice.reducer;
