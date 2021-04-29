'use strict';

const pool = require('../database/pool');
const promisePool = pool.promise();

const addComment = async details => {
  try {
    const [rows] = await promisePool.execute("INSERT INTO story_comment (user_id, story_id, comment) VALUES (?, ?, ?)", details);
    console.log('commentModel insert:', rows);
    return rows.insertId;
  } catch (e) {
    console.error('addComment:', e.message);
    throw new Error('addComment failed');
  }
};

const getCommentsByStory = async storyId => {
  console.log('userModel getUser', storyId);
  const [rows] = await promisePool.execute('SELECT * FROM story_comment WHERE storyId = ?', [storyId]);
  return rows;
};

module.exports = {
  addComment,
  getCommentsByStory
};