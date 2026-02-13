/*
Name: Todd Yoshioka
Class: ICS 395
Notes: Uses Express to first read index.html using GET, then takes user input from page and calculates Farenheit
to Celsius. Answer is converted to integer and sent to page at /f2c/ using POST. It's displayed there for user to read. 
*/

//load modules
const express = require("express");
const bodyParser = require("body-parser");

//create app object
const app = express();

// Not sure what bodyparser does, need to read docs. When I remove it I get errors.
app.use(bodyParser.urlencoded({extended: true}));

//this sends the html file to the web page using the root directory
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html")
});

// handles the F2C form submission
// loads subpage url /f2c/ when button is pushed
app.post("/f2c/", function (req, res) {

  //converts the string input to a float number
  //Captures string from the "Far" name in body of index.html
  var far = parseFloat(req.body.Far);

  // computes celsius from given farenheit and converts to integer
  var cels = (far - 32) * 5 / 9;
  var cels = Math.round(cels);

  //display the result to /f2c/
  res.send("Conversion to Celsius is " + cels);
});

//start express server
app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
