
import { useEffect, useState } from 'react';
import humidity from '../assets/humidity.png'
import wind from '../assets/wind.png'
import clear from '../assets/clear.png' 
import cloud from '../assets/cloud.png'
import drizzle from '../assets/drizzle.png'
import rain from '../assets/rain.png'
import snow from '../assets/snow.png'
import thunderstorm from '../assets/thunderstorm.png'
import mist from '../assets/mist.png'

export default function Temperature(props) {
  const [temp, setTemp] = useState("Fetching...")
  const [humid, setHumid] = useState("Fetching...")
  const [windSpeed, setWindSpeed] = useState("Fetching...")
  const [country  , setCountry] = useState()
  const [icon , setIcon] = useState();

  useEffect(() =>{
    if(props.message){
      setTemp(props.message.main.temp);
      setHumid(props.message.main.humidity + " %");
      setWindSpeed(props.message.wind.speed + " km/hr");
      setCountry(props.message.name);

      const checkIcon = props.message.weather[0].icon;
      if(checkIcon === "01d" || checkIcon === "01n") setIcon(clear);
      else if(checkIcon === "02d" || checkIcon === "02n") setIcon(cloud);
      else if(checkIcon === "03d" || checkIcon === "03n") setIcon(cloud);
      else if(checkIcon === "04d" || checkIcon === "04n") setIcon(drizzle);
      else if(checkIcon === "09d" || checkIcon === "09n") setIcon(rain);
      else if(checkIcon === "10d" || checkIcon === "10n") setIcon(rain);
      else if(checkIcon === "11d" || checkIcon === "11n") setIcon(thunderstorm);
      else if(checkIcon === "13d" || checkIcon === "13n") setIcon(snow);
      else if(checkIcon === "50d" || checkIcon === "50n") setIcon(mist);
      else setIcon(drizzle);
    }
  }, [props.message])
  
  return (
    <div className='flex flex-col space-y-6 items-center mt-10'>
        <img className='h-32 sm:h-40' src={icon} alt="weather"/>

        <div className='text-center text-white font-semibold text-xl sm:text-4xl'>
          <h4>{temp} 
            <span className='ml-2 relative text-sm sm:text-lg bottom-3 sm:bottom-6'>o</span>
            <span className='text-lg sm:text-2xl relative sm:bottom-2'>C</span>
          </h4>
          <h1>{country}</h1>
        </div>

        <div className='flex space-y-3 flex-wrap justify-around w-full text-white font-semibold text-lg'>
          <div className='flex items-center space-x-3'>
            <img className='h-7' src={humidity} alt="" />
            <div>
              <h4>{humid}</h4>
              <h2 className='text-xs'>Humidity</h2>
            </div>
          </div>
          <div className='flex items-center space-x-3'>
            <img className='h-8' src={wind} alt="" />
            <div>
              <h4>{windSpeed}</h4>
              <h2 className='text-xs'>Wind Speed</h2>
            </div>
          </div>
        </div>
    </div>
  )
}
