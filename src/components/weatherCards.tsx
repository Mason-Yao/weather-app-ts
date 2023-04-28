import React, {useEffect, FC} from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {selectWeatherByCIty, getWeatherForecast, selectLoginStatus} from "../slices/weatherSlice";
import {selectTheme} from "../slices/styleSlice";


import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import cloudy from "../images/cloudy.png";
import sunny from "../images/sunny.png";
import rainy from "../images/rainy.png";
import snowy from "../images/snowy.png";
import stormy from "../images/stormy.png";
import overcast from "../images/overcast.png";
import mist from "../images/mist.png";
import fog from "../images/fog.png";
import clear from "../images/clear.png";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {selectUser} from "../slices/authSlice";
import {updateSavedCitiesAPI} from "../services/api";
import Container from "react-bootstrap/Container";
import plucIconLight from "../images/plus-icon-light.png";
import plucIconDark from "../images/plus-icon-dark.png";
import cityIllustrationLight from "../images/city-illustration-light.png";
import cityIllustrationDark from "../images/city-illustration-dark.png";

function weatherIconSelect(weatherCondition: string) {
    if (weatherCondition.toLowerCase().includes("cloud")) {
        return cloudy;
    }
    if (weatherCondition.toLowerCase().includes("sun")) {
        return sunny;
    }
    if (weatherCondition.toLowerCase().includes("rain")) {
        return rainy;
    }
    if (weatherCondition.toLowerCase().includes("snow")) {
        return snowy;
    }
    if (weatherCondition.toLowerCase().includes("storm")) {
        return stormy;
    }
    if (weatherCondition.toLowerCase().includes("overcast")) {
        return overcast;
    }
    if (weatherCondition.toLowerCase().includes("mist")) {
        return mist;
    }
    if (weatherCondition.toLowerCase().includes("fog")) {
        return fog;
    }
    if (weatherCondition.toLowerCase().includes("clear")) {
        return clear;
    }
    return null;
}

type WeatherCardProps = {
    city: string;
}

const CurrentWeatherCard: FC<WeatherCardProps> = (props) => {
    const weatherData = useAppSelector(selectWeatherByCIty)(props.city);
    const loginStatus = useAppSelector(selectLoginStatus);
    const weatherRequestStatus = weatherData && weatherData.requestStatus;
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getWeatherForecast(props.city));

    }, [dispatch, props.city])
    useEffect(() => {
        if(loginStatus === "failed") {
            window.location.href = "/login"
        }
    }, [loginStatus])
    // Initialize the weather data to be displayed

    interface CurrentWeatherData {
        cityName: string;
        tempNow: string;
        condition: string;
        tempMax: string;
        tempMin: string;
        weatherIcon: string | undefined;
    }

    const currentWeatherData: CurrentWeatherData = {
        cityName: "NA",
        tempNow: "NA",
        condition: "NA",
        tempMax: "NA",
        tempMin: "NA",
        weatherIcon: undefined,
    }
    // Check the data request thunk status and update the weather data.
    if (weatherData && weatherData.requestStatus === "succeeded") {
        currentWeatherData.cityName = weatherData.location.name;
        currentWeatherData.tempNow = weatherData.current.temp_c;
        currentWeatherData.condition = weatherData.current.condition.text;
        currentWeatherData.tempMax = weatherData.forecast.forecastday[0].day.maxtemp_c;
        currentWeatherData.tempMin = weatherData.forecast.forecastday[0].day.mintemp_c;
        currentWeatherData.weatherIcon = weatherIconSelect(weatherData.current.condition.text);
    }

    const theme = useAppSelector(selectTheme);
    // Prepare user and cities data, send back to server if user add a new city.
    const user = useAppSelector(selectUser);
    const cities = (user && user.cities) || [];
    const forecastLink = "/forecast/" + currentWeatherData.cityName;
    const handleAddCity = async () => {
        if (user && cities && !cities.includes(currentWeatherData.cityName)) {
            try {
                await updateSavedCitiesAPI({username: user.username, cities: [...cities, currentWeatherData.cityName]});
                window.location.href = "/user";
            } catch (err) {
                console.log(err);
            }
        }
    }
    const handleRemoveCity = async () => {  
        if (user && cities && cities.includes(currentWeatherData.cityName)) {
            const newCities = cities.filter(city => city !== currentWeatherData.cityName);
            try {
                await updateSavedCitiesAPI({username: user.username, cities: newCities});
                window.location.href = "/user";
            } catch (err) {
                console.log(err);
            }
        }
    }

    return (
        <Card className={`d-flex text-center justify-content-center weather-card border-shadow ${theme === "dark" ? "current-card-dark" : ""}`}>
            <Card.Link className="title-city-name" href={forecastLink} style={{color: "#7DB9B6"}}>
                {currentWeatherData.cityName.toUpperCase()}
            </Card.Link>
            <Card.Text></Card.Text>
            <Container className="weather-image">
                <Card.Img variant="top" src={currentWeatherData.weatherIcon} className="weather-icon" alt={currentWeatherData.condition}/>
            </Container>

            <Card.Body>
                <Card.Title style={{fontSize: "50px"}}>{currentWeatherData.tempNow} &#8451;</Card.Title>
                <Card.Text style={{fontSize: "25px"}}>
                    {currentWeatherData.condition}
                </Card.Text>
                <Row>&nbsp;</Row>
                <Row>
                    <Col>
                        <Card.Text style={{color: "green", fontSize: "25px"}}>{currentWeatherData.tempMin} &#8451;</Card.Text>
                    </Col>
                    <Col>
                        <Card.Text style={{color: "red", fontSize: "25px"}}>{currentWeatherData.tempMax} &#8451;</Card.Text>
                    </Col>
                </Row>
                <Row>&nbsp;</Row>
                {
                    weatherRequestStatus === "succeeded" && 
                    ((cities?.includes(currentWeatherData.cityName)) ?
                        <Button
                        variant="dark"
                        onClick={handleRemoveCity}
                        >
                            REMOVE CITY
                        </Button>
                    :
                        <Button
                        variant="primary"
                        onClick={handleAddCity}
                        disabled={cities.length > 10}
                        >
                            ADD CITY
                        </Button>
                    )
                }
            </Card.Body>
        </Card>
    );
}

