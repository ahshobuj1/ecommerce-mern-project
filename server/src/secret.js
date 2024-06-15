const serverPort = process.env.SERVER_PORT || 3001;
require('dotenv').config();

const mongodbURL =
    process.env.MONGODB_ATLAS_URL ||
    'mongodb://localhost:27017/ecommerceDatabase';

const defaultUserImage =
    process.env.DEFAULT_USER_IMAGE ||
    'server/public/images/users/default_user.png';

const JwtActivationKey = process.env.JWT_ACTIVATION_KEY || AGFHJFFDR;
const smtpUsername = process.env.SMTP_USERNAME || '';
const smtpPassword = process.env.SMTP_PASSWORD || '';
const clientURL = process.env.CLIENT_URL || '';
const diskDIRECTORY = process.env.DISK_DIRECTORY || 'public/images/users';

module.exports = {
    serverPort,
    mongodbURL,
    defaultUserImage,
    JwtActivationKey,
    smtpUsername,
    smtpPassword,
    clientURL,
    diskDIRECTORY,
};
