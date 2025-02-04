import React from 'react';

/** Naive function to convert a "rain (mm)" value into
 * a simple "rain probability" (0..100%). */

var rainvalue = 0;

function calculateRainProbability(rainVal) {
  if (rainVal == null) {
    return '--';
  }

  if (rainVal > 50) return '90.00';
  if (rainVal > 20) return '70.00';
  if (rainVal > 3)  return '35.00';
  if (rainVal > 0) return (Math.random() * 10 + 10).toFixed(2);
  return '5.00';
}

function calculateSunProbability(temp, wind, moisture) {
  let sunProb = 90;

  // If temperature is low (<32F), reduce probability
  if (temp !== undefined && temp !== null) {
    if (temp < 32) {
      sunProb -= (Math.random() * 6 + 10).toFixed(2);
    } else if (temp > 95) {
      // Very high temps => slightly higher sun chance
      sunProb += 5;
    }
  }

  // Wind > 40 => reduce significantly
  if (wind !== undefined && wind !== null) {
    if (wind > 40) {
      sunProb -= 28;
    } else if (wind > 25) {
      sunProb -= 10;
    }
  }

  // High moisture => more clouds => reduce sun
  if (moisture !== undefined && moisture !== null) {
    if (moisture > 15) {
      sunProb -= (Math.random() * 6 + 10).toFixed(2);
    } else if (moisture > 8) {
      sunProb -= 10;
    }
  }

  if (calculateRainProbability(rainvalue) !== undefined && calculateRainProbability(rainvalue) !== null) {
    if (calculateRainProbability(rainvalue) >= 20) {
      sunProb -= (Math.random() * 5 + 10).toFixed(2);
    } else if (moisture > 8) {
      sunProb -= 7;
    }
  }

  // Clamp to [0..100]
  if (sunProb < 0) sunProb = 0;
  if (sunProb > 100) sunProb = 100;
  return sunProb.toFixed(2);
}


function ForecastResult({ forecastData }) {
  if (!forecastData) {
    return (
      <div className="card mb-4 border-0" style={{ backgroundColor: '#2b2b2b' }}>
        <div className="card-header bg-dark text-light d-flex align-items-center">
          
          <h4 className="mb-0">Forecast Overview</h4>
        </div>
        <div className="card-body" style={{ color: '#ccc' }}>
          <p>No forecast data yet. Select a location and click Submit.</p>
        </div>
      </div>
    );
  }

  const { lat, lon, startDay, range, results, chosenDate } = forecastData;

  if (!results) {
    return (
      <div className="card mb-4 border-0" style={{ backgroundColor: '#2b2b2b' }}>
        <div className="card-header bg-dark text-light d-flex align-items-center">

          <h4 className="mb-0">Forecast Overview</h4>
        </div>
        <div className="card-body" style={{ color: '#ccc' }}>
          <p>No results were returned from the backend.</p>
        </div>
      </div>
    );
  }

  // Check which data arrays exist
  const hasTemp = results.temperature && results.temperature.length > 0;
  const hasWind = results.wind && results.wind.length > 0;
  const hasRain = results.rain && results.rain.length > 0;
  const hasMoisture = results.moisture && results.moisture.length > 0;
  const daysArray = Array.from({ length: range }, (_, i) => i);

  const formatDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="card mb-4 border-0" style={{ backgroundColor: '#2b2b2b' }}>
      <div className="card-header bg-dark text-light d-flex align-items-center">

        <h4 className="mb-0">Forecast Overview</h4>
      </div>

      <div className="card-body" style={{ color: '#ccc' }}>
        <div className="row mb-3">
          <div className="col">
            <p className="mb-1">
              <strong>Chosen Start Date:</strong> {chosenDate}
            </p>
            <p className="mb-1">
              <strong>Coordinates:</strong> {lat?.toFixed(5)}, {lon?.toFixed(5)}
            </p>
            
            <p className="mb-1">
              <strong>Forecast Range:</strong> {range} days
            </p>
          </div>
        </div>

        <div className="table-responsive mt-3">
          <table className="table table-dark table-bordered" style={{ minWidth: '600px' }}>
            <thead>
              <tr className="text-center">
                <th>Date</th>
                {/* 2) Sun Probability (%) (replacing 'Day of Year') */}
                <th>Sun Probability (%)</th>
                {hasRain && <th>Rain Probability (%)</th>}
                {/* 3) Temperature */}
                {hasTemp && <th>Temperature (D)</th>}
                {/* 4) Wind (km/h) */}
                {hasWind && <th>Wind (km/h)</th>}
                {/* 5) Rain Probability (%) (replacing 'Rain (mm)') */}
                
                {hasMoisture && <th>Moisture (g/m³)</th>}
              </tr>
            </thead>
            <tbody>
              {daysArray.map((offset, idx) => {
                // Build the date
                const dateObj = new Date(chosenDate);
                dateObj.setDate(dateObj.getDate() + offset);
                const displayDate = formatDate(dateObj);

                const tempVal   = hasTemp ? results.temperature[idx] : undefined;
                const windVal   = hasWind ? results.wind[idx] : undefined;
                const rainVal   = hasRain ? results.rain[idx] : undefined;
                const moistVal  = hasMoisture ? results.moisture[idx] : undefined;
                rainvalue= rainVal;
                const sunProb = calculateSunProbability(tempVal, windVal, moistVal);

                const rainProb = hasRain 
                  ? calculateRainProbability(rainVal)
                  : '--';

                return (
                  <tr key={offset} className="text-center">
                    {/* 1) Date */}
                    <td>{displayDate}</td>

                    {/* 2) Sun Probability (%) */}
                    <td>{sunProb}</td>

                    {/* 5) Rain Probability (%) (only if selected) */}
                    {hasRain && <td>{rainProb}</td>}

                    {/* 3) Temperature (only if selected) */}
                    {hasTemp && (
                      <td>
                        {tempVal != null ? tempVal.toFixed(2) : '--'}
                      </td>
                    )}

                    {/* 4) Wind (only if selected) */}
                    {hasWind && (
                      <td>
                        {windVal != null ? windVal.toFixed(2) : '--'}
                      </td>
                    )}

                    {/* 6) Moisture (only if selected) */}
                    {hasMoisture && (
                      <td>
                        {moistVal != null ? moistVal.toFixed(2) : '--'}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default ForecastResult;