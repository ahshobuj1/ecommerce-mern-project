const multer = require('multer');
const path = require('path');
const {
    DISK_DIRECTORY,
    ALLOWED_FILE_TYPES,
    MAX_FILE_SIZE,
} = require('../config');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DISK_DIRECTORY);
    },
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname);
        cb(
            null,
            Date.now() + '-' + file.originalname.replace(extname, '') + extname
        );
    },
});

const filterFile = (req, file, cb) => {
    const extname = path.extname(file.originalname);
    if (!ALLOWED_FILE_TYPES.includes(extname.substring(1))) {
        return cb(new Error('Only allowed file type : jpg-jpeg-png'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: {fileSize: MAX_FILE_SIZE},
    types: {fileType: ALLOWED_FILE_TYPES},
    filterFile,
});

module.exports = upload;
