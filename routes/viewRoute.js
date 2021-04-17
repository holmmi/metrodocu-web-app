'use strict';

const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render("home", {
        loggedIn: req.user ? true : false
    });
});
router.get("/register", (req, res) => {
    res.render("register", {
        loggedIn: req.user ? true : false
    });
});

module.exports = router;