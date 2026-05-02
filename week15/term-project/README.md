Maui Honeymoon Getaway Website

Full stack deployment of a website for a Maui vacation rental intended for honeymooners.

Live site: https://ics385spring2026-d4pg.onrender.com/

**Setup**

1. Clone the repository and open the project folder.
```bash
git clone https://github.com/toddhy/ics385spring2026.git
cd ics385spring2026/week15/term-project
```

2. Create the backend environment file.
- Copy `.env.example` to `.env` in `week15/term-project/`.
- Fill in `MONGO_URI`, `SESSION_SECRET`, `OPENWEATHER_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_CALLBACK_URL`.
- If you are not using Google login yet, you can still set the values to placeholders, but Google auth will not work until real credentials are added.

3. Create the frontend environment file.
- Copy `client/.env.example` to `client/.env`.
- Set `VITE_WEATHER_KEY` to your OpenWeatherMap API key.
- Keep `VITE_API_BASE_URL` pointed at the backend, usually `http://localhost:3000`.

4. Install dependencies.
```bash
npm install
npm install --prefix client
```

5. Start the app.
- Start both servers from the project root:
```bash
npm run dev
```
- Or run them separately:
```bash
npm start
npm run dev --prefix client
```

6. Open the local URLs.
- Frontend: `http://localhost:5173/`
- Backend: `http://localhost:3000/`
- Admin login: `http://localhost:3000/admin/login`

---

**Technology Stack**

**Frontend:**
- React 19 — UI library
- Vite — build tool and dev server
- Chart.js — data visualization

**Backend:**
- Node.js + Express — web framework
- Passport.js — authentication (Local + Google OAuth)
- Express-session + connect-mongo — session management
- Bcrypt — password hashing
- Helmet — security headers

**Database:**
- MongoDB — NoSQL database
- Mongoose — ODM library

**Deployment:**
- Render — hosting

**External Services:**
- OpenWeatherMap API — weather data
- Google OAuth — authentication

---

Test script located in tests/auth.test.js. Run with the command
```
npm test
```
**Test Results**

| Test | Status | Description |
|------|--------|-------------|
| AC-3 | ✓ PASS | Local sign-up creates a hashed user and redirects to /admin/dashboard |
| AC-4 | ✓ PASS | Local sign-in with correct credentials redirects and sets a session cookie |
| AC-5 | ✓ PASS | Mocked Google OAuth callback creates a Google user and redirects to /admin/dashboard |
| AC-6 | ✓ PASS | Protected dashboard redirects unauthenticated visitors to /admin/login |
| AC-7 | ✓ PASS | Logout clears the session and blocks the next dashboard request |

**Test Summary:** 5 passed, 5 total | All acceptance criteria met

---

**A.I. Attribution:** Gemini 3 Flash used to generate much of the code for this website. It also assisted in writing the installation, technology stack and test sections of this README.

**Weekly logs**

**Week 15**

Added Google OAuth which allows administrator to sign up and login using their google account instead of a password. Deployed page on render.com. 

**Week 14**

Added administrator authentication and login. Bcrypt added to the models\User.js file to salt the password prior to saving it as hash. Created isAuthenticated function in the middleware folder to check whether to let a user through to admin dashboard or else redirect them back to login page. This method is then useable by Passport.js to return true if the user is logged in or false otherwise. 

New routes /admin/dashboard and /admin/login added to server.js. Route logic for admin dashboard handled by admin.js file in routes folder. Logic for admin login is the same but has handler in routes/auth.js file. Both pages are rendered with ejs files in server/views/ folder.

The node module express-session is used to assign unique session IDs to users who log in. These are sent to the user's browser as cookies. On future requests, the user's browser sends the cookie back which allows the server to look up their data.

Another new node module used is connect-mongo. This allows sessions IDs to be stored in mongoDB rather than in ram. So if the server is restarted, it won't log out the admin. I'm using the cloud based mongoDB atlas, which I don't know if is a good idea because it relies on internet connection and their servers.

Administrator login name is admin@myhawaiiapp.com. The two sites are on different ports:
Main Property Site: http://localhost:5173/
Admin Login: http://localhost:3000/admin/login


**Week 13**

Added a weather dasboard to the marketing page. It makes calls to OpenWeatherMap API using coordinates for island of Maui and API key stored in .env file. It then displays the temperature, cloud cover, humidity and barometric pressure. Below that is a 5 day forecast with temperatures and chance of rain. The files are stored in src/components/dashboard/. They are named WeatherDisplay.jsx and Weather.css.

Also added a visitor statistics dashboard on a separate page because it seems more appropriate for property owner than for prospective visitors. Scripts were made to convert csv data into json, and insert into mongoDB using insertMany(). Model files TourismStatistics.js, and TourismMarketShare.js and USRegionsData.js define what the data should look like. The Express backend (server.js) then exposes the data through API routes such as /api/tourism and api/us-regions. Charts are made by passing data arrays to VisitorStatsDashboard.jsx, where Chart.js formats it into charts. This formatted data is sent to ArrivalsByMonth.jsx, PlaceOfOrigin.jsx, and USRegionsChart.jsx which draw the bar and pie charts.

Looking ahead, I need to make the administrator dashboard (which has the new charts) have authenticated access and ability to view and edit a calender of bookings. Will also need to implement ability for user to view a calender, make a booking, and then view or edit their booking details after it was made.

**Week 12**

Transitioning from EJS to React jsx. Still using Express and MongoDB servers that were set up in week 11. The express backend server runs on port 3000, react frontend runs 5173 with vite. The two communicate through fetch() calls to the API. Page displays property details, name, island, description, amenities, reviews and ratings.

Sections of the page have been created as components in src/components directory. They consist of Header, Hero Section, About, Amenities, CTA, and Footer. Each one has an accompanying .css file for it. Claude 4.5 Haiku was used to generate code.

To run server:
```
cd week11/term-project
npm start

cd week12/term-project/my-hawaii-app
npm run dev
```
---
**Week 11**

Express server implemented in server.js. It contains routes:
GET /properties
GET /properties/:id
POST /properties/:id/reviews
GET /api/properties
GET /api/properties/:id

Mongoose schema created for user rating of properties. It has the fields guestName, rating, comment, date. 
Mongoose query operators to filter properties by rating. 
EJS templates in the views/ folder.

---
**Week 10**

I chose a vacation rental in Pukalani targetting Honeymooners as my property for the project.

A MongoDB schema for the project is in models/Proerty.js
A script inserting 5 sample properties is in scripts/seed.js
This uses a .env file to point to a database to inject into.

---
