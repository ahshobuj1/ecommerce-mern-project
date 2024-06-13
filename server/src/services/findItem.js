const createError = require('http-errors');
const mongoose = require('mongoose');
const userModel = require('../models/userModel');

const findItemById = async (id, options) => {
    try {
        const item = await userModel.findById(id, options);
        if (!item) throw createError(404, 'item does not match with this id');

        return item;
    } catch (error) {
        if (error instanceof mongoose.Error) {
            throw createError(400, 'Invalid user');
        }
        throw error;
    }
};

module.exports = findItemById;
