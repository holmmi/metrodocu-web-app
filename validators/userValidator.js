'use strict';

const {check, validationResult} = require('express-validator');
const https = require('https');

const validateRegistration = [
    check("fname")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("First name cannot be empty.")
        .bail(),
    check("lname")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Last name cannot be empty.")
        .bail(),
    check("username")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Username cannot be empty.")
        .bail()
        .isLength({min: 5})
        .withMessage("Username has to be five characters long.")
        .bail(),
    check("password")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })
        .withMessage("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one symbol and one number"),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        try {
            const response = await validateCaptchaToken(req.body.token);
            if (!response.success) {
                return res.status(401).json({error: "Bad captcha"});
            }
        } catch (error) {
            console.error(error);
        }
        next();
    }
];

const validateCaptchaToken = token => {
    const requestBody = `${encodeURI('secret')}=${encodeURI(process.env.CAPTCHA_SECRET)}&${encodeURI('response')}=${encodeURI(token)}`;
    return new Promise((resolve, reject) => {
        let rawData = "";
        const request = https.request({
            hostname: "www.google.com",
            port: 443,
            path: "/recaptcha/api/siteverify",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }, res => {
            res.on("data", data => {
                rawData += data;
            });
            res.on("end", () => {
                resolve(JSON.parse(rawData));
            });
            res.on("error", err => {
                reject(err);
            });
        });
        request.write(requestBody);
        request.end();
    });
};

module.exports = {
    validateRegistration
};