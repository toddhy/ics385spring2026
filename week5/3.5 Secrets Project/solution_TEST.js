/*
Name: Todd Yoshioka
Class: ICS 385
Notes: Moved hardcoded password to a .env file. That file is added to .gitignore so that it's not uploaded to 
github or other repository. The module dotenv is imported to enable this functionality. 
*/

import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
// Load environment variables from .env file
// This keeps sensitive data (like passwords) out of your source code
import dotenv from "dotenv";
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

var userIsAuthorised = false;

app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to check if the submitted password matches the one in .env
// Uses process.env.PASSWORD instead of hardcoding the password
function passwordCheck(req, res, next) {
  const password = req.body["password"];
  // Compare user input against the PASSWORD from .env file
  if (password === process.env.PASSWORD) {
    userIsAuthorised = true;
  }
  next();
}
app.use(passwordCheck);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/check", (req, res) => {
// If password correct, send to secret.html.
  if (userIsAuthorised) {
    res.sendFile(__dirname + "/public/secret.html");
  } else {
// Otherwise, back to index.html.
    res.sendFile(__dirname + "/public/index.html");
    //Alternatively res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
