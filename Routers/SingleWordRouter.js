
const router = require('express').Router();
const multer = require('multer');
const upload = multer();
const fileSingle = require("../config/fileSingle");

function SingleWordRouter(io){
    const SingleWordController = require("../Controller/SingleWordController")(io);
    router.get('/getSingleWord', SingleWordController.getSingleWord);
    router.post('/updateSingleWord/:id', SingleWordController.updateSingleWord);
    router.post('/addSingleWord', fileSingle.single('fileWork'), SingleWordController.addSingleWord);
    return router;
}
//ADD USER
module.exports = SingleWordRouter;

