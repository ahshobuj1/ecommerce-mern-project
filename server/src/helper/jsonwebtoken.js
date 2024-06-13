const jwt = require('jsonwebtoken');

const JSONWebToken = (payload, secretKey, expiresIn) => {
    if (typeof secretKey !== 'string' || payload === '') {
        throw new Error('secretKey must be a non-empty string');
    }
    try {
        const token = jwt.sign(payload, secretKey, {expiresIn});
        return token;
    } catch (error) {
        console.error('Failed to sign the JSONWebToken', error);
        throw error;
    }
};

module.exports = JSONWebToken;
