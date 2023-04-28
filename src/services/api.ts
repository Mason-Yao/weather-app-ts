import axios, {AxiosResponse, AxiosError} from "axios";
import {backendUrl} from "../config";

axios.defaults.baseURL = backendUrl || "http://localhost:13000";

const token = localStorage.getItem('token');
// const handleAPI = async <T>(requestMethod: AxiosInstance['get'] | AxiosInstance['post'] | AxiosInstance['put'] | AxiosInstance['delete'], ...args: any[]): Promise<T> => {
//     try {
//         const response = await requestMethod(...args);
//         return response.data;
//     } catch (err) {
//         throw err;
//     }
// };
interface Credentials {
    username: string,
    password: string
}

interface RegisterData {
    username: string,
    firstName: string | null,
    lastName: string | null,
    password: string | null
}

export interface User {
    username: string,
    googleId: string | null,
    firstName: string | null,
    lastName: string | null,
    password: string | null,
    cities: string[] | null
}

interface ResponseData {
    token: string | null,
    user: User | null,
}

interface CitiesUpdateData {
    username: string,
    cities: string[]
}



export const loginAPI = async (credentials: Credentials):Promise<ResponseData> => {
    try {
        const response: AxiosResponse<ResponseData> = await axios.post('/auth/login', credentials);
        return response.data;
    } catch (err) {
        throw err;
    }
}

export const registerAPI = async (registerData: RegisterData):Promise<ResponseData> => {
    try {
        const response: AxiosResponse<ResponseData> = await axios.post('/auth/register', registerData);
        return response.data;
    } catch (err) {
        throw err;
    }
}

export const getUserAPI = async ():Promise<ResponseData> => {
    try {
        const response: AxiosResponse<ResponseData> = await axios.get('/user', {headers: {'Authorization': 'Bearer ' + token }});
        return response.data;
    } catch (err) {
        throw err;
    }
}

export const getWeatherForecastAPI = async (city: string):Promise<any> => {
    try {
        // the type of the response is an object with all weather information and will be passed to components for further processing
        const response: AxiosResponse<any> = await axios.get(`/weather/${city}/forecast`, {headers: {'Authorization': 'Bearer ' + token }});
        return response.data;
    } catch (err) {
        throw err;
    }
}

export const updateSavedCitiesAPI = async (citiesUpdateData: CitiesUpdateData):Promise<ResponseData> => {
    try {
        const response: AxiosResponse<ResponseData> = await axios.put('/user/cities', citiesUpdateData, {headers: {'Authorization': 'Bearer ' + token }});
        return response.data;
    } catch (err) {
        throw err;
    }
}

export type ApiFunction = (data:any) => Promise<any>;

// export const loginAPI = (credentials) => {
//     return handleAPI(axios.post, '/auth/login', credentials);
// }

// export const registerAPI = (data) => {
//     return handleAPI(axios.post, '/auth/register', data);
// }

// export const getUserAPI = () => {
//     return handleAPI(axios.get, '/user', {headers: {'Authorization': 'Bearer ' + token }})
// }

// export const getWeatherForecastAPI = (city) => {
//     return handleAPI(axios.get, `/weather/${city}/forecast`, {headers: {'Authorization': 'Bearer ' + token }});
// }

// export const updateSavedCitiesAPI = (data) => {
//     return handleAPI(axios.put, '/user/cities', data, {headers: {'Authorization': 'Bearer ' + token }});
// }