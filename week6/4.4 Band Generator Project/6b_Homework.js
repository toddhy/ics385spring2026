/*
Name: Todd Yoshioka
Course: ICS 385
Notes: Replaced noun and adj arrays with course_id and course_name arrays. Changed the variable names in the POST section to reflect the new array and variable
names. This still references "solution.ejs" to render the html, I just changed the displayed title in that page from band generator to course name generator. 
*/

import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("solution.ejs");
});

app.post("/submit", (req, res) => {
  const randomID = course_id[Math.floor(Math.random() * course_id.length)];
  const randomName = course_name[Math.floor(Math.random() * course_name.length)];
  res.render("solution.ejs", {
    course_id: randomID,
    course_name: randomName,
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const course_id = [
  "ICS 101",
  "ICS 301",
  "ICS 201",
  "ICS 117",
  "ICS 220",
  "ICS 385",
  "ICS 118",
];

const course_name = [
  "Digital Tools for the Information World",
  "Introduction to Programming",
  "Web Development",
  "Computer Forensics",
  "Database Design and Development",
  "Introduction to Computer Security",
  "Unix/Linux System Administration",
];
