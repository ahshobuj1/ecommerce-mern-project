const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');
const {defaultUserImage} = require('../secret');

const userSchema = new Schema(
    {
        name: {
            type: String,
            require: [true, 'missing username'],
            trim: true,
            minLength: [4, 'username can be minimum Length 4 characters'],
            maxLength: [30, 'username can be max Length 30 characters'],
        },
        email: {
            type: String,
            require: [true, 'missing email'],
            trim: true,
            lowercase: true,
            unique: [true, 'email already exists'],
            validate: {
                validator: function (v) {
                    return /^\w+([\*-]?\w+)*@\w+([\*-]?\w+)*(\.\w{2,3})+$/.test(
                        v
                    );
                },
            },
            message: 'Email validation failed',
        },
        password: {
            type: String,
            require: [true, 'missing password'],
            minLength: [6, 'password must be at least 4 characters'],
            set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
        },
        image: {
            type: String,
            default: defaultUserImage,
        },
        address: {
            type: String,
            require: [true, 'address required'],
        },
        phone: {
            type: String,
            require: [true, 'phone required'],
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
    },
    {timestamps: true}
);

const userModel = model('users', userSchema);

module.exports = userModel;
