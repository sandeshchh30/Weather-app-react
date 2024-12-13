import { useEffect, useState } from 'react';
import humidity from '../assets/humidity.png';
import wind from '../assets/wind.png';
import clear from '../assets/clear.png';
import cloud from '../assets/cloud.png'
import drizzle from '../assets/drizzle.png'
import mist from '../assets/mist.png'
import rain from '../assets/rain.png'
import snow from '../assets/snow.png'
import thunderstorm from '../assets/thunderstorm.png'
import precipitation from '../assets/precipitation.png'
import RiseLoader from "react-spinners/RiseLoader";

export default function Temperature({ city, predictedTemperature, predictedHumidity, predictedWind, predictedPrecipitation, loading }) {
  const [icon, setIcon] = useState(clear);

  useEffect(() => {
    setIcon(clear);
    if (typeof (predictedTemperature) == "number" && typeof (predictedPrecipitation) == "number") {
      if (predictedPrecipitation <= 5) {
        if (predictedTemperature >= 15 && predictedTemperature <= 35) {
          setIcon(clear);
        } else {
          setIcon(cloud)
        }
      } else if (predictedPrecipitation > 5 && predictedPrecipitation <= 15) {
        setIcon(drizzle)
      } else if (predictedPrecipitation <= 0.5 && predictedTemperature >= 0 && predictedTemperature <= 15) {
        setIcon(mist)
      } else if (predictedPrecipitation > 15 && predictedPrecipitation <= 50) {
        setIcon(rain)
      } else if (predictedPrecipitation <= 20 && predictedTemperature >= -5 && predictedTemperature <= 2) {
        setIcon(snow)
      } else if (predictedPrecipitation >= 10 && predictedTemperature >= 15 && predictedTemperature <= 35) {
        setIcon(thunderstorm)
      }
    }
  }, [predictedTemperature, predictedPrecipitation]);

  typeof (predictedTemperature) == "number" ? predictedTemperature.toFixed(2) : "Fetching..."
  typeof (predictedHumidity) == "number" ? predictedHumidity.toFixed(2) : "Fetching..."
  typeof (predictedWind) == "number" ? predictedWind.toFixed(2) : "Fetching..."
  typeof (predictedPrecipitation) == "number" ? predictedPrecipitation.toFixed(2) : "Fetching..."


  return (

    <div className="flex flex-col space-y-6 items-center mt-10">
      {loading ? (
        <RiseLoader
          color="#ffffff"
          cssOverride={{}}
          loading
          margin={2}
          size={15}
          speedMultiplier={1}
          className="h-32 sm:h-40 flex items-center"
        />
      ) : (
        <img className="h-36 sm:h-44" src={icon} alt="weather" />
      )}

      <div className="space-y-2 text-center text-white font-semibold text-xl sm:text-3xl">
        <h4>
          {predictedTemperature}
          <span className="ml-1 text-base sm:text-lg relative -top-2">°</span>
          <span className="text-lg sm:text-2xl relative -top-1">C</span>
        </h4>
        <h1 className="text-lg sm:text-2xl text-gray-400">{city}</h1>
      </div>

      <div className="flex space-x-10 sm:space-x-20 justify-around w-full text-white font-semibold text-md sm:text-lg">
        <div className="flex items-center space-x-3">
          <img className="h-7" src={humidity} alt="humidity icon" />
          <div>
            <div className='flex space-x-2'>
              <h4>{predictedHumidity}</h4>
              {typeof (predictedHumidity) == "number" && <h6 className='text-md flex items-center'>%</h6>}
            </div>
            <h2 className="text-xs sm:text-sm text-gray-400">Humidity</h2>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <img className="h-8" src={wind} alt="wind icon" />
          <div>
            <div className='flex space-x-2'>
              <h4>{predictedWind}</h4>
              {typeof (predictedWind) == "number" && <h6 className='text-sm flex items-center'>km/h</h6>}
            </div>
            <h2 className="text-xs sm:text-sm text-gray-400">Wind Speed</h2>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <img className="h-8" src={precipitation} alt="precipitation icon" />
          <div>
            <div className='flex space-x-2'>
              <h4>{predictedPrecipitation}</h4>
              {typeof (predictedPrecipitation) == "number" && <h6 className='text-sm flex items-center'>mm</h6>}
            </div>
            <h2 className="text-xs sm:text-sm text-gray-400">Precipitation</h2>
          </div>
        </div>
      </div>
    </div>

  );
}
