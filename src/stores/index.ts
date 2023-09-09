import { combineReducers, configureStore } from '@reduxjs/toolkit';

import PlatformReducer from 'stores/platform';
import UserReducer from 'stores/user';

export const store = configureStore({
    reducer: combineReducers({
        platform: PlatformReducer,
        user: UserReducer,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
