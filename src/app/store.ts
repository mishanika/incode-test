import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import pathReducer from "../features/path/pathSlice";
import issuesReducer from "../features/issues/issuesSlice";

export const store = configureStore({
  reducer: {
    path: pathReducer,
    issues: issuesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
