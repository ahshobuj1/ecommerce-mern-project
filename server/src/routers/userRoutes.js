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

userRouter.get('/', getUser);
userRouter.get('/:id', getUserId);
userRouter.delete('/:id', deleteUser);
userRouter.post('/register-process', upload.single('image'), processRegister);
userRouter.post('/verify', activateUserAccount);

module.exports = userRouter;
