'use strict';
const commentModel = require('../models/commentModel');
const storyModel = require('../models/storyModel');



/*const getComments = async (req, res) => {
  const user = req.user ? true : false;
  const userId = user ? req.user.user_id : false;
  const storyVisibility = story ? await storyModel.getStoryVisibility(userId,req.params.id) : false;

  const userAccess = checkUserAccess(storyVisibility, userId);

  if (userAccess) {
    const comments= commentModel.getComments;
    res.json
  } else {
    res.status(401).json({error: "Unauthorized"});
  }
};*/

const addComment = async (req, res) => {
  console.log(req.body);
  const user = req.user ? true : false;
  const userId = user ? req.user.user_id : false;
  const storyVisibility = await storyModel.getStoryVisibility(userId,req.body.storyId);

  const userAccess = checkUserAccess(storyVisibility, userId);

  if (userAccess) {
    const insertId = await commentModel.addComment(userId, req.body.storyId, req.body.comment);
    res.json({storyId: insertId});
  } else {
    res.status(401).json({error: "Unauthorized"});
  }


}

const checkUserAccess = (storyVisibility, userId) => {
  if(!storyVisibility) {
      return false;
  } else if(storyVisibility.visibility_id === 1) {
      console.log("Story public");
      return true;
  } else if(storyVisibility.visibility_id === 2 && userId === storyVisibility.owner_id) {
      console.log("Story owner access");
      return true;
  } else if(storyVisibility.visibility_id === 3 && storyVisibility.user_id === userId) {
      console.log("Story shared access");
      return true;
  } else {
      return false;
  }
};

module.exports = {
  addComment,
};