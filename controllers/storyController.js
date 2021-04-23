'use strict';
const storyModel = require('../models/storyModel');
const {makeCover} = require('../utils/resize');
const {validationResult} = require('express-validator');

const visibility = async (req, res) => {
    try {
        res.json(await storyModel.getStoryVisibilities());
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
};

const getStories = async (req, res) => {
    const stories = await storyModel.getAllStories();
    res.json(stories);
};

const getStory = async (req, res, next) => {
    console.log('getStory: http get story with path param', req.params);
    const story = await storyModel.getStoryById(req.params.id);
    console.log("getStory story:", story);
    res.render("story", {
        story,
        loggedIn: req.user ? true : false
    });
};

const addStory = async (req, res, next) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    try {
        console.log('storyController addStory', req.body, req.file);
        const {storyName, storyDesc, storyCover, storyVisibility, storyOwner} = req.body;
        await storyModel.addStory([storyName, storyDesc, storyCover, storyVisibility, storyOwner]);
        next();
    } catch (e) {
        res.status(400).json({error: e.message});
    }
};

const make_cover = async (req, res, next) => {
    try {
        const cover = await makeCover(req.file.path, req.file.filename);
        if (cover) {
            next();
        }
    } catch (e) {
        res.status(400).json({error: e.message});
    }
};

const updateStory = async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const updateOk = await storyModel.updateStory(req.params.id, req);
    res.send(`updated... ${updateOk}`);
};

const deleteStory = async (req, res) => {
    const deleteOk = await storyModel.deleteStory(req.params.id);
    res.json(deleteOk);
};

const likeStory = async (req, res, next) => {
    if (req.user) {
        await storyModel.likeStory(req.body.storyId, req.user.user_id);
        next();
    } else {
        return res.status(401).json({error: "User not logged in"});
    }
}

module.exports = {
    visibility,
    getStories,
    getStory,
    addStory,
    make_cover,
    updateStory,
    deleteStory,
    likeStory,
};