function AddCityCard() {
    const searchLink = "/search"
    const theme = useAppSelector(selectTheme)
    const handleClick = () => {
        window.location.href = searchLink;
    }
    return (
        <Card className={`d-flex text-center justify-content-center weather-card border-shadow ${theme === "dark" ? "current-card-dark" : ""}`}>
            <Card.Link className="title-city-name" href={searchLink} style={{color: "#7DB9B6"}}>
                Add City
            </Card.Link>
            <Card.Text></Card.Text>
            <Container className="weather-image">
                <Card.Img onClick={handleClick} variant="top" src={theme === "light" ? plucIconLight : plucIconDark} className="weather-icon add-icon" alt="add"/>
            </Container>
            <Card.Body className="d-flex justify-content-center">
                <Container className="d-flex flex-column justify-content-center align-items-center">
                    <Card.Img variant="Bottom" src={theme === "light" ? cityIllustrationLight : cityIllustrationDark} className="city-illustration" alt="city illustration"/>
                </Container>
            </Card.Body>
        </Card>
    );
}

const WeatherForecastCard: FC<WeatherCardProps> = (props) => {
    const weatherData = useAppSelector(selectWeatherByCIty)(props.city)
    const dispatch = useAppDispatch()
    const theme = useAppSelector(selectTheme)

    // Request the weather data from the API
    useEffect(() => {
        dispatch(getWeatherForecast(props.city))

    }, [dispatch, props.city])

    // Initialize the weather data to be displayed
    const weatherForeCastData = []
    const currentWeatherData = {
        cityName: "NA",
        tempNow: "NA",
        condition: "NA",
        windKph: "NA",
        humidity: "NA",
    }
    // when the request thunk is fulfilled, update the weather data
    if (weatherData && weatherData.requestStatus === "succeeded") {
        currentWeatherData.cityName = weatherData.location.name
        currentWeatherData.tempNow = weatherData.current.temp_c
        currentWeatherData.condition = weatherData.current.condition.text
        currentWeatherData.windKph = weatherData.current.wind_kph
        currentWeatherData.humidity = weatherData.current.humidity

        for (let i = 0; i < 3; i++) {
            weatherForeCastData.push({
                date: weatherData.forecast.forecastday[i].date,
                avgTemp: weatherData.forecast.forecastday[i].day.avgtemp_c,
                condition: weatherData.forecast.forecastday[i].day.condition.text,
            })
        }
    }


    return (
        <Card className={`text-center justify-content-center border-shadow forecast-card`}>
            <div className={`forecast-card-now ${theme === "light" ? "now-light" : "now-dark"}`}>
                <Row>
                    <Col>
                        <Card.Title style={{fontSize: "40px"}}>{currentWeatherData.tempNow} &#8451;</Card.Title>
                        <Card.Text>{currentWeatherData.condition}</Card.Text>
                        <Row>
                            <Col>
                                <Card.Text>WIND</Card.Text>
                                <Card.Text>{currentWeatherData.windKph} KPH</Card.Text>
                            </Col>
                            <Col>
                                <Card.Text>HUMIDITY</Card.Text>
                                <Card.Text>{currentWeatherData.humidity}%</Card.Text>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Card.Title style={{marginTop: "1rem", fontSize: "40px"}}>{currentWeatherData.cityName}</Card.Title>
                    </Col>
                </Row>
            </div>
            <Card.Body className="forecast-card-future">
                <Row className="d-flex justify-content-center ">
                    {weatherForeCastData.map((day, index) => {
                            return (
                                <Col xs={2} key={index} className="">
                                    <DayWeather date={day.date}
                                                avgTemp={day.avgTemp}
                                                weatherCondition={day.condition}/>
                                </Col>
                            )
                        }
                    )}
                </Row>
                <Row>&nbsp;</Row>
            </Card.Body>
        </Card>
    )
}

interface DayWeatherProps {
    date: string,
    avgTemp: string,
    weatherCondition: string
}

const DayWeather: FC<DayWeatherProps> = (props) => {
    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const data = {
        day: daysOfWeek[new Date(props.date).getDay()],
        avgTemp: props.avgTemp,
        weatherCondition: props.weatherCondition
    }
    const currentWeatherIcon = weatherIconSelect(data.weatherCondition)

    return (
        <Container className="justify-content-center">
            <h2>{data.day}</h2>
            <div className="forecast-day-weather-icon">
                <img src={currentWeatherIcon} style={{width: "40%"}} alt={data.weatherCondition}/>
            </div>
            <h4>{data.avgTemp}</h4>
            <p>{data.weatherCondition.toUpperCase()}</p>
        </Container>
    );
}

export {CurrentWeatherCard, AddCityCard, WeatherForecastCard, DayWeather}

