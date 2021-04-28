'use strict';

const storyModel = require('../models/storyModel');

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
    search
};