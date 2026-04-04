Week 10 of term project.

I chose a vacation rental in Pukalani targetting Honeymooners as my property for the project.

A MongoDB schema for the project is in models/Proerty.js
A script inserting 5 sample properties is in scripts/seed.js
This uses a .env file to point to a database to inject into.

---
Week 11

Express server implemented in server.js. It contains routes:
GET /properties
GET /properties/:id
POST /properties/:id/reviews
GET /api/properties
GET /api/properties/:id

Mongoose schema created for user rating of properties. It has the fields guestName, rating, comment, date. 
Mongoose query operators to filter properties by rating. 
EJS templates in the views/ folder.

To start the server, cd to week10/term-project. Then npm start. Site is then accessible at url http://localhost:3000