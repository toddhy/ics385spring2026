
**Week 13 - Weather & Dashboard Updates**

Added in week13 term project (see week13/README.md for details)

---

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
