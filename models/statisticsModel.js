'use strict';

const pool = require('../database/pool');
const promisePool = pool.promise();

const getUserLikes = async () => {
    const [rows] = await promisePool.execute("SELECT u.username AS username, COUNT(l.user_id) AS likes FROM user AS u RIGHT JOIN story_like AS l ON u.user_id = l.user_id GROUP BY u.user_id ORDER BY likes DESC LIMIT 10");
    return rows;
};

const getUserComments = async () => {
    const [rows] = await promisePool.execute("SELECT u.username AS username, COUNT(c.user_id) AS comments FROM user AS u RIGHT JOIN story_comment AS c ON u.user_id = c.user_id GROUP BY u.user_id ORDER BY comments DESC LIMIT 10");
    return rows;
};

const getStoryLikes = async (topCount) => {
    const [rows] = await promisePool.execute("SELECT s.*, COUNT(l.story_id) AS likes, (SELECT COUNT(*) FROM story_comment WHERE story_id = s.story_id) AS comments FROM story AS s RIGHT JOIN story_like AS l ON s.story_id = l.story_id WHERE s.visibility_id = 1 GROUP BY s.story_id ORDER BY s.story_id, likes  DESC LIMIT ?", [topCount]);
    return rows;
};

const getStoryComments = async () => {
    const [rows] = await promisePool.execute("SELECT s.story_id AS id, s.story_name AS name, COUNT(c.story_id) AS comments FROM story AS s RIGHT JOIN story_comment AS c ON s.story_id = c.story_id WHERE s.visibility_id = 1 GROUP BY s.story_id ORDER BY s.story_id, comments DESC LIMIT 10");
    return rows;
};

module.exports = {
    getUserLikes,
    getUserComments,
    getStoryLikes,
    getStoryComments
};