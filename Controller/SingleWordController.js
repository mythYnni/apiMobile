const SingleWord = require("../Models/SingleWord");
const User = require("../Models/User");
const fs = require('fs');
const express = require('express');

function SingleWordController(io) {
    return {
        //API Duyệt Đơn
        updateSingleWord: async (req, res) => {
            try {
                const singleWordId = req.params.id; 
                const updatedData = {status: "1"};
                
                // Find the SingleWord by ID and update it
                const updatedSingleWord = await SingleWord.findByIdAndUpdate(singleWordId, updatedData, { new: true });
        
                if (!updatedSingleWord) {
                    return res.status(404).json({ message: 'SingleWord not found' });
                }
        
                res.status(200).json({ message: 'Cập Nhật Thành Công', statusSingleWord: true, dataObj: updatedSingleWord});
            } catch (err) {
                res.status(500).json({ message: 'Server error' });
            }
        },

        // API lấy danh sách đơn từ
        getSingleWord: async (req, res) => {
            try {
                const singleWords = await SingleWord.find();
                res.json(singleWords);
            } catch (err) {
                res.status(500).json({ message: 'Server error' });
            }
        },

        addSingleWord: async (req, res, err) => {
            //console.log(req.body);
            try {
                const to = [];
                const { content, zipCode, typeOfstay, dateOn, dateOff } = req.body;
                const fromArray = JSON.parse(req.body.from);

                // Find users with the given zipcode
                const _user = await User.find({ zipcode: zipCode });
                const _getUsers = _user.map((user) => {
                    const { _id, zipcode, fullName, address, email, avatar, phone } = user;
                    return { _id, zipcode, fullName, address, email, avatar, phone };
                });
                const from = _getUsers;
                for (const item of fromArray) {
                    // Find users with the specified "from" zipcodes
                    const usersWithZipCode = await User.find({ zipcode: item });

                    // Extract relevant user information
                    const sanitizedUsers = usersWithZipCode.map((user) => {
                        const { _id, zipcode, fullName, address, email, avatar, phone } = user;
                        return { _id, zipcode, fullName, address, email, avatar, phone };
                    });
                    to.push(...sanitizedUsers);
                }

                const fileWorkPath = req.file;
                const fileWork = "/" + fileWorkPath.originalname;

                //console.log({ from, content, zipcode : zipCode, fileWork, to, typeOfstay, dateOn, dateOff });
                //Lấy Ngày Hiện Tại
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const day = String(currentDate.getDate()).padStart(2, '0');
                const formattedCurrentDate = `${year}-${month}-${day}`;

                //Xử lý và lưu đơn từ vào cơ sở dữ liệu
                const singleWord = await SingleWord.create({ from, content, zipcode : zipCode, fileWork, to, typeOfstay, dateOn, dateOff, dates: formattedCurrentDate});
                // // io.emit('newSingleWord', singleWord);
                res.status(200).json({ message: 'Tạo Đơn Thành Công', newWords: singleWord, statusSingleWord: true });
            } catch (err) {
                res.status(500).json({ message: 'Server error' });
            }
        },
    }
};

module.exports = SingleWordController;