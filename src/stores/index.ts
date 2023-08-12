import { combineReducers, configureStore } from '@reduxjs/toolkit';

import PlatformReducer from 'stores/platform';

export const store = configureStore({
  reducer: combineReducers({
    platform: PlatformReducer,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
