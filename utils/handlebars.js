'use strict';

const exphbs  = require('express-handlebars');
const hbs = exphbs.create({});

hbs.handlebars.registerHelper("notEmpty", (array) => array.length > 0);
hbs.handlebars.registerHelper("length", (array) => array.length);

module.exports = hbs;