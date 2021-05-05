'use strict';
const statisticsModel = require('../models/statisticsModel');

const topLikers = async (req, res) => {
    try {
        const likes = await statisticsModel.getUserLikes();
        res.json(likes);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

const topCommenters = async (req, res) => {
    try {
        res.json(await statisticsModel.getUserComments());
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

const topLiked = async (req, res) => {
    try {
        const likes = await statisticsModel.getStoryLikes();
        res.json(likes);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

const topCommented = async (req, res) => {
    try {
        const comments = await statisticsModel.getStoryComments();
        res.json(comments);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

module.exports = {
    topLikers,
    topCommenters,
    topLiked,
    topCommented
};