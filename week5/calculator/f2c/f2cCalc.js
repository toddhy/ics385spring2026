//load modules
const express = require("express");
const bodyParser = require("body-parser");

//create app object
const app = express();

// not sure what this does?
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

  // computes celsius from given farenheit
  var cels = (far - 32) * 5 / 9;

  //display the result in 2 decimal places
  res.send("Celsius is " + cels.toFixed(2));
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
