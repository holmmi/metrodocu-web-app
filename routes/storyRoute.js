'use strict';

const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const storyValidator = require('../validators/storyValidator');

router.get("/visibility", storyController.visibility);

router.post("/new", storyValidator.validateStory, storyController.addStory);

router
  .route("/:id")
  .get(storyController.getStory)
  .put(storyController.updateStory)
  .delete(storyController.deleteStory);

module.exports = router;