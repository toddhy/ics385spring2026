/*
Name: Todd Yoshioka
Date: 2/4/26
Class: ICS 385
Notes: This code is entirely generated using Claude Haiku 4.5. I also asked it to write instructive comments so I can learn from them.
It is a node.js server that uses qr-image library to generate QR code image which is accessed by index.html. It also uses express
to handle HTTP requests.
*/

/* Import statements - these load external packages we'll use in this program */
import express from "express";
/* Express is a framework that makes it easy to create web servers and handle routes */
import qr from "qr-image";
/* qr-image is a library that can generate QR code images from text or URLs */
import fs from "fs";
/* fs is Node.js's built-in File System module for reading and writing files */

/* Create an Express application instance - this is the core of our web server */
const app = express();
/* Set the port number where the server will listen for incoming requests */
const PORT = 3000;
/* Port 3000 means the server will be accessible at http://localhost:3000 */

/* MIDDLEWARE - these are functions that process requests before they reach our routes */
/* Serve static files from the "public" folder (HTML, CSS, images, etc.) */
app.use(express.static("public"));
/* This allows browsers to request files like /public/index.html automatically */

/* Enable parsing of JSON data from request bodies */
app.use(express.json());
/* When the HTML form sends JSON data via fetch(), this middleware parses it so we can use it */

/* GET ROUTE - handles requests to http://localhost:3000/ */
app.get("/", (req, res) => {
  /* req = the request object (contains data FROM the client) */
  /* res = the response object (lets us send data BACK to the client) */
  
  /* Send the HTML file to the browser when user visits the homepage */
  res.sendFile(new URL("./public/index.html", import.meta.url).pathname);
  /* import.meta.url gives us the current file path in ES6 modules */
});

/* POST ROUTE - handles requests to http://localhost:3000/generate-qr */
/* POST is used when sending data TO the server (vs GET which just retrieves data) */
app.post("/generate-qr", (req, res) => {
  /* Extract the URL from the JSON data sent by the browser */
  const url = req.body.url;
  /* req.body contains the data sent in the POST request */

  /* Check if URL was provided - if not, send an error response */
  if (!url) {
    /* res.status(400) means "Bad Request" - the client made an error */
    return res.status(400).json({ error: "URL is required" });
    /* return stops the function execution here, preventing further code from running */
  }

  /* TRY-CATCH block: attempts to run code and catches any errors that occur */
  try {
    /* Generate a QR code image from the URL using the qr-image library */
    const qr_image = qr.image(url, { type: "png" });
    /* qr.image() creates a stream (not a file yet, just the image data in memory) */
    /* { type: "png" } specifies that we want the output as a PNG image file */

    /* Save the QR code to a file on the server */
    qr_image.pipe(fs.createWriteStream("qr_img.png"));
    /* .pipe() is like a water pipe - it sends the image data directly to the file */
    /* fs.createWriteStream() creates a new file and writes data to it */

    /* Also save the URL text to a text file for reference */
    fs.writeFile("URL.txt", url, (err) => {
      /* fs.writeFile() writes text content to a file */
      /* If an error occurs, it's passed to the callback function */
      if (err) console.error("Error saving URL:", err);
      /* console.error() prints error messages to the terminal */
    });

    /* Convert the QR code image to Base64 format for displaying in HTML */
    /* Base64 is a way to encode binary data as text, so we can embed images in HTML */
    const chunks = [];
    /* chunks is an array that will store pieces of the image data */
    
    /* Create a fresh QR code stream since the first one was already piped to a file */
    const qr_stream = qr.image(url, { type: "png" });
    
    /* Listen for "data" events - fires when a piece of image data is ready */
    qr_stream.on("data", (chunk) => chunks.push(chunk));
    /* chunk is a piece of the binary image data; we push it to our array */
    
    /* Listen for "end" event - fires when all image data has been sent */
    qr_stream.on("end", () => {
      /* Combine all the chunks into one complete image buffer */
      const buffer = Buffer.concat(chunks);
      /* A Buffer is Node.js's way of handling binary data */
      
      /* Convert the binary data to a Base64 string */
      const base64 = buffer.toString("base64");
      /* Base64 string starts with "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" */
      
      /* Send the QR code back to the browser as JSON */
      res.json({ success: true, qrCode: `data:image/png;base64,${base64}` });
      /* The "data:image/png;base64," prefix tells the browser this is a PNG image encoded in Base64 */
      /* The browser can display this directly in an <img> tag without needing a separate file */
    });
    
    /* Handle any errors that occur during streaming */
    qr_stream.on("error", (error) => {
      res.status(500).json({ error: "Failed to generate QR code: " + error.message });
      /* res.status(500) means "Internal Server Error" - something went wrong on our end */
    });
  } catch (error) {
    /* This catches errors that happen in the try block above */
    res.status(500).json({ error: "Failed to generate QR code: " + error.message });
    /* Send an error message back to the browser */
  }
});

/* Start the server and listen for incoming requests */
app.listen(PORT, () => {
  /* The callback function runs once the server successfully starts */
  console.log(`Server running at http://localhost:${PORT}`);
  /* Print a message to the terminal so we know the server is running */
});
