'use strict';

const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

router.get("/", (req, res) => {
    res.render("statistics", {
        loggedIn: req.user ? true : false
    });
});

router.get("/likers", statisticsController.topLikers);

router.get("/commenters", statisticsController.topCommenters);

router.get("/storylikes", statisticsController.topLiked);

router.get("/storycomments", statisticsController.topCommented);

module.exports = router;