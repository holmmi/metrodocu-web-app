'use strict';

const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');

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

router.get("/search", viewController.search);

router.get("/stories", (req, res) => {
    res.render("stories", {
        loggedIn: req.user ? true : false
    });
})

router.get("/stories/create-story", (req, res) => {
    if (req.user) {
        res.render("create-story", {loggedIn: true});
    } else {
        res.status(401).render("not-found");
    }
})

router.use((req, res, next) => {
    res.status(404).render("not-found", {
        loggedIn: req.user ? true : false
    });
});

module.exports = router;