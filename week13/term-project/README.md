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
