import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthStep, UserInterface } from 'models/common';

import { UserEnum } from 'models/local-storage';

export enum Toast {
    Login,
    Logout,
    LikePackageFromPackages,
    DislikePackageFromPackages,
    LikePackageFromFavorites,
    DislikePackageFromFavorites,
    ProfileUpdated,
    SaveCustomerContact,
    None,
}

type UserState = {
    authenticationStep: AuthStep;
    tempEmail: string;
    isLoggedIn: boolean;
    token: string;
    info: UserInterface;
    toast: Toast;
};

const isLoggedIn = localStorage.getItem(UserEnum.IS_LOGGED_IN) === '1';
const token = localStorage.getItem(UserEnum.TOKEN) || '';

const infoString = localStorage.getItem(UserEnum.INFO);
const info = infoString ? JSON.parse(infoString) : {};

const initialState: UserState = {
    authenticationStep: AuthStep.NONE,
    tempEmail: '',
    isLoggedIn,
    token,
    info,
    toast: Toast.None,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
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
                state.toast = Toast.Login;
            } else {
                state.token = '';
                localStorage.removeItem(UserEnum.TOKEN);
                state.toast = Toast.Logout;
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
        setToast: (state, action: PayloadAction<{ toast: Toast }>) => {
            state.toast = action.payload.toast;
        },
    },
});

export const { setAuthenticating, setTempEmail, setLoggedIn, setToast } =
    userSlice.actions;
export default userSlice.reducer;
