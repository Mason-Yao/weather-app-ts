import {WeatherForecastCard} from "./weatherCards";
import {useParams} from "react-router-dom";
import Header from "./Header";
import { useAppSelector } from "../hooks";

function WeatherForecast () {
    const {cityName} = useParams();
    const theme = useAppSelector(state => state.style.theme);
    
    return (
        <div className={`forecast ${theme === "dark" ? "forecast-dark" : "forecast-light"}`}>
            <Header />
            <div>
                <div style={{height: "4rem"}} >&nbsp;</div>
                {cityName &&
                    <div className="d-flex justify-content-center">
                        <WeatherForecastCard
                        city={cityName}
                        />
                    </div>
                }

            </div>
        </div>
    );
}

export default WeatherForecast