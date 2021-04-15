'use strict';

const express = require('express');
const passport = require('../utils/pass');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.login);
router.get("/logout", authController.log_out);

module.exports = router;