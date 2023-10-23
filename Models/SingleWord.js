const mongoose = require('mongoose');
const currentDate = new Date();

// Định nghĩa Schema
const singleWordSchema = new mongoose.Schema({
    from: {
        type: Object,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    },
    fileWork: {
        type: String,
        required: false
    },
    typeOfstay: {
        type: String,
        required: false
    },
    dateOn: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: true
    },
    time: {
        type: String,
        default: currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds(),
    },
    dates: {
        type: String,
        required: true
    },
    dateOff: {
        type: String,
        required: false
    },
    to:  [{
        type: Object,
        required: true
    }],
    status: {
        type: String,
        default: "0"
    },
}, { versionKey: false });

// Tạo model từ Schema
const SingleWord = mongoose.model('SingleWord', singleWordSchema);

module.exports = SingleWord;