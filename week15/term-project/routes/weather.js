import express from 'express';

const router = express.Router();

// GET /api/weather/current - Proxy for current weather
router.get('/current', async (req, res) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY || process.env.VITE_WEATHER_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Weather API key not configured on server' });
    }

    const { lat = 20.7983, lon = -156.3319 } = req.query;

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
    );

    if (!weatherResponse.ok) {
      return res.status(weatherResponse.status).json({ 
        error: `OpenWeatherMap API error: ${weatherResponse.statusText}` 
      });
    }

    const weatherData = await weatherResponse.json();
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/weather/forecast - Proxy for 5-day forecast
router.get('/forecast', async (req, res) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY || process.env.VITE_WEATHER_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Weather API key not configured on server' });
    }

    const { lat = 20.7983, lon = -156.3319 } = req.query;

    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
    );

    if (!forecastResponse.ok) {
      return res.status(forecastResponse.status).json({ 
        error: `OpenWeatherMap API error: ${forecastResponse.statusText}` 
      });
    }

    const forecastData = await forecastResponse.json();
    res.json(forecastData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
