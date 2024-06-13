const createError = require('http-errors');
const mongoose = require('mongoose');
const userModel = require('../models/userModel');

const findItemById = async (model, id, options) => {
    try {
        const model = await userModel.findById(id, options);
        if (!model)
            throw createError(
                404,
                `${model.modelName} does not match with this id`
            );

        return model;
    } catch (error) {
        if (error instanceof mongoose.Error) {
            throw createError(400, 'Invalid user');
        }
        throw error;
    }
};

module.exports = findItemById;
