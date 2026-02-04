/*
Name: Todd Yoshioka
Class: ICS 385
Notes: Installed popular movie and famous last word modules using npm. Loaded modules and used their functions to get
outputs which were stored in variables. The contents of these variables were printed to console, displayed on http page, 
and written into their own text files.
*/


//jshint esversion:6

//Call Modules
const superheroes = require('superheroes');
const supervillains = require('supervillains');
const famousLastWords = require('famous-last-words');
const popMovieQuotes = require('popular-movie-quotes');
const Quote = require('inspirational-quotes');

//Store module function outputs into variables
var mySuperHeroName = superheroes.random();
var mySuperVillainName = supervillains.random();
var myMovieQuote = popMovieQuotes.getRandomQuote();
var lastWord = famousLastWords[16];
var myQuote = Quote.getRandomQuote();

//Print variables
console.log(mySuperHeroName);
console.log(mySuperVillainName);
console.log(myQuote);
console.log(myMovieQuote);
console.log(lastWord);

//Call fs module and use it to write variables to separate text files.
const fs = require("fs");
fs.writeFileSync("file1.txt", "Super Hero: " + mySuperHeroName);
fs.writeFileSync("file2.txt", "Super Villain: " + mySuperVillainName);
fs.writeFileSync("file3.txt", "Quote of the day: " + myQuote);
fs.writeFileSync("file4.txt", "Movie Quote: " + myMovieQuote);
fs.writeFileSync("file5.txt", "Famous Last Words: " + lastWord);


// creates a local web server and displays the above variables
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end("Super Hero: " + mySuperHeroName + "\nSuper Villain: " + mySuperVillainName + "\nQuote of the Day " + myQuote  + "\nMovie Quote" + myMovieQuote + "\nFamous Last Words:" + lastWord);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});