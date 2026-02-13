const express = require('express');
const app = express();
const port = 3000;

// define route for GET requests to root URL
app.get('/', (req, res) => {
    res.send("Hello, world!");
})

//respond to POST request on root route
app.post('/', (req, res) => {
    res.send('Post request to homepage');
})

// Respond to GET on /about route
app.get('/about', (req, res) => {
    res.send('About page');
})

//catch all other routes
app.all(/.*/, (req, res) => {
    res.status(404).send('404 page not found');
})

//start server
app.listen(port, () => {
    console.log(`app listening at localhost:${port}`)
})
