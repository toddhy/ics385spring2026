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

---
Week 14 - Authentication

Authentication layer added using Passport.js and MongoDB Atlas.
- Admin Email: admin@myhawaiiapp.com
- Models: User.js added with bcrypt password hashing.
- Middleware: isAuthenticated.js route guard implemented.
- Routes: /admin/login, /admin/logout, and protected /admin/dashboard.
- Dependencies added: passport, passport-local, express-session, connect-mongo, bcrypt.
EJS templates in the views/ folder.

To start the server, cd to week10/term-project. Then npm start. Site is then accessible at url http://localhost:3000