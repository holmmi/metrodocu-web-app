'use strict';
const storyModel = require('../models/storyModel');

const showStory = async (req, res, next) => {
  console.log('showStory: http get story with path param', req.params);
  const story = await storyModel.getStoryById(req.params.id);
  const user = req.user ? true : false;
  const userId = user ? req.user.user_id : null;
  const storyVisibility = userId ? await storyModel.getStoryVisibility(userId,req.params.id) : false;

  console.log("storyVisibility",storyVisibility);

  if(storyVisibility.visibility_id === 1) {
    console.log("Story public");
    renderStory(req,res,story);
  } else if(storyVisibility.visibility_id === 2 && userId === storyVisibility.owner_id) {
    console.log("Story owner access");
    renderStory(req, res, story);
  } else if(storyVisibility.visibility_id === 3 && storyVisibility.user_id === userId) {
    console.log("Story shared access");
    renderStory(req, res, story);
  } else {
    notFound(req,res);
  }
};

const renderStory = (req, res, story) => {
  console.log("showStory story:", story);
  res.render("story", {
    story,
    loggedIn: req.user ? true : false
  });
}

const notFound = (req, res, next) => {

  res.render("not-found", {
    loggedIn: req.user ? true : false
  });
}

const search = async (req, res) => {
    try {
        const results = await storyModel.getStoriesBySearchTerms(req.user ? req.user.user_id : null, req.query.query);
        res.render("search", {
            loggedIn: req.user ? true : false,
            searchResults: results
                            .filter(result => result.visibility_id === 1 || result.visibility_id === 3 && result.user_id)
                            .map(result => {
                                const formattedDate = result.creation_date.toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })
                                let wordParts = result.story_description.split(" ");
                                if (wordParts.length >= 10) {
                                    wordParts = wordParts.slice(0, 10);
                                    wordParts.push("...");
                                }
                                return {...result, creation_date: formattedDate, firstWords: wordParts.join(" ")}
                            })
        });
    } catch (error) {
        console.error(error.message);
        res.redirect("/");
    }
};

module.exports = {
    search,
    showStory,
    notFound
};