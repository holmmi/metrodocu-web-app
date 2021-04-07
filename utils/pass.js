'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/userModel');

passport.use(new LocalStrategy({usernameField: "email", passwordField: "password"}, (username, password, done) => {
    const user = userModel.getUserByEmailAndPassword(username, password);
    if (user) {
        return done(null, user);
    } else {
        return done(null, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = userModel.getUserById(id);
    if (user) {
        done(null, user);
    } else {
        done(null, false);
    }
});

module.exports = passport;