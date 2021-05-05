'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const fs = require('fs');
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({session: false}, async (username, password, done) => {
    try {
        const userDetails = await userModel.getUserByUsername(username);
        const groups = userDetails.map(userDetail => userDetail.group_id);
        const user = userDetails[0];
        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                delete user.password;
                delete user.group_id;
                return done(null, {...user, groups: groups});
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
        const userDetails = await userModel.getUserById(jwtPayload.userId);
        const groups = userDetails.map(userDetail => userDetail.group_id);
        const user = userDetails[0];
        delete user.password;
        delete user.group_id;
        return user ? done(null, {...user, groups: groups}) : done(null, false);
    } catch (error) {
        console.error(error);
        return done(error, false);
    }
}));

module.exports = passport;