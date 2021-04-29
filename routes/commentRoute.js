'use strict';

const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

/*router
  .route("/")
  .get(commentController.getComments)
  .put(commentController.addComment)
  .delete(commentController.deleteComment);
*/

router.post('/', commentController.addComment);

module.exports = router;


