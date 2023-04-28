import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getWeatherForecastAPI} from "../services/api";
import axios from "axios";
import { RootState } from "../store";


interface WeatherApiError {
    cityAlias: string,
    errorCode: number | undefined | null,
    errorMessage: string | undefined | null,
}

interface WeatherState {
    loginStatus: 'failed' | 'succeeded' | 'pending';
    weatherData: any
}

const initialState: WeatherState = {
    loginStatus: 'pending',
    weatherData: {}
};

interface PayloadData {
    cityAlias: string,
    errorCode: number | undefined | null,
    [key: string]: any
}
    
export const getWeatherForecast = createAsyncThunk(
    'weather/getWeatherForecast',
    async (city: string, { rejectWithValue }) => {
        try {
            return await getWeatherForecastAPI(city)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const weatherApiError: WeatherApiError = {
                    cityAlias: err.response?.data.cityAlias,
                    errorCode: err.response?.status,
                    errorMessage: err.response?.data.message,
                };
                console.log(weatherApiError)
                throw rejectWithValue(weatherApiError);
            }
        }
    }
);
export const weatherSlice = createSlice(
    {
        name: 'weather',
        initialState,
        reducers: {
        },
        extraReducers: (builder) => {
            builder
                .addCase(getWeatherForecast.fulfilled, (state, action) => {
                    // In the search page, user input may be different from the city name returned by the API,
                    // so we need to use the cityAlias as the key to store the weather data in Redux, a selector method
                    // is called by passing the cityAlias as the argument to get the weather data.
                    state.weatherData[action.payload.cityAlias] = {...action.payload, requestStatus: 'succeeded'};
                })
                .addCase(getWeatherForecast.rejected, (state, action) => {
                    if((action.payload as PayloadData).errorCode === 401) {
                        state.loginStatus = 'failed';
                    }
                    state.weatherData[(action.payload as PayloadData).cityAlias] = {error: action.payload, requestStatus: 'failed'};
                }   )
        }
    },
)


export const selectWeatherByCIty = (state: RootState) => (city: string) => state.weather.weatherData[city]
export const selectLoginStatus = (state: RootState) => state.weather.loginStatus
export default weatherSlice.reducer