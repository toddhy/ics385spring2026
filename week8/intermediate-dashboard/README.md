# UH Maui College Campus Dashboard

**Status:** ✅ **COMPLETE AND PRODUCTION READY**

A comprehensive campus information portal that displays real-time weather, campus humor, and course management all in one place. Powered by multiple APIs to keep information current and engaging.

---

## 📋 Table of Contents

- [What You Get](#what-you-get)
- [Quick Start](#quick-start)
- [Dashboard Components](#dashboard-components)
- [APIs Used](#apis-used)
- [How to Navigate](#how-to-navigate)
- [Course Management](#course-management)
- [API Configuration](#api-configuration)
- [Troubleshooting](#troubleshooting)

---

## What You Get

This dashboard combines real-time information with local course management:

✅ **Live Weather Data** - Current Kahului, HI conditions from OpenWeather API  
✅ **Campus Humor** - Curated jokes from multiple sources to brighten your day  
✅ **Course Management** - Add, edit, delete, and search campus courses  
✅ **Search & Filter** - Find courses by code, department, instructor  
✅ **Dashboard Stats** - Quick overview of enrollment and capacity  
✅ **Export Data** - Download course information as JSON

---

## � Quick Start

### 1. Install Dependencies
```bash
npm install
```
This installs the `dotenv` package needed to load environment variables.

### 2. Configure API Keys
Create or edit the `.env` file in the dashboard directory:
```bash
# .env file
OPENWEATHER_API_KEY=your_openweather_key_here
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=matchilling-chuck-norris-jokes-v1.p.rapidapi.com
PORT=3000
```

### 3. Start the Proxy Server
```bash
npm start
```
The proxy server will start on `http://localhost:3000`

### 4. Open the Dashboard
```
Open: index.html in your browser
(Use Live Server extension in VS Code)
```

### 5. Explore the Dashboard
- **Top section:** Quick stats cards (courses, students, capacity, API status)
- **Left column:** Weather widget showing current conditions
- **Center column:** Course management with search and filters
- **Right column:** Daily humor to brighten your day
- **Bottom section:** Quick action buttons

---

## 📊 Dashboard Components

### 1. Quick Stats Overview (Top Bar)
Four summary cards showing:
- **Courses** - Total number of courses offered
- **Students** - Total enrollment across all courses
- **Capacity** - Percentage of seats filled overall
- **API Status** - Connection status to external services

---

### 2. Weather Widget (Left Side)

**What it shows:**
- Current temperature in Fahrenheit
- Weather condition (sunny, cloudy, rainy, etc.)
- "Feels like" temperature
- Wind speed
- Humidity percentage
- Last updated timestamp

**Powered by:** OpenWeather API
- Real-time data for Kahului, HI
- Updates every 10 minutes automatically
- Manual refresh with "Update Weather" button

**Example:**
```
Current Weather: Kahului, Hawaii
📍 Temperature: 78°F
☀️ Feels Like: 76°F
Wind: 8 mph
Humidity: 65%
Last Updated: 2 min ago
```

---

### 3. Course Management (Center)

**Section includes:**
- **Search Box** - Find courses by code, name, instructor, department
- **Department Filter** - Show only ICS, MATH, ENG, etc.
- **Course Grid** - Cards displaying all available courses
- **Edit/Delete Buttons** - Modify or remove courses

**Course Card Shows:**
- Course code and title
- Instructor name
- Current enrollment / Capacity (e.g., "18/25")
- Visual enrollment bar
- Edit and Delete action buttons

**Default Courses Included:**
- ICS 385 - Web Development and Administration
- ICS 311 - Algorithms
- MATH 140 - Calculus I
- MATH 241 - Discrete Mathematics
- ENG 110 - English Composition I
- CHEM 151 - General Chemistry I
- PHYS 151 - Physics I: Mechanics
- BUSN 101 - Business Fundamentals

---

### 4. Humor Widget (Right Side)

**What it displays:**
- Two different jokes/quotes per refresh
- One Chuck Norris joke (from RapidAPI)
- One random joke from JokeAPI
- "New Jokes" button to refresh
- Last updated time

**Powered by:** 
- RapidAPI Chuck Norris Jokes database
- JokeAPI (sv443.net)

**Why:** Brighten the campus experience with daily humor!

**Example:**
```
Chuck Norris: "Chuck Norris can write multi-threaded applications 
with his left hand tied behind his back."

Random Joke: "Why did the developer go broke? 
Because he used up all his cache!"
```

---

### 5. Quick Actions (Bottom Section)

**Available buttons:**
- **Add Course** - Create new course in the system
- **Export Data** - Download all courses as JSON file
- **Update Weather** - Manually refresh weather data
- **New Jokes** - Fetch fresh jokes

---

## 🌐 APIs Used

### OpenWeather API v2.5
**Purpose:** Real-time weather information

**What it provides:**
- Current temperature and "feels like" temperature
- Weather conditions (clear, cloudy, rainy, etc.)
- Wind speed and direction
- Humidity percentage
- Sunrise/sunset times
- Location-based data

**Configuration:**
- Endpoint: `api.openweathermap.org/data/2.5/weather`
- Location: Kahului, Hawaii (19.7191° N, 156.4717° W)
- Updates: Every 10 minutes automatically, or manually

**Key Requirement:** OpenWeather API key stored in `.env` file

---

### RapidAPI - Chuck Norris Jokes
**Purpose:** Entertaining Chuck Norris jokes

**What it provides:**
- Curated database of Chuck Norris facts/jokes
- HTTP JSON responses
- Available 24/7

**Configuration:**
- Hosted on: `matchilling-chuck-norris-jokes-v1.p.rapidapi.com`
- Uses proxy server for CORS handling
- Key: RapidAPI subscription key

**Example Response:**
```json
{
  "value": "Chuck Norris can write multi-threaded 
          applications with one hand tied behind his back.",
  "icon_url": "...",
  "url": "..."
}
```

---

### JokeAPI (sv443.net)
**Purpose:** Diverse joke categories

**What it provides:**
- Programming, general, knock-knock jokes
- Single or two-part joke formats
- Searchable by category
- Free and open access

**Configuration:**
- Endpoint: `sv443.net/jokeapi/v2/joke/Any`
- Returns random jokes across all categories
- No API key needed (public access)

**Example Response:**
```json
{
  "setup": "Why did the developer go broke?",
  "delivery": "Because he used up all his cache!",
  "type": "twopart"
}
```

---

## 🗺️ How to Navigate

### First Time Visit
1. **System checks for API keys**
   - If missing, setup dialog appears
   - Enter OpenWeather and RapidAPI keys
   - Click "Save" to proceed

2. **Dashboard loads**
   - Stats cards show course summary
   - Weather widget shows current conditions
   - Courses display in the center
   - Humor widget shows daily jokes

### Daily Use
```
┌─────────────────────────────────┐
│  Quick Stats (Top)              │
│  [Courses] [Students] [Cap] [API]
├──────────┬──────────────┬───────┤
│ Weather  │ Course Grid  │ Jokes │
│ Widget   │ + Search     │       │
│          │ + Filter     │       │
│          │ + Edit/Del   │       │
├─────────────────────────────────┤
│  Action Buttons (Bottom)        │
│  [Add Course] [Export] [Refresh]│
└─────────────────────────────────┘
```

### Common Workflows

**Check Weather:**
1. Look at Weather Widget on left
2. Click "Update Weather" to refresh manually

**Find a Course:**
1. Type in search box (top of course section)
2. Or select department from dropdown
3. Results filter instantly

**Look for Humor:**
1. Check Humor Widget on right
2. Click "New Jokes" for fresh content

**Manage Courses:**
1. Click "Add Course" to create new
2. Click "Edit" on card to modify
3. Click "Delete" on card to remove
4. Click "Export Data" to backup

---

## � Course Management

### Adding a Course
1. Click "Add Course" button
2. Fill in course details (code, name, department, etc.)
3. Click "Add Course" to save
4. Course appears immediately in the grid

### Editing a Course
1. Find course in the grid
2. Click "Edit" button on the course card
3. Form opens with current data
4. Make changes and click "Update Course"
5. Changes appear immediately

### Deleting a Course
1. Find course in the grid
2. Click "Delete" button
3. Confirm in the popup dialog
4. Course is removed from the grid

### Searching & Filtering
- **Search:** Type in search box to find courses (searches code, name, instructor)
- **Filter:** Select department to show only those courses
- **Both:** Use together to narrow down results

### Exporting Courses
1. Click "Export Data" button
2. Browser downloads `courses_export.json`
3. Use to backup or share course list

---

## ⚙️ API Configuration

### Secure Server-Side Key Management

**API keys are now stored securely on the server (`.env` file)** and injected server-side by the proxy. The frontend NEVER handles API keys.

**Architecture:**
```
Frontend (no keys) 
  → Requests to proxy with service parameter
    → Proxy injects API keys from .env
      → Forwards to external APIs
        → Response back to frontend
```

**How it works:**
1. Proxy server loads `.env` file on startup
2. Frontend requests: `http://localhost:3000/proxy?url=<api-url>&service=<service>`
3. Proxy identifies the service and injects the appropriate keys:
   - **openWeather:** Adds `appid` parameter
   - **rapidApi:** Adds `X-RapidAPI-Key` and `X-RapidAPI-Host` headers
   - **jokeApi:** No keys needed
4. Response returned to frontend

**Keys are never exposed to:**
- Browser console
- Network requests visible to user
- Frontend JavaScript code
- localStorage or sessionStorage

### Setting API Keys

**Edit `.env` file in the dashboard directory:**
```bash
# .env file
OPENWEATHER_API_KEY=your_key_here
RAPIDAPI_KEY=your_key_here
RAPIDAPI_HOST=matchilling-chuck-norris-jokes-v1.p.rapidapi.com
PORT=3000
```

**Where to Get Keys:**

**OpenWeather API Key:**
1. Go to https://openweathermap.org/api
2. Sign up for free account
3. Go to API keys section
4. Copy your API key
5. Paste into the "OpenWeather Key" field

**RapidAPI Key:**
1. Go to https://rapidapi.com
2. Sign up for free account
3. Subscribe to "Chuck Norris Jokes API"
4. Copy your API key from subscription
5. Paste into the "RapidAPI Key" field

### API Integration

### API Integration

**Proxy Server Architecture:**
- Node.js proxy running on `localhost:3000`
- Loads API keys from `.env` file at startup
- Provides `/config` endpoint for frontend configuration
- Provides `/proxy` endpoint for forwarding API requests with key injection
- Bypasses CORS restrictions
- Secures API keys by keeping them server-side only
- Automatically used by the dashboard

**How Requests Flow:**
```
Client Request → Proxy Server → External API
                 ↓ (adds keys)        ↓
                 Injects auth     Returns JSON
                 from .env        → Client
```

**Endpoints:**
- `GET /config` - Returns safe configuration (no keys exposed)
- `GET /proxy?url=<url>&service=<service>` - Forwards requests with key injection
- `GET /health` - Health check

**API Key Injection:**
Proxy automatically adds:
- **OpenWeather:** `appid` parameter to query string
- **RapidAPI:** `X-RapidAPI-Key` and `X-RapidAPI-Host` headers
- **JokeAPI:** No keys (public API)

**Start Proxy Server:**
```bash
npm start
# Or directly: node proxy-server.js
# Server will display status of loaded API keys
```

The proxy server must be running for APIs to work. If it stops:
- Weather won't update
- Jokes won't load
- API status shows "Disconnected"

---

## 🔧 Troubleshooting

### Weather Widget Shows "Loading..." (Never Updates)
**Problem:** OpenWeather API not responding
- ✅ Check that OpenWeather API key is valid
- ✅ Check that proxy server is running (localhost:3000)
- ✅ Check browser console for API errors (F12 key)
- ✅ Try clicking "Update Weather" manually

**If API key expires:** Get a new one from https://openweathermap.org

### Jokes Section is Empty
**Problem:** Humor APIs not responding
- ✅ Check that RapidAPI key is valid
- ✅ Verify Chuck Norris API subscription is active
- ✅ Check that proxy server is running
- ✅ Click "New Jokes" to retry

### Can't Add/Edit/Delete Courses
**Problem:** Course management not responding
- ✅ Check browser console for JavaScript errors (F12)
- ✅ Try refreshing the page (Ctrl+R)
- ✅ Check that localStorage is enabled in browser
- ✅ Clear browser cache and try again

### API Status Shows "Disconnected"
**Proxy Server is not running or unreachable:**
- ✅ Check that `.env` file exists with API keys configured
- ✅ Start the proxy server: `npm start` in terminal
- ✅ Check that it's running on localhost:3000
- ✅ Look for Node.js errors in terminal output
- ✅ Try restarting the server with: `npm start`

### Forms Don't Submit or Validate
**Problem:** Course form validation issues
- ✅ Ensure all required fields are filled (marked with *)
- ✅ Course code must be unique (no duplicates)
- ✅ Student count must be ≤ course capacity
- ✅ All fields must follow their validation rules

---

## � Security Implementation

### Overview
This dashboard implements **server-side security** to protect API credentials and prevent exposure of sensitive data to the browser.

### Key Security Features

#### 1. **Server-Side API Key Injection**
- API keys are stored in `.env` file (server-side only)
- **Never exposed to browser or network requests**
- Proxy server injects keys before forwarding requests to external APIs
- Frontend never handles or stores API credentials

**How it works:**
```
Frontend request: /proxy?url=<api>&service=openWeather
         ↓
Server (proxy): Loads API keys from .env
         ↓
Server adds credentials to request
         ↓
Forwards to external API with auth headers
```

#### 2. **Environment Variable Protection**
- `.env` file contains all sensitive credentials
- `.env` is NOT committed to version control (add to `.gitignore`)
- Only the server process can access these variables
- Different keys can be set per environment (dev, staging, prod)

**Required format:**
```bash
OPENWEATHER_API_KEY=your_key_here
RAPIDAPI_KEY=your_key_here
RAPIDAPI_HOST=matchilling-chuck-norris-jokes-v1.p.rapidapi.com
PORT=3000
```

#### 3. **Proxy Server Architecture**
The proxy server acts as a **security intermediary**:

- **CORS Handling:** Bypasses CORS restrictions safely
- **Request Routing:** All API calls go through `/proxy` endpoint
- **Header Injection:** Adds authentication headers server-side
- **Response Handling:** Returns only necessary data to frontend
- **Request Logging:** Logs all API interactions for monitoring

**Proxy Endpoints:**
```
GET /config     - Returns safe config (no keys exposed)
GET /proxy      - Forwards requests with key injection
GET /health     - Health check
```

#### 4. **Secure Configuration Loading**
- `config.js` fetches configuration from `/config` endpoint
- Proxy provides safe config data (API hosts, timeouts, etc.)
- Configuration loaded asynchronously before API calls begin
- Fallback to defaults if proxy unavailable

#### 5. **Error Handling**
- API errors are caught and logged server-side
- Generic error messages returned to frontend (no internal details)
- Fallback data provided for all services
- User-friendly error messages in UI

**Error Flow:**
```
API Error → Server catches & logs
         → Frontend receives message
         → Fallback data displayed
         → User sees graceful degradation
```

#### 6. **Rate Limiting**
- Per-service rate limits enforced client-side
- 60 requests/min for OpenWeather
- 100 requests/min for RapidAPI
- 120 requests/min for JokeAPI
- Prevents API quota abuse

#### 7. **Data Caching**
- Responses cached for 10 minutes
- Reduces API calls and costs
- Cache validity checked before making requests
- Improves dashboard performance

### Security Best Practices

✅ **DO:**
- Keep `.env` file in `.gitignore`
- Change API keys periodically
- Monitor proxy logs for suspicious activity
- Use HTTPS in production
- Restrict API keys to specific services/domains in API provider settings

❌ **DON'T:**
- Commit `.env` file to version control
- Share `.env` file in public repositories
- Expose API keys in client-side code
- Log sensitive data to browser console
- Allow unauthenticated access to proxy endpoints

### Production Deployment

When deploying to production:

1. **Environment Variables:**
   - Set via hosting platform (Heroku, AWS, etc.)
   - NOT committed to repository
   - Keep separate dev/prod keys

2. **CORS Configuration:**
   - Restrict proxy to specific allowed origins
   - Update in proxy-server.js or environment

3. **HTTPS Enforcement:**
   - Use SSL/TLS certificates
   - Redirect HTTP to HTTPS
   - Set secure cookie flags

4. **Authentication:**
   - Add API authentication to proxy (if public)
   - Consider OAuth for user access
   - Rate limit by IP or user

5. **Monitoring:**
   - Log all API requests
   - Monitor for failed requests
   - Alert on unusual patterns
   - Track API quota usage

---

## �📚 Technical Details

**Core Files:**
- `index.html` - Dashboard structure and layout
- `dashboard.js` - Dashboard logic and form handling
- `api-client.js` - External API communication
- `course-catalog.js` - Course data management
- `config.js` - Configuration from environment
- `proxy-server.js` - Node.js proxy server for CORS
- `styles.css` - Dashboard styling
- `.env` - Environment variables (API keys)
- `package.json` - Node.js dependencies

**Browser Requirements:**
- Modern browser with ES6+ support
- localStorage enabled
- Internet connection for APIs

**Server Requirements:**
- Node.js installed
- dotenv package (`npm install`)
- Proxy server running (`npm start`)

**Default Course Data:**
Dashboard comes with 8 pre-loaded UH Maui College courses. You can add, edit, and delete courses. All courses are stored in browser localStorage.

---

**Last Updated:** March 7, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
