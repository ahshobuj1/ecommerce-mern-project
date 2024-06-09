const userModel = require('../models/userModel');
const data = require('../data');

const seedUser = async (req, res, next) => {
    try {
        //deleting all existing users
        await userModel.deleteMany({});
        //creating new data
        const users = await userModel.insertMany(data.users);

        return res.status(201).json(users);
    } catch (error) {
        next(error);
    }
};

module.exports = {seedUser};
