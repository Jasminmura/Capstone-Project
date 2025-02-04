import React, { useState } from 'react';

function ForecastForm({ onGetForecast, onLocationSelect }) {
  const [cityName, setCityName] = useState('');
  const [forecastDate, setForecastDate] = useState('');
  const [forecastRange, setForecastRange] = useState(7);

  const [includeTemperature, setIncludeTemperature] = useState(true);
  const [includeWind, setIncludeWind] = useState(false);
  const [includeRain, setIncludeRain] = useState(false);
  const [includeMoisture, setIncludeMoisture] = useState(false);

  const geocodePlace = async () => {
    if (!cityName) {
      alert("Please enter a place name.");
      return;
    }
    try {
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${cityName}&format=json&limit=1`;
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (data.length > 0) {
        const location = data[0];
        onLocationSelect(parseFloat(location.lat), parseFloat(location.lon));
      } else {
        alert("Location not found.");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      alert("Error geocoding location.");
    }
  };

  // Handler for the "Submit" button
  const handleSubmit = () => {
    if (!forecastDate) {
      alert("Please select a date for the forecast.");
      return;
    }

    const params = {
      forecastDate,
      forecastRange,
      temperature: includeTemperature,
      wind: includeWind,
      rain: includeRain,
      moisture: includeMoisture,
    };
    onGetForecast(params);
  };

  return (
    <div className="card mb-4">
      <div className="card-header text-light bg-dark">
        <h4 className="mb-0">Forecast Form</h4>
      </div>
      <div className="card-body">
        {/* City & Geocode */}
        <div className="mb-3">
          <label className="form-label">City Name</label>
          <div className="d-flex">
            <input
              type="text"
              className="form-control bg-dark text-light me-2"
              placeholder="e.g. London"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
            />
            <button
              className="btn btn-custom"
              onClick={geocodePlace}
            >
              Find Location
            </button>
          </div>
        </div>

        {/* Date */}
        <div className="mb-3">
          <label className="form-label">Specific Date</label>
          <input
            type="date"
            className="form-control bg-dark text-light"
            value={forecastDate}
            onChange={(e) => setForecastDate(e.target.value)}
          />
        </div>

        {/* Forecast Range */}
        <div className="mb-3">
          <label className="form-label d-block">Forecast Range</label>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              checked={forecastRange === 1}
              onChange={() => setForecastRange(1)}
            />
            <label className="form-check-label">1 Day</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              checked={forecastRange === 7}
              onChange={() => setForecastRange(7)}
            />
            <label className="form-check-label">7 Days</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              checked={forecastRange === 14}
              onChange={() => setForecastRange(14)}
            />
            <label className="form-check-label">14 Days</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              checked={forecastRange === 30}
              onChange={() => setForecastRange(30)}
            />
            <label className="form-check-label">30 Days</label>
          </div>
        </div>

        {/* Parameter Checkboxes */}
        <div className="mb-3">
          <label className="form-label d-block">Select Parameters</label>
          <div className="form-check form-check-inline">
            <input
              type="checkbox"
              className="form-check-input"
              checked={includeTemperature}
              onChange={() => setIncludeTemperature(!includeTemperature)}
            />
            <label className="form-check-label">Temperature</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="checkbox"
              className="form-check-input"
              checked={includeWind}
              onChange={() => setIncludeWind(!includeWind)}
            />
            <label className="form-check-label">Wind</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="checkbox"
              className="form-check-input"
              checked={includeRain}
              onChange={() => setIncludeRain(!includeRain)}
            />
            <label className="form-check-label">Rain</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="checkbox"
              className="form-check-input"
              checked={includeMoisture}
              onChange={() => setIncludeMoisture(!includeMoisture)}
            />
            <label className="form-check-label">Moisture</label>
          </div>
        </div>

        <button
          className="btn btn-custom w-100"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default ForecastForm;