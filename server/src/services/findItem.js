const createError = require('http-errors');
const mongoose = require('mongoose');
const userModel = require('../models/userModel');

const findItemById = async () => {
    try {
        const user = await userModel.findById(id, {password: 0});
        if (!user) throw createError(404, 'user does not match with this id');

        return user;
    } catch (error) {
        if (error instanceof mongoose.Error) {
            throw createError(400, 'Invalid user');
        }
        throw error;
    }
};

module.exports = findItemById;
