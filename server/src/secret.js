const serverPort = process.env.SERVER_PORT || 3001;
require('dotenv').config();

const mongodbURL =
    process.env.MONGODB_ATLAS_URL ||
    'mongodb://localhost:27017/ecommerceDatabase';

const defaultUserImage =
    process.env.DEFAULT_USER_IMAGE ||
    'server/public/images/users/default_user.png';

module.exports = {serverPort, mongodbURL, defaultUserImage};
