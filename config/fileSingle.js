const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null,'./public/fileSingle');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const fileSingle = multer({storage:storage});

module.exports = fileSingle;
