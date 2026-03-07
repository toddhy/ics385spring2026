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

### 1. Open the Dashboard
```
Open: index.html in your browser
(Use Live Server extension in VS Code)
```

### 2. Set API Keys (First Time Only)
- If API keys are missing, a settings dialog appears automatically
- Enter your API keys:
  - **OpenWeather API Key** - For weather data
  - **RapidAPI Key** - For Chuck Norris jokes
- Click "Save" and page reloads with live data

### 3. Explore the Dashboard
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

**Key Requirement:** OpenWeather API key stored in browser localStorage

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

### Setting API Keys

**When you first open the dashboard:**
- If keys are missing, a settings dialog appears
- Enter your OpenWeather API key
- Enter your RapidAPI key
- Click "Save"
- Page reloads with live data

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

**Proxy Server:**
- Node.js proxy running on `localhost:3000`
- Routes API requests to bypass CORS restrictions
- Automatically used by the dashboard
- Must be running for APIs to work

**How it Works:**
```
Dashboard → Proxy Server (localhost:3000) → External APIs
Response returns through proxy back to dashboard
```

**Keep Running:**
The proxy server (port 3000) must stay running. If it stops:
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
**Problem:** Proxy server is not running or unreachable
- ✅ Start the proxy server: `npm start` in terminal
- ✅ Check that it's running on localhost:3000
- ✅ Look for Node.js errors in terminal output
- ✅ Try restarting the server

### Forms Don't Submit or Validate
**Problem:** Course form validation issues
- ✅ Ensure all required fields are filled (marked with *)
- ✅ Course code must be unique (no duplicates)
- ✅ Student count must be ≤ course capacity
- ✅ All fields must follow their validation rules

---

## 📚 Technical Details

**Core Files:**
- `index.html` - Dashboard structure and layout
- `dashboard.js` - Dashboard logic and form handling
- `api-client.js` - External API communication
- `course-catalog.js` - Course data management
- `config.js` - API keys and configuration
- `styles.css` - Dashboard styling

**Browser Requirements:**
- Modern browser with ES6+ support
- localStorage enabled
- Internet connection for APIs

**Default Course Data:**
Dashboard comes with 8 pre-loaded UH Maui College courses. You can add, edit, and delete courses. All courses are stored in browser localStorage.

---

**Last Updated:** March 7, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
