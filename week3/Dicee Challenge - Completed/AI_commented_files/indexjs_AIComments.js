// indexjsAIComments.js
// Beginner-friendly, commented version of the original index.js

// Generate a random integer from 1 to 6 inclusive.
// Math.random() produces a number in [0, 1). Multiplying by 6 gives [0, 6).
// Math.floor(...) drops the fractional part, giving 0..5. Adding 1 shifts to 1..6.
var randomNumber1 = Math.floor(Math.random() * 6) + 1; // 1-6

// Build the filename for the dice image corresponding to the random number.
// If randomNumber1 is 3, randomDiceImage becomes "dice3.png".
var randomDiceImage = "dice" + randomNumber1 + ".png"; // dice1.png - dice6.png

// Prepend the folder path to form the full image source path.
// This assumes your dice images live in an "images" folder next to the HTML file.
var randomImageSource = "images/" + randomDiceImage; // images/dice1.png - images/dice6.png

// Select the first <img> element on the page and set its "src" attribute
// to the image we just constructed so the image displayed matches the roll.
var image1 = document.querySelectorAll("img")[0];
image1.setAttribute("src", randomImageSource);


// Repeat the same steps for the second dice image.
var randomNumber2 = Math.floor(Math.random() * 6) + 1;
var randomImageSource2 = "images/dice" + randomNumber2 + ".png";
document.querySelectorAll("img")[1].setAttribute("src", randomImageSource2);

// And again for a third dice (this project shows three images on the page).
var randomNumber3 = Math.floor(Math.random() * 6) + 1;
var randomImageSource3 = "images/dice" + randomNumber3 + ".png";
document.querySelectorAll("img")[2].setAttribute("src", randomImageSource3);

// Decide which player won by comparing the random numbers.
// NOTE: the original logic below only compares player 1 and player 2.
// With three dice (randomNumber1, randomNumber2, randomNumber3) you may
// want to adjust the comparisons to consider all three players.

// If player 1's number is greater than player 2's number, show player 1 wins.
if (randomNumber1 > randomNumber2) {
  document.querySelector("h1").innerHTML = "🚩 Play 1 Wins!";
}
// Otherwise if player 2's number is greater than player 1's number, show player 2 wins.
else if (randomNumber2 > randomNumber1) {
  document.querySelector("h1").innerHTML = "Player 2 Wins! 🚩";
}
// If neither of the above is true, the code treats it as a draw between those two.
else {
  document.querySelector("h1").innerHTML = "Draw!";
}


// Helpful tip for beginners:
// To check whether randomNumber1 is larger than BOTH randomNumber2 and randomNumber3,
// use the logical AND operator (&&) to require both conditions to be true.
// Example (commented out so it doesn't change behavior):

// if (randomNumber1 > randomNumber2 && randomNumber1 > randomNumber3) {
//   document.querySelector("h1").innerHTML = "🚩 Play 1 Wins (largest of three)!";
// }

// Explanation: The expression on the left of && and the expression on the right
// of && must both be true for the whole condition to be true. That guarantees
// randomNumber1 is greater than randomNumber2 AND greater than randomNumber3.

// Another note for completeness: when comparing three players, you may also want
// to handle ties specially (e.g., two players tie for the highest). That requires
// additional checks, for example using equality checks (== or ===) to detect ties.
