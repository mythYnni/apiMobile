const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const moment = require('moment-timezone');
const { FLOAT } = require('sequelize');
const currentDate = new Date();

const monthNames = [
     'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
     'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];
const currentMonth = currentDate.getMonth();

const TimekeepingSchema = new mongoose.Schema({
     userId:{
          type: String,
          required: [true, "Trường Không Được Để Trống!"]
     },
     // Địa Chỉ Chấm Công
     address: {
          type: String,
          required: [true, "Trường Không Được Để Trống!"]
     },
     // Ảnh Chấm Công
     imageUser: {
          type: String,
          required: [true, "Trường Không Được Để Trống!"]
     },

     // Ngày Chấm Công
     timekeeping_Date:{
          type: String,
          required: [true, "Trường Không Được Để Trống!"]
     },
     //tháng chấm công
     month :{
          type: String,
          default: monthNames[currentMonth],
     },
     // Chấm Công Vào
     start_Time: {
          type: String,
          default: currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds(),
     },
     // Chấm Công Ra
     end_Time: {
          type: String,
          default: 'null',
     }, 
     // Tổng Công Làm Trong Ngày
     total_Work:{
          type: Number,
          default: 0,
     },
     // status:{
     //      type: String,
     //      default: 'Không Tăng Ca!',
     // },
     // overtime: {
     //      type: String,
     //      default: currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds(),
     // },
     Timekeeping: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
     }
});

const Timekeeping = mongoose.model('Timekeeping', TimekeepingSchema);
module.exports = Timekeeping;