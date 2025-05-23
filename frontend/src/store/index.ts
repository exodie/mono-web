import { configureStore } from '@reduxjs/toolkit';
import { userReducer, eventsReducer } from './slices';

export const store = configureStore({
  reducer: {
    user: userReducer,
    events: eventsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
