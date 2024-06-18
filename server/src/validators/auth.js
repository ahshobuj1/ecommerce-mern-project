const {body} = require('express-validator');

const validateUserRegistration = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('name is required !')
        .isLength({min: 4, max: 30})
        .withMessage('name should be at least 4 to 30 characters !'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('email is required !')
        .isEmail()
        .withMessage('Invalid email address !'),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('password is required !')
        .isLength({min: 8})
        /* .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$/
        )  */
        .withMessage('Password would be minimum eight characters !'),

    body('address')
        .trim()
        .notEmpty()
        .withMessage('address is required !')
        .isLength({min: 2})
        .withMessage('address should be at least 2 characters !'),

    body('phone')
        .trim()
        .notEmpty()
        .withMessage('phone is required !')
        .isLength({min: 10}),

    body('image').isString().optional('phone is required !'),
];

module.exports = validateUserRegistration;
