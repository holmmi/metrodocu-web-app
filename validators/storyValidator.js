'use strict';

const {check, validationResult} = require('express-validator');

const validateStory = [
  check("sname")
    .trim()
    .notEmpty()
    .withMessage("Story name cannot be empty.")
    .bail()
    .isLength({max: 50})
    .withMessage("Story name can be only 50 characters long.")
    .bail(),
  check("sdescription")
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty.")
    .bail()
    .isLength({max: 200})
    .withMessage("Only 200 charactes allowed in description.")
    .bail(),
  check("svisibility")
    .isNumeric()
    .withMessage("Please set correct visibility.")
    .bail(),
  check("files")
    .isArray({min: 1, max: 1})
    .withMessage("File(s) were sent in invalid format.")
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    next();
  }
];

const validateStoryUpdate = [
  check("sname")
    .trim()
    .notEmpty()
    .withMessage("Story name cannot be empty.")
    .bail()
    .isLength({max: 50})
    .withMessage("Story name can be 50 characters long.")
    .bail(),
  check("sdescription")
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty.")
    .bail()
    .isLength({max: 200})
    .withMessage("Only 200 charactes allowed in description.")
    .bail(),
  check("svisibility")
    .isNumeric()
    .withMessage("Please set correct visibility.")
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    next();
  }
];

module.exports = {
  validateStory,
  validateStoryUpdate
};