/* 
    Name: Todd Yoshioka
    Date: 2/4/26
    Class ICS 385
    Notes: All comments are my own although I asked the AI to explain the code to me. Originally, the code is run from
    a terminal and writes files to current directory. It would be easier to use if this could be run from and html page instead.

1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";

inquirer
//display input prompt asking for URL
  .prompt([
    {
      message: "Type in your URL: ",
      name: "URL",
    },
  ])
  .then((answers) => {
    //store url that user typed
    const url = answers.URL;
    //generate QR code object
    var qr_svg = qr.image(url);
    //act on the newly made object. pipes the QR code into file named qr_image.png
    qr_svg.pipe(fs.createWriteStream("qr_img.png"));

    //Write the url to URL.txt, show error if write fails.
    fs.writeFile("URL.txt", url, (err) => {
      if (err) throw err;
    //Else is implied? Or not needed because error would stop flow.
      console.log("The file has been saved!");
    });
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
