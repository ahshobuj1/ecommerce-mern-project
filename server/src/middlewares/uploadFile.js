const multer = require('multer');
const {diskDIRECTORY} = require('../secret');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, diskDIRECTORY);
    },
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname);
        cb(
            null,
            Date.now() + '-' + file.originalname.replace(extname, '') + extname
        );
    },
});

const upload = multer({storage: storage});

module.exports = upload;
