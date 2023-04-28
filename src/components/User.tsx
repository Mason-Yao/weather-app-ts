import React, {useEffect} from "react"
import { useAppSelector } from "../hooks";

import {selectUser} from "../slices/authSlice";
import { selectTheme } from "../slices/styleSlice";
import CarouselCurrentWeather from "./CarouselCurrentWeather";
import Header from "./Header";


function User() {
    const theme = useAppSelector(selectTheme);
    const user = useAppSelector(selectUser);
    const cities = (user && user.cities) || [];

    return (
        <div className={`${theme === "dark" ? "user-bg-dark" : ""}`}>
            <Header />
            <div style={{height: "5rem"}}>&nbsp;</div>
            <CarouselCurrentWeather cities={cities}/>
        </div>
    );
}

export default User;