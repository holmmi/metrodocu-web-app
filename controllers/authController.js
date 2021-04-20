'use strict';

const passport = require('../utils/pass');
const userModel = require('../models/userModel');
const fs = require('fs');
const privateKey = fs.readFileSync("secrets/jwt.key");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const checkLogin = (req, res, next) => {
    passport.authenticate("jwt", {session: false}, async (err, user) => {
        if (!err && user) {
            req.user = user;
        }
        next();
    })(req, res, next);
};

const check_availability = async (req, res) => {
    try {
        res.json({available: await userModel.checkIfUserExists(req.query.username ? req.query.username : "")});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const register = async (req, res, next) => {
    try {
        const {username, fname, lname} = req.body;
        const password = await bcrypt.hash(req.body.password, 10);
        await userModel.addUser([username, fname, lname, password]);
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
};

const login = ((req, res, next) => {
    passport.authenticate("local", {session: false}, async (err, user) => {
        if (!err) {
            if (user) {
                const token = jwt.sign({userId: user.user_id}, privateKey, {algorithm: "RS256", issuer: "Metropolia Ammattikorkeakoulu Oy", expiresIn: "1d"});
                res.cookie("token", token);
                return res.json({loggedIn: true});
            } else {
                return res.status(401).json({error: "Invalid login credentials"});
            }
        } else {
            return res.status(500).json({error: "Internal Server Error"})
        }
    })(req, res, next);
});

const log_out = (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
};

module.exports = {
    checkLogin,
    check_availability,
    register,
    login,
    log_out
};