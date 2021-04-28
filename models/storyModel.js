'use strict';

const pool = require('../database/pool');
const promisePool = pool.promise();
const queries = require('../sql/queries.json');

const getStoryVisibilities = async () => {
    const [rows] = await promisePool.query("SELECT * FROM story_visibility ORDER BY visibility_id ASC");
    return rows;
};

const getStoryVisibility = async (userId, storyId) => {
    try {
        console.log('getStoryVisibility (userId, storyId):',userId, storyId);
        const [rows] = await promisePool.execute('SELECT a.visibility_id, a.owner_id, b.user_id FROM story a LEFT JOIN story_share b on b.user_id = ? WHERE a.story_id = ?;', [userId, storyId]);
        return rows[0];
    } catch (e) {
        console.log('getStoryVisibility: ', e.message);
        throw new Error('getStoryVisibility failed');
    }
};

const getStories = async (userId, visibilityId) => {
    if (!userId) { // When the user is not authenticated
        const [rows] = await promisePool.execute(queries.story.anonymous.publicStories);
        return {rows}.rows;
    } else {
        switch (visibilityId) {
            case 1: {
                const [rows] = await promisePool.execute(queries.story.authenticated.public, [userId]);
                return {rows}.rows;
            }
            case 2: {
                const [rows] = await promisePool.execute(queries.story.authenticated.private, [userId, userId]);
                return {rows}.rows;
            }
            case 3: {
                const [rows] = await promisePool.execute(queries.story.authenticated.shared, [userId, userId]);
                return {rows}.rows;
            }
        }
    }
};

const getStoriesBySearchTerms = async (userId, query) => {
    if (query !== '') {
        const storyQuery = `%${query}%`;
        const userQuery = `${query}%`;
        if (userId) {
            const [rows] = await promisePool.execute(queries.story.searchAuthenticated, [userId, storyQuery, userQuery]);
            return rows;
        } else {
            const [rows] = await promisePool.execute(queries.story.searchUnauthenticated, [storyQuery, userQuery]);
            return rows;
        }
    } else {
        return [];
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

const addLike = async (params) => {
    await promisePool.execute("INSERT INTO story_like (user_id, story_id) VALUES (?, ?)", params);
}

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
        console.error('deleteStory:', e.message);
        throw new Error('deleteStory failed');
    }
};

module.exports = {
    getStoryVisibility,
    getStoryVisibilities,
    getStories,
    getStoryById,
    getStoriesBySearchTerms,
    addStory,
    addLike,
    updateStory,
    deleteStory,
};