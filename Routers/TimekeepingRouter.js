const TimekeepingController = require("../Controller/TimekeepingController");
const uploadFile = require("../config/file");
const router = require('express').Router();

router.post("/upload",uploadFile.single('uploaded_file'),TimekeepingController.upload);
router.post("/timekeepingOn",TimekeepingController.timekeeping_on);
router.post("/timekeepingOff",TimekeepingController.timekeeping_off);
router.post("/getTimekeeping",TimekeepingController.getTimekeeping);
router.get("/getTimekeepingWhere/:date",TimekeepingController.getTimekeepingWhereDate);
router.get("/getALLTimekeeping/:id",TimekeepingController.getAllWhere);

module.exports = router;

