const express = require('express');
const userRouter = express.Router();
const {
    getUser,
    getUserId,
    deleteUser,
    processRegister,
    activateUserAccount,
} = require('../controllers/userController');
const upload = require('../middlewares/uploadFile');
const validateUserRegistration = require('../validators/auth');
const {runValidation} = require('../validators');

userRouter.get('/', getUser);
userRouter.get('/:id', getUserId);
userRouter.delete('/:id', deleteUser);
userRouter.post(
    '/register-process',
    upload.single('image'),
    validateUserRegistration,
    runValidation,
    processRegister
);
userRouter.post('/verify', activateUserAccount);

module.exports = userRouter;
