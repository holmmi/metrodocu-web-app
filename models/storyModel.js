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
        const [rows] = await promisePool.execute('SELECT a.visibility_id, a.owner_id, b.user_id FROM story a LEFT JOIN story_share b on b.user_id = ? WHERE a.story_id = ?', [userId, storyId]);
        return rows[0];
    } catch (e) {
        console.error('getStoryVisibility failed: ', e.message);
    }
};

const getStories = async (userId, visibilityId) => {
    if (!userId) { // When the user is not authenticated
        const [rows] = await promisePool.execute(queries.story.anonymous.public);
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
    const [rows] = await promisePool.execute(queries.story.storyDetails, [storyId]);
    return rows;
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
        return rows.affectedRows === 1;
    } catch (e) {
        console.error('updateStory:', e.message);
        throw new Error('updateStory failed');
    }
};

const deleteStory = async (id) => {
    try {
        const [rows] = await promisePool.execute('DELETE FROM story WHERE story_id = ?', [id]);
        return rows.affectedRows === 1;
    } catch (e) {
        console.error('deleteStory:', e.message);
        throw new Error('deleteStory failed');
    }
};

const addDocumentDetails = async (params) => {
    const [rows] = await promisePool.execute("INSERT INTO story_document (document_name, document_mime, document_location, story_id) VALUES (?, ?, ?, ?)", params);
    return rows.affectedRows === 1;
};

const getDocumentDetailsById = async (params) => {
    const [rows] = await promisePool.execute("SELECT document_name, document_location FROM story_document WHERE document_id = ?", params);
    return rows[0];
}

const getComments = async (params) => {
    const [rows] = await promisePool.execute("SELECT c.comment_id, c.comment, u.username, DATE_FORMAT(c.created_at, '%Y-%m-%d %I:%i %p') AS time FROM story_comment c JOIN user u ON u.user_id = c.user_id WHERE c.story_id = ?", params);
    return rows;
}

const addComment = async (params) => {
    const [result] = await promisePool.execute("INSERT INTO story_comment (user_id, story_id, comment) VALUES (?, ?, ?)", params);
    return result.insertId;
};

const deleteComment = async (params) => {
    return await promisePool.execute("DELETE FROM story_comment WHERE comment_id = ?", params);
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
    addDocumentDetails,
    getDocumentDetailsById,
    getComments,
    addComment,
    deleteComment
};