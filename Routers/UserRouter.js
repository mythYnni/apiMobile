const UserController = require("../Controller/UserController");
const uploadFile = require("../config/file");
const router = require('express').Router();

//ADD USER
router.post("/sigup",UserController.addUser);
router.post("/upload",uploadFile.single('uploaded_file'),UserController.upload);
router.post("/update-avatar/:id", UserController.UpdateAvatarById);
router.post("/update-user/:id", UserController.UpdateById);
router.post("/login", UserController.Login);
module.exports = router;

