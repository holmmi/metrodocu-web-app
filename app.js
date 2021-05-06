'use strict';

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('./utils/pass');
const hbs = require('./utils/handlebars');

const { checkLogin } = require('./controllers/authController');
const viewRoute = require('./routes/viewRoute');
const authRoute = require('./routes/authRoute');
const storyRoute = require('./routes/storyRoute');
const statisticsRoute = require('./routes/statisticsRoute');

const app = express();

// Handlebars view engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Parse JSON bodies
app.use(express.json({limit: "5MB"}));

// Serve static files
app.use(express.static("./public/"));
app.use("/covers", express.static("./uploads/covers/"));

// Cookies and Passport initilization
app.use(cookieParser());
app.use(passport.initialize());

// Try to make authentication based on JWT before any route
app.use(checkLogin);

// Configuration of routes
app.use("/auth", authRoute);
app.use("/story", storyRoute);
app.use("/statistics", statisticsRoute);
app.use(viewRoute);

// Enable HTTPS server
require('./server')(process.env.HTTP_PORT, process.env.HTTPS_PORT, app);