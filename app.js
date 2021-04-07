'use strict';

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./utils/pass');
const exphbs  = require('express-handlebars');

const authRoute = require('./routes/authRoute');

const app = express();

// Handlebars view engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Parse submitted form and JSON bodies
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Serve static files
app.use(express.static("./public/"));

// Session and Passport initilization
app.use(session({
    secret: "YouNeverKnow2021",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        maxAge: 1000 * 60 * 60,
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Configuration of routes
app.use("/auth", authRoute);
app.get("/", (req, res) => {
    res.render("home", {
        loggedIn: req.user ? true : false
    });
});

// Enable HTTPS server
require('./server')(process.env.HTTP_PORT, process.env.HTTPS_PORT, app);