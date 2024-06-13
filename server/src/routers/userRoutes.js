const express = require('express');
const userRouter = express.Router();
const {
    getUser,
    getUserId,
    deleteUser,
} = require('../controllers/userController');

userRouter.get('/', getUser);
userRouter.get('/:id', getUserId);
userRouter.delete('/:id', deleteUser);

module.exports = userRouter;
