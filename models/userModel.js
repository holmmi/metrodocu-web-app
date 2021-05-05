'use strict';

const pool = require('../database/pool');
const promisePool = pool.promise();
const GROUPS = require('../constants/groups');

const addUser = async details => {
    const [rows] = await promisePool.execute("INSERT INTO user (username, first_name, last_name, password) VALUES (?, ?, ?, ?)", details);
    await promisePool.execute("INSERT INTO user_group (user_id, group_id) VALUES (?, ?)", [rows.insertId, GROUPS.USER]);
    return rows;
};

const getUserByUsername = async username => {
    const [rows] = await promisePool.execute("SELECT user.*, user_group.group_id FROM user JOIN user_group ON user_group.user_id = user.user_id WHERE user.username = ?", [username]);
    return rows;
}

const getUserById = async userId => {
    const [rows] = await promisePool.execute("SELECT user.*, user_group.group_id FROM user JOIN user_group ON user_group.user_id = user.user_id WHERE user.user_id = ?", [userId])
    return rows;
}

const checkIfUserExists = async username => {
    const [rows] = await promisePool.execute("SELECT COUNT(*) AS users FROM user WHERE username = ?", [username]);
    return rows[0].users < 1;
}

module.exports = {
    addUser,
    getUserByUsername,
    getUserById,
    checkIfUserExists
}