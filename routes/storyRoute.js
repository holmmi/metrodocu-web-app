'use strict';

const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');

router.get("/visibility", storyController.visibility);

module.exports = router;