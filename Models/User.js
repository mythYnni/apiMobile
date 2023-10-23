const mongoose = require('mongoose');
const { isEmail } = require('validator');
const currentDate = new Date();
const moment = require('moment-timezone');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
     fullName: {
          type: String,
          required: [true, "Trường Không Được Để Trống!"]
     },
     // Địa Chỉ
     zipcode: {
          type: String,
          required: [true, "Trường Không Được Để Trống!"],
     },
     // Địa Chỉ
     address: {
          type: String,
          required: [true, "Trường Không Được Để Trống!"],
          default: "Hai Phong"
     },
     email: {
          type: String,
          lowercase: true,
          unique: true,
          required: [true, "Trường Không Được Để Trống!"],
          index: true,
          validate: [isEmail, "Sai Định Dạng Email"]
     },
     password: {
          type: String,
          required: [true, "Trường Không Được Để Trống!"]
     },
     // Ảnh Đại Diện
     avatar: {
          type: String,
          required: [true, "Trường Không Được Để Trống!"]
     },
     // avatar web
     checkImage: {
          type: String,
     },
     // //phân quyền
     decentralization: {
          type: String,
          required: [true, "Trường Không Được Để Trống!"]
     },
     sex: {
          type: String,
          enum: ["0", "1"],
          required: [true, "Trường Không Được Để Trống!"],
     },
     phone: {
          type: String,
          unique: true,
          required: [true, "Trường Không Được Để Trống!"],

     },
     birthday: {
          type: String,
          required: [true, "Trường Không Được Để Trống!"],
     },
     manage: [
          {
               type: String,
          },
     ],
}, { versionKey: false });

//Mã Khóa Mật Khẩu
UserSchema.pre('save', function (next) {
     const user = this;
     if (!user.isModified('password')) return next();

     bcrypt.genSalt(10, function (err, salt) {
          if (err) return next(err);

          bcrypt.hash(user.password, salt, function (err, hash) {
               if (err) return next(err);
               user.password = hash
               next();
          })

     })
})

UserSchema.methods.toJSON = function () {
     const user = this;
     const userObject = user.toObject();
     delete userObject.password;
     return userObject;
}

UserSchema.statics.findByCredentials = async function (email, password) {
     const user = await User.findOne({ email });
     // console.log("findOne" + user);
     if (!user) throw new Error('Email Không Tồn Tại!');

     const isMatch = await bcrypt.compare(password, user.password);
     // console.log("passs :" + isMatch);
     if (!isMatch) throw new Error('Sai Mật Khẩu!')
     return user
}

const User = mongoose.model('User', UserSchema);
module.exports = User;