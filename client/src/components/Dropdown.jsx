import React, { useState } from 'react';
import Temperature from './Temperature';

function WeatherPrediction() {
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [prediction_temp, setPrediction_temp] = useState(null);
  const [prediction_humidity, setPrediction_humidity] = useState(null);
  const [prediction_wind, setPrediction_wind] = useState(null);
  const [prediction_preci, setPrediction_preci] = useState(null);
  const [loading, setLoading] = useState(false)

  const handleCityChange = (e) => setCity(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);

  const handleSubmit = async (e) => {
    setLoading(true)
    setPrediction_temp("Fetching...");
    setPrediction_humidity("Fetching...");
    setPrediction_wind("Fetching...");
    setPrediction_preci("Fetching...");

    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, date }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log("Received prediction:", data);

      setPrediction_temp(data.predicted_temperature);
      setPrediction_humidity(data.predicted_humidity);
      setPrediction_wind(data.predicted_windspeed);
      setPrediction_preci(data.predicted_precipitation);
      setLoading(false)
    } catch (error) {
      console.error('Error fetching prediction:', error);
    }
  };

  return (
    <div className="flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center space-x-3 p-3 rounded-xl bg-gray-800 bg-opacity-70 shadow-lg"
      >
        <select
          value={city}
          onChange={handleCityChange}
          required
          className="px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
        >
          <option className="text-sm text-gray-400" value="" disabled>
            Choose City
          </option>
          <option value="Mumbai">Mumbai</option>
          <option value="Jaipur">Jaipur</option>
          <option value="Bhubhneshwar">Bhubhneshwar</option>
          <option value="Chennai">Chennai</option>
          <option value="Delhi">Delhi</option>
          <option value="Lucknow">Lucknow</option>
          <option value="Bangalore">Bangalore</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          required
          className="px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Predict
        </button>
      </form>


      <div className="flex justify-center items-center mt-4">
        <Temperature
          city={city}
          predictedTemperature={prediction_temp}
          predictedHumidity={prediction_humidity}
          predictedWind={prediction_wind}
          predictedPrecipitation={prediction_preci}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default WeatherPrediction;
