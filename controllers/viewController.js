'use strict';

const storyModel = require('../models/storyModel');
const VISIBILITIES = require('../constants/visibilities');

const checkStoryAccessRights = async (req, res, next) => {
  const visibilityInformation = await storyModel.getStoryVisibility(req.user ? req.user.user_id : 0, req.params.id);
  res.locals.storyOwner = req.user ? req.user.user_id === visibilityInformation.owner_id : false
  if (visibilityInformation.visibility_id === VISIBILITIES.PUBLIC) {
    return next();
  }
  if (!req.user) {
    return res.status(401).render("not-found")
  }
  switch (visibilityInformation.visibility_id) {
    case VISIBILITIES.PRIVATE: {
      if (res.locals.storyOwner) {
        return next();
      }
      break;
    }
    case VISIBILITIES.SHARED: {
      if (req.user.user_id === visibilityInformation.user_id) {
        return next();
      }
      break;
    }
  }
  return res.status(401).render("not-found");
};

const showStory = async (req, res) => {
  const details = await storyModel.getStoryById(req.params.id);
  const images = details
                    .filter(detail => detail.document_mime ? detail.document_mime.startsWith("image") : false)
                    .map(detail => {
                      return {
                        storyId: detail.story_id,
                        documentId: detail.document_id, 
                        name: detail.document_name,
                        location: detail.document_location
                      };
                    });      
  const documents = details
                    .filter(detail => detail.document_mime ? !detail.document_mime.startsWith("image") : false)
                    .map(detail => {
                      return {
                        storyId: detail.story_id,
                        documentId: detail.document_id, 
                        name: detail.document_name,
                        location: detail.document_location
                      };
                    });
  const story = details[0];
  const formattedDate = story.creation_date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  res.render("story", {
    loggedIn: req.user ? true : false,
    owner: res.locals.storyOwner,
    story,
    formattedDate,
    images,
    documents
  });
};

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
    checkStoryAccessRights,
    search,
    showStory,
};