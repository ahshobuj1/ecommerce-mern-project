const express = require('express');
const userRouter = express.Router();
const getUser = require('../controllers/userController');

userRouter.get('/', getUser);

module.exports = userRouter;
