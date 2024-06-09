const mongoose = require('mongoose');
const {mongodbURL} = require('../secret');

const connectDatabase = async (option = {}) => {
    try {
        await mongoose.connect(mongodbURL, option);
        console.log('connection to DB is successfully established');

        mongoose.connection.on('error', (error) => {
            console.log('Database connection error', error);
        });
    } catch (error) {
        console.log('could not connect Database ', error.toString());
    }
};

module.exports = connectDatabase;
