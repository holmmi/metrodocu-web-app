'use strict';

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('./utils/pass');
const exphbs  = require('express-handlebars');

const { checkLogin } = require('./controllers/authController');
const viewRoute = require('./routes/viewRoute');
const authRoute = require('./routes/authRoute');
const storyRoute = require('./routes/storyRoute');

const app = express();

// Handlebars view engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static("./public/"));

// Cookies and Passport initilization
app.use(cookieParser());
app.use(passport.initialize());

// Try to make authentication based on JWT before any route
app.use(checkLogin);

// Configuration of routes
app.use("/auth", authRoute);
app.use("/story", storyRoute);
app.use(viewRoute);

// Enable HTTPS server
require('./server')(process.env.HTTP_PORT, process.env.HTTPS_PORT, app);