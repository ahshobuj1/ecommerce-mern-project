const express = require('express');
const userRouter = express.Router();
const {getUser, getUserId} = require('../controllers/userController');

userRouter.get('/', getUser);
userRouter.get('/:id', getUserId);

module.exports = userRouter;
