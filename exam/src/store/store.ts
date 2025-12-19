import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "../reduce/todoslice";

export const store = configureStore({
    reducer: {
        todo: counterSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
