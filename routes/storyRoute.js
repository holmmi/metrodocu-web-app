'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const storyController = require('../controllers/storyController');
const storyValidator = require('../validators/storyValidator');

router.get("/visibility", storyController.visibility);

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/gif') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const testFile = (req, res, next) => {
  if (req.file) {
    next();
  } else {
    res.status(400).json({errors: 'file is not image'});
  }
};

const upload = multer({dest: 'uploads/', fileFilter});

router.get('/', storyController.getStories);
router.post('/',
    storyValidator.validateStory,
    upload.single('cover'),
    testFile,
    storyController.make_cover,
    storyController.addStory);
router.post('/like', storyController.likeStory);

router.get('/:id', storyController.getStory);
router.put('/:id', storyController.updateStory);
router.delete('/:id', storyController.deleteStory);

module.exports = router;