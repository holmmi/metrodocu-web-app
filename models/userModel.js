'use strict';
const pool = require('../database/pool');
const promisePool = pool.promise();

const addUser = async details => {
    const [rows] = await promisePool.execute("INSERT INTO user (username, first_name, last_name, password) VALUES (?, ?, ?, ?)", details);
    return rows;
};

const getUserByUsername = async username => {
    const [rows] = await promisePool.execute("SELECT * FROM user WHERE username = ?", [username]);
    return rows[0];
}

const getUserById = async userId => {
    const [rows] = await promisePool.execute("SELECT * FROM user WHERE user_id = ?", [userId])
    return rows[0];
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