'use strict';
const storyModel = require('../models/storyModel');

const visibility = async (req, res) => {
    try {
        res.json(await storyModel.getStoryVisibilities());
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
};

module.exports = {
    visibility
};