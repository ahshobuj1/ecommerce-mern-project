const userModel = require('../models/userModel');
const createError = require('http-errors');
const {successResponse} = require('./responseController');
const findItemById = require('../services/findItem');
const fs = require('fs');

const getUser = async (req, res, next) => {
    try {
        const search = req.query.search || '';
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const searchRegularExp = new RegExp('.*' + search + '.*', 'i');

        const filter = {
            isAdmin: {
                $ne: true,
            },
            $or: [
                {name: {$regex: searchRegularExp}},
                {email: {$regex: searchRegularExp}},
                {phone: {$regex: searchRegularExp}},
            ],
        };

        const hidePassword = {password: 0};

        const users = await userModel
            .find(filter, hidePassword)
            .limit(limit)
            .skip((page - 1) * limit);

        const count = await userModel.find(filter).countDocuments();

        if (!users) throw createError(404, 'users not found');

        return successResponse(res, {
            message: 'users profile found',
            payload: {
                users,
                pagination: {
                    totalPage: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page - 1 > 0 ? page - 1 : null,
                    nextPage:
                        page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

const getUserId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = {password: 0};
        const user = await findItemById(userModel, id, options);

        return successResponse(res, {
            payload: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await findItemById(userModel, id);

        const userImagePath = user.image;
        fs.access(userImagePath, (err) => {
            if (err) {
                console.error('user image does not exist');
            } else {
                fs.unlink(userImagePath, (err) => {
                    if (err) {
                        throw err;
                        console.log('user image was deleted');
                    }
                });
            }
        });

        await userModel.findByIdAndDelete({_id: id, isAdmin: false});

        return successResponse(res, {
            message: 'user was deleted successful',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {getUser, getUserId, deleteUser};
