# Actual Components Walkthrough (Week 15 Term Project)

## What is real vs. placeholder
The earlier calendar booking walkthrough references files like:
- client/src/components/booking/BookingCalendar.jsx
- routes/bookings.js
- models/Booking.js

Those files are not present in this workspace.

This document walks through components and routes that do exist.

---

## 1) App entry and top-level flow

### main.jsx
File: week15/term-project/client/src/main.jsx

- Creates React root and renders App inside StrictMode.

### App.jsx
File: week15/term-project/client/src/App.jsx

App controls two main UI modes with local state:
- Marketing mode (default)
- Dashboard mode

Key behavior:
- showDashboard starts as false.
- Clicking "View Dashboard" sets showDashboard to true.
- Clicking "Back to Marketing" sets it back to false.

In marketing mode, App renders:
- Header
- HeroSection
- WeatherDisplay
- AboutSection
- AmenitiesSection
- CTASection
- Footer

In dashboard mode, App renders:
- VisitorStatsDashboard

It also defines a property object in-component and passes it down as props to section components.

Example from App.jsx:

```jsx
const [showDashboard, setShowDashboard] = useState(false);

if (showDashboard) {
  return (
    <div className="app">
      <button onClick={() => setShowDashboard(false)}>← Back to Marketing</button>
      <VisitorStatsDashboard />
    </div>
  );
}
```

---

## 2) Marketing components (real)

### Header
File: week15/term-project/client/src/components/Header.jsx

- Static nav links:
  - Home
  - Dashboard (anchor link)
  - Admin (/admin/login)

### HeroSection
File: week15/term-project/client/src/components/HeroSection.jsx

- Receives name, island, tagline, imageURL as props.
- Uses imageURL as section background image.

### AboutSection
File: week15/term-project/client/src/components/AboutSection.jsx

- Receives description, targetSegment, year.
- Conditionally renders year and targetSegment blocks if provided.

### AmenitiesSection
File: week15/term-project/client/src/components/AmenitiesSection.jsx

- Receives amenities array.
- Maps amenities into list items with a checkmark icon.

### CTASection
File: week15/term-project/client/src/components/CTASection.jsx

- Receives email prop.
- Provides mailto links and a secondary "Check Availability" button.

### Footer
File: week15/term-project/client/src/components/Footer.jsx

- Static quick links/legal/social sections.
- Computes current year dynamically with Date.

---

## 3) Weather component (real)

### WeatherDisplay
File: week15/term-project/client/src/components/dashboard/WeatherDisplay.jsx

State:
- weather
- forecast
- loading
- error

Data fetch behavior:
- Reads VITE_WEATHER_KEY from Vite env.
- If missing, shows error state immediately.
- Calls OpenWeatherMap current weather endpoint for fixed Maui coordinates.
- Calls OpenWeatherMap 5-day forecast endpoint.
- Stores results and renders current conditions + 5-day cards.

Derived values:
- temp, feelsLike, windSpeed are rounded.
- rainChance currently uses cloud cover percentage.
- Forecast picks one item every 8 list entries (roughly daily points).

Example logic:

```jsx
const apiKey = import.meta.env.VITE_WEATHER_KEY;
if (!apiKey) {
  setError('Weather API key not configured');
  setLoading(false);
  return;
}
```

---

## 4) Dashboard component and chart pipeline (real)

### VisitorStatsDashboard
File: week15/term-project/client/src/components/dashboard/VisitorStatsDashboard.jsx

State:
- data
- loading
- error

On mount:
- Builds apiBase from VITE_API_BASE_URL or window.location.origin.
- Fetches three endpoints in parallel via Promise.all:
  - /api/tourism
  - /api/us-regions
  - /api/tourism/market-share

Transforms:
- months from tourism month fields
- arrivals from tourism arrivals fields
- expenditures from tourism expenditure fields
- avgSpending = rounded average of expenditures
- usRegionTotals reduced across all monthly US region rows

Then renders:
- ArrivalsByMonth (bar chart)
- PlaceOfOrigin (pie chart)
- USRegionsChart (pie chart)
- SpendingCard (stat tile)

### ArrivalsByMonth
File: week15/term-project/client/src/components/dashboard/ArrivalsByMonth.jsx

- Chart.js Bar chart via react-chartjs-2.
- Props: months, arrivals.

### PlaceOfOrigin
File: week15/term-project/client/src/components/dashboard/PlaceOfOrigin.jsx

- Pie chart.
- Props: placeData object.
- Uses object keys as labels and values as series.

### USRegionsChart
File: week15/term-project/client/src/components/dashboard/USRegionsChart.jsx

- Pie chart.
- Props: regionsData object.
- Legend positioned at bottom.

### SpendingCard
File: week15/term-project/client/src/components/dashboard/SpendingCard.jsx

- Simple presentational card.
- Uses spending.toLocaleString() for formatted currency text.

---

## 5) Actual backend routes powering the frontend

### Main server
File: week15/term-project/server.js

Frontend-relevant API routes:
- GET /api/tourism
- GET /api/tourism/market-share
- GET /api/tourism/:month
- GET /api/us-regions
- GET /api/us-regions/:month

Property routes:
- GET /api/properties
- GET /api/properties/:id
- POST /properties/:id/reviews

Admin/auth route mounting:
- app.use('/admin', authRoutes)
- app.use('/admin', adminRoutes)

Note:
- There is a catch-all route that serves client/dist/index.html for non-API and non-admin paths.

### Auth routes
File: week15/term-project/routes/auth.js

- Local register/login with express-validator.
- Google OAuth routes:
  - GET /admin/auth/google
  - GET /admin/auth/google/callback
- Logout route (GET and POST) clears session/cookie.

### Admin routes
File: week15/term-project/routes/admin.js

- router.use(isAuthenticated) protects all admin routes.
- GET /admin/dashboard loads properties and total review count, then renders admin-dashboard view.

---

## 6) High-confidence walkthrough script you can present

1. Start at App and explain mode switching.
2. Show how property data is passed as props into section components.
3. Show WeatherDisplay useEffect and environment-key guard.
4. Show VisitorStatsDashboard Promise.all fetch and transform pipeline.
5. Show chart child components as pure presentational units.
6. Show server endpoints that feed dashboard data.
7. Show auth and admin-protected dashboard route.

This path is fully grounded in existing files in this workspace.
