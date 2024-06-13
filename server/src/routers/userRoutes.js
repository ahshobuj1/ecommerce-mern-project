const express = require('express');
const userRouter = express.Router();
const {
    getUser,
    getUserId,
    deleteUser,
    processRegister,
} = require('../controllers/userController');

userRouter.get('/', getUser);
userRouter.get('/:id', getUserId);
userRouter.delete('/:id', deleteUser);
userRouter.post('/register-process', processRegister);

module.exports = userRouter;
