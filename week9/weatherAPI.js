/*
Name: Todd Yoshioka
Class: ICS 385
Notes: Fetch data from OpenWeatherMap using latitude and longitude coordinates of Wailuku. API key from site
is stored in .env file and provided via dotenv package.
*/

require('dotenv').config();

const latitude = 20.88988;
const longitude = -156.512962;
const apiKey = process.env.API_KEY;

const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

fetch(url) // make http request to above url
  .then(x => x.json()) // convert text response to javascript object
  .then(y => myDisplay(y)); // send object to myDisplay function

//takes object from above code block and prints out required fields
function myDisplay(data) {
  //console.log(data);
  console.log("Weather for Wailuku, Hawaii.")
  console.log("Description: " + data.weather[0].description);
  console.log("Temp: " + data.main.temp);
  console.log("Icon: " + data.weather[0].icon);
  console.log("Humidity: " + data.main.humidity);
  console.log("Wind Speed: " + data.wind.speed);
  console.log("Cloudiness: " + data.clouds.all);
}