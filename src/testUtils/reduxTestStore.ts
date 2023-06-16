import { combineReducers, configureStore } from "@reduxjs/toolkit";
import type { PreloadedState } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import weatherReducer from "../slices/weatherSlice";
import styleReducer from "../slices/styleSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  weather: weatherReducer,
  style: styleReducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
