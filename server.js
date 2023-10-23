const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv")
const socketIO = require('socket.io');
const server = require('http').createServer(app);
const PORT = 3000;
const SingleWord = require("./Models/SingleWord");
app.use(express.static('public'))
app.use(express.static('public/fileSingle'))

// Sử dụng bodyParser để xử lý dữ liệu từ FormData
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(bodyParser.json({ limit: "50mb" }));
// chấp nhận các yêu cầu từ các nguồn khác miền
//app.use(cors());
const corsOptions = {
     origin: 'https://localhost:44328',
     optionsSuccessStatus: 200,
     methods: ['GET', 'POST']
};
app.use(cors(corsOptions));
// ghi nhật ký hoạt động
app.use(morgan("common"));
//Kết Nối Cơ Sở Dữ Liệu
require('./connection');
//
app.use(express.json());

const io = socketIO(server, {
     cors: corsOptions,
});

const UserRouter = require("./Routers/UserRouter");
const TimekeepingRouter = require("./Routers/TimekeepingRouter");
const SingleWordRouter = require("./Routers/SingleWordRouter")(io);

//ROUTER
app.use("/api/", UserRouter);
app.use('/api/timekeeping/', TimekeepingRouter);
app.use('/api/singleWord/', SingleWordRouter);

const getSingleWordsByLatest = async (req, res) => {
     try {
          const singleWords = await SingleWord.find({ status: "0" }).sort({ time: -1, dateOn: -1 }); // Sắp xếp theo trường time và dateOn theo thứ tự giảm dần
          //console.log(singleWords);
          return singleWords;
     } catch (err) {
          console.error("Lỗi lấy danh sách đơn:", err);
          throw new Error("Lỗi lấy danh sách đơn");
     }
};

// Khi có kết nối mới từ client
io.on('connection', async (socket) => {
     console.log('Khách hàng mới được kết nối: ' + socket.id);
     try {
          // Gửi danh sách đơn từ tới client khi kết nối thành công
          const singleWords = await getSingleWordsByLatest();
          //console.log(singleWords);
          socket.emit('loadSingleWords', singleWords);
     } catch (err) {
          console.error("Lỗi gửi danh sách đơn:", err);
     }

     socket.on('newSingleWord', async function (data) {
          try {
               io.emit('loadSingleWords', await getSingleWordsByLatest());
          } catch (err) {
               console.error("Lỗi gửi danh sách đơn:", err);
          }
     });
});

server.listen(PORT, () => {
     console.log('RESTful API server started on:', PORT);
})
