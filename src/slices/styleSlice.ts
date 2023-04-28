import {createSlice} from "@reduxjs/toolkit";
import { RootState } from "../store";

export const styleSlice = createSlice({
    name: 'style',
    initialState: {
        theme: window.localStorage.getItem("theme") || "light",
    },
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
        }
    },
})

export const {setTheme} = styleSlice.actions
export const selectTheme = (state: RootState) => state.style.theme
export default styleSlice.reducer

