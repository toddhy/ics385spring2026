# QR Code Generator

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