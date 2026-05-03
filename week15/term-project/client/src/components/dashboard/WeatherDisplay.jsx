import { useState, useEffect } from 'react';
import './Weather.css';

export default function WeatherDisplay() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || '';

        // Maui coordinates
        const lat = 20.7983;
        const lon = -156.3319;

        // Current weather - call backend proxy
        const weatherResponse = await fetch(
          `${apiBase}/api/weather/current?lat=${lat}&lon=${lon}`
        );
        if (!weatherResponse.ok) {
          throw new Error(`Weather API error: ${weatherResponse.statusText}`);
        }
        const weatherData = await weatherResponse.json();
        setWeather(weatherData);

        // 5-day forecast - call backend proxy
        const forecastResponse = await fetch(
          `${apiBase}/api/weather/forecast?lat=${lat}&lon=${lon}`
        );
        if (!forecastResponse.ok) {
          throw new Error(`Forecast API error: ${forecastResponse.statusText}`);
        }
        const forecastData = await forecastResponse.json();
        setForecast(forecastData);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return <div className="weather-container"><div className="weather-loading">Loading weather...</div></div>;
  if (error) return <div className="weather-container"><div className="weather-error">Error: {error}</div></div>;
  if (!weather) return null;

  const temp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const rainChance = weather.clouds.all;
  const description = weather.weather[0].main;
  const windSpeed = Math.round(weather.wind.speed);

  // Get next 5 days forecast (one entry per day at noon)
  const dailyForecasts = forecast ? forecast.list.filter((item, index) => index % 8 === 0).slice(0, 5) : [];

  return (
    <div className="weather-container">
      <div className="weather-header">
        <h2>Current Weather at Upcountry Getaway</h2>
      </div>

      <div className="weather-current">
        <div className="weather-main">
          <div className="weather-temp-section">
            <div className="weather-icon">
              {description === 'Clear' ? '☀️' : description === 'Clouds' ? '☁️' : description === 'Rain' ? '🌧️' : '🌤️'}
            </div>
            <div className="weather-info">
              <div className="temperature">{temp}°F</div>
              <div className="description">{description}</div>
              <div className="feels-like">Feels like {feelsLike}°F</div>
            </div>
          </div>

          <div className="weather-details-grid">
            <div className="weather-detail-card">
              <div className="detail-label">Cloud Cover</div>
              <div className="detail-value">{rainChance}%</div>
              <div className="rain-bar">
                <div className="rain-fill" style={{ width: `${rainChance}%` }}></div>
              </div>
            </div>

            <div className="weather-detail-card">
              <div className="detail-label">Wind Speed</div>
              <div className="detail-value">{windSpeed} m/s</div>
            </div>

            <div className="weather-detail-card">
              <div className="detail-label">Humidity</div>
              <div className="detail-value">{weather.main.humidity}%</div>
            </div>

            <div className="weather-detail-card">
              <div className="detail-label">Pressure</div>
              <div className="detail-value">{weather.main.pressure} mb</div>
            </div>
          </div>
        </div>
      </div>

      {dailyForecasts.length > 0 && (
        <div className="weather-forecast">
          <h3>5-Day Forecast</h3>
          <div className="forecast-grid">
            {dailyForecasts.map((day, index) => {
              const date = new Date(day.dt * 1000);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
              const temp = Math.round(day.main.temp);
              const rain = day.clouds.all;
              const icon = day.weather[0].main;

              return (
                <div key={index} className="forecast-card">
                  <div className="forecast-day">{dayName}</div>
                  <div className="forecast-icon">
                    {icon === 'Clear' ? '☀️' : icon === 'Clouds' ? '☁️' : icon === 'Rain' ? '🌧️' : '🌤️'}
                  </div>
                  <div className="forecast-temp">{temp}°F</div>
                  <div className="forecast-rain">☔ {rain}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
