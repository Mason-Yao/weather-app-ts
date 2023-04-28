import React, {FC} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {CurrentWeatherCard, AddCityCard} from "./weatherCards";
import {useState, useEffect} from "react";
import Fab from "@mui/material/Fab";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface CarouselCurrentWeatherProps {
    cities: string[]
}

const CarouselCurrentWeather: FC<CarouselCurrentWeatherProps> = (props) => {
    const cities = [...props.cities, "newCity"];
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleNext = () => {
        if(currentIndex + numberOfCities < cities.length) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if(currentIndex > 0)
        setCurrentIndex(currentIndex - 1);
    };

    const [numberOfCities, setNumberOfCities] = useState(3);
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 1400) {
                setNumberOfCities(2);
            } if (window.innerWidth >= 1400) {
                setNumberOfCities(3);
            } if (window.innerWidth < 1200){
                setNumberOfCities(1);
            }
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{position:"relative", paddingLeft: "10rem", paddingRight: "10rem"}}>
            <div style={{position: "absolute", top: "45%", left:"8%"}}>
                <Fab sx={{width:"4rem", height:"4rem", boxShadow: "none", zIndex: "1"}} onClick={handlePrevious}>
                    <ArrowBackIosIcon/>
                </Fab>
            </div>
            <Row  className="mx-5" style={{position: "relative"}}>
                {cities.reverse().slice(currentIndex, currentIndex + numberOfCities).map((city, index) => (
                        <Col key={index} xxl={4} xl={6} md={12} className="d-flex justify-content-center my-2">
                            {city === "newCity" ? <AddCityCard/> :
                                <CurrentWeatherCard
                                    city={city}/>
                            }
                        </Col>
                    )
                )}
            </Row>
            <div style={{position: "absolute", top: "45%", right: "8%", zIndex: "2"}} className="d-flex justify-content-end">
                <Fab sx={{width:"4rem", height:"4rem", boxShadow: "none"}} onClick={handleNext}>
                    <ArrowForwardIosIcon/>
                </Fab>
            </div>
        </div>
    )

}

export default CarouselCurrentWeather;