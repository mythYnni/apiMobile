const multer = require("multer");
const Timekeeping = require("../Models/Timekeeping");
const currentDate = new Date();

const TimekeepingController = {
    //Upload File User
    upload: async (req, res, err) => {
        //  console.log(req.file);
        if (err instanceof multer.MulterError) {
            console.log(err);
            res.status(500);
        } else if (err) {
            res.status(200).json({ TimekeepingFile: req.get('host') + `/${req.file.filename}` });
        }
    },

    getTimekeeping: async (req, res, err) => {
        console.log(req.body);
        try {
            const { userId, month, timekeeping_Date } = req.body;
            const query1 = {
                userId: new RegExp('^' + userId),
                month: new RegExp('^' + month),
                timekeeping_Date: {
                    $exists: true,
                    $type: 'string'
                }
            };

            const obj_timekeeping = await Timekeeping.findOne(query1).sort({ timekeeping_Date: -1 });
            if(obj_timekeeping.total_Work <= 0){
                res.status(200).json({ message: 'Lấy Dữ Liệu Thành Công', obj_timekeeping });
            }else{
                const query = {
                    userId: new RegExp('^' + userId),
                    month: new RegExp('^' + month),
                    timekeeping_Date: new RegExp('^' + timekeeping_Date),
                };
                const obj_timekeeping = await Timekeeping.findOne(query);
                console.log(obj_timekeeping);
                res.status(200).json({ message: 'Lấy Dữ Liệu Thành Công', obj_timekeeping });
            }
            
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Lấy Dữ Liệu Thất Bại' });
        }
    },

    timekeeping_on: async (req, res, err) => {
        // console.log(req.body);
        try {
            const { userId, address, imageUser, timekeeping_Date, month, start_Time, end_Time, total_Work } = req.body;
            const monthNames = [
                'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
            ];
            const currentMonth = currentDate.getMonth();
            const query = {
                userId: new RegExp('^' + userId),
                address: { $ne: null },
                month: new RegExp('^' + monthNames[currentMonth]),
                timekeeping_Date: new RegExp('^' + timekeeping_Date),
            };
            const checkTime = await Timekeeping.findOne(query);

            if (checkTime == null) {
                const obj_timekeeping = await Timekeeping.create({ userId, address, imageUser, timekeeping_Date, month, start_Time, end_Time, total_Work });
                res.status(200).json({ message: 'Chấm Công Thành Công', obj_timekeeping });
                // console.log("moi");
            }
            res.status(400);
        } catch (err) {
            console.log(err);
            res.status(400);
        }
    },

    timekeeping_off: async (req, res, err) => {
        console.log(req.body);
        try {
            const { _id, userId, start_Time, address, imageUser, end_Time, total_Work } = req.body;
            const monthNames = [
                'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
            ];
            const currentMonth = currentDate.getMonth();
            const query = {
                _id: _id,
                userId: new RegExp('^' + userId),
                start_Time: new RegExp('^' + start_Time),
                month: new RegExp('^' + monthNames[currentMonth]),
            };

            const newValues = {
                $set: {
                    address: address,
                    imageUser: imageUser,
                    end_Time: end_Time,
                    total_Work: total_Work
                }
            };

            const check_out = await Timekeeping.findByIdAndUpdate(query, newValues, { new: true });

            if (!check_out) {
                console.log("Chấm Công Ra Thất Bại")
                return res.status(404);
            }
            res.status(200).json({ message: 'Chấm Công Thành Công', check_out });

        } catch (err) {
            console.log(err);
            res.status(400);
        }
    },

    getTimekeepingWhereDate: async (req, res, err) => {
        console.log(req.params.date);
        try {
            const timekeeping_Date = req.params.date;
            const query = {
                timekeeping_Date: new RegExp('^' + timekeeping_Date + '$', 'i'),
            };

            const obj_timekeeping = await Timekeeping.findOne(query);

            if (obj_timekeeping != null) {
                console.log(obj_timekeeping);
                res.status(200).json({ message: 'Bạn Đang Xem Chấm Công Ngày: ' + timekeeping_Date, obj_timekeeping });
            } else {
                console.log(obj_timekeeping);
                res.status(200).json({ message: 'Bạn Không Chấm Công Ngày: ' + timekeeping_Date, obj_timekeeping });
            }

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Lấy Dữ Liệu Thất Bại' });
        }
    },

    getAllWhere: async (req, res, err) => {
        console.log(req.params.id);
        try {
            const userId = req.params.id;
            const monthNames = [
                'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
            ];
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();

            const query = {
                userId: new RegExp('^' + userId),
                timekeeping_Date: { $regex: currentYear, $options: 'i' },
                month: new RegExp('^' + monthNames[currentMonth]),
            };

            const obj_timekeeping = await Timekeeping.find(query);
            let totalWork = 0;
            if (obj_timekeeping.length > 0) {
                console.log(obj_timekeeping);
                obj_timekeeping.forEach((timekeeping) => {
                    totalWork += timekeeping.total_Work;
                });
                // console.log(totalWork);
                res.status(200).json({total: totalWork});
            } else {
                // console.log(totalWork);
                res.status(200).json({total: totalWork});
            }

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Lấy Dữ Liệu Thất Bại' });
        }
    },

};

module.exports = TimekeepingController;