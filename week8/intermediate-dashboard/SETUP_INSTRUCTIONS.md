# UH Maui Campus Dashboard - Setup Instructions

## Overview
This is a multi-API dashboard that displays:
- Real-time weather for Kahului
- Campus course information
- Humor (Chuck Norris jokes & programming humor)

## Quick Start

### Step 1: Start the Proxy Server
First, open a terminal and start the proxy server (this handles CORS issues):

```bash
cd c:\ics385spring2026\week8\intermediate-dashboard
node proxy-server.js
```

You should see:
```
============================================
🚀 Proxy Server running on http://localhost:3000
============================================
```

**Keep this terminal open while using the dashboard!**

### Step 2: Open the Dashboard
In a browser, navigate to the dashboard HTML file:
- Using VS Code: Right-click `index.html` → "Open with Live Server"
- Or manually: `http://localhost:5500/c:/ics385spring2026/week8/intermediate-dashboard/index.html` (or similar)

### Step 3: Configure API Keys (First Time Only)
When you first load the dashboard:
1. A modal will appear asking for API keys
2. You should already have keys stored in localStorage, but if not:
   - **OpenWeather API Key**: Get from https://openweathermap.org/api
   - **RapidAPI Key**: Get from https://rapidapi.com/ (for Chuck Norris jokes)

The dashboard will work with fallback data if keys are missing.

## Features

### Buttons that Now Work
✅ **Refresh All** - Reloads weather and jokes
✅ **New Jokes** - Loads fresh Chuck Norris & programming jokes  
✅ **Update Weather** - Reloads current weather
✅ **Add Course** - Add new courses
✅ **Export Data** - Export courses as JSON

### Data Sources
- **Weather**: OpenWeatherMap API (free tier)
- **Courses**: Loaded from `courses.json` (Spring 2026 UH Maui courses)
- **Jokes**: 
  - Chuck Norris: RapidAPI endpoint
  - Programming Humor: JokeAPI (public, no key needed)

## Troubleshooting

### "Failed to fetch" Error
This means the proxy server isn't running. Make sure to:
1. Open a new terminal
2. Run `node proxy-server.js`
3. Keep it running while using the dashboard

### Buttons Still Don't Work
1. Check the browser console (F12) for errors
2. Make sure the proxy server is running and shows no errors
3. Verify API keys are set in localStorage

### To Debug
Open `DEBUG.html` in your browser for detailed diagnostics:
- Shows API keys status
- Test individual APIs
- See real-time console logs

## Project Structure

```
intermediate-dashboard/
├── index.html           # Main dashboard page
├── DEBUG.html           # Debug console for troubleshooting
├── config.js            # API configuration
├── api-client.js        # API client with caching
├── dashboard.js         # Dashboard controller
├── course-catalog.js    # Course data management
├── courses.json         # Course database
├── styles.css           # Dashboard styling
├── proxy-server.js      # CORS proxy (must be running)
└── README.md           # This file
```

## How It Works

### The Proxy Server
The proxy server solves the CORS (Cross-Origin Resource Sharing) problem:
- Browsers normally can't make requests to external APIs directly
- The proxy server runs on localhost:3000
- It forwards API requests to external services and returns responses
- This allows the browser dashboard to access the APIs

### API Flow
```
Browser → Proxy Server (localhost:3000) → External API → Response
```

## Development Notes

### Adding New APIs
1. Update `config.js` with new API configuration
2. Add methods to `UnifiedApiClient` class in `api-client.js`
3. Call from dashboard via `this.apiClient.methodName()`

### Disable Proxy (for testing)
To test without the proxy, modify `api-client.js` line 38:
```javascript
// Remove the proxy lines and use direct fetch:
const response = await fetch(requestConfig.url, {
  ...requestConfig.options,
  signal: controller.signal
});
```

## Keyboard Shortcuts
- None implemented yet (can be added to dashboard.js)

## Known Limitations
- Proxy server must be running (no cloud deployment in current setup)
- OpenWeather free tier limited to ~1000 requests/day
- RapidAPI quota dependent on your account tier

## Future Improvements
- Deploy proxy to cloud (Heroku, Replit, etc.)
- Add real authentication instead of localStorage
- Implement proper error retry logic
- Add more weather details and forecasts
- Database integration for persistent course data
