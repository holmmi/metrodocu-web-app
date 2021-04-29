'use strict';
const commentModel = require('../models/commentModel');

const user = req.user ? true : false;
const userId = user ? req.user.user_id : false;

const getComment