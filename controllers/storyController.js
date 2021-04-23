'use strict';
const storyModel = require('../models/storyModel');
const { makeCover } = require('../utils/resize');
const { v4 } = require('uuid');

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

const addStory = async (req, res) => {
    if (req.user) {
        try {
            console.log('storyController addStory', req.body);
            const {sname, sdescription, svisibility, files} = req.body;
            // Decode Base64 string back to binary format
            const buffer = Buffer.from(files[0].content, "base64");
            const fileName = v4();
            // Create a resized cover photo from an image data and save it
            makeCover(buffer, fileName);
            const insertId = await storyModel.addStory([sname, sdescription, fileName, svisibility, req.user.user_id]);
            res.json({storyId: insertId});
        } catch (e) {
            console.error(e.message);
            res.status(500).json({error: "Internal Server Error"});
        }
    } else {
        res.status(401).json({error: "Unauthorized"});
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
    updateStory,
    deleteStory,
    likeStory,
};