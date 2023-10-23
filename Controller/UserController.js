const multer = require("multer");
const User = require("../Models/User");

const UserController = {
     // Tạo Tài Khoản
     addUser: async (req, res, err) => {
          try {
               function generateRandomNumberString() {
                    let randomNumberString = '';
                    for (let i = 0; i < 8; i++) {
                         const randomNumber = Math.floor(Math.random() * 10);
                         randomNumberString += randomNumber;
                    }
                    return randomNumberString;
               }
               const { fullName, address, email, password, avatar, phone = "09" + generateRandomNumberString(), birthday } = req.body;

               const user = await User.create({ fullName, address, email, password, avatar, phone, birthday });
              
               res.status(200).json({ message: 'Đăng Ký Thành Công', user });

          } catch (err) {
               let msg;
               console.log(err);
               if (err.code === 11000) {
                    msg = "Người Dùng Đã Tồn Tại!";
               } else {
                    msg = err.message;
               }
               console.log(msg);
               res.status(400);
          }
     },

     // Đăng Nhập
     Login: async (req, res) => {
          try {
               const { email, password } = req.body;
               // console.log(req.body);
               const user = await User.findByCredentials(email, password);
               console.log("user" + user);
               res.status(200).json({ message: 'Đăng Nhập Thành Công', user });
          } catch (e) {
               console.log(e.message);
               res.status(400);
          }
     },

     // Cập Nhật Avatar
     UpdateAvatarById: async (req, res) => {
          // console.log(req.params.id);
          // console.log(req.body.uri);
          try {
               const id = req.params.id;
               const avatars = req.body.uri;

               const myQuery = { _id: id };
               const newValues = { $set: { avatar: avatars } };

               // Cập nhật avatar của người dùng với ID tương ứng
               const updatedUser = await User.findByIdAndUpdate(myQuery, newValues, { new: true });
               if (!updatedUser) {
                    return res.status(404).json({ message: 'Người dùng không tồn tại' });
               }
               console.log(updatedUser);
               res.status(200).json({ message: 'Cập nhật avatar thành công', user: updatedUser });
          } catch (error) {
               console.error(error.message);
               res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình cập nhật avatar' });
          }
     },

     //Cập Nhật User
     UpdateById: async (req, res) => {
          // console.log(req.params.id);
          // console.log(req.body);
          try {
               const id = req.params.id;
               const myQuery = { _id: id };
               const newValues = { $set: { fullName: req.body.fullName, email: req.body.email, phone: req.body.phone, address: req.body.address, birthday: req.body.birthday} };

               // Cập nhật avatar của người dùng với ID tương ứng
               const updatedUser = await User.findByIdAndUpdate(myQuery, newValues, { new: true });
               if (!updatedUser) {
                    return res.status(404).json({ message: 'Người dùng không tồn tại' });
               }
               // console.log(updatedUser);
               res.status(200).json({ message: 'Cập nhật Thông Tin thành công', user: updatedUser });
          } catch (error) {
               console.error(error.message);
               res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình cập nhật thông tin' });
          }
     },

     //Upload File User
     upload: async (req, res, err) => {
          console.log(req.file);
          if (err instanceof multer.MulterError) {
               console.log(err);
               res.status(500);
          } else if (err) {
               res.status(200).json({avatar: `/${req.file.filename}` });
          }
     },
};

module.exports = UserController;