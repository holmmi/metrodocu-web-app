'use strict';

const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const storyValidator = require('../validators/storyValidator');

router.get("/visibility", storyController.visibility);

router.post("/new", storyValidator.validateStory, storyController.addStory);

router.get("/:storyId/document/:documentId", storyController.checkStoryAccessRights, storyController.getDocument);

router.get("/:storyId/cover/:fileName", storyController.checkStoryAccessRights, storyController.getCover);

router
  .route("/like/:storyId")
  .post(storyController.checkStoryAccessRights, storyController.addLike);

router
  .route("/upload/:storyId")
  .post(storyController.storyOwnerAccessCheck, storyController.uploadDocument);

router
  .route("/:storyId/comment")
  .get(storyController.checkStoryAccessRights, storyController.getComments)
  .post(storyController.checkStoryAccessRights, storyController.addComment);

router.delete("/comment/:commentId", storyController.deleteComment);

router
  .route("/:storyId")
  .get(storyController.checkStoryAccessRights, storyController.getStory)
  .patch(storyController.storyOwnerAccessCheck, storyValidator.validateStoryUpdate, storyController.updateStory)
  .delete(storyController.deleteStory);

router.get("/", storyController.getStories);

module.exports = router;