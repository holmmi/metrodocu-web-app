'use strict';

const {check, validationResult} = require('express-validator');
const https = require('https');

const validateStory = [
  check("storyName")
  .trim()
  .escape()
  .notEmpty()
  .withMessage("First name cannot be empty.")
  .bail(),
  check("storyDesc")
  .trim()
  .escape()
  .notEmpty()
  .withMessage("Last name cannot be empty.")
  .bail(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    next();
  }
];

module.exports = {
  validateStory
};