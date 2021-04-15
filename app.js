'use strict';

require('dotenv').config();
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const passport = require('./utils/pass');
const exphbs  = require('express-handlebars');
//const bodyParser = require('body-parser');

const authRoute = require('./routes/authRoute');

const app = express();

// Handlebars view engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Parse submitted form and JSON bodies
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors());

// Serve static files
app.use(express.static("./public/"));

// Configuration of routes
app.use("/auth", authRoute);
//TODO: recognise if the user is logged in and render accordingly
app.get("/", (req, res) => {
    res.render("home", {
        loggedIn: false
    });
});
//const port = 3000;
//app.listen(port, () => console.log(`Example app listening on port ${port}!`));

//Enable HTTPS server
require('./server')(process.env.HTTP_PORT, process.env.HTTPS_PORT, app);