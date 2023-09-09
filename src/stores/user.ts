import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserEnum } from 'models/local-storage';
import { DEFAULT_NATIONALITY } from 'utilities/constants';

type UserState = {
    selectedNationality: string;
};

const selectedNationality =
    localStorage.getItem(UserEnum.SELECTED_NATIONALITY) || DEFAULT_NATIONALITY;

const initialState: UserState = {
    selectedNationality,
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
    },
});

export const { setSelectedNationality } = userSlice.actions;
export default userSlice.reducer;
