import authReducer from "./slices/authSlice"
import weatherReducer from "./slices/weatherSlice"
import styleReducer from "./slices/styleSlice";
import {configureStore} from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        auth: authReducer,
        weather: weatherReducer,
        style: styleReducer,
    }
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch