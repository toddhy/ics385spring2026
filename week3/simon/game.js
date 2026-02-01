// Simon game - beginner-friendly comments
// This JavaScript controls a simple "Simon" memory game.
// Read from top to bottom: first we set up data, then listeners, then functions.

// Four colors the game uses. Think of this as the set of possible buttons.
var buttonColours = ["red", "blue", "green", "yellow"];

// The sequence the game creates and expects the player to repeat.
// Each round the game adds one color to this array.
var gamePattern = [];

// The sequence of colors the user has clicked during the current round.
// We compare this with gamePattern to see if the user is correct.
var userClickedPattern = [];

// Has the game started yet? This prevents restarting in the middle.
var started = false;

// Which level (round) the player is on. Starts at 0 and increases.
var level = 0;

// ------------------------------
// Start the game when the user presses any key on the keyboard.
// This uses jQuery's keypress listener. The function inside runs once per keypress.
// We only start the first time a key is pressed (when started === false).
$(document).keypress(function() {
  if (!started) {
    // Show the current level in the heading so the player sees feedback.
    $("#level-title").text("Level " + level);
    // Begin the first sequence.
    nextSequence();
    // Mark the game as started so this block doesn't run again until restart.
    started = true;
  }
});

// ------------------------------
// When a colored button is clicked, record the user's choice.
// Each button has an id that matches its color ("red", "blue", etc.).
$(".btn").click(function() {
  // `this` is the clicked DOM element; jQuery .attr('id') gets its id string.
  var userChosenColour = $(this).attr("id");

  // Add the chosen color to the user's current pattern.
  userClickedPattern.push(userChosenColour);

  // Give immediate feedback: sound and a visual press effect.
  playSound(userChosenColour);
  animatePress(userChosenColour);

  // Check whether the user's most recent click is correct.
  // Pass the index of the new item (length - 1).
  checkAnswer(userClickedPattern.length - 1);
});

// ------------------------------
// checkAnswer compares the user's pattern to the game's pattern.
// currentLevel is the index we want to check right now.
function checkAnswer(currentLevel) {
  // If the most recent click matches the game's color at this index...
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    // If the user has finished entering the whole sequence for this round,
    // wait a second and then go to the next round.
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function() {
        nextSequence();
      }, 1000);
    }
  } else {
    // The user made a mistake: play a "wrong" sound and flash the screen.
    playSound("wrong");
    $("body").addClass("game-over");
    $("#level-title").text("Game Over, Press Any Key to Restart");

    // Remove the red flash after a short pause so the user can see it.
    setTimeout(function() {
      $("body").removeClass("game-over");
    }, 200);

    // Reset variables so the player can start over.
    startOver();
  }
}

// ------------------------------
// nextSequence creates the next step in the game's pattern.
function nextSequence() {
  // Clear the user's pattern so they can start entering the new round.
  userClickedPattern = [];

  // Increase level so the UI and difficulty reflect progress.
  level++;
  $("#level-title").text("Level " + level);

  // Pick a random number from 0 to 3 and use it to select a color.
  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];

  // Add this color to the game's pattern array.
  gamePattern.push(randomChosenColour);
  
  //---------
  // ***AI Generated code*** Changes the game so that the whole pattern sequence is repeated each round
  // rather than only the last element.
  //---------
  // Play the entire game pattern from the beginning.
  for (var i = 0; i < gamePattern.length; i++) {
    // Use an immediately-invoked function to preserve the value of i in the timeout.
    (function(index) {
      setTimeout(function() {
        var color = gamePattern[index];
        // Show the player the button by fading it (visual cue).
        $("#" + color).fadeIn(100).fadeOut(100).fadeIn(100);
        // Play the associated sound for that color.
        playSound(color);
      }, (index + 1) * 600);
    })(i);
  }
}

// ------------------------------
// animatePress briefly adds a CSS class to show the button was pressed.
function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function() {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

// ------------------------------
// playSound plays a short audio clip for the given name.
// The files are expected to be in the `sounds/` folder, e.g. sounds/red.mp3
function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

// ------------------------------
// startOver resets the game variables so the player can restart.
function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}
