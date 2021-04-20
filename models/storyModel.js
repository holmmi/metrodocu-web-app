'use strict';

const pool = require('../database/pool');
const promisePool = pool.promise();

const getStoryVisibilities = async () => {
    const [rows] = await promisePool.query("SELECT * FROM story_visibility ORDER BY visibility_id ASC");
    return rows;
};

module.exports = {
    getStoryVisibilities
};