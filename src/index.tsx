import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Provider} from "react-redux";
import store from "./store"

import User from "./components/User";
import Login from "./components/Login";
import Register from "./components/Register"
import Search from "./components/Search";
import WeatherForecast from "./components/WeatherForecast";
import AuthComponent from "./components/AuthComponent";
import "./style.css"


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

console.log(store.getState())
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route index element={<Login />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="user" element={<AuthComponent Component={User}/>} />
                    <Route path="search" element={<AuthComponent Component={Search}/>} />
                    <Route path={`/forecast/:cityName`} element={<AuthComponent Component={WeatherForecast}/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    </Provider>

);