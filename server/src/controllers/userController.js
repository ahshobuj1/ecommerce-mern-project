const userModel = require('../models/userModel');
const createError = require('http-errors');
const {successResponse} = require('./responseController');
const findItemById = require('../services/findItem');
const deleteImage = require('../helper/deleteImage');
const JSONWebToken = require('../helper/jsonwebtoken');
const fs = require('fs').promises;
const {JwtActivationKey, clientURL} = require('../secret');
const sendEmailActivationURL = require('../helper/email');

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

        const token = JSONWebToken(
            {name, email, password, phone, address},
            JwtActivationKey,
            '30m'
        );

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
            await sendEmailActivationURL(prepareEmailData);
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

module.exports = {
    getUser,
    getUserId,
    deleteUser,
    processRegister,
};
