/*
Name: Todd Yoshioka
Class: ICS 395
Notes: Uses Express to first read index.html using GET, then takes user input from page and calculates volume of 
a cylinder given height and radius. Answer is sent to page at /VolCalc/ using POST. It's rounded to 2 decimal places
and displayed as text for user to read. 
*/

//load modules
const express = require("express");
const bodyParser = require("body-parser");

//create app object
const app = express();

// I think bodyparser has something to do with converting captured string to float.
app.use(bodyParser.urlencoded({extended: true}));

//this sends the html file to the web page using the root directory
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html")
});

// handles the VolCalc form submission
// loads subpage url /VolCalc/ when button is pushed
app.post("/VolCalc/", function (req, res) {

  //converts the string input to a float number
  //Captures string from the height and radius values from body of index.html. Parser converts string to float?
  var rad = parseFloat(req.body.radius);
  var hgt = parseFloat(req.body.height);

  // computes volume of cylinder given height and radius 
  var vol = Math.PI * (rad ** 2) * hgt;

  //displays the result to /VolCalc/
  res.send("Volume of cylinder is " + vol.toFixed(2));
});

//start server
app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
