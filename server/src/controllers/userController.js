const userModel = require('../models/userModel');
const createError = require('http-errors');
const {successResponse} = require('./responseController');
const findItemById = require('../services/findItem');
const deleteImage = require('../helper/deleteImage');
const JSONWebToken = require('../helper/jsonwebtoken');
const fs = require('fs').promises;
const {JwtActivationKey, clientURL} = require('../secret');
const sendEmailActivationURL = require('../helper/email');
const jwt = require('jsonwebtoken');
const {create} = require('domain');

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
        deleteImage(userImagePath);

        await userModel.findByIdAndDelete({_id: id, isAdmin: false});

        if (user && user.image) {
            await deleteImage(user.image);
        }

        return successResponse(res, {
            message: 'user was deleted successful',
        });
    } catch (error) {
        next(error);
    }
};

const processRegister = async (req, res, next) => {
    try {
        const {name, email, password, phone, address} = req.body;

        const image = req.file;
        if (!image) {
            throw createError(400, 'image file is required');
        }

        //*create jwt token

        const tokenPayload = {
            name,
            email,
            password,
            phone,
            address,
        };

        if (image) {
            tokenPayload.image = image;
        }

        const token = JSONWebToken(tokenPayload, JwtActivationKey, '10m');

        //prepare email
        const prepareEmailData = {
            email: email,
            subject: 'Account Activation Email',
            html: `
            <h2>Hello ${name} !<h2/>
            <p>Please click here to <a href="${clientURL}/api/users/active/${token}" target="_blank">active your account<a/><p/>
            `,
        };

        try {
            //await sendEmailActivationURL(prepareEmailData);
        } catch (error) {
            next(createError(500, 'Failed to send verification email'));
            return;
        }

        const userExists = await userModel.exists({email: email});
        if (userExists) {
            throw createError(409, 'user with this email already exists');
        }

        return successResponse(res, {
            message: `please go to your email: ${email} for completing your verification`,
            payload: {token},
        });
    } catch (error) {
        next(error);
    }
};

const activateUserAccount = async (req, res, next) => {
    try {
        const token = req.body.token;
        if (!token) throw createError(404, 'token not found');

        try {
            const decoded = jwt.verify(token, JwtActivationKey);
            if (!decoded) {
                throw createError(401, 'user was not able to verified');
            }

            const userExists = await userModel.exists({email: decoded.email});
            if (userExists) {
                throw createError(409, 'user with this email already exists');
            }

            await userModel.create(decoded);

            return successResponse(res, {
                statusCode: 201,
                message: `user has verified successfully`,
            });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw createError(401, 'Token has expired');
            } else if (error.name === 'JsonWebTokenError') {
                throw createError(401, 'Invalid token');
            } else {
                throw error;
            }
        }
    } catch (error) {
        next(error);
    }
};

const updateUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const options = {password: 0};

        const user = await findItemById(user, userId, options);

        const updateOptions = {
            new: true,
            runValidators: true,
            context: 'query',
        };

        let updates = {};

        for (let key in req.body) {
            if (['name', 'password', 'phone', 'address'].includes(key)) {
                updates[key] = req.body[key];
            } else if (['email'].includes(key)) {
                throw new Error('Email cannot be updated');
            }
        }

        const image = req.file;
        if (image) {
            if (image.size > 2097152) {
                throw createError(
                    404,
                    'image file too large. It must be less than 2MB'
                );
            }
            updates.image = image;
            user.image !== 'default.png' && deleteImage(user.image);
        }

        const updatedUser = await userModel
            .findByIdAndUpdate(userId, updates, updateOptions)
            .select('-password');

        if (!updatedUser) {
            throw createError(404, 'user has not updated with this id');
        }

        return successResponse(res, {
            message: 'user was updated successfully',
            payload: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUser,
    getUserId,
    deleteUser,
    processRegister,
    activateUserAccount,
    updateUserById,
};
