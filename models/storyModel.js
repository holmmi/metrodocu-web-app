'use strict';

const pool = require('../database/pool');
const promisePool = pool.promise();

const getStoryVisibilities = async () => {
    const [rows] = await promisePool.query("SELECT * FROM story_visibility ORDER BY visibility_id ASC");
    return rows;
};

const getAllStories = async () => {
    try {
        // TODO: do the LEFT (or INNER) JOIN to get owner name too.
        const [rows] = await promisePool.execute("SELECT s.story_id, story_name, story_description, cover_photo, creation_date, owner_id, COUNT(l.story_id) AS likecount FROM story AS s LEFT JOIN story_like AS l ON s.story_id = l.story_id GROUP BY s.story_id");
        return rows;
    } catch (e) {
        console.error('getStories:', e.message);
        throw new Error('getStories failed');
    }
};

const getStoryById = async storyId => {
    const [rows] = await promisePool.execute("SELECT s.story_id, story_name, story_description, cover_photo, creation_date, owner_id, COUNT(s.story_id) AS likecount FROM story AS s INNER JOIN story_like AS l ON s.story_id = l.story_id WHERE s.story_id = ?;", [storyId])
    return rows[0];
};

const addStory = async details => {
    const [result] = await promisePool.execute("INSERT INTO story (story_name, story_description, cover_photo, visibility_id, owner_id) VALUES (?, ?, ?, ?, ?)", details);
    return result.insertId;
};

const updateStory = async (id, req) => {
    try {
        const [rows] = await promisePool.execute('UPDATE story SET story_name = ?, story_description = ?, cover_photo = ?, visibility_id = ? WHERE story_id = ?;',
            [req.body.storyName, req.body.storyDesc, req.body.storyCover, req.body.storyVisibility, id]);
        console.log('storyModel update:', rows);
        return rows.affectedRows === 1;
    } catch (e) {
        console.error('updateStory:', e.message);
        throw new Error('updateStory failed');
    }
};

const deleteStory = async (id) => {
    try {
        console.log('storyModel deleteStory', id);
        const [rows] = await promisePool.execute('DELETE FROM story WHERE story_id = ?', [id]);
        return rows.affectedRows === 1;
    } catch (e) {
        console.error('deleteCat:', e.message);
        throw new Error('deleteCat failed');
    }
};

module.exports = {
    getStoryVisibilities,
    getAllStories,
    getStoryById,
    addStory,
    updateStory,
    deleteStory,
};