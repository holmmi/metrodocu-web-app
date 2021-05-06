'use strict';

const pool = require('../database/pool');
const promisePool = pool.promise();

//const getComments async

const addComment = async (userId, storyId, comment) => {
  try {
    const [rows] = await promisePool.execute("INSERT INTO story_comment (user_id, story_id, comment) VALUES (?, ?, ?)", [userId, storyId, comment]);
    return rows.insertId;
  } catch (e) {
    console.error('addComment:', e.message);
    throw new Error('addComment failed');
  }
};

const getCommentsByStory = async storyId => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM story_comment WHERE storyId = ?', [storyId]);
    return rows;
  } catch (e) {
    console.error('addComment:', e.message);
    throw new Error('addComment failed');
  }
};

module.exports = {
  addComment,
  getCommentsByStory
};