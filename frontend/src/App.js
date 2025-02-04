// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import MapComponent from './components/MapComponent';
import ForecastForm from './components/ForecastForm';
import ForecastResult from './components/ForecastResult';
import AboutPage from './components/AboutPage';

function dateToDayOfYear(dateString) {
  const dateObj = new Date(dateString);
  const start = new Date(dateObj.getFullYear(), 0, 0);
  const diff = dateObj - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function App() {
  const [selectedLocation, setSelectedLocation] = useState({ lat: null, lon: null });
  const [forecastData, setForecastData] = useState(null);

  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleLocationSelect = (lat, lon) => {
    setSelectedLocation({ lat, lon });
  };

  const getForecast = async (params) => {
    const { forecastDate, forecastRange, temperature, wind, rain, moisture } = params;

    if (!selectedLocation.lat || !selectedLocation.lon) {
      alert("Please select a location on the map or via city name first.");
      return;
    }

    const dayOfYear = dateToDayOfYear(forecastDate);

    const queryParams = new URLSearchParams({
      lat: selectedLocation.lat,
      lon: selectedLocation.lon,
      startDay: dayOfYear,
      range: forecastRange,
      temp: temperature ? '1' : '0',
      wind: wind ? '1' : '0',
      rain: rain ? '1' : '0',
      moisture: moisture ? '1' : '0',
    });

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/weather?${queryParams.toString()}`
      );
      const data = await response.json();

      if (data.error) {
        alert(data.error);
      } else {
        data.chosenDate = forecastDate;
        setForecastData(data);
      }
    } catch (err) {
      console.error('Error fetching data from backend:', err);
      alert('Error fetching data from backend.');
    }
  };

  return (
    <Router>
      <div className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <NavBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

        <div className="container my-4">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <ForecastForm
                    onGetForecast={getForecast}
                    onLocationSelect={handleLocationSelect}
                  />
                  <MapComponent
                    onLocationSelect={handleLocationSelect}
                    selectedLocation={selectedLocation}
                  />
                  <ForecastResult forecastData={forecastData} />
                </>
              }
            />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;