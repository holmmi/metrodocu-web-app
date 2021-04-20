'use strict';

const express = require('express');
const passport = require('../utils/pass');
const userValidator = require('../validators/userValidator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post("/register", userValidator.validateRegistration, authController.register, authController.login);
router.post("/login", authController.login);
router.get("/logout", authController.log_out);

module.exports = router;