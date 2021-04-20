'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const fs = require('fs');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({session: false}, async (username, password, done) => {
    try {
        const user = await userModel.getUserByUsername(username);
        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                delete user.password;
                return done(null, {...user});
            }
        }
        return done(null, false);
    } catch (error) {
        console.error(error);
        return done(error, false);
    }
}));

const cookieExtractor = req => {
    return req && req.cookies ? req.cookies["token"] : null;
};

passport.use(new JwtStrategy({
    secretOrKey: fs.readFileSync("secrets/jwt.crt"),
    jwtFromRequest: cookieExtractor,
    issuer: "Metropolia Ammattikorkeakoulu Oy",
    algorithms: ["RS256"]
}, async (jwtPayload, done) => {
    try {
        const user = await userModel.getUserById(jwtPayload.userId);
        delete user.password;
        return user ? done(null, {...user}) : done(null, false);
    } catch (error) {
        console.error(error);
        return done(error, false);
    }
}));

module.exports = passport;