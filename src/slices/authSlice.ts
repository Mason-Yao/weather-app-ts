import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {loginAPI, registerAPI, getUserAPI, User, ApiFunction} from "../services/api";
import axios, { AxiosError } from "axios";
import { RootState } from "../store";


type AuthApiError = {
    errorCode: number | undefined | null,
    errorMessage: string | undefined | null,
}

type ApiCallParam = Record<string, string> | undefined | null;

const handleAPICall = async (apiCall: ApiFunction, rejectWithValue: (data: AuthApiError) => any, data:ApiCallParam) => {
    try {
        return await apiCall(data);
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const authApiError: AuthApiError = {
                errorCode: err.response?.status,
                errorMessage: err.response?.data.message,
            };
            throw rejectWithValue(authApiError);
        }
    };
}

export const login = createAsyncThunk(
    'auth/login',
    async (data:ApiCallParam, { rejectWithValue }) =>
        handleAPICall(loginAPI, rejectWithValue, data )
);


export const register = createAsyncThunk(
    'auth/register',
    async (data:ApiCallParam, { rejectWithValue }) =>
        handleAPICall(registerAPI, rejectWithValue, data)
);

export const getUser = createAsyncThunk(
    'auth/getUser',
    async (data:ApiCallParam, { rejectWithValue }) =>
        handleAPICall(getUserAPI, rejectWithValue, data)
);

interface authState {
    user: User | null | undefined,
    status?: 'idle' | 'loading' | 'succeeded' | 'failed' | undefined,
    token?: string | null | undefined,
    error?: AuthApiError | null | undefined,
}

const initialState: authState = {
    user: null,
    status:'idle',
    token: null,
    error: null,
};

export const authSlice = createSlice(
    {
        name: 'auth',
        initialState,
        reducers: {
            setError : (state, action) => {
                state.error = action.payload;
            }
        },
        extraReducers: (builder) => {
            builder
                .addCase(login.pending, (state) => {
                    state.status = 'loading';
                    state.error = null;
                })
                .addCase(login.fulfilled, (state, action) => {
                    localStorage.setItem('token', action.payload.token);
                    state.status = 'succeeded';
                })
                .addCase(login.rejected, (state, action) => {
                    state.status = 'failed';
                    state.error = action.payload as AuthApiError ;
                    
                })
            
                .addCase(register.pending, (state) => {
                    state.status = 'loading';
                    state.error = null;
                })
                .addCase(register.fulfilled, (state, action) => {
                    localStorage.setItem('token', action.payload.token);
                    state.status = 'succeeded';
                })
                .addCase(register.rejected, (state, action) => {
                    state.status = 'failed';
                    state.error = action.payload as AuthApiError ;
                })
                .addCase(getUser.pending, (state) => {
                    state.status = 'loading';
                    state.error = null;
                })
                .addCase(getUser.fulfilled, (state, action) => {
                    state.user = action.payload;
                    state.status = 'succeeded';
                })
                .addCase(getUser.rejected, (state, action) => {
                    state.status = 'failed';
                    state.error = action.payload as AuthApiError ;
                })
        },
    },
)


export const selectUser = (state: RootState) => {
    return state.auth.user;
};

export const selectAuthingStatus = (state: RootState) => {
    return state.auth.status;
}
export const toSetError = authSlice.actions.setError;

export default authSlice.reducer