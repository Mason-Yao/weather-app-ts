import React, {useState} from 'react';
import {CurrentWeatherCard} from "./weatherCards";
import {Form, InputGroup, Button} from "react-bootstrap";
import { useAppSelector } from "../hooks";
import {selectWeatherByCIty} from "../slices/weatherSlice";
import Header from './Header';
import { selectTheme } from "../slices/styleSlice";

export default function Search() {
    const theme = useAppSelector(selectTheme);
    const [city, setCity] = useState("");
    const weatherData = useAppSelector(selectWeatherByCIty)(city);
    const weatherRequestStatus = weatherData && weatherData.requestStatus;
    const weatherRequestError = weatherRequestStatus === "failed" && weatherData.error;

    // set city value to a input value when user click search button then render the card
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const cityName = (((event.target as HTMLFormElement).elements.namedItem('search') as HTMLInputElement)).value;
        setCity(cityName);
    }
    const cardStyleShown = "container-fluid d-flex justify-content-center w-50"
    const cardStyleHidden = "container-fluid d-flex justify-content-center w-50 d-none"
    return (
        <div className={`${theme === "dark" ? "user-bg-dark" : ""}`}>
            <Header />
            <div style={{height: "2rem"}}>&nbsp;</div>
            <div className="container-fluid text-center w-50 justify-content-center">
                <Form onSubmit={handleSearch}>
                    <Form.Group controlId="search">
                        <InputGroup>
                            <Form.Control type="search" placeholder="Search" />
                            <Button variant="outline-secondary" type="submit">Search</Button>
                        </InputGroup>
                    </Form.Group>
                </Form>
                <p>{weatherRequestError && weatherRequestError.errorMessage}</p>
            </div>
            <div style={{height: "1rem"}}>&nbsp;</div>
            {/*CurrentWeatherCard will be rendered any way as the dispatching is called in the card component,
                but it will be hidden until corresponding thunk succeed*/}
            {city &&
                <div className={weatherRequestStatus !== "succeeded" ? cardStyleHidden : cardStyleShown}>
                <CurrentWeatherCard
                    city={city}
                />
                </div>
            }
        </div>
    );
}
