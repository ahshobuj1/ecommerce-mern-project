const multer = require('multer');
const {ALLOWED_FILE_TYPES, MAX_FILE_SIZE} = require('../config');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(
            new Error('only image files are allowed: jpg/jpeg/png'),
            false
        );
    }

    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        return cb(new Error('only allowed file type: jpg/jpeg/png'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: {fileSize: MAX_FILE_SIZE},
    fileFilter: fileFilter,
});

module.exports = upload;
