'use strict';

const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const storyValidator = require('../validators/storyValidator');

router.get("/visibility", storyController.visibility);

router.post("/new", storyValidator.validateStory, storyController.addStory);

router.get("/:storyId/document/:documentId", storyController.checkStoryAccessRights, storyController.getDocument);

router
  .route("/like/:id")
  .post(storyController.addLike);

router
  .route("/upload/:id")
  .post(storyController.storyOwnerAccessCheck, storyController.uploadDocument);

router
  .route("/:storyId/comment")
  .get(storyController.checkStoryAccessRights, storyController.getComments)
  .post(storyController.checkStoryAccessRights, storyController.addComment);

router.delete("/comment/:commentId", storyController.deleteComment);

router
  .route("/:storyId")
  .get(storyController.checkStoryAccessRights, storyController.getStory)
  .put(storyController.checkStoryAccessRights, storyController.updateStory)
  .delete(storyController.checkStoryAccessRights, storyController.deleteStory);

router.get("/", storyController.getStories);

module.exports = router;