# QR Code Generator

What I learned: I learned how to generate text and images to hardrive, and how to use javascript so to get user input and display
images within html. I used AI extensively and am not confident I could reproduce it myself, but will try to learn better.

--------------

This code runs a server using Express, which is then acessed through public/index.html to create a page in browser that the user
can generate a QR code with.

To run, first navigate to qrcode directory and install dependencies:

```
npm install inquirer
npm install qr-image
npm install express
```
Then start the server:

```
node server.js
```

Now in a browser, type in the following url to use generator:

```
http://localhost:3000
```