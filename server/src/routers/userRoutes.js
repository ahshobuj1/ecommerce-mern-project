const express = require('express');
const userRouter = express.Router();
const {
    getUser,
    getUserId,
    deleteUser,
    processRegister,
    activateUserAccount,
} = require('../controllers/userController');

userRouter.get('/', getUser);
userRouter.get('/:id', getUserId);
userRouter.delete('/:id', deleteUser);
userRouter.post('/register-process', processRegister);
userRouter.post('/verify', activateUserAccount);

module.exports = userRouter;